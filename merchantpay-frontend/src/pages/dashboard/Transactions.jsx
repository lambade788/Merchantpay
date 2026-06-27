import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactions, getPaymentLinks } from "../../api/paymentApi";
import { RefreshCw, Search, ExternalLink } from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [links, setLinks]               = useState([]);
  const [filter, setFilter]             = useState("ALL");
  const [search, setSearch]             = useState("");
  const [loading, setLoading]           = useState(true);
  const navigate                        = useNavigate();

  const upiCount   = transactions.filter(t => t.method === "UPI").length;
  const cardCount  = transactions.filter(t => t.method === "CARD").length;
  const otherCount = transactions.filter(t => !t.method).length;
  const total      = transactions.length || 1;
  const upiPercent   = ((upiCount  / total) * 100).toFixed(0);
  const cardPercent  = ((cardCount / total) * 100).toFixed(0);
  const otherPercent = ((otherCount/ total) * 100).toFixed(0);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const txnRes  = await getTransactions();
      const linkRes = await getPaymentLinks();
      setTransactions(txnRes  || []);
      setLinks(linkRes || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const pendingLinks = links
    .filter(l => l.status === "ACTIVE")
    .map(l => ({
      id: "link-" + l.id,
      linkId: l.linkId,
      amount: l.amount,
      status: "PENDING",
      paidAt: l.createdAt,
    }));

  const allData      = [...transactions, ...pendingLinks];
  const filteredData = allData.filter(item => {
    const matchesSearch = item.linkId?.toLowerCase().includes(search.toLowerCase());
    if (filter === "ALL") return matchesSearch;
    return item.status === filter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    if (status === "SUCCESS") return <span className="badge-success">SUCCESS</span>;
    if (status === "FAILED")  return <span className="badge-failed">FAILED</span>;
    return <span className="badge-pending">PENDING</span>;
  };

  const filterBtns = ["ALL", "SUCCESS", "PENDING", "FAILED"];

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-1">Transactions</h2>
          <p className="text-slate-400 text-sm">View and manage payments and active links</p>
        </div>
        <button onClick={fetchData} className="btn-secondary text-sm px-4 py-2.5 w-fit">
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Method stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "UPI Volume",  count: upiCount,   percent: upiPercent,   color: "indigo" },
          { label: "Card Volume", count: cardCount,  percent: cardPercent,  color: "violet" },
          { label: "Other",       count: otherCount, percent: otherPercent, color: "cyan"   },
        ].map(s => {
          const colors = {
            indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
            violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
            cyan:   "text-cyan-400   bg-cyan-500/10   border-cyan-500/20",
          };
          return (
            <div key={s.label} className={`card p-5 border ${colors[s.color].split(" ").slice(1).join(" ")}`}>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">{s.label}</p>
              <p className={`text-2xl font-black ${colors[s.color].split(" ")[0]}`}>
                {s.count} <span className="text-base font-medium opacity-50">({s.percent}%)</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Filters + Search */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {filterBtns.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wider transition-all border ${
                filter === type
                  ? "text-white border-indigo-500/50"
                  : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.07]"
              }`}
              style={filter === type ? { background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))" } : {}}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by Link ID..."
            className="input-premium pl-11"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr>
                <th>Transaction ID / Link</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date & Time</th>
                <th className="text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(5)].map((_, j) => (
                      <td key={j}><div className="skeleton h-4 w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Search size={40} className="mx-auto text-slate-700 mb-3" />
                    <p className="text-slate-500 font-medium">No transactions found</p>
                    <p className="text-slate-600 text-xs mt-1">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredData.map(item => (
                  <tr key={item.id}>
                    <td>
                      <span className="text-xs font-mono bg-white/[0.04] text-slate-400 px-2.5 py-1 rounded-lg border border-white/[0.06]">
                        {item.linkId}
                      </span>
                    </td>
                    <td className="font-bold text-white text-sm">₹{item.amount}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td className="text-xs text-slate-500 whitespace-nowrap">
                      {new Date(item.paidAt).toLocaleString()}
                    </td>
                    <td className="text-right pr-6">
                      {item.status === "PENDING" && (
                        <button
                          onClick={() => navigate(`/pay/${item.linkId}`)}
                          className="inline-flex items-center gap-1.5 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-400 border border-indigo-500/25 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all"
                        >
                          <ExternalLink size={12} /> Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
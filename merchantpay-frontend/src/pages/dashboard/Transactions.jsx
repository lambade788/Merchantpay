import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactions, getPaymentLinks } from "../../api/paymentApi";
import { RefreshCw, Search, Bell, Menu } from 'lucide-react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [links, setLinks] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // 📊 CALCULATE ANALYTICS
  const upiCount = transactions.filter(t => t.method === "UPI").length;
  const cardCount = transactions.filter(t => t.method === "CARD").length;
  const otherCount = transactions.filter(t => !t.method).length;
  const total = transactions.length || 1;

  const upiPercent = ((upiCount / total) * 100).toFixed(0);
  const cardPercent = ((cardCount / total) * 100).toFixed(0);
  const otherPercent = ((otherCount / total) * 100).toFixed(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const txnRes = await getTransactions();
      const linkRes = await getPaymentLinks();
      setTransactions(txnRes || []);
      setLinks(linkRes || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 🔥 Convert ACTIVE → PENDING
  const pendingLinks = links
    .filter((l) => l.status === "ACTIVE")
    .map((l) => ({
      id: "link-" + l.id,
      linkId: l.linkId,
      amount: l.amount,
      status: "PENDING",
      paidAt: l.createdAt,
    }));

  // 🔥 Merge both
  const allData = [...transactions, ...pendingLinks];

  // ✅ FILTER LOGIC
  const filteredData = allData.filter((item) => {
    const matchesSearch = item.linkId?.toLowerCase().includes(search.toLowerCase());
    if (filter === "ALL") return matchesSearch;
    return item.status === filter && matchesSearch;
  });

  // 🎨 UI HELPERS
  const getStatusStyle = (status) => {
    if (status === "SUCCESS") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (status === "FAILED") return "bg-red-500/10 text-red-400 border-red-500/20";
    return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
  };

  const getButtonStyle = (type) => {
    return filter === type
      ? "bg-emerald-500 text-white border-emerald-500"
      : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white";
  };

  return (
    <div className="min-h-screen bg-[#0a1120] text-slate-300 font-sans p-6">
      {/* PAGE TITLE & REFRESH */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Transactions</h2>
          <p className="text-slate-400">View and manage merged payments and active links</p>
        </div>
        <button 
          onClick={fetchData}
          className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-xl transition-all text-sm font-medium"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="space-y-4 mb-6">
        <div className="flex gap-2">
          {["ALL", "SUCCESS", "PENDING", "FAILED"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wider transition-all border ${getButtonStyle(type)}`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by Link ID..." 
            className="w-full bg-slate-800/30 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-slate-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* PAYMENT METHOD STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "UPI", count: upiCount, percent: upiPercent, color: "text-emerald-400" },
          { label: "Card", count: cardCount, percent: cardPercent, color: "text-blue-400" },
          { label: "Other", count: otherCount, percent: otherPercent, color: "text-purple-400" }
        ].map((stat) => (
          <div key={stat.label} className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label} Volume</p>
            <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.count} <span className="text-sm font-medium opacity-60">({stat.percent}%)</span></p>
          </div>
        ))}
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase tracking-widest text-slate-500 font-bold">
                <th className="px-6 py-5">Transaction ID / Link</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Date & Time</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-5">
                    <span className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-mono border border-slate-700">
                      {item.linkId}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-white tracking-tight">₹{item.amount}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500 font-medium whitespace-nowrap">
                    {new Date(item.paidAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-right">
                    {item.status === "PENDING" && (
                      <button
                        onClick={() => navigate(`/pay/${item.linkId}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-500/20"
                      >
                        Complete Payment
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
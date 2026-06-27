import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactions } from "../../api/paymentApi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  ListOrdered,
  TrendingUp,
  Zap,
  MoreVertical,
  RefreshCw,
} from "lucide-react";

export default function Overview() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getTransactions();
      setTransactions(res || []);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePaymentLink = () => navigate("payment-links");

  const totalRevenue  = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const total         = transactions.length;
  const success       = transactions.filter(t => t.status === "SUCCESS").length;
  const failed        = transactions.filter(t => t.status === "FAILED").length;
  const successRate   = total ? ((success / total) * 100).toFixed(1) : 0;

  const upi   = transactions.filter(t => t.method === "UPI").length;
  const card  = transactions.filter(t => t.method === "CARD").length;
  const other = transactions.filter(t => !t.method || (t.method !== "UPI" && t.method !== "CARD")).length;

  const chartData     = [
    { name: "UPI",   value: upi,   color: "#818cf8" },
    { name: "Card",  value: card,  color: "#a78bfa" },
    { name: "Other", value: other, color: "#22d3ee" },
  ];
  const backgroundData = [{ value: 1 }];

  const statCards = [
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      change: "+12.5%",
      positive: true,
      icon: TrendingUp,
      color: "indigo",
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      change: "+2.1%",
      positive: true,
      icon: ShieldCheck,
      color: "emerald",
    },
    {
      label: "Total Transactions",
      value: total,
      change: "+8.3%",
      positive: true,
      icon: ListOrdered,
      color: "violet",
    },
    {
      label: "Failed Payments",
      value: failed,
      change: "-15%",
      positive: true,
      icon: ArrowDownRight,
      color: "red",
    },
  ];

  const colorMap = {
    indigo:  { bg: "bg-indigo-500/10",  text: "text-indigo-400",  glow: "rgba(99,102,241,0.2)" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", glow: "rgba(16,185,129,0.2)" },
    violet:  { bg: "bg-violet-500/10",  text: "text-violet-400",  glow: "rgba(139,92,246,0.2)" },
    red:     { bg: "bg-red-500/10",     text: "text-red-400",     glow: "rgba(239,68,68,0.2)"  },
  };

  const getStatusBadge = (status) => {
    if (status === "SUCCESS") return <span className="badge-success">SUCCESS</span>;
    if (status === "FAILED")  return <span className="badge-failed">FAILED</span>;
    return <span className="badge-pending">PENDING</span>;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl p-7"
        style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.10))", border: "1px solid rgba(99,102,241,0.25)" }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.2), transparent)" }} />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Live Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white mb-1">Welcome back, Merchant! 👋</h1>
            <p className="text-slate-400 text-sm">Here's what's happening with your payments today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchData} className="btn-secondary text-sm px-4 py-2.5">
              <RefreshCw size={15} /> Refresh
            </button>
            <button onClick={handleCreatePaymentLink} className="btn-primary text-sm px-5 py-2.5">
              <Zap size={15} /> Create Link <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          const c    = colorMap[s.color];
          return (
            <div
              key={s.label}
              className="card p-6 animate-fadeUp"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="flex justify-between items-start mb-5">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{s.label}</span>
                <div className={`p-2 rounded-xl ${c.bg}`}>
                  <Icon size={16} className={c.text} />
                </div>
              </div>
              <h2 className="text-2xl font-black text-white mb-2">{s.value}</h2>
              <div className={`flex items-center gap-1 text-xs font-bold ${s.positive ? "text-emerald-400" : "text-red-400"}`}>
                {s.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {s.change} from last week
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Methods */}
      <div className="card p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-lg font-black text-white">Payment Methods</h2>
            <p className="text-slate-500 text-xs mt-0.5">Distribution across payment types</p>
          </div>
          <button className="btn-secondary text-xs px-4 py-2">View Details</button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-around gap-10">
          {/* Donut Chart */}
          <div className="relative w-56 h-56 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={backgroundData} cx="50%" cy="50%" innerRadius={70} outerRadius={85}
                  fill="rgba(255,255,255,0.04)" stroke="none" dataKey="value" isAnimationActive={false} />
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={85}
                  paddingAngle={total > 0 ? 5 : 0} dataKey="value" stroke="none"
                  cornerRadius={8} startAngle={90} endAngle={-270}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0d1424', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-white">{total.toLocaleString()}</span>
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Total</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3 w-full md:w-60">
            {chartData.map((item) => (
              <div key={item.name}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}60` }} />
                <div className="flex-1">
                  <span className="text-sm font-bold text-white">{item.name}</span>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {item.value} txns · {total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%
                  </div>
                </div>
                {/* mini progress bar */}
                <div className="w-20 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${total > 0 ? (item.value / total) * 100 : 0}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-white/[0.06] flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black text-white">Recent Transactions</h2>
            <p className="text-slate-500 text-xs mt-0.5">Latest payment activity</p>
          </div>
          <button onClick={() => navigate("transactions")} className="text-indigo-400 text-xs font-bold hover:text-indigo-300 transition-colors">
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th className="text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="skeleton h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <ListOrdered size={40} className="mx-auto text-slate-700 mb-3" />
                    <p className="text-slate-500 font-medium">No transactions yet</p>
                    <p className="text-slate-600 text-xs mt-1">Create a payment link to get started</p>
                  </td>
                </tr>
              ) : (
                transactions.slice(0, 5).map((t) => (
                  <tr key={t.id}>
                    <td>
                      <span className="text-xs font-mono bg-white/[0.04] text-slate-400 px-2.5 py-1 rounded-lg border border-white/[0.06]">
                        {t.linkId}
                      </span>
                    </td>
                    <td className="font-bold text-white text-sm">₹{t.amount?.toLocaleString()}</td>
                    <td>{getStatusBadge(t.status)}</td>
                    <td className="text-xs text-slate-500">{new Date(t.paidAt).toLocaleString()}</td>
                    <td className="text-right pr-6 text-slate-600 hover:text-slate-300 cursor-pointer">
                      <MoreVertical size={16} />
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
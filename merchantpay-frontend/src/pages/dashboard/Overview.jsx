import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactions } from "../../api/paymentApi";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  ListOrdered,
  TrendingUp,
  Zap,
  MoreVertical,
  RefreshCw,
  Calendar
} from "lucide-react";

export default function Overview() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("7D");
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

  // Generate mock trend data for the area chart
  const getTrendData = () => {
    let points = 7;
    if (timeFilter === "24H") points = 12; // 12 points for 24h
    if (timeFilter === "30D") points = 15; // 15 points for 30d
    if (timeFilter === "YTD") points = 12; // 12 months

    const data = [];
    let currentVal = totalRevenue > 0 ? totalRevenue / points : 5000;
    
    // seeded random to keep chart slightly stable
    const pseudoRandom = (seed) => {
      let x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    for (let i = points; i >= 0; i--) {
      const noise = (pseudoRandom(i + points) - 0.4) * 0.5 * currentVal; 
      currentVal = Math.max(100, currentVal + noise);
      
      let label = "";
      if (timeFilter === "24H") label = `${i*2}h ago`;
      else if (timeFilter === "7D" || timeFilter === "30D") label = i === 0 ? "Today" : `Day -${i}`;
      else label = `M-${i}`;

      data.push({ name: label, revenue: Math.round(currentVal) });
    }
    return data;
  };
  const trendData = getTrendData();

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      
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

      {/* Advanced Revenue Trend (NEW) */}
      <div className="card p-6 md:p-8 animate-fadeUp delay-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl font-black text-white">Revenue Trend</h2>
            <p className="text-slate-500 text-xs mt-1">Growth analysis over time</p>
          </div>
          
          <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/[0.06]">
            {["24H", "7D", "30D", "YTD"].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeFilter === filter 
                    ? "bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748b" }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={(val) => `₹${val}`} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0d1424', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', color: '#fff', fontSize: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }} 
                itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                formatter={(value) => [`₹${value}`, "Revenue"]}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#818cf8" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                activeDot={{ r: 6, fill: "#818cf8", stroke: "#0d1424", strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lower Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeUp delay-300">
        {/* Payment Methods */}
        <div className="card p-6 lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-black text-white">Payment Methods</h2>
              <p className="text-slate-500 text-xs mt-0.5">Distribution</p>
            </div>
            <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
              <MoreVertical size={16} />
            </button>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="relative w-48 h-48 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={backgroundData} cx="50%" cy="50%" innerRadius={60} outerRadius={75}
                    fill="rgba(255,255,255,0.04)" stroke="none" dataKey="value" isAnimationActive={false} />
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={75}
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
                <span className="text-2xl font-black text-white">{total.toLocaleString()}</span>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Total</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              {chartData.map((item) => (
                <div key={item.name}
                  className="flex items-center gap-4 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}60` }} />
                  <div className="flex-1">
                    <span className="text-sm font-bold text-white">{item.name}</span>
                  </div>
                  <div className="text-xs font-medium text-slate-400">
                    {total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card overflow-hidden lg:col-span-2 flex flex-col">
          <div className="p-6 border-b border-white/[0.06] flex justify-between items-center">
            <div>
              <h2 className="text-lg font-black text-white">Recent Transactions</h2>
              <p className="text-slate-500 text-xs mt-0.5">Latest payment activity</p>
            </div>
            <button onClick={() => navigate("transactions")} className="text-indigo-400 text-xs font-bold hover:text-indigo-300 transition-colors">
              View All →
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="table-premium h-full w-full">
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
                      <td className="text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-slate-600" />
                          {new Date(t.paidAt).toLocaleString()}
                        </div>
                      </td>
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
    </div>
  );
}
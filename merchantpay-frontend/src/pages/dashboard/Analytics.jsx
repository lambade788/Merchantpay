import { useEffect, useState } from "react";
import { getTransactions } from "../../api/paymentApi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { BarChart3, TrendingUp, ShieldCheck, CreditCard } from "lucide-react";

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getTransactions();
      setTransactions(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const upiCount   = transactions.filter(t => t.method === "UPI").length;
  const cardCount  = transactions.filter(t => t.method === "CARD").length;
  const otherCount = transactions.filter(t => !t.method || (t.method !== "UPI" && t.method !== "CARD")).length;
  const total      = transactions.length;
  const successCount = transactions.filter(t => t.status === "SUCCESS").length;
  const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const successRate  = total ? ((successCount / total) * 100).toFixed(1) : 0;

  const chartData     = [
    { name: "UPI",   value: upiCount,   color: "#818cf8" },
    { name: "Card",  value: cardCount,  color: "#a78bfa" },
    { name: "Other", value: otherCount, color: "#22d3ee" },
  ];
  const backgroundData = [{ value: 1 }];

  const summaryTiles = [
    { label: "Total Volume",   value: total,         color: "slate",   icon: BarChart3 },
    { label: "UPI Payments",   value: upiCount,      color: "indigo",  icon: TrendingUp },
    { label: "Card Payments",  value: cardCount,     color: "violet",  icon: CreditCard },
    { label: "Other Methods",  value: otherCount,    color: "cyan",    icon: ShieldCheck },
    { label: "Success Rate",   value: `${successRate}%`, color: "emerald", icon: ShieldCheck },
    { label: "Total Revenue",  value: `₹${totalRevenue.toLocaleString()}`, color: "gold", icon: TrendingUp },
  ];

  const tileColorMap = {
    slate:   { bg: "bg-white/[0.04]",    text: "text-slate-200",  icon: "text-slate-400",  border: "border-white/[0.06]" },
    indigo:  { bg: "bg-indigo-500/10",   text: "text-indigo-300", icon: "text-indigo-400", border: "border-indigo-500/20" },
    violet:  { bg: "bg-violet-500/10",   text: "text-violet-300", icon: "text-violet-400", border: "border-violet-500/20" },
    cyan:    { bg: "bg-cyan-500/10",     text: "text-cyan-300",   icon: "text-cyan-400",   border: "border-cyan-500/20" },
    emerald: { bg: "bg-emerald-500/10",  text: "text-emerald-300",icon: "text-emerald-400",border: "border-emerald-500/20" },
    gold:    { bg: "bg-amber-500/10",    text: "text-amber-300",  icon: "text-amber-400",  border: "border-amber-500/20" },
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white mb-1">Analytics Dashboard</h1>
        <p className="text-slate-400 text-sm">Insights into your payment performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Donut Chart */}
        <div className="card p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-lg font-black text-white">Payment Methods</h2>
              <p className="text-slate-500 text-xs mt-0.5">Breakdown by method type</p>
            </div>
            <button className="btn-secondary text-xs px-4 py-2">View Details</button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-around gap-8">
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
                  <Tooltip cursor={false} contentStyle={{ backgroundColor: '#0d1424', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-white">{total.toLocaleString()}</span>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Total</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-52">
              {chartData.map(item => (
                <div key={item.name} className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}60` }} />
                  <div className="flex-1">
                    <span className="text-sm font-bold text-white">{item.name}</span>
                    <div className="text-xs text-slate-500">{item.value} txns · {total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Tiles */}
        <div className="card p-8">
          <h2 className="text-lg font-black text-white mb-6">Quick Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            {summaryTiles.map((tile, i) => {
              const c    = tileColorMap[tile.color];
              const Icon = tile.icon;
              return (
                <div key={tile.label}
                  className={`p-5 rounded-xl border ${c.bg} ${c.border} transition-all hover:scale-[1.02] duration-200 animate-fadeUp`}
                  style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon size={14} className={c.icon} />
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{tile.label}</p>
                  </div>
                  <p className={`text-2xl font-black ${c.text}`}>{tile.value}</p>
                </div>
              );
            })}
          </div>
          <p className="text-slate-600 text-[10px] mt-6 uppercase font-bold tracking-widest text-center">
            Live Sync · MerchantPay Microservices
          </p>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { getTransactions } from "../../api/paymentApi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  ListOrdered, 
  MoreVertical 
} from "lucide-react";

export default function Overview() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res || []);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  // --- NAVIGATION LOGIC ---
  const handleCreatePaymentLink = () => {
    navigate("payment-links"); 
  };

  // 💰 DATA CALCULATIONS
  const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const total = transactions.length;
  const success = transactions.filter(t => t.status === "SUCCESS").length;
  const failed = transactions.filter(t => t.status === "FAILED").length;
  const successRate = total ? ((success / total) * 100).toFixed(1) : 0;

  // 💳 PAYMENT METHOD LOGIC (Synced from Analytics)
  const upi = transactions.filter(t => t.method === "UPI").length;
  const card = transactions.filter(t => t.method === "CARD").length;
  const other = transactions.filter(t => !t.method || (t.method !== "UPI" && t.method !== "CARD")).length;

  const chartData = [
    { name: "UPI", value: upi, color: "#10b981" },
    { name: "Card", value: card, color: "#3b82f6" },
    { name: "Other", value: other, color: "#a855f7" },
  ];

  const backgroundData = [{ value: 1 }];

  return (
    <div className="p-2 rounded-2xl  border-slate-800 shadow-xl bg-[#0a1120] min-h-screen text-slate-300 space-y-8 font-sans">
      
      {/* 👋 WELCOME BANNER */}
      <div className="bg-[#0f172a] p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Merchant! 👋</h1>
          <p className="text-slate-400 mb-6">Here's what's happening with your payments today.</p>
          <button 
            onClick={handleCreatePaymentLink}
            className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            Create Payment Link <ArrowUpRight size={20} />
          </button>
        </div>
      </div>

      {/* 🔥 STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-lg transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Revenue</span>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><ArrowUpRight size={18} /></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">₹{totalRevenue.toLocaleString()}</h2>
          <p className="text-emerald-400 text-xs font-medium">+12.5% from last week</p>
        </div>

        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-lg transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Success Rate</span>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><ShieldCheck size={18} /></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{successRate}%</h2>
          <p className="text-blue-400 text-xs font-medium">+2.1% from last week</p>
        </div>

        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-lg transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Transactions</span>
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><ListOrdered size={18} /></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{total}</h2>
          <p className="text-purple-400 text-xs font-medium">+8.3% from last week</p>
        </div>

        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-lg transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Failed Payments</span>
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400"><ArrowDownRight size={18} /></div>
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">{failed}</h2>
          <p className="text-emerald-400 text-xs font-medium">-15% from last week</p>
        </div>
      </div>

      {/* 📊 UPDATED ANALYTICS PAYMENT METHODS */}
      <div className="bg-[#0f172a] p-8 rounded-2xl border border-slate-800 shadow-xl max-w-8xl">
        <div className="flex justify-between items-center mb-10 ">
          <h2 className="text-xl font-bold text-white tracking-tight">Payment Methods</h2>
          <button className="text-slate-500 hover:text-emerald-400 text-sm transition-colors font-medium">
            View Details
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-around gap-12">
          {/* Chart Section */}
          <div className="relative w-64 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {/* Background Track */}
                <Pie
                  data={backgroundData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={90}
                  fill="#1e293b"
                  stroke="none"
                  dataKey="value"
                  isAnimationActive={false}
                />
                
                {/* Actual Data Pie */}
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={90}
                  paddingAngle={total > 0 ? 5 : 0}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10} 
                  startAngle={90}
                  endAngle={-270}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-bold text-white tracking-tight">{total.toLocaleString()}</span>
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Total</span>
            </div>
          </div>

          {/* Detailed Legend Section */}
          <div className="flex flex-col gap-4 w-full md:w-64">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-4 bg-slate-800/20 p-4 rounded-2xl border border-slate-700/50 hover:bg-slate-800/40 transition-all">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 12px ${item.color}40` }} />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">{item.name}</span>
                  <span className="text-xs text-slate-500 font-medium">
                    {item.value} txns • {total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 📄 RECENT TRANSACTIONS */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/10">
          <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
          <button className="text-emerald-400 text-sm font-semibold hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-widest text-slate-500 font-bold border-b border-slate-800/50">
                <th className="px-6 py-5">Transaction ID</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5 text-right pr-10">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {transactions.slice(0, 5).map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">
                      {t.linkId}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white text-sm">₹{t.amount?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                      t.status === "SUCCESS" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      t.status === "FAILED" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(t.paidAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right pr-10 text-slate-600 group-hover:text-slate-300">
                    <MoreVertical size={18} className="cursor-pointer" />
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
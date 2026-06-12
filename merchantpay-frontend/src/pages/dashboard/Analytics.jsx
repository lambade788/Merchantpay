import { useEffect, useState } from "react";
import { getTransactions } from "../../api/paymentApi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getTransactions();
      setTransactions(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    }
  };

  // 📊 CALCULATE DATA
  const upiCount = transactions.filter(t => t.method === "UPI").length;
  const cardCount = transactions.filter(t => t.method === "CARD").length;
  const otherCount = transactions.filter(t => !t.method || (t.method !== "UPI" && t.method !== "CARD")).length;
  const total = transactions.length;

  const data = [
    { name: "UPI", value: upiCount, color: "#10b981" },   // Green
    { name: "Card", value: cardCount, color: "#3b82f6" },  // Blue
    { name: "Other", value: otherCount, color: "#a855f7" }, // Purple
  ];

  // This ensures the background track is always a full circle
  const backgroundData = [{ value: 1 }];

  return (
    <div className="p-8 bg-[#020617] min-h-screen text-white font-sans">
      <h1 className="text-3xl font-bold mb-8 text-slate-100">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 📊 SYNCED DONUT CHART CARD */}
        <div className="bg-[#0f172a] p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-semibold tracking-tight">Payment Methods</h2>
            <button className="text-slate-400 hover:text-emerald-400 text-sm transition-colors font-medium">
              View Details
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-around gap-8">
            {/* Chart Section */}
            <div className="relative w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  {/* Background Track - Gives the "empty rail" look */}
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
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={90}
                    paddingAngle={total > 0 ? 5 : 0} // Space between pills
                    dataKey="value"
                    stroke="none"
                    cornerRadius={10} // Rounded caps
                    startAngle={90}
                    endAngle={-270}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    cursor={false}
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center Text Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-bold tracking-tight">{total.toLocaleString()}</span>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">Total</span>
              </div>
            </div>

            {/* Custom Legend Section */}
            <div className="flex flex-col gap-3 w-full md:w-56">
              {data.map((item) => (
                <div key={item.name} className="flex items-center gap-4 bg-slate-800/30 p-3 rounded-xl border border-slate-700/50 hover:bg-slate-800/60 transition-all">
                  <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: item.color }} />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-100">{item.name}</span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {item.value} txns • {total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 💰 SUMMARY TOTALS CARD */}
        <div className="bg-[#0f172a] p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col">
          <h2 className="text-xl font-semibold mb-8 tracking-tight">Quick Summary</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-grow">
            <SummaryTile label="Total Volume" value={total} color="slate" />
            <SummaryTile label="UPI Success" value={upiCount} color="emerald" />
            <SummaryTile label="Card Payments" value={cardCount} color="blue" />
            <SummaryTile label="Other Methods" value={otherCount} color="purple" />
          </div>
          
          <p className="text-slate-600 text-[10px] mt-8 uppercase font-bold tracking-widest text-center">
            Live sync: ZenithPay Microservices
          </p>
        </div>

      </div>
    </div>
  );
}

// Small helper component for the summary grid
function SummaryTile({ label, value, color }) {
  const colors = {
    slate: "bg-slate-500/10 border-slate-700 text-slate-100",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    purple: "bg-purple-500/10 border-purple-500/20 text-purple-400"
  };

  return (
    <div className={`p-6 rounded-2xl border ${colors[color]} transition-transform hover:scale-[1.02]`}>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-black">{value.toLocaleString()}</p>
    </div>
  );
}
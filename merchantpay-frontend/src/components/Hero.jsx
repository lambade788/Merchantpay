import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Zap, ShieldCheck, BarChart3 } from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-gradient-landing flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
      
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)" }} />
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full animate-float"
          style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.10) 0%, transparent 70%)", animationDelay: "2s" }} />
        <div className="absolute bottom-0 -left-32 w-[500px] h-[500px] rounded-full animate-float"
          style={{ background: "radial-gradient(ellipse, rgba(34,211,238,0.07) 0%, transparent 70%)" }} />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#818cf8 1px, transparent 1px), linear-gradient(to right, #818cf8 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* Badge */}
      <div className="relative animate-fadeUp delay-100">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Trusted by 10,000+ merchants worldwide
        </div>
      </div>

      {/* Headline */}
      <div className="relative text-center max-w-4xl animate-fadeUp delay-200">
        <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-6 tracking-tight">
          Accept Payments{" "}
          <span className="block text-gradient mt-2">Without Limits</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Create payment links, scan-to-pay QR codes, and manage everything from one{" "}
          <span className="text-slate-300 font-medium">powerful dashboard</span> — built for modern merchants.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-fadeUp delay-300">
          <Link
            to="/register"
            className="btn-primary text-base px-8 py-4 shadow-glow-indigo"
          >
            Start for Free
            <ArrowRight size={18} />
          </Link>
          <button
            onClick={() => {
              localStorage.setItem('isDemoMode', 'true');
              navigate('/dashboard');
            }}
            className="btn-secondary text-base px-8 py-4"
          >
            View Live Demo
          </button>
        </div>

        {/* Social proof stats */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-fadeUp delay-400">
          {[
            { value: "₹2.4Cr+", label: "Processed Monthly" },
            { value: "99.9%", label: "Uptime SLA" },
            { value: "<0.3s", label: "Avg. Response Time" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-slate-500 text-xs font-medium mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero card / dashboard preview */}
      <div className="relative mt-20 w-full max-w-3xl animate-fadeUp delay-500">
        <div className="glass gradient-border rounded-2xl overflow-hidden shadow-glass p-6">
          {/* Mini dashboard mockup */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            <div className="ml-4 flex-1 h-6 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
              <span className="text-[10px] text-slate-500 font-mono">dashboard.merchantpay.app</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "Total Revenue", value: "₹8,24,500", icon: <BarChart3 size={14} />, color: "indigo" },
              { label: "Success Rate", value: "98.3%", icon: <ShieldCheck size={14} />, color: "emerald" },
              { label: "Active Links", value: "142", icon: <Zap size={14} />, color: "violet" },
            ].map((card) => (
              <div key={card.label}
                className="card-flat p-3.5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-semibold mb-2 uppercase tracking-widest">
                  <span className={`${card.color === "indigo" ? "text-indigo-400" : card.color === "emerald" ? "text-emerald-400" : "text-violet-400"}`}>
                    {card.icon}
                  </span>
                  {card.label}
                </div>
                <p className="text-white font-black text-lg leading-none">{card.value}</p>
              </div>
            ))}
          </div>
          {/* Mini bar chart */}
          <div className="flex items-end gap-1.5 h-16 px-1">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm transition-all"
                style={{
                  height: `${h}%`,
                  background: i === 11
                    ? "linear-gradient(to top, #6366f1, #8b5cf6)"
                    : "rgba(99,102,241,0.25)",
                  opacity: 0.4 + (i / 11) * 0.6,
                }}
              />
            ))}
          </div>
        </div>
        {/* Glow underneath the card */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-24 blur-3xl rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.25), transparent)" }} />
      </div>
    </section>
  );
}
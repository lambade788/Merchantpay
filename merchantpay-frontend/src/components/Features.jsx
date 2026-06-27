import { ShieldCheck, Link as LinkIcon, BarChart3, Zap, Globe, Clock } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    color: "indigo",
    title: "Bank-Grade Security",
    description: "PCI DSS compliant infrastructure with end-to-end encryption. Your customers' data is always protected.",
    badge: "SOC 2 Certified",
  },
  {
    icon: LinkIcon,
    color: "violet",
    title: "Payment Links & QR",
    description: "Generate instant payment links and QR codes in one click. Share anywhere — SMS, WhatsApp, email.",
    badge: "No-code",
  },
  {
    icon: BarChart3,
    color: "cyan",
    title: "Real-Time Analytics",
    description: "Track every rupee in real time. Beautiful dashboards with charts, trends, and exportable reports.",
    badge: "Live Data",
  },
  {
    icon: Zap,
    color: "emerald",
    title: "Instant Settlements",
    description: "Money in your account the same day. T+0 settlement for eligible merchants, no holds, no delays.",
    badge: "T+0",
  },
  {
    icon: Globe,
    color: "blue",
    title: "Multi-Method Payments",
    description: "Accept UPI, cards, net banking, and wallets — all from one unified integration.",
    badge: "15+ Methods",
  },
  {
    icon: Clock,
    color: "rose",
    title: "99.9% Uptime",
    description: "Mission-critical infrastructure with redundant failover, real-time monitoring, and zero-downtime deployments.",
    badge: "Enterprise SLA",
  },
];

const colorMap = {
  indigo:  { bg: "bg-indigo-500/10",  text: "text-indigo-400",  border: "border-indigo-500/20",  badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
  violet:  { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/20",  badge: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  cyan:    { bg: "bg-cyan-500/10",    text: "text-cyan-400",    border: "border-cyan-500/20",    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  blue:    { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20",    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  rose:    { bg: "bg-rose-500/10",    text: "text-rose-400",    border: "border-rose-500/20",    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
};

export default function Features() {
  return (
    <section id="features" className="relative py-28 px-6 overflow-hidden">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(ellipse, #6366f1, transparent)" }} />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-20 animate-fadeUp">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold mb-6">
            <Zap size={11} className="text-violet-400" />
            Why Merchants Choose Us
          </div>
          <h2 className="font-bold text-4xl md:text-5xl text-white mb-5 tracking-tight">
            Everything you need to{" "}
            <span className="text-gradient">accept payments</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
            Powerful, developer-friendly features designed to help you grow and manage payments effortlessly.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            const c = colorMap[f.color];
            return (
              <div
                key={f.title}
                className="card p-7 group cursor-default animate-fadeUp"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Icon + badge */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center`}>
                    <Icon size={22} className={c.text} />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${c.badge}`}>
                    {f.badge}
                  </span>
                </div>

                <h3 className="font-bold text-xl text-white mb-3 group-hover:text-gradient transition-all">
                  {f.title}
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm">{f.description}</p>

                {/* Bottom accent line */}
                <div className={`mt-6 h-px w-0 group-hover:w-full transition-all duration-500 ${c.bg} opacity-60`}
                  style={{ background: `linear-gradient(90deg, ${f.color === "indigo" ? "#6366f1" : f.color === "violet" ? "#8b5cf6" : f.color === "cyan" ? "#22d3ee" : f.color === "emerald" ? "#10b981" : f.color === "blue" ? "#3b82f6" : "#f43f5e"}, transparent)` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "₹0",
    period: "/month",
    tagline: "Perfect for individuals",
    features: ["Payment Links", "QR Code Payments", "Basic Dashboard", "Email Support", "Up to 100 txns/mo"],
    cta: "Get Started",
    highlighted: false,
    color: "slate",
  },
  {
    name: "Pro",
    price: "₹999",
    period: "/month",
    tagline: "For growing merchants",
    features: ["Everything in Starter", "Real-time Analytics", "Payment Reports", "Priority Support", "Unlimited txns", "API Access"],
    cta: "Upgrade Now",
    highlighted: true,
    badge: "Most Popular",
    color: "indigo",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    tagline: "For large-scale businesses",
    features: ["Unlimited Transactions", "Custom Integrations", "Dedicated Account Manager", "SLA Guarantee", "On-premise option"],
    cta: "Contact Sales",
    highlighted: false,
    color: "violet",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-28 px-6 overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(ellipse, #8b5cf6, transparent)" }} />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-20 animate-fadeUp">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-6">
            <Zap size={11} className="text-indigo-400" />
            Simple Pricing
          </div>
          <h2 className="font-bold text-4xl md:text-5xl text-white mb-5 tracking-tight">
            Transparent{" "}
            <span className="text-gradient">Pricing Plans</span>
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto text-lg leading-relaxed">
            No hidden fees. No surprises. Pay only for what you use.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 animate-fadeUp transition-all duration-300 ${
                plan.highlighted
                  ? "border border-indigo-500/40 scale-[1.03]"
                  : "card"
              }`}
              style={plan.highlighted ? {
                background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))",
                animationDelay: `${i * 0.1}s`,
              } : { animationDelay: `${i * 0.1}s` }}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                    <Zap size={10} />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-bold text-xl text-white mb-1">{plan.name}</h3>
                <p className="text-slate-500 text-sm">{plan.tagline}</p>
              </div>

              <div className="mb-8">
                <span className="font-black text-5xl text-white">{plan.price}</span>
                {plan.period && <span className="text-slate-500 ml-1 text-sm">{plan.period}</span>}
              </div>

              <ul className="space-y-3.5 mb-8">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-sm text-slate-300">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.highlighted ? "bg-indigo-500/20" : "bg-white/[0.06]"
                    }`}>
                      <Check size={11} className={plan.highlighted ? "text-indigo-400" : "text-slate-400"} />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] ${
                plan.highlighted
                  ? "btn-primary justify-center"
                  : "btn-secondary justify-center"
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-slate-500 text-xs font-medium animate-fadeUp">
          {["No credit card required", "Cancel anytime", "99.9% Uptime SLA", "PCI DSS Compliant"].map(t => (
            <div key={t} className="flex items-center gap-2">
              <Check size={12} className="text-indigo-400" />
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
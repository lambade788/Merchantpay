export default function Pricing() {
  return (
    <section id="pricing" className="py-28 px-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-20">
          <h2 className="font-heading text-4xl md:text-5xl mb-4">
            Simple & Transparent{" "}
            <span className="text-primary">Pricing</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            No hidden fees. Pay only for what you use.
          </p>
        </div>

        {/* PRICING CARDS */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* STARTER */}
          <div className="rounded-3xl p-8 bg-white/5 border border-white/10 hover:border-primary/40 transition">
            <h3 className="font-heading text-2xl mb-2">Starter</h3>
            <p className="text-muted mb-6">For small businesses</p>

            <div className="text-4xl font-bold mb-6">
              ₹0 <span className="text-base text-muted">/ month</span>
            </div>

            <ul className="space-y-3 text-muted mb-8">
              <li>✔ Payment Links</li>
              <li>✔ QR Payments</li>
              <li>✔ Basic Dashboard</li>
            </ul>

            <button className="w-full py-3 rounded-xl border border-border hover:bg-white/5 transition">
              Get Started
            </button>
          </div>

          {/* PRO (HIGHLIGHTED) */}
          <div className="rounded-3xl p-8 bg-primary/10 border border-primary relative scale-105">
            <div className="absolute -top-4 right-6 bg-primary text-dark text-sm px-3 py-1 rounded-full">
              Popular
            </div>

            <h3 className="font-heading text-2xl mb-2">Pro</h3>
            <p className="text-muted mb-6">For growing merchants</p>

            <div className="text-4xl font-bold mb-6">
              ₹999 <span className="text-base text-muted">/ month</span>
            </div>

            <ul className="space-y-3 text-muted mb-8">
              <li>✔ Everything in Starter</li>
              <li>✔ Real-time Analytics</li>
              <li>✔ Payment Reports</li>
              <li>✔ Priority Support</li>
            </ul>

            <button className="w-full py-3 rounded-xl bg-primary text-dark font-medium hover:opacity-90 transition">
              Upgrade Now
            </button>
          </div>

          {/* ENTERPRISE */}
          <div className="rounded-3xl p-8 bg-white/5 border border-white/10 hover:border-primary/40 transition">
            <h3 className="font-heading text-2xl mb-2">Enterprise</h3>
            <p className="text-muted mb-6">For large scale businesses</p>

            <div className="text-4xl font-bold mb-6">
              Custom
            </div>

            <ul className="space-y-3 text-muted mb-8">
              <li>✔ Unlimited Transactions</li>
              <li>✔ Custom Integrations</li>
              <li>✔ Dedicated Support</li>
            </ul>

            <button className="w-full py-3 rounded-xl border border-border hover:bg-white/5 transition">
              Contact Sales
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
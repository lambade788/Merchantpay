export default function Features() {
  return (
    <section
      id="features"
      className="
        relative py-28 px-6
      "
    >
      <div className="max-w-7xl mx-auto">

        {/* SECTION HEADER */}
        <div className="text-center mb-20">
          <h2 className="font-heading text-4xl md:text-5xl mb-4">
            Everything you need to accept{" "}
            <span className="text-primary">payments</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            Powerful features designed to help you grow your business
            and manage payments effortlessly.
          </p>
        </div>

        {/* FEATURE CARDS */}
        <div className="grid gap-8 md:grid-cols-3">

          {/* CARD 1 */}
          <div
            className="
              relative rounded-3xl p-8
              bg-white/5 backdrop-blur-xl
              border border-white/10
              hover:border-primary/40
              transition
            "
          >
            {/* ICON */}
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
              <span className="text-primary text-2xl">🛡️</span>
            </div>

            <h3 className="font-heading text-2xl mb-3">
              Secure Payments
            </h3>
            <p className="text-muted leading-relaxed">
              Bank-grade security with PCI DSS compliance.
              Your customers&apos; data is always protected.
            </p>

            {/* DECORATION */}
            <div className="absolute bottom-6 right-6 opacity-20 text-3xl">
              🔒
            </div>
          </div>

          {/* CARD 2 */}
          <div
            className="
              relative rounded-3xl p-8
              bg-white/5 backdrop-blur-xl
              border border-white/10
              hover:border-primary/40
              transition
            "
          >
            {/* ICON */}
            <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6">
              <span className="text-blue-400 text-2xl">🔗</span>
            </div>

            <h3 className="font-heading text-2xl mb-3">
              Payment Links & QR
            </h3>
            <p className="text-muted leading-relaxed">
              Create instant payment links and QR codes.
              Share anywhere and get paid instantly.
            </p>

            {/* DOT INDICATOR */}
            <div className="absolute bottom-6 left-8 flex gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span className="w-2 h-2 rounded-full bg-blue-400/40"></span>
              <span className="w-2 h-2 rounded-full bg-blue-400/40"></span>
            </div>
          </div>

          {/* CARD 3 */}
          <div
            className="
              relative rounded-3xl p-8
              bg-white/5 backdrop-blur-xl
              border border-white/10
              hover:border-primary/40
              transition
            "
          >
            {/* ICON */}
            <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6">
              <span className="text-purple-400 text-2xl">📊</span>
            </div>

            <h3 className="font-heading text-2xl mb-3">
              Real-Time Dashboard
            </h3>
            <p className="text-muted leading-relaxed">
              Track every transaction in real time.
              Beautiful analytics to help you make better decisions.
            </p>

            {/* MINI BAR CHART */}
            <div className="absolute bottom-6 right-6 flex items-end gap-2">
              <span className="w-3 h-4 bg-purple-500/40 rounded"></span>
              <span className="w-3 h-6 bg-purple-500/60 rounded"></span>
              <span className="w-3 h-8 bg-purple-500 rounded"></span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
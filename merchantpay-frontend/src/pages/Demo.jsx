export default function Demo() {
  return (
    <div className="min-h-screen px-6 py-28 max-w-6xl mx-auto">
      <h1 className="font-heading text-4xl mb-4">
        MerchantPay Demo
      </h1>

      <p className="text-muted mb-10 max-w-2xl">
        This demo shows how merchants create payment links,
        accept payments, and track transactions in real time.
      </p>

      <div className="grid md:grid-cols-3 gap-8">

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="font-heading text-xl mb-2">Create Payment Link</h3>
          <p className="text-muted">
            Generate a shareable payment link in seconds.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="font-heading text-xl mb-2">Accept Payments</h3>
          <p className="text-muted">
            Customers pay using any UPI or payment app.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="font-heading text-xl mb-2">Track Analytics</h3>
          <p className="text-muted">
            Monitor transactions from your dashboard.
          </p>
        </div>

      </div>
    </div>
  );
}
import { Link, useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto text-center">

        {/* HEADLINE */}
        <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-6">
          Simple, Secure Payments <br />
          <span className="text-primary">for Modern Merchants</span>
        </h1>

        {/* SUBTEXT */}
        <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Accept payments using links and QR codes, track transactions
          in real time, and manage everything from one powerful dashboard.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/register"
            className="bg-primary text-dark px-8 py-4 rounded-xl font-medium hover:opacity-90 transition text-center"
          >
            Get Started Free
          </Link>

          <button
            onClick={() => {
              localStorage.setItem('isDemoMode', 'true');
              navigate('/dashboard');
            }}
            className="border border-border px-8 py-4 rounded-xl text-white hover:bg-surface transition text-center"
          >
            Try Demo
          </button>
        </div>
        

      </div>
    </section>
  );
}
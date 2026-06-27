import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Zap } from "lucide-react";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const navigate                = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.text();

      if (data === "User not found" || data === "Invalid password") {
        setError(data);
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data);
      localStorage.removeItem("isDemoMode");
      localStorage.removeItem("demoData");

      const userData = { name: email.split("@")[0], email };
      localStorage.setItem("user", JSON.stringify(userData));

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-landing flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full animate-float"
          style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.12), transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full animate-float"
          style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.10), transparent)", animationDelay: "3s" }} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fadeUp">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-glow-indigo"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              M
            </div>
            <span className="font-bold text-xl text-white">MerchantPay</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome back</h1>
          <p className="text-slate-400 text-sm">Sign in to your merchant dashboard</p>
        </div>

        {/* Card */}
        <div className="glass-strong gradient-border rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm font-medium text-center animate-fadeIn">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-premium pl-11"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Password
                </label>
                <a href="#" className="text-indigo-400 text-xs hover:text-indigo-300 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-premium pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Demo shortcut */}
          <div className="mt-5 p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-3 cursor-pointer hover:bg-indigo-500/15 transition-all"
            onClick={() => {
              localStorage.setItem('isDemoMode', 'true');
              navigate('/dashboard');
            }}>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <Zap size={15} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-indigo-300 text-xs font-bold">Try Demo Mode</p>
              <p className="text-slate-500 text-[10px]">No login required — explore with sample data</p>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
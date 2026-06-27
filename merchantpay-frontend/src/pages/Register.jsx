import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Building2, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errors, setErrors]   = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading]  = useState(false);
  const [success, setSuccess]  = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.businessName.trim()) newErrors.businessName = "Business name is required";
    if (!form.email)               newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email address";
    if (!form.password)            newErrors.password = "Password is required";
    else if (form.password.length < 8) newErrors.password = "Must be at least 8 characters";
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = "Passwords do not match";
    if (!form.terms)               newErrors.terms = "You must accept the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName: form.businessName, email: form.email, password: form.password }),
      });
      const data = await response.text();
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setErrors({ ...errors, submit: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-landing flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center animate-fadeUp">
          <div className="glass-strong gradient-border rounded-2xl p-12">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-emerald-400" />
            </div>
            <h2 className="text-2xl font-black text-white mb-3">Account Created!</h2>
            <p className="text-slate-400 mb-8">Welcome to MerchantPay. Your merchant account is ready.</p>
            <Link to="/login" className="btn-primary justify-center w-full">
              Sign In Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-landing flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full animate-float"
          style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.10), transparent)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full animate-float"
          style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.08), transparent)", animationDelay: "2s" }} />
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
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Create your account</h1>
          <p className="text-slate-400 text-sm">Start accepting payments in minutes</p>
        </div>

        {/* Card */}
        <div className="glass-strong gradient-border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm text-center animate-fadeIn">
                {errors.submit}
              </div>
            )}

            {/* Business Name */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Business Name</label>
              <div className="relative">
                <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  name="businessName"
                  value={form.businessName}
                  onChange={handleChange}
                  placeholder="Acme Corp."
                  className={`input-premium pl-11 ${errors.businessName ? "border-red-500/50 ring-1 ring-red-500/20" : ""}`}
                />
              </div>
              {errors.businessName && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.businessName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className={`input-premium pl-11 ${errors.email ? "border-red-500/50 ring-1 ring-red-500/20" : ""}`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className={`input-premium pl-11 pr-11 ${errors.password ? "border-red-500/50 ring-1 ring-red-500/20" : ""}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showConf ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`input-premium pl-11 pr-11 ${errors.confirmPassword ? "border-red-500/50 ring-1 ring-red-500/20" : ""}`}
                />
                <button type="button" onClick={() => setShowConf(!showConf)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showConf ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={form.terms}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    form.terms ? "bg-indigo-500 border-indigo-500" : "border-white/20 bg-white/5"
                  }`}>
                    {form.terms && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                </div>
                <span className="text-sm text-slate-400">
                  I agree to the{" "}
                  <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">Terms of Service</a>
                  {" & "}
                  <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">Privacy Policy</a>
                </span>
              </label>
              {errors.terms && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.terms}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
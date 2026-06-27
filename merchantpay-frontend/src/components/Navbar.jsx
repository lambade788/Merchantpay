import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full fixed top-0 z-50">
      {/* Frosted glass bar */}
      <div className="glass-strong border-b border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base shadow-glow-indigo"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              M
            </div>
            <span className="font-bold text-lg text-white tracking-tight">MerchantPay</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors font-medium">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors font-medium">Pricing</a>
            <a href="#about" className="hover:text-white transition-colors font-medium">About</a>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-400 hover:text-white font-medium transition-colors px-3 py-2 rounded-lg hover:bg-white/[0.06]">
              Login
            </Link>
            <Link
              to="/register"
              className="btn-primary text-sm px-5 py-2.5"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass-strong border-b border-white/[0.07] px-6 py-6 space-y-4 animate-fadeIn">
          <a href="#features" className="block text-slate-400 hover:text-white py-2 font-medium" onClick={() => setOpen(false)}>Features</a>
          <a href="#pricing"  className="block text-slate-400 hover:text-white py-2 font-medium" onClick={() => setOpen(false)}>Pricing</a>
          <a href="#about"    className="block text-slate-400 hover:text-white py-2 font-medium" onClick={() => setOpen(false)}>About</a>
          <div className="pt-4 border-t border-white/[0.07] flex flex-col gap-3">
            <Link to="/login" className="block text-slate-400 hover:text-white font-medium py-2" onClick={() => setOpen(false)}>Login</Link>
            <Link to="/register" className="btn-primary justify-center text-sm" onClick={() => setOpen(false)}>Get Started Free</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
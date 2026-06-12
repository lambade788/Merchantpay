import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full fixed top-0 z-50 bg-dark border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-heading font-bold text-dark">
            M
          </div>
          <span className="font-heading text-xl">MerchantPay</span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8 text-sm text-muted">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
          <a href="#about" className="hover:text-white">About</a>
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm text-muted hover:text-white"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-primary text-dark px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90"
          >
            Get Started
          </Link>
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-surface border-t border-border px-6 py-6 space-y-4">
          <a href="#features" className="block text-muted hover:text-white">
            Features
          </a>
          <a href="#pricing" className="block text-muted hover:text-white">
            Pricing
          </a>
          <a href="#about" className="block text-muted hover:text-white">
            About
          </a>

          <div className="pt-6 border-t border-border space-y-3">
            <Link
              to="/login"
              className="block text-muted hover:text-white"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="block bg-primary text-dark py-2 rounded-xl font-medium text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
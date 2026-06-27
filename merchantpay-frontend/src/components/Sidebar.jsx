import { Link, useLocation } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  ClipboardList,
  Link as LinkIcon,
  BarChart3,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";

const navItems = [
  { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", path: "/dashboard/transactions", icon: ClipboardList },
  { name: "Payment Links", path: "/dashboard/payment-links", icon: LinkIcon },
  { name: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
];

export default function Sidebar({ open, closeSidebar }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-[260px] z-50 flex flex-col transition-transform duration-300 ease-in-out
        glass-strong border-r border-white/[0.07]
        ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-lg"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            M
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none tracking-tight">MerchantPay</p>
            <p className="text-slate-500 text-[10px] mt-0.5">Dashboard</p>
          </div>
        </div>
        <button
          onClick={closeSidebar}
          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest px-3 mb-3">Main Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border
                ${active
                  ? "nav-active border-indigo-500/30 text-indigo-400"
                  : "border-transparent text-slate-400 hover:text-white hover:bg-white/[0.06]"
                }`}
            >
              {/* Active indicator bar */}
              <div className={`w-0.5 h-5 rounded-full transition-all duration-200 ${active ? "bg-indigo-400" : "bg-transparent"}`} />
              <Icon
                size={17}
                className={`flex-shrink-0 transition-colors duration-200 ${active ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`}
              />
              <span>{item.name}</span>
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/[0.07] space-y-1">
        <div className="px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-indigo-400" />
            <span className="text-xs font-bold text-indigo-400">Pro Plan</span>
          </div>
          <p className="text-slate-500 text-[10px]">All features unlocked</p>
        </div>

        <button
          className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("isDemoMode");
            localStorage.removeItem("demoData");
            closeSidebar();
            window.location.href = "/";
          }}
        >
          <div className="w-0.5 h-5 rounded-full" />
          <LogOut size={17} className="flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
import { Link, useLocation } from "react-router-dom";
import { 
  X, 
  LayoutDashboard, 
  ClipboardList, 
  Link as LinkIcon, 
  BarChart3, 
  Settings, 
  LogOut 
} from "lucide-react";

export default function Sidebar({ open, closeSidebar }) {
  const location = useLocation();

  // Helper to check if a route is active
  const isActive = (path) => location.pathname === path;

  // Navigation Items Mapping to keep code clean
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Transactions", path: "/dashboard/transactions", icon: <ClipboardList size={20} /> },
    { name: "Payment Links", path: "/dashboard/payment-links", icon: <LinkIcon size={20} /> },
    { name: "Analytics", path: "/dashboard/analytics", icon: <BarChart3 size={20} /> },
    { name: "Settings", path: "/dashboard/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full w-72 bg-[#0a1120] border-r border-slate-800 p-6 transform transition-transform duration-300 z-50 flex flex-col text-slate-400 font-sans
      ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* HEADER WITH LOGO AND CLOSE BUTTON */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20">
            M
          </div>
          <h1 className="text-white text-xl font-bold tracking-tight">MerchantPay</h1>
        </div>

        <X
          className="cursor-pointer text-slate-500 hover:text-white transition-colors"
          onClick={closeSidebar}
          size={24}
        />
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={closeSidebar}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group border ${
              isActive(item.path)
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-transparent border-transparent hover:bg-slate-800/50 hover:text-slate-200"
            }`}
          >
            <span className={isActive(item.path) ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"}>
              {item.icon}
            </span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* FOOTER / LOGOUT */}
      <div className="pt-6 border-t border-slate-800/50">
        <button 
          className="w-full flex items-center gap-4 px-4 py-3 hover:text-white transition-colors group"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("isDemoMode");
            localStorage.removeItem("demoData");
            closeSidebar();
            window.location.href = "/";
          }}
        >
          <LogOut size={20} className="rotate-180 group-hover:translate-x-[-2px] transition-transform" />
          <span className="font-medium text-slate-400 group-hover:text-white">Logout</span>
        </button>
      </div>
    </div>
  );
}
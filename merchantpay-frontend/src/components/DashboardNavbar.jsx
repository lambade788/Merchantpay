import { Bell, Menu, LogOut, ShoppingCart, Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../api/authApi";

export default function DashboardNavbar({ toggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const menu = [
    { name: "Shop", path: "/dashboard/shop" },
    { name: "Orders", path: "/dashboard/orders" },
    { name: "Merchant", path: "/dashboard/merchant" },
  ];

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="glass-strong border-b border-white/[0.07] px-6 py-3 flex items-center justify-between gap-4 z-20 relative">
      
      {/* LEFT: Hamburger + page links */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Secondary nav pills */}
        <nav className="hidden sm:flex items-center gap-1">
          {menu.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent"
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* CENTER: Search (hidden on mobile) */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
        <div className="relative w-full group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={15} />
          <input
            type="text"
            placeholder="Search transactions, links..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
          />
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-2">
        {/* Cart */}
        <button
          onClick={() => navigate("/dashboard/cart")}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all"
          aria-label="Shopping cart"
        >
          <ShoppingCart size={18} />
        </button>

        {/* Bell */}
        <button
          className="relative p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-400 border border-[#060818]" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/[0.08] mx-1" />

        {/* User */}
        <div className="flex items-center gap-3 pl-1">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold cursor-pointer"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-sm font-semibold text-white leading-none">{user?.name || "User"}</span>
            <span className="text-[10px] text-slate-500 mt-0.5">{user?.email || ""}</span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all ml-1"
          aria-label="Logout"
        >
          <LogOut size={15} />
          <span className="hidden lg:block font-medium">Logout</span>
        </button>
      </div>
    </header>
  );
}
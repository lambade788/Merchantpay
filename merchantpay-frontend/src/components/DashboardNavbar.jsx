import { Bell, Menu, LogOut, ShoppingCart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../api/authApi";

export default function DashboardNavbar({ toggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ GET USER FROM STORAGE
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ ADDED "Shop" TO THE MENU ARRAY
  const menu = [
    { name: "Shop", path: "/dashboard/shop" },
    { name: "Orders", path: "/dashboard/orders" },
    { name: "Merchant", path: "/dashboard/merchant" }
  ];

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="bg-[#0B0F19] text-white px-6 py-3 flex justify-between items-center border-b border-gray-700 shadow-md">
      
      {/* LEFT: TOGGLE & NAVIGATION */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Menu className="cursor-pointer hover:text-gray-400" onClick={toggle} />
          <h2 className="text-lg font-semibold hidden md:block">Dashboard</h2>
        </div>

        <nav className="flex gap-2">
          {menu.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                location.pathname === item.path
                  ? "bg-[#1E293B] text-white"
                  : "text-gray-400 hover:bg-[#1E293B] hover:text-white"
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* RIGHT: ACTIONS & USER INFO */}
      <div className="flex items-center gap-5">
        
        {/* SHOPPING CART */}
        <div
          // ✅ UPDATED NAVIGATION PATH TO /dashboard/cart
          onClick={() => navigate("/dashboard/cart")}
          className="relative cursor-pointer hover:bg-[#1E293B] p-2 rounded-lg transition"
        >
          <ShoppingCart size={20} />
          {/* Optional: Add a badge here if you have cart items count */}
        </div>

        {/* NOTIFICATIONS */}
        <div className="relative cursor-pointer hover:bg-[#1E293B] p-2 rounded-lg transition">
          <Bell size={20} />
          <span className="absolute top-2 right-2 bg-green-500 w-2 h-2 rounded-full border border-[#0B0F19]"></span>
        </div>

        {/* USER INFO */}
        <div className="flex items-center gap-3 border-l border-gray-700 pl-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="text-sm font-medium hidden sm:block">
              {user?.name || "User"}
            </span>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3 py-1.5 rounded transition text-sm border border-red-500/20"
          >
            <LogOut size={16} />
            <span className="hidden lg:block">Logout</span>
          </button>
        </div>

      </div>
    </div>
  );
}
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-dashboard overflow-hidden text-white">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="glow-blob w-[600px] h-[600px] bg-indigo-500 top-[-200px] left-[-200px]" />
        <div className="glow-blob w-[500px] h-[500px] bg-violet-500 bottom-[-200px] right-[-100px]" />
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar open={open} closeSidebar={() => setOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <DashboardNavbar toggle={() => setOpen(!open)} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
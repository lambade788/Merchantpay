import { useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-white">

      {/* Sidebar */}
      <Sidebar open={open} closeSidebar={() => setOpen(false)} />

      <div className="flex-1 flex flex-col">
        <DashboardNavbar toggle={() => setOpen(!open)} />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
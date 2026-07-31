import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const isDemo = localStorage.getItem("isDemoMode") === "true";

  if (loading) {
    return (
      <div className="flex h-screen bg-dashboard items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (isAuthenticated || isDemo) ? <Outlet /> : <Navigate to="/login" replace />;
}

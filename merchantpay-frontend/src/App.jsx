import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Demo from "./pages/Demo";
import PaymentPage from "./pages/PaymentPage";

import Overview from "./pages/dashboard/Overview";
import Transactions from "./pages/dashboard/Transactions";
import PaymentLink from "./pages/dashboard/PaymentLink";
import AnalyticsPage from "./pages/dashboard/Analytics.jsx";
import Settings from "./pages/dashboard/Settings";
import Orders from "./pages/dashboard/Orders";
import Shop from "./pages/dashboard/Shop";
import Cart from "./pages/dashboard/Cart";
import Merchant from "./pages/dashboard/Merchant";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/pay/:linkId" element={<PaymentPage />} />

        {/* DASHBOARD ROUTES */}
        <Route path="/dashboard" element={<DashboardLayout />}>

          <Route index element={<Overview />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="payment-links" element={<PaymentLink />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="orders" element={<Orders />} />  {/* 🔥 FIXED */}
          <Route path="shop" element={<Shop />} />
          <Route path="cart" element={<Cart />} />
          <Route path="merchant" element={<Merchant />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}
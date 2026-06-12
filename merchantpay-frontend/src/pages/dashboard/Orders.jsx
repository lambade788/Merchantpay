import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipboardList, CheckCircle, Clock, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // ==============================
  // FETCH ORDERS
  // ==============================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/orders");
        console.log("Orders Data:", res.data); // 🔍 debug
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders", err);
      }
    };
    fetchOrders();
  }, []);

  // ==============================
  // HANDLE PAYMENT REDIRECT
  // ==============================
  const handleResumePayment = (linkId) => {
    if (!linkId) {
      alert("Payment link not found for this order.");
      return;
    }

    // ✅ Redirect to payment page
    navigate(`/pay/${linkId}`);
  };

  return (
    <div className="min-h-screen bg-[#0a1120] text-slate-300 p-8">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <ClipboardList className="text-emerald-400" size={32} />
        <h2 className="text-3xl font-bold text-white">Order History</h2>
      </div>

      {/* TABLE */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          
          {/* TABLE HEAD */}
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-widest">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">User ID</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody className="divide-y divide-slate-800">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                
                {/* ORDER ID */}
                <td className="p-4 text-white font-mono">#{order.id}</td>

                {/* USER */}
                <td className="p-4 text-slate-400">User {order.userId}</td>

                {/* AMOUNT */}
                <td className="p-4 font-bold text-white">₹{order.totalAmount}</td>

                {/* STATUS */}
                <td className="p-4">
                  <span
                    className={`flex items-center gap-2 w-fit px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === "SUCCESS"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {order.status === "SUCCESS" ? (
                      <CheckCircle size={14} />
                    ) : (
                      <Clock size={14} />
                    )}
                    {order.status}
                  </span>
                </td>

                {/* ACTION */}
                <td className="p-4">
                  
                  {/* ✅ SHOW PAY BUTTON ONLY IF PENDING */}
                  {order.status === "PENDING" ? (
                    <button
                      onClick={() => handleResumePayment(order.paymentLinkId)}
                      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <CreditCard size={14} /> Pay Now
                    </button>
                  ) : (
                    <span className="text-emerald-400 text-xs font-bold">
                      Paid
                    </span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
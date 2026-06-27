import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipboardList, CheckCircle, Clock, CreditCard, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isDemoMode, getDemoOrders } from "../../api/paymentApi";

export default function Orders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      if (isDemoMode()) {
        setOrders(getDemoOrders());
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get("http://localhost:8080/api/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleResumePayment = (linkId) => {
    if (!linkId) { alert("Payment link not found for this order."); return; }
    navigate(`/pay/${linkId}`);
  };

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
          <ClipboardList className="text-indigo-400" size={22} />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white">Order History</h2>
          <p className="text-slate-400 text-sm">Track all your customer orders</p>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(5)].map((_, j) => (
                      <td key={j}><div className="skeleton h-4 w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Package size={44} className="mx-auto text-slate-700 mb-3" />
                    <p className="text-slate-500 font-medium">No orders yet</p>
                    <p className="text-slate-600 text-xs mt-1">Orders will appear here once customers complete checkout</p>
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id}>
                    <td className="font-mono font-bold text-white">#{order.id}</td>
                    <td className="text-slate-400 text-sm">User {order.userId}</td>
                    <td className="font-bold text-white">₹{order.totalAmount}</td>
                    <td>
                      <span className={`flex items-center gap-2 w-fit px-3 py-1.5 rounded-full text-[11px] font-bold border ${
                        order.status === "SUCCESS"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}>
                        {order.status === "SUCCESS" ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {order.status === "PENDING" ? (
                        <button
                          onClick={() => handleResumePayment(order.paymentLinkId)}
                          className="inline-flex items-center gap-1.5 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-400 border border-indigo-500/25 text-xs font-bold px-3.5 py-2 rounded-lg transition-all"
                        >
                          <CreditCard size={13} /> Pay Now
                        </button>
                      ) : (
                        <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                          <CheckCircle size={13} /> Paid
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
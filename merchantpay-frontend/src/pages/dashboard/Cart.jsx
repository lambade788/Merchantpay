import { useCart } from "../../context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, CreditCard, ArrowLeft, Package } from "lucide-react";
import {
  isDemoMode, getDemoProducts, saveDemoProducts,
  getDemoOrders, saveDemoOrders, getMockData, saveMockData,
} from "../../api/paymentApi";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    if (isDemoMode()) {
      const products = getDemoProducts();
      cart.forEach(item => {
        const prod = products.find(p => p.id === item.id);
        if (prod) prod.stock -= item.quantity;
      });
      saveDemoProducts(products);

      const linkId = "DEMO-" + Math.floor(Math.random() * 10000);
      const mockData = getMockData();
      mockData.links.unshift({
        id: linkId, linkId, title: "Shop Order #" + linkId,
        amount: subtotal, status: "ACTIVE", createdAt: new Date().toISOString(),
      });
      saveMockData(mockData);

      const orders = getDemoOrders();
      orders.unshift({
        id: Math.floor(Math.random() * 10000), userId: 1,
        totalAmount: subtotal, status: "PENDING", paymentLinkId: linkId,
      });
      saveDemoOrders(orders);
      clearCart();
      navigate(`/pay/${linkId}`);
      return;
    }

    try {
      const request = {
        userId: 1,
        items: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
      };
      const res    = await axios.post("http://localhost:8080/api/checkout", request);
      const linkId = res.data;
      clearCart();
      navigate(`/pay/${linkId}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error processing checkout.";
      alert(`Checkout Failed: ${errorMessage}`);
    }
  };

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-1">Your Basket</h2>
          <p className="text-slate-400 text-sm">{cart.length} item{cart.length !== 1 ? "s" : ""} in cart</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/shop")}
          className="btn-secondary text-sm px-4 py-2.5"
        >
          <ArrowLeft size={15} /> Back to Shop
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.length === 0 ? (
            <div className="card p-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-5">
                <ShoppingCart size={36} className="text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Your cart is empty</h3>
              <p className="text-slate-500 text-sm mb-6">Browse the marketplace and add items to get started</p>
              <button
                onClick={() => navigate("/dashboard/shop")}
                className="btn-primary px-7 py-3"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="card p-4 flex items-center gap-4 group">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/[0.04] border border-white/[0.06] flex-shrink-0">
                  <img
                    src={item.imageUrl || "https://placehold.co/100"}
                    className="w-full h-full object-cover"
                    alt={item.name}
                    onError={e => { e.target.src = "https://placehold.co/100?text=Err"; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold truncate">{item.name}</h4>
                  <p className="text-indigo-400 font-mono font-bold mt-0.5">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2">
                    <span className="text-sm font-bold text-white">Qty: {item.quantity}</span>
                  </div>
                  <div className="text-sm font-black text-white min-w-[70px] text-right">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {cart.length > 0 && (
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-6">
              <h3 className="text-lg font-black text-white mb-5 pb-4 border-b border-white/[0.06]">Order Summary</h3>
              <div className="space-y-3.5 mb-5">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-400 truncate mr-3">{item.name} × {item.quantity}</span>
                    <span className="text-white font-semibold flex-shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/[0.06] pt-4 flex justify-between items-center mb-6">
                <span className="text-white font-bold text-lg">Total</span>
                <span className="text-2xl font-black text-white">₹{subtotal.toLocaleString()}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="btn-primary w-full justify-center py-4 disabled:opacity-50"
              >
                <CreditCard size={18} /> Proceed to Payment
              </button>
              <p className="text-slate-600 text-[10px] text-center mt-3 font-medium">
                🔒 Secured by MerchantPay Gateway
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
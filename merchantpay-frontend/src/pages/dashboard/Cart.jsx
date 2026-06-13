import { useCart } from "../../context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, CreditCard, ArrowLeft } from "lucide-react";
import { isDemoMode, getDemoProducts, saveDemoProducts, getDemoOrders, saveDemoOrders, getMockData, saveMockData } from "../../api/paymentApi";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    if (isDemoMode()) {
      // 1. Decrease Stock
      const products = getDemoProducts();
      cart.forEach(item => {
        const prod = products.find(p => p.id === item.id);
        if (prod) prod.stock -= item.quantity;
      });
      saveDemoProducts(products);

      // 2. Create Payment Link
      const linkId = "DEMO-" + Math.floor(Math.random() * 10000);
      const mockData = getMockData();
      mockData.links.unshift({
        id: linkId,
        linkId: linkId,
        title: "Shop Order #" + linkId,
        amount: subtotal,
        status: "ACTIVE",
        createdAt: new Date().toISOString()
      });
      saveMockData(mockData);

      // 3. Create Order
      const orders = getDemoOrders();
      orders.unshift({
        id: Math.floor(Math.random() * 10000),
        userId: 1,
        totalAmount: subtotal,
        status: "PENDING",
        paymentLinkId: linkId
      });
      saveDemoOrders(orders);

      clearCart();
      navigate(`/pay/${linkId}`);
      return;
    }

    try {
      const request = {
        userId: 1, // Change this when you add real User Auth
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      // Ensure /api/checkout is permitted in your SecurityConfig.java
      const res = await axios.post("http://localhost:8080/api/checkout", request);
      const linkId = res.data;

      clearCart();
      navigate(`/pay/${linkId}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error processing checkout.";
      alert(`Checkout Failed: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1120] text-slate-300 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Your Basket</h2>
          <p className="text-slate-400">Total items: {cart.length}</p>
        </div>
        <button onClick={() => navigate("/dashboard/shop")} className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold">
          <ArrowLeft size={16} /> Back to Shop
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.length === 0 ? (
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-20 flex flex-col items-center justify-center">
              <ShoppingCart size={48} className="text-slate-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Your cart is empty</h3>
              <button onClick={() => navigate("/dashboard/shop")} className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold">Start Shopping</button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="bg-[#0f172a] border border-slate-800 p-4 rounded-2xl flex items-center gap-4 group">
                <div className="w-20 h-20 bg-slate-800 rounded-xl overflow-hidden">
                   <img 
                    src={item.imageUrl || "https://placehold.co/100"} 
                    className="w-full h-full object-cover" 
                    alt={item.name}
                    onError={(e) => { e.target.src = "https://placehold.co/100?text=Error"; }}
                   />
                </div>
                <div className="flex-grow">
                  <h4 className="text-white font-bold">{item.name}</h4>
                  <p className="text-emerald-400 font-mono">₹{item.price}</p>
                </div>
                <div className="flex items-center bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700">
                  <span className="text-sm font-bold text-white">Qty: {item.quantity}</span>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="p-3 text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 sticky top-6">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-white font-mono">₹{subtotal}</span>
              </div>
              <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">₹{subtotal}</span>
              </div>
            </div>
            <button 
              onClick={handleCheckout} 
              disabled={cart.length === 0} 
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white
               font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20"
            >
              <CreditCard size={20} /> Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
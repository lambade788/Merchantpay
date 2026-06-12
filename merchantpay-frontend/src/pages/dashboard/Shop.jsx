import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { ShoppingBag, Tag, Box, CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [lastAdded, setLastAdded] = useState("");
  
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();

  const fetchProducts = () => {
    axios.get("http://localhost:8080/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    const itemInCart = cart.find(item => item.id === product.id);
    const currentQty = itemInCart ? itemInCart.quantity : 0;

    // 🛑 Stock Check
    if (currentQty >= product.stock) {
      alert(`Sorry! Only ${product.stock} units of ${product.name} are available.`);
      return;
    }

    addToCart(product);
    setLastAdded(product.name);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0a1120] text-slate-300 font-sans p-6 relative">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-[#1e293b] border border-emerald-500/50 shadow-2xl shadow-emerald-500/20 p-4 rounded-2xl flex items-center gap-4 min-w-[300px]">
            <div className="bg-emerald-500/20 p-2 rounded-full">
              <CheckCircle2 className="text-emerald-400" size={20} />
            </div>
            <div className="flex-grow">
              <p className="text-white text-sm font-bold">Added to Cart!</p>
              <p className="text-slate-400 text-xs">{lastAdded}</p>
            </div>
            <button onClick={() => navigate("/dashboard/cart")} className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Marketplace</h2>
          <p className="text-slate-400">Premium products, instant delivery</p>
        </div>
        
        <button onClick={() => navigate("/dashboard/cart")} className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl flex items-center gap-3 transition-all group">
          <div className="relative">
            <ShoppingBag size={20} className="group-hover:text-emerald-400" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                {cart.length}
              </span>
            )}
          </div>
          <span className="text-sm font-bold text-white">View Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p) => {
          const inCart = cart.find(item => item.id === p.id);
          const qtyInCart = inCart ? inCart.quantity : 0;
          const isMaxed = qtyInCart >= p.stock;

          return (
            <div key={p.id} className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl group hover:border-emerald-500/30 transition-all">
              <div className="h-48 bg-slate-800/50 relative overflow-hidden">
                <img 
                  src={p.imageUrl || "https://placehold.co/400x300?text=No+Image"} 
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => { e.target.src = "https://placehold.co/400x300?text=Invalid+Link"; }}
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                  {p.stock > 0 ? `${p.stock} IN STOCK` : "OUT OF STOCK"}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2 truncate">{p.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={14} className="text-emerald-500" />
                  <span className="text-xl font-black text-white">₹{p.price}</span>
                </div>

                <button
                  onClick={() => handleAddToCart(p)}
                  disabled={p.stock <= 0 || isMaxed}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all shadow-lg ${
                    (p.stock > 0 && !isMaxed)
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20" 
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <ShoppingBag size={18} />
                  {p.stock <= 0 ? "Sold Out" : isMaxed ? "Limit Reached" : "Add to Cart"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
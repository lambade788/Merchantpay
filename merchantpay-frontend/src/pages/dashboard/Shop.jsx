import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { ShoppingBag, Tag, CheckCircle2, ArrowRight, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isDemoMode, getDemoProducts } from "../../api/paymentApi";

export default function Shop() {
  const [products, setProducts]   = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [lastAdded, setLastAdded] = useState("");
  const { addToCart, cart }       = useCart();
  const navigate                  = useNavigate();

  const fetchProducts = () => {
    if (isDemoMode()) { setProducts(getDemoProducts()); return; }
    axios.get("http://localhost:8080/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products:", err));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAddToCart = (product) => {
    const itemInCart  = cart.find(item => item.id === product.id);
    const currentQty  = itemInCart ? itemInCart.quantity : 0;
    if (currentQty >= product.stock) {
      alert(`Sorry! Only ${product.stock} units available.`);
      return;
    }
    addToCart(product);
    setLastAdded(product.name);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="space-y-7 animate-fadeIn relative">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 animate-slideInRight">
          <div className="glass-strong border border-emerald-500/30 shadow-glow-cyan p-4 rounded-2xl flex items-center gap-4 min-w-[300px]">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="text-emerald-400" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-bold">Added to Cart!</p>
              <p className="text-slate-400 text-xs truncate">{lastAdded}</p>
            </div>
            <button
              onClick={() => navigate("/dashboard/cart")}
              className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/30 transition-all"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-1">Marketplace</h2>
          <p className="text-slate-400 text-sm">Browse and add products to your cart</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/cart")}
          className="relative btn-secondary text-sm px-5 py-2.5"
        >
          <ShoppingCart size={16} />
          View Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center animate-pulse"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map(p => {
          const inCart   = cart.find(item => item.id === p.id);
          const qtyInCart = inCart ? inCart.quantity : 0;
          const isMaxed  = qtyInCart >= p.stock;
          const outOfStock = p.stock <= 0;

          return (
            <div key={p.id}
              className="card overflow-hidden group cursor-default"
              style={{ border: isMaxed ? "1px solid rgba(99,102,241,0.3)" : undefined }}
            >
              {/* Image */}
              <div className="h-48 bg-white/[0.03] relative overflow-hidden">
                <img
                  src={p.imageUrl || "https://placehold.co/400x300?text=No+Image"}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={e => { e.target.src = "https://placehold.co/400x300?text=No+Image"; }}
                />
                {/* Stock badge */}
                <div className={`absolute top-3 right-3 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                  outOfStock
                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                }`}>
                  {outOfStock ? "OUT OF STOCK" : `${p.stock} IN STOCK`}
                </div>
                {qtyInCart > 0 && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold border bg-indigo-500/20 text-indigo-400 border-indigo-500/30 backdrop-blur-sm">
                    {qtyInCart} in cart
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-base font-bold text-white mb-2 truncate">{p.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={13} className="text-indigo-400" />
                  <span className="text-xl font-black text-white">₹{p.price}</span>
                </div>
                <button
                  onClick={() => handleAddToCart(p)}
                  disabled={outOfStock || isMaxed}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    !outOfStock && !isMaxed
                      ? "btn-primary"
                      : "bg-white/[0.04] text-slate-500 cursor-not-allowed border border-white/[0.06]"
                  }`}
                >
                  <ShoppingBag size={16} />
                  {outOfStock ? "Sold Out" : isMaxed ? "Limit Reached" : "Add to Cart"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
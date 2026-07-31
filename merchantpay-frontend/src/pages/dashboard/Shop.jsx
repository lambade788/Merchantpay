import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { ShoppingBag, Tag, CheckCircle2, ArrowRight, ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isDemoMode, getDemoProducts } from "../../api/paymentApi";
import { motion, AnimatePresence } from "framer-motion";

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

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8 relative pb-10">
      {/* Toast */}
      <AnimatePresence>
      {showToast && (
        <motion.div 
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.9 }}
          className="fixed top-24 right-6 z-50"
        >
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
        </motion.div>
      )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 border border-indigo-500/20 bg-gradient-to-br from-indigo-900/30 to-violet-900/10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-violet-500/20 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">Premium Shop</h2>
            <p className="text-slate-300 text-sm md:text-base max-w-xl">Discover our exclusive collection of digital assets and products tailored for your business needs.</p>
          </div>
          <button
            onClick={() => navigate("/dashboard/cart")}
            className="relative btn-primary text-sm px-6 py-3 group"
          >
            <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
            View Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-[11px] font-black flex items-center justify-center border-2 border-[#0d1424] shadow-lg"
                style={{ background: "linear-gradient(135deg, #f43f5e, #fb923c)" }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Product grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {products.map((p) => {
          const inCart   = cart.find(item => item.id === p.id);
          const qtyInCart = inCart ? inCart.quantity : 0;
          const isMaxed  = qtyInCart >= p.stock;
          const outOfStock = p.stock <= 0;
          // Generate a fake rating based on product ID for visual appeal
          const rating = (4 + (p.id % 5) * 0.2).toFixed(1);
          const reviews = 120 + (p.id * 13) % 800;

          return (
            <motion.div key={p.id} variants={itemAnim}
              className="card overflow-hidden group flex flex-col h-full bg-[#0a0f1e]/80 hover:bg-[#111827] transition-colors border-white/5 hover:border-indigo-500/30"
              style={{ border: isMaxed ? "1px solid rgba(99,102,241,0.5)" : undefined, boxShadow: isMaxed ? "0 0 20px rgba(99,102,241,0.2)" : undefined }}
            >
              {/* Image Section */}
              <div className="h-56 bg-slate-900/50 relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] to-transparent z-10 opacity-60"></div>
                <img
                  src={p.imageUrl || "https://placehold.co/400x300?text=No+Image"}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  onError={e => { e.target.src = "https://placehold.co/400x300?text=No+Image"; }}
                />
                
                {/* Overlay actions */}
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                   <button
                    onClick={() => handleAddToCart(p)}
                    disabled={outOfStock || isMaxed}
                    className={`transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm shadow-xl ${
                      !outOfStock && !isMaxed
                        ? "bg-indigo-500 hover:bg-indigo-400 text-white"
                        : "bg-slate-800/80 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingBag size={16} />
                    {outOfStock ? "Sold Out" : isMaxed ? "Limit Reached" : "Add to Cart"}
                  </button>
                </div>

                {/* Badges */}
                <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 items-end">
                   <div className={`backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase border shadow-lg ${
                    outOfStock
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  }`}>
                    {outOfStock ? "Sold Out" : `${p.stock} IN STOCK`}
                  </div>
                </div>
                
                {qtyInCart > 0 && (
                  <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-lg text-[10px] font-black border bg-indigo-500/90 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                    {qtyInCart} IN CART
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="p-5 flex flex-col flex-1 relative z-20">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">{p.name}</h3>
                </div>
                
                {/* Mock Rating */}
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="flex text-amber-400">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" className="opacity-40" />
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{rating} ({reviews})</span>
                </div>
                
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Price</span>
                    <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                      ₹{p.price?.toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Small add button for mobile or quick access */}
                  <button
                    onClick={() => handleAddToCart(p)}
                    disabled={outOfStock || isMaxed}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all md:hidden lg:flex xl:hidden 2xl:flex ${
                      !outOfStock && !isMaxed
                        ? "bg-white/5 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 border border-white/10 hover:border-indigo-500/50"
                        : "bg-white/5 text-slate-600 cursor-not-allowed border-transparent"
                    }`}
                  >
                    <ShoppingBag size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit3, Save, X, Plus, Package, DollarSign, Tag, Info, LayoutGrid } from "lucide-react";
import { isDemoMode, getDemoProducts, saveDemoProducts } from "../../api/paymentApi";

export default function Merchant() {
  const [products, setProducts]   = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData]   = useState({
    name: "", price: "", stock: "", description: "", imageUrl: "", merchantId: 1,
  });

  const fetchProducts = async () => {
    if (isDemoMode()) { setProducts(getDemoProducts()); return; }
    try {
      const res = await axios.get("http://localhost:8080/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreateModal = () => {
    setFormData({ name: "", price: "", stock: "", description: "", imageUrl: "", merchantId: 1 });
    setIsModalOpen(true);
  };
  const openEditModal = (product) => { setFormData({ ...product }); setIsModalOpen(true); };

  const handleSave = async () => {
    if (isDemoMode()) {
      let prods = getDemoProducts();
      if (formData.id) {
        prods = prods.map(p => p.id === formData.id ? { ...formData } : p);
        alert("Product Updated (Demo)!");
      } else {
        prods.push({ ...formData, id: Date.now() });
        alert("New Product Added (Demo)!");
      }
      saveDemoProducts(prods);
      setIsModalOpen(false);
      fetchProducts();
      return;
    }
    try {
      if (formData.id) {
        await axios.put(`http://localhost:8080/api/products/${formData.id}`, formData);
        alert("Product Updated!");
      } else {
        await axios.post("http://localhost:8080/api/products", formData);
        alert("New Product Added!");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert("Error saving product. Check your backend console.");
    }
  };

  const inputCls = "input-premium";
  const labelCls = "flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2";

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <LayoutGrid className="text-violet-400" size={22} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white">Inventory</h2>
            <p className="text-slate-400 text-sm">Manage your stock and product details</p>
          </div>
        </div>
        <button onClick={openCreateModal} className="btn-primary text-sm px-5 py-2.5">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
                <th>Price</th>
                <th className="text-center">Manage</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <Package size={44} className="mx-auto text-slate-700 mb-3" />
                    <p className="text-slate-500 font-medium">No products listed</p>
                    <p className="text-slate-600 text-xs mt-1">Click "Add Product" to list your first item</p>
                  </td>
                </tr>
              ) : (
                products.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-white/[0.04] border border-white/[0.06] flex-shrink-0">
                          <img src={p.imageUrl || "https://placehold.co/44"} className="object-cover w-full h-full" alt="" />
                        </div>
                        <span className="font-bold text-white text-sm">{p.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                        p.stock < 5
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="font-mono font-bold text-white">₹{p.price}</td>
                    <td className="text-center">
                      <button
                        onClick={() => openEditModal(p)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
                      >
                        <Edit3 size={13} /> Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-strong gradient-border w-full max-w-lg rounded-2xl shadow-glass overflow-hidden animate-fadeUp">
            {/* Modal header */}
            <div className="px-6 py-5 border-b border-white/[0.07] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                  <Package size={16} className="text-indigo-400" />
                </div>
                <h3 className="text-lg font-black text-white">
                  {formData.id ? "Update Product" : "List New Product"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">
              <div>
                <label className={labelCls}><Tag size={12} /> Name</label>
                <input className={inputCls} placeholder="Enter product title..."
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}><DollarSign size={12} /> Price (₹)</label>
                  <input type="number" className={inputCls}
                    value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}><Package size={12} /> Stock</label>
                  <input type="number" className={inputCls}
                    value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                </div>
              </div>
              <div>
                <label className={labelCls}><Info size={12} /> Image URL</label>
                <input className={inputCls} placeholder="https://images.com/product.jpg"
                  value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <button onClick={handleSave} className="btn-primary w-full justify-center py-4">
                <Save size={16} /> {formData.id ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
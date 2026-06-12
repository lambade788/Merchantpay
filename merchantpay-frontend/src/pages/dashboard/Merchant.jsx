import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit3, Save, X, Plus, Package, DollarSign, Tag, Info } from "lucide-react";

export default function Merchant() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // This state handles both New and Existing products
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: "",
    merchantId: 1 // Default merchant ID
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // 🟢 Open Modal for NEW Product
  const openCreateModal = () => {
    setFormData({ name: "", price: "", stock: "", description: "", imageUrl: "", merchantId: 1 });
    setIsModalOpen(true);
  };

  // 🔵 Open Modal for EDITING Product
  const openEditModal = (product) => {
    setFormData({ ...product });
    setIsModalOpen(true);
  };

  // 💾 SAVE Logic (Handles both POST and PUT)
  const handleSave = async () => {
    try {
      if (formData.id) {
        // If ID exists, Update (PUT)
        await axios.put(`http://localhost:8080/api/products/${formData.id}`, formData);
        alert("Product Updated!");
      } else {
        // If no ID, Create (POST)
        await axios.post("http://localhost:8080/api/products", formData);
        alert("New Product Added!");
      }
      setIsModalOpen(false);
      fetchProducts(); // Refresh the list
    } catch (err) {
      alert("Error saving product. Check your backend console.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1120] text-slate-300 p-8">
      
      {/* HEADER WITH ADD BUTTON */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Inventory</h2>
          <p className="text-slate-500">Manage your stock and product details</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Plus size={20} /> Add New Product
        </button>
      </div>

      {/* PRODUCT LIST TABLE */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-widest">
            <tr>
              <th className="p-4">Product Name</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-center">Manage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden">
                    <img src={p.imageUrl || 'https://placehold.co/40'} className="object-cover w-full h-full" alt="" />
                  </div>
                  <span className="font-bold text-white">{p.name}</span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${p.stock < 5 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {p.stock} units
                  </span>
                </td>
                <td className="p-4 font-mono text-white">₹{p.price}</td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => openEditModal(p)}
                    className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
                  >
                    <Edit3 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🛠️ ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
            
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/30">
              <h3 className="text-xl font-bold text-white">
                {formData.id ? "Update Product" : "List New Product"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X /></button>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Product Name */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-2"><Tag size={14}/> Name</label>
                <input 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="Enter product title..."
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-2"><DollarSign size={14}/> Price (₹)</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-2"><Package size={14}/> Initial Stock</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none"
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-2"><Info size={14}/> Image Link</label>
                <input 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none"
                  placeholder="https://images.com/product.jpg"
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                />
              </div>
            </div>

            <div className="p-6 bg-slate-800/30 border-t border-slate-700">
              <button 
                onClick={handleSave}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Save size={20} /> {formData.id ? "Update Changes" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
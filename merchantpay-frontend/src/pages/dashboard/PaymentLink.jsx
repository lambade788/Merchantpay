import { useState } from "react";
import { createPaymentLink } from "../../api/paymentApi";
import { Link as LinkIcon, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

export default function PaymentLink() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState(null);

  const handleCreate = async () => {
    try {
      const res = await createPaymentLink({
        amount,
        description,
      });
      setLink(res);
    } catch (error) {
      console.error("Error creating link:", error);
    }
  };

  const paymentUrl = link
    ? `http://localhost:5173/pay/${link.linkId}`
    : "";

  return (
    <div className="min-h-screen bg-[#0a1120] text-slate-300 font-sans p-8">
      
      {/* HEADER SECTION */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Payment Links & QR</h1>
        <p className="text-slate-400">
          Create and manage payment links for your customers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
        
        {/* 🔹 LEFT: CREATE FORM */}
        <div className="bg-[#0f172a] p-8 rounded-2xl border border-slate-800 shadow-2xl transition-all hover:border-slate-700">
          <div className="flex items-center gap-3 mb-8">
            <LinkIcon size={20} className="text-emerald-400" />
            <h2 className="text-xl font-semibold text-white">Create Payment Link</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Amount (₹)</label>
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full bg-slate-800/40 border border-slate-700 rounded-xl py-3.5 px-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Purpose / Description</label>
              <input
                type="text"
                placeholder="e.g., Invoice #123, Product Purchase"
                className="w-full bg-slate-800/40 border border-slate-700 rounded-xl py-3.5 px-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              onClick={handleCreate}
              className="w-full bg-[#10b981] hover:bg-[#0da372] text-[#064e3b] font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/10 mt-4 active:scale-[0.98]"
            >
              Generate Payment Link
            </button>
          </div>
        </div>

        {/* 🔹 RIGHT: GENERATED LINK SECTION */}
        <div className="bg-[#0f172a] p-8 rounded-2xl border border-slate-800 border-dashed flex flex-col items-center justify-center text-center min-h-[400px]">
          {!link ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto">
                <LinkIcon size={24} className="text-slate-600" />
              </div>
              <p className="text-slate-500 font-medium">
                Generate a payment link to see<br />details and shareable URL
              </p>
            </div>
          ) : (
            <div className="w-full animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-emerald-400" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Link Created Successfully!</h3>
              <p className="text-slate-400 text-sm mb-6">You can now share this URL or QR code with your customer</p>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl mb-6 flex flex-col items-center gap-6">
                <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200">
                  <QRCodeCanvas 
                    value={paymentUrl} 
                    size={160}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"H"}
                    includeMargin={false}
                  />
                </div>
                
                <div className="w-full flex flex-col gap-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest text-left">Customer URL</span>
                  <p className="text-blue-400 break-all text-sm font-mono bg-blue-500/5 p-3 rounded-lg border border-blue-500/10 select-all text-left">
                    {paymentUrl}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigator.clipboard.writeText(paymentUrl)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition-all border border-slate-700"
                >
                  <Copy size={18} />
                  Copy Link
                </button>
                <a
                  href={paymentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-semibold py-3 px-6 rounded-xl transition-all border border-blue-500/20"
                >
                  <ExternalLink size={18} />
                  Test Link
                </a>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
import { useState } from "react";
import { createPaymentLink } from "../../api/paymentApi";
import { Link as LinkIcon, CheckCircle2, Copy, ExternalLink, Zap, QrCode } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

export default function PaymentLink() {
  const [amount, setAmount]           = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink]               = useState(null);
  const [loading, setLoading]         = useState(false);
  const [copied, setCopied]           = useState(false);

  const handleCreate = async () => {
    if (!amount) return;
    setLoading(true);
    try {
      const res = await createPaymentLink({ amount, description });
      setLink(res);
    } catch (error) {
      console.error("Error creating link:", error);
    } finally {
      setLoading(false);
    }
  };

  const paymentUrl = link ? `http://localhost:5173/pay/${link.linkId}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white mb-1">Payment Links & QR</h1>
        <p className="text-slate-400 text-sm">Create and share payment links with your customers instantly</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        
        {/* Create Form */}
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
              <LinkIcon size={18} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Create Payment Link</h2>
              <p className="text-slate-500 text-xs">Fill in the details below</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  placeholder="0.00"
                  className="input-premium pl-9 text-lg font-bold"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Purpose / Description
              </label>
              <input
                type="text"
                placeholder="e.g. Invoice #123, Product Purchase"
                className="input-premium"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* Quick amount buttons */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Quick Select</label>
              <div className="flex flex-wrap gap-2">
                {[100, 500, 1000, 5000].map(a => (
                  <button
                    key={a}
                    onClick={() => setAmount(String(a))}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      amount === String(a)
                        ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                        : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white"
                    }`}
                  >
                    ₹{a.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={!amount || loading}
              className="btn-primary w-full justify-center py-4 text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Zap size={16} /> Generate Payment Link</>
              )}
            </button>
          </div>
        </div>

        {/* Result Card */}
        <div className={`card flex flex-col items-center justify-center min-h-[420px] p-8 transition-all duration-500 ${
          link ? "border-indigo-500/25" : "border-dashed"
        }`}>
          {!link ? (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto border border-white/[0.06]">
                <QrCode size={36} className="text-slate-600" />
              </div>
              <div>
                <p className="text-slate-400 font-semibold">No link generated yet</p>
                <p className="text-slate-600 text-sm mt-1">Fill the form and click Generate</p>
              </div>
            </div>
          ) : (
            <div className="w-full animate-fadeIn space-y-6">
              {/* Success header */}
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-black text-white">Link Created!</h3>
                <p className="text-slate-400 text-sm mt-1">Share this QR or URL with your customer</p>
              </div>

              {/* QR + URL */}
              <div className="bg-white/[0.03] border border-white/[0.06] p-5 rounded-xl flex flex-col items-center gap-5">
                <div className="bg-white p-3 rounded-xl shadow-lg">
                  <QRCodeCanvas value={paymentUrl} size={150} bgColor="#ffffff" fgColor="#000000" level="H" includeMargin={false} />
                </div>
                <div className="w-full">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 block">Payment URL</span>
                  <p className="text-indigo-300 break-all text-xs font-mono bg-indigo-500/[0.07] p-3 rounded-lg border border-indigo-500/[0.15] select-all">
                    {paymentUrl}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border transition-all ${
                    copied
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                      : "btn-secondary"
                  }`}
                >
                  {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                <a
                  href={paymentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 font-bold py-3 px-5 rounded-xl text-sm transition-all"
                >
                  <ExternalLink size={16} /> Test
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
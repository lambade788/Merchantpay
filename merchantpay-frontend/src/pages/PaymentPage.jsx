import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Smartphone, CreditCard, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { getPaymentLink, payNow } from "../api/paymentApi";

const PaymentPage = () => {
  const { linkId }   = useParams();
  const navigate     = useNavigate();
  const [data, setData]                   = useState(null);
  const [loading, setLoading]             = useState(false);
  const [success, setSuccess]             = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("upi");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPaymentLink(linkId);
        setData(res);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, [linkId]);

  const handlePay = async () => {
    try {
      setLoading(true);
      const res = await payNow(linkId, selectedMethod.toUpperCase());
      if (res && res.status === "SUCCESS") {
        setSuccess(true);
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        throw new Error("Payment not successful");
      }
    } catch (err) {
      alert("❌ Payment Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-landing flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading payment details…</p>
        </div>
      </div>
    );
  }

  const isAlreadyPaid = data.status === "PAID";

  const methods = [
    {
      id: "upi",
      label: "Pay with UPI",
      sub: "GPay, PhonePe, Paytm",
      icon: Smartphone,
      activeColor: "border-indigo-500/40 bg-indigo-500/[0.07] ring-1 ring-indigo-500/30",
      iconActive: "bg-indigo-500/20 text-indigo-400",
    },
    {
      id: "card",
      label: "Pay with Card",
      sub: "Visa, Mastercard, RuPay",
      icon: CreditCard,
      activeColor: "border-violet-500/40 bg-violet-500/[0.07] ring-1 ring-violet-500/30",
      iconActive: "bg-violet-500/20 text-violet-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-landing flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full animate-float"
          style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.10), transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full animate-float"
          style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.08), transparent)", animationDelay: "3s" }} />
      </div>

      <div className="w-full max-w-sm relative z-10 animate-fadeUp">
        <div className="glass-strong gradient-border rounded-2xl overflow-hidden shadow-glass">
          
          {/* Branding */}
          <div className="pt-8 pb-5 px-6 flex flex-col items-center text-center border-b border-white/[0.06]">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-black mb-3 shadow-glow-indigo"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              M
            </div>
            <h1 className="text-white text-base font-black tracking-tight">MerchantPay</h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Secure Gateway</p>
          </div>

          {/* Success / Already Paid */}
          {(isAlreadyPaid || success) ? (
            <div className="p-10 text-center animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={40} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-black text-white mb-2">
                {success ? "Payment Successful!" : "Already Paid"}
              </h2>
              <p className="text-slate-400 text-sm px-4">
                {success ? "Redirecting you to dashboard…" : "This transaction is already complete."}
              </p>
            </div>
          ) : (
            <>
              {/* Amount */}
              <div className="py-6 px-6 text-center border-b border-white/[0.06]">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 truncate">
                  {data.description || "Payment Request"}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-slate-300 text-xl font-medium">₹</span>
                  <span className="text-4xl font-black text-white tracking-tight">{data.amount}</span>
                </div>
              </div>

              {/* Methods */}
              <div className="p-5 space-y-3">
                <p className="text-slate-500 text-xs font-semibold mb-1">Select Payment Method</p>
                {methods.map(m => {
                  const Icon = m.icon;
                  const isSelected = selectedMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left ${
                        isSelected ? m.activeColor : "bg-white/[0.03] border-white/[0.07] hover:border-white/[0.12]"
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl ${isSelected ? m.iconActive : "bg-white/[0.05] text-slate-400"}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold">{m.label}</p>
                        <p className="text-slate-500 text-[10px]">{m.sub}</p>
                      </div>
                      {isSelected && (
                        <div className="ml-auto w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Pay button */}
              <div className="px-5 pb-6">
                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><ArrowRight size={18} /> Pay ₹{data.amount}</>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-slate-600">
                  <Lock size={11} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">256-bit SSL Encrypted</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
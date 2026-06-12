import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Smartphone, CreditCard, Lock, CheckCircle2 } from "lucide-react";
import { getPaymentLink, payNow } from "../api/paymentApi";

const PaymentPage = () => {
  const { linkId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

    console.log("API RESPONSE:", res);

    // ✅ Check backend response instead of HTTP status
    if (res && res.status === "SUCCESS") {
      setSuccess(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } else {
      console.error("Payment failed response:", res);
      throw new Error("Payment not successful");
    }

  } catch (err) {
    alert("❌ Payment Failed");
  } finally {
    setLoading(false);
  }
 };

  if (!data) return (
    <div className="min-h-screen bg-[#0a1120] flex items-center justify-center">
      <div className="animate-pulse text-emerald-400 font-medium tracking-widest text-xs">LOADING...</div>
    </div>
  );

  const isAlreadyPaid = data.status === "PAID";

  return (
    <div className="min-h-screen bg-[#0a1120] flex items-center justify-center p-6 font-sans text-slate-300">
      {/* Reduced max-width from md (448px) to sm (384px) for a tighter look */}
      <div className="w-full max-w-sm bg-[#0f172a] rounded-[1.5rem] border border-slate-800 shadow-2xl overflow-hidden transition-all duration-500">
        
        {/* Branding Header - Reduced padding */}
        <div className="pt-8 pb-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center text-white text-xl font-bold mb-3 shadow-lg shadow-emerald-500/20">
            Z
          </div>
          <h1 className="text-white text-lg font-bold tracking-tight">MerchantPay</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Secure Gateway</p>
        </div>

        <div className="px-6"><div className="h-[1px] bg-slate-800 w-full"></div></div>

        {isAlreadyPaid || success ? (
          <div className="p-10 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {success ? "Success!" : "Already Paid"}
            </h2>
            <p className="text-slate-500 text-xs px-4">
              {success ? "Redirecting you shortly..." : "This transaction is complete."}
            </p>
          </div>
        ) : (
          <>
            {/* Amount Section - Tightened spacing */}
            <div className="py-5 text-center">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 px-4 truncate">
                {data.description || "Payment Request"}
              </p>
              <div className="text-[#10b981] text-4xl font-bold tracking-tighter flex items-center justify-center">
                <span className="text-2xl mr-1 font-medium">₹</span>
                {data.amount}
              </div>
            </div>

            <div className="px-6"><div className="h-[1px] bg-slate-800 w-full"></div></div>

            {/* Method Selection - Compact items */}
            <div className="p-6 space-y-3">
              <p className="text-slate-500 text-xs font-medium mb-2">Select Method</p>
              
              <button 
                onClick={() => setSelectedMethod("upi")}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 text-left ${
                  selectedMethod === 'upi' 
                  ? 'bg-emerald-500/5 border-emerald-500/40 ring-1 ring-emerald-500/40' 
                  : 'bg-slate-800/30 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className={`p-2 rounded-lg ${selectedMethod === 'upi' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Smartphone size={20} />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">Pay with UPI</p>
                  <p className="text-slate-500 text-[10px]">GPay, PhonePe, Paytm</p>
                </div>
              </button>

              <button 
                onClick={() => setSelectedMethod("card")}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 text-left ${
                  selectedMethod === 'card' 
                  ? 'bg-blue-500/5 border-blue-500/40 ring-1 ring-blue-500/40' 
                  : 'bg-slate-800/30 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className={`p-2 rounded-lg ${selectedMethod === 'card' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">Pay with Card</p>
                  <p className="text-slate-500 text-[10px]">Visa, Mastercard, RuPay</p>
                </div>
              </button>
            </div>

            {/* Action Button */}
            <div className="px-6 pb-6">
              <button 
                onClick={handlePay}
                disabled={loading}
                className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-[0.97] text-sm ${
                  loading 
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-[#334155] hover:bg-[#475569] text-white shadow-black/20'
                }`}
              >
                {loading ? "Processing..." : `Pay ₹${data.amount}`}
              </button>
              
              <div className="flex items-center justify-center gap-2 mt-5 text-slate-600">
                <Lock size={12} />
                <span className="text-[9px] font-bold uppercase tracking-widest italic">Secured by ZenithPay</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
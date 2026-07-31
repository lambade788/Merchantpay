import { createContext, useContext, useEffect, useState } from "react";
import { Volume2, CheckCircle, X } from "lucide-react";

// Create Context
const RealtimeContext = createContext();

// Provider
export const RealtimeProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // TTS Voice Synthesis Speaker
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    
    try {
      // Cancel any ongoing speech to avoid queuing delays
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower for clear, professional broadcast voice
      utterance.pitch = 1.0;
      
      // Try to find a premium English voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => v.lang.includes("en-IN") || v.lang.includes("en-GB") || v.lang.includes("en-US")
      );
      if (preferredVoice) utterance.voice = preferredVoice;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech Synthesis failed:", e);
    }
  };

  // Global trigger function to display visual notification and voice output
  const triggerPaymentNotification = (amount, method) => {
    const id = Math.random().toString(36).substring(2, 9);
    const text = `Received payment of ₹${amount} via ${method || "UPI"}!`;
    
    // TTS Voice announcement
    speakText(`Received payment of ${amount} rupees via ${method || "UPI"}`);

    const newNotification = {
      id,
      amount,
      method,
      text,
      timestamp: new Date().toLocaleTimeString(),
    };

    setNotifications((prev) => [...prev, newNotification]);

    // Automatically remove toast after 6 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 6000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Sync handles for Demo Mode and SSE
  useEffect(() => {
    // 1. Cross-tab synchronization using storage events (for Demo Mode)
    const handleStorageChange = (e) => {
      if (e.key === "demo_payment_trigger" && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          triggerPaymentNotification(data.amount, data.method);
        } catch (err) {
          console.error("Failed to parse storage payment trigger:", err);
        }
      }
    };

    // 2. Same-tab synchronization using custom event (for Demo Mode)
    const handleLocalTrigger = (e) => {
      const { amount, method } = e.detail;
      triggerPaymentNotification(amount, method);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local_payment_trigger", handleLocalTrigger);

    // 3. SSE Stream Listener for backend payments
    const isDemo = localStorage.getItem("isDemoMode") === "true";
    let eventSource;

    if (!isDemo) {
      const connectSSE = () => {
        console.log("📡 Connecting to Real-time Payment Stream...");
        eventSource = new EventSource("http://localhost:8080/api/stream");

        eventSource.addEventListener("connected", (event) => {
          console.log("✅ SSE Connection Handshake:", event.data);
        });

        eventSource.addEventListener("payment_success", (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("💰 SSE Payment Success Event:", data);
            triggerPaymentNotification(data.amount, data.method);
          } catch (err) {
            console.error("Failed to parse payment success event:", err);
          }
        });

        eventSource.onerror = (err) => {
          console.error("❌ SSE Connection Error. Retrying in 10s...", err);
          eventSource.close();
          setTimeout(connectSSE, 10000); // Auto reconnect in 10s
        };
      };

      connectSSE();
    }

    // Load voices early
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local_payment_trigger", handleLocalTrigger);
      if (eventSource) eventSource.close();
    };
  }, []);

  return (
    <RealtimeContext.Provider value={{ triggerPaymentNotification }}>
      {children}

      {/* Floating Glassmorphic Notifications Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="pointer-events-auto flex items-start gap-4 p-4 rounded-xl border border-emerald-500/30 bg-slate-900/80 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.15)] text-white transition-all duration-300 animate-slideInRight"
          >
            {/* Pulsing indicator */}
            <div className="relative mt-1">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                <Volume2 size={16} className="text-emerald-400 animate-pulse" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-400" />
                <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                  Payment Successful
                </span>
              </div>
              <p className="text-sm font-bold text-white leading-tight">
                {n.text}
              </p>
              <span className="text-[10px] text-slate-500 font-bold block">
                {n.timestamp}
              </span>
            </div>

            {/* Close button */}
            <button
              onClick={() => removeNotification(n.id)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </RealtimeContext.Provider>
  );
};

// Hook
export const useRealtime = () => useContext(RealtimeContext);
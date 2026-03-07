import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Coins, Loader2, Zap, Shield, Rocket } from "lucide-react";
import { serverUrl } from "../App";

function Pricing() {
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

  const plans = [
    {
      key: "free",
      name: "Free Explorer",
      price: "₹0",
      credits: 100,
      icon: <Zap size={24} className="text-blue-400" />,
      description: "Perfect to explore GenWeb.ai",
      features: ["AI website generation", "Responsive HTML output", "Basic animations"],
      popular: false,
      button: "Get Started",
    },
    {
      key: "pro",
      name: "Pro Developer",
      price: "₹499",
      credits: 500,
      icon: <Rocket size={24} className="text-cyan-400" />,
      description: "Best for freelancers and independent developers.",
      features: ["Everything in Free", "Advanced UI/UX layouts", "Multi-page SPA support", "Priority AI processing"],
      popular: true,
      button: "Upgrade to Pro",
    },
    {
      key: "enterprise",
      name: "Enterprise",
      price: "₹1499",
      credits: 1000,
      icon: <Shield size={24} className="text-indigo-400" />,
      description: "For agencies and power users requiring high volume.",
      features: ["Everything in Pro", "Unlimited project history", "Commercial usage rights", "24/7 priority support"],
      popular: false,
      button: "Get Premium",
    },
  ];

  const handleSubscription = async (planKey) => {
    if (planKey === "free") {
      navigate("/dashboard");
      return;
    }

    setLoading(planKey);
    try {
      const response = await fetch(`${serverUrl}/api/billing/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ planType: planKey }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: "INR",
        name: "GenWeb.ai",
        description: `Upgrade to ${planKey} plan`,
        order_id: data.orderId,
        handler: async function (response) {
          const verifyRes = await fetch(`${serverUrl}/api/billing/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ ...response, planType: planKey }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            navigate("/dashboard", { state: { paymentSuccess: true } });
          }
        },
        modal: { ondismiss: () => setLoading(null) },
        prefill: { email: "user@example.com" },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setLoading(null);
      console.error("Payment failed", error);
      alert("System Error: Transaction could not be initialized.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020203] text-zinc-100 px-6 pt-16 pb-24 font-sans">
      
      {/* FUTURISTIC BACKGROUND MESH */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      </div>

      <button
        className="relative z-10 mb-8 flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-500 hover:text-blue-400 transition-all uppercase"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={14} /> Back_to_Terminal
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-4xl mx-auto text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] uppercase tracking-[0.2em] text-blue-400 mb-6">
          <Zap size={12} /> Neural Pricing Engine v4.0
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 leading-none">
          SIMPLE, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-500">TRANSPARENT</span> ACCESS.
        </h1>
        <p className="text-zinc-500 text-lg max-w-xl mx-auto font-light">
          Acquire credits through our secure gateway. Architect your digital vision instantly.
        </p>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -10 }}
            className={`relative rounded-[32px] p-10 border transition-all duration-500 ${
              p.popular
                ? "bg-zinc-900/40 border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.1)] backdrop-blur-xl"
                : "bg-zinc-900/20 border-white/5 hover:border-blue-500/20 backdrop-blur-md"
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                Most Popular
              </span>
            )}

            <div className="mb-6">{p.icon}</div>
            <h2 className="text-2xl font-bold mb-2 tracking-tight">{p.name}</h2>
            <p className="text-zinc-500 text-xs mb-8 leading-relaxed">{p.description}</p>
            
            <div className="flex items-end gap-1 mb-8">
              <span className="text-5xl font-black tracking-tighter">{p.price}</span>
              <span className="text-[10px] font-mono uppercase text-zinc-600 mb-2 ml-2">/ one-time</span>
            </div>

            <div className="h-[1px] w-full bg-white/5 mb-8" />

            <ul className="space-y-4 mb-10">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-xs text-zinc-400">
                  <div className="p-0.5 rounded-full bg-blue-500/20 border border-blue-500/30">
                    <Check size={10} className="text-blue-400" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 mb-10 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="p-2 rounded-xl bg-yellow-500/10">
                <Coins size={18} className="text-yellow-500" />
              </div>
              <span className="text-sm font-bold tracking-tight">{p.credits} Credits</span>
            </div>

            <motion.button
              onClick={() => handleSubscription(p.key)}
              disabled={loading !== null}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${
                p.popular 
                  ? "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_25px_rgba(37,99,235,0.3)]" 
                  : "bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10"
              } ${loading !== null ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading === p.key ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={14} /> SYNCING...
                </div>
              ) : (
                p.button
              )}
            </motion.button>
          </motion.div>
        ))}
      </div>
      
      {/* FOOTER STRIP */}
      <footer className="mt-20 border-t border-white/5 pt-10 text-center text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-700">
        © 2026 GENWEB_PROTOCOL // SECURE_TRANSACTIONS_ONLY
      </footer>
    </div>
  );
}

export default Pricing;
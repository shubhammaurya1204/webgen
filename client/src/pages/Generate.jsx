import { ArrowLeft, Sparkles, Zap, Cpu, Rocket, Info } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { serverUrl } from "../App";

const PHASES = [
  "Initializing Neural Engine...",
  "Analyzing Project Architecture...",
  "Synthesizing Responsive Layouts...",
  "Generating Production-Ready Code...",
  "Injecting Interactive Logic...",
  "Final Security & Quality Audit...",
];

function Generate() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [error, setError] = useState("");

  const handleGenerateWebsite = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");

    try {
      const result = await axios.post(
        `${serverUrl}/api/website/generate`,
        { prompt },
        { withCredentials: true }
      );

      const websiteId = result.data.websiteId;
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        navigate(`/editor/${websiteId}`);
      }, 500);
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Generation Protocol Failed. Try Again.");
    }
  };

  useEffect(() => {
    if (!loading) {
      setPhaseIndex(0);
      setProgress(0);
      return;
    }
    let value = 0;
    const interval = setInterval(() => {
      const increment =
        value < 30 ? Math.random() * 2 : value < 70 ? Math.random() * 1 : Math.random() * 0.5;
      value += increment;
      if (value >= 98) value = 98;
      
      const phase = Math.min(
        Math.floor((value / 100) * PHASES.length),
        PHASES.length - 1
      );
      
      setProgress(Math.floor(value));
      setPhaseIndex(phase);
    }, 1000);
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div className="relative min-h-screen bg-[#020203] text-zinc-100 overflow-x-hidden">
      {/* FUTURISTIC BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      </div>

      {/* Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/60 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={18} />
            </button>
            <div className="text-sm font-mono tracking-widest text-blue-500 uppercase">System_Generate</div>
          </div>
          <button
            className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all"
            onClick={() => { setPrompt(""); setProgress(0); setLoading(false); }}
          >
            RESET_SESSION
          </button>
        </div>
      </nav>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative overflow-hidden inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] uppercase tracking-[0.2em] text-blue-400 mb-8 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                    >
                      {/* THE SHINE EFFECT */}
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          ease: "easeInOut",
                          repeatDelay: 1, // Delay between each shine loop
                        }}
                        className="absolute inset-0 z-0 w-full h-full bg-gradient-to-r from-transparent via-blue-400/30 to-transparent skew-x-[-20deg]"
                      />
          
                      {/* CONTENT */}
                      <Zap size={12} className="relative z-10" />
                      <span className="relative z-10">Next-Gen AI Website Engine</span>
                    </motion.div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-none">
            FROM IDEA TO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-500">REALITY.</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto font-light">
            Enter your specifications. Our neural network will architect, design, and deploy your production-ready interface.
          </p>
        </motion.div>

        {/* Input Section */}
        <div className="relative group mb-10">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-[32px] blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
          <div className="relative">
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              disabled={loading}
              placeholder="E.g. A dark futuristic portfolio for a creative developer with a bento-grid layout..."
              className="w-full h-64 p-8 rounded-[28px] bg-[#0b0b0d] border border-white/10 outline-none resize-none text-base leading-relaxed placeholder:text-zinc-700 focus:border-blue-500/50 transition-all"
            />
            <div className="absolute bottom-6 right-8 text-[10px] font-mono text-zinc-600">
              READY_FOR_INPUT // LN 01
            </div>
          </div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono text-center">
            {error}
          </motion.div>
        )}

        {/* Action Button */}
        <div className="flex justify-center mb-20">
          {!loading ? (
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(37,99,235,0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateWebsite}
              className={`group flex items-center gap-3 px-12 py-5 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all ${
                prompt.trim() 
                ? "bg-blue-600 text-white" 
                : "bg-zinc-900 text-zinc-600 cursor-not-allowed border border-white/5"
              }`}
            >
              <Zap size={18} className={prompt.trim() ? "animate-pulse" : ""} />
              Synthesize Website
            </motion.button>
          ) : (
            <div className="w-full max-w-lg space-y-6">
              <div className="flex justify-between items-end mb-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-blue-500 uppercase tracking-tighter">Current_Phase</p>
                  <h4 className="text-sm font-bold text-zinc-200">{PHASES[phaseIndex]}</h4>
                </div>
                <span className="text-2xl font-black text-blue-500 font-mono">{progress}%</span>
              </div>
              <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5 p-[2px]">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
              <div className="flex justify-center gap-8 py-4">
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" /> SECURE_LINK: OK
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" /> NEURAL_LOAD: STABLE
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PROMPT TIPS SECTION (Extra Section) */}
        {!loading && (
          <motion.section 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-white/5"
          >
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Info size={16} className="text-blue-400" />
              </div>
              <h5 className="text-xs font-bold mb-2 uppercase tracking-wider">Specific Styles</h5>
              <p className="text-xs text-zinc-500 leading-relaxed">Mention styles like "Minimalist", "Bento Grid", or "Saas Landing" for better accuracy.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                <Cpu size={16} className="text-cyan-400" />
              </div>
              <h5 className="text-xs font-bold mb-2 uppercase tracking-wider">Features</h5>
              <p className="text-xs text-zinc-500 leading-relaxed">List pages like "Pricing", "Testimonials", or "Contact Form" explicitly in your prompt.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                <Rocket size={16} className="text-indigo-400" />
              </div>
              <h5 className="text-xs font-bold mb-2 uppercase tracking-wider">Target Audience</h5>
              <p className="text-xs text-zinc-500 leading-relaxed">Define who the site is for (e.g., "for high-end lawyers") to set the right tone.</p>
            </div>
          </motion.section>
        )}
      </div>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-white/5 py-10 px-6 opacity-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em]">
            <div>© GenWeb_Protocol v4.0.2</div>
            <div className="flex gap-8">
                <span className="hover:text-blue-500 cursor-pointer transition-colors">Safety_Log</span>
                <span className="hover:text-blue-500 cursor-pointer transition-colors">Neural_Stats</span>
            </div>
        </div>
      </footer>
    </div>
  );
}

export default Generate;
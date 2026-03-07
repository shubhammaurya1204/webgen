import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoginModal from "../components/loginModal";
import { useDispatch, useSelector } from "react-redux";
import {
  Coins,
  Share2,
  Check,
  Zap,
  Shield,
  Globe,
  Cpu,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";

function Home() {
  const highlights = [
    {
      title: "Neural Generation",
      desc: "Advanced AI models crafting production-ready code.",
      icon: <Cpu className="text-blue-400" />,
    },
    {
      title: "Adaptive Flux",
      desc: "Fully responsive layouts that morph perfectly across any device screen.",
      icon: <Globe className="text-cyan-400" />,
    },
    {
      title: "Secure Deployment",
      desc: "Instant secure hosting for all your generated masterpieces.",
      icon: <Shield className="text-indigo-400" />,
    },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openLogin, setOpenLogin] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const [openProfile, setOpenProfile] = useState(false);
  const [websites, setWebsites] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = async (e, site) => {
    e.stopPropagation();
    const url = `${window.location.origin}/site/${site._id}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(site._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      setOpenProfile(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userData) return;
    const handleGetAllWebsites = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/website/get-all`, {
          withCredentials: true,
        });
        setWebsites(result.data.websites);
      } catch (error) {
        console.log(error);
      }
    };
    handleGetAllWebsites();
  }, [userData]);

  return (
    <div className="relative min-h-screen bg-[#020203] text-zinc-100 overflow-hidden font-sans">
      {/* FUTURISTIC BACKGROUND MESH */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />
      </div>

      {/* HEADER SECTION */}
      <motion.nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/60 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              <Zap size={18} fill="white" />
            </div>
            <div className="text-xl font-bold tracking-tighter uppercase italic">
              GEN<span className="text-blue-500">WEB</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {userData ? <button
              onClick={() => navigate("/pricing")}
              className="hidden md:block text-sm text-zinc-400 hover:text-blue-400 transition-colors"
            >
              Pricing
            </button> 
            : <button
              onClick={() => setOpenLogin(true)}
              className="hidden md:block text-sm text-zinc-400 hover:text-blue-400 transition-colors"
            >
              Pricing
            </button>}
            {userData ? (
              <div className="flex items-center gap-4">
                <div
                  onClick={() => navigate("/pricing")}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 cursor-pointer hover:bg-blue-500/20 transition"
                >
                  <Coins size={14} className="text-blue-400" />
                  <span>{userData.credits} Credits</span>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setOpenProfile(!openProfile)}
                    className="relative group"
                  >
                    <div className="absolute -inset-0.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-50 blur transition duration-300" />
                    <img
                      src={
                        userData?.avatar ||
                        `https://ui-avatars.com/api/?name=${userData.name}`
                      }
                      className="relative h-9 w-9 rounded-full border border-white/10 object-cover"
                    />
                  </button>
                  <AnimatePresence>
                    {openProfile && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-56 rounded-xl bg-[#0b0b0d] border border-white/10 shadow-2xl p-2 z-[60]"
                      >
                        <button
                          onClick={() => navigate("/pricing")}
                          className="md:hidden flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm cursor-pointer hover:bg-white/10 transition"
                        >
                          <Coins size={14} className="text-yellow-400 " />
                          <span className="text-zinc-300">Credits</span>
                          <span>{userData.credits}</span>
                          <span className="font-semibold">+</span>
                        </button>
                        <button
                          onClick={() => navigate("/dashboard")}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 rounded-lg"
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={handleLogOut}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg"
                        >
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setOpenLogin(true)}
                className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-sm font-semibold shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all active:scale-95"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <section className="relative pt-52 pb-20 px-6 z-10">
        <div className="max-w-5xl mx-auto text-center">
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
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl md:text-8xl leading-tight font-black tracking-tighter"
          >
            WEBSITES <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-blue-900/50">
              REIMAGINED.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 max-w-xl mx-auto text-zinc-500 text-lg md:text-xl font-light"
          >
            Generate high-performance, pixel-perfect websites from simple text
            prompts using our specialized neural architecture.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 mt-12"
          >
            <button
              onClick={() =>
                userData ? navigate("/dashboard") : setOpenLogin(true)
              }
              className="group px-8 py-4 rounded-full bg-white text-black font-bold flex items-center gap-2 hover:bg-blue-50 transition-all"
            >
              {userData ? "ENTER DASHBOARD" : "START BUILDING"}{" "}
              <ChevronRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </motion.div>
        </div>
      </section>

      {/* LIVE STATS STRIP */}
      <div className="w-full border-y border-white/5 bg-white/[0.02] backdrop-blur-sm py-6 mb-32 overflow-hidden">
        <div className="flex whitespace-nowrap gap-20 animate-infinite-scroll">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 text-xs font-mono text-zinc-600 uppercase"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              SYSTEM_STATUS: <span className="text-zinc-300">OPTIMAL</span>
              <span className="text-zinc-800">|</span>
              SITES_GENERATED: <span className="text-zinc-300">12,402</span>
              <span className="text-zinc-800">|</span>
              LATENCY: <span className="text-zinc-300">142ms</span>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURE GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-blue-500/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.05)]"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                {h.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{h.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{h.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RECENT PROJECTS SECTION */}
      {userData && websites?.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-40">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h3 className="text-3xl font-bold uppercase tracking-tighter italic">
                Terminal Access
              </h3>
              <p className="text-zinc-500 font-mono text-xs mt-2 uppercase tracking-widest">
                Active session: {userData.name}
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-xs font-mono text-blue-500 hover:text-blue-400 uppercase tracking-widest"
            >
              RESTORE_ALL_FILES_{"&gt;"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {websites.slice(0, 3).map((w, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group relative rounded-3xl bg-black border border-white/5 overflow-hidden hover:border-blue-500/50 transition-all duration-500"
              >
                <div className="px-5 py-3 bg-[#0a0a0c] border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500/20" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                      <div className="w-2 h-2 rounded-full bg-green-500/20" />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-600 truncate max-w-[100px]">
                      {w.title}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(e, w);
                    }}
                    className="text-zinc-600 hover:text-blue-400 transition-colors"
                  >
                    {copiedId === w._id ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <Share2 size={14} />
                    )}
                  </button>
                </div>

                <div className="h-56 relative overflow-hidden group-hover:opacity-40 transition-opacity">
                  <iframe
                    srcDoc={w.latestCode}
                    title={w.title}
                    className="w-[1280px] h-[800px] border-none origin-top-left scale-[0.2] absolute pointer-events-none grayscale group-hover:grayscale-0 transition-all duration-700"
                    style={{ width: "500%", height: "500%" }}
                  />
                </div>

                <div
                  onClick={() => navigate(`/editor/${w._id}`)}
                  className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <div className="px-6 py-2 rounded-full bg-blue-600 text-white text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                    Launch Editor
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CORE PROCESS */}
      <section className="max-w-7xl mx-auto px-6 pb-40 relative">
        <h2 className="text-center text-4xl font-black mb-20 tracking-tighter uppercase italic">
          The Core Process
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          {[
            {
              step: "01",
              label: "PROMPT",
              text: "Submit your vision in natural language.",
            },
            {
              step: "02",
              label: "SYNTHESIZE",
              text: "AI constructs component logic and styling.",
            },
            {
              step: "03",
              label: "DEPLOY",
              text: "One-click launch to the global edge network.",
            },
          ].map((s, i) => (
            <div key={i} className="relative text-center">
              <div className="text-8xl font-black text-white/[0.02] absolute -top-10 left-1/2 -translate-x-1/2 select-none">
                {s.step}
              </div>
              <div className="relative z-10">
                <h4 className="text-blue-500 font-mono text-sm tracking-widest mb-4">
                  {s.label}
                </h4>
                <p className="text-zinc-500 text-sm max-w-[200px] mx-auto leading-relaxed font-light">
                  {s.text}
                </p>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute top-4 left-[80%] w-full h-[1px] bg-gradient-to-r from-blue-500/30 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6 bg-black/40 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm font-bold tracking-tighter uppercase italic">
            GENWEB<span className="text-blue-500">.AI</span>
          </div>
          <div className="flex gap-8 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
            <span className="hover:text-blue-500 cursor-pointer transition-colors">
              Security
            </span>
            <span className="hover:text-blue-500 cursor-pointer transition-colors">
              API_Docs
            </span>
            <span className="hover:text-blue-500 cursor-pointer transition-colors">
              Protocol
            </span>
          </div>
          <div className="text-[10px] font-mono text-zinc-700">
            ©{new Date().getFullYear()} — NODE_01
          </div>
        </div>
      </footer>

      {openLogin && (
        <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
      )}

      {/* GLOBAL CSS FOR INFINITE SCROLL */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          display: flex;
          width: max-content;
          animation: infinite-scroll 40s linear infinite;
        }
      `,
        }}
      />
    </div>
  );
}

export default Home;


import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import {
  Code2,
  MessageSquare,
  Monitor,
  MonitorCheck,
  Rocket,
  Send,
  X,
  ChevronLeft,
  Terminal,
  ExternalLink,
  Cpu
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Editor from "@monaco-editor/react";

function WebsiteEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [website, setWebsite] = useState(null);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [messages, setMessages] = useState([]);
  const iframeRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [thinkingIndex, setThinkingIndex] = useState(0);

  const thinkingSteps = [
    "PARSING_NEURAL_REQUEST...",
    "ARCHITECTING_DOM_STRUCTURE...",
    "OPTIMIZING_FLUX_STYLING...",
    "INJECTING_INTERACTIVE_LOGIC...",
    "SYNCHRONIZING_UI_LAYER...",
  ];

  const handleDeploy = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/website/deploy/${website._id}`, { withCredentials: true });
      setWebsite((prev) => ({ ...prev, deployed: true, deployUrl: result.data.url }));
      window.open(result.data.url, "_blank");
    } catch (error) {
      alert("❌ Deployment Protocol Failed");
    }
  };

  const handleUpdate = async () => {
    if (!prompt) return;
    setUpdateLoading(true);
    const text = prompt;
    setPrompt("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    try {
      const result = await axios.post(`${serverUrl}/api/website/update/${id}`, { prompt: text }, { withCredentials: true });
      setUpdateLoading(false);
      setMessages((m) => [...m, { role: "ai", content: result.data.message }]);
      setCode(result.data.code);
    } catch (error) {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    if (!updateLoading) return;
    const interval = setInterval(() => {
      setThinkingIndex((i) => (i + 1) % thinkingSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [updateLoading]);

  useEffect(() => {
    const handleGetWebsite = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/website/get-by-id/${id}`, { withCredentials: true });
        setWebsite(result.data);
        setCode(result.data.latestCode);
        setMessages(result.data.conversation);
      } catch (error) {
        setError(error.response?.data?.message || "Internal System Error");
      }
    };
    handleGetWebsite();
  }, [id]);

  useEffect(() => {
    if (!iframeRef.current || !code) return;
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [code]);

  if (error) return <div className="h-screen flex items-center justify-center bg-[#020203] text-red-500 font-mono tracking-tighter uppercase"> {error} </div>;
  if (!website) return <div className="h-screen flex items-center justify-center bg-[#020203]"><div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen w-screen flex bg-[#020203] text-zinc-100 overflow-hidden font-sans">
      {/* GLOBAL BACKGROUND GLOW */}
      <div className="fixed top-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[380px] flex-col border-r border-white/5 bg-black/40 backdrop-blur-xl relative z-10">
        <div className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition group">
              <ChevronLeft size={18} className="text-zinc-400 group-hover:text-blue-400" />
            </button>
            <span className="font-bold tracking-tight truncate max-w-[180px]">{website.title}</span>
          </div>
          <Terminal size={16} className="text-blue-500/50" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((m, i) => (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[90%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-lg ${
                m.role === "user" 
                ? "bg-blue-600 text-white rounded-tr-none" 
                : "bg-white/5 border border-white/10 text-zinc-300 rounded-tl-none"
              }`}>
                {m.content}
              </div>
            </motion.div>
          ))}
          {updateLoading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono flex items-center gap-3 animate-pulse">
                <Cpu size={14} className="animate-spin" />
                {thinkingSteps[thinkingIndex]}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-black/40 border-t border-white/5">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-500" />
            <div className="relative flex gap-2">
              <input
                placeholder="Request System Modification..."
                onChange={(e) => setPrompt(e.target.value)}
                value={prompt}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                className="flex-1 bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-all"
              />
              <button onClick={handleUpdate} disabled={updateLoading} className="p-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/20">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Preview Container */}
      <main className="flex-1 flex flex-col relative bg-[#050507]">
        <header className="h-16 px-6 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-4">
             <button onClick={() => setShowChat(!showChat)} className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10">
               <MessageSquare size={18} />
             </button>
             <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Live_Core_Preview
             </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setShowCode(!showCode)} className={`p-2 rounded-lg transition-all ${showCode ? "bg-blue-600 text-white" : "bg-white/5 text-zinc-400 hover:bg-white/10"}`}>
              <Code2 size={18} />
            </button>
            <button onClick={() => setShowFullPreview(true)} className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10">
              <Monitor size={18} />
            </button>
            <div className="w-px h-6 bg-white/10 mx-1" />
            {website.deployed ? (
              <button onClick={() => window.open(website.deployUrl, "_blank")} className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition">
                <MonitorCheck size={14} /> LIVE_ACCESS
              </button>
            ) : (
              <button onClick={handleDeploy} className="flex items-center gap-2 px-6 py-2 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition active:scale-95">
                <Rocket size={14} /> DEPLOY_PROTOCOL
              </button>
            )}
          </div>
        </header>

        {/* Browser Frame Preview */}
        <div className="flex-1 p-6 relative overflow-hidden">
          <div className="w-full h-full rounded-2xl border border-white/10 bg-white overflow-hidden shadow-2xl relative">
            <iframe ref={iframeRef} title="preview" className="w-full h-full" sandbox="allow-scripts allow-same-origin" />
            {updateLoading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1/2 h-full bg-blue-500" />
                  </div>
                  <span className="text-[10px] font-mono text-blue-400 tracking-widest uppercase">System_Sync_In_Progress</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Monaco Drawer */}
      <AnimatePresence>
        {showCode && (
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-y-0 right-0 w-full lg:w-[45%] z-[100] bg-[#1e1e1e] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col">
            <div className="h-16 px-6 flex justify-between items-center border-b border-white/5 bg-[#1e1e1e]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-sm font-mono text-zinc-400">core_module.html</span>
              </div>
              <button onClick={() => setShowCode(false)} className="p-2 hover:bg-white/5 rounded-lg transition">
                <X size={20} />
              </button>
            </div>
            <Editor height="100%" defaultLanguage="html" theme="vs-dark" value={code} onChange={(v) => setCode(v)} options={{ fontSize: 14, minimap: { enabled: false }, padding: { top: 20 } }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {showFullPreview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black flex flex-col">
            <div className="h-14 px-6 flex justify-between items-center bg-[#0a0a0c] border-b border-white/5">
              <span className="text-xs font-mono text-zinc-500 italic">{website.deployUrl || "LOCAL_HOST"}</span>
              <button onClick={() => setShowFullPreview(false)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"> <X size={18} /> </button>
            </div>
            <iframe className="flex-1 w-full bg-white" srcDoc={code} title="full-preview" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WebsiteEditor;
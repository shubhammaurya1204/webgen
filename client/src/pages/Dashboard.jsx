import {
  ArrowLeft,
  Check,
  Rocket,
  Share2,
  Plus,
  Zap,
  Activity,
  Globe,
  Layout,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { serverUrl } from "../App";

function Dashboard() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [websites, setWebsites] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const handleDeploy = async (id) => {
    try {
      const result = await axios.get(`${serverUrl}/api/website/deploy/${id}`, {
        withCredentials: true,
      });
      window.open(result.data.url, "_blank");
      setWebsites((prev) =>
        prev.map((w) =>
          w._id === id
            ? { ...w, deployed: true, deployUrl: result.data.url }
            : w,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleGetAllWebsites = async () => {
      setLoading(true);
      try {
        const result = await axios.get(`${serverUrl}/api/website/get-all`, {
          withCredentials: true,
        });
        setWebsites(result.data.websites);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch data");
        setLoading(false);
      }
    };
    handleGetAllWebsites();
  }, []);

  const handleCopy = async (site) => {
    await navigator.clipboard.writeText(site.deployUrl);
    setCopiedId(site._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#020203] text-zinc-100 overflow-x-hidden font-sans">
      {/* FUTURISTIC BACKGROUND GLOWS */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      {/* HEADER */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/60 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={18} />
            </button>
            <div className="text-sm font-mono tracking-widest text-blue-500 uppercase">
              System_Dashboard
            </div>
          </div>

          <button
            className="group px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all active:scale-95"
            onClick={() => navigate("/generate")}
          >
            <Plus size={14} /> NEW_PROJECT
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* WELCOME SECTION */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.3em] mb-2">
              Auth_Session: Active
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              WELCOME,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                {userData?.name?.toUpperCase()}
              </span>
            </h1>
          </motion.div>

          {/* QUICK STATS (Extra Section 1) */}
          <div className="grid grid-cols-2 md:flex gap-4">
            {[
              {
                label: "Active Nodes",
                val: websites?.length || 0,
                icon: <Layout size={14} />,
              },
              {
                label: "Credits Rem",
                val: userData?.credits || 0,
                icon: <Zap size={14} />,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="px-5 py-3 rounded-2xl bg-zinc-900/40 border border-white/5 flex flex-col gap-1 min-w-[120px]"
              >
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                  {stat.icon} {stat.label}
                </div>
                <div className="text-xl font-bold">{stat.val}</div>
              </div>
            ))}
          </div>
        </header>

        {loading && (
          <div className="text-center py-20 font-mono text-zinc-500 animate-pulse tracking-widest uppercase">
            Initializing_System_Files...
          </div>
        )}

        {error && !loading && (
          <div className="mt-24 p-6 rounded-2xl bg-red-500/5 border border-red-500/20 text-center text-red-400 font-mono text-sm uppercase">
            Critical_Error: {error}
          </div>
        )}

        {/* PROJECTS GRID */}
        {!loading && !error && (
          <>
            <div className="flex items-center gap-3 mb-8">
              <Activity size={18} className="text-blue-500" />
              <h2 className="text-xs font-mono uppercase tracking-[0.4em] text-zinc-500">
                Project_Repository
              </h2>
              <div className="h-[1px] flex-1 bg-white/5"></div>
            </div>

            {websites?.length === 0 ? (
              <div className="mt-12 text-center py-20 rounded-3xl border border-dashed border-white/5 text-zinc-600 font-mono text-xs uppercase tracking-widest">
                No_Data_Packets_Found
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
                {websites?.map((w, i) => {
                  const copied = copiedId === w._id;
                  return (
                    <motion.div
                      key={w._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -8 }}
                      className="group relative rounded-3xl bg-[#0b0b0d] border border-white/5 hover:border-blue-500/50 overflow-hidden transition-all duration-500 shadow-2xl"
                    >
                      {/* PREVIEW CONTAINER */}
                      <div
                        className="relative h-48 bg-black overflow-hidden group/screen cursor-pointer"
                        onClick={() => navigate(`/editor/${w._id}`)}
                      >
                        <iframe
                          srcDoc={w.latestCode}
                          className="absolute top-0 left-0 w-[1280px] h-[800px] border-none origin-top-left scale-[0.25] pointer-events-none grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                          style={{ width: "400%", height: "400%" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/screen:opacity-100 transition-opacity">
                          <div className="px-4 py-2 rounded-full bg-blue-600 text-[10px] font-bold tracking-widest uppercase">
                            Open_Terminal
                          </div>
                        </div>
                      </div>

                      {/* CARD CONTENT */}
                      <div className="p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-bold tracking-tight text-zinc-200 group-hover:text-blue-400 transition-colors">
                            {w.title?.toUpperCase() || "UNTITLED_MODULE"}
                          </h3>
                          {w.deployed && (
                            <Globe
                              size={14}
                              className="text-blue-500 animate-pulse"
                            />
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          {w.deployed ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(w);
                              }}
                              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all ${
                                copied
                                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                  : "bg-white/5 hover:bg-white/10 text-zinc-500 border border-white/5"
                              }`}
                            >
                              {copied ? (
                                <>
                                  <Check size={12} /> Link_Copied
                                </>
                              ) : (
                                <>
                                  <Share2 size={12} /> Share_Access
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeploy(w._id);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.1)]"
                            >
                              <Rocket size={12} /> Init_Deployment
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* RECENT ACTIVITY LOG (Extra Section 2) */}
        {!loading && websites?.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Activity size={18} className="text-zinc-700" />
              <h2 className="text-xs font-mono uppercase tracking-[0.4em] text-zinc-700">
                Data_Log
              </h2>
              <div className="h-[1px] flex-1 bg-white/5"></div>
            </div>
            <div className="rounded-3xl border border-white/5 bg-zinc-900/20 overflow-hidden">
              {websites.slice(0, 5).map((w, i) => (
                <div
                  key={i}
                  className="px-6 py-4 border-b border-white/5 last:border-0 flex items-center justify-between group hover:bg-white/[0.02] transition"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full ${w.deployed ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-zinc-700"}`}
                    />
                    <span className="text-xs font-mono text-zinc-400">
                      {w.title || "Module_Alpha"}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600 uppercase">
                    {new Date(w.updatedAt).toLocaleDateString()} // OFFSET_00{i}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 px-6 opacity-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em]">
          <div>© GenWeb_Protocol v4.0.2</div>
          <div className="flex gap-8">
            <span className="hover:text-blue-500 cursor-pointer">
              Security_Protocol
            </span>
            <span className="hover:text-blue-500 cursor-pointer">
              Node_Status
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;

import { useState, useEffect, useRef } from "react";
import { useCredits } from "../../contexts/CreditContext";

// ──────────────────────────────────────────────────────────
//  PROJECT #01 — PolyAgent
//  Multi-Modal Autonomous Research and Task-Execution Agentic Engine
//  Status : LIVE ✓
// ──────────────────────────────────────────────────────────

const PROMPTS = {
  backend: `You are a Senior AI Engineer. Build the core 'PolyAgent' Agentic Engine in Python using LangChain, LangGraph, and PyTorch. Implement the hierarchical control loop with S-Model (Strategic), A-Model (Action), and V-Model (Verifier) using recursive state management. Include vector memory via Milvus or PGVector.`,
  frontend: `You are a Senior Frontend Engineer. Build the Next.js/React dashboard for PolyAgent. Implement a real-time terminal streaming execution log, a visual execution graph (using react-flow), and an interactive goal-setting interface. Use TailwindCSS and Framer Motion for premium animations.`,
  database: `You are a Senior Database Architect. Design the PostgreSQL schema for PolyAgent. Include tables for agent_sessions, task_trees, episodic_memory, semantic_memory, and tool_registry. Use PGVector for embedding storage. Generate Alembic migrations.`,
  mlModel: `You are a Computer Vision/ML Engineer. Implement the Vision-Encoder for PolyAgent to parse non-HTML UI elements across desktop and web. Use a custom fine-tuned UNet for UI element segmentation and OCR (Tesseract / PaddleOCR) integration.`,
  deployment: `You are a DevOps Engineer. Create a secure, sandboxed Docker-in-Docker environment for PolyAgent tool execution. Write the docker-compose.yml, Kubernetes manifests for autoscaling the worker nodes, and GitHub Actions CI/CD pipeline.`
};

export default function PolyAgent() {
  const { useCredit } = useCredits();
  const [activeSection, setActiveSection] = useState("overview");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["overview", "problem", "solution", "architecture", "features", "stack", "impact", "prompts"];
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) { setActiveSection(s); break; }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const copyPrompt = (key: string) => {
    if (!useCredit()) {
      alert("Out of credits! Check back next month or upgrade your account.");
      return;
    }
    const text = PROMPTS[key as keyof typeof PROMPTS];
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  const copyMasterPrompt = () => {
    if (!useCredit()) {
      alert("Out of credits! Check back next month or upgrade your account.");
      return;
    }
    const masterText = `You are a Senior Technical Lead. Build the "PolyAgent" AGI platform.\n\n` + 
      Object.values(PROMPTS).join("\n\n");
    navigator.clipboard.writeText(masterText).then(() => {
      setCopiedKey("master");
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div ref={pageRef} className="min-h-screen bg-white text-slate-900 font-sans">
      
      {/* ── HERO ── */}
      <section className="relative min-h-[520px] bg-gradient-to-br from-indigo-900 via-indigo-600 to-slate-950 overflow-hidden flex flex-col justify-center px-6 md:px-12 py-20">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_30%,#a855f7_0%,transparent_50%),radial-gradient(circle_at_80%_70%,#6366f1_0%,transparent_50%)] blur-[60px] animate-pulse-slow" />
        <style>{`@keyframes pulse-slow { from { opacity: 0.2; transform: scale(1); } to { opacity: 0.5; transform: scale(1.1); } } .animate-pulse-slow { animation: pulse-slow 8s infinite alternate; }`}</style>
        
        <div className="relative max-w-[860px] z-10">
          <div className="flex flex-wrap gap-2.5 mb-4">
            {["#01", "AGI / Agentic Workflows", "EXTREME Complexity", "Rank 01/75"].map((tag, i) => (
              <span key={i} className="bg-white/10 border border-white/20 text-white/90 rounded-full px-3 py-1 text-[11px] font-semibold">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] mb-3">
            PolyAgent <span className="text-indigo-200 font-light text-3xl md:text-5xl">Autonomous Engine</span>
          </h1>
          
          <p className="text-lg text-white/80 max-w-2xl leading-relaxed mb-10">
            A unified agentic brain leveraging vision-language models for UI navigation, a recursive task-decomposition engine for complex goal achievement, and a verified tool-execution layer.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => scrollTo("architecture")}
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-lg"
            >
              Deep Dive
            </button>
            <button 
              onClick={copyMasterPrompt}
              className={`px-6 py-3 rounded-xl font-bold border border-white/30 transition-all shadow-lg ${
                copiedKey === "master" ? "bg-emerald-600 text-white border-emerald-500" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {copiedKey === "master" ? "✓ Copied!" : "✨ Copy Master Prompt"}
            </button>
          </div>
        </div>
      </section>

      {/* ── CONTENTS ── */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        
        {/* PREMIUM STATS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-indigo-100 border border-indigo-100 rounded-2xl overflow-hidden mb-16 shadow-sm">
          {[
            { label: "Complexity", val: "Extreme" },
            { label: "Stability", val: "99.9%" },
            { label: "Rank", val: "#1/75" },
            { label: "Status", val: "Live" }
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 md:p-8 text-center flex flex-col justify-center">
              <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-1.5">{s.label}</div>
              <div className="text-2xl md:text-3xl font-black text-indigo-950">{s.val}</div>
            </div>
          ))}
        </div>
        
        {/* ARCHITECTURE SUMMARY */}
        <section id="architecture" className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-indigo-600">⚙️</span> Core Architecture
          </h2>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 md:p-10 leading-relaxed">
            <p className="text-slate-600 text-lg">
              The engine uses a hierarchical control loop. A <strong className="text-indigo-900 font-bold">Strategic Manager</strong> (S-Model) decomposes high-level goals into sub-tasks. An <strong className="text-indigo-900 font-bold">Action Agent</strong> (A-Model) executes these using a dynamic tool registry. A <strong className="text-indigo-900 font-bold">Verifier Agent</strong> (V-Model) monitors state changes via Vision-Encoder and cross-references against the plan, triggering <em className="italic">Self-Correction</em> if deviations are detected.
            </p>
          </div>
        </section>

        {/* FEATURES OVERVIEW */}
        <section id="features" className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-indigo-600">✅</span> Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Autonomous goal decomposition & multi-step planning",
              "Visual grounding for non-HTML UI interaction",
              "Self-correcting error recovery loops",
              "Dynamic tool-use with state-aware feedback",
              "Long-term memory with RAG-based skill retrieval",
              "Secure sandbox execution environment",
            ].map((f, i) => (
              <div key={i} className="p-5 border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors bg-white group shadow-sm">
                <span className="text-indigo-600 font-black mr-3 opacity-50 group-hover:opacity-100 transition-opacity">{(i+1).toString().padStart(2, '0')}</span>
                <span className="text-[15px] font-medium text-slate-700">{f}</span>
              </div>
            ))}
          </div>
        </section>

        {/* PROMPTS SECTION */}
        <section id="prompts" className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">🤖 AI Build Prompts</h2>
          </div>
          <div className="grid gap-3">
            {Object.entries(PROMPTS).map(([key, text]) => (
              <div key={key} className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <h4 className="text-base font-bold text-slate-900 capitalize mb-1">{key} Module Prompt</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{text}</p>
                </div>
                <button 
                  onClick={() => copyPrompt(key)} 
                  className={`w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    copiedKey === key ? "bg-emerald-600 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {copiedKey === key ? "✓ Copied" : "Copy Prompt"}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

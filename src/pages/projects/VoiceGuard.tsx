import { useState, useEffect, useRef } from "react";
import { useCredits } from "../../contexts/CreditContext";

// ──────────────────────────────────────────────────────────
//  PROJECT #42 — VoiceGuard
//  Real-Time Audio Deepfake and Voice Fraud Detection Platform
//  Status : LIVE ✓
// ──────────────────────────────────────────────────────────

const PROMPTS = {
  backend: `You are a Python Backend Developer. Build the VoiceGuard API using FastAPI and WebSockets. Handle real-time audio chunk streaming from frontend clients. Integrate FFmpeg for audio transcoding to 16kHz mono WAV format.`,
  frontend: `You are a Frontend WebAudio Expert. Build the React dashboard using the Web Audio API to stream microphone input via WebSockets to the backend. Include a real-time waveform visualizer and a live 'Confidence Score' gauge.`,
  database: `You are a Database Specialist. Design the PostgreSQL schema for tracking verification sessions. Create tables for users, audio_sessions, fraud_alerts, and api_keys to support the B2B licensing model.`,
  mlModel: `You are an Audio ML Engineer. Implement an ensemble of PyTorch models including RawNet2 for direct waveform analysis. Add custom prosodic feature extractors to detect spectral artifacts from vocoders (HiFi-GAN, VITS).`,
  deployment: `You are a DevOps Engineer. Create a low-latency Docker setup using Redis for WebSocket Pub/Sub state. Deploy the FastAPI backend on a GPU-enabled AWS EC2 instance configured for sub-50ms inference latency.`
};

export default function VoiceGuard() {
  const { useCredit } = useCredits();
  const [activeSection, setActiveSection] = useState("overview");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["overview", "problem", "solution", "architecture", "features", "prompts"];
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
    const masterText = `You are a Senior Technical Lead. Build the "VoiceGuard" platform.\n\n` + 
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
      <section className="relative min-h-[520px] bg-gradient-to-br from-red-950 via-red-600 to-red-900 overflow-hidden flex flex-col justify-center px-6 md:px-12 py-20">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,#fca5a533_0%,transparent_60%),radial-gradient(circle_at_70%_70%,#ef444433_0%,transparent_60%)] blur-[80px] animate-pulse-red-slow" />
        <style>{`@keyframes pulse-red-slow { 0% { opacity: 0.2; transform: scale(1); } 100% { opacity: 0.6; transform: scale(1.2); } } .animate-pulse-red-slow { animation: pulse-red-slow 8s infinite alternate; }`}</style>
        
        <div className="relative max-w-[860px] z-10">
          <div className="flex flex-wrap gap-2.5 mb-4">
            {["#42", "AI Security / Audio ML", "EXTREME Complexity", "Rank 42/75"].map((tag, i) => (
              <span key={i} className="bg-white/10 border border-white/20 text-white/90 rounded-full px-3 py-1 text-[11px] font-semibold">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] mb-3">
            VoiceGuard <span className="text-red-200 font-light text-3xl md:text-5xl">Deepfake Detection</span>
          </h1>
          
          <p className="text-lg text-white/80 max-w-2xl leading-relaxed mb-10">
            A real-time detection API that identifies AI-synthesized voice content and voice cloning attacks to prevent financial fraud and identity theft.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => scrollTo("architecture")}
              className="bg-white text-red-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-lg"
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-red-100 border border-red-100 rounded-2xl overflow-hidden mb-16 shadow-sm">
          {[
            { label: "Inference", val: "42ms" },
            { label: "False Pos.", val: "<0.4%" },
            { label: "Model Ensem.", val: "5" },
            { label: "Rank", val: "#42/75" }
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 md:p-8 text-center flex flex-col justify-center">
              <div className="text-[11px] font-bold text-red-800 uppercase tracking-wider mb-1.5">{s.label}</div>
              <div className="text-2xl md:text-3xl font-black text-red-950">{s.val}</div>
            </div>
          ))}
        </div>

        {/* ARCHITECTURE SUMMARY */}
        <section id="architecture" className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-red-600">⚙️</span> Core Architecture
          </h2>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 md:p-10 leading-relaxed text-slate-700">
            <p className="text-lg">
              Ensemble of 5 independent models including <strong className="text-red-900">RawNet2</strong> for waveform analysis and custom prosodic feature extractors. Analyzes pitch trajectory, speaking rate, and spectral artifacts from vocoders. Real-time processing via WebSockets with continuous adversarial training against the latest TTS models.
            </p>
          </div>
        </section>

        {/* FEATURES OVERVIEW */}
        <section id="features" className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-red-600">✅</span> Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Sub-50ms latency WebSocket analysis",
              "Synthesis type classification (TTS vs. VC)",
              "99%+ accuracy with <0.5% false positive rate",
              "PBX integration for enterprise call centers",
              "Mobile SDK for secure voice authentication",
              "Timestamped evidence logging",
            ].map((f, i) => (
              <div key={i} className="p-5 border border-slate-200 rounded-xl hover:border-red-300 transition-colors bg-white group shadow-sm">
                <span className="text-red-600 font-black mr-3 opacity-50 group-hover:opacity-100 transition-opacity">{(i+1).toString().padStart(2, '0')}</span>
                <span className="text-[15px] font-medium text-slate-700">{f}</span>
              </div>
            ))}
          </div>
        </section>

        {/* PROMPTS SECTION */}
        <section id="prompts" className="mb-16 text-slate-900">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">🤖 AI Build Prompts</h2>
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
                    copiedKey === key ? "bg-emerald-600 text-white" : "bg-red-600 text-white hover:bg-red-700"
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

import { useState, useEffect, useRef } from "react";
import { useCredits } from "../../contexts/CreditContext";

// ──────────────────────────────────────────────────────────
//  PROJECT #11 — SkyAnalyst
//  Satellite Imagery Intelligence and Economic Indicator Forecasting
//  Status : LIVE ✓
// ──────────────────────────────────────────────────────────

const PROMPTS = {
  backend: `You are a Senior Data Engineer. Build the data ingestion pipeline using Apache Airflow. Fetch Sentinel-2 and Planet Labs imagery daily via REST APIs. Store multi-spectral TIFFs in AWS S3 and extract metadata into PostGIS.`,
  frontend: `You are a Frontend WebGL Expert. Build the React dashboard using Mapbox GL JS for visualizing geospatial TIFFs. Include a temporal timeline slider to visualize changes in factory thermal signatures and port congestion over time.`,
  database: `You are a Geospatial Database Architect. Design the PostGIS PostgreSQL schema. Include tables for satellite_acquisitions, bounding_box_regions, detected_assets (vehicles, containers), and time_series_metrics.`,
  mlModel: `You are a Computer Vision Engineer. Implement a dual ML pipeline: 1) A PyTorch UNet++ for object segmentation (parsing vehicles in parking lots and shipping containers). 2) Temporal Fusion Transformers (TFT) for forecasting quarterly retail revenue tickers based on the CV outputs.`,
  deployment: `You are a Cloud Architect. Deploy the heavy ML inference pipeline on AWS SageMaker or EC2 GPU instances. Set up the Airflow DAGs for automated daily ingestion and scoring. Implement a FastAPI endpoint to serve the forecasted metrics.`
};

export default function SkyAnalyst() {
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
    const masterText = `You are a Senior Technical Lead. Build the "SkyAnalyst" platform.\n\n` + 
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
      <section className="relative min-h-[520px] bg-gradient-to-br from-sky-950 via-sky-600 to-sky-900 overflow-hidden flex flex-col justify-center px-6 md:px-12 py-20">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_70%_20%,#7dd3fc33_0%,transparent_60%),radial-gradient(circle_at_10%_80%,#0ea5e933_0%,transparent_60%)] blur-[80px] animate-float-slow" />
        <style>{`@keyframes float-slow { 0% { transform: translateY(0) scale(1); } 50% { transform: translateY(-20px) scale(1.05); } 100% { transform: translateY(0) scale(1); } } .animate-float-slow { animation: float-slow 12s infinite ease-in-out; }`}</style>
        
        <div className="relative max-w-[860px] z-10">
          <div className="flex flex-wrap gap-2.5 mb-4">
            {["#11", "Geospatial AI / FinTech", "EXTREME Complexity", "Rank 11/75"].map((tag, i) => (
              <span key={i} className="bg-white/10 border border-white/20 text-white/90 rounded-full px-3 py-1 text-[11px] font-semibold">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] mb-3">
            SkyAnalyst <span className="text-sky-300 font-light text-3xl md:text-5xl">Intelligence</span>
          </h1>
          
          <p className="text-lg text-white/80 max-w-2xl leading-relaxed mb-10">
            An intelligence platform converting raw multispectral satellite imagery into real-time economic indicators by monitoring physical activity at scale.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => scrollTo("architecture")}
              className="bg-white text-sky-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-lg"
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-sky-100 border border-sky-100 rounded-2xl overflow-hidden mb-16 shadow-sm">
          {[
            { label: "Data Volume", val: "1.2 PB" },
            { label: "Avg Latency", val: "140ms" },
            { label: "Precision", val: "98.4%" },
            { label: "Status", val: "Verified" }
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 md:p-8 text-center flex flex-col justify-center">
              <div className="text-[11px] font-bold text-sky-700 uppercase tracking-wider mb-1.5">{s.label}</div>
              <div className="text-2xl md:text-3xl font-black text-sky-950">{s.val}</div>
            </div>
          ))}
        </div>

        {/* ARCHITECTURE SUMMARY */}
        <section id="architecture" className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-sky-600">⚙️</span> Core Architecture
          </h2>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 md:p-10 leading-relaxed text-slate-700">
            <p className="text-lg">
              Distributed processing pipeline using <strong className="text-sky-900">Apache Airflow</strong>. Ingests daily multispectral data from Sentinel-2 and Planet Labs. Computer Vision core features a Custom UNet++ for high-precision vehicle and container segmentation. Time-series forecasting integrates visual signals with macroeconomic data to predict ticker-level quarterly revenue.
            </p>
          </div>
        </section>

        {/* FEATURES OVERVIEW */}
        <section id="features" className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-sky-600">✅</span> Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Real-time parking lot occupancy tracking",
              "Port congestion and shipping container throughput",
              "Factory activity monitoring via thermal signatures",
              "Agricultural yield prediction from NDVI",
              "Automated intelligence report generation",
              "API for institutional quant-fund integration",
            ].map((f, i) => (
              <div key={i} className="p-5 border border-slate-200 rounded-xl hover:border-sky-300 transition-colors bg-white group shadow-sm">
                <span className="text-sky-600 font-black mr-3 opacity-50 group-hover:opacity-100 transition-opacity">{(i+1).toString().padStart(2, '0')}</span>
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
                    copiedKey === key ? "bg-emerald-600 text-white" : "bg-sky-600 text-white hover:bg-sky-700"
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

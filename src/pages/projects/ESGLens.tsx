import { useState, useEffect, useRef } from "react";
import { useCredits } from "../../contexts/CreditContext";

// ──────────────────────────────────────────────────────────
//  PROJECT #26 — ESGLens
//  Supply Chain ESG Risk Assessment and Scope 3 Reporting
//  Status : LIVE ✓
// ──────────────────────────────────────────────────────────

const PROMPTS = {
  backend: `You are a Backend Python Architect. Build the ESGLens API using FastAPI. Implement the supply chain graph ingestion pipeline using NetworkX. Calculate Scope 3 emissions automatically by cross-referencing spend data with the EPA EEIO emission factors database.`,
  frontend: `You are a UX/UI Developer. Build an Awwwards-tier React dashboard for ESGLens using D3.js and Framer Motion. Create a visual network graph for the supply chain tiers up to Tier-3, and a dashboard for generating TCFD/CSRD compliant PDF reports.`,
  database: `You are a Data Engineer. Design the PostgreSQL schema for ESGLens. Include tables for companies, suppliers, spend_data, emission_factors, and esg_assessments. Use recursive CTEs for querying deep supply chain relationships.`,
  mlModel: `You are an NLP/ML Engineer. Implement a BERT-based model to analyze supplier news sentiment and unstructured ESG reports to automatically generate a Risk Score for governance and social controversies.`,
  deployment: `You are a DevOps Engineer. Create a highly scalable Docker/Kubernetes deployment for ESGLens. Set up Redis with Celery for background processing of heavy ESG graph computations and PDF generation tasks.`
};

export default function ESGLens() {
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
    const masterText = `You are a Senior Technical Lead. Build the "ESGLens" platform.\n\n` + 
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
      <section className="relative min-h-[520px] bg-gradient-to-br from-emerald-950 via-emerald-600 to-emerald-800 overflow-hidden flex flex-col justify-center px-6 md:px-12 py-20">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_10%_20%,#6ee7b733_0%,transparent_50%),radial-gradient(circle_at_90%_80%,#05966933_0%,transparent_50%)] blur-[70px] animate-morph-slow" />
        <style>{`@keyframes morph { 0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; transform: translate(0,0) rotate(0deg); } 100% { border-radius: 50%; transform: translate(20px, 20px) rotate(15deg); } } .animate-morph-slow { animation: morph 15s infinite alternate ease-in-out; }`}</style>
        
        <div className="relative max-w-[860px] z-10">
          <div className="flex flex-wrap gap-2.5 mb-4">
            {["#26", "FinTech / Sustainability", "VERY HIGH Complexity", "Rank 26/75"].map((tag, i) => (
              <span key={i} className="bg-white/10 border border-white/20 text-white/90 rounded-full px-3 py-1 text-[11px] font-semibold">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] mb-3">
            ESGLens <span className="text-emerald-300 font-light text-3xl md:text-5xl">Reporting</span>
          </h1>
          
          <p className="text-lg text-white/80 max-w-2xl leading-relaxed mb-10">
            An institutional-grade intelligence platform that automates the collection, verification, and reporting of ESG risks across global multi-tier supply chains.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => scrollTo("architecture")}
              className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-lg"
            >
              Deep Dive
            </button>
            <button 
              onClick={copyMasterPrompt}
              className={`px-6 py-3 rounded-xl font-bold border border-white/30 transition-all shadow-lg ${
                copiedKey === "master" ? "bg-emerald-700 text-white border-emerald-600" : "bg-white/10 text-white hover:bg-white/20"
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-emerald-100 border border-emerald-100 rounded-2xl overflow-hidden mb-16 shadow-sm">
          {[
            { label: "Tiers Tracked", val: "3" },
            { label: "Suppliers", val: "14k+" },
            { label: "Compliance", val: "CSRD" },
            { label: "Audit Rank", val: "A+" }
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 md:p-8 text-center flex flex-col justify-center text-center">
              <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1.5">{s.label}</div>
              <div className="text-2xl md:text-3xl font-black text-emerald-950">{s.val}</div>
            </div>
          ))}
        </div>

        {/* ARCHITECTURE SUMMARY */}
        <section id="architecture" className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-emerald-600">⚙️</span> Core Architecture
          </h2>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 md:p-10 leading-relaxed">
            <p className="text-slate-600 text-lg">
              Multi-tier graph structure built from procurement data. Integrates with <strong className="text-emerald-900">EPA EEIO</strong> databases for high-fidelity emission modeling. Graph algorithms identify <em className="italic text-emerald-800 font-medium">'Critical Hotspots'</em> and <em className="italic text-emerald-800 font-medium">'Intervention Points.'</em> Automated disclosure engine generates GRI 305/TCFD/SEC compliant reports with full provenance tracking.
            </p>
          </div>
        </section>

        {/* FEATURES OVERVIEW */}
        <section id="features" className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-emerald-600">✅</span> Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Automated Scope 3 Category coverage",
              "18,000+ localized emission factors integration",
              "Supplier benchmarking against peers",
              "Top-10 abatement cost curve identification",
              "Automated CDP, GRI, TCFD disclosure generation",
              "Real-time regulatory change monitoring",
            ].map((f, i) => (
              <div key={i} className="p-5 border border-slate-200 rounded-xl hover:border-emerald-300 transition-colors bg-white group shadow-sm">
                <span className="text-emerald-600 font-black mr-3 opacity-50 group-hover:opacity-100 transition-opacity">{(i+1).toString().padStart(2, '0')}</span>
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
                    copiedKey === key ? "bg-emerald-700 text-white" : "bg-emerald-600 text-white hover:bg-emerald-700"
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

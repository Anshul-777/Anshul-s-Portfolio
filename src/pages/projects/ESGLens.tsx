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
    <div ref={pageRef} style={{ fontFamily: "'DM Sans', sans-serif", background: "#FFFFFF", color: "#0F172A" }}>
      <section style={{
        minHeight: 520,
        background: "linear-gradient(135deg, #064E3B 0%, #059669 40%, #065F46 100%)",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "80px 48px 60px"
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.3,
          background: "radial-gradient(circle at 10% 20%, #6ee7b733 0%, transparent 50%), radial-gradient(circle at 90% 80%, #05966933 0%, transparent 50%)",
          filter: "blur(70px)", animation: "morph 15s infinite alternate ease-in-out"
        }} />
        <style>{`@keyframes morph { 0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; transform: translate(0,0) rotate(0deg); } 100% { border-radius: 50%; transform: translate(20px, 20px) rotate(15deg); } }`}</style>
        <div style={{ position: "relative", maxWidth: 860, zIndex: 10 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            {["#26", "FinTech / Sustainability", "VERY HIGH Complexity", "Rank 26/75"].map((tag, i) => (
              <span key={i} style={{
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.85)", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 600
              }}>{tag}</span>
            ))}
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, marginBottom: 12 }}>
            ESGLens <span style={{ color: "#6EE7B7", fontWeight: 300 }}>Reporting</span>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", maxWidth: 640, lineHeight: 1.6, marginBottom: 28 }}>
            An institutional-grade intelligence platform that automates the collection, verification, and reporting of ESG risks across global multi-tier supply chains.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => scrollTo("architecture")}
              style={{ background: "#FFFFFF", color: "#059669", border: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 700 }}>
              Deep Dive
            </button>
            <button onClick={copyMasterPrompt}
              style={{ background: copiedKey === "master" ? "#047857" : "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "12px 24px", borderRadius: 10, fontWeight: 700 }}>
              {copiedKey === "master" ? "✓ Copied!" : "✨ Copy Master Prompt"}
            </button>
          </div>
        </div>
      </section>

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 24px" }}>
        <section id="architecture" style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>⚙️ Core Architecture</h2>
          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 16, padding: 32 }}>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "#334155" }}>
              Multi-tier graph structure built from procurement data. Integrates with EPA EEIO databases for high-fidelity emission modeling. Graph algorithms identify 'Critical Hotspots' and 'Intervention Points.' Automated disclosure engine generates GRI 305/TCFD/SEC compliant reports with full provenance tracking.
            </p>
          </div>
        </section>

        <section id="features" style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>✅ Capabilities</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              "Automated Scope 3 Category coverage",
              "18,000+ localized emission factors integration",
              "Supplier benchmarking against peers",
              "Top-10 abatement cost curve identification",
              "Automated CDP, GRI, TCFD disclosure generation",
              "Real-time regulatory change monitoring",
            ].map((f, i) => (
              <div key={i} style={{ padding: 16, border: "1px solid #E2E8F0", borderRadius: 12 }}>
                <span style={{ color: "#059669", fontWeight: 800, marginRight: 8 }}>{i+1}.</span>
                <span style={{ fontSize: 14, color: "#1E293B" }}>{f}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="prompts" style={{ marginBottom: 60 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>🤖 AI Build Prompts</h2>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {Object.entries(PROMPTS).map(([key, text]) => (
              <div key={key} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, textTransform: "capitalize" }}>{key} Module Prompt</h4>
                  <p style={{ fontSize: 12, color: "#64748B", margin: "4px 0 0" }}>{text.substring(0, 100)}...</p>
                </div>
                <button onClick={() => copyPrompt(key)} style={{ background: copiedKey === key ? "#047857" : "#059669", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
                  {copiedKey === key ? "✓ Copied" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

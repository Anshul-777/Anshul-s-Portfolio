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
    <div ref={pageRef} style={{ fontFamily: "'DM Sans', sans-serif", background: "#FFFFFF", color: "#0F172A" }}>
      <section style={{
        minHeight: 520,
        background: "linear-gradient(135deg, #0C4A6E 0%, #0284C7 40%, #082F49 100%)",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "80px 48px 60px"
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.4,
          background: "radial-gradient(circle at 70% 20%, #7dd3fc33 0%, transparent 60%), radial-gradient(circle at 10% 80%, #0ea5e933 0%, transparent 60%)",
          filter: "blur(80px)", animation: "float 12s infinite ease-in-out"
        }} />
        <style>{`@keyframes float { 0% { transform: translateY(0) scale(1); } 50% { transform: translateY(-20px) scale(1.05); } 100% { transform: translateY(0) scale(1); } }`}</style>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.4,
          background: "radial-gradient(circle at 70% 20%, #7dd3fc33 0%, transparent 60%), radial-gradient(circle at 10% 80%, #0ea5e933 0%, transparent 60%)",
          filter: "blur(80px)", animation: "float 12s infinite ease-in-out"
        }} />
        <style>{`@keyframes float { 0% { transform: translateY(0) scale(1); } 50% { transform: translateY(-20px) scale(1.05); } 100% { transform: translateY(0) scale(1); } }`}</style>
        <div style={{ position: "relative", maxWidth: 860, zIndex: 10 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            {["#11", "Geospatial AI / FinTech", "EXTREME Complexity", "Rank 11/75"].map((tag, i) => (
              <span key={i} style={{
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.85)", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 600
              }}>{tag}</span>
            ))}
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, marginBottom: 12 }}>
            SkyAnalyst <span style={{ color: "#7DD3FC", fontWeight: 300 }}>Intelligence</span>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", maxWidth: 640, lineHeight: 1.6, marginBottom: 28 }}>
            An intelligence platform converting raw multispectral satellite imagery into real-time economic indicators by monitoring physical activity at scale.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => scrollTo("architecture")}
              style={{ background: "#FFFFFF", color: "#0284C7", border: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 700 }}>
              Deep Dive
            </button>
            <button onClick={copyMasterPrompt}
              style={{ background: copiedKey === "master" ? "#059669" : "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "12px 24px", borderRadius: 10, fontWeight: 700 }}>
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
              Distributed processing pipeline using Apache Airflow. Ingests daily multispectral data from Sentinel-2 and Planet Labs. Computer Vision core features a Custom UNet++ for high-precision vehicle and container segmentation. Time-series forecasting integrates visual signals with macroeconomic data to predict ticker-level quarterly revenue.
            </p>
          </div>
        </section>

        <section id="features" style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>✅ Capabilities</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              "Real-time parking lot occupancy tracking",
              "Port congestion and shipping container throughput",
              "Factory activity monitoring via thermal signatures",
              "Agricultural yield prediction from NDVI",
              "Automated intelligence report generation",
              "API for institutional quant-fund integration",
            ].map((f, i) => (
              <div key={i} style={{ padding: 16, border: "1px solid #E2E8F0", borderRadius: 12 }}>
                <span style={{ color: "#0284C7", fontWeight: 800, marginRight: 8 }}>{i+1}.</span>
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
                <button onClick={() => copyPrompt(key)} style={{ background: copiedKey === key ? "#059669" : "#0284C7", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
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

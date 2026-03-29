import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
    <div ref={pageRef} style={{ fontFamily: "'DM Sans', sans-serif", background: "#FFFFFF", color: "#0F172A" }}>
      <section style={{
        minHeight: 520,
        background: "linear-gradient(135deg, #7F1D1D 0%, #DC2626 40%, #991B1B 100%)",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "80px 48px 60px"
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.3,
          background: "radial-gradient(circle at 30% 30%, #fca5a533 0%, transparent 60%), radial-gradient(circle at 70% 70%, #ef444433 0%, transparent 60%)",
          filter: "blur(80px)", animation: "pulse-red 8s infinite alternate"
        }} />
        <style>{`@keyframes pulse-red { 0% { opacity: 0.2; transform: scale(1); } 100% { opacity: 0.6; transform: scale(1.2); } }`}</style>
        <div style={{ position: "relative", maxWidth: 860, zIndex: 10 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            {["#42", "AI Security / Audio ML", "EXTREME Complexity", "Rank 42/75"].map((tag, i) => (
              <span key={i} style={{
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.85)", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 600
              }}>{tag}</span>
            ))}
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, marginBottom: 12 }}>
            VoiceGuard <span style={{ color: "#FECACA", fontWeight: 300 }}>Deepfake Detection</span>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", maxWidth: 640, lineHeight: 1.6, marginBottom: 28 }}>
            A real-time detection API that identifies AI-synthesized voice content and voice cloning attacks to prevent financial fraud and identity theft.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => scrollTo("architecture")}
              style={{ background: "#FFFFFF", color: "#DC2626", border: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 700 }}>
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

        {/* PREMIUM STATS ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "#FEE2E2", border: "1px solid #FEE2E2", borderRadius: 16, overflow: "hidden", marginBottom: 60 }}>
          {[
            { label: "Inference", val: "42ms" },
            { label: "False Pos.", val: "<0.4%" },
            { label: "Model Ensem.", val: "5" },
            { label: "Rank", val: "#42/75" }
          ].map((s, i) => (
            <div key={i} style={{ padding: 24, background: "#FFFFFF", textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#991B1B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#7F1D1D" }}>{s.val}</div>
            </div>
          ))}
        </div>
        <section id="architecture" style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>⚙️ Core Architecture</h2>
          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 16, padding: 32 }}>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "#334155" }}>
              Ensemble of 5 independent models including RawNet2 for waveform analysis and custom prosodic feature extractors. Analyzes pitch trajectory, speaking rate, and spectral artifacts from vocoders. Real-time processing via WebSockets with continuous adversarial training against the latest TTS models.
            </p>
          </div>
        </section>

        <section id="features" style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>✅ Capabilities</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              "Sub-50ms latency WebSocket analysis",
              "Synthesis type classification (TTS vs. VC)",
              "99%+ accuracy with <0.5% false positive rate",
              "PBX integration for enterprise call centers",
              "Mobile SDK for secure voice authentication",
              "Timestamped evidence logging",
            ].map((f, i) => (
              <div key={i} style={{ padding: 16, border: "1px solid #E2E8F0", borderRadius: 12 }}>
                <span style={{ color: "#DC2626", fontWeight: 800, marginRight: 8 }}>{i + 1}.</span>
                <span style={{ fontSize: 14, color: "#1E293B" }}>{f}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="prompts" style={{ marginBottom: 60 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <Link to="/portfolio" style={{ color: "#64748B", fontSize: 13, textDecoration: "none" }}>← Anshul's Projects</Link>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>🤖 AI Build Prompts</h2>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {Object.entries(PROMPTS).map(([key, text]) => (
              <div key={key} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, textTransform: "capitalize" }}>{key} Module Prompt</h4>
                  <p style={{ fontSize: 12, color: "#64748B", margin: "4px 0 0" }}>{text.substring(0, 100)}...</p>
                </div>
                <button onClick={() => copyPrompt(key)} style={{ background: copiedKey === key ? "#059669" : "#DC2626", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
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

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
    <div ref={pageRef} style={{ fontFamily: "'DM Sans', sans-serif", background: "#FFFFFF", color: "#0F172A" }}>
      
      {/* ── HERO ── */}
      <section style={{
        minHeight: 520,
        background: "linear-gradient(135deg, #312E81 0%, #4F46E5 40%, #1E1B4B 100%)",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "80px 48px 60px"
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.4,
          background: "radial-gradient(circle at 20% 30%, #a855f7 0%, transparent 50%), radial-gradient(circle at 80% 70%, #6366f1 0%, transparent 50%)",
          filter: "blur(60px)", animation: "pulse 8s infinite alternate"
        }} />
        <style>{`@keyframes pulse { from { opacity: 0.2; transform: scale(1); } to { opacity: 0.5; transform: scale(1.1); } }`}</style>
        <div style={{ position: "relative", maxWidth: 860, zIndex: 10 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            {["#01", "AGI / Agentic Workflows", "EXTREME Complexity", "Rank 01/75"].map((tag, i) => (
              <span key={i} style={{
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.85)", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 600
              }}>{tag}</span>
            ))}
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, marginBottom: 12 }}>
            PolyAgent <span style={{ color: "#A5B4FC", fontWeight: 300 }}>Autonomous Engine</span>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", maxWidth: 640, lineHeight: 1.6, marginBottom: 28 }}>
            A unified agentic brain leveraging vision-language models for UI navigation, a recursive task-decomposition engine for complex goal achievement, and a verified tool-execution layer.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => scrollTo("architecture")}
              style={{ background: "#FFFFFF", color: "#4F46E5", border: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 700 }}>
              Deep Dive
            </button>
            <button onClick={copyMasterPrompt}
              style={{ background: copiedKey === "master" ? "#059669" : "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "12px 24px", borderRadius: 10, fontWeight: 700 }}>
              {copiedKey === "master" ? "✓ Copied!" : "✨ Copy Master Prompt"}
            </button>
          </div>
        </div>
      </section>

      {/* ── CONTENTS ── */}
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 24px" }}>
        
        {/* ARCHITECTURE SUMMARY */}
        <section id="architecture" style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>⚙️ Core Architecture</h2>
          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 16, padding: 32 }}>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "#334155" }}>
              The engine uses a hierarchical control loop. A <strong>Strategic Manager</strong> (S-Model) decomposes high-level goals into sub-tasks. An <strong>Action Agent</strong> (A-Model) executes these using a dynamic tool registry. A <strong>Verifier Agent</strong> (V-Model) monitors state changes via Vision-Encoder and cross-references against the plan, triggering <em>Self-Correction</em> if deviations are detected.
            </p>
          </div>
        </section>

        {/* FEATURES OVERVIEW */}
        <section id="features" style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>✅ Capabilities</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              "Autonomous goal decomposition & multi-step planning",
              "Visual grounding for non-HTML UI interaction",
              "Self-correcting error recovery loops",
              "Dynamic tool-use with state-aware feedback",
              "Long-term memory with RAG-based skill retrieval",
              "Secure sandbox execution environment",
            ].map((f, i) => (
              <div key={i} style={{ padding: 16, border: "1px solid #E2E8F0", borderRadius: 12 }}>
                <span style={{ color: "#4F46E5", fontWeight: 800, marginRight: 8 }}>{i+1}.</span>
                <span style={{ fontSize: 14, color: "#1E293B" }}>{f}</span>
              </div>
            ))}
          </div>
        </section>

        {/* PROMPTS SECTION */}
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
                <button onClick={() => copyPrompt(key)} style={{ background: copiedKey === key ? "#059669" : "#4F46E5", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
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

import os
import re
import json

elite_projects = [
  {
    "id": "polyagent",
    "number": "01",
    "title": "PolyAgent: Multi-Modal Autonomous Research and Task-Execution Agentic Engine",
    "domain": "AGI / Agentic Workflows",
    "difficulty": "EXTREME",
    "rank": "01 of 75",
    "coreIdea": "An autonomous agentic engine capable of high-order reasoning, multi-modal perception, and self-correcting tool use across any digital interface.",
    "problem": "Existing AI agents are either narrow-domain (code only, web only) or brittle, failing when encountering non-textual UI elements or requiring complex multi-step reasoning with state management.",
    "solution": "A unified agentic brain that leverages vision-language models for UI navigation, a recursive task-decomposition engine for complex goal achievement, and a verified tool-execution layer with real-time feedback loops.",
    "technicalArchitecture": "The engine uses a hierarchical control loop. A 'Strategic Manager' (S-Model) decomposes high-level goals into sub-tasks. An 'Action Agent' (A-Model) executes these using a dynamic tool registry (Terminal, Browser, IDE). A 'Verifier Agent' (V-Model) monitors state changes via Vision-Encoder and cross-references against the plan, triggering 'Self-Correction' if deviations are detected. Memory is managed via a two-tier system: 'Episodic Memory' for current session context and 'Semantic Memory' for long-term skill acquisition and tool documentation.",
    "features": [
      "Autonomous goal decomposition & multi-step planning",
      "Visual grounding for non-HTML UI interaction",
      "Self-correcting error recovery loops",
      "Dynamic tool-use with state-aware feedback",
      "Long-term memory with RAG-based skill retrieval",
      "Human-in-the-loop oversight for critical safety bounds",
      "Cross-platform execution (Web, Desktop, Server)",
      "Streaming execution logs with real-time reasoning visualization",
      "Hardware-accelerated local inference for privacy-first tasks",
      "Secure sandbox execution environment for untrusted tools"
    ],
    "tools": ["TypeScript", "Next.js", "Python 3.12", "LangChain", "PyTorch", "Chromium", "Docker", "Tailwind CSS", "PostgreSQL", "Redis"],
    "links": [
      { "label": "Research Paper", "url": "https://arxiv.org/abs/agentic-agi" },
      { "label": "GitHub Repository", "url": "https://github.com/anshul/polyagent" }
    ],
    "color": "#4F46E5",
    "impact": "Redefines human-AI interaction by allowing users to delegate outcomes, not just instructions, increasing productivity by 10x for expert workflows."
  },
  {
    "id": "skyanalyst",
    "number": "11",
    "title": "SkyAnalyst: Satellite Imagery Intelligence and Economic Indicator Forecasting Platform",
    "domain": "Geospatial AI / FinTech",
    "difficulty": "EXTREME",
    "rank": "11 of 75",
    "coreIdea": "An intelligence platform that converts raw multispectral satellite imagery into real-time economic indicators by monitoring physical activity at scale.",
    "problem": "Traditional economic data (GDP, retail reports) are lagging indicators, often published weeks or months late. Institutional investors lack real-time visibility into the ground-truth physical economy, leading to delayed decisions.",
    "solution": "SkyAnalyst automates the analysis of high-resolution satellite data to track parking lot occupancy, shipping container volume, and factory thermal signatures, providing a 2-week early warning on retail and industrial performance.",
    "technicalArchitecture": "Distributed processing pipeline using Apache Airflow. Ingests daily multispectral data from Sentinel-2 and Planet Labs. Computer Vision core: Custom UNet++ for high-precision segmentation of vehicles, containers, and building footprints; Siamese Networks for change detection; Thermal anomaly detection using LWIR bands. Time-series forecasting: Temporal Fusion Transformers (TFT) integrate visual signals with macroeconomic data to predict ticker-level quarterly revenue for 500+ global enterprises.",
    "features": [
      "Real-time parking lot occupancy tracking for top-50 retailers",
      "Port congestion and shipping container throughput monitoring",
      "Factory activity monitoring via thermal signature analysis",
      "Agricultural yield prediction from NDVI and multispectral indices",
      "Automatic change detection for infrastructure and construction",
      "Revenue forecasting for retail and industrial stock tickers",
      "Custom geographic alerting for geopolitical hotspots",
      "High-fidelity map visualization with temporal slider",
      "API for institutional quant-fund integration",
      "Automated PDF intelligence report generation"
    ],
    "tools": ["Python 3.12", "PyTorch", "Rasterio", "Apache Airflow", "PostGIS", "FastAPI", "React", "Mapbox GL", "Docker", "AWS S3"],
    "links": [
      { "label": "Sentinel Hub", "url": "https://www.sentinel-hub.com/" },
      { "label": "Research Link", "url": "https://arxiv.org/abs/satellite-economics" }
    ],
    "color": "#0284C7",
    "impact": "Provides institutional-grade physical world transparency, reducing information asymmetry in global markets."
  },
  {
    "id": "churnpredictor",
    "number": "16",
    "title": "ChurnPredictor: Enterprise Customer Retention and Revenue Leakage Prevention Engine",
    "domain": "ML / Data Science / SaaS",
    "difficulty": "HIGH",
    "rank": "16 of 75",
    "coreIdea": "An AI-powered retention engine that identifies high-risk customers before they cancel, quantifying the exact revenue at risk and providing actionable intervention strategies.",
    "problem": "SaaS companies lose billions to churn because they rely on 'Health Scores' that are lagging and subjective. By the time a customer shows as 'Red,' they have already made the decision to leave.",
    "solution": "ChurnPredictor analyzes granular behavioral telemetry (feature usage, support tickets intensity, billing patterns, sentiment) to detect the 'Silent Withdrawal' phase 60 days before contract expiry.",
    "technicalArchitecture": "The engine utilizes a hybrid approach: XGBoost for feature-importance-based classification and an LSTM architecture for sequential behavioral modeling. It integrates with Salesforce and Zendesk APIs to ingest multi-source signals. SHAP (SHapley Additive exPlanations) is used to provide 'Reason Codes' for every prediction, ensuring customer success teams understand WHY a customer is at risk. Automated 'Retention Playbooks' are triggered via Webhooks based on the risk category.",
    "features": [
      "90-day predictive window for churn identification",
      "SHAP-based reason codes for transparent risk assessment",
      "Automatic segmentation by CLV and risk intensity",
      "Sentiment analysis of support tickets and emails",
      "Revenue-at-risk quantification for executive reporting",
      "Automated intervention playbooks (discounts, outreach)",
      "Feature-level impact analysis for product teams",
      "CRM integration (Salesforce, HubSpot, Zendesk)",
      "A/B testing for retention strategy validation",
      "Monthly 'Health Drift' tracking for cohorts"
    ],
    "tools": ["Python 3.11", "XGBoost", "Scikit-Learn", "SHAP", "FastAPI", "Pandas", "PostgreSQL", "Redis", "Celery", "Tableau API"],
    "links": [
      { "label": "SHAP Documentation", "url": "https://shap.readthedocs.io/" },
      { "label": "XGBoost Home", "url": "https://xgboost.readthedocs.io/" }
    ],
    "color": "#DC2626",
    "impact": "Reduces net churn by 18-35% and increases expansion revenue by identifying cross-sell opportunities in healthy accounts."
  },
  {
    "id": "esglens",
    "number": "26",
    "title": "ESGLens: Automated Supply Chain ESG Risk Assessment and Scope 3 Reporting",
    "domain": "FinTech / Sustainability",
    "difficulty": "VERY HIGH",
    "rank": "26 of 75",
    "coreIdea": "An institutional-grade intelligence platform that automates the collection, verification, and reporting of ESG risks across global multi-tier supply chains.",
    "problem": "Measuring Scope 3 emissions and supply chain ESG risk is manual, opaque, and inconsistent. Companies face massive regulatory pressure (CSRD, SEC) to report data they simply don't have.",
    "solution": "ESGLens builds a digital twin of the supply chain, mapping 15 GHG Protocol categories and assessing social/governance risks using automated data ingestion and industry-leading emission factor databases.",
    "technicalArchitecture": "Multi-tier graph structure built from procurement data and D&B intelligence. Integration with ecoinvent and EPA EEIO databases for high-fidelity emission modeling. Graph algorithms identify 'Critical Hotspots' and 'Intervention Points.' Automated disclosure engine generates GRI 305/TCFD/SEC compliant reports with full provenance tracking for auditors.",
    "features": [
      "Automated Scope 3 Category coverage (all 15 GHG types)",
      "Multi-method calculation: Spend-based, Activity-based, Supplier-specific",
      "18,000+ localized emission factors integration",
      "Supplier benchmarking against sector and regional peers",
      "Top-10 abatement cost curve identification",
      "Automated CDP, GRI, TCFD disclosure generation",
      "Real-time regulatory change monitoring & flagging",
      "Supplier engagement portal with primary data collection",
      "Internal carbon price modeling and impact projection",
      "Blockchain-based verification for green claims"
    ],
    "tools": ["Python 3.12", "FastAPI", "NetworkX", "PostgreSQL", "React", "D3.js", "Redis", "Celery", "Docker", "SAP Ariba API"],
    "links": [
      { "label": "GHG Protocol", "url": "https://ghgprotocol.org/" },
      { "label": "EPA EEIO", "url": "https://www.epa.gov/" }
    ],
    "color": "#059669",
    "impact": "Enables corporations to transition from 'Commitments' to 'Calculated Action' with audit-ready transparency."
  },
  {
    "id": "voiceguard",
    "number": "42",
    "title": "VoiceGuard: Real-Time Audio Deepfake and Voice Fraud Detection Platform",
    "domain": "AI Security / Audio ML",
    "difficulty": "EXTREME",
    "rank": "42 of 75",
    "coreIdea": "A real-time detection API that identifies AI-synthesized voice content and voice cloning attacks to prevent financial fraud and identity theft.",
    "problem": "Voice deepfake fraud is growing at 300% annually. CEO fraud and call center identity theft via voice cloning are costing enterprises billions, with existing systems unable to detect synthetic voices in real-time.",
    "solution": "VoiceGuard uses physiological prosody analysis and spectral fingerprinting to detect artifacts that synthetic voices cannot replicate, providing sub-50ms latency detection for live streams.",
    "technicalArchitecture": "Ensemble of 5 independent models including RawNet2 for waveform analysis and custom prosodic feature extractors. Analyzes pitch trajectory, speaking rate, and spectral artifacts from vocoders (HiFi-GAN, VITS). Real-time processing via WebSockets with rolling confidence scoring. Continuous adversarial training against the latest TTS models.",
    "features": [
      "Sub-50ms latency real-time WebSocket analysis",
      "Ensemble detection: Prosodic + Spectral + Physiological",
      "Synthesis type classification (TTS vs. Voice Conversion)",
      "99%+ accuracy with <0.5% false positive rate",
      "PBX integration for enterprise call centers",
      "Mobile SDK for secure voice authentication",
      "Timestamped evidence log for legal use",
      "Chain of custody reporting for auditors",
      "Red-team adversarial reports quarterly",
      "Multi-language support for global protection"
    ],
    "tools": ["Python 3.12", "PyTorch", "RawNet2", "FastAPI", "WebSockets", "Redis", "PostgreSQL", "FFmpeg", "Docker", "React"],
    "links": [
      { "label": "ASVspoof Challenge", "url": "https://www.asvspoof.org/" },
      { "label": "Research Paper", "url": "https://arxiv.org/abs/voice-deepfake" }
    ],
    "color": "#B91C1C",
    "impact": "Protects the integrity of voice-based communication in a world where reality can be synthesized."
  }
]

def merge_and_write():
    html_path = r"c:\Users\anshu\OneDrive\Desktop\Portflio\src\pages\projects\Project.html"
    output_path = r"c:\Users\anshu\OneDrive\Desktop\Portflio\src\data\all_projects.ts"
    
    if not os.path.exists(html_path):
        print(f"Error: {html_path} does not exist")
        return

    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    cards = re.split(r'<div class="project-card" id="project-\d+">', content)[1:]
    
    all_projects = []
    elite_nums = [p['number'].lstrip('0') for p in elite_projects]
    
    # Process elite first
    all_projects.extend(elite_projects)
        
    # Add the others
    for card in cards:
        try:
            num_match = re.search(r'<span class="proj-num">#(.*?)</span>', card)
            num_raw = num_match.group(1).split('<')[0].strip() if num_match else "00"
            num_clean = num_raw.lstrip('0')
            
            if num_clean in elite_nums:
                continue
                
            title_match = re.search(r'<h2 class="proj-title".*?>(.*?)</h2>', card)
            title = title_match.group(1).lstrip('0123456789. ').strip() if title_match else "Untitled Project"
            
            domain_match = re.search(r'<span class="domain-tag".*?>(.*?)</span>', card)
            domain = domain_match.group(1).strip() if domain_match else "General"
            
            idea_match = re.search(r'<p class="proj-idea".*?>(.*?)</p>', card)
            idea = idea_match.group(1).replace('<span class="label">Core Idea:</span>', '').replace('<span class="label">Core idea:</span>', '').strip() if idea_match else ""
            
            diff_match = re.search(r'<span class="diff-badge".*?>(.*?)</span>', card)
            diff = diff_match.group(1).strip() if diff_match else "MEDIUM"
            
            all_projects.append({
                "id": f"proj-{num_raw}",
                "number": num_raw,
                "title": title,
                "domain": domain,
                "coreIdea": idea,
                "difficulty": diff,
                "rank": f"{num_raw} of 75",
                "color": "#4B5563", # Default gray for non-elite
                "tools": [],
                "features": []
            })
        except Exception:
            pass
            
    # Sort by number
    all_projects.sort(key=lambda x: int(x['number']))

    header = """export interface Project {
  id: string;
  number: string;
  title: string;
  domain: string;
  difficulty: string;
  rank: string;
  coreIdea: string;
  problem?: string;
  solution?: string;
  technicalArchitecture?: string;
  features?: string[];
  tools?: string[];
  links?: { label: string; url: string }[];
  color: string;
  impact?: string;
}

"""
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(header)
        f.write("export const allProjects: Project[] = ")
        f.write(json.dumps(all_projects, indent=2))
        f.write(";")

    print(f"Successfully wrote {len(all_projects)} projects to {output_path}")

if __name__ == "__main__":
    merge_and_write()

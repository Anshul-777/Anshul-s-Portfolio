import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ──────────────────────────────────────────────────────────
//  PROJECT #01 — PolyAgent
//  Multi-Agent Enterprise Research Synthesis Network
//  Author : Anshul Rathod  |  Rank: #1 of 75  |  Status : Conceptual → In Development
// ──────────────────────────────────────────────────────────

/* ---------- PROMPT BANK (hidden; clipboard-only) ---------- */
const PROMPTS = {
  backend: `You are a world-class Python distributed systems engineer. Build the complete, production-ready FastAPI backend for "PolyAgent" — a multi-agent enterprise research synthesis platform that orchestrates 8 specialist AI agents in parallel to generate boardroom-quality intelligence reports in under 90 seconds.

EXACT TECH STACK: Python 3.12, FastAPI, LangGraph (agent orchestration), LangChain (tools + prompts), OpenAI GPT-4o (primary LLM), Anthropic Claude API (secondary/verification LLM), Celery + Redis (async agent workers), Qdrant (vector store for agent working memory), PostgreSQL + asyncpg (sessions, reports, audit), Pydantic v2 (schemas), WeasyPrint (PDF generation), python-docx (DOCX), Playwright (web scraping), SerpAPI (web search), Docker.

ARCHITECTURE — build every file with complete, working code:

1. /app/main.py — FastAPI app with: CORS (configurable origins), JWT RS256 middleware, WebSocket endpoint for real-time agent progress streaming, OpenAPI docs at /docs, Prometheus metrics at /metrics, lifespan (startup: init Qdrant collections, verify API keys; shutdown: drain Celery queues).

2. /app/graph/orchestrator.py — LangGraph StateGraph:
   State schema: ResearchState (TypedDict): {query, query_complexity_score, task_graph, agent_assignments, working_memory_keys, completed_subtasks, contradictions_detected, draft_report, verification_results, final_report, confidence_scores}
   Nodes: query_decomposer → dispatch_specialist_agents (fan-out) → [8 parallel agent nodes] → synthesis_agent → verification_agent → report_compiler
   Edges: conditional routing based on task dependencies (DAG execution — synthesis only starts when all required agent subtasks complete)
   Parallel execution: all 8 specialist agents run concurrently via asyncio.gather, results deposited into shared Qdrant working memory

3. /app/agents/ — 8 specialist agent files, each with full tool definitions:

   financial_agent.py: Tools: alpha_vantage_price(), edgar_full_text_search(query, company), crunchbase_funding_rounds(company), pitchbook_comparable_companies(sector). Prompts: structured extraction of revenue, funding, ownership, M&A data. Outputs: FinancialReport Pydantic model with source citations.

   patent_agent.py: Tools: uspto_patents_view_search(assignee, keywords), google_patents_semantic(query), epo_open_patent_services(applicant). Extracts: claim language, citation graphs, assignee networks, tech trajectories. Outputs: PatentReport.

   news_agent.py: Tools: serpapi_search(query, temporal_filter), bing_news_api(query, freshness), rss_aggregator(topic, sources_list). Temporal-aware summarization prompt with recency weighting. Outputs: NewsReport with publication dates and source authority scores.

   regulatory_agent.py: Tools: edgar_search(company, form_type), sec_full_text(query), eu_regulatory_db_search(regulation_area). Table extraction from PDFs using pdfplumber. Outputs: RegulatoryReport with compliance risk flags.

   academic_agent.py: Tools: semantic_scholar_api(query, fields_of_study), arxiv_search(query, category), pubmed_search(mesh_terms). PDF section-aware summarization (intro + methods + results). Outputs: AcademicReport with citation counts.

   geopolitical_agent.py: Tools: world_bank_data(indicator, countries), un_comtrade_api(commodity, reporter, partner), gov_statistics_scraper(country, dataset). Geopolitical risk scoring rubric (0–100): political stability, trade exposure, regulatory environment. Outputs: GeopoliticalReport.

   market_data_agent.py: Tools: industry_report_scraper(sector), statista_search(market_topic), company_website_scraper(url, sections). Market size extraction, growth rate, competitive landscape. Outputs: MarketReport.

   competitive_profiling_agent.py: Tools: entity_resolver(company_name) → canonical_id, relationship_graph_builder(entity_ids). Builds competitor entity graph: ownership, subsidiaries, key personnel, strategic relationships. Outputs: CompetitiveReport.

4. /app/services/working_memory.py — QdrantWorkingMemory:
   init_session(session_id): creates isolated Qdrant collection for this research session
   deposit(session_id, agent_name, content, metadata): embeds content + stores with metadata tags
   query(session_id, semantic_query, agent_filter=None): semantic search across all agent deposits
   detect_contradictions(session_id): finds semantically similar claims from different agents with conflicting values — returns ContradictionReport list
   cleanup(session_id): deletes session collection after report generation

5. /app/services/synthesis.py — SynthesisAgent:
   reconcile_contradictions(contradictions): for each contradiction, queries source documents via RAG, applies source authority ranking (academic > regulatory filing > news > web), selects higher-confidence claim, flags discrepancy in report
   generate_confidence_scores(draft): per-claim confidence scoring via verification RAG — each factual claim matched against retrieved source passages using semantic similarity → confidence 0–100%
   claims_below_threshold(draft, threshold=60): returns list of claims to flag as "Verify Manually"

6. /app/services/report_compiler.py — ReportCompiler:
   compile_pdf(research_state): WeasyPrint PDF with sections: Executive Summary, Key Findings (3–5 bullet points), Detailed Analysis per domain, Source Citations with hyperlinks, Confidence Score Legend
   compile_docx(research_state): python-docx with styled headings, numbered citations
   compile_html(research_state): interactive HTML with expandable sections, source popups, confidence visualization

7. /app/routers/research.py — all REST + WebSocket endpoints:
   POST /api/research/start — submits query, returns session_id, kicks off LangGraph execution via Celery
   GET /api/research/{session_id}/status — polling endpoint with progress: {completed_agents, total_agents, current_phase, eta_seconds}
   WS /api/research/{session_id}/stream — WebSocket: streams agent progress events as JSON {agent_name, status, retrieved_count, confidence}
   GET /api/research/{session_id}/report — returns final report in requested format (PDF/DOCX/HTML/JSON)
   GET /api/research/history — paginated list of all past research sessions for authenticated user
   DELETE /api/research/{session_id} — deletes session + working memory

8. /app/services/query_decomposer.py — QueryDecompositionAgent:
   decompose(query): GPT-4o with structured output → ResearchOntology: {primary_claims_to_verify, data_dimensions, entities_to_track, time_horizon, required_agents, agent_dependencies (DAG edges), estimated_complexity_score (1–10)}
   estimate_time(complexity_score): seconds estimate for progress display
   select_agents(research_ontology): determines which of 8 agents are needed for this specific query (not all queries need all agents)

9. /app/utils/auth.py — JWT RS256: generate_rsa_keys(), create_access_token(), verify_token(), RBAC: enterprise_admin, analyst, viewer
10. /app/models/ — SQLAlchemy: Organization, User, ResearchSession, ResearchReport, AgentExecutionLog, SourceCitation, ApiKey
11. /app/workers/celery_app.py — orchestration_worker (executes LangGraph), cleanup_worker (purges old sessions after 30d)
12. /tests/ — pytest-asyncio: 100% endpoint coverage, agent mock tests (mock all external APIs), synthesis unit tests, WebSocket integration test
13. docker-compose.yml — api, postgres, redis, qdrant, celery-worker, playwright-service (headless browser for scraping)

All external API calls wrapped in retry logic (tenacity: 3 attempts, exponential backoff). Circuit breaker pattern for each data source. Rate limit handling per API. All code 100% type-annotated. No placeholders.`,

  frontend: `You are a senior React/TypeScript engineer. Build the complete frontend for "PolyAgent" — a multi-agent enterprise research synthesis platform with a stunning real-time agent activity visualization.

STACK: React 18, TypeScript 5, Vite, TailwindCSS 3, Framer Motion (page + component animations), D3.js v7 (agent network graph), Recharts (charts), React Query v5, Zustand, React Router v6, Lucide React (icons), shadcn/ui, DM Sans font (Google Fonts).

DESIGN: Clean white (#FFFFFF) theme, slate-50 sidebar, accent color #7C3AED (violet-600), neutral text on white cards. Card borders: 1px solid #E2E8F0. Subtle shadows. This is an enterprise product — refined, not flashy. Typography: DM Sans for all text.

BUILD THESE PAGES AND COMPONENTS — all complete, no placeholders:

1. /src/pages/Research.tsx — MAIN PAGE — the crown jewel:
   Top: "New Research" input (full-width textarea, large) with complexity estimator that shows in real-time as user types ("Estimated: 8 agents · 45 seconds · High complexity").
   Below input: 3 example query cards ("Map competitive landscape of AI logistics platforms in Southeast Asia", "Analyze patent landscape for mRNA vaccine delivery mechanisms", "ESG risk assessment of Apple's Tier 2 suppliers").
   Active research: animated agent network graph (D3 force-directed) showing 8 agent nodes, their connections, status (pending=gray, running=pulsing violet circle, complete=green checkmark). Each node shows: agent icon, retrieved items count, confidence percentage.
   Real-time log: scrolling console-style log of agent activity ("Financial Agent: Retrieved Q3 earnings from EDGAR for 3 companies...").
   Below: completed report preview card with tabs (Executive Summary, Full Report, Sources, Confidence Map).

2. /src/pages/Reports.tsx — Research library:
   Grid of past report cards: query summary, date, agent count, overall confidence, tags, download buttons (PDF, DOCX). Search + filter by date range, confidence threshold, tags. Clicking opens ReportViewer.

3. /src/pages/ReportViewer.tsx — Full report display:
   Left sidebar: report TOC (sections), confidence legend.
   Main content: rendered report with: highlighted low-confidence claims (yellow background, ⚠ tooltip), source citations as superscripts (click to expand source popover), contradiction flags (orange banner "2 sources disagreed — higher confidence source selected").
   Right panel: source list with authority scores, agent contribution breakdown (pie chart), query decomposition tree (expandable).

4. /src/pages/Dashboard.tsx — Organization overview:
   Stats: research sessions this month, avg confidence score, avg completion time, most-queried topics.
   Activity feed: recent research sessions with outcomes.
   Quota indicator: API call budget consumed this month.
   Top user leaderboard (by research volume).

5. /src/pages/Settings.tsx — Agent configuration:
   Data source toggles: enable/disable each of 8 data sources (Bloomberg, PitchBook, USPTO, SerpAPI, etc.) with API key fields.
   Model selection: GPT-4o / Claude Opus for primary reasoning.
   Report templates: configure default output sections and formatting.
   Webhook configuration: Slack / Teams / email notification on report complete.
   User management: invite analysts, set quotas.

6. /src/components/agents/AgentNetworkGraph.tsx — D3 force-directed network:
   Nodes: Master Orchestrator (center, large) + 8 specialist agents (orbiting). Node colors by status. Node size proportional to data retrieved.
   Edges: animated dashed lines showing data flow from agents → orchestrator → synthesis.
   On hover: tooltip with agent details (tools used, items retrieved, time elapsed, confidence).
   Status pulse animation: running agents have radial pulse animation (CSS keyframes on SVG circle).

7. /src/components/report/ConfidenceMap.tsx — Visual confidence display:
   Color-coded bar showing overall report confidence (0–100%).
   Per-claim confidence breakdown: list of each claim color-coded green/yellow/red.
   Source authority visualization: horizontal stacked bar showing contribution by source type.

8. /src/components/agents/AgentStatusCard.tsx — Individual agent status:
   Used in: real-time research view (list). Shows: agent emoji/icon, name, status badge (Queued/Running/Complete/Failed), items retrieved count, confidence %, elapsed time, latest action description. Animated green progress bar on running state.

9. /src/components/layout/ — Sidebar (with agent status indicators as badges), Topbar (credits remaining display), PageWrapper.

10. /src/hooks/useResearchStream.ts — WebSocket hook: connects to WS /api/research/{session_id}/stream, parses agent progress events, updates Zustand store. Auto-reconnect on disconnect. Cleanup on component unmount.

ANIMATIONS: Framer Motion — page transitions (slide up + fade), agent cards stagger into view on report load. D3 graph: smooth force simulation, nodes transition between status states with animated fill color change (gray → violet pulse → green). Report sections animate in sequentially on scroll.

All components TypeScript typed. React Query for all API calls. Error boundaries on all major sections. Loading skeletons for all data-fetching states.`,

  database: `You are a senior PostgreSQL architect. Design the complete database schema for "PolyAgent" — a multi-agent research platform.

Write complete CREATE TABLE, CREATE INDEX, CREATE VIEW, and CREATE FUNCTION SQL. All tables with proper constraints, foreign keys, and comments. Write complete Alembic migration chain.

TABLES:

organizations: id (UUID PK), name, slug (UNIQUE), plan (starter/growth/enterprise), monthly_query_quota, api_call_budget_usd, settings (JSONB: agent_config, output_formats, notification_webhooks), created_at, updated_at

users: id (UUID PK), org_id (FK → organizations), email (UNIQUE per org), password_hash, role (admin/analyst/viewer), full_name, avatar_url, monthly_query_count, last_active, created_at

api_keys: id (UUID PK), org_id (FK), user_id (FK), key_hash (UNIQUE), name, permissions (JSONB: [read_reports, create_research, manage_users]), rate_limit_per_hour, last_used, expires_at, created_at

research_sessions: id (UUID PK), org_id (FK), user_id (FK), query_original, query_complexity_score (SMALLINT 1–10), required_agents (TEXT[]), dag_definition (JSONB), status (queued/running/synthesis/completed/failed), started_at, completed_at, total_duration_seconds, overall_confidence_score (NUMERIC 5,2), api_cost_usd (NUMERIC 8,4), error_message

agent_execution_logs: id (UUID PK), session_id (FK → research_sessions), agent_name, status (pending/running/completed/failed), started_at, completed_at, duration_ms, items_retrieved (INT), confidence_score (NUMERIC 5,2), tool_calls (JSONB: [{tool_name, parameters, result_preview, latency_ms}]), working_memory_key, error_details

research_reports: id (UUID PK), session_id (FK, UNIQUE), executive_summary, full_report_markdown, contradiction_count (SMALLINT), low_confidence_claims (JSONB: [{claim_text, confidence, suggested_action}]), pdf_path, docx_path, html_content, report_version (SMALLINT), created_at

source_citations: id (UUID PK), report_id (FK → research_reports), agent_name, source_type (academic/regulatory/news/web/proprietary), source_url, source_title, source_date, source_authority_score (NUMERIC 3,2), claim_supported, retrieved_at

contradiction_flags: id (UUID PK), report_id (FK), agent_1, agent_2, claim_1, claim_2, resolution (agent_1_preferred/agent_2_preferred/both_flagged), resolution_confidence, resolver_notes

user_query_history: id (UUID PK), user_id (FK), session_id (FK), query_tags (TEXT[] — auto-generated), bookmarked (BOOL), rating (SMALLINT 1–5), notes, created_at

INDEXES:
research_sessions: (org_id, started_at DESC) for org query history; (status, started_at) for queue monitoring; GIN on required_agents for agent usage analytics
agent_execution_logs: (session_id, agent_name) UNIQUE partial where status != 'failed'; (agent_name, started_at) for performance analytics
source_citations: (report_id, source_authority_score DESC); GIN on TEXT search: tsvector(source_title, source_url)
user_query_history: GIN on query_tags for tag-based search

VIEWS:
org_usage_summary: per org — sessions this month, avg confidence, avg duration, total api cost, quota utilization %
agent_performance_stats: per agent — avg items retrieved, avg confidence, avg duration, failure rate (last 30d)
high_value_reports: sessions with overall_confidence > 85 and user rating >= 4

FUNCTIONS:
calculate_session_cost(session_id UUID) RETURNS NUMERIC — sums api_call_budget from all agent tool calls
get_trending_queries(org_id UUID, days INT) RETURNS TABLE(tag TEXT, count INT) — most frequent tags in recent sessions
report_search(org_id UUID, search_text TEXT, min_confidence NUMERIC) RETURNS TABLE — full-text search across reports with pg_trgm similarity

ALEMBIC: Write env.py + 3 migration files: 001_initial_schema, 002_indexes_and_views, 003_functions_and_constraints

SEED: Python seeder with Faker — 2 orgs, 10 users, 50 research sessions with realistic queries, all agent logs, 50 reports with citations and contradictions.`,

  agentPrompts: `You are an expert prompt engineer specializing in multi-agent AI systems. Design the complete prompt library for "PolyAgent" — 8 specialist research agents.

Write COMPLETE system prompts, user message templates, and structured output schemas for each agent. These prompts must produce consistent, high-quality research outputs when used with GPT-4o.

GENERAL PRINCIPLES for all agent prompts:
- Begin with precise role definition and domain expertise
- Specify exact output format (Pydantic-compatible JSON schema)
- Include source citation requirements (every claim must cite a source)
- Specify confidence scoring rubric (0–100: based on source recency, authority, corroboration)
- Include contradiction detection instructions (flag when retrieved data conflicts)
- Specify temporal context (prefer sources from last 12 months unless historical context needed)
- Output must be machine-parseable JSON — no prose preamble

WRITE COMPLETE PROMPTS FOR ALL 8 AGENTS:

1. QUERY DECOMPOSITION AGENT:
System: [500+ word prompt defining orchestration role, DAG construction methodology, agent assignment logic, complexity scoring rubric (1–10 scale with precise definitions), time estimation formula]
Output schema: QueryDecomposition JSON with: task_graph (list of {subtask_id, agent_name, dependencies, priority, time_estimate_seconds}), entities_to_track (list), time_horizon, complexity_score (1–10 with justification), required_agents (list), estimated_total_time

2. FINANCIAL INTELLIGENCE AGENT:
System: [600+ word prompt for financial data extraction. Role: elite financial analyst. Data sources: SEC EDGAR, Alpha Vantage, CrunchBase, PitchBook. Extraction targets: revenue (TTM, YoY growth), gross margin, burn rate, funding history (all rounds with investors), valuation at last round, M&A history (acquirer, target, deal value, rationale), key financial ratios. Citation rules: every figure must cite source + date. Confidence rubric: audited financials = 90–100, analyst estimates = 60–75, news mentions = 40–60.]
Output schema: FinancialReport JSON

3. PATENT & IP AGENT:
System: [600+ word prompt for IP intelligence. Role: IP analyst + patent attorney. Sources: USPTO PatentsView, Google Patents, EPO OPS. Extraction: assignee portfolio size, key patent claims (simplified English), citation graph (who cites them / who they cite), technology trajectory (which tech areas growing in filings), freedom to operate risks. Confidence rubric: granted patents = 95, published applications = 70, provisional applications = 50.]
Output schema: PatentReport JSON

4. NEWS & MEDIA AGENT:
System: [600+ word prompt. Role: investigative journalist + media analyst. Sources: web search, news APIs, RSS. Temporal decay weighting: articles < 7 days = full weight, 7–30 days = 0.8, 30–90 days = 0.5, > 90 days = 0.3. Source authority: WSJ/Bloomberg/Reuters = 95, trade publications = 75, general news = 60, social media = 30. Extraction: narrative thread (chronological story arc), sentiment trajectory, key actors and their positions, regulatory risk signals, reputational events.]
Output schema: NewsReport JSON

5. REGULATORY & LEGAL AGENT:
System: [600+ word prompt. Role: regulatory compliance attorney. Sources: SEC EDGAR (10-K risk factors, 8-K material events), EU regulatory DB, FDA, FTC. Extraction: active regulatory proceedings, compliance violations (type, severity, fine amount, resolution), pending legislation impact, jurisdiction risk matrix (rate each jurisdiction: low/medium/high regulatory risk for this entity/sector). Confidence: official filings = 95, news = 60.]
Output schema: RegulatoryReport JSON

6. ACADEMIC RESEARCH AGENT:
System: [500+ word prompt. Role: research scientist. Sources: Semantic Scholar, ArXiv, PubMed. Extraction: technology readiness level (1–9 TRL), publication velocity trend (papers/year in topic), key research groups and institutions, consensus vs. contested findings (note where papers disagree), commercial viability signals (industry collaborations, startup spin-offs cited). Confidence: peer-reviewed = 90, preprint = 65.]
Output schema: AcademicReport JSON

7. GEOPOLITICAL CONTEXT AGENT:
System: [500+ word prompt. Role: geopolitical risk analyst. Sources: World Bank, UN Comtrade, government portals, political risk databases. Scores: political stability index (0–100), trade exposure score (0–100 based on import/export concentration), regulatory environment score (0–100), sanctions risk (none/potential/active). Extraction: bilateral trade data, supply chain geographic concentration risks, upcoming elections and policy implications.]
Output schema: GeopoliticalReport JSON

8. SYNTHESIS AGENT:
System: [700+ word prompt — the most critical agent. Role: chief research analyst, final authority. Receives: all 7 specialist reports. Task: (1) Identify all factual claims across all reports. (2) Cross-reference for contradictions — if two agents report different values for same metric, trigger contradiction resolution. (3) Assign per-claim confidence score as weighted average of source authority scores. (4) Structure into coherent narrative: Executive Summary (3 sentences max), Key Findings (5 bullet points), Detailed Analysis (organized by research question), Strategic Implications (3–5 implications), Limitations and Uncertainties. (5) Flag all claims with confidence < 60% with ⚠ marker. Style: Boardroom quality. McKinsey-style. Direct, quantified, actionable. No hedge words without confidence score justification.]
Output schema: SynthesisReport JSON with full structured sections

Also write: VERIFICATION AGENT prompt (1000+ words) for claim-level RAG verification, source authority ranking methodology, contradiction resolution decision tree (with exact logic for 12 common contradiction types: different revenue figures, different funding amounts, contradictory legal status, etc.)`,

  deployment: `You are a senior DevOps engineer. Write the complete deployment infrastructure for "PolyAgent" — a high-throughput multi-agent research platform with strict latency requirements (< 90 seconds end-to-end).

INFRASTRUCTURE REQUIREMENTS:
- API must handle 50 concurrent research sessions (each using 8 parallel agent workers)
- Qdrant vector store must persist between restarts
- Playwright browser instances for web scraping (resource-intensive — needs dedicated container)
- WebSocket connections must be sticky (same server for duration of research session)
- PDF generation (WeasyPrint) is CPU-intensive — separate worker pool

DELIVERABLES — all complete:

1. /Dockerfile — Multi-stage: stage 1 (builder): install Python 3.12, all deps including playwright chromium, compile heavy deps (numpy, scipy) with cache. Stage 2 (runtime): copy only artifacts, non-root user (uid 1000), health check (GET /health → 200). Chromium installed in system path for Playwright.

2. /docker-compose.yml — services:
   api: FastAPI + uvicorn (--workers 4, --loop uvloop, --http h11), port 8000, depends_on postgres + redis + qdrant
   celery-research: Celery worker (--concurrency 20 — handles 20 parallel agent tasks), queues: research,agents
   celery-reports: Celery worker (--concurrency 4), queue: reports (PDF/DOCX generation — CPU intensive, lower concurrency)
   playwright-service: Dedicated container with chromium for web scraping agents (REST API: POST /scrape {url, sections} → HTML)
   postgres: 15-alpine, initdb scripts, pg_trgm extension, volume: pgdata
   redis: 7-alpine, --maxmemory 2gb --maxmemory-policy allkeys-lru, volume: redisdata
   qdrant: qdrant/qdrant:latest, volume: qdrantdata, port 6333
   nginx: 1.25-alpine, sticky sessions (ip_hash), WebSocket upgrade headers, rate limiting, gzip

3. /nginx/nginx.conf — complete config:
   upstream api_servers { ip_hash; server api:8000; }
   rate limiting: 5 req/s for /api/research/start (expensive), 100 req/s for GET endpoints
   WebSocket proxy: upgrade headers, read_timeout 120s (research takes up to 90s)
   SSL termination ready (Let's Encrypt certbot integration instructions)
   Gzip: compress JSON responses > 1kb

4. /.github/workflows/ci.yml — GitHub Actions:
   On PR: ruff lint, mypy typecheck, pytest (all tests with real API mocks), coverage report (must be > 85%)
   On merge to main: build Docker image → push to GHCR → deploy to Railway (webhook) → smoke test (POST /api/research/start with simple query, assert 200, WebSocket connects)
   Weekly: dependency vulnerability scan (pip-audit), Playwright chromium update check

5. /railway.toml — deployment config, env var references, healthcheck

6. /monitoring/ — complete Prometheus + Grafana setup:
   /monitoring/prometheus.yml — scrape_configs for api (/metrics), celery (flower), postgres (postgres_exporter), qdrant
   /monitoring/alerts.yml — critical alerts: research_session_p90_latency > 90s (SLA breach), celery_queue_depth{queue=research} > 50 (backlog), qdrant_disk_usage > 80%, api_error_rate_5m > 5%
   /monitoring/grafana/dashboards/polyagent.json — pre-built dashboard: research sessions/hour, avg agent duration by type, success rate, api cost accumulation, Qdrant collection sizes

7. /scripts/scale_workers.sh — dynamic scaling: checks Redis queue depth, scales celery-research container count (docker-compose scale) based on load

8. /docs/architecture.md — system architecture diagram (Mermaid), deployment guide, troubleshooting runbook for top 10 issues: Qdrant OOM, Playwright timeout, OpenAI rate limit, WebSocket disconnect, Celery worker crash

ENVIRONMENT VARIABLES (document all 42 with description, type, example, required flag): OPENAI_API_KEY, ANTHROPIC_API_KEY, SERPAPI_KEY, BING_SEARCH_API_KEY, ALPHA_VANTAGE_KEY, SEC_EDGAR_USER_AGENT, CRUNCHBASE_API_KEY, SEMANTIC_SCHOLAR_API_KEY, QDRANT_URL, QDRANT_API_KEY, DATABASE_URL, REDIS_URL, JWT_PRIVATE_KEY (RS256 PEM), JWT_PUBLIC_KEY, CELERY_BROKER_URL, CELERY_RESULT_BACKEND, PLAYWRIGHT_SERVICE_URL, WEASYPRINT_FONTS_PATH, REPORT_STORAGE_PATH, SENTRY_DSN, LOG_LEVEL, MAX_CONCURRENT_SESSIONS, SESSION_TIMEOUT_SECONDS (default 120), CONFIDENCE_LOW_THRESHOLD (default 60), etc.`
};

interface Comment { id: number; name: string; message: string; timestamp: string; avatar: string; }

export default function PolyAgent() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, name: "Rohan Mehta", message: "The DAG-based orchestration with dependency management is the key differentiator here. Most 'multi-agent' tools just run agents sequentially or without dependency tracking. Love the contradiction resolution approach.", timestamp: "3 days ago", avatar: "RM" },
    { id: 2, name: "Aisha Patel", message: "The claim-level confidence scoring is what enterprise research teams actually need. Perplexity and similar tools don't tell you HOW confident they are in each specific fact.", timestamp: "1 week ago", avatar: "AP" },
  ]);
  const [newComment, setNewComment] = useState({ name: "", message: "" });
  const [dlStatus, setDlStatus] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["overview", "problem", "solution", "architecture", "features", "stack", "impact", "prompts", "downloads", "comments"];
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) { const r = el.getBoundingClientRect(); if (r.top <= 120 && r.bottom >= 120) { setActiveSection(s); break; } }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const copyPrompt = (key: string) => {
    navigator.clipboard.writeText(PROMPTS[key as keyof typeof PROMPTS]).then(() => {
      setCopiedKey(key); setTimeout(() => setCopiedKey(null), 2500);
    });
  };

  const addComment = () => {
    if (!newComment.name.trim() || !newComment.message.trim()) return;
    setComments(p => [{ id: Date.now(), name: newComment.name, message: newComment.message, timestamp: "Just now", avatar: newComment.name.slice(0, 2).toUpperCase() }, ...p]);
    setNewComment({ name: "", message: "" });
  };

  const downloadPDF = async () => {
    setDlStatus("Generating…");
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const VIOLET = [124, 58, 237] as [number, number, number];
      const DARK = [15, 23, 42] as [number, number, number];
      const GRAY = [100, 116, 139] as [number, number, number];
      const W = 210, pad = 18;
      let y = 0;
      const addPage = () => { doc.addPage(); y = 24; };
      const checkY = (n: number) => { if (y + n > 275) addPage(); };
      const section = (t: string, e: string) => { checkY(16); doc.setFillColor(...VIOLET); doc.rect(pad - 3, y - 5, 4, 10, "F"); doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.setTextColor(...DARK); doc.text(`${e}  ${t}`, pad + 4, y + 2); y += 12; };
      const body = (t: string) => { doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(51, 65, 85); const l = doc.splitTextToSize(t, W - pad * 2); checkY(l.length * 5 + 3); doc.text(l, pad, y); y += l.length * 5 + 3; };
      const bullet = (t: string) => { checkY(8); doc.setFillColor(...VIOLET); doc.circle(pad + 2, y - 1, 1.2, "F"); doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(51, 65, 85); const l = doc.splitTextToSize(t, W - pad * 2 - 8); doc.text(l, pad + 6, y); y += l.length * 5 + 2; };
      // Cover
      doc.setFillColor(...VIOLET); doc.rect(0, 0, W, 58, "F");
      doc.setFillColor(79, 29, 168); doc.rect(0, 53, W, 8, "F");
      doc.setTextColor(255, 255, 255); doc.setFontSize(24); doc.setFont("helvetica", "bold");
      doc.text("POLYAGENT", pad, 26);
      doc.setFontSize(11); doc.setFont("helvetica", "normal");
      doc.text("Multi-Agent Enterprise Research Synthesis Network", pad, 38);
      doc.setFontSize(9); doc.text("Project #01  ·  Agentic AI  ·  Rank 1 of 75  ·  Difficulty: EXTREME", pad, 49);
      doc.setFillColor(248, 250, 252); doc.rect(0, 61, W, 20, "F");
      doc.setTextColor(...DARK); doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.text("Anshul Rathod", pad, 71);
      doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(...GRAY);
      doc.text("linkedin.com/in/anshul-rathod777  ·  github.com/Anshul-777/PolyAgent", pad, 78);
      y = 95;
      section("Overview", "📋");
      body("PolyAgent is a multi-agent orchestration platform where a Master Orchestrator Agent decomposes enterprise research queries into atomic sub-tasks and dispatches them to 8 specialist sub-agents running in parallel. Each sub-agent accesses domain-specific tools — financial databases, patent registries, regulatory filings, academic papers, and geopolitical data. A Synthesis Agent reconciles conflicting data with source authority scoring. Outputs: verified, cited intelligence reports in 60–120 seconds.");
      section("Problem Statement", "🔴");
      bullet("A single strategic research cycle costs $12,000–$22,000 in analyst labor at Fortune 500 firms");
      bullet("48–72 hour turnaround means strategic decisions are made on stale intelligence");
      bullet("Knowledge workers spend 20–25% of their week searching for information (McKinsey 2024)");
      bullet("45% of executives make major decisions with incomplete competitive intelligence");
      bullet("Critical insights in 300-page SEC filings go unread — no human has the bandwidth");
      section("Idea & Solution", "💡");
      body("PolyAgent replaces the $12K–$22K research cycle with a fully automated, agentic research system. Using LangGraph for DAG-based orchestration, 8 specialist agents run concurrently, each equipped with domain-specific tools and API access. Cross-agent contradictions are resolved by a dedicated Verification Agent using source authority ranking. Final reports include claim-level confidence scores and direct hyperlinks to all source documents.");
      section("Architecture", "⚙️");
      const archItems = ["Layer 1 — Query Intelligence Engine: GPT-4o decomposes query into ResearchOntology with DAG task graph, agent assignments, complexity score (1–10)", "Layer 2 — Specialist Agent Fleet: 8 async Celery workers (Financial, Patent, News, Regulatory, Academic, Geopolitical, Market, Competitive) each with domain-specific tools", "Layer 3 — Shared Working Memory: Qdrant vector store — all agents deposit and query intermediate results via semantic search", "Layer 4 — Synthesis & Verification: Contradiction detection, source authority ranking, per-claim confidence scoring (0–100%)", "Layer 5 — Report Generation: WeasyPrint PDF, python-docx DOCX, interactive HTML with drill-down — all auto-generated"];
      archItems.forEach(item => bullet(item));
      section("Key Features (15)", "✅");
      ["Natural language query with complexity estimation + time prediction", "Real-time WebSocket agent activity stream — watch all 8 agents work live", "DAG orchestration — synthesis only starts when all dependencies complete", "Multi-source contradiction detection with source authority resolution", "Claim-level confidence scores (0–100%) on every factual statement", "Automated citations with hyperlinks to source documents", "Three output formats: PDF, DOCX, interactive HTML with drill-down", "Historical research library — searchable, with diff between re-runs", "Webhook integration: Slack, Teams, email on report completion", "White-label mode — deploy with client branding", "Rate-limited API with per-seat pricing tiers", "Complete audit trail of every query to every data source", "RBAC: enterprise_admin / analyst / viewer", "Multi-language output support (7 languages)", "Report versioning with change diff"].forEach((f, i) => bullet(`${i + 1}. ${f}`));
      section("Tech Stack", "🛠️");
      doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(...VIOLET);
      doc.text("Orchestration: ", pad + 6, y); const w1 = doc.getTextWidth("Orchestration: "); doc.setFont("helvetica", "normal"); doc.setTextColor(51, 65, 85); doc.text("LangGraph, LangChain, Celery, Redis, asyncio", pad + 6 + w1, y); y += 7;
      doc.setFont("helvetica", "bold"); doc.setTextColor(...VIOLET); doc.text("AI/LLM: ", pad + 6, y); const w2 = doc.getTextWidth("AI/LLM: "); doc.setFont("helvetica", "normal"); doc.setTextColor(51, 65, 85); doc.text("OpenAI GPT-4o, Anthropic Claude API, Qdrant vector store", pad + 6 + w2, y); y += 7;
      doc.setFont("helvetica", "bold"); doc.setTextColor(...VIOLET); doc.text("Backend: ", pad + 6, y); const w3 = doc.getTextWidth("Backend: "); doc.setFont("helvetica", "normal"); doc.setTextColor(51, 65, 85); doc.text("Python 3.12, FastAPI, PostgreSQL, Pydantic v2, Alembic", pad + 6 + w3, y); y += 7;
      doc.setFont("helvetica", "bold"); doc.setTextColor(...VIOLET); doc.text("Frontend: ", pad + 6, y); const w4 = doc.getTextWidth("Frontend: "); doc.setFont("helvetica", "normal"); doc.setTextColor(51, 65, 85); doc.text("React 18, TypeScript, D3.js, Recharts, Framer Motion", pad + 6 + w4, y); y += 7;
      doc.setFont("helvetica", "bold"); doc.setTextColor(...VIOLET); doc.text("Reports: ", pad + 6, y); const w5 = doc.getTextWidth("Reports: "); doc.setFont("helvetica", "normal"); doc.setTextColor(51, 65, 85); doc.text("WeasyPrint (PDF), python-docx (DOCX), Playwright (scraping)", pad + 6 + w5, y); y += 12;
      section("Market Impact", "🚀");
      bullet("Directly replaces $12,000–$22,000 per research cycle in analyst labor");
      bullet("Single enterprise customer ROI: achieved within 2 days of deployment");
      bullet("Target: 15,000+ strategy consulting firms, 5,000+ PE/VC firms, 50,000+ corporate strategy teams");
      bullet("Conservative LTV per enterprise customer: $180,000/year ($25K/month × 12 months – churn)");
      bullet("$63B business intelligence market by 2029 (growing from $35B in 2024)");
      section("Links", "🔗");
      doc.setFontSize(9); doc.setTextColor(...VIOLET);
      doc.text("GitHub:  github.com/Anshul-777/PolyAgent", pad + 6, y); y += 7;
      doc.text("LinkedIn:  linkedin.com/in/anshul-rathod777", pad + 6, y); y += 7;
      // Footer
      const tp = doc.getNumberOfPages();
      for (let i = 1; i <= tp; i++) {
        doc.setPage(i); doc.setFillColor(248, 250, 252); doc.rect(0, 285, W, 12, "F");
        doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...GRAY);
        doc.text("© 2025 Anshul Rathod · PolyAgent — Project #01 · All rights reserved", W / 2, 292, { align: "center" });
        doc.text(`Page ${i} of ${tp}`, W - pad, 292, { align: "right" });
      }
      doc.save("PolyAgent_Portfolio_AnshulRathod.pdf");
      setDlStatus("Downloaded ✓");
    } catch { window.print(); setDlStatus("Print dialog opened"); }
    setTimeout(() => setDlStatus(null), 3000);
  };

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FFFFFF", color: "#0F172A" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid #E2E8F0", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link to="/portfolio" style={{ color: "#64748B", fontSize: 13, textDecoration: "none" }}>← Anshul's Projects</Link>
          <span style={{ color: "#CBD5E1" }}>|</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#7C3AED" }}>Project #01</span>
          <span style={{ background: "#7C3AED", color: "#fff", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>RANK #1</span>
          <span style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>EXTREME</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a href="https://github.com/Anshul-777/PolyAgent" target="_blank" rel="noopener" style={{ background: "#0F172A", color: "#fff", padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>⌥ GitHub</a>
          <a href="https://www.linkedin.com/in/anshul-rathod777" target="_blank" rel="noopener" style={{ background: "#0A66C2", color: "#fff", padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>in</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: 540, position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #2E1065 0%, #4C1D95 30%, #6D28D9 60%, #1E1B4B 100%)",
        display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 48px 60px"
      }}>
        {/* Hex grid pattern */}
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.06, pointerEvents: "none" }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="hex" x="0" y="0" width="10" height="17.32" patternUnits="userSpaceOnUse">
              <polygon points="5,1 9,3.87 9,9.6 5,12.47 1,9.6 1,3.87" fill="none" stroke="#fff" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#hex)" />
        </svg>
        {/* Agent nodes decorative */}
        {[{ x: "78%", y: "15%", r: 50 }, { x: "88%", y: "60%", r: 80 }, { x: "65%", y: "80%", r: 35 }].map((c, i) => (
          <div key={i} style={{ position: "absolute", left: c.x, top: c.y, width: c.r, height: c.r, borderRadius: "50%", border: "1px solid rgba(167,139,250,0.3)", transform: "translate(-50%,-50%)" }} />
        ))}
        <div style={{ position: "relative", maxWidth: 860 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {["#01 — TOP RANKED", "Agentic AI", "EXTREME Difficulty", "8 Specialist Agents", "Enterprise B2B"].map((t, i) => (
              <span key={i} style={{ background: i === 0 ? "rgba(253,230,138,0.2)" : "rgba(255,255,255,0.1)", border: `1px solid ${i === 0 ? "rgba(253,230,138,0.4)" : "rgba(255,255,255,0.15)"}`, color: i === 0 ? "#FDE68A" : "rgba(255,255,255,0.85)", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 600 }}>{t}</span>
            ))}
          </div>
          <h1 style={{ fontSize: "clamp(30px, 4.5vw, 56px)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.08, marginBottom: 14, letterSpacing: -1.5 }}>
            PolyAgent
          </h1>
          <p style={{ fontSize: 19, color: "rgba(255,255,255,0.7)", fontWeight: 300, marginBottom: 4 }}>Multi-Agent Enterprise Research Synthesis Network</p>
          <p style={{ fontSize: 14, color: "rgba(167,139,250,0.9)", marginBottom: 28, lineHeight: 1.6 }}>
            8 specialist AI agents run in parallel, synthesize conflicting data, and deliver boardroom-ready<br />intelligence reports in under 90 seconds — replacing $12,000–$22,000 per research cycle.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("architecture")} style={{ background: "#A78BFA", color: "#1E1B4B", border: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>See Architecture ↓</button>
            <button onClick={downloadPDF} style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", padding: "12px 24px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>{dlStatus || "⬇ PDF Report"}</button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
          {[
            { num: "8", label: "Specialist AI Agents", icon: "🤖" },
            { num: "< 90s", label: "Report Generation Time", icon: "⚡" },
            { num: "$180K", label: "LTV per Enterprise Customer", icon: "💰" },
            { num: "$63B", label: "BI Market Size by 2029", icon: "📈" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "28px 24px", textAlign: "center", borderRight: i < 3 ? "1px solid #E2E8F0" : "none" }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#7C3AED" }}>{s.num}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <main style={{ padding: "48px 0 80px" }}>

          {/* OVERVIEW */}
          <section id="overview" style={{ marginBottom: 60 }}>
            <SectionHeading emoji="📋" title="Project Overview" accent="#7C3AED" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <Card title="Domain" value="Agentic AI / Enterprise Intelligence" />
              <Card title="Rank" value="#1 of 75 projects — Highest Priority" />
              <Card title="Difficulty" value="EXTREME — Multi-agent orchestration + LLM + RAG" />
              <Card title="GitHub" value="github.com/Anshul-777/PolyAgent" link="https://github.com/Anshul-777/PolyAgent" accent="#7C3AED" />
            </div>
            <div style={{ background: "#FAF5FF", border: "1px solid #DDD6FE", borderRadius: 12, padding: "18px 22px" }}>
              <p style={{ fontSize: 14, color: "#3B0764", lineHeight: 1.8, margin: 0 }}>
                <strong>Core Concept:</strong> Orchestrated LLM agent swarm that autonomously decomposes enterprise research queries, dispatches 8 specialist sub-agents in parallel, reconciles conflicting data through source authority scoring, and delivers verified, cited, boardroom-ready intelligence reports in under 90 seconds. Each agent is equipped with domain-specific tools and API access — from SEC EDGAR to USPTO patents to Semantic Scholar. A Directed Acyclic Graph (DAG) manages inter-agent dependencies; a Verification Agent fact-checks every claim.
              </p>
            </div>
          </section>

          {/* PROBLEM */}
          <section id="problem" style={{ marginBottom: 60 }}>
            <SectionHeading emoji="🔴" title="Problem Statement" accent="#7C3AED" />
            <div style={{ background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
              <p style={{ fontSize: 14, color: "#1A202C", lineHeight: 1.8, margin: 0 }}>
                Corporate intelligence teams inside Fortune 500 companies, private equity firms, and management consulting houses face a crippling research bottleneck. A single strategic research request —
                <em>"Map the competitive landscape of AI-driven logistics platforms in Southeast Asia for a potential $50M acquisition"</em> — requires a team of 4–6 analysts working 2–3 days,
                querying 12–20 different data sources, and manually reconciling conflicting information. The average research cycle costs <strong>$12,000–$22,000 in analyst labor alone</strong>.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { title: "Cost", val: "$12K–$22K", desc: "per research cycle in analyst labor — before data platform licensing fees" },
                { title: "Delay", val: "48–72 hours", desc: "average turnaround — strategic decisions made on stale intelligence" },
                { title: "Coverage", val: "~40%", desc: "of available sources actually reviewed — critical insights in SEC filings regularly missed" },
                { title: "Market", val: "$35B → $63B", desc: "enterprise business intelligence market (2024 → 2029) — validated willingness to pay" },
              ].map((s, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "16px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#7C3AED", lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SOLUTION */}
          <section id="solution" style={{ marginBottom: 60 }}>
            <SectionHeading emoji="💡" title="Idea & Solution Concept" accent="#7C3AED" />
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.8, marginBottom: 20 }}>
              PolyAgent is a multi-agent orchestration platform where a Master Orchestrator Agent decomposes any research query into atomic sub-tasks and dispatches them to specialized sub-agents running in parallel.
              Each sub-agent maintains a dedicated tool registry — financial databases, patent registries, news APIs, regulatory filing parsers, and academic databases. A Directed Acyclic Graph (DAG) scheduler
              manages inter-agent dependencies, ensuring synthesis only begins after all required primary research completes.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {[
                { icon: "🧩", title: "Decompose", desc: "GPT-4o decomposes query into DAG task graph with agent assignments and dependency chains" },
                { icon: "⚡", title: "Dispatch", desc: "8 specialist agents run concurrently via async Celery workers — no sequential bottlenecks" },
                { icon: "🔄", title: "Reconcile", desc: "Contradictions detected across agents, resolved via source authority ranking" },
                { icon: "📄", title: "Report", desc: "Verified report with claim-level confidence scores, citations, in PDF/DOCX/HTML" },
              ].map((s, i) => (
                <div key={i} style={{ background: "#FAF5FF", border: "1px solid #DDD6FE", borderRadius: 10, padding: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: "#7C3AED", marginBottom: 6 }}>{s.title}</h4>
                  <p style={{ fontSize: 12, color: "#475569", margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ARCHITECTURE */}
          <section id="architecture" style={{ marginBottom: 60 }}>
            <SectionHeading emoji="⚙️" title="Five-Layer Multi-Agent Architecture" accent="#7C3AED" />
            <p style={{ fontSize: 14, color: "#475569", marginBottom: 20, lineHeight: 1.7 }}>
              A hierarchical multi-agent system built on LangGraph with shared Qdrant vector memory. The DAG scheduler ensures synthesis begins only when all required agent dependencies complete — preventing premature report generation with incomplete data.
            </p>
            {/* Architecture SVG */}
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 16, padding: 28, overflowX: "auto" }}>
              <svg viewBox="0 0 820 500" style={{ width: "100%", height: "auto", minWidth: 620 }}>
                {/* Background layers */}
                {[
                  { y: 10, h: 70, label: "LAYER 1 — QUERY INTELLIGENCE ENGINE", color: "#7C3AED" },
                  { y: 95, h: 110, label: "LAYER 2 — SPECIALIST AGENT FLEET (8 Parallel Workers)", color: "#7C3AED" },
                  { y: 220, h: 55, label: "LAYER 3 — SHARED VECTOR MEMORY (Qdrant)", color: "#7C3AED" },
                  { y: 290, h: 80, label: "LAYER 4 — SYNTHESIS & VERIFICATION", color: "#7C3AED" },
                  { y: 385, h: 55, label: "LAYER 5 — REPORT GENERATION", color: "#7C3AED" },
                ].map((l, i) => (
                  <g key={i}>
                    <rect x={8} y={l.y} width={804} height={l.h} rx="8" fill={`${l.color}06`} stroke={`${l.color}20`} strokeWidth="1" />
                    <text x={16} y={l.y + 14} fontSize="8" fill="#94A3B8" fontFamily="DM Sans, sans-serif" fontWeight="700">{l.label}</text>
                  </g>
                ))}
                {/* L1: Query decomposer */}
                <rect x={290} y={24} width={240} height={44} rx="8" fill="white" stroke="#7C3AED" strokeWidth="1.5" />
                <text x={410} y={44} fontSize="11" fill="#7C3AED" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">Master Orchestrator</text>
                <text x={410} y={58} fontSize="8.5" fill="#9CA3AF" textAnchor="middle" fontFamily="DM Sans, sans-serif">Query Decomposition → DAG Task Graph</text>
                {/* Arrows to agents */}
                {[72, 178, 284, 390, 496, 602, 708, 814 - 72].map((x, i) => (
                  <line key={i} x1={410} y1={68} x2={x < 410 ? x + 50 : x} y2={108} stroke="#DDD6FE" strokeWidth="1" strokeDasharray="3,3" />
                ))}
                {/* L2: 8 agents */}
                {[
                  { x: 18, label: "Financial\nAgent", color: "#7C3AED" },
                  { x: 118, label: "Patent\nAgent", color: "#0891B2" },
                  { x: 218, label: "News\nAgent", color: "#059669" },
                  { x: 318, label: "Regulatory\nAgent", color: "#D97706" },
                  { x: 418, label: "Academic\nAgent", color: "#DC2626" },
                  { x: 518, label: "Geopolitical\nAgent", color: "#0891B2" },
                  { x: 618, label: "Market\nAgent", color: "#7C3AED" },
                  { x: 718, label: "Competitive\nAgent", color: "#059669" },
                ].map((a, i) => (
                  <g key={i}>
                    <rect x={a.x} y={108} width={92} height={84} rx="8" fill="white" stroke={a.color} strokeWidth="1.5" />
                    {/* Agent icon circle */}
                    <circle cx={a.x + 46} cy={133} r={16} fill={`${a.color}15`} />
                    <text x={a.x + 46} y={138} fontSize="14" textAnchor="middle" fontFamily="DM Sans, sans-serif">{["💰", "⚖️", "📰", "📜", "🔬", "🌍", "📊", "🏆"][i]}</text>
                    <text x={a.x + 46} y={155} fontSize="8.5" fill={a.color} textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">{a.label.split("\n")[0]}</text>
                    <text x={a.x + 46} y={166} fontSize="8.5" fill={a.color} textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">{a.label.split("\n")[1]}</text>
                    {/* Arrow to Qdrant */}
                    <line x1={a.x + 46} y1={192} x2={a.x + 46} y2={232} stroke="#CBD5E1" strokeWidth="1" />
                    <polygon points={`${a.x + 41},232 ${a.x + 51},232 ${a.x + 46},240`} fill="#CBD5E1" />
                  </g>
                ))}
                {/* L3: Qdrant */}
                <rect x={18} y={240} width={784} height={42} rx="8" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.5" />
                <text x={410} y={259} fontSize="11" fill="#1D4ED8" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">Qdrant Vector Store — Shared Agent Working Memory</text>
                <text x={410} y={273} fontSize="8.5" fill="#3B82F6" textAnchor="middle" fontFamily="DM Sans, sans-serif">All agents deposit + query intermediate results via semantic similarity search</text>
                {/* Arrow to L4 */}
                <line x1={410} y1={282} x2={410} y2={302} stroke="#CBD5E1" strokeWidth="1.5" />
                <polygon points="405,302 415,302 410,310" fill="#CBD5E1" />
                {/* L4: Synthesis + Verification */}
                <rect x={18} y={302} width={384} height={58} rx="8" fill="#F0FDF4" stroke="#A7F3D0" strokeWidth="1.5" />
                <text x={210} y={326} fontSize="11" fill="#065F46" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">Synthesis Agent</text>
                <text x={210} y={340} fontSize="8.5" fill="#059669" textAnchor="middle" fontFamily="DM Sans, sans-serif">Reconcile contradictions · Source authority ranking</text>
                <text x={210} y={352} fontSize="8.5" fill="#059669" textAnchor="middle" fontFamily="DM Sans, sans-serif">Build coherent research narrative</text>
                <rect x={418} y={302} width={384} height={58} rx="8" fill="#FFF7ED" stroke="#FED7AA" strokeWidth="1.5" />
                <text x={610} y={326} fontSize="11" fill="#92400E" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">Verification Agent</text>
                <text x={610} y={340} fontSize="8.5" fill="#D97706" textAnchor="middle" fontFamily="DM Sans, sans-serif">Claim-level confidence scoring (0–100%)</text>
                <text x={610} y={352} fontSize="8.5" fill="#D97706" textAnchor="middle" fontFamily="DM Sans, sans-serif">Flag low-confidence claims for manual review</text>
                {/* Arrow to L5 */}
                <line x1={410} y1={360} x2={410} y2={395} stroke="#CBD5E1" strokeWidth="1.5" />
                <polygon points="405,395 415,395 410,403" fill="#CBD5E1" />
                {/* L5: Output */}
                {[
                  { x: 18, label: "PDF Report", sub: "WeasyPrint", color: "#DC2626" },
                  { x: 223, label: "DOCX Report", sub: "python-docx", color: "#0891B2" },
                  { x: 428, label: "HTML Dashboard", sub: "Interactive + drill-down", color: "#7C3AED" },
                  { x: 633, label: "JSON API", sub: "Machine-readable", color: "#059669" },
                ].map((o, i) => (
                  <g key={i}>
                    <rect x={o.x} y={403} width={185} height={36} rx="8" fill="white" stroke={o.color} strokeWidth="1.5" />
                    <text x={o.x + 92} y={418} fontSize="10" fill={o.color} textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">{o.label}</text>
                    <text x={o.x + 92} y={432} fontSize="8" fill="#94A3B8" textAnchor="middle" fontFamily="DM Sans, sans-serif">{o.sub}</text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Arch details */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
              {[
                { title: "Layer 1 — Query Intelligence Engine", items: ["GPT-4o with structured output → ResearchOntology", "DAG task graph: subtask_id, agent, dependencies, priority", "Complexity scoring 1–10 with time estimation", "Agent selection — not all 8 needed for every query", "Chain-of-Thought prompting for reliable decomposition"] },
                { title: "Layer 2 — Specialist Agent Fleet", items: ["8 async Celery workers (Redis task queue)", "Each agent: 3 dedicated tools with retry + circuit breaker", "Tool outputs: typed Pydantic models with citations", "Source authority scores per agent (academic > filing > news)", "Rate limit handling per API with exponential backoff"] },
                { title: "Layer 3 — Shared Working Memory", items: ["Qdrant vector store — session-isolated collections", "Agents deposit results + query others' findings", "Semantic contradiction detection across agent outputs", "Working memory persists for report versioning", "Cleanup after 30 days (configurable retention)"] },
                { title: "Layer 4 — Synthesis & Verification", items: ["SynthesisAgent: builds coherent cross-agent narrative", "ContradictionResolver: source authority ranking algorithm", "VerificationAgent: RAG-based claim-level confidence (0–100%)", "Flags claims below 60% confidence with ⚠ markers", "Final report confidence: weighted avg of all claim scores"] },
              ].map((s, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "16px 18px" }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: "#7C3AED", marginBottom: 10 }}>{s.title}</h4>
                  {s.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                      <span style={{ color: "#7C3AED", fontWeight: 700, fontSize: 12 }}>›</span>
                      <span style={{ fontSize: 12, color: "#475569" }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* 8 Agents detail */}
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginTop: 28, marginBottom: 14 }}>The 8 Specialist Agents</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {[
                { icon: "💰", name: "Financial Agent", tools: "Alpha Vantage, SEC EDGAR, CrunchBase, PitchBook", output: "Revenue, funding, M&A, ownership data" },
                { icon: "⚖️", name: "Patent Agent", tools: "USPTO PatentsView, Google Patents, EPO OPS", output: "Claim analysis, citation graph, tech trajectory" },
                { icon: "📰", name: "News Agent", tools: "SerpAPI, Bing News, RSS (400+ feeds)", output: "Narrative arc, sentiment, reputational events" },
                { icon: "📜", name: "Regulatory Agent", tools: "SEC EDGAR, EU Regulatory DB, FDA", output: "Compliance violations, proceedings, risk matrix" },
                { icon: "🔬", name: "Academic Agent", tools: "Semantic Scholar, ArXiv, PubMed", output: "TRL, publication velocity, research consensus" },
                { icon: "🌍", name: "Geopolitical Agent", tools: "World Bank, UN Comtrade, Gov portals", output: "Political stability, trade exposure, sanctions risk" },
                { icon: "📊", name: "Market Agent", tools: "Industry reports, Statista, web scraping", output: "Market size, growth rates, competitive landscape" },
                { icon: "🏆", name: "Competitive Agent", tools: "Entity resolver, relationship graph builder", output: "Competitor entity graph, ownership, key personnel" },
              ].map((a, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px" }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{a.icon}</div>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>{a.name}</h4>
                  <p style={{ fontSize: 11, color: "#7C3AED", marginBottom: 4, lineHeight: 1.4 }}><strong>Tools:</strong> {a.tools}</p>
                  <p style={{ fontSize: 11, color: "#64748B", margin: 0, lineHeight: 1.4 }}><strong>Output:</strong> {a.output}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FEATURES */}
          <section id="features" style={{ marginBottom: 60 }}>
            <SectionHeading emoji="✅" title="Features (15 Core Capabilities)" accent="#7C3AED" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                { n: "01", icon: "✍️", title: "Natural Language Query", desc: "Free-form research queries with automatic complexity estimation and time-to-complete prediction" },
                { n: "02", icon: "🎬", title: "Live Agent Activity Stream", desc: "Real-time WebSocket dashboard showing all agents' status, retrieved data counts, and confidence scores" },
                { n: "03", icon: "🔧", title: "Configurable Agent Fleet", desc: "Enable/disable specific data sources per query — use only agents needed for the research question" },
                { n: "04", icon: "⚔️", title: "Contradiction Detection", desc: "Automated source authority scoring resolves conflicting data across agents — higher-confidence claim wins" },
                { n: "05", icon: "🎯", title: "Claim-Level Confidence", desc: "0–100% confidence score on every factual statement — claims below 60% flagged for manual verification" },
                { n: "06", icon: "📚", title: "Automated Citations", desc: "Every claim linked to source document — direct hyperlinks to EDGAR filings, patents, papers, news articles" },
                { n: "07", icon: "📦", title: "Three Output Formats", desc: "PDF (WeasyPrint), DOCX (python-docx), interactive HTML with drill-down — all auto-generated" },
                { n: "08", icon: "🗂️", title: "Research Library", desc: "All past reports stored, searchable, with diff view between research re-runs on the same topic" },
                { n: "09", icon: "🔔", title: "Webhook Delivery", desc: "Automatic delivery to Slack, Teams, or email when report completes — configurable per user" },
                { n: "10", icon: "🏷️", title: "White-Label Mode", desc: "Enterprise clients can deploy PolyAgent with their own branding and custom data sources" },
                { n: "11", icon: "🔑", title: "API with Rate Limits", desc: "REST API with per-seat pricing tiers — integrate PolyAgent into existing BI workflows" },
                { n: "12", icon: "🕵️", title: "Complete Audit Trail", desc: "Full log of every query made to every data source — compliance and reproducibility" },
                { n: "13", icon: "👔", title: "Role-Based Access", desc: "enterprise_admin / analyst / viewer — different query quotas and data source access per role" },
                { n: "14", icon: "🌐", title: "Multi-Language Output", desc: "Intelligence reports in English, Mandarin, German, French, Japanese, Portuguese, Spanish" },
                { n: "15", icon: "🔄", title: "Report Versioning", desc: "Re-run research on same query; compare findings diff to track how intelligence changes over time" },
              ].map((f, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 17 }}>{f.icon}</span>
                    <div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#7C3AED" }}>#{f.n}</span>
                        <h4 style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", margin: 0 }}>{f.title}</h4>
                      </div>
                      <p style={{ fontSize: 11.5, color: "#64748B", margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* TECH STACK */}
          <section id="stack" style={{ marginBottom: 60 }}>
            <SectionHeading emoji="🛠️" title="Tech Stack" accent="#7C3AED" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { cat: "Orchestration", color: "#7C3AED", items: ["LangGraph (DAG orchestration)", "LangChain (tools + prompts)", "Celery + Redis (async workers)", "Python asyncio (parallel execution)", "Pydantic v2 (typed schemas)"] },
                { cat: "AI / LLM", color: "#059669", items: ["OpenAI GPT-4o (primary reasoning)", "Anthropic Claude API (verification)", "Qdrant (vector working memory)", "Custom embedding pipeline", "SMOTE for adversarial claim testing"] },
                { cat: "Backend", color: "#0891B2", items: ["Python 3.12", "FastAPI + WebSocket", "PostgreSQL + asyncpg", "Alembic (migrations)", "WeasyPrint + python-docx (exports)"] },
                { cat: "Data Sources", color: "#D97706", items: ["SEC EDGAR full-text search API", "USPTO PatentsView + EPO OPS", "SerpAPI + Bing News API", "Semantic Scholar + ArXiv API", "World Bank + UN Comtrade"] },
              ].map((s, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ background: s.color, padding: "10px 16px" }}>
                    <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fff" }}>{s.cat}</h4>
                  </div>
                  <div style={{ padding: "12px 16px", display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {s.items.map((item, j) => (
                      <span key={j} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 6, padding: "3px 10px", fontSize: 12, color: "#334155" }}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* IMPACT */}
          <section id="impact" style={{ marginBottom: 60 }}>
            <SectionHeading emoji="📊" title="Feasibility, Viability & Market Impact" accent="#7C3AED" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {[
                { title: "Technical Feasibility", badge: "HIGH", bc: "#059669", bg: "#F0FDF4", bdr: "#A7F3D0", points: ["LangGraph: production-ready at scale (Anthropic uses it)", "Celery: handles 100+ concurrent agent tasks reliably", "Qdrant: 10M+ vectors at <10ms query latency", "All 8 data sources have stable, documented APIs", "FastAPI + WebSocket: sub-100ms API response"] },
                { title: "Market Viability", badge: "VALIDATED", bc: "#7C3AED", bg: "#FAF5FF", bdr: "#DDD6FE", points: ["$35B BI market → $63B by 2029 (McKinsey)", "Perplexity Enterprise charges $40/seat — no agent depth", "Single Fortune 500 client = $300K/year ARR", "Strategy teams have proven $200K+/year budget for intelligence", "No competitor combines all 8 domains + contradiction resolution"] },
                { title: "Uniqueness", badge: "DIFFERENTIATED", bc: "#D97706", bg: "#FFFBEB", bdr: "#FDE68A", points: ["Only platform with 8-agent parallel orchestration + DAG", "Automated cross-agent contradiction resolution (patentable)", "Claim-level confidence — not just overall confidence", "Per-claim source citations with authority scoring", "Re-run with diff — intelligence changes over time tracked"] },
              ].map((s, i) => (
                <div key={i} style={{ background: s.bg, border: `1px solid ${s.bdr}`, borderRadius: 12, padding: "16px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{s.title}</h4>
                    <span style={{ background: s.bc, color: "#fff", borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 700 }}>{s.badge}</span>
                  </div>
                  {s.points.map((p, j) => (
                    <div key={j} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                      <span style={{ color: s.bc, fontWeight: 700, fontSize: 12 }}>✓</span>
                      <span style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* PROMPTS */}
          <section id="prompts" style={{ marginBottom: 60 }}>
            <SectionHeading emoji="🤖" title="AI Build Prompts" accent="#7C3AED" />
            <div style={{ background: "#FAF5FF", border: "1px solid #DDD6FE", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: "#5B21B6", margin: 0, lineHeight: 1.6 }}>
                <strong>5 prompts, run in order</strong> → complete PolyAgent platform. Backend builds the 8-agent FastAPI system. Frontend builds the live D3 agent visualization. Database designs the complete schema. Agent Prompts writes all 8 LLM system prompts. Deployment sets up Docker + Railway + monitoring.
              </p>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {[
                { key: "backend", icon: "🐍", label: "Backend Prompt", sub: "Python · FastAPI · LangGraph · Celery · Qdrant", color: "#7C3AED", desc: "Complete FastAPI backend with LangGraph DAG orchestration, all 8 specialist agents with full tool implementations, Qdrant shared memory, synthesis + verification pipeline, WebSocket streaming, PDF/DOCX export, and 100% test coverage." },
                { key: "frontend", icon: "⚛️", label: "Frontend Prompt", sub: "React 18 · D3.js · TypeScript · TailwindCSS · Recharts", color: "#0891B2", desc: "5-page React dashboard with D3 force-directed agent network graph, real-time WebSocket agent progress visualization, full report viewer with confidence highlighting, workflow configuration, and report library." },
                { key: "database", icon: "🗄️", label: "Database Prompt", sub: "PostgreSQL · Alembic · Full-text search · Sessions", color: "#059669", desc: "Complete PostgreSQL schema (10 tables including session management, agent logs, contradiction tracking), Alembic migrations, full-text search indexes, analytical views, and 50-session seed data." },
                { key: "agentPrompts", icon: "📝", label: "Agent Prompts Library", sub: "GPT-4o · Claude · Structured Output · All 8 Agents", color: "#D97706", desc: "Complete system prompts for all 8 specialist agents + Query Decomposer + Synthesis + Verification agents. Each with output schemas, confidence scoring rubrics, source citation rules, and contradiction detection instructions." },
                { key: "deployment", icon: "🚀", label: "Deployment Prompt", sub: "Docker · Railway · Nginx · Prometheus · Grafana", color: "#DC2626", desc: "Full deployment stack: multi-stage Dockerfile (with Playwright/Chromium), docker-compose (7 services), sticky WebSocket Nginx config, GitHub Actions CI/CD, Prometheus alerting, Grafana dashboard, and S3 backup." },
              ].map(p => (
                <div key={p.key} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ background: `${p.color}12`, border: `1px solid ${p.color}30`, borderRadius: 10, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{p.icon}</div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{p.label}</h4>
                        <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748B" }}>{p.sub}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setActivePrompt(activePrompt === p.key ? null : p.key)} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, padding: "6px 14px", fontSize: 12, color: "#475569", cursor: "pointer" }}>
                        {activePrompt === p.key ? "▲ Hide" : "▼ About"}
                      </button>
                      <button onClick={() => copyPrompt(p.key)} style={{ background: copiedKey === p.key ? "#059669" : p.color, color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}>
                        {copiedKey === p.key ? "✓ Copied!" : "⎘ Copy Prompt"}
                      </button>
                    </div>
                  </div>
                  {activePrompt === p.key && (
                    <div style={{ background: "#FFFBEB", borderTop: "1px solid #FDE68A", padding: "12px 20px" }}>
                      <p style={{ margin: 0, fontSize: 13, color: "#78350F", lineHeight: 1.6 }}><strong>What this builds:</strong> {p.desc}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, background: "#F0F9FF", border: "1px dashed #BAE6FD", borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 12, color: "#0C4A6E" }}>🔒 <strong>Coming soon:</strong> Credit-based access — 10 free credits/month per visitor. Full project unlock: 5 credits. Owner: unlimited access.</p>
            </div>
          </section>

          {/* DOWNLOADS */}
          <section id="downloads" style={{ marginBottom: 60 }}>
            <SectionHeading emoji="📥" title="Downloads & Exports" accent="#7C3AED" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              {[
                { icon: "📄", label: "PDF Report", sub: "Full portfolio document", color: "#7C3AED", action: downloadPDF, status: dlStatus },
                { icon: "📊", label: "PPT Deck", sub: "12-slide presentation", color: "#D97706", action: () => alert("PPT export coming soon — covers: problem, solution, architecture, all 8 agents, market sizing, and demo screenshots.") },
                { icon: "📝", label: "Pitch Script", sub: "3-minute presentation", color: "#059669", action: () => { navigator.clipboard.writeText(`PolyAgent — 3-Minute Pitch Script\n\n[HOOK — 20s]\n"What if you could replace a $20,000 research team with a 90-second automated agent network?"\n\n[PROBLEM — 45s]\nEvery Fortune 500 strategy team, every PE firm, every management consulting house faces the same bottleneck: research takes 48 hours and costs $15,000 per cycle. The data exists. The APIs exist. But getting a team of 6 analysts to query 20 different sources simultaneously, reconcile contradictions, and format everything into a boardroom document — that's the bottleneck.\n\n[SOLUTION — 60s]\nPolyAgent deploys 8 specialist AI agents simultaneously — one for financial databases, one for patents, one for news, one for regulatory filings, one for academic papers, and more. They run in parallel, share findings through a vector memory layer, and a synthesis agent reconciles where they disagree. Every factual claim gets a confidence score. The output: a cited, verified intelligence report in under 90 seconds.\n\n[MARKET — 30s]\nThe enterprise business intelligence market is $35 billion today, growing to $63 billion by 2029. Strategy teams have proven budgets of $200,000+ per year for intelligence tools. We replace that entire spend at $25,000/month — with 10x faster output.\n\n[DEMO]\n[Live demo of query submission → agent network visualization → report output]\n\n[CLOSE — 15s]\n"PolyAgent is the research team your strategy department always wanted but couldn't afford. Thank you."`); alert("Pitch script copied! ✓"); }
                },
                { icon: "⌥", label: "GitHub", sub: "github.com/Anshul-777/PolyAgent", color: "#0F172A", action: () => window.open("https://github.com/Anshul-777/PolyAgent", "_blank") },
              ].map((d, i) => (
                <button key={i} onClick={d.action} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "20px 16px", textAlign: "center", cursor: "pointer", display: "block", width: "100%", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = d.color; e.currentTarget.style.boxShadow = `0 4px 16px ${d.color}20`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{d.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{d.label}</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>{d.status || d.sub}</div>
                </button>
              ))}
            </div>
          </section>

          {/* COMMENTS */}
          <section id="comments" style={{ marginBottom: 60 }}>
            <SectionHeading emoji="💬" title={`Comments (${comments.length})`} accent="#7C3AED" />
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "#0F172A" }}>Leave a comment</h4>
              <input value={newComment.name} onChange={e => setNewComment(p => ({ ...p, name: e.target.value }))} placeholder="Your name" style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: 8, padding: "9px 12px", fontSize: 13, marginBottom: 8, outline: "none", boxSizing: "border-box" }} />
              <textarea value={newComment.message} onChange={e => setNewComment(p => ({ ...p, message: e.target.value }))} placeholder="Your thoughts on PolyAgent…" rows={3} style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: 8, padding: "9px 12px", fontSize: 13, marginBottom: 10, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              <button onClick={addComment} style={{ background: "#7C3AED", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Post Comment</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {comments.map(c => (
                <div key={c.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 18px", display: "flex", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#7C3AED", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{c.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{c.name}</span>
                      <span style={{ fontSize: 11, color: "#94A3B8" }}>{c.timestamp}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{c.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#0F172A", color: "#94A3B8", padding: "40px 48px", textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#A78BFA", marginBottom: 8 }}>PolyAgent</div>
        <p style={{ fontSize: 13, marginBottom: 16, color: "#64748B" }}>Multi-Agent Enterprise Research Synthesis Network — Project #01 of 75 · Rank #1</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
          <a href="https://github.com/Anshul-777/PolyAgent" target="_blank" rel="noopener" style={{ color: "#A78BFA", fontSize: 13 }}>⌥ GitHub</a>
          <a href="https://www.linkedin.com/in/anshul-rathod777" target="_blank" rel="noopener" style={{ color: "#A78BFA", fontSize: 13 }}>in LinkedIn</a>
        </div>
        <div style={{ fontSize: 11, color: "#475569" }}>Built by Anshul Rathod · Available for freelance · © 2025</div>
      </footer>
    </div>
  );
}

function SectionHeading({ emoji, title, accent }: { emoji: string; title: string; accent: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <span style={{ fontSize: 20 }}>{emoji}</span>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0F172A" }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: "#E2E8F0", marginLeft: 8 }} />
    </div>
  );
}

function Card({ title, value, link, accent }: { title: string; value: string; link?: string; accent?: string }) {
  return (
    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "12px 16px" }}>
      <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{title}</div>
      {link ? <a href={link} target="_blank" rel="noopener" style={{ fontSize: 13, color: accent || "#0891B2", fontWeight: 600, textDecoration: "none" }}>{value} ↗</a> : <div style={{ fontSize: 13, color: "#0F172A", fontWeight: 600 }}>{value}</div>}
    </div>
  );
}

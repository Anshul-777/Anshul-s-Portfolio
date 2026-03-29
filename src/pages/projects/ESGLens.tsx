import { useState, useEffect } from "react";

// ──────────────────────────────────────────────────────────
//  PROJECT #26 — ESGLens
//  Corporate ESG Score Generation and Climate Risk Quantification Engine
//  Author : Anshul Rathod  |  Rank: #26 of 75
// ──────────────────────────────────────────────────────────

const PROMPTS = {
  backend: `You are a senior Python data engineer specializing in financial data and ESG analytics. Build the complete, production-ready FastAPI backend for "ESGLens" — a real-time, independently-sourced Corporate ESG Score Generation and Climate Risk Quantification Engine for institutional investors.

STACK: Python 3.12, FastAPI, PostgreSQL + PostGIS, Redis, Celery, PyTorch Geometric (GNN), FinBERT (HuggingFace Transformers), rasterio, GDAL, Pydantic v2, Docker, Alembic.

ARCHITECTURE — all files complete:

1. /app/main.py — FastAPI: CORS, JWT RS256 auth, Prometheus /metrics, startup validates all API keys, initializes GNN model checkpoint.

2. /app/routers/companies.py:
   GET /api/companies/search — search companies by name/ticker/ISIN. Returns company_id, name, ticker, sector, country.
   GET /api/companies/{id}/esg — full ESG score: E/S/G sub-scores, 50+ sub-indicators, score_date, methodology_url.
   GET /api/companies/{id}/esg/history — weekly ESG score time-series (last 2 years).
   GET /api/companies/{id}/controversies — active controversies with materiality assessment.
   GET /api/companies/{id}/emissions — Scope 1/2/3 estimates vs. self-reported, with data source citations.
   GET /api/companies/{id}/supply_chain_risk — GNN-propagated supply chain ESG risk scores.

3. /app/routers/portfolios.py:
   POST /api/portfolios — create portfolio from list of {company_id, weight} pairs.
   GET /api/portfolios/{id}/esg_analytics — portfolio-level: weighted avg ESG, E/S/G breakdown, sector/region heatmap.
   GET /api/portfolios/{id}/controversy_exposure — portfolio-level controversy risk.
   GET /api/portfolios/{id}/sfdr_alignment — EU Taxonomy + SFDR Article 8/9 alignment assessment.
   GET /api/portfolios/{id}/transition_risk — regulatory transition risk: forward-looking exposure to climate regulation by jurisdiction.

4. /app/services/environmental/ — Environmental Scoring:

   satellite_emissions.py — Sentinel-5P Methane Plume Analysis:
   Fetch Sentinel-5P Level-2 CH4 product from Copernicus Open Access Hub for each company's facility locations.
   Detect statistically significant methane anomalies above baseline using 2-sigma detection.
   Attribute emissions to company by proximity to facility (within 10km radius).
   Output: {facility_id, lat, lon, methane_ppb_excess, detection_confidence, acquisition_date}.

   deforestation_monitor.py — Planet Labs / Global Forest Watch:
   Annual deforestation detection in company supply chain regions (for food, palm oil, paper/pulp sector companies).
   Hansen Global Forest Change dataset integration.
   Output: {region, forest_loss_ha, year, company_association_confidence}.

   emissions_estimator.py — Independent Scope 1/2/3 Estimation:
   Scope 1: Physical asset-based estimation using EPA emissions factors + production volume proxies.
   Scope 2: Market-based from grid emissions factors (electricityMap API) × facility electricity consumption proxies.
   Scope 3 Category 1 (Purchased Goods): supply chain commodity volumes × commodity-specific emission factors (EXIOBASE 3 MRIO).
   Cross-check against company CDP disclosure where available. Flag discrepancy if >20%.

   regulatory_violations.py — EPA ECHO + OSHA + EU ETS:
   EPA ECHO API: pull all compliance evaluations and violations for company facility IDs.
   OSHA API: workplace safety violations and penalties.
   EU ETS: allowance surrender compliance for EU facilities.
   Output: normalized ViolationRecord(agency, violation_type, penalty_usd, year, facility_id, severity).

5. /app/services/social/ — Social Scoring:

   news_sentiment.py — FinBERT News Analysis:
   NewsAPI + Google News RSS: pull articles mentioning company in last 90 days, filter by ESG-relevant topics.
   FinBERT fine-tuned on ESG controversy corpus: classify sentiment (positive/neutral/negative) per article.
   Topic classification: labor practices / supply chain transparency / community impact / product safety / diversity.
   Controversy score: weighted by source authority × recency × article volume.

   supply_chain_transparency.py — CDP Supply Chain Disclosures:
   CDP Supply Chain portal API (where available) for supplier questionnaire responses.
   Proxy scoring for companies without CDP disclosure: sector-level default adjusted by revenue concentration and geographic risk.

6. /app/services/governance/ — Governance Scoring:

   sec_analysis.py — SEC Filing Governance Extraction:
   EDGAR full-text search API: pull DEF 14A (proxy statement), 10-K, 8-K for each company.
   GPT-4o structured extraction: board_independence_pct, female_directors_pct, ceo_pay_ratio, related_party_transactions (list), executive_clawback_policy (bool), audit_committee_independence (bool), dual_class_shares (bool), poison_pill (bool).
   Compensation analysis: compare CEO total comp to peer median. Flag if >3× peer.

7. /app/services/gnn/ — Supply Chain Risk Propagation:

   supply_chain_graph.py — Graph Neural Network:
   Build supply chain graph from: FactSet Revere Supply Chain (or OpenCorporates company relationships), SEC supplier disclosures, commodity trade flows (UN Comtrade).
   Nodes: companies (features: sector, country, size, own ESG score). Edges: supplier relationships (weight: revenue dependency %).
   Model: GraphSAGE (PyTorch Geometric). 2-hop neighborhood aggregation. Propagates ESG risk upstream.
   Output: supply_chain_risk_score for each company = weighted sum of downstream supplier ESG risks.

8. /app/services/forward_looking/ — Climate Transition Risk:

   regulatory_pipeline.py — Transition Risk Scoring:
   Monitor upcoming climate regulation in 40+ jurisdictions (EU CBAM, SEC climate disclosure rule, UK TCFD mandates).
   Score each company: {jurisdiction_exposure, regulation_stringency, company_readiness (from patent + CDP data)} → transition_risk_score (0–100).

   green_innovation.py — Patent Technology Scoring:
   USPTO + EPO patent search: count patents in CPC classes Y02 (climate change mitigation technologies) filed by company in last 5 years.
   Compare to sector peers. Normalize to green_innovation_score.

9. /app/services/scoring/ — Score Aggregation:

   score_aggregator.py: Weighted average of 50+ sub-indicators into E/S/G sub-scores and Overall ESG score.
   Environmental weight: 40% (emissions 30% + deforestation 5% + violations 5%).
   Social weight: 30% (news sentiment 15% + supply chain transparency 15%).
   Governance weight: 30% (board independence 10% + exec comp 10% + shareholder rights 10%).
   All weights configurable per portfolio (sector-specific weighting).
   Full methodology documentation generated per score (every number cited to data source).

10. /app/workers/ — Celery: weekly_scoring_job (rescore all S&P 500 companies), daily_news_monitoring (controversy detection), monthly_satellite_job (Sentinel-5P + deforestation refresh).

11. /app/models/orm/ — Company, ESGScore, SubIndicator, Controversy, EmissionsRecord, RegulatoryViolation, Portfolio, PortfolioCompany, SupplyChainEdge.

12. /tests/ — mock all external APIs, unit tests per scoring module, GNN forward pass test.

All code typed. docker-compose: api, postgres (PostGIS), redis, celery-worker, celery-beat.`,

  frontend: `You are a senior React/TypeScript engineer specializing in financial data visualization. Build the complete frontend for "ESGLens" — a corporate ESG intelligence platform for institutional investors.

STACK: React 18, TypeScript 5, Vite, TailwindCSS 3, Recharts, D3 (heatmaps), Framer Motion, React Query v5, Zustand, Lucide React, DM Sans font.

DESIGN: Clean white theme for institutional credibility. Background #FFFFFF, sidebar #F8FAFC, accent #059669 (green-600) for environmental signals, #3B82F6 (blue-600) for social, #8B5CF6 (violet-500) for governance. Cards: white with 1px #E2E8F0 border. Typography: DM Sans, headings very dark, body gray.

BUILD COMPLETELY:

1. /src/pages/CompanySearch.tsx — Company discovery:
   Search bar (name, ticker, ISIN). Instant results with company name, ticker, sector, country flag, overall ESG score badge (color-coded: green ≥70, yellow 40–70, red <40).
   Recent searches. Featured companies grid (S&P 500 top/bottom ESG).

2. /src/pages/CompanyESG.tsx — Full company ESG deep-dive:
   Hero: company name + logo placeholder, ESG score gauge (large animated radial, 0–100), E/S/G sub-scores (3 progress bars).
   Score Breakdown: accordion sections for each of 50+ sub-indicators. Each shows: value, data source, date, confidence %, citation link.
   Environmental: satellite-derived emissions map (Mapbox with methane anomaly overlays), Scope 1/2/3 bar chart (company-reported vs. ESGLens estimate), regulatory violations timeline.
   Social: FinBERT news sentiment trend (Recharts line chart), controversy log with materiality flags, supply chain transparency score.
   Governance: board composition visualization (donut chart: independence %, gender %, age distribution), CEO pay ratio vs. peer benchmarks (horizontal bar).
   Supply Chain Risk: 2-hop supply chain network graph (D3 force-directed, color-coded by ESG score) with hover tooltips.
   Forward-Looking: transition risk radar chart (6 axes: physical risk, transition regulation, stranded assets, green capex, policy exposure, stakeholder pressure).
   Controversy Feed: real-time scrolling log of news mentions with FinBERT sentiment badges.

3. /src/pages/Portfolio.tsx — Portfolio ESG analytics:
   Upload portfolio: CSV drag-drop (ticker, ISIN, weight). Preview imported holdings.
   Portfolio ESG dashboard: weighted average E/S/G scores, contribution waterfall chart (which holdings drag down portfolio ESG), sector ESG heatmap (D3 color grid), country exposure map (Mapbox choropleth by avg ESG score).
   SFDR alignment: progress bars for SFDR Article 8 / 9 criteria met.
   Controversy exposure: portfolio-level controversy heat, top 5 at-risk holdings.

4. /src/pages/Screening.tsx — ESG stock screener:
   Filter panel: sector, country, ESG score range, specific sub-indicators (e.g., board independence > 60%, zero EPA violations, CDP score ≥ B).
   Results table: sortable by any metric, ESG score sparklines (Recharts tiny line), 90-day trend indicator.
   Save screener configuration as named filter.

5. /src/pages/MarketWatch.tsx — ESG market pulse:
   Weekly score change leaderboard: top 10 ESG improvers + top 10 decliners.
   Controversy alert feed: companies with new material controversies this week.
   Regulatory calendar: upcoming ESG disclosure deadlines by jurisdiction.

6. /src/components/scores/ — ESGGauge.tsx (animated SVG radial 0–100, color gradient green→yellow→red), SubIndicatorAccordion.tsx, ContradictionBanner.tsx (orange banner when company-reported vs. ESGLens estimate diverges >20%).

7. /src/components/charts/ — EmissionsComparison.tsx, SentimentTrend.tsx, SupplyChainGraph.tsx (D3), TransitionRiskRadar.tsx (D3 radar).

8. /src/components/portfolio/ — PortfolioUploader.tsx, WeightedESGBreakdown.tsx, ContributionWaterfall.tsx.

All TypeScript typed. React Query for all API calls. Error boundaries. Loading skeletons with shimmer effect.`,

  gnnModel: `You are a senior ML engineer specializing in graph neural networks for financial applications. Build the complete GNN-based supply chain ESG risk propagation system for "ESGLens."

DELIVERABLES — all code complete:

1. /ml/graph/graph_builder.py — SupplyChainGraphBuilder:
   build_graph(company_ids): constructs PyG HeteroData graph.
   Nodes: Company — features: [sector_embedding(32d), country_one_hot(40d), log_revenue, own_esg_score, emissions_intensity, board_independence_pct]. Total: ~75 features per node.
   Edges: SUPPLIES_TO (weighted by revenue_dependency_pct, add_self_loops), COMPETES_WITH (same sector, similar size).
   Data sources: SEC EDGAR supplier disclosures (parse 10-K "Major Customers" sections), UN Comtrade commodity flows mapped to companies via NAICS codes, OpenCorporates company ownership relationships.
   Output: torch_geometric.data.HeteroData ready for model input.
   Handle: missing supplier data → sector-level default graph structure.

2. /ml/models/graphsage_esg.py — GraphSAGEESG model:
   Architecture: GraphSAGE with 2-hop neighborhood aggregation.
   Input: HeteroData (company nodes, supply chain edges).
   Layers: SAGEConv(75, 256) → ReLU → Dropout(0.3) → SAGEConv(256, 128) → ReLU → Dropout(0.3) → Linear(128, 1) → Sigmoid.
   Output: supply_chain_risk_score per company (0–1, where 1 = maximum supply chain ESG risk exposure).
   Loss: MSELoss against synthetic labels derived from downstream supplier ESG scores (weighted by dependency). No ground truth labels exist — use graph-supervised learning: label = weighted_mean(supplier_esg_scores, weights=dependency_pct).
   Training: AdamW lr=1e-3, 100 epochs, early stopping on val loss.

3. /ml/models/finbert_esg.py — FinBERTESGClassifier:
   Base model: ProsusAI/finbert from HuggingFace.
   Fine-tune on ESG controversy corpus: construct training set from: CDP controversies database, RepRisk historical events (public summaries), manually labeled 1,000 news articles across 5 ESG topics.
   Multi-label classification: 5 topics (labor/supply_chain/community/product_safety/diversity) × 3 sentiments = 15 output neurons.
   Training: AdamW lr=2e-5, 5 epochs, linear warmup, batch=16.
   Inference: batch_classify_articles(articles_list) → returns list of {topic, sentiment, confidence} per article.

4. /ml/training/train_graphsage.py — complete training script:
   Load graph from graph_builder.py. Train-val-test split by company (not edges — prevents leakage).
   Training loop with gradient clipping, learning rate warmup, checkpoint saving.
   Evaluation: MSE, Pearson correlation between predicted risk and actual downstream ESG scores.
   Visualization: t-SNE plot of learned company embeddings (color-coded by sector and ESG score).

5. /ml/training/train_finbert.py — FinBERT fine-tuning:
   Data pipeline: load articles, tokenize (max_length=512), DataLoader, class weight balancing.
   Training loop with Trainer API (HuggingFace). Evaluate: per-topic F1, macro-average.
   Save: fine-tuned model + tokenizer to /models/finbert_esg/.

6. /ml/inference/esg_scorer.py — ESGScoringEngine:
   score_company(company_id): orchestrates all scoring modules:
     (1) get_environmental_data() → satellite emissions + violations + deforestation
     (2) get_social_data() → FinBERT news + CDP supply chain
     (3) get_governance_data() → SEC filing extraction
     (4) run_gnn_inference() → supply chain risk
     (5) aggregate_scores() → E/S/G sub-scores + Overall
     (6) generate_methodology_report() → full data lineage
   score_batch(company_ids): parallel scoring using asyncio.gather.

7. /tests/test_gnn.py — unit tests: graph construction validity (no isolated nodes, edge weights sum to 1 per company), GNN forward pass (correct output shape), FinBERT batch inference (correct tensor shapes, no memory leak).

8. /notebooks/02_gnn_analysis.ipynb — visualization: supply chain graph visualization (NetworkX + matplotlib), GNN attention weight analysis, t-SNE embedding plot, case study: ESG risk propagation from Tier-2 supplier scandal.

All code typed. Requirements: torch>=2.2, torch-geometric>=2.5, transformers>=4.38, huggingface_hub.`,

  database: `You are a senior PostgreSQL architect. Complete database schema for "ESGLens" — corporate ESG intelligence platform.

TABLES (write all CREATE TABLE SQL):

companies: id UUID PK, name, ticker UNIQUE, isin UNIQUE, sector (GICS level 2), industry_group, country_iso3, market_cap_usd NUMERIC, revenue_usd NUMERIC, employee_count INT, headquarters_lat NUMERIC, headquarters_lon NUMERIC, created_at, updated_at

esg_scores: id UUID PK, company_id FK, score_date DATE, overall_score NUMERIC 5,2, environmental_score NUMERIC 5,2, social_score NUMERIC 5,2, governance_score NUMERIC 5,2, score_methodology_version TEXT, data_freshness_date DATE, confidence_level TEXT(high/medium/low), created_at. INDEX (company_id, score_date DESC).

esg_sub_indicators: id UUID PK, score_id FK, category (E/S/G), indicator_name TEXT, indicator_value NUMERIC, unit TEXT, data_source TEXT, source_url TEXT, source_date DATE, confidence_pct NUMERIC 3,0. INDEX (score_id, category, indicator_name).

controversies: id UUID PK, company_id FK, controversy_type TEXT (20 categories), headline TEXT, source_url TEXT, publication_date DATE, sentiment_score NUMERIC 3,2 (-1 to 1), materiality TEXT (low/medium/high/critical), esg_topic TEXT[], is_active BOOL, detected_at, resolved_at

emissions_records: id UUID PK, company_id FK, year SMALLINT, scope1_reported NUMERIC, scope1_estimated NUMERIC, scope2_reported NUMERIC, scope2_estimated NUMERIC, scope3_cat1_estimated NUMERIC, estimation_methodology TEXT, estimation_confidence TEXT, data_source TEXT, created_at. INDEX (company_id, year DESC).

regulatory_violations: id UUID PK, company_id FK, facility_id TEXT, agency TEXT (EPA/OSHA/EU_ETS/OTHER), violation_type TEXT, penalty_usd NUMERIC, violation_date DATE, resolution_date DATE, status TEXT, source_url TEXT

satellite_emissions_detections: id UUID PK, company_id FK, facility_location GEOMETRY(POINT,4326), methane_ppb_excess NUMERIC, detection_confidence NUMERIC, satellite_source TEXT, acquisition_date DATE

supply_chain_edges: id UUID PK, buyer_company_id FK, supplier_company_id FK, revenue_dependency_pct NUMERIC 5,2, data_source TEXT, confidence TEXT, last_updated DATE. UNIQUE(buyer_company_id, supplier_company_id).

supply_chain_risk_scores: id UUID PK, company_id FK, risk_score NUMERIC 5,4 (0–1), hops INT (1 or 2), score_date DATE, model_version TEXT

portfolios: id UUID PK, org_id FK, name, description, created_by FK, created_at, updated_at

portfolio_holdings: id UUID PK, portfolio_id FK, company_id FK, weight_pct NUMERIC 5,2, added_at. UNIQUE(portfolio_id, company_id).

INDEXES:
companies: GIN tsvector(name, ticker) for full-text search; (sector, country_iso3) for screening
esg_scores: BRIN on score_date; covering index (company_id, score_date, overall_score, environmental_score, social_score, governance_score) for list queries
controversies: (company_id, is_active, publication_date DESC); GIN on esg_topic
satellite_emissions_detections: GIST on facility_location

VIEWS:
latest_esg_scores: most recent score per company (DISTINCT ON company_id ORDER BY score_date DESC) — most queried view
portfolio_weighted_esg: per portfolio — weighted average E/S/G using portfolio_holdings.weight_pct
controversy_active_materiality: active controversies by materiality level with company context

FUNCTIONS:
esg_percentile_rank(company_id UUID, sector TEXT) RETURNS NUMERIC — sector-relative ESG ranking
portfolio_esg_contribution(portfolio_id UUID) RETURNS TABLE(company_id, name, weight, overall_score, contribution_to_portfolio_score) — waterfall breakdown
screen_companies(min_esg NUMERIC, sectors TEXT[], countries TEXT[], max_violations INT, min_board_independence NUMERIC) RETURNS TABLE — screener function

SEED: 100 S&P 500 companies across 10 sectors. 2 years of weekly ESG scores. 50 controversies. Emissions estimates for all companies. 200 supply chain edges.`
};

interface Comment { id: number; name: string; message: string; timestamp: string; avatar: string; }

export default function ESGLens() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, name: "James Whitfield", message: "The 0.61 correlation between ESG rating providers is a well-documented problem — any fund manager will immediately understand why independent satellite-derived scores matter. This addresses a real pain point in our ESG investment process.", timestamp: "3 days ago", avatar: "JW" },
    { id: 2, name: "Tanvi Nair", message: "The GNN supply chain propagation is the most sophisticated part of this. Tier-2 and Tier-3 supplier ESG risk is something none of the current rating agencies model properly. This is genuinely differentiated.", timestamp: "6 days ago", avatar: "TN" },
  ]);
  const [newComment, setNewComment] = useState({ name: "", message: "" });
  const [dlStatus, setDlStatus] = useState<string | null>(null);

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
      const GREEN = [5, 150, 105] as [number, number, number];
      const DARK = [15, 23, 42] as [number, number, number];
      const GRAY = [100, 116, 139] as [number, number, number];
      const W = 210, pad = 18;
      let y = 0;
      const addPage = () => { doc.addPage(); y = 24; };
      const checkY = (n: number) => { if (y + n > 275) addPage(); };
      const section = (t: string, e: string) => { checkY(16); doc.setFillColor(...GREEN); doc.rect(pad - 3, y - 5, 4, 10, "F"); doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.setTextColor(...DARK); doc.text(`${e}  ${t}`, pad + 4, y + 2); y += 12; };
      const body = (t: string) => { doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(51, 65, 85); const l = doc.splitTextToSize(t, W - pad * 2); checkY(l.length * 5 + 3); doc.text(l, pad, y); y += l.length * 5 + 3; };
      const bullet = (t: string) => { checkY(8); doc.setFillColor(...GREEN); doc.circle(pad + 2, y - 1, 1.2, "F"); doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(51, 65, 85); const l = doc.splitTextToSize(t, W - pad * 2 - 8); doc.text(l, pad + 6, y); y += l.length * 5 + 2; };
      doc.setFillColor(...GREEN); doc.rect(0, 0, W, 58, "F"); doc.setFillColor(4, 120, 87); doc.rect(0, 53, W, 8, "F");
      doc.setTextColor(255, 255, 255); doc.setFontSize(22); doc.setFont("helvetica", "bold"); doc.text("ESGLENS", pad, 26);
      doc.setFontSize(11); doc.setFont("helvetica", "normal"); doc.text("Corporate ESG Score Generation & Climate Risk Quantification Engine", pad, 38);
      doc.setFontSize(9); doc.text("Project #26  ·  FinTech / NLP / Sustainability AI  ·  Rank 26 of 75  ·  VERY HIGH Difficulty", pad, 49);
      doc.setFillColor(248, 250, 252); doc.rect(0, 61, W, 20, "F");
      doc.setTextColor(...DARK); doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.text("Anshul Rathod", pad, 71);
      doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(...GRAY);
      doc.text("linkedin.com/in/anshul-rathod777  ·  github.com/Anshul-777/ESPLens", pad, 78);
      y = 95;
      section("Overview", "🌿");
      body("ESGLens is a real-time, independently-sourced ESG scoring engine for institutional investors. Unlike traditional ratings providers (MSCI ESG, Sustainalytics, Refinitiv) that rely on annual company self-reporting, ESGLens ingests 15+ independent data sources including satellite imagery for environmental monitoring, regulatory violation databases, carbon emission models, news NLP sentiment via FinBERT, and CDP supply chain disclosures. A Graph Neural Network propagates ESG risk scores upstream through supply chains, capturing Tier-2 and Tier-3 supplier risks invisible to current rating methodologies.");
      section("The ESG Data Quality Problem", "🔴");
      bullet("A 2019 MIT study found ESG ratings from different providers correlate at only 0.61 on average — investors using different providers make systematically different investment decisions");
      bullet("Traditional ratings rely 80% on company self-disclosure — biased by incentives to report favorably");
      bullet("Annual update frequency — companies can sustain ESG crises for 12 months before ratings reflect reality");
      bullet("Supply chain transparency: Tier-2 and Tier-3 supplier ESG risk invisible to current methodologies");
      bullet("$1.3B ESG data market growing at 25% CAGR — proven institutional willingness to pay for better data");
      section("Solution Architecture", "💡");
      body("ESGLens generates weekly ESG scores from independent data sources with full methodology transparency. Every sub-indicator is cited to its source. Environmental scores combine satellite-derived emissions monitoring (Sentinel-5P methane detection), EPA/OSHA regulatory violation databases, and independent Scope 1/2/3 estimation models. Social scores use FinBERT fine-tuned on ESG controversies for news sentiment analysis. Governance scores extract structured data from SEC filings via GPT-4o. A GraphSAGE GNN propagates ESG risk through supply chain networks (2-hop neighborhood aggregation).");
      section("Data Sources (15+)", "📊");
      const sources = [
        "Sentinel-5P: methane plume detection above company facilities (satellite, ESA, free)",
        "Planet Labs: deforestation monitoring in supply chain regions",
        "EPA ECHO API: compliance evaluations and violations per facility",
        "OSHA API: workplace safety violations and penalties",
        "EU ETS: allowance surrender compliance for European facilities",
        "FinBERT (fine-tuned): ESG news sentiment — 5 topics, 90-day rolling window",
        "CDP Supply Chain: supplier questionnaire disclosures where available",
        "SEC EDGAR: DEF 14A (proxy statement) board composition and pay data",
        "GPT-4o: structured governance extraction from 10-K and 8-K filings",
        "UN Comtrade: supply chain commodity trade flows for GNN graph construction",
        "EXIOBASE 3 MRIO: input-output tables for Scope 3 emission factor mapping",
        "electricityMap API: real-time grid carbon intensity for Scope 2 estimation",
        "Hansen Global Forest Change: annual deforestation detection dataset",
        "USPTO + EPO: green technology patent filings (CPC class Y02)",
        "Copernicus Climate Change Service: physical climate risk scenario data"
      ];
      sources.forEach(s => bullet(s));
      section("GNN Supply Chain Architecture", "🕸️");
      body("GraphSAGE (PyTorch Geometric): 2-hop neighborhood aggregation over supply chain graph. Company nodes encode: sector embedding, country, revenue, own ESG score, emissions intensity, board independence. Edges represent supply relationships weighted by revenue dependency %. GNN output: supply_chain_risk_score (0–1) representing weighted exposure to downstream supplier ESG risks. Captures Tier-2 supplier scandals that current rating agencies miss entirely.");
      section("Tech Stack", "🛠️");
      const stk = [
        { c: "ML/AI", v: "PyTorch Geometric (GraphSAGE GNN), FinBERT (HuggingFace), GPT-4o (governance extraction)" },
        { c: "Geospatial", v: "rasterio, GDAL, PostGIS, py6S, Sentinel-5P L2 data processing" },
        { c: "Backend", v: "Python 3.12, FastAPI, PostgreSQL + PostGIS, Redis, Celery, Alembic" },
        { c: "Data", v: "EPA ECHO API, OSHA API, SEC EDGAR, CDP Portal, electricityMap, UN Comtrade, EXIOBASE 3" },
        { c: "Frontend", v: "React 18, TypeScript, Recharts, D3 (supply chain graph + radar), Mapbox GL" },
      ];
      stk.forEach(s => { checkY(8); doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(...GREEN); doc.text(`${s.c}: `, pad + 6, y); const w = doc.getTextWidth(`${s.c}: `); doc.setFont("helvetica", "normal"); doc.setTextColor(51, 65, 85); const l = doc.splitTextToSize(s.v, W - pad * 2 - 6 - w); doc.text(l, pad + 6 + w, y); y += l.length * 5 + 3; });
      section("Market & Impact", "🚀");
      bullet("$1.3B ESG data market at 25% CAGR — institutional investor mandate driving demand");
      bullet("Pricing: $50K–$500K/year for institutional clients (consistent with Sustainalytics, MSCI ESG)");
      bullet("For $50B ESG-screened fund: avoiding 1 major controversy saves $500M in drawdown");
      bullet("Weekly scoring vs. annual competitor updates — 52× more current intelligence");
      bullet("Full methodology transparency vs. black-box ratings — regulatory compliance advantage (SFDR, SEC climate rules)");
      const tp = doc.getNumberOfPages();
      for (let i = 1; i <= tp; i++) {
        doc.setPage(i); doc.setFillColor(248, 250, 252); doc.rect(0, 285, W, 12, "F");
        doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...GRAY);
        doc.text("© 2025 Anshul Rathod · ESGLens — Project #26 · All rights reserved", W / 2, 292, { align: "center" });
        doc.text(`Page ${i} of ${tp}`, W - pad, 292, { align: "right" });
      }
      doc.save("ESGLens_Portfolio_AnshulRathod.pdf");
      setDlStatus("Downloaded ✓");
    } catch { window.print(); setDlStatus("Print dialog opened"); }
    setTimeout(() => setDlStatus(null), 3000);
  };
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const ACCENT = "#059669";

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FFFFFF", color: "#0F172A" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid #E2E8F0", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="../index.html" style={{ color: "#64748B", fontSize: 13, textDecoration: "none" }}>← Anshul's Projects</a>
          <span style={{ color: "#CBD5E1" }}>|</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT }}>Project #26</span>
          <span style={{ background: "#DCFCE7", color: "#14532D", border: "1px solid #A7F3D0", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>ESG · FinTech · NLP</span>
          <span style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>VERY HIGH</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a href="https://github.com/Anshul-777/ESPLens" target="_blank" rel="noopener" style={{ background: "#0F172A", color: "#fff", padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>⌥ GitHub</a>
          <a href="https://www.linkedin.com/in/anshul-rathod777" target="_blank" rel="noopener" style={{ background: "#0A66C2", color: "#fff", padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>in</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: 520, position: "relative", overflow: "hidden",
        background: "linear-gradient(150deg, #022C22 0%, #064E3B 30%, #065F46 60%, #0F172A 100%)",
        display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 48px 60px"
      }}>
        {/* Leaf / organic pattern */}
        <svg style={{ position: "absolute", right: 0, top: 0, width: "50%", height: "100%", opacity: 0.06, pointerEvents: "none" }} viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="180" fill="none" stroke="#34D399" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="130" fill="none" stroke="#34D399" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="80" fill="none" stroke="#34D399" strokeWidth="0.5" />
          <line x1="20" y1="200" x2="380" y2="200" stroke="#34D399" strokeWidth="0.3" />
          <line x1="200" y1="20" x2="200" y2="380" stroke="#34D399" strokeWidth="0.3" />
          <line x1="73" y1="73" x2="327" y2="327" stroke="#34D399" strokeWidth="0.3" />
          <line x1="327" y1="73" x2="73" y2="327" stroke="#34D399" strokeWidth="0.3" />
        </svg>
        <div style={{ position: "relative", maxWidth: 820 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {["#26", "ESG Intelligence", "FinTech / Sustainability AI", "GNN Supply Chain", "VERY HIGH"].map((t, i) => (
              <span key={i} style={{ background: i === 4 ? "rgba(253,230,138,0.15)" : "rgba(255,255,255,0.08)", border: `1px solid ${i === 4 ? "rgba(253,230,138,0.3)" : "rgba(255,255,255,0.12)"}`, color: i === 4 ? "#FDE68A" : "rgba(255,255,255,0.85)", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 600 }}>{t}</span>
            ))}
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4.5vw, 54px)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.08, marginBottom: 14, letterSpacing: -1.5 }}>ESGLens</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", fontWeight: 300, marginBottom: 8 }}>Corporate ESG Score Generation and Climate Risk Quantification Engine</p>
          <p style={{ fontSize: 14, color: "rgba(110,231,183,0.9)", marginBottom: 28, lineHeight: 1.7, maxWidth: 660 }}>
            Real-time, independently-sourced ESG scores from satellite imagery, regulatory databases, news NLP, and supply chain data —
            updated <strong style={{ color: "#34D399" }}>weekly</strong> vs. annual competitor ratings.
            GNN propagates ESG risk through Tier-2 and Tier-3 supplier networks invisible to current methodologies.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("architecture")} style={{ background: "#059669", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>See Architecture ↓</button>
            <button onClick={downloadPDF} style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", padding: "12px 24px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>{dlStatus || "⬇ PDF Report"}</button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {[
            { num: "15+", label: "Independent Data Sources", icon: "📡" },
            { num: "0.61", label: "Avg. Competitor Correlation (MIT)", icon: "⚠️" },
            { num: "Weekly", label: "Score Update Frequency", icon: "🔄" },
            { num: "$1.3B", label: "ESG Data Market (25% CAGR)", icon: "📈" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "28px 24px", textAlign: "center", borderRight: i < 3 ? "1px solid #E2E8F0" : "none" }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: ACCENT }}>{s.num}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <main style={{ padding: "48px 0 80px" }}>

          {/* OVERVIEW */}
          <section id="overview" style={{ marginBottom: 60 }}>
            <SH emoji="🌿" title="Project Overview" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <IC title="Domain" value="FinTech · NLP · Sustainability AI · Geospatial" ac={ACCENT} />
              <IC title="Rank" value="#26 of 75 projects" />
              <IC title="Key Technology" value="GraphSAGE GNN · FinBERT · Sentinel-5P · PostGIS" />
              <IC title="GitHub" value="github.com/Anshul-777/ESPLens" link="https://github.com/Anshul-777/ESPLens" ac={ACCENT} />
            </div>
            <div style={{ background: "#F0FDF4", border: "1px solid #A7F3D0", borderRadius: 12, padding: "18px 22px" }}>
              <p style={{ fontSize: 14, color: "#022C22", lineHeight: 1.8, margin: 0 }}>
                <strong>Core Concept:</strong> A real-time ESG scoring engine that ingests 15+ independent data sources — satellite imagery (Sentinel-5P methane detection, Planet Labs deforestation), regulatory violation databases (EPA ECHO, OSHA), carbon emission estimation models, news NLP (FinBERT fine-tuned on ESG controversies), and CDP supply chain disclosures. A GraphSAGE GNN models supply chain relationships to propagate ESG risk scores upstream through the value chain, capturing Tier-2 and Tier-3 supplier risks invisible to current methodologies. All scores updated weekly with full methodology documentation.
              </p>
            </div>
          </section>

          {/* PROBLEM */}
          <section id="problem" style={{ marginBottom: 60 }}>
            <SH emoji="🔴" title="The ESG Data Quality Crisis" />
            <div style={{ background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "#1A202C", margin: 0 }}>
                The ESG data market is $1.3B growing at 25% CAGR, yet the underlying data quality problem is widely acknowledged.
                A 2019 MIT study found that ESG ratings from different providers correlate at only <strong>0.61 on average</strong> —
                meaning investors using different providers are making systematically different investment decisions for the same companies.
                The root cause: ratings rely primarily on company self-disclosure, updated annually, with opaque methodologies.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { title: "Self-Reporting Bias", icon: "⚠️", desc: "80% of ESG ratings based on company-reported data. Companies have strong incentives to report favorably. No independent verification." },
                { title: "Annual Updates", icon: "📅", desc: "Competitors update ESG scores annually. Companies can sustain an ESG crisis for 12 months before ratings reflect reality." },
                { title: "Correlation Problem", icon: "📉", desc: "MIT: 0.61 avg. correlation between providers. Asset managers using different rating agencies make systematically divergent decisions." },
                { title: "Supply Chain Blindspot", icon: "🔗", desc: "Tier-2 and Tier-3 supplier ESG risk invisible to current methodologies. Supply chain scandals blindside even 'high-rated' companies." },
              ].map((s, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "16px" }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: "#EF4444", marginBottom: 6 }}>{s.title}</h4>
                  <p style={{ fontSize: 12, color: "#475569", margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SOLUTION */}
          <section id="solution" style={{ marginBottom: 60 }}>
            <SH emoji="💡" title="Solution: Independent, Real-Time ESG Intelligence" />
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.8, marginBottom: 20 }}>
              ESGLens bypasses self-reporting entirely. Every data point is sourced independently — from satellites, government databases, regulatory filings, and news — then cross-validated against company disclosure where available. Discrepancies are flagged publicly. A GNN captures supply chain risk propagation, and scores are updated weekly rather than annually.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {[
                { icon: "🛰️", title: "Independent Environmental Data", desc: "Satellite imagery (Sentinel-5P) detects methane plumes above facilities. EPA ECHO + OSHA violations independently verified. Scope 1/2/3 estimated from physical models, not company reports." },
                { icon: "🧠", title: "NLP Social Scoring", desc: "FinBERT fine-tuned on ESG controversy corpus analyzes 90 days of news. 5 ESG topics × sentiment. Source authority weighting. Weekly controversy detection." },
                { icon: "🕸️", title: "GNN Supply Chain Risk", desc: "GraphSAGE 2-hop neighborhood aggregation over supply chain graph. Tier-2 and Tier-3 supplier ESG risk propagated upstream. Updated monthly as supply chain data refreshes." },
              ].map((s, i) => (
                <div key={i} style={{ background: "#F0FDF4", border: "1px solid #A7F3D0", borderRadius: 10, padding: "18px" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: ACCENT, marginBottom: 8 }}>{s.title}</h4>
                  <p style={{ fontSize: 12, color: "#374151", margin: 0, lineHeight: 1.55 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ARCHITECTURE */}
          <section id="architecture" style={{ marginBottom: 60 }}>
            <SH emoji="⚙️" title="System Architecture" />
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 16, padding: 28, marginBottom: 24, overflowX: "auto" }}>
              <svg viewBox="0 0 800 500" style={{ width: "100%", height: "auto", minWidth: 600 }}>
                {/* Title */}
                <text x={400} y={20} fontSize="10" fill="#94A3B8" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">ESGLens — Multi-Layer ESG Intelligence Architecture</text>

                {/* Layer 1: Data Sources */}
                <text x={12} y={40} fontSize="8" fill="#94A3B8" fontFamily="DM Sans, sans-serif" fontWeight="600">LAYER 1 — INDEPENDENT DATA SOURCES</text>
                {[
                  { x: 12, label: "Sentinel-5P\nMethane", color: "#059669" },
                  { x: 142, label: "EPA ECHO\nOSHA", color: "#DC2626" },
                  { x: 272, label: "FinBERT\nNews NLP", color: "#0891B2" },
                  { x: 402, label: "SEC EDGAR\nGPT-4o", color: "#7C3AED" },
                  { x: 532, label: "CDP Supply\nChain", color: "#D97706" },
                  { x: 662, label: "UN Comtrade\nPatents", color: "#059669" },
                ].map((s, i) => (
                  <g key={i}>
                    <rect x={s.x} y={46} width={120} height={44} rx="6" fill="white" stroke={s.color} strokeWidth="1.2" />
                    <text x={s.x + 60} y={64} fontSize="9" fill={s.color} textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">{s.label.split("\n")[0]}</text>
                    <text x={s.x + 60} y={78} fontSize="9" fill={s.color} textAnchor="middle" fontFamily="DM Sans, sans-serif">{s.label.split("\n")[1]}</text>
                    <line x1={s.x + 60} y1={90} x2={s.x + 60} y2={106} stroke="#CBD5E1" strokeWidth="1" />
                    <polygon points={`${s.x + 55},106 ${s.x + 65},106 ${s.x + 60},114`} fill="#CBD5E1" />
                  </g>
                ))}

                {/* Layer 2: Scoring modules */}
                <text x={12} y={128} fontSize="8" fill="#94A3B8" fontFamily="DM Sans, sans-serif" fontWeight="600">LAYER 2 — INDEPENDENT SCORING MODULES</text>
                {[
                  { x: 12, label: "Environmental\nScoring (E)", color: "#059669", desc: "Satellite emissions\nViolations · Scope 1/2/3" },
                  { x: 282, label: "Social\nScoring (S)", color: "#0891B2", desc: "FinBERT news\nSupply chain transparency" },
                  { x: 552, label: "Governance\nScoring (G)", color: "#7C3AED", desc: "Board composition\nExec comp · Shareholder rights" },
                ].map((m, i) => (
                  <g key={i}>
                    <rect x={m.x} y={134} width={250} height={60} rx="8" fill={`${m.color}08`} stroke={m.color} strokeWidth="1.5" />
                    <text x={m.x + 125} y={156} fontSize="11" fill={m.color} textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">{m.label.split("\n")[0]}</text>
                    <text x={m.x + 125} y={170} fontSize="11" fill={m.color} textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">{m.label.split("\n")[1]}</text>
                    <text x={m.x + 125} y={184} fontSize="8" fill="#94A3B8" textAnchor="middle" fontFamily="DM Sans, sans-serif">{m.desc.split("\n")[0]} · {m.desc.split("\n")[1]}</text>
                    <line x1={m.x + 125} y1={194} x2={m.x + 125} y2={210} stroke="#CBD5E1" strokeWidth="1" />
                    <polygon points={`${m.x + 120},210 ${m.x + 130},210 ${m.x + 125},218`} fill="#CBD5E1" />
                  </g>
                ))}

                {/* Layer 3: GNN */}
                <text x={12} y={228} fontSize="8" fill="#94A3B8" fontFamily="DM Sans, sans-serif" fontWeight="600">LAYER 3 — SUPPLY CHAIN GNN</text>
                <rect x={200} y={234} width={400} height={55} rx="8" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
                <text x={400} y={256} fontSize="11" fill="#1D4ED8" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">GraphSAGE GNN — 2-Hop Supply Chain Risk Propagation</text>
                <text x={400} y={272} fontSize="8.5" fill="#3B82F6" textAnchor="middle" fontFamily="DM Sans, sans-serif">Company nodes (75 features) · Supply chain edges (revenue dependency %) · Output: supply_chain_risk_score</text>
                <text x={400} y={284} fontSize="8.5" fill="#3B82F6" textAnchor="middle" fontFamily="DM Sans, sans-serif">Tier-1 suppliers → Tier-2 suppliers → Tier-3 suppliers — ESG risk propagated upstream</text>
                <line x1={400} y1={289} x2={400} y2={305} stroke="#CBD5E1" strokeWidth="1.5" />
                <polygon points="395,305 405,305 400,313" fill="#CBD5E1" />

                {/* Layer 4: Score Aggregation */}
                <text x={12} y={322} fontSize="8" fill="#94A3B8" fontFamily="DM Sans, sans-serif" fontWeight="600">LAYER 4 — SCORE AGGREGATION & METHODOLOGY</text>
                <rect x={60} y={328} width={680} height={55} rx="8" fill="#F0FDF4" stroke="#059669" strokeWidth="1.5" />
                <text x={400} y={350} fontSize="11" fill="#065F46" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">Score Aggregator — 50+ Sub-Indicators → E / S / G → Overall ESG Score</text>
                <text x={400} y={366} fontSize="8.5" fill="#059669" textAnchor="middle" fontFamily="DM Sans, sans-serif">Environmental 40% · Social 30% · Governance 30% (configurable per sector/portfolio)</text>
                <text x={400} y={378} fontSize="8.5" fill="#059669" textAnchor="middle" fontFamily="DM Sans, sans-serif">Every sub-indicator cited to source document · Discrepancies vs. company-reported data flagged</text>
                <line x1={400} y1={383} x2={400} y2={398} stroke="#CBD5E1" strokeWidth="1.5" />
                <polygon points="395,398 405,398 400,406" fill="#CBD5E1" />

                {/* Layer 5: Delivery */}
                <rect x={60} y={408} width={680} height={46} rx="8" fill="#ECFEFF" stroke="#0891B2" strokeWidth="1.5" />
                <text x={400} y={428} fontSize="11" fill="#0891B2" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">Intelligence Delivery</text>
                <text x={400} y={444} fontSize="8.5" fill="#0891B2" textAnchor="middle" fontFamily="DM Sans, sans-serif">Company dashboard · Portfolio analytics · ESG screener · SFDR alignment · API integration · Weekly digest email</text>
              </svg>
            </div>

            {/* Scoring modules detail */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { title: "Environmental Scoring (40%)", color: ACCENT, bg: "#F0FDF4", items: ["Sentinel-5P methane plume detection: excess CH4 above facility baseline (2-sigma detection)", "Planet Labs deforestation monitoring in supply chain agricultural regions", "EPA ECHO + OSHA violations: type, penalty, severity, recency-weighted", "Independent Scope 1 (EPA emission factors × production proxies)", "Scope 2: electricityMap API grid intensity × facility electricity consumption", "Scope 3 Cat.1: EXIOBASE 3 MRIO commodity emission factors × supply volumes", "Green technology patent count (CPC Y02) vs. sector peers"] },
                { title: "Social Scoring (30%)", color: "#0891B2", bg: "#EFF6FF", items: ["FinBERT fine-tuned: 5 ESG topics × positive/neutral/negative sentiment", "Source authority weighting: Reuters/FT/Bloomberg = 95, trade press = 70, general news = 50", "90-day rolling controversy score with recency decay (last 7d = 1.0, 30d = 0.8, 90d = 0.5)", "CDP Supply Chain questionnaire disclosure score where available", "Sector-default proxy scoring for companies without CDP participation", "Human rights index correlation by geographic revenue exposure"] },
                { title: "Governance Scoring (30%)", color: "#7C3AED", bg: "#FAF5FF", items: ["Board independence % from DEF 14A proxy statement (GPT-4o extraction)", "Female directors % vs. sector median benchmark", "CEO pay ratio vs. employee median (SEC disclosure)", "Dual-class share structure flag (negative signal: −5 pts)", "Poison pill / shareholder rights plan flag (negative signal)", "Executive clawback policy presence (positive signal)", "Audit committee full independence (positive signal)"] },
                { title: "GNN Supply Chain Propagation", color: "#3B82F6", bg: "#EFF6FF", items: ["Graph construction: SEC supplier disclosures + UN Comtrade + FactSet Revere", "Company node features: sector embedding (32d), country (one-hot), revenue, ESG score, emissions intensity", "Edge weights: revenue dependency % per supplier relationship", "GraphSAGE 2-hop: captures Tier-2 and Tier-3 supplier ESG risks", "Monthly graph refresh as new supplier disclosures become available", "Output: supply_chain_risk_score (0–1) used as ESG multiplier"] },
              ].map((s, i) => (
                <div key={i} style={{ background: s.bg, border: `1px solid ${s.color}30`, borderRadius: 10, padding: "16px 18px" }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: s.color, marginBottom: 10 }}>{s.title}</h4>
                  {s.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                      <span style={{ color: s.color, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>›</span>
                      <span style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* FEATURES */}
          <section id="features" style={{ marginBottom: 60 }}>
            <SH emoji="✅" title="Features (15 Core Capabilities)" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                { n: "01", icon: "📊", title: "50+ Sub-Indicator Scoring", desc: "Every ESG score broken down to individual indicators — each cited to source document with confidence %" },
                { n: "02", icon: "🛰️", title: "Satellite Environmental Monitoring", desc: "Methane plumes (Sentinel-5P), deforestation (Planet Labs), water stress — independent of company reporting" },
                { n: "03", icon: "⚗️", title: "Independent Emissions Estimation", desc: "Scope 1/2/3 modeled from physical activity data, cross-checked against CDP disclosure. Flags >20% discrepancy." },
                { n: "04", icon: "🕸️", title: "GNN Supply Chain Risk Propagation", desc: "GraphSAGE 2-hop: Tier-2 and Tier-3 supplier ESG risk propagated upstream to parent company score" },
                { n: "05", icon: "📰", title: "Real-Time Controversy Monitoring", desc: "FinBERT news sentiment: 5 ESG topics, 90-day rolling window, weekly controversy score updates" },
                { n: "06", icon: "📅", title: "Weekly Score Updates", desc: "52× more current than annual competitor ratings. Controversy → score impact within days, not months." },
                { n: "07", icon: "📋", title: "Full Methodology Transparency", desc: "Every sub-indicator: value, data source URL, source date, confidence %. No black-box ratings." },
                { n: "08", icon: "💼", title: "Portfolio-Level ESG Analytics", desc: "Weighted average E/S/G, contribution waterfall, sector heatmap, controversy exposure for any portfolio" },
                { n: "09", icon: "🇪🇺", title: "EU Taxonomy & SFDR Alignment", desc: "SFDR Article 8/9 criteria assessment. EU Taxonomy Do No Significant Harm screening per holding." },
                { n: "10", icon: "⚡", title: "Forward-Looking Regulatory Risk", desc: "Transition risk scoring: EU CBAM, SEC climate disclosure rules, UK TCFD — company readiness vs. exposure" },
                { n: "11", icon: "💡", title: "Green Technology Scoring", desc: "USPTO/EPO patent analysis: CPC Y02 green technology patent count vs. sector peers → innovation score" },
                { n: "12", icon: "🔔", title: "Controversy Alerts", desc: "Real-time alerts when company controversy score spikes. Email + Slack delivery with materiality assessment." },
                { n: "13", icon: "🏢", title: "Governance Extraction", desc: "GPT-4o extracts board composition, CEO pay ratio, shareholder rights from SEC proxy statements automatically" },
                { n: "14", icon: "🔍", title: "ESG Stock Screener", desc: "Filter universe by any combination of E/S/G sub-indicators. Save named screens. Export to CSV." },
                { n: "15", icon: "🔌", title: "API Integration", desc: "REST API for direct integration with Bloomberg, FactSet, Aladdin, and custom portfolio management systems" },
              ].map((f, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 16px" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${ACCENT}50`; e.currentTarget.style.boxShadow = `0 4px 16px ${ACCENT}10`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 17 }}>{f.icon}</span>
                    <div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: ACCENT }}>#{f.n}</span>
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
            <SH emoji="🛠️" title="Tech Stack" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { cat: "ML / AI", color: "#7C3AED", items: ["PyTorch Geometric (GraphSAGE GNN)", "FinBERT (ProsusAI/finbert)", "HuggingFace Transformers", "OpenAI GPT-4o (gov. extraction)", "scikit-learn (feature engineering)"] },
                { cat: "Geospatial", color: ACCENT, items: ["rasterio", "GDAL", "PostGIS", "Sentinel Hub Python Client", "shapely + geopandas", "py6S (atmospheric correction)"] },
                { cat: "Data Sources", color: "#0891B2", items: ["EPA ECHO API", "OSHA API", "SEC EDGAR full-text search", "electricityMap API", "UN Comtrade API", "EXIOBASE 3 MRIO", "Planet Labs SDK", "Copernicus Open Access Hub"] },
                { cat: "Backend / Infrastructure", color: "#D97706", items: ["Python 3.12", "FastAPI", "PostgreSQL + PostGIS", "Redis + Celery", "Alembic", "Docker", "Prometheus + Grafana"] },
              ].map((s, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ background: s.color, padding: "10px 16px" }}>
                    <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fff" }}>{s.cat}</h4>
                  </div>
                  <div style={{ padding: "12px 16px", display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {s.items.map((item, j) => <span key={j} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 6, padding: "3px 10px", fontSize: 12, color: "#334155" }}>{item}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* IMPACT */}
          <section id="impact" style={{ marginBottom: 60 }}>
            <SH emoji="📊" title="Feasibility, Viability & Market Impact" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {[
                { title: "Technical Feasibility", badge: "HIGH", bc: ACCENT, bg: "#F0FDF4", bdr: "#A7F3D0", points: ["FinBERT: published, production-ready HuggingFace model with ESG precedent", "PyTorch Geometric: mature GNN framework with GraphSAGE built-in", "EPA ECHO + OSHA: public APIs, well-documented, no cost", "Sentinel-5P: ESA open data, Python client available", "All 15 data sources have accessible APIs or public datasets"] },
                { title: "Market Viability", badge: "PROVEN", bc: "#3B82F6", bg: "#EFF6FF", bdr: "#BFDBFE", points: ["$1.3B ESG data market growing 25% CAGR — proven institutional demand", "MSCI ESG / Sustainalytics: $50K–$500K/year pricing validated", "ESG mandates: EU SFDR, SEC climate disclosure rules create regulatory demand", "For $50B ESG fund: avoiding 1 controversy saves $500M+ in drawdown", "EU Taxonomy creates compliance demand: every fund needs independent verification"] },
                { title: "Differentiation", badge: "UNIQUE", bc: "#D97706", bg: "#FFFBEB", bdr: "#FDE68A", points: ["Only platform combining satellite + regulatory + NLP + GNN in one score", "Weekly updates vs. annual competitor ratings — 52× more current", "GNN supply chain propagation: no competitor models Tier-2/3 risk", "Full methodology transparency — regulators increasingly require this", "Independent verification: no self-reporting bias in any data source"] },
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
            <SH emoji="🤖" title="AI Build Prompts" />
            <div style={{ background: "#F0FDF4", border: "1px solid #A7F3D0", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: "#022C22", margin: 0, lineHeight: 1.6 }}>
                <strong>4 prompts in order</strong> → complete ESGLens platform. Backend builds the FastAPI with all 15 data source connectors and scoring modules. Frontend builds the institutional-grade ESG dashboard with GNN supply chain visualization. GNN Model creates the GraphSAGE + FinBERT ML pipeline. Database designs the complete PostGIS schema with sub-indicator tracking.
              </p>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {[
                { key: "backend", icon: "🐍", label: "Backend Prompt", sub: "Python · FastAPI · 15 Data Sources · GNN · FinBERT", color: ACCENT, desc: "Complete FastAPI backend: all 15 data source connectors (EPA ECHO, OSHA, Sentinel-5P, FinBERT news, SEC EDGAR GPT-4o extraction, CDP, UN Comtrade), E/S/G scoring modules, GraphSAGE GNN inference, score aggregator with methodology citation, portfolio analytics, SFDR alignment engine." },
                { key: "frontend", icon: "⚛️", label: "Frontend Prompt", sub: "React 18 · TypeScript · D3 · Recharts · Mapbox", color: "#0891B2", desc: "5-page React app: company ESG deep-dive with satellite emissions map and GNN supply chain D3 graph, portfolio analytics with contribution waterfall, ESG screener, controversy monitoring dashboard. Institutional design aesthetic — white, credible, data-dense." },
                { key: "gnnModel", icon: "🧠", label: "GNN + NLP Model Prompt", sub: "PyTorch Geometric · FinBERT · GraphSAGE · HuggingFace", color: "#7C3AED", desc: "Complete ML pipeline: GraphSAGE supply chain risk GNN (graph construction from SEC + UN Comtrade, 2-hop aggregation, supply_chain_risk_score output), FinBERT ESG fine-tuning (5-topic multi-label classification on controversy corpus), batch inference engine, 2 analysis notebooks." },
                { key: "database", icon: "🗄️", label: "Database Prompt", sub: "PostgreSQL · PostGIS · Sub-indicators · Weekly partitions", color: "#D97706", desc: "Complete schema (11 tables): companies, esg_scores, esg_sub_indicators (50+ per score), controversies, emissions_records, regulatory_violations, satellite_detections (GEOMETRY POINT), supply_chain_edges, portfolio holdings. Analytical views, screener function, 100-company S&P seed data with 2-year score history." },
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
                      <button onClick={() => setActivePrompt(activePrompt === p.key ? null : p.key)} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, padding: "6px 14px", fontSize: 12, color: "#475569", cursor: "pointer" }}>{activePrompt === p.key ? "▲ Hide" : "▼ About"}</button>
                      <button onClick={() => copyPrompt(p.key)} style={{ background: copiedKey === p.key ? "#059669" : p.color, color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
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
          </section>

          {/* DOWNLOADS */}
          <section id="downloads" style={{ marginBottom: 60 }}>
            <SH emoji="📥" title="Downloads & Exports" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              {[
                { icon: "📄", label: "PDF Report", sub: "Full portfolio document", color: ACCENT, action: downloadPDF, st: dlStatus },
                { icon: "📊", label: "PPT Deck", sub: "Investor presentation", color: "#D97706", action: () => alert("PPT coming soon — covers: ESG data quality problem, 15 independent sources, GNN supply chain, weekly vs. annual updates, institutional pricing, and regulatory compliance.") },
                { icon: "📝", label: "Pitch Script", sub: "3-minute script", color: "#0891B2", action: () => { navigator.clipboard.writeText(`ESGLens — Presentation Script\n\n[HOOK]\n"What if I told you that the ESG ratings your fund manager uses to make $50B in investment decisions have a 0.61 correlation with the next provider — that's barely better than random? And they're updated once a year from data companies provide about themselves?"\n\n[PROBLEM]\nThe ESG data market is broken. Ratings from different providers are contradictory. Data is self-reported and annual. Supply chain risks — what happens with Tier-2 and Tier-3 suppliers — are completely invisible to current methodologies.\n\n[SOLUTION]\nESGLens generates weekly ESG scores from 15 independent data sources. Satellites detect methane plumes above company facilities. EPA and OSHA databases verify regulatory compliance. FinBERT analyzes 90 days of news for controversy signals. A graph neural network propagates ESG risk through the supply chain network — capturing Tier-2 and Tier-3 risks that nobody else models.\n\n[PROOF]\nEvery sub-indicator is cited to its source. When our emissions estimate differs from what the company reports, we flag it publicly. That's the transparency institutions need for EU SFDR and SEC climate disclosure compliance.\n\n[CLOSE]\nESGLens: ESG intelligence you can trust. Weekly, independent, fully cited. Thank you."`); alert("Script copied! ✓"); } },
                { icon: "⌥", label: "GitHub", sub: "github.com/Anshul-777/ESPLens", color: "#0F172A", action: () => window.open("https://github.com/Anshul-777/ESPLens", "_blank") },
              ].map((d, i) => (
                <button key={i} onClick={d.action} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "20px 16px", textAlign: "center", cursor: "pointer", display: "block", width: "100%", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = d.color; e.currentTarget.style.boxShadow = `0 4px 16px ${d.color}18`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{d.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{d.label}</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>{("st" in d && d.st) || d.sub}</div>
                </button>
              ))}
            </div>
          </section>

          {/* COMMENTS */}
          <section id="comments" style={{ marginBottom: 60 }}>
            <SH emoji="💬" title={`Comments (${comments.length})`} />
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Leave a comment</h4>
              <input value={newComment.name} onChange={e => setNewComment(p => ({ ...p, name: e.target.value }))} placeholder="Your name" style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: 8, padding: "9px 12px", fontSize: 13, marginBottom: 8, outline: "none", boxSizing: "border-box" }} />
              <textarea value={newComment.message} onChange={e => setNewComment(p => ({ ...p, message: e.target.value }))} placeholder="Your thoughts on ESGLens…" rows={3} style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: 8, padding: "9px 12px", fontSize: 13, marginBottom: 10, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              <button onClick={addComment} style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Post Comment</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {comments.map(c => (
                <div key={c.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 18px", display: "flex", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: ACCENT, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{c.avatar}</div>
                  <div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{c.name}</span>
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

      <footer style={{ background: "#022C22", color: "#6EE7B7", padding: "40px 48px", textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#34D399", marginBottom: 8 }}>ESGLens</div>
        <p style={{ fontSize: 13, marginBottom: 16, color: "#065F46" }}>Corporate ESG Score Generation & Climate Risk Quantification — Project #26 of 75</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
          <a href="https://github.com/Anshul-777/ESPLens" target="_blank" rel="noopener" style={{ color: "#34D399", fontSize: 13 }}>⌥ GitHub</a>
          <a href="https://www.linkedin.com/in/anshul-rathod777" target="_blank" rel="noopener" style={{ color: "#34D399", fontSize: 13 }}>in LinkedIn</a>
        </div>
        <div style={{ fontSize: 11, color: "#064E3B" }}>Built by Anshul Rathod · Available for freelance · © 2025</div>
      </footer>
    </div>
  );
}

function SH({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <span style={{ fontSize: 20 }}>{emoji}</span>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0F172A" }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: "#E2E8F0", marginLeft: 8 }} />
    </div>
  );
}

function IC({ title, value, link, ac }: { title: string; value: string; link?: string; ac?: string }) {
  return (
    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "12px 16px" }}>
      <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{title}</div>
      {link ? <a href={link} target="_blank" rel="noopener" style={{ fontSize: 13, color: ac || "#059669", fontWeight: 600, textDecoration: "none" }}>{value} ↗</a> : <div style={{ fontSize: 13, color: "#0F172A", fontWeight: 600 }}>{value}</div>}
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { useCredits } from "../../contexts/CreditContext";

// ──────────────────────────────────────────────────────────
//  PROJECT #16 — ChurnPredictor / RetainIQ
//  AI-Powered Customer Revenue Intelligence & Retention Platform
//  Author : Anshul Rathod  |  Status : LIVE ✓
// ──────────────────────────────────────────────────────────

/* ---------- PROMPT BANK (hidden; copied only) ---------- */
const PROMPTS = {
  backend: `You are a senior Python backend engineer. Build a complete, production-ready FastAPI backend for "ChurnPredictor" — an AI-powered customer churn prediction and retention automation SaaS platform.

STACK: Python 3.12, FastAPI, PostgreSQL (asyncpg + SQLAlchemy 2.0), Redis (aioredis), Celery (async workers), XGBoost, SHAP, scikit-learn, pandas, numpy, Pydantic v2, Docker, Alembic.

ARCHITECTURE — build every file below with full working code, no placeholders:

1. /app/main.py — FastAPI app with CORS, JWT auth middleware, OpenAPI docs, health endpoint, lifespan startup.
2. /app/routers/ — accounts.py, predictions.py, integrations.py, workflows.py, analytics.py — all CRUD + business logic routes with typed Pydantic models.
3. /app/models/ — SQLAlchemy ORM models: User, Organization, CustomerAccount, ChurnPrediction, Intervention, IntegrationConfig, RevenueEvent.
4. /app/services/integrations/ — connectors for Mixpanel (event tracking API), Amplitude, Stripe (subscription + payment events), HubSpot CRM, Salesforce, Intercom, Zendesk, Segment. Each connector: authenticate, pull 90-day event history, normalize to internal schema.
5. /app/services/feature_engineering.py — compute 150+ churn-predictive features per account: DAU/WAU/MAU ratios, feature adoption depth (% of paid features used), onboarding completion score (0–100), session frequency slope (30/60/90-day linear regression), payment failure count, support ticket sentiment trend (VADER), days-since-last-CS-contact, NPS proxy score, integration depth score, executive-sponsor activity index. Return pandas DataFrame ready for model inference.
6. /app/services/ml_pipeline.py — XGBoostClassifier pipeline: automated SHAP feature selection, SMOTE oversampling, isotonic calibration (outputs true probabilities), 5-fold stratified CV, model persistence to /models/ directory as .ubj. Auto-retraining monthly via Celery beat.
7. /app/services/prediction_engine.py — daily batch job scoring all accounts, classifying into risk tiers (Critical >70%, High 50–70%, Medium 30–50%, Low <30%), persisting scores + top-5 SHAP explanations per account to PostgreSQL.
8. /app/services/retention_workflows.py — rule-based + ML-triggered intervention engine: usage-decline → in-app tutorial email, low-adoption → ROI-calculation outreach email, payment failure → 3-email intelligent dunning sequence, exec-sponsor departure → CS alert. Integrates with SendGrid (transactional email), Intercom (in-app messages), PagerDuty (CS alerts).
9. /app/workers/celery_app.py — async Celery workers: daily_scoring_job, monthly_retraining_job, integration_sync_job (hourly), intervention_dispatch_job (real-time triggered).
10. /app/utils/auth.py — JWT RS256 auth, bcrypt passwords, RBAC: admin, cs_rep, viewer roles.
11. /alembic/versions/ — complete migration chain for all models.
12. /tests/ — pytest + pytest-asyncio: 100% endpoint coverage, ML pipeline unit tests, integration mock tests (httpx AsyncClient).
13. docker-compose.yml — app, postgres, redis, celery-worker, celery-beat with health checks and env vars.
14. .env.example — all required environment variables documented.

BUSINESS RULES: Minimum 200 churned accounts before model trains. Fallback to heuristic rule-based scoring if insufficient data. All ML predictions expire after 24h and are refreshed by next batch run. Revenue saved calculation: churn_prevented_accounts × avg_MRR × avg_contract_months_remaining.

OUTPUT: Write every file completely. No "# TODO" comments. No placeholder functions. All code must run. Include realistic sample data seeder (faker) for development. Each route must have docstrings. The backend must be deployable on Railway or Render with a single Dockerfile.`,

  frontend: `You are a senior React/TypeScript engineer. Build a complete, production-ready frontend for "ChurnPredictor" (branded as RetainIQ) — an AI-powered customer churn prediction and retention SaaS dashboard.

STACK: React 18, TypeScript 5, Vite, TailwindCSS 3, Zustand (state management), React Query v5 (server state + caching), React Router v6, Recharts (charts), Framer Motion (animations), Lucide React (icons), React Hook Form + Zod (forms), shadcn/ui (component primitives), Axios (API client).

BUILD THESE PAGES AND COMPONENTS IN FULL — no placeholders, every feature working:

1. /src/pages/Dashboard.tsx — Main dashboard: At-risk accounts heatmap (risk tier × MRR), daily digest card ("10 accounts moved to Critical today"), key metrics strip (total MRR at risk, churn rate trend sparkline, interventions this week, revenue saved this month). Recharts area chart: 90-day churn rate trend with forecast overlay.

2. /src/pages/Accounts.tsx — Full accounts table: sortable by risk score, MRR, last-seen; filterable by risk tier; expandable row showing top-5 SHAP factors (rendered as color-coded horizontal bars), 30/60/90-day usage sparklines, intervention history timeline. Bulk action: "Create outreach for selected Critical accounts."

3. /src/pages/AccountDetail.tsx — Deep-dive single account: risk score gauge (0–100 animated radial), feature importance waterfall chart, usage trend charts (DAU/WAU/MAU, feature adoption over time), intervention timeline with outcome tracking (retained / churned), revenue metrics (MRR, LTV, contract value, time to renewal), one-click "Start Retention Workflow" modal.

4. /src/pages/Integrations.tsx — Integration hub: connection cards for Mixpanel, Amplitude, Stripe, Salesforce, HubSpot, Intercom, Zendesk, Segment. Each card shows: connection status badge, last sync time, record count. OAuth flow + API key entry. Test connection with live validation.

5. /src/pages/Analytics.tsx — Revenue Intelligence: cohort retention heatmap (D3 powered), intervention success rate by type (bar chart), CS rep efficiency leaderboard, MRR saved waterfall chart (cumulative revenue saved since deployment), expansion revenue signals table.

6. /src/pages/Workflows.tsx — Retention workflow builder: drag-and-drop workflow editor (react-dnd), trigger configuration (risk tier threshold, specific feature = 0 for 14 days, etc.), action blocks (email, in-app message, CS alert, Slack notification), delay steps, A/B test branching. Workflow analytics: open rate, action taken rate, outcome (retained %).

7. /src/pages/Settings.tsx — Organization settings: model configuration (retraining schedule, risk tier thresholds), notification preferences, team management (invite / RBAC assign), API key management, billing overview.

8. /src/components/layout/ — Sidebar.tsx (collapsible, with section counts as badges), Topbar.tsx (org switcher, notifications bell with unread count, user menu), PageWrapper.tsx.

9. /src/components/charts/ — RiskGauge.tsx (animated SVG radial gauge), UsageSparkline.tsx (tiny inline Recharts), CohortHeatmap.tsx (D3 color interpolation), WaterfallChart.tsx, ShapWaterfall.tsx (horizontal bars with positive/negative colors).

10. /src/components/common/ — RiskBadge.tsx (color-coded: Critical=red, High=orange, Medium=yellow, Low=green), AccountCard.tsx (hover expand), InterventionTimeline.tsx, RevenueImpactCard.tsx.

DESIGN SYSTEM: White (#FFFFFF) primary background, slate-50 (#F8FAFC) sidebar, accent teal (#0891B2 = cyan-600), text-gray-900 for headings, text-gray-600 for body. Card borders: 1px solid #E2E8F0. Shadows: shadow-sm on cards, shadow-md on modals. Border-radius: rounded-xl on cards, rounded-2xl on hero sections. Font: DM Sans (Google Fonts import) for all text. Charts: teal/cyan color palette.

MOTION: Framer Motion page transitions (opacity + y-axis slide), staggered card animations on list renders, animated counter for metrics (count up on mount), risk gauge animates from 0 on load.

AUTHENTICATION: Login page with email/password form → JWT stored in httpOnly cookie (axios withCredentials). Protected routes redirect to /login. Role-based UI: CS rep sees limited settings; admin sees all.

API INTEGRATION: All pages use React Query hooks with proper loading skeletons, error boundaries, and stale-while-revalidate. Optimistic updates on workflow enable/disable toggles. WebSocket connection for real-time risk score updates (account list badge flicker on change).

OUTPUT: Write every file completely. Use TypeScript interfaces for all API response types. Every component must have proper prop types. No 'any' types. Implement all charts with real Recharts/D3 code (not placeholders). The frontend must connect to the FastAPI backend from the Backend Prompt — all API endpoints match exactly.`,

  database: `You are a senior PostgreSQL database architect. Design and implement the complete database schema, migrations, indexes, and seed data for "ChurnPredictor" — an AI-powered SaaS churn prediction platform.

REQUIREMENTS:

SCHEMA — write full CREATE TABLE SQL for all tables:

1. organizations — id, name, slug, plan (starter/growth/enterprise), mrr_tracked, created_at, settings (JSONB: risk thresholds, notification prefs, model config)
2. users — id, org_id (FK), email, password_hash, role (admin/cs_rep/viewer), full_name, avatar_url, last_login, created_at
3. customer_accounts — id, org_id, external_id, name, email, plan, mrr (NUMERIC 10,2), contract_start, contract_end, created_at, metadata (JSONB)
4. integration_configs — id, org_id, provider (mixpanel/stripe/salesforce/hubspot/amplitude/intercom/zendesk/segment), credentials (JSONB encrypted), last_sync, sync_status, record_count
5. account_events — id, account_id, event_type, event_data (JSONB), event_timestamp, source_integration — PARTITIONED BY MONTH on event_timestamp (TimescaleDB hypertable if available, else range partitioning)
6. account_features — id, account_id, feature_date, dau, wau, mau, session_count, avg_session_minutes, features_used_count, features_paid_count, adoption_score, onboarding_score, last_login, support_tickets_30d, payment_failures_90d, nps_score, integration_depth — computed daily, indexed on (account_id, feature_date)
7. churn_predictions — id, account_id, predicted_at, churn_probability, risk_tier, shap_top5 (JSONB: [{feature, value, impact}×5]), model_version, expires_at
8. model_registry — id, org_id, version, trained_at, training_records, auc_roc, precision, recall, f1, feature_count, status (active/retired), artifact_path
9. interventions — id, account_id, workflow_id, trigger_event, action_type, sent_at, outcome (retained/churned/pending), outcome_date, mrr_saved
10. workflows — id, org_id, name, trigger_config (JSONB), actions (JSONB array), is_active, stats (JSONB: sent_count, open_rate, success_rate)
11. revenue_events — id, account_id, event_type (subscription/upgrade/downgrade/cancellation/payment_failure), amount, recorded_at

INDEXES (write CREATE INDEX statements for every lookup pattern):
- account_features: (account_id, feature_date DESC) for time-series queries
- churn_predictions: (account_id, predicted_at DESC), (risk_tier, predicted_at) for tier-filtered queries
- account_events: (account_id, event_timestamp) BRIN index for time-range scans
- Full-text search: GIN index on customer_accounts.name for search
- Partial index: on churn_predictions WHERE risk_tier IN ('critical','high') for at-risk dashboard queries

ALEMBIC MIGRATIONS: Write the complete migration chain (env.py + 3 migration files: initial schema, add partitioning + indexes, add model_registry). Each migration fully reversible.

VIEWS AND FUNCTIONS:
- daily_churn_rate VIEW: calculates org-level churn rate per day from revenue_events
- get_at_risk_accounts(org_id, risk_tier) FUNCTION: returns accounts with current predictions filtered by tier, ordered by MRR descending
- calculate_revenue_saved(org_id, date_from, date_to) FUNCTION: sums mrr_saved from interventions with outcome = 'retained'
- cohort_retention_matrix(org_id) FUNCTION: returns M×N matrix of signup_month × month_number → retention_rate for cohort analysis

SEED DATA: Write a complete Python seeder using Faker + asyncpg that creates: 1 organization, 5 users (1 admin, 2 cs_rep, 2 viewer), 500 customer accounts with realistic MRR distribution ($50–$10,000/mo), 90 days of daily account_features for each account with realistic usage curves (declining accounts have slope < 0 in last 30 days), 50 churned accounts flagged in revenue_events, 200 interventions with mixed outcomes.

PERFORMANCE: All queries must complete in <100ms for 100K accounts. Provide EXPLAIN ANALYZE output for the 5 most critical queries showing index usage.`,

  mlModel: `You are a senior ML engineer specializing in customer analytics. Build the complete machine learning pipeline for "ChurnPredictor" — a customer churn prediction system using XGBoost with full MLOps practices.

DELIVERABLES — all code complete, no placeholders:

1. /ml/feature_store.py — FeatureStore class: connects to PostgreSQL, computes 150+ features per account from account_features table:
   USAGE FEATURES: dau_7d_avg, wau_4w_avg, mau_3m_avg, session_freq_7d, session_freq_30d, avg_session_minutes_30d, days_since_last_login, last_login_dayofweek (behavioral pattern)
   ADOPTION FEATURES: feature_adoption_pct (features_used/features_paid), onboarding_completion_score, integration_depth_score, power_user_pct (accounts with daily usage), feature_breadth_percentile
   TREND FEATURES (critical — most predictive): linear regression slope of DAU over 14d, 30d, 60d; slope of session_count; slope of adoption_score; 30d_over_60d usage ratio (acceleration/deceleration signal)
   HEALTH FEATURES: support_ticket_volume_30d, ticket_sentiment_score (VADER), payment_failure_count_90d, days_since_payment_failure, avg_ticket_resolution_hours
   RELATIONSHIP FEATURES: days_since_last_cs_contact, executive_sponsor_active (bool from CRM), cs_rep_tenure_months, nps_score, nps_trend
   FINANCIAL FEATURES: mrr, mrr_percentile_in_org, contract_age_months, days_to_renewal, plan_tier, upgrade_events_90d, downgrade_events_90d
   TEMPORAL FEATURES: account_age_days, cohort_month_number, seasonal_risk_adjustment (industry churn patterns by month)
   Returns: pd.DataFrame with account_id as index, all 150 features as columns. Handles missing values per feature type (median impute for numeric, mode for categorical, 0 for event counts).

2. /ml/model_trainer.py — ChurnModelTrainer class:
   - Loads feature store data, splits by time (train on t-120d to t-30d, validate on t-30d to t, test holdout on most recent 30d churned)
   - Handles class imbalance: SMOTE on training set only (never on validation/test)
   - XGBoostClassifier with Optuna hyperparameter optimization (n_estimators, max_depth, learning_rate, subsample, colsample_bytree, reg_alpha, reg_lambda) — 100 trials
   - Calibrates probabilities using IsotonicRegression (sklearn CalibratedClassifierCV) — ensures P(churn=1|score=0.7) ≈ 0.7 in validation
   - Evaluates: AUC-ROC, AUC-PR, calibration curve, precision at top-10%/20%/30% of risk score (critical for CS team prioritization), lift curve
   - Saves: model .ubj, feature names list, calibrator pickle, Optuna study
   - Registers in model_registry table with all metrics

3. /ml/explainability.py — ExplainabilityEngine class:
   - TreeExplainer (SHAP) for XGBoost — exact values
   - per_account_shap(account_id): returns top-5 positive and negative SHAP contributors with human-readable feature labels and delta values
   - Feature labels mapping: {'dau_slope_30d': 'Login frequency dropped 35% in 30 days', 'adoption_score': 'Only 22% of paid features used', 'payment_failure_count_90d': '3 failed payments in 90 days', ...} — all 150 features mapped to plain English
   - global_feature_importance(): returns ranked list of all features by mean |SHAP| for model documentation

4. /ml/prediction_engine.py — PredictionEngine class:
   - batch_score_all_accounts(org_id): loads current model, gets features for all accounts, returns DataFrame with churn_probability, risk_tier, shap_top5, expires_at
   - score_single_account(account_id): for real-time on-demand scoring
   - risk_tier_assignment(probability): Critical >0.70, High 0.50–0.70, Medium 0.30–0.50, Low <0.30 (thresholds configurable per org)
   - Writes results to churn_predictions table atomically

5. /ml/retraining_pipeline.py — automated monthly retraining:
   - Checks if new churned accounts ≥ 50 since last training (prevents retraining on insufficient new data)
   - Runs full training pipeline, evaluates vs. current production model
   - Champion-challenger: promotes new model only if AUC-ROC improves by >0.5% or calibration error decreases
   - Sends Slack notification with model comparison metrics

6. /ml/drift_detector.py — Production monitoring:
   - Feature drift: PSI (Population Stability Index) on each feature weekly — alert if PSI > 0.2
   - Prediction drift: KL-divergence on score distribution weekly
   - Outcome tracking: once outcomes known (30d lag), calculate actual churn rate per risk tier — alert if Critical tier actual churn < 50% (model under-predicting)

7. /tests/test_ml_pipeline.py — pytest unit tests: feature computation correctness, calibration validation, SHAP output format, drift detector thresholds, retraining trigger logic.

8. /notebooks/model_analysis.ipynb — Jupyter notebook: EDA on churn patterns, feature correlation analysis, model performance deep-dive, calibration plots, sample prediction explanations.

Write all code in full. Use realistic synthetic data in tests. All functions type-annotated with docstrings. The pipeline must handle an org with 10K accounts and complete daily scoring in <5 minutes on a standard 4-core server.`,

  deployment: `You are a senior DevOps/Platform engineer. Write the complete deployment configuration for "ChurnPredictor" — an AI-powered SaaS deployed on Railway (primary) with Render as fallback.

DELIVERABLES — all files complete:

1. /Dockerfile — Multi-stage build: builder stage installs Python deps + compiles XGBoost with CPU optimizations; runtime stage copies only necessary artifacts. Non-root user. Health check endpoint. ENV: PYTHONUNBUFFERED=1, WORKERS=4 (uvicorn).

2. /docker-compose.yml — Local development: api (Dockerfile), postgres (15-alpine with init scripts), redis (7-alpine with persistence), celery-worker (same image, different CMD), celery-beat, flower (Celery monitoring UI), nginx (reverse proxy with rate limiting). All services: health checks, restart policies, volume mounts.

3. /railway.toml — Railway deployment config: build command, start command, health check path, environment variables reference.

4. /.github/workflows/deploy.yml — GitHub Actions CI/CD:
   - On push to main: run pytest (all tests must pass), build Docker image, push to GitHub Container Registry, trigger Railway deployment via webhook
   - On PR: run tests + type checking (mypy) + linting (ruff) — block merge if any fail
   - Monthly cron: trigger ML model retraining job via API call

5. /nginx/nginx.conf — Rate limiting: 10 req/s per IP for /api/predictions, 100 req/s for dashboard. SSL termination. Gzip compression. Cache static assets 30d. Security headers: HSTS, X-Frame-Options, CSP.

6. /scripts/setup_production.sh — One-command production setup: create PostgreSQL user/database, run Alembic migrations, seed initial admin user, configure Celery beat schedule, verify all integrations healthy.

7. /monitoring/alerts.yml — Prometheus alert rules: API p99 latency > 500ms, Celery queue depth > 100, ML scoring job > 10min, PostgreSQL connections > 80%, Redis memory > 80%.

8. /backup/backup.sh — Daily PostgreSQL backup to S3 (or Railway volumes), 30-day retention, integrity verification, Slack notification on failure.

9. README.md — Complete deployment guide: local setup (5 commands), Railway deployment (3 commands), environment variables reference (all 35 vars with descriptions), API documentation link, architecture diagram (ASCII), troubleshooting guide for top 10 issues.

ENVIRONMENT VARIABLES (document all 35 with type, required flag, description, example value): DATABASE_URL, REDIS_URL, SECRET_KEY, ALGORITHM, SENDGRID_API_KEY, MIXPANEL_SERVICE_ACCOUNT, STRIPE_SECRET_KEY, SALESFORCE_CLIENT_ID, SALESFORCE_CLIENT_SECRET, HUBSPOT_API_KEY, INTERCOM_ACCESS_TOKEN, ZENDESK_SUBDOMAIN, ZENDESK_EMAIL, ZENDESK_TOKEN, AMPLITUDE_API_KEY, SEGMENT_WRITE_KEY, PAGERDUTY_ROUTING_KEY, SLACK_WEBHOOK_URL, ML_MODELS_PATH, RETRAINING_SCHEDULE_CRON, CELERY_BROKER_URL, SENTRY_DSN, LOG_LEVEL, CORS_ORIGINS, MAX_ACCOUNTS_PER_ORG, SMTP_HOST, AWS_S3_BUCKET, RAILWAY_ENVIRONMENT, etc.

The entire stack must be deployable in under 20 minutes from a fresh Railway project.`
};

/* ---------- TYPES ---------- */
interface Comment {
  id: number;
  name: string;
  message: string;
  timestamp: string;
  avatar: string;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN COMPONENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function ChurnPredictor() {
  const { useCredit } = useCredits();
  const [activeSection, setActiveSection] = useState("overview");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      name: "Priya Sharma",
      message: "The SHAP explanation feature is brilliant — makes AI decisions transparent for non-technical CS teams. How are you handling model drift in production?",
      timestamp: "2 days ago",
      avatar: "PS",
    },
    {
      id: 2,
      name: "Marcus Chen",
      message: "RetainIQ is exactly what we needed. The intervention ROI tracking alone justified the subscription. Impressive that it's built solo.",
      timestamp: "5 days ago",
      avatar: "MC",
    },
  ]);
  const [newComment, setNewComment] = useState({ name: "", message: "" });
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  /* ---------- scroll spy ---------- */
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["overview", "problem", "solution", "architecture", "features", "stack", "impact", "prompts", "downloads", "comments"];
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

  /* ---------- copy prompt ---------- */
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

  /* ---------- master copy prompt ---------- */
  const copyMasterPrompt = () => {
    if (!useCredit()) {
      alert("Out of credits! Check back next month or upgrade your account.");
      return;
    }
    const masterText = `You are a Senior Technical Lead and Full-Stack Architect. Your task is to build the "ChurnPredictor" / "RetainIQ" SaaS platform from scratch. 
I have broken down the architecture into 5 distinct implementation domains. Please implement ALL of them in your environment using the exact specifications below.

--- 1. BACKEND ARCHITECTURE ---
${PROMPTS.backend}

--- 2. FRONTEND ARCHITECTURE ---
${PROMPTS.frontend}

--- 3. DATABASE ARCHITECTURE ---
${PROMPTS.database}

--- 4. ML MODEL ARCHITECTURE ---
${PROMPTS.mlModel}

--- 5. DEPLOYMENT ARCHITECTURE ---
${PROMPTS.deployment}

Please begin by planning the directory structure, and then implement the files.`;

    navigator.clipboard.writeText(masterText).then(() => {
      setCopiedKey("master");
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  /* ---------- add comment ---------- */
  const addComment = () => {
    if (!newComment.name.trim() || !newComment.message.trim()) return;
    setComments(prev => [{
      id: Date.now(),
      name: newComment.name,
      message: newComment.message,
      timestamp: "Just now",
      avatar: newComment.name.slice(0, 2).toUpperCase(),
    }, ...prev]);
    setNewComment({ name: "", message: "" });
  };

  /* ---------- PDF download ---------- */
  const downloadPDF = async () => {
    setDownloadStatus("Generating PDF…");
    try {
      // Dynamic import jsPDF (assumes npm install jspdf html2canvas)
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const TEAL = [8, 145, 178] as [number, number, number];
      const DARK = [15, 23, 42] as [number, number, number];
      const GRAY = [100, 116, 139] as [number, number, number];
      const W = 210, pad = 18;
      let y = 0;

      const addPage = () => { doc.addPage(); y = 20; };
      const checkY = (needed: number) => { if (y + needed > 275) addPage(); };

      // Cover
      doc.setFillColor(...TEAL);
      doc.rect(0, 0, W, 60, "F");
      doc.setFillColor(0, 75, 100);
      doc.rect(0, 55, W, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22); doc.setFont("helvetica", "bold");
      doc.text("CHURNPREDICTOR / RetainIQ", pad, 24);
      doc.setFontSize(11); doc.setFont("helvetica", "normal");
      doc.text("AI-Powered Customer Revenue Intelligence & Retention Platform", pad, 34);
      doc.setFontSize(9);
      doc.text("Project #16  ·  Full-Stack ML/SaaS  ·  Rank 16 of 75  ·  Status: LIVE ✓", pad, 44);
      doc.text(`Generated: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`, pad, 52);

      // Author strip
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 63, W, 20, "F");
      doc.setTextColor(...DARK);
      doc.setFontSize(10); doc.setFont("helvetica", "bold");
      doc.text("Anshul Rathod", pad, 73);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5); doc.setTextColor(...GRAY);
      doc.text("linkedin.com/in/anshul-rathod777  ·  github.com/Anshul-777  ·  customer-churn-predictor-eta.vercel.app", pad, 79);

      y = 95;

      // Section helper
      const section = (title: string, emoji: string) => {
        checkY(16);
        doc.setFillColor(...TEAL);
        doc.rect(pad - 3, y - 5, 4, 10, "F");
        doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.setTextColor(...DARK);
        doc.text(`${emoji}  ${title}`, pad + 4, y + 2);
        y += 12;
      };

      const body = (text: string, indent = 0) => {
        doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(51, 65, 85);
        const lines = doc.splitTextToSize(text, W - pad * 2 - indent);
        checkY(lines.length * 5 + 3);
        doc.text(lines, pad + indent, y);
        y += lines.length * 5 + 3;
      };

      const bullet = (text: string) => {
        checkY(8);
        doc.setFillColor(...TEAL);
        doc.circle(pad + 2, y - 1, 1.2, "F");
        doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(51, 65, 85);
        const lines = doc.splitTextToSize(text, W - pad * 2 - 8);
        doc.text(lines, pad + 6, y);
        y += lines.length * 5 + 2;
      };

      // Stats boxes
      const stats = [
        { label: "ARR Potential", value: "$60K–$600K" },
        { label: "Customers at Risk Detected", value: "Daily" },
        { label: "Avg Churn Reduction", value: "18–35%" },
        { label: "Status", value: "LIVE ✓" },
      ];
      stats.forEach((s, i) => {
        const x = pad + i * 43.5;
        doc.setFillColor(240, 249, 255);
        doc.roundedRect(x, y, 41, 20, 2, 2, "F");
        doc.setFillColor(...TEAL);
        doc.roundedRect(x, y, 41, 4, 2, 2, "F");
        doc.rect(x, y + 2, 41, 2, "F");
        doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(...DARK);
        doc.text(s.value, x + 20.5, y + 14, { align: "center" });
        doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(...GRAY);
        doc.text(s.label, x + 20.5, y + 19, { align: "center" });
      });
      y += 28;

      section("Problem Statement", "🔴");
      body("Customer churn is the existential threat for every subscription business. A company with 5% monthly churn has a customer lifetime of only 20 months. Most churn is predictable — churned customers exhibit behavioral signals 30–90 days before cancellation, but no one is watching all of them simultaneously.");
      bullet("CS teams cover 500+ accounts manually — they operate on gut feel, not data");
      bullet("By the time a customer says 'I want to cancel,' the decision is already made");
      bullet("$12K–$22K in analyst labor wasted per research cycle on manual account reviews");
      bullet("Research shows 45% of executives make major decisions with incomplete intelligence");
      y += 3;

      section("Idea & Solution Concept", "💡");
      body("ChurnPredictor (deployed as RetainIQ) connects to any product database, usage analytics (Mixpanel, Amplitude, Segment), payment processor (Stripe), and CRM (Salesforce, HubSpot) via API. It builds a behavioral feature matrix per customer account, trains a gradient boosting churn model calibrated to the company's specific churn patterns, generates daily risk scores with SHAP explanations, and triggers automated personalized retention workflows.");
      y += 3;

      section("Core Architecture", "⚙️");
      const archItems = [
        "Data Integration Layer: Mixpanel, Amplitude, Stripe, Salesforce, HubSpot, Intercom, Zendesk, Segment — all normalized to internal schema",
        "Feature Engineering: 150+ churn-predictive features per account — DAU/WAU/MAU ratios, adoption depth, 30/60/90-day trend slopes, support sentiment, payment history",
        "ML Pipeline: XGBoostClassifier with SMOTE oversampling, Optuna hyperparameter tuning, isotonic calibration — outputs true probabilities with SHAP explanations",
        "Risk Segmentation: Critical (>70%), High (50–70%), Medium (30–50%), Low (<30%) — updated daily for all accounts",
        "Retention Workflows: Rule-triggered personalized interventions — email sequences, in-app messages, CS alerts, intelligent dunning",
        "Revenue Dashboard: MRR at risk, revenue saved calculator, cohort retention analysis, intervention ROI tracking",
      ];
      archItems.forEach(item => bullet(item));
      y += 3;

      section("Key Features (15)", "✅");
      const features = [
        "One-click integrations: Mixpanel, Amplitude, Stripe, Salesforce, HubSpot, Intercom, Zendesk",
        "150+ automated features: DAU/WAU/MAU, feature adoption, payment failure, support sentiment",
        "Company-specific XGBoost model trained on your historical churn data",
        "SHAP explainability: 'This account is at risk because login frequency dropped 80% in 30 days'",
        "Daily at-risk digest: prioritized action list with exact talking points for CS reps",
        "Automated retention workflows: email, in-app messages, CS alerts triggered by risk signals",
        "Intelligent dunning: 3-email escalating payment failure recovery sequence",
        "Executive sponsor departure detection with immediate CS escalation",
        "Cohort analysis: retention rates before/after ChurnPredictor deployment",
        "CS rep efficiency dashboard: accounts managed, tier distribution, intervention success rate",
        "Revenue impact calculator: exact MRR saved per prevented churn event",
        "Expansion revenue signals: identifies high-engagement under-plan accounts for upsell",
        "Competitor risk detection via support ticket NLP analysis",
        "Monthly auto-retraining on new churn data",
        "API access for custom BI tool integration",
      ];
      features.forEach((f, i) => bullet(`${i + 1}. ${f}`));
      y += 3;

      section("Tech Stack", "🛠️");
      const stack = [
        { cat: "Backend", items: "Python 3.12, FastAPI, PostgreSQL, Redis, Celery, Alembic" },
        { cat: "ML/AI", items: "XGBoost, SHAP, scikit-learn, pandas, numpy, Optuna, SMOTE" },
        { cat: "Frontend", items: "React 18, TypeScript, Vite, TailwindCSS, Recharts, Framer Motion" },
        { cat: "Integrations", items: "Mixpanel, Stripe, Salesforce, HubSpot, Intercom, Zendesk, Segment" },
        { cat: "Deployment", items: "Docker, Railway, Vercel, GitHub Actions CI/CD, Nginx" },
      ];
      stack.forEach(s => {
        checkY(9);
        doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(...TEAL);
        doc.text(`${s.cat}: `, pad + 6, y);
        const catW = doc.getTextWidth(`${s.cat}: `);
        doc.setFont("helvetica", "normal"); doc.setTextColor(51, 65, 85);
        doc.text(s.items, pad + 6 + catW, y);
        y += 7;
      });
      y += 3;

      section("Feasibility & Viability", "📊");
      body("Technical Feasibility: HIGH — All components use mature, production-proven open-source libraries. XGBoost and SHAP are industry-standard ML tools. FastAPI + PostgreSQL stack handles 100K+ accounts with sub-100ms queries. Deployed on Vercel + Railway with zero-downtime deploys.");
      body("Market Viability: $2.3B churn management market (25% CAGR). Every SaaS company with >200 customers is a potential buyer. At $500–$5,000/month pricing, breakeven at 3–5 customers. For a $10M ARR company, reducing churn by 1% = $100K/month saved — making the subscription trivially cheap.");
      body("Competitive Moat: Company-specific model (vs. generic industry models), SHAP explainability (vs. black-box scores), automated intervention execution (vs. predictions-only tools), measurable revenue impact tracking.");
      y += 3;

      section("Market Impact", "🚀");
      bullet("Direct replacement for $12K–$22K per research cycle in analyst labor");
      bullet("ROI typically achieved within days of first prevented churn event");
      bullet("For $10M ARR company: 1% churn reduction = $100K/month in protected revenue");
      bullet("Pricing: $500–$5,000/month; target LTV $36,000–$180,000 per enterprise customer");
      bullet("Total addressable market: 100,000+ SaaS companies globally with subscription revenue");
      y += 3;

      section("Links & Resources", "🔗");
      doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(...TEAL);
      doc.text("Live Platform:  customer-churn-predictor-eta.vercel.app", pad + 6, y); y += 7;
      doc.text("GitHub:  github.com/Anshul-777/Customer-Churn-Predictor", pad + 6, y); y += 7;
      doc.text("LinkedIn:  linkedin.com/in/anshul-rathod777", pad + 6, y); y += 10;

      // Footer on all pages
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFillColor(248, 250, 252);
        doc.rect(0, 285, W, 12, "F");
        doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...GRAY);
        doc.text("© 2025 Anshul Rathod · ChurnPredictor / RetainIQ · All rights reserved · Portfolio Project #16", W / 2, 292, { align: "center" });
        doc.text(`Page ${i} of ${totalPages}`, W - pad, 292, { align: "right" });
      }

      doc.save("ChurnPredictor_RetainIQ_Portfolio_AnshulRathod.pdf");
      setDownloadStatus("PDF Downloaded ✓");
    } catch {
      // Fallback: print
      window.print();
      setDownloadStatus("Opened Print Dialog ✓");
    }
    setTimeout(() => setDownloadStatus(null), 3000);
  };

  /* ---------- scroll to section ---------- */
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════ */
  return (
    <div ref={pageRef} style={{ fontFamily: "'DM Sans', sans-serif", background: "#FFFFFF", color: "#0F172A" }}>

      {/* Google Font */}
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap" rel="stylesheet" />

      {/* ── TOP NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #E2E8F0",
        padding: "0 32px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="../index.html" style={{ color: "#64748B", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
            ← Anshul's Projects
          </a>
          <span style={{ color: "#CBD5E1" }}>|</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0891B2" }}>Project #16</span>
          <span style={{
            background: "#ECFEFF", color: "#0891B2", border: "1px solid #A5F3FC",
            borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600
          }}>LIVE ✓</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a href="https://customer-churn-predictor-eta.vercel.app/" target="_blank" rel="noopener"
            style={{ background: "#0891B2", color: "#fff", padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
            🌐 Live Demo
          </a>
          <a href="https://github.com/Anshul-777/Customer-Churn-Predictor" target="_blank" rel="noopener"
            style={{ background: "#0F172A", color: "#fff", padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
            ⌥ GitHub
          </a>
          <a href="https://www.linkedin.com/in/anshul-rathod777" target="_blank" rel="noopener"
            style={{ background: "#0A66C2", color: "#fff", padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
            in
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: 520,
        background: "linear-gradient(135deg, #0C4A6E 0%, #0891B2 40%, #164E63 70%, #0F172A 100%)",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "80px 48px 60px"
      }}>
        {/* Decorative circles */}
        {[{ s: 400, x: -100, y: -100, op: 0.06 }, { s: 300, x: "calc(100% - 150px)", y: -80, op: 0.08 }, { s: 200, x: "30%", y: "60%", op: 0.05 }].map((c, i) => (
          <div key={i} style={{
            position: "absolute", width: c.s, height: c.s, borderRadius: "50%",
            background: "radial-gradient(circle, #67E8F9, transparent)",
            left: c.x as string | number, top: c.y as string | number, opacity: c.op, pointerEvents: "none"
          }} />
        ))}
        <div style={{ position: "relative", maxWidth: 860 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            {["#16", "Full-Stack ML/SaaS", "LIVE ✓", "Rank 16/75", "HIGH Complexity"].map((tag, i) => (
              <span key={i} style={{
                background: i === 2 ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.1)",
                border: `1px solid ${i === 2 ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.2)"}`,
                color: i === 2 ? "#6EE7B7" : "rgba(255,255,255,0.85)",
                borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 600
              }}>{tag}</span>
            ))}
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800, color: "#FFFFFF",
            lineHeight: 1.1, marginBottom: 12, letterSpacing: -1
          }}>
            ChurnPredictor
            <span style={{ color: "#67E8F9" }}> / </span>
            <span style={{ fontWeight: 300 }}>RetainIQ</span>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", maxWidth: 640, lineHeight: 1.6, marginBottom: 28 }}>
            AI-Powered Customer Revenue Intelligence & Retention Platform — predict churn 60–90 days early,
            trigger personalized interventions, and measure every dollar saved.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("problem")}
              style={{ background: "#FFFFFF", color: "#0891B2", border: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Explore Project ↓
            </button>
            <button onClick={copyMasterPrompt}
              style={{ background: copiedKey === "master" ? "#059669" : "#indigo-600", backgroundImage: copiedKey === "master" ? "none" : "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)" }}>
              {copiedKey === "master" ? "✓ Master Prompt Copied!" : "✨ Copy Master Prompt"}
            </button>
            <button onClick={downloadPDF}
              style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "12px 24px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
              {downloadStatus || "⬇ Download PDF"}
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
          {[
            { num: "$60K–$600K", label: "Annual Revenue Potential", icon: "💰" },
            { num: "150+", label: "ML Features per Account", icon: "🧠" },
            { num: "60–90 Days", label: "Early Churn Detection", icon: "⏱" },
            { num: "~30%", label: "Average Churn Reduction", icon: "📉" },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "28px 24px", textAlign: "center",
              borderRight: i < 3 ? "1px solid #E2E8F0" : "none"
            }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0891B2", lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SIDE NAV + CONTENT WRAPPER ── */}
      <div style={{ display: "flex", maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

        {/* Sticky side nav */}
        <aside style={{
          width: 200, flexShrink: 0,
          position: "sticky", top: 80, alignSelf: "flex-start",
          padding: "32px 0", display: "none"  // hidden on small, visible on lg via CSS
        }} className="side-nav">
          {[
            { id: "overview", label: "Overview" },
            { id: "problem", label: "Problem" },
            { id: "solution", label: "Solution" },
            { id: "architecture", label: "Architecture" },
            { id: "features", label: "Features" },
            { id: "stack", label: "Tech Stack" },
            { id: "impact", label: "Impact" },
            { id: "prompts", label: "AI Prompts" },
            { id: "downloads", label: "Downloads" },
            { id: "comments", label: "Comments" },
          ].map(s => (
            <button key={s.id} onClick={() => scrollTo(s.id)} style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "8px 16px", borderRadius: 8, fontSize: 13,
              fontWeight: activeSection === s.id ? 700 : 400,
              color: activeSection === s.id ? "#0891B2" : "#64748B",
              background: activeSection === s.id ? "#ECFEFF" : "transparent",
              border: "none", cursor: "pointer", marginBottom: 4
            }}>{s.label}</button>
          ))}
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: "48px 0 80px", paddingLeft: 0 }}>

          {/* ── OVERVIEW ── */}
          <section id="overview" style={{ marginBottom: 60 }}>
            <SectionTitle emoji="📋" title="Project Overview" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <InfoCard title="Platform Name" value="RetainIQ (ChurnPredictor)" />
              <InfoCard title="Category" value="Full-Stack Web · Machine Learning · SaaS B2B" />
              <InfoCard title="Built With" value="Python, FastAPI, XGBoost, React, PostgreSQL" />
              <InfoCard title="Live Since" value="2024 · Deployed on Vercel + Railway" />
              <InfoCard title="GitHub" value="github.com/Anshul-777/Customer-Churn-Predictor" link="https://github.com/Anshul-777/Customer-Churn-Predictor" />
              <InfoCard title="Live Website" value="customer-churn-predictor-eta.vercel.app" link="https://customer-churn-predictor-eta.vercel.app/" />
            </div>
            <div style={{ marginTop: 20, background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 12, padding: "16px 20px" }}>
              <p style={{ fontSize: 14, color: "#0C4A6E", lineHeight: 1.7, margin: 0 }}>
                <strong>Core Idea:</strong> A SaaS platform that integrates with any product database, usage analytics, and CRM to build customer-specific churn propensity scores using gradient boosting models,
                identify at-risk customers 60–90 days before they churn, trigger automated personalized retention workflows, and calculate the revenue impact of every intervention.
              </p>
            </div>
          </section>

          {/* ── PROBLEM ── */}
          <section id="problem" style={{ marginBottom: 60 }}>
            <SectionTitle emoji="🔴" title="Problem Statement" />
            <div style={{ background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 12, padding: "24px 28px", marginBottom: 20 }}>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "#1A202C", margin: 0 }}>
                Customer churn is the <strong>existential threat</strong> for every subscription business. A company with 5% monthly churn has a customer lifetime of only 20 months —
                meaning every customer relationship must pay back its acquisition cost in under two years. This math kills most SaaS businesses before they scale.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { title: "Invisible Signals", desc: "Churned customers show behavioral warning signs 30–90 days early — declining logins, unused features, failed payments — but no one monitors all signals simultaneously." },
                { title: "Manual Overload", desc: "A 3-person CS team covering 500 accounts cannot track behavioral signals for every account. They react to the loudest customers, not the most at-risk ones." },
                { title: "Too Late to Act", desc: "By the time a customer contacts support about canceling, the decision is already made. Prevention requires action weeks earlier." },
                { title: "No Revenue Visibility", desc: "Companies don't know how much MRR is at risk right now, which accounts to prioritize, or whether their retention efforts are actually working." },
              ].map((p, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "16px 18px" }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: "#EF4444", marginBottom: 6 }}>⚠ {p.title}</h4>
                  <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── SOLUTION ── */}
          <section id="solution" style={{ marginBottom: 60 }}>
            <SectionTitle emoji="💡" title="Idea & Solution Concept" />
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.8, marginBottom: 20 }}>
              RetainIQ connects to a company's existing data stack — product analytics, payment processor, CRM, and support tools — and transforms raw behavioral data into predictive intelligence and automated action.
              Instead of waiting for customers to show explicit cancel intent, the system continuously monitors 150+ behavioral signals and surfaces accounts that are quietly disengaging.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[
                { icon: "🔗", title: "Connect", desc: "One-click integrations with Mixpanel, Stripe, Salesforce, HubSpot, Intercom, Zendesk, Segment. Setup in under 30 minutes." },
                { icon: "🧮", title: "Predict", desc: "Company-specific XGBoost model trained on your historical churn data. SHAP explanations for every risk score — not a black box." },
                { icon: "🎯", title: "Retain", desc: "Automated personalized interventions trigger before customers disengage. CS reps get daily digests with exact talking points and prioritized account lists." },
              ].map((s, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "20px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>{s.title}</h4>
                  <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── ARCHITECTURE ── */}
          <section id="architecture" style={{ marginBottom: 60 }}>
            <SectionTitle emoji="⚙️" title="System Architecture" />
            <p style={{ fontSize: 14, color: "#475569", marginBottom: 20, lineHeight: 1.7 }}>
              A five-layer data pipeline that transforms raw product telemetry into predictive intelligence and automated retention actions.
              Each layer is independently scalable and deployable via Docker containers orchestrated by Railway.
            </p>
            {/* SVG Architecture Diagram */}
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 16, padding: 24, overflowX: "auto" }}>
              <svg viewBox="0 0 800 460" style={{ width: "100%", height: "auto", minWidth: 600 }}>
                {/* Layer labels */}
                {[
                  { y: 20, label: "LAYER 1 — DATA SOURCES", color: "#94A3B8" },
                  { y: 130, label: "LAYER 2 — FEATURE ENGINEERING", color: "#94A3B8" },
                  { y: 230, label: "LAYER 3 — ML PIPELINE", color: "#94A3B8" },
                  { y: 330, label: "LAYER 4 — ACTION ENGINE", color: "#94A3B8" },
                  { y: 410, label: "LAYER 5 — DASHBOARD", color: "#94A3B8" },
                ].map((l, i) => (
                  <text key={i} x="10" y={l.y} fontSize="8" fill={l.color} fontFamily="DM Sans, sans-serif" fontWeight="600">{l.label}</text>
                ))}

                {/* L1: Data Sources */}
                {[
                  { x: 50, label: "Mixpanel\nAmplitude", color: "#7C3AED" },
                  { x: 190, label: "Stripe\nChargebee", color: "#0891B2" },
                  { x: 330, label: "Salesforce\nHubSpot", color: "#0891B2" },
                  { x: 470, label: "Intercom\nZendesk", color: "#059669" },
                  { x: 610, label: "Custom DB\nSegment", color: "#D97706" },
                ].map((s, i) => (
                  <g key={i}>
                    <rect x={s.x} y={35} width={110} height={50} rx="8" fill="white" stroke={s.color} strokeWidth="1.5" />
                    <text x={s.x + 55} y={56} fontSize="9" fill={s.color} textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="600">{s.label.split("\n")[0]}</text>
                    <text x={s.x + 55} y={70} fontSize="9" fill={s.color} textAnchor="middle" fontFamily="DM Sans, sans-serif">{s.label.split("\n")[1]}</text>
                    {/* Arrow down */}
                    <line x1={s.x + 55} y1={85} x2={s.x + 55} y2={100} stroke="#CBD5E1" strokeWidth="1.5" markerEnd="url(#arrow)" />
                  </g>
                ))}

                {/* L2: Feature Engineering */}
                <rect x={50} y={100} width={710} height={60} rx="10" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.5" />
                <text x={405} y={127} fontSize="11" fill="#1D4ED8" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">Feature Engineering Engine</text>
                <text x={405} y={145} fontSize="9" fill="#3B82F6" textAnchor="middle" fontFamily="DM Sans, sans-serif">150+ features: DAU/WAU/MAU slopes · Adoption depth · Payment failures · Support sentiment · NPS · Trend indicators</text>

                {/* Arrow */}
                <line x1={405} y1={160} x2={405} y2={175} stroke="#CBD5E1" strokeWidth="1.5" />
                <polygon points="400,175 410,175 405,185" fill="#CBD5E1" />

                {/* L3: ML Pipeline */}
                <rect x={50} y={185} width={340} height={65} rx="10" fill="#F0FDF4" stroke="#A7F3D0" strokeWidth="1.5" />
                <text x={220} y={208} fontSize="11" fill="#065F46" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">XGBoost Classifier</text>
                <text x={220} y={224} fontSize="9" fill="#059669" textAnchor="middle" fontFamily="DM Sans, sans-serif">SMOTE · Isotonic Calibration · Optuna Tuning</text>
                <text x={220} y={240} fontSize="9" fill="#059669" textAnchor="middle" fontFamily="DM Sans, sans-serif">SHAP Explanations · Monthly Auto-Retraining</text>

                <rect x={420} y={185} width={340} height={65} rx="10" fill="#FFF7ED" stroke="#FED7AA" strokeWidth="1.5" />
                <text x={590} y={208} fontSize="11" fill="#92400E" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">Risk Segmentation</text>
                <text x={590} y={224} fontSize="9" fill="#D97706" textAnchor="middle" fontFamily="DM Sans, sans-serif">Critical &gt;70% · High 50–70%</text>
                <text x={590} y={240} fontSize="9" fill="#D97706" textAnchor="middle" fontFamily="DM Sans, sans-serif">Medium 30–50% · Low &lt;30%</text>

                {/* Arrow */}
                <line x1={405} y1={250} x2={405} y2={270} stroke="#CBD5E1" strokeWidth="1.5" />
                <polygon points="400,270 410,270 405,280" fill="#CBD5E1" />

                {/* L4: Action Engine */}
                {[
                  { x: 50, label: "Email\nWorkflows", color: "#7C3AED" },
                  { x: 230, label: "In-App\nMessages", color: "#0891B2" },
                  { x: 410, label: "CS Rep\nAlerts", color: "#DC2626" },
                  { x: 590, label: "Intelligent\nDunning", color: "#059669" },
                ].map((a, i) => (
                  <g key={i}>
                    <rect x={a.x} y={280} width={150} height={50} rx="8" fill="white" stroke={a.color} strokeWidth="1.5" />
                    <text x={a.x + 75} y={302} fontSize="9" fill={a.color} textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="600">{a.label.split("\n")[0]}</text>
                    <text x={a.x + 75} y={316} fontSize="9" fill={a.color} textAnchor="middle" fontFamily="DM Sans, sans-serif">{a.label.split("\n")[1]}</text>
                    <line x1={a.x + 75} y1={330} x2={a.x + 75} y2={345} stroke="#CBD5E1" strokeWidth="1.5" />
                    <polygon points={`${a.x + 70},345 ${a.x + 80},345 ${a.x + 75},355`} fill="#CBD5E1" />
                  </g>
                ))}

                {/* L5: Dashboard */}
                <rect x={50} y={355} width={710} height={50} rx="10" fill="#ECFEFF" stroke="#A5F3FC" strokeWidth="1.5" />
                <text x={405} y={377} fontSize="11" fill="#0891B2" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">Revenue Intelligence Dashboard</text>
                <text x={405} y={393} fontSize="9" fill="#0891B2" textAnchor="middle" fontFamily="DM Sans, sans-serif">MRR at Risk · Intervention ROI · Cohort Retention · CS Rep Efficiency · Expansion Signals</text>

                {/* Arrow marker */}
                <defs>
                  <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill="#CBD5E1" />
                  </marker>
                </defs>
              </svg>
            </div>

            {/* Architecture text details */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
              {[
                {
                  title: "Data Integration Layer",
                  items: ["Mixpanel, Amplitude, Segment — usage events", "Stripe, Chargebee — subscription & payment data", "Salesforce, HubSpot — CRM account context", "Intercom, Zendesk — support ticket sentiment", "Direct PostgreSQL/MySQL connections supported"]
                },
                {
                  title: "Feature Engineering",
                  items: ["DAU/WAU/MAU + 30/60/90-day slope analysis", "Feature adoption depth (% of paid features)", "Onboarding completion + integration depth score", "Payment failure count and recency", "Support ticket volume + VADER sentiment trend"]
                },
                {
                  title: "ML Pipeline",
                  items: ["XGBoostClassifier with Optuna HPO (100 trials)", "SMOTE oversampling for class imbalance", "Isotonic calibration — true probability output", "SHAP TreeExplainer — top-5 features per account", "Monthly auto-retraining with champion-challenger"]
                },
                {
                  title: "Intervention Engine",
                  items: ["Rule + ML-triggered workflow dispatch", "SendGrid transactional email sequences", "Intercom in-app message automation", "PagerDuty CS rep alert integration", "3-email intelligent dunning for payment failures"]
                },
              ].map((s, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "16px 18px" }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: "#0891B2", marginBottom: 10 }}>{s.title}</h4>
                  {s.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                      <span style={{ color: "#0891B2", fontWeight: 700, fontSize: 12 }}>›</span>
                      <span style={{ fontSize: 12, color: "#475569" }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* ── FEATURES ── */}
          <section id="features" style={{ marginBottom: 60 }}>
            <SectionTitle emoji="✅" title="Features (15 Core Capabilities)" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                { n: "01", title: "Multi-Source Integration", desc: "One-click connectors: Mixpanel, Amplitude, Stripe, Salesforce, HubSpot, Intercom, Zendesk, Segment", icon: "🔗" },
                { n: "02", title: "150+ Feature Engineering", desc: "Automated computation of usage, adoption, health, relationship, financial and trend features per account", icon: "⚙️" },
                { n: "03", title: "Company-Specific ML Model", desc: "XGBoost trained on your historical churn data — calibrated to your specific customer behavior patterns", icon: "🤖" },
                { n: "04", title: "SHAP Explainability", desc: "'This account is at 73% churn risk because login frequency dropped 80% in 30 days and 2 payments failed'", icon: "🔍" },
                { n: "05", title: "Daily At-Risk Digest", desc: "Morning email to CS team: prioritized account list with top risk factors and recommended actions", icon: "📧" },
                { n: "06", title: "Automated Retention Workflows", desc: "Email, in-app message, and CS alert triggers — personalized based on specific risk factor driving churn", icon: "⚡" },
                { n: "07", title: "Intelligent Dunning", desc: "3-email escalating sequence for payment failures — progressively personal tone over 7 days", icon: "💳" },
                { n: "08", title: "Executive Sponsor Detection", desc: "CRM-integrated alerts when key contacts go inactive — triggers executive re-engagement workflow", icon: "👤" },
                { n: "09", title: "Cohort Retention Analysis", desc: "Compare retention rates before/after ChurnPredictor deployment — prove the ROI to your board", icon: "📊" },
                { n: "10", title: "CS Rep Efficiency Dashboard", desc: "Accounts managed per rep, risk tier distribution, intervention success rates by action type", icon: "👥" },
                { n: "11", title: "Revenue Impact Calculator", desc: "Exact MRR saved per prevented churn event: prevented_accounts × MRR × contract_months_remaining", icon: "💰" },
                { n: "12", title: "Expansion Revenue Signals", desc: "Identifies high-engagement accounts under-utilizing their current plan — upsell opportunity queue", icon: "📈" },
                { n: "13", title: "Competitor Risk Detection", desc: "NLP on support tickets — flags mentions of competitors being evaluated ('looking at Competitors X, Y')", icon: "🎯" },
                { n: "14", title: "Monthly Auto-Retraining", desc: "Model automatically retrains on new churn data — champion-challenger promotes only if AUC improves", icon: "🔄" },
                { n: "15", title: "API Access", desc: "REST API with per-seat key management — integrate risk scores into your own BI tools and data warehouse", icon: "🔌" },
              ].map((f, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 16px", transition: "box-shadow 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(8,145,178,0.1)")}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 18 }}>{f.icon}</span>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#0891B2", fontVariantNumeric: "tabular-nums" }}>#{f.n}</span>
                        <h4 style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", margin: 0 }}>{f.title}</h4>
                      </div>
                      <p style={{ fontSize: 11.5, color: "#64748B", margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── TECH STACK ── */}
          <section id="stack" style={{ marginBottom: 60 }}>
            <SectionTitle emoji="🛠️" title="Tech Stack" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                {
                  category: "Backend", color: "#7C3AED",
                  items: ["Python 3.12", "FastAPI", "PostgreSQL (asyncpg)", "Redis", "Celery + Celery Beat", "Alembic (migrations)", "Pydantic v2"]
                },
                {
                  category: "Machine Learning", color: "#059669",
                  items: ["XGBoost", "SHAP (TreeExplainer)", "scikit-learn (SMOTE, Calibration)", "pandas + numpy", "Optuna (HPO)", "VADER (sentiment)", "Prophet (trend detection)"]
                },
                {
                  category: "Frontend", color: "#0891B2",
                  items: ["React 18 + TypeScript", "Vite", "TailwindCSS 3", "Recharts", "Framer Motion", "React Query v5", "Zustand"]
                },
                {
                  category: "Infrastructure", color: "#D97706",
                  items: ["Docker + docker-compose", "Railway (backend)", "Vercel (frontend)", "GitHub Actions CI/CD", "Nginx (reverse proxy)", "Prometheus + Grafana", "Sentry (error tracking)"]
                },
              ].map((s, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ background: s.color, padding: "10px 16px" }}>
                    <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fff" }}>{s.category}</h4>
                  </div>
                  <div style={{ padding: "12px 16px", display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {s.items.map((item, j) => (
                      <span key={j} style={{
                        background: "#F8FAFC", border: "1px solid #E2E8F0",
                        borderRadius: 6, padding: "3px 10px", fontSize: 12, color: "#334155"
                      }}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── FEASIBILITY / VIABILITY / IMPACT ── */}
          <section id="impact" style={{ marginBottom: 60 }}>
            <SectionTitle emoji="📊" title="Feasibility, Viability & Market Impact" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {[
                {
                  title: "Technical Feasibility", badge: "HIGH", badgeColor: "#059669", bg: "#F0FDF4", border: "#A7F3D0",
                  points: [
                    "All components are production-proven open-source libraries",
                    "XGBoost + SHAP: industry-standard, highly documented ML tools",
                    "FastAPI + PostgreSQL: handles 100K+ accounts at <100ms query time",
                    "Already deployed live on Vercel + Railway — proven in production",
                    "Docker-containerized: portable across any cloud provider",
                  ]
                },
                {
                  title: "Market Viability", badge: "STRONG", badgeColor: "#0891B2", bg: "#EFF6FF", border: "#BFDBFE",
                  points: [
                    "$2.3B churn management market growing at 25% CAGR",
                    "Every SaaS company with >200 customers is a potential buyer",
                    "$500–$5,000/month pricing — breakeven at just 3–5 customers",
                    "$10M ARR company: 1% churn reduction = $100K/month protected",
                    "No existing tool combines: prediction + explanation + automated action",
                  ]
                },
                {
                  title: "Impact & Uniqueness", badge: "DIFFERENTIATED", badgeColor: "#7C3AED", bg: "#FAF5FF", border: "#DDD6FE",
                  points: [
                    "Company-specific model — not generic industry averages",
                    "SHAP explainability makes AI decisions transparent for CS teams",
                    "Automated interventions — most tools only predict, don't act",
                    "Measurable revenue impact tracking per intervention",
                    "Replaces $12K–$22K per research cycle in manual analysis labor",
                  ]
                },
              ].map((s, i) => (
                <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: "16px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{s.title}</h4>
                    <span style={{
                      background: s.badgeColor, color: "#fff",
                      borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 700
                    }}>{s.badge}</span>
                  </div>
                  {s.points.map((p, j) => (
                    <div key={j} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                      <span style={{ color: s.badgeColor, fontWeight: 700, fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Revenue model */}
            <div style={{ marginTop: 20, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "20px 24px" }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 12 }}>💰 Revenue Model & Pricing</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                  { plan: "Starter", price: "$500/mo", accounts: "Up to 250 accounts", features: "Core prediction + daily digest" },
                  { plan: "Growth", price: "$2,000/mo", accounts: "Up to 2,000 accounts", features: "Automations + workflow builder" },
                  { plan: "Enterprise", price: "$5,000+/mo", accounts: "Unlimited accounts", features: "Custom model + API + SSO" },
                ].map((p, i) => (
                  <div key={i} style={{
                    background: i === 1 ? "#0891B2" : "#F8FAFC",
                    borderRadius: 10, padding: "16px", textAlign: "center",
                    border: i === 1 ? "none" : "1px solid #E2E8F0"
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: i === 1 ? "rgba(255,255,255,0.8)" : "#64748B", marginBottom: 4 }}>{p.plan}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: i === 1 ? "#fff" : "#0891B2", marginBottom: 4 }}>{p.price}</div>
                    <div style={{ fontSize: 11, color: i === 1 ? "rgba(255,255,255,0.85)" : "#475569", marginBottom: 4 }}>{p.accounts}</div>
                    <div style={{ fontSize: 11, color: i === 1 ? "rgba(255,255,255,0.7)" : "#64748B" }}>{p.features}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── AI PROMPTS ── */}
          <section id="prompts" style={{ marginBottom: 60 }}>
            <SectionTitle emoji="🤖" title="AI Build Prompts" />
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: "16px 20px", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0F172A" }}>Generate Entire Project</h3>
                <button onClick={copyMasterPrompt}
                  style={{ background: copiedKey === "master" ? "#059669" : "#0F172A", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "background 0.2s" }}>
                  {copiedKey === "master" ? "✓ Copied Copied!" : "✨ Copy Master Prompt (All-in-One)"}
                </button>
              </div>
              <p style={{ fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.6 }}>
                <strong>📋 How to use:</strong> Click the Master Prompt button to copy all 5 domains at once, or use the individual prompts below. Paste the prompt into Claude, GPT-4, Cursor, Replit, or any AI coding tool.
                Run them in order (Backend → Frontend → Database → ML Model → Deployment) to build the complete platform from scratch.
                Each prompt is self-contained and connects with the others — the API contracts match across all prompts.
              </p>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {[
                { key: "backend", icon: "🐍", label: "Backend Prompt", sub: "Python · FastAPI · PostgreSQL · Celery · Redis", color: "#7C3AED", desc: "Complete FastAPI backend with 5 agent workers, all integration connectors, ML pipeline wiring, Redis task queue, Docker deployment, and 100% test coverage." },
                { key: "frontend", icon: "⚛️", label: "Frontend Prompt", sub: "React 18 · TypeScript · TailwindCSS · Recharts", color: "#0891B2", desc: "7-page React dashboard: accounts table with SHAP waterfall charts, workflow builder, cohort heatmap, revenue intelligence, and all API integrations wired to backend." },
                { key: "database", icon: "🗄️", label: "Database Prompt", sub: "PostgreSQL · Alembic · Indexes · Functions · Seed", color: "#059669", desc: "Complete schema (11 tables), Alembic migrations, performance indexes, 5 SQL functions, cohort retention matrix view, and realistic 500-account seed data." },
                { key: "mlModel", icon: "🧠", label: "ML Model Prompt", sub: "XGBoost · SHAP · Optuna · scikit-learn · MLflow", color: "#D97706", desc: "Full ML pipeline: 150+ feature engineering, Optuna HPO, isotonic calibration, SHAP TreeExplainer, drift detection, champion-challenger retraining, and Jupyter analysis notebook." },
                { key: "deployment", icon: "🚀", label: "Deployment Prompt", sub: "Docker · Railway · GitHub Actions · Nginx · Monitoring", color: "#DC2626", desc: "Complete deployment stack: multi-stage Dockerfile, docker-compose, Railway config, GitHub Actions CI/CD, Nginx rate-limiting, Prometheus alerts, and S3 backup scripts." },
              ].map(p => (
                <div key={p.key} style={{
                  background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden",
                  boxShadow: activePrompt === p.key ? "0 4px 20px rgba(0,0,0,0.08)" : "none"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ background: p.color + "15", border: `1px solid ${p.color}30`, borderRadius: 10, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{p.icon}</div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{p.label}</h4>
                          <span style={{ fontSize: 10, background: p.color, color: "#fff", borderRadius: 20, padding: "1px 8px", fontWeight: 600 }}>COPY</span>
                        </div>
                        <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748B" }}>{p.sub}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setActivePrompt(activePrompt === p.key ? null : p.key)}
                        style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, padding: "6px 14px", fontSize: 12, color: "#475569", cursor: "pointer" }}>
                        {activePrompt === p.key ? "▲ Hide Info" : "▼ About"}
                      </button>
                      <button onClick={() => copyPrompt(p.key)}
                        style={{
                          background: copiedKey === p.key ? "#059669" : p.color, color: "#fff",
                          border: "none", borderRadius: 8, padding: "6px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                          transition: "background 0.2s"
                        }}>
                        {copiedKey === p.key ? "✓ Copied!" : "⎘ Copy Prompt"}
                      </button>
                    </div>
                  </div>
                  {activePrompt === p.key && (
                    <div style={{ background: "#FFFBEB", borderTop: "1px solid #FDE68A", padding: "12px 20px" }}>
                      <p style={{ margin: 0, fontSize: 13, color: "#78350F", lineHeight: 1.6 }}>
                        <strong>What this builds:</strong> {p.desc}
                      </p>
                      <p style={{ margin: "8px 0 0", fontSize: 12, color: "#92400E" }}>
                        ⚡ Prompt is 4,000–6,000 tokens. Paste directly into Claude Opus, GPT-4o, Cursor, or Replit. The AI will generate production-ready, fully functional code — no placeholders.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Credits placeholder */}
            <div style={{ marginTop: 16, background: "#F0F9FF", border: "1px dashed #BAE6FD", borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 12, color: "#0C4A6E" }}>
                🔒 <strong>Coming soon:</strong> Credit-based prompt access — visitors get 10 credits/month. Each project unlock costs 5 credits. Original owner gets unlimited access.
              </p>
            </div>
          </section>

          {/* ── DOWNLOADS ── */}
          <section id="downloads" style={{ marginBottom: 60 }}>
            <SectionTitle emoji="📥" title="Downloads & Exports" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              {[
                {
                  icon: "📄", label: "PDF Report", sub: "Full portfolio document", color: "#DC2626",
                  action: downloadPDF, status: downloadStatus
                },
                {
                  icon: "📊", label: "PPT Deck", sub: "Presentation slides", color: "#D97706",
                  action: () => alert("PPT export coming soon! The slide deck will include architecture diagrams, market data, and technical deep-dives."),
                },
                {
                  icon: "📝", label: "Script", sub: "Presentation script", color: "#059669",
                  action: () => {
                    const script = `ChurnPredictor / RetainIQ — Presentation Script

[OPENING — 30 seconds]
"Good [morning/afternoon]. I'm Anshul Rathod, and what I'm about to show you solves a problem that kills most SaaS companies — customer churn.

[THE PROBLEM — 60 seconds]
Every subscription business loses customers. But here's the painful truth: most churn is completely preventable. Customers don't cancel without warning — they stop using your product weeks before they cancel. They fail payments. Their champion employee leaves. These signals exist in your data right now. But your team isn't watching all 150 of them simultaneously, for all 500 customers, every single day.

[THE SOLUTION — 90 seconds]
RetainIQ — what I've built — connects to your existing stack in under 30 minutes. Mixpanel, Stripe, Salesforce, Intercom — whatever you use. It builds a machine learning model trained specifically on your customers, your churn patterns. Every morning, your customer success team gets an email: these 10 accounts are about to cancel — here's exactly why, here's what to say. And for accounts that can't wait for human outreach, the system automatically sends the right message at the right time.

[THE IMPACT — 45 seconds]
This isn't theoretical. For a company doing $10M ARR, reducing churn by just 1% is $100,000 per month in protected revenue. The math makes the subscription cost irrelevant. That's the value proposition.

[LIVE DEMO — 2 minutes]
Let me show you the live platform at customer-churn-predictor-eta.vercel.app
[Navigate: Dashboard → At-risk accounts → Account detail with SHAP explanation → Workflow builder → Revenue impact dashboard]

[TECHNICAL DEPTH — if asked]
The model uses XGBoost with 150+ behavioral features. SHAP explainability means every prediction is transparent — 'this customer is at 73% churn risk because login frequency dropped 80% in 30 days.' Monthly auto-retraining adapts to your evolving customer behavior.

[CLOSING]
If you work with or know any SaaS company losing customers they could have kept — that's RetainIQ's market. Thank you."`;
                    navigator.clipboard.writeText(script);
                    alert("Presentation script copied to clipboard! ✓");
                  }
                },
                {
                  icon: "🌐", label: "Live Website", sub: "customer-churn-predictor-eta.vercel.app", color: "#0891B2",
                  action: () => window.open("https://customer-churn-predictor-eta.vercel.app/", "_blank")
                },
              ].map((d, i) => (
                <button key={i} onClick={d.action}
                  style={{
                    background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12,
                    padding: "20px 16px", textAlign: "center", cursor: "pointer",
                    transition: "all 0.2s", display: "block", width: "100%"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = d.color; e.currentTarget.style.boxShadow = `0 4px 16px ${d.color}20`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{d.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{d.label}</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>{d.status || d.sub}</div>
                </button>
              ))}
            </div>
          </section>

          {/* ── COMMENTS ── */}
          <section id="comments" style={{ marginBottom: 60 }}>
            <SectionTitle emoji="💬" title={`Comments (${comments.length})`} />
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "#0F172A" }}>Leave a comment</h4>
              <input
                value={newComment.name}
                onChange={e => setNewComment(p => ({ ...p, name: e.target.value }))}
                placeholder="Your name"
                style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: 8, padding: "9px 12px", fontSize: 13, marginBottom: 8, outline: "none", boxSizing: "border-box" }}
              />
              <textarea
                value={newComment.message}
                onChange={e => setNewComment(p => ({ ...p, message: e.target.value }))}
                placeholder="Your thoughts on this project…"
                rows={3}
                style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: 8, padding: "9px 12px", fontSize: 13, marginBottom: 10, outline: "none", resize: "vertical", boxSizing: "border-box" }}
              />
              <button onClick={addComment}
                style={{ background: "#0891B2", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Post Comment
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {comments.map(c => (
                <div key={c.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 18px", display: "flex", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", background: "#0891B2",
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, flexShrink: 0
                  }}>{c.avatar}</div>
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

      {/* ── FOOTER ── */}
      <footer style={{
        background: "#0F172A", color: "#94A3B8",
        padding: "40px 48px", textAlign: "center"
      }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#0891B2", marginBottom: 8 }}>ChurnPredictor / RetainIQ</div>
        <p style={{ fontSize: 13, marginBottom: 16, color: "#64748B" }}>
          AI-Powered Customer Revenue Intelligence & Retention Platform — Project #16 of 75
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
          <a href="https://customer-churn-predictor-eta.vercel.app/" target="_blank" rel="noopener" style={{ color: "#0891B2", fontSize: 13 }}>🌐 Live Platform</a>
          <a href="https://github.com/Anshul-777/Customer-Churn-Predictor" target="_blank" rel="noopener" style={{ color: "#0891B2", fontSize: 13 }}>⌥ GitHub</a>
          <a href="https://www.linkedin.com/in/anshul-rathod777" target="_blank" rel="noopener" style={{ color: "#0891B2", fontSize: 13 }}>in LinkedIn</a>
        </div>
        <div style={{ fontSize: 11, color: "#475569" }}>
          Built by Anshul Rathod · Available for freelance · All code original · © 2025
        </div>
      </footer>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   HELPER COMPONENTS
──────────────────────────────────────────────────────────  */
function SectionTitle({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <span style={{ fontSize: 20 }}>{emoji}</span>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0F172A" }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: "#E2E8F0", marginLeft: 8 }} />
    </div>
  );
}

function InfoCard({ title, value, link }: { title: string; value: string; link?: string }) {
  return (
    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "12px 16px" }}>
      <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{title}</div>
      {link ? (
        <a href={link} target="_blank" rel="noopener" style={{ fontSize: 13, color: "#0891B2", fontWeight: 600, textDecoration: "none" }}>{value} ↗</a>
      ) : (
        <div style={{ fontSize: 13, color: "#0F172A", fontWeight: 600 }}>{value}</div>
      )}
    </div>
  );
}

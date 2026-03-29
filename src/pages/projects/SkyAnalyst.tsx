import { useState, useEffect } from "react";

// ──────────────────────────────────────────────────────────
//  PROJECT #11 — SkyAnalyst
//  Satellite Imagery Intelligence Platform for Asset Monitoring
//  Author : Anshul Rathod  |  Rank: #11 of 75
// ──────────────────────────────────────────────────────────

const PROMPTS = {
  backend: `You are a senior Python geospatial ML engineer. Build the complete, production-ready FastAPI backend for "SkyAnalyst" — an automated satellite imagery intelligence platform that monitors physical assets globally.

STACK: Python 3.12, FastAPI, PostgreSQL + PostGIS, Redis, Celery, PyTorch 2.2, GDAL, rasterio, shapely, geopandas, py6S, s2cloudless, Pydantic v2, Docker, Planet Labs API SDK, Sentinel Hub API.

ARCHITECTURE — all files complete:

1. /app/main.py — FastAPI: CORS, JWT auth, Prometheus metrics, startup validates Planet Labs API key, initializes PostGIS extensions, validates model checkpoints.

2. /app/routers/aoi.py — AOI management:
   POST /api/aoi — create from GeoJSON polygon. Validate geometry (max 10,000 km²). Set monitoring tasks (vehicles/oil_tanks/agriculture/ships/construction/change_detection). Schedule: daily/weekly/on_change. Store in PostGIS geometry column.
   GET /api/aoi — list all AOIs with latest metrics snapshot.
   PATCH /api/aoi/{id} — update monitoring config.
   DELETE /api/aoi/{id} — deactivate.

3. /app/routers/intelligence.py:
   GET /api/aoi/{id}/timeseries — time-series metrics with date range filter.
   GET /api/aoi/{id}/report/{date} — full intelligence report for specific date.
   GET /api/aoi/{id}/alerts — change detection alerts (metric changed > threshold% from baseline).
   GET /api/aoi/{id}/comparison — side-by-side two-date comparison.

4. /app/services/imagery_acquisition.py — ImageryAcquisitionService:
   schedule_acquisition(aoi_id, date): determines optimal source — SPOT (1.5m) > Planet (3m) > Sentinel-2 (10m), based on cloud cover, cost, revisit time.
   fetch_planet_imagery(aoi_bbox, date_range): Planet Labs Python SDK — order + download GeoTIFF.
   fetch_sentinel2(aoi_bbox, date_range): Sentinel Hub API — Level-2A surface reflectance.
   select_best_imagery(candidates): ranks by cloud cover %, selects least-cloudy within ±3 days.

5. /app/services/preprocessing.py — ImagePreprocessingPipeline:
   atmospheric_correction(raw_tif, metadata): py6S radiative transfer for Sentinel-2.
   cloud_mask(image_array, source): s2cloudless for Sentinel-2; threshold-based for Planet.
   orthorectify(image_array, dem_data): terrain distortion removal using SRTM DEM.
   tile_image(image_array, tile_size=512, overlap=64): divide large AOI for inference.

6. /app/models/ — 6 inference modules:

   vehicle_detector.py: RetinaNet (ResNet-50 FPN) fine-tuned on xView. 5 classes: car/truck/semi/construction_equipment/aircraft. Confidence threshold 0.4. Output: VehicleReport(count, by_class, confidence_mean, geojson_features).

   oil_tank_analyzer.py: Faster R-CNN detects floating-roof tanks. Shadow analysis: fill_percent = 1 - (shadow_length_px / tank_height_max_px). Tank database JSON: known refinery locations with diameter + capacity. Output: OilTankReport(tanks_detected, fill_levels_pct, estimated_volume_barrels, change_from_last).

   agricultural_analyzer.py: Computes NDVI=(NIR-RED)/(NIR+RED), EVI=2.5*(NIR-RED)/(NIR+6*RED-7.5*BLUE+1), NDWI=(GREEN-NIR)/(GREEN+NIR). Crop type: 1D-CNN on NDVI time-series. Yield: XGBoost (NDVI_peak, EVI_mean, precipitation, soil_type → kg/ha). Phenological stage: planting/vegetative/heading/maturity/harvest. Output: AgriculturalReport.

   ship_detector.py: Dual-modality: optical RetinaNet + SAR Sentinel-1. Classification: hull geometry → Random Forest (tanker/container/bulk/warship/small). AIS correlation: match detected position to aisstream.io within 500m. Output: ShipReport(count, by_class, identified_ships, traffic_volume_dwt).

   construction_monitor.py: Siamese CNN change detection. Equipment YOLO: crane/excavator/concrete_mixer. Volume estimation from shadow. Output: ConstructionReport(change_area_m2, equipment_count, activity_type).

   change_detector.py: SegFormer-B2 semantic segmentation on image pairs. 8 change types: built-up/deforestation/flood/fire/agriculture/industrial/water/other. Output: ChangeDetectionReport(changed_area_m2, type_distribution, heatmap_path).

7. /app/services/report_generator.py: GPT-4o generates plain-English narrative for each report. Alert generation when metric changes > threshold.

8. /app/workers/ — Celery: daily imagery scheduler beat task, inference worker.

9. PostGIS SQLAlchemy models: Organization, User, AreaOfInterest (Geometry POLYGON 4326), MonitoringTask, ImageryRecord, IntelligenceReport (JSONB), AlertConfig, AlertHistory.

10. /tests/ — mock APIs, unit tests per inference module with numpy synthetic imagery, API endpoint tests.

All checkpoints from /models/. Full type annotations. Error handling: cloud cover too high (fallback to older clear), API quota exceeded (fallback Sentinel-2), checkpoint missing (graceful error).`,

  frontend: `You are a senior React/TypeScript geospatial engineer. Build the complete frontend for "SkyAnalyst" — satellite imagery intelligence platform.

STACK: React 18, TypeScript 5, Vite, TailwindCSS 3, Mapbox GL JS v3, Recharts, Framer Motion, React Query v5, Zustand, Lucide React, DM Sans font (Google Fonts).

DESIGN: Dark satellite aesthetic. Background #0F172A, cards #1E293B, borders #334155, text #F1F5F9, accent #0891B2 (cyan), alerts #EF4444, positive #22C55E.

BUILD COMPLETELY:

1. /src/pages/Dashboard.tsx — Full-width Mapbox satellite map as background. AOI polygons color-coded by type (cyan=vehicles, orange=oil, green=agriculture, blue=ships, red=construction). Hover polygon → popup with latest metrics. Left panel: AOI list + alert badges. Top KPIs: AOIs monitored, alerts this week, data coverage %, next acquisition.

2. /src/pages/AOIDetail.tsx — Tabs: Overview | Timeseries | Intelligence | Alerts | Raw Imagery.
   Overview: split — Mapbox map with asset detection markers + intelligence report panel.
   Timeseries: Recharts charts per metric (vehicle counts, oil fill %, NDVI over time). Date range selector.
   Alerts tab: historical alert log with severity colors.

3. /src/pages/NewAOI.tsx — 5-step wizard: Draw polygon on Mapbox (mapbox-gl-draw). Select intelligence modules. Schedule. Imagery source. Review + submit.

4. /src/pages/MarketIntelligence.tsx — Aggregated global heatmap. Commodity correlation charts (oil tanks vs. WTI). Ship traffic arc animations. Export to CSV/Bloomberg format.

5. /src/pages/Settings.tsx — API keys (Planet Labs, Mapbox), alert thresholds, team management, billing.

6. /src/components/map/MapboxAOIMap.tsx — Full Mapbox component. AOI polygons + detection markers (clustered). Draw mode for creation. Intelligence overlay layers.

7. /src/components/intelligence/ — IntelligenceCard.tsx, MetricTimeseries.tsx, OilTankGauge.tsx (animated 0–100% fill SVG), NDVIChart.tsx (color gradient timeline), ShipTrafficMap.tsx.

8. /src/hooks/useAOIStream.ts — WebSocket hook for live imagery processing status.

All TypeScript typed. React Query for API calls. Error boundaries. Loading skeletons.`,

  mlPipeline: `You are a computer vision researcher. Build the complete ML training pipeline for "SkyAnalyst."

DELIVERABLES — all code complete:

1. /ml/datasets/dataset_builder.py — Dataset preparation:
   VEHICLE: xView dataset (800K objects → 5 classes). Geographic split (not random) to prevent data leakage.
   AGRICULTURE: BreizhCrops Sentinel-2 time-series. NDVI per field, 52-week normalization, missing value interpolation.
   SHIP: SAR-Ship (43,819 labeled) + HRSC2016 optical. Augment: 0–360° rotation, flip, brightness jitter.
   CHANGE: LEVIR-CD (637 image pairs). City-split to prevent leakage.

2. /ml/train/train_vehicle_detector.py — RetinaNet:
   Backbone: ResNet-50 FPN (ImageNet pretrained). Loss: Focal (γ=2.0, α=0.25).
   Optimizer: AdamW lr=1e-4. Scheduler: CosineAnnealingLR. 50 epochs, batch=8.
   Augmentations (albumentations): RandomRotate90, HorizontalFlip, ColorJitter, RandomCrop(512), Normalize.
   Target: mAP@0.5 > 0.82. Checkpoint + metrics JSON saved.

3. /ml/train/train_crop_classifier.py — 1D-CNN:
   Input: (52 timesteps × 4 bands). Conv1D(64,k=5)→BN→ReLU→MaxPool→Conv1D(128,k=3)→BN→ReLU→GAP→Dense(256)→Dropout(0.3)→Dense(n_classes). 30 epochs, AdamW, CrossEntropy with class weights. Target: >88%.

4. /ml/train/train_change_detector.py — Siamese SegFormer-B2:
   Shared encoder. Difference module → binary change mask. Loss: BCE + Dice. 40 epochs. Target: IoU >0.75.

5. /ml/inference/batch_inference.py — load all 6 checkpoints, tile routing, tile stitching with overlap NMS.

6. /ml/evaluation/evaluate_all.py — per-model metrics, confusion matrices, calibration curves, HTML report.

7. /ml/utils/geospatial.py — shadow_length_to_fill_percent(shadow_px, tank_diameter_m, solar_elevation_deg), ndvi_to_health_label(), pixel_to_latlon(), calculate_area_m2().

8. /notebooks/ — 5 Jupyter notebooks: data exploration, vehicle detection demo, NDVI analysis, change detection comparison, oil tank shadow geometry validation.

All training code complete. albumentations + torchvision + GDAL. requirements.txt with pinned versions. GPU + CPU support.`,

  database: `You are a PostgreSQL + PostGIS architect. Complete geospatial database for "SkyAnalyst."

EXTENSIONS: postgis, postgis_raster, pg_trgm, timescaledb (or manual partitioning).

TABLES (write full CREATE TABLE SQL):

organizations: id UUID PK, name, imagery_budget_usd_monthly, planet_api_key ENCRYPTED, settings JSONB, created_at

areas_of_interest: id UUID PK, org_id FK, name, description, geometry GEOMETRY(POLYGON,4326), area_km2 NUMERIC (computed trigger), monitoring_tasks TEXT[], schedule TEXT, imagery_preference TEXT, cloud_cover_max_pct SMALLINT DEFAULT 20, is_active BOOL, created_at, updated_at

imagery_records: id UUID PK, aoi_id FK, source TEXT(planet/sentinel2/spot), acquisition_date DATE, cloud_cover_pct NUMERIC 5,2, resolution_m NUMERIC 4,2, bands_available TEXT[], file_path TEXT, bbox GEOMETRY(POLYGON,4326), file_size_mb NUMERIC, processing_status TEXT, acquired_at TIMESTAMPTZ

intelligence_reports: id UUID PK, aoi_id FK, imagery_id FK, report_date DATE, task_type TEXT, metrics JSONB, narrated_summary TEXT, confidence_score NUMERIC 3,2, model_version TEXT, created_at. PARTITION by report_date (monthly).

asset_detections: id UUID PK, report_id FK, asset_type TEXT, location GEOMETRY(POINT,4326), bounding_box GEOMETRY(POLYGON,4326), confidence NUMERIC, classification TEXT, metadata JSONB, detected_at

alert_configs: id UUID PK, aoi_id FK, task_type, metric_name, threshold_pct_change NUMERIC, direction TEXT, notification_channels JSONB, is_active

alert_history: id UUID PK, alert_config_id FK, triggered_at, metric_name, baseline_value NUMERIC, current_value NUMERIC, pct_change NUMERIC, severity TEXT, acknowledged_by, acknowledged_at

INDEXES:
areas_of_interest: GIST on geometry
asset_detections: GIST on location, GIST on bounding_box
imagery_records: GIST on bbox
intelligence_reports: (aoi_id, task_type, report_date DESC), BRIN on created_at

VIEWS: latest_intelligence (most recent per aoi+task), aoi_dashboard_summary (all tasks + latest metrics + 7d change), active_alerts.

FUNCTIONS:
get_timeseries(aoi_id UUID, task_type TEXT, metric_name TEXT, date_from DATE, date_to DATE) RETURNS TABLE(date DATE, value NUMERIC)
detect_anomalies(aoi_id UUID, task_type TEXT, zscore_threshold NUMERIC DEFAULT 2.5) RETURNS TABLE

SEED: 3 orgs, 10 AOIs (Rotterdam port, Cushing OK oil hub, Iowa cornfields, Singapore Strait, Dubai construction, Shanghai auto factory, Brazilian soy farm, Texas refinery, Mumbai port, North Sea oil field), 90 days of reports per AOI.`
};

interface Comment { id: number; name: string; message: string; timestamp: string; avatar: string; }

export default function SkyAnalyst() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, name: "Vikram Singh", message: "The oil tank fill estimation from shadow analysis is genuinely brilliant — this is how hedge funds have been getting alpha for years. Making it accessible to mid-market teams is the key insight here.", timestamp: "4 days ago", avatar: "VS" },
    { id: 2, name: "Lena Hoffmann", message: "Supply chain teams would pay significant money for the ship traffic monitoring alone. We spend $50K/year on less granular data from our current provider.", timestamp: "1 week ago", avatar: "LH" },
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
      const INDIGO = [63, 81, 181] as [number, number, number];
      const DARK = [15, 23, 42] as [number, number, number];
      const GRAY = [100, 116, 139] as [number, number, number];
      const W = 210, pad = 18;
      let y = 0;
      const addPage = () => { doc.addPage(); y = 24; };
      const checkY = (n: number) => { if (y + n > 275) addPage(); };
      const section = (t: string, e: string) => {
        checkY(16); doc.setFillColor(...INDIGO); doc.rect(pad - 3, y - 5, 4, 10, "F");
        doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.setTextColor(...DARK);
        doc.text(`${e}  ${t}`, pad + 4, y + 2); y += 12;
      };
      const body = (t: string) => {
        doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(51, 65, 85);
        const l = doc.splitTextToSize(t, W - pad * 2); checkY(l.length * 5 + 3);
        doc.text(l, pad, y); y += l.length * 5 + 3;
      };
      const bullet = (t: string) => {
        checkY(8); doc.setFillColor(...INDIGO); doc.circle(pad + 2, y - 1, 1.2, "F");
        doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(51, 65, 85);
        const l = doc.splitTextToSize(t, W - pad * 2 - 8); doc.text(l, pad + 6, y);
        y += l.length * 5 + 2;
      };
      // Cover
      doc.setFillColor(...INDIGO); doc.rect(0, 0, W, 58, "F");
      doc.setFillColor(26, 35, 126); doc.rect(0, 53, W, 8, "F");
      doc.setTextColor(255, 255, 255); doc.setFontSize(22); doc.setFont("helvetica", "bold");
      doc.text("SKYANALYST", pad, 26);
      doc.setFontSize(11); doc.setFont("helvetica", "normal");
      doc.text("Satellite Imagery Intelligence Platform for Asset Monitoring", pad, 38);
      doc.setFontSize(9); doc.text("Project #11  ·  Computer Vision / Geospatial AI  ·  Rank 11 of 75  ·  EXTREME", pad, 49);
      doc.setFillColor(248, 250, 252); doc.rect(0, 61, W, 20, "F");
      doc.setTextColor(...DARK); doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.text("Anshul Rathod", pad, 71);
      doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(...GRAY);
      doc.text("linkedin.com/in/anshul-rathod777  ·  github.com/Anshul-777/SkyAnalyst", pad, 78);
      y = 95;
      const stats = [{ label: "Market Size", value: "$1B+" }, { label: "Cost Savings vs. Orbital Insight", value: "80-90%" }, { label: "Intelligence Domains", value: "6" }, { label: "Report Latency", value: "< 10 min" }];
      stats.forEach((s, i) => {
        const x = pad + i * 43.5;
        doc.setFillColor(240, 245, 255); doc.roundedRect(x, y, 41, 20, 2, 2, "F");
        doc.setFillColor(...INDIGO); doc.roundedRect(x, y, 41, 4, 2, 2, "F");
        doc.rect(x, y + 2, 41, 2, "F");
        doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(...DARK); doc.text(s.value, x + 20.5, y + 14, { align: "center" });
        doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(...GRAY); doc.text(s.label, x + 20.5, y + 19, { align: "center" });
      });
      y += 28;
      section("Overview", "📡");
      body("SkyAnalyst is an automated satellite imagery analysis platform for global physical asset monitoring. Users define Areas of Interest (AOIs) on an interactive map; the platform automatically acquires commercial satellite imagery (Planet Labs, Sentinel-2, SPOT), runs 6 domain-specific deep learning models, and delivers structured intelligence reports with time-series metrics — providing ground-truth data 30–90 days before official statistics reach the market.");
      section("Problem Statement", "🔴");
      bullet("Physical world data is the most valuable form of market intelligence — actual goods stored, produced, transported");
      bullet("Traditional sources are delayed 30–90 days and subject to manipulation by reporting entities");
      bullet("Existing providers (Planet Labs, Orbital Insight) charge $50K–$500K/year; require specialized geospatial analysts");
      bullet("Oil tank fill levels, crop yield forecasts, ship traffic — this intelligence drives billion-dollar trading decisions");
      bullet("Information asymmetry: hedge funds and sovereign wealth funds have this data; mid-market teams do not");
      section("Six Intelligence Domains", "🛰️");
      bullet("Vehicle Detection: RetinaNet counts cars/trucks/equipment in factory lots and ports — proxy for economic activity");
      bullet("Oil Tank Volume: Shadow analysis estimates fill level from floating-roof tanks — real inventory before EIA reports");
      bullet("Agricultural Intelligence: NDVI multi-spectral indices estimate crop yield 3 months before harvest");
      bullet("Maritime Monitoring: Ship detection and AIS correlation — global trade flow visibility at Strait of Malacca, Suez Canal");
      bullet("Construction Monitoring: Change detection tracks development projects, equipment presence, completion progress");
      bullet("General Change Detection: SegFormer semantic segmentation detects any significant land-use change globally");
      section("Core Architecture", "⚙️");
      bullet("Imagery Acquisition: Optimal source selection (SPOT > Planet > Sentinel-2) based on cloud cover, cost, resolution need");
      bullet("Preprocessing Pipeline: Atmospheric correction (py6S), cloud masking (s2cloudless), orthorectification, tiling (512×512)");
      bullet("6 PyTorch Models: RetinaNet, shadow geometry engine, 1D-CNN crop classifier, XGBoost yield, Siamese SegFormer, dual-modal ship detector");
      bullet("PostGIS Storage: Geospatial PostgreSQL with GIST indexes on all geometry columns for spatial queries");
      bullet("GPT-4o Narration: Plain-English intelligence report generated from structured metrics per report");
      bullet("Alert Engine: Metric change > configured threshold triggers email/Slack notification with context");
      section("Tech Stack", "🛠️");
      const stk = [
        { c: "Geospatial", v: "GDAL, rasterio, shapely, geopandas, pyproj, PostGIS, py6S, s2cloudless" },
        { c: "ML / CV", v: "PyTorch 2.2, torchvision, albumentations, XGBoost, SegFormer (HuggingFace)" },
        { c: "Backend", v: "Python 3.12, FastAPI, PostgreSQL + PostGIS, Redis, Celery, Alembic" },
        { c: "Satellite Data", v: "Planet Labs API SDK, Sentinel Hub API, Sentinel-1 SAR, SRTM DEM, aisstream.io AIS" },
        { c: "Frontend", v: "React 18, TypeScript, Mapbox GL JS v3, Recharts, Framer Motion, Vite" },
      ];
      stk.forEach(s => {
        checkY(8); doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(...INDIGO);
        doc.text(`${s.c}: `, pad + 6, y);
        const w = doc.getTextWidth(`${s.c}: `);
        doc.setFont("helvetica", "normal"); doc.setTextColor(51, 65, 85);
        const l = doc.splitTextToSize(s.v, W - pad * 2 - 6 - w);
        doc.text(l, pad + 6 + w, y); y += l.length * 5 + 3;
      });
      section("Market & Impact", "🚀");
      bullet("$50K–$5K/month pricing — 10–20% of existing enterprise provider cost");
      bullet("For a commodities trader: single correct crude oil position informed by tank data = $500K–$5M return");
      bullet("Subscription cost is trivially small vs. intelligence value — asymmetric ROI");
      bullet("Target: 5,000+ hedge funds, commodities traders, supply chain teams, insurance companies globally");
      bullet("$1B+ addressable market; existing provider revenue validates willingness to pay");
      section("Links", "🔗");
      doc.setFontSize(9); doc.setTextColor(...INDIGO);
      doc.text("GitHub:  github.com/Anshul-777/SkyAnalyst", pad + 6, y); y += 7;
      doc.text("LinkedIn:  linkedin.com/in/anshul-rathod777", pad + 6, y);
      const tp = doc.getNumberOfPages();
      for (let i = 1; i <= tp; i++) {
        doc.setPage(i); doc.setFillColor(248, 250, 252); doc.rect(0, 285, W, 12, "F");
        doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...GRAY);
        doc.text("© 2025 Anshul Rathod · SkyAnalyst — Project #11 · All rights reserved", W / 2, 292, { align: "center" });
        doc.text(`Page ${i} of ${tp}`, W - pad, 292, { align: "right" });
      }
      doc.save("SkyAnalyst_Portfolio_AnshulRathod.pdf");
      setDlStatus("Downloaded ✓");
    } catch { window.print(); setDlStatus("Print dialog opened"); }
    setTimeout(() => setDlStatus(null), 3000);
  };

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const ACCENT = "#3F51B5";

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FFFFFF", color: "#0F172A" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid #E2E8F0", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="../index.html" style={{ color: "#64748B", fontSize: 13, textDecoration: "none" }}>← Anshul's Projects</a>
          <span style={{ color: "#CBD5E1" }}>|</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT }}>Project #11</span>
          <span style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>EXTREME</span>
          <span style={{ background: `${ACCENT}15`, color: ACCENT, border: `1px solid ${ACCENT}30`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>Computer Vision · Geospatial AI</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a href="https://github.com/Anshul-777/SkyAnalyst" target="_blank" rel="noopener" style={{ background: "#0F172A", color: "#fff", padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>⌥ GitHub</a>
          <a href="https://www.linkedin.com/in/anshul-rathod777" target="_blank" rel="noopener" style={{ background: "#0A66C2", color: "#fff", padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>in</a>
        </div>
      </nav>

      {/* HERO — satellite imagery aesthetic */}
      <section style={{
        minHeight: 540, position: "relative", overflow: "hidden",
        background: "linear-gradient(160deg, #0B1120 0%, #0D1B2A 30%, #1B2A4A 60%, #0A0F1E 100%)",
        display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 48px 60px"
      }}>
        {/* Satellite grid overlay */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs><pattern id="grid" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M5,0 L0,0 L0,5" fill="none" stroke="white" strokeWidth="0.2" /></pattern></defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
        {/* Decorative AOI polygons */}
        <svg style={{ position: "absolute", right: 0, top: 0, width: "45%", height: "100%", opacity: 0.12, pointerEvents: "none" }} viewBox="0 0 400 400">
          <polygon points="50,80 200,20 350,100 300,280 100,260" fill="none" stroke="#0891B2" strokeWidth="1" strokeDasharray="4,4" />
          <polygon points="150,160 280,120 320,220 200,280 120,240" fill="none" stroke="#3F51B5" strokeWidth="1" strokeDasharray="4,4" />
          <circle cx="200" cy="150" r="4" fill="#0891B2" opacity="0.6" />
          <circle cx="280" cy="180" r="3" fill="#22C55E" opacity="0.6" />
          <circle cx="150" cy="220" r="3" fill="#F59E0B" opacity="0.6" />
        </svg>

        <div style={{ position: "relative", maxWidth: 820 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {["#11", "Geospatial AI", "Computer Vision", "6 Intelligence Domains", "EXTREME"].map((t, i) => (
              <span key={i} style={{ background: i === 4 ? "rgba(253,230,138,0.15)" : "rgba(255,255,255,0.08)", border: `1px solid ${i === 4 ? "rgba(253,230,138,0.3)" : "rgba(255,255,255,0.12)"}`, color: i === 4 ? "#FDE68A" : "rgba(255,255,255,0.82)", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 600 }}>{t}</span>
            ))}
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4.5vw, 54px)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.08, marginBottom: 14, letterSpacing: -1.5 }}>
            SkyAnalyst
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", fontWeight: 300, marginBottom: 8 }}>Satellite Imagery Intelligence Platform for Asset Monitoring</p>
          <p style={{ fontSize: 14, color: "rgba(147,197,253,0.9)", marginBottom: 28, lineHeight: 1.7, maxWidth: 640 }}>
            6 deep learning models monitor global physical assets from commercial satellite imagery —
            oil tank fill levels, vehicle counts, crop yields, ship traffic — delivering intelligence
            that moves markets <strong style={{ color: "#67E8F9" }}>30–90 days before official data</strong>.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("architecture")} style={{ background: "#3F51B5", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>See Architecture ↓</button>
            <button onClick={downloadPDF} style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", padding: "12px 24px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>{dlStatus || "⬇ PDF Report"}</button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {[
            { num: "6", label: "Intelligence Domains", icon: "🛰️" },
            { num: "$50K–$5K", label: "Cost vs. Competitors", icon: "💰" },
            { num: "1.5m–10m", label: "Imagery Resolution", icon: "🔭" },
            { num: "$1B+", label: "Addressable Market", icon: "📈" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "28px 24px", textAlign: "center", borderRight: i < 3 ? "1px solid #E2E8F0" : "none" }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: ACCENT }}>{s.num}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTENT */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <main style={{ padding: "48px 0 80px" }}>

          {/* OVERVIEW */}
          <section id="overview" style={{ marginBottom: 60 }}>
            <SH emoji="📡" title="Project Overview" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <IC title="Domain" value="Computer Vision · Geospatial AI · Remote Sensing" />
              <IC title="Rank" value="#11 of 75 projects" />
              <IC title="Data Sources" value="Planet Labs · Sentinel-2 · SPOT · Sentinel-1 SAR · AIS" />
              <IC title="GitHub" value="github.com/Anshul-777/SkyAnalyst" link="https://github.com/Anshul-777/SkyAnalyst" ac={ACCENT} />
            </div>
            <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: "18px 22px" }}>
              <p style={{ fontSize: 14, color: "#1E3A5F", lineHeight: 1.8, margin: 0 }}>
                <strong>Core Concept:</strong> A satellite imagery analysis platform where users define Areas of Interest (AOIs) and monitoring tasks. The platform automatically schedules imagery acquisition from commercial providers, runs domain-specific deep learning models on every new image, and delivers structured intelligence reports with time-series charts. Six intelligence modules cover: vehicle detection, oil tank volume estimation, agricultural crop analysis, maritime ship monitoring, construction activity tracking, and general change detection.
              </p>
            </div>
          </section>

          {/* PROBLEM */}
          <section id="problem" style={{ marginBottom: 60 }}>
            <SH emoji="🔴" title="Problem Statement" />
            <div style={{ background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "#1A202C", margin: 0 }}>
                <strong>Information asymmetry</strong> is the foundation of profitable trading and supply chain decision-making. Physical world data — the actual quantity of goods produced, stored, and transported —
                is the most valuable and least accessible form of market intelligence. Traditional sources are delayed 30–90 days and subject to manipulation.
                Real-time physical intelligence from satellite imagery provides ground truth about economic activity before any official report is published.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { title: "Intelligence Delay", val: "30–90 days", desc: "Traditional official statistics lag behind ground truth by months — too slow for trading decisions." },
                { title: "Access Cost", val: "$50K–$500K/yr", desc: "Planet Labs, Orbital Insight pricing is institutional-only. Mid-market teams are priced out entirely." },
                { title: "Analyst Requirement", val: "PhD Specialists", desc: "Processing satellite imagery requires geospatial analysts — a bottleneck preventing broad adoption." },
                { title: "Market Opportunity", val: "$1B+", desc: "5,000+ hedge funds, commodity traders, and supply chain teams need this intelligence but can't access it." },
              ].map((s, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "16px" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: ACCENT }}>{s.val}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* SOLUTION */}
          <section id="solution" style={{ marginBottom: 60 }}>
            <SH emoji="💡" title="Idea & Solution Concept" />
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.8, marginBottom: 20 }}>
              SkyAnalyst democratizes satellite intelligence by automating the entire pipeline from imagery acquisition to structured intelligence delivery.
              Users with no geospatial expertise can define monitoring tasks in minutes and receive automated reports as new imagery arrives.
              The platform makes $50K+/year intelligence accessible at $500–$5,000/month.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {[
                { icon: "🗺️", title: "Define AOI", desc: "Draw on interactive map or upload GeoJSON. Set monitoring tasks and schedule." },
                { icon: "📡", title: "Acquire Imagery", desc: "Automatic optimal source selection. Cloud-free imagery guaranteed within ±3 days." },
                { icon: "🤖", title: "Run Models", desc: "6 PyTorch models process imagery tiles. Results aggregated to AOI-level metrics." },
                { icon: "📊", title: "Get Intelligence", desc: "Structured metrics + GPT-4o narrative + time-series charts + change alerts." },
              ].map((s, i) => (
                <div key={i} style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: ACCENT, marginBottom: 6 }}>{s.title}</h4>
                  <p style={{ fontSize: 12, color: "#475569", margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ARCHITECTURE */}
          <section id="architecture" style={{ marginBottom: 60 }}>
            <SH emoji="⚙️" title="System Architecture" />
            {/* SVG Architecture */}
            <div style={{ background: "#0B1120", borderRadius: 16, padding: 28, marginBottom: 24, overflowX: "auto" }}>
              <svg viewBox="0 0 800 480" style={{ width: "100%", height: "auto", minWidth: 600 }}>
                {/* Satellite icon at top */}
                <text x={400} y={28} fontSize="22" textAnchor="middle" fontFamily="DM Sans, sans-serif">🛰️</text>
                <text x={400} y={46} fontSize="9" fill="#94A3B8" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="600">COMMERCIAL SATELLITE IMAGERY</text>
                {/* Source boxes */}
                {[
                  { x: 50, label: "Planet Labs\n3m daily", color: "#0891B2" },
                  { x: 220, label: "Sentinel-2\n10m free", color: "#059669" },
                  { x: 390, label: "SPOT\n1.5m precision", color: "#7C3AED" },
                  { x: 560, label: "Sentinel-1\nSAR all-weather", color: "#D97706" },
                ].map((s, i) => (
                  <g key={i}>
                    <rect x={s.x} y={55} width={170} height={38} rx="6" fill={`${s.color}18`} stroke={s.color} strokeWidth="1.2" />
                    <text x={s.x + 85} y={71} fontSize="9" fill={s.color} textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">{s.label.split("\n")[0]}</text>
                    <text x={s.x + 85} y={84} fontSize="8.5" fill={s.color} textAnchor="middle" fontFamily="DM Sans, sans-serif">{s.label.split("\n")[1]}</text>
                    <line x1={s.x + 85} y1={93} x2={s.x + 85} y2={108} stroke="#334155" strokeWidth="1" />
                    <polygon points={`${s.x + 80},108 ${s.x + 90},108 ${s.x + 85},116`} fill="#334155" />
                  </g>
                ))}
                {/* Preprocessing */}
                <rect x={50} y={120} width={700} height={48} rx="8" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
                <text x={400} y={142} fontSize="11" fill="#94A3B8" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">PREPROCESSING PIPELINE</text>
                <text x={400} y={158} fontSize="8.5" fill="#64748B" textAnchor="middle" fontFamily="DM Sans, sans-serif">Atmospheric Correction (py6S)  ·  Cloud Masking (s2cloudless)  ·  Orthorectification (SRTM DEM)  ·  Tiling 512×512</text>
                {/* Arrow */}
                <line x1={400} y1={168} x2={400} y2={184} stroke="#334155" strokeWidth="1.5" />
                <polygon points="395,184 405,184 400,192" fill="#334155" />
                {/* 6 Models */}
                {[
                  { x: 18, label: "🚗 Vehicle\nDetector", color: "#3F51B5" },
                  { x: 143, label: "🛢 Oil Tank\nAnalyzer", color: "#D97706" },
                  { x: 268, label: "🌾 Agricultural\nAnalyzer", color: "#059669" },
                  { x: 393, label: "🚢 Ship\nDetector", color: "#0891B2" },
                  { x: 518, label: "🏗 Construction\nMonitor", color: "#DC2626" },
                  { x: 643, label: "🔄 Change\nDetector", color: "#7C3AED" },
                ].map((m, i) => (
                  <g key={i}>
                    <rect x={m.x} y={194} width={117} height={68} rx="8" fill="#1E293B" stroke={m.color} strokeWidth="1.5" />
                    <text x={m.x + 58} y={224} fontSize="13" textAnchor="middle" fontFamily="DM Sans, sans-serif">{m.label.split("\n")[0]}</text>
                    <text x={m.x + 58} y={240} fontSize="9" fill={m.color} textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">{m.label.split("\n")[1]}</text>
                    <text x={m.x + 58} y={254} fontSize="8" fill="#475569" textAnchor="middle" fontFamily="DM Sans, sans-serif">{["RetinaNet", "Shadow Geom.", "NDVI + CNN", "Dual-Modal", "Siamese CNN", "SegFormer-B2"][i]}</text>
                    <line x1={m.x + 58} y1={262} x2={m.x + 58} y2={278} stroke="#334155" strokeWidth="1" />
                    <polygon points={`${m.x + 53},278 ${m.x + 63},278 ${m.x + 58},286`} fill="#334155" />
                  </g>
                ))}
                {/* PostGIS + narration */}
                <rect x={50} y={290} width={340} height={52} rx="8" fill="#1E293B" stroke="#3F51B5" strokeWidth="1.5" />
                <text x={220} y={312} fontSize="11" fill="#93C5FD" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">PostGIS Time-Series Store</text>
                <text x={220} y={327} fontSize="8.5" fill="#64748B" textAnchor="middle" fontFamily="DM Sans, sans-serif">GIST spatial indexes · Monthly partitions · Metric JSONB</text>
                <text x={220} y={335} fontSize="8.5" fill="#64748B" textAnchor="middle" fontFamily="DM Sans, sans-serif">asset_detections (GEOMETRY POINT 4326)</text>

                <rect x={410} y={290} width={340} height={52} rx="8" fill="#1E293B" stroke="#059669" strokeWidth="1.5" />
                <text x={580} y={312} fontSize="11" fill="#6EE7B7" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">GPT-4o Report Narration</text>
                <text x={580} y={327} fontSize="8.5" fill="#64748B" textAnchor="middle" fontFamily="DM Sans, sans-serif">Structured metrics → Plain-English intelligence</text>
                <text x={580} y={340} fontSize="8.5" fill="#64748B" textAnchor="middle" fontFamily="DM Sans, sans-serif">Alert generation when metric changes > threshold</text>

                {/* Arrows down */}
                <line x1={220} y1={342} x2={220} y2={360} stroke="#334155" strokeWidth="1.5" />
                <line x1={580} y1={342} x2={580} y2={360} stroke="#334155" strokeWidth="1.5" />
                <line x1={220} y1={360} x2={580} y2={360} stroke="#334155" strokeWidth="1.5" />
                <line x1={400} y1={360} x2={400} y2={378} stroke="#334155" strokeWidth="1.5" />
                <polygon points="395,378 405,378 400,386" fill="#334155" />

                {/* Output */}
                <rect x={50} y={390} width={700} height={46} rx="8" fill="#1E293B" stroke="#0891B2" strokeWidth="1.5" />
                <text x={400} y={411} fontSize="11" fill="#67E8F9" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700">Intelligence Delivery</text>
                <text x={400} y={427} fontSize="8.5" fill="#64748B" textAnchor="middle" fontFamily="DM Sans, sans-serif">Mapbox map overlays  ·  Time-series Recharts  ·  PDF reports  ·  CSV/Bloomberg export  ·  Email/Slack alerts  ·  REST API</text>
              </svg>
            </div>

            {/* 6 Domain cards */}
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>6 Intelligence Modules — Technical Detail</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              {[
                { icon: "🚗", title: "Vehicle Detection & Counting", color: ACCENT, arch: "RetinaNet (ResNet-50 FPN) fine-tuned on xView (800K labeled objects). 5 classes: car, truck, semi, construction equipment, aircraft. Inference: tile-based (512×512) with NMS across tile boundaries.", output: "VehicleReport: count, by_class, confidence_mean, geojson_features. Updates daily for each active AOI." },
                { icon: "🛢️", title: "Oil Tank Volume Estimation", color: "#D97706", arch: "Stage 1: Faster R-CNN detects floating-roof tanks. Stage 2: shadow trigonometry — fill_pct = 1 - (shadow_length / tank_height_max). Calibrated against tank database of 2,000+ known refinery locations.", output: "OilTankReport: tanks_detected, fill_levels_pct[], estimated_volume_barrels, change_from_last_observation." },
                { icon: "🌾", title: "Agricultural Intelligence", color: "#059669", arch: "Multi-spectral: NDVI, EVI, NDWI from Sentinel-2 bands. Crop type: 1D-CNN on NDVI time-series (52-week phenological fingerprint). Yield: XGBoost (NDVI_peak + ERA5 precipitation + SoilGrids soil type → kg/ha).", output: "AgriculturalReport: vegetation_index, crop_types, yield_estimate, phenological_stage, water_stress_zones." },
                { icon: "🚢", title: "Maritime Ship Monitoring", color: "#0891B2", arch: "Dual-modal: optical RetinaNet on Sentinel-2 RGB + SAR threshold on Sentinel-1 (all-weather detection). Ship class from hull geometry (Random Forest). AIS correlation via aisstream.io API (position match within 500m).", output: "ShipReport: count, by_class, identified_ships (name + IMO), unidentified_count, traffic_volume_dwt." },
                { icon: "🏗️", title: "Construction Activity Monitor", color: "#DC2626", arch: "Siamese CNN change detection (twin ResNet-18 + difference module → binary change mask). Equipment YOLO detection: crane/excavator/concrete_mixer. Volume estimation from material pile shadow geometry.", output: "ConstructionReport: changed_area_m2, equipment_count_by_type, activity_type, completion_estimate_pct." },
                { icon: "🔄", title: "General Change Detection", color: "#7C3AED", arch: "SegFormer-B2 semantic segmentation on pre/post image pairs. 8 change classes: built-up growth, deforestation, flood, fire scar, agriculture expansion, industrial, water body change, other.", output: "ChangeReport: changed_area_m2, type_distribution_pct, confidence, change_heatmap GeoTIFF path." },
              ].map((m, i) => (
                <div key={i} style={{ background: "#fff", border: `1px solid ${m.color}30`, borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ background: `${m.color}10`, borderBottom: `1px solid ${m.color}20`, padding: "10px 14px", display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 18 }}>{m.icon}</span>
                    <h4 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: m.color }}>{m.title}</h4>
                  </div>
                  <div style={{ padding: "12px 14px" }}>
                    <p style={{ fontSize: 11, color: "#475569", lineHeight: 1.55, margin: "0 0 8px" }}><strong>Architecture:</strong> {m.arch}</p>
                    <p style={{ fontSize: 11, color: "#64748B", lineHeight: 1.5, margin: 0 }}><strong>Output:</strong> {m.output}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FEATURES */}
          <section id="features" style={{ marginBottom: 60 }}>
            <SH emoji="✅" title="Features (15 Core Capabilities)" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                { n: "01", icon: "🗺️", title: "Interactive AOI Creation", desc: "Draw AOI polygon on Mapbox map or upload GeoJSON. Area auto-calculated. Validate max 10,000 km²." },
                { n: "02", icon: "🛰️", title: "Six Intelligence Modules", desc: "Vehicles, oil tanks, agriculture, ships, construction, change detection — configurable per AOI." },
                { n: "03", icon: "📡", title: "Multi-Source Imagery", desc: "Planet Labs, Sentinel-2, SPOT — automatic best-source selection based on cloud cover, cost, resolution." },
                { n: "04", icon: "⏰", title: "Flexible Schedules", desc: "Daily, weekly, or on-change monitoring. Configurable per AOI per intelligence module." },
                { n: "05", icon: "📈", title: "Time-Series Intelligence", desc: "Historical trends for all monitored metrics — vehicle counts, tank fill levels, NDVI, ship traffic." },
                { n: "06", icon: "🔔", title: "Change Detection Alerts", desc: "Notify when metric changes > configured threshold from baseline. Email + Slack delivery." },
                { n: "07", icon: "📝", title: "AI-Narrated Reports", desc: "GPT-4o generates plain-English intelligence: what changed, why it matters, what to watch next." },
                { n: "08", icon: "🔍", title: "Comparative Analysis", desc: "Side-by-side comparison for any two time periods with diff metrics and imagery overlays." },
                { n: "09", icon: "📤", title: "Financial Data Export", desc: "CSV, Excel, Bloomberg Data License compatible format — ready for quantitative models." },
                { n: "10", icon: "🧠", title: "Custom Model Training", desc: "Bring your own labeled imagery for domain-specific assets — fine-tune existing models." },
                { n: "11", icon: "☁️", title: "Cloud Handling", desc: "Automatic fallback to most recent cloud-free imagery. Cloud mask applied before inference." },
                { n: "12", icon: "🌐", title: "Geospatial API", desc: "Query any point or polygon globally for any monitored metric. RESTful with PostGIS spatial queries." },
                { n: "13", icon: "🤝", title: "AIS Ship Identification", desc: "Detected ships correlated with AIS transponder data for name, IMO number, flag state, owner." },
                { n: "14", icon: "🏭", title: "Tank Database", desc: "2,000+ known refinery tank locations with diameter and capacity — enables exact volume calculation." },
                { n: "15", icon: "🌾", title: "Yield Forecasting", desc: "Crop yield predictions 3 months before harvest — calibrated against USDA historical yield data." },
              ].map((f, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 16px" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 16px ${ACCENT}15`; e.currentTarget.style.borderColor = `${ACCENT}40`; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#E2E8F0"; }}>
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
                { cat: "Geospatial Processing", color: ACCENT, items: ["GDAL", "rasterio", "shapely", "geopandas", "pyproj", "py6S (atmospheric correction)", "s2cloudless (cloud masking)", "elevation (DEM data)"] },
                { cat: "Machine Learning", color: "#059669", items: ["PyTorch 2.2", "torchvision (RetinaNet, Faster R-CNN)", "albumentations (augmentation)", "XGBoost (yield prediction)", "SegFormer (HuggingFace)", "scikit-learn (ship classifier)"] },
                { cat: "Satellite Data APIs", color: "#D97706", items: ["Planet Labs Python SDK", "Sentinel Hub API (Sentinel-2)", "Sentinel-1 SAR (ESA)", "aisstream.io (AIS data)", "ERA5 (precipitation, OpenMeteo)", "SoilGrids API (soil type)"] },
                { cat: "Backend / Infrastructure", color: "#DC2626", items: ["Python 3.12", "FastAPI", "PostgreSQL + PostGIS", "Redis + Celery", "Alembic (migrations)", "Docker + docker-compose", "Prometheus metrics"] },
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
                { title: "Technical Feasibility", badge: "HIGH", bc: "#059669", bg: "#F0FDF4", bdr: "#A7F3D0", points: ["All models based on published, reproducible architecture", "xView, SAR-Ship, LEVIR-CD: all publicly available datasets", "Planet Labs + Sentinel Hub: production-ready APIs with SDKs", "PostGIS: proven at global scale with billions of spatial features", "PyTorch ecosystem mature for geospatial CV tasks"] },
                { title: "Market Viability", badge: "VALIDATED", bc: ACCENT, bg: "#EFF6FF", bdr: "#BFDBFE", points: ["Planet Labs ($1.2B valuation) validates the commercial market", "Orbital Insight ($23M revenue) shows mid-market demand", "Single trader: 1 correct crude oil trade = $500K–$5M return", "$500–$5,000/month pricing vs. $50K–$500K incumbent cost", "Insurance sector: post-disaster assessment saves $200K/event"] },
                { title: "Uniqueness", badge: "DIFFERENTIATED", bc: "#D97706", bg: "#FFFBEB", bdr: "#FDE68A", points: ["6 intelligence domains in 1 platform vs. specialists per domain", "Shadow geometry oil tank analysis: patentable unique approach", "AIS correlation bridges satellite + maritime data gap", "GPT-4o narration makes insights accessible to non-analysts", "AOI-first design (vs. query-first) matches how analysts think"] },
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
            <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: "#1E3A5F", margin: 0, lineHeight: 1.6 }}>
                <strong>4 prompts in order</strong> → complete SkyAnalyst platform. Backend builds the geospatial FastAPI + 6 ML inference modules. Frontend builds the Mapbox intelligence dashboard. ML Pipeline creates all training scripts and model evaluation. Database designs the PostGIS geospatial schema.
              </p>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {[
                { key: "backend", icon: "🐍", label: "Backend Prompt", sub: "Python · FastAPI · PostGIS · Celery · PyTorch", color: ACCENT, desc: "Complete FastAPI backend with 6 domain-specific PyTorch inference modules (vehicle detector, oil tank shadow analyzer, agricultural NDVI pipeline, ship dual-modal detector, construction monitor, SegFormer change detector), PostGIS spatial storage, Celery imagery workers, and GPT-4o narration service." },
                { key: "frontend", icon: "⚛️", label: "Frontend Prompt", sub: "React 18 · Mapbox GL JS · TypeScript · Recharts", color: "#0891B2", desc: "5-page React app with full Mapbox GL satellite map, AOI polygon management with draw tools, intelligence dashboard with metric time-series, oil tank gauge SVG, NDVI timeline heatmap, ship traffic visualization, and Bloomberg-format data export." },
                { key: "mlPipeline", icon: "🧠", label: "ML Pipeline Prompt", sub: "PyTorch · albumentations · xView · BreizhCrops · LEVIR-CD", color: "#059669", desc: "Complete ML training infrastructure: dataset builders for all 4 public datasets, RetinaNet + 1D-CNN + SegFormer training scripts, batch inference engine with tile stitching, comprehensive evaluation suite, 5 analysis notebooks, and pinned requirements.txt." },
                { key: "database", icon: "🗄️", label: "Database Prompt", sub: "PostgreSQL · PostGIS · Spatial Indexes · TimescaleDB", color: "#D97706", desc: "Complete PostGIS schema with GEOMETRY columns, GIST spatial indexes, monthly partitioned intelligence_reports table, geospatial query functions, anomaly detection function, analytical views, and 10-AOI global seed data covering 90 days." },
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
          </section>

          {/* DOWNLOADS */}
          <section id="downloads" style={{ marginBottom: 60 }}>
            <SH emoji="📥" title="Downloads & Exports" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              {[
                { icon: "📄", label: "PDF Report", sub: "Full portfolio document", color: ACCENT, action: downloadPDF, status: dlStatus },
                { icon: "📊", label: "PPT Deck", sub: "Investor presentation", color: "#D97706", action: () => alert("PPT export coming soon — covers: satellite intelligence market, 6 domain modules, technical architecture, use cases (trading, insurance, supply chain), and pricing model.") },
                { icon: "📝", label: "Pitch Script", sub: "3-minute presentation", color: "#059669", action: () => { navigator.clipboard.writeText(`SkyAnalyst — Presentation Script\n\n[HOOK]\n"Every day, $500M in commodities trades are made on data that's 60 days old. I'm going to show you how to get that data in real time, from space."\n\n[PROBLEM]\nHedge funds, commodities traders, and supply chain teams need ground-truth physical intelligence. Is that Chinese refinery actually operating at capacity? Are the Iowa corn fields going to have a good harvest? How many ships are waiting at Singapore port right now? This data exists — it's visible from space. But accessing it costs $50,000 to $500,000 per year and requires PhD geospatial analysts.\n\n[SOLUTION]\nSkyAnalyst automates the entire pipeline. You draw an area on a map. You choose what to monitor — vehicles, oil tanks, crops, ships, construction. The platform acquires satellite imagery daily, runs 6 deep learning models, and delivers structured intelligence reports. Oil tank fill levels estimated from shadow geometry. Crop yields predicted from vegetation indices 3 months before harvest. Ship traffic correlated with AIS transponder data.\n\n[UNIQUE VALUE]\nWe make $50,000/year satellite intelligence available at $500/month. For a commodities trader, one correct oil position based on tank inventory data generates more return than our annual subscription cost.\n\n[CLOSE]\nSkyAnalyst: satellite intelligence, democratized. Thank you."`); alert("Script copied! ✓"); } },
                { icon: "⌥", label: "GitHub", sub: "github.com/Anshul-777/SkyAnalyst", color: "#0F172A", action: () => window.open("https://github.com/Anshul-777/SkyAnalyst", "_blank") },
              ].map((d, i) => (
                <button key={i} onClick={d.action} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "20px 16px", textAlign: "center", cursor: "pointer", display: "block", width: "100%", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = d.color; e.currentTarget.style.boxShadow = `0 4px 16px ${d.color}18`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{d.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{d.label}</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>{("status" in d && d.status) ? d.status : d.sub}</div>
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
              <textarea value={newComment.message} onChange={e => setNewComment(p => ({ ...p, message: e.target.value }))} placeholder="Your thoughts on SkyAnalyst…" rows={3} style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: 8, padding: "9px 12px", fontSize: 13, marginBottom: 10, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
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

      {/* FOOTER */}
      <footer style={{ background: "#0B1120", color: "#94A3B8", padding: "40px 48px", textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#93C5FD", marginBottom: 8 }}>SkyAnalyst</div>
        <p style={{ fontSize: 13, marginBottom: 16, color: "#64748B" }}>Satellite Imagery Intelligence Platform — Project #11 of 75</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
          <a href="https://github.com/Anshul-777/SkyAnalyst" target="_blank" rel="noopener" style={{ color: "#93C5FD", fontSize: 13 }}>⌥ GitHub</a>
          <a href="https://www.linkedin.com/in/anshul-rathod777" target="_blank" rel="noopener" style={{ color: "#93C5FD", fontSize: 13 }}>in LinkedIn</a>
        </div>
        <div style={{ fontSize: 11, color: "#475569" }}>Built by Anshul Rathod · Available for freelance · © 2025</div>
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
      {link ? <a href={link} target="_blank" rel="noopener" style={{ fontSize: 13, color: ac || "#3F51B5", fontWeight: 600, textDecoration: "none" }}>{value} ↗</a> : <div style={{ fontSize: 13, color: "#0F172A", fontWeight: 600 }}>{value}</div>}
    </div>
  );
}

import json
import re

# Load parsed projects
with open('c:/Users/anshu/OneDrive/Desktop/Portflio/all_projects_metadata.json', 'r', encoding='utf-8') as f:
    all_parsed = json.load(f)

# Existing projects from projects.ts (I'll extract them numerically/manually to be safe)
# I'll just use the JSON as the base and REPLACE the ones I have better data for.

special_data = {
    "poly-agent": {
      "title": "PolyAgent - Multi-Modal Autonomous Research Engine",
      "category": "machine-learning",
      "slug": "poly-agent",
      "technologies": ["TypeScript", "LangChain", "Python"],
    },
    "sky-analyst": {
      "title": "SkyAnalyst - Geospatial Intelligence",
      "category": "machine-learning",
      "slug": "sky-analyst",
      "technologies": ["PyTorch", "Apache Airflow", "FastAPI"],
    },
    "esg-lens": {
      "title": "ESGLens - ESG Risk Assessment",
      "category": "machine-learning",
      "slug": "esg-lens",
      "technologies": ["Python", "NetworkX", "PostgreSQL"],
    },
    "voice-guard": {
      "title": "VoiceGuard - Deepfake Detection",
      "category": "machine-learning",
      "slug": "voice-guard",
      "technologies": ["PyTorch", "RawNet2", "FastAPI"],
    },
    "churn-prediction": {
       "title": "Customer Retention Intelligence",
       "slug": "churn-prediction",
       "liveUrl": "https://customer-churn-predictor-eta.vercel.app/",
       "technologies": ["Python", "Pandas", "Scikit-learn", "Matplotlib", "MLflow", "Plotly"],
    }
}

# Slugs in the parsed list that correspond to special ones
PARSED_TO_SPECIAL = {
    "polyagent": "poly-agent",
    "skyanalyst": "sky-analyst",
    "esglens": "esg-lens",
    "voiceguard": "voice-guard",
    "churnpredictor": "churn-prediction"
}

# Final merge
final_projects = []
seen_slugs = set()

for p in all_parsed:
    orig_slug = p['slug']
    p['slug'] = PARSED_TO_SPECIAL.get(orig_slug, orig_slug)
    
    if p['slug'] in special_data:
        p.update(special_data[p['slug']])
    
    # Ensure AegisPay, Neuro-VX, VisionGuard are handled if they aren't in the 75
    final_projects.append(p)
    seen_slugs.add(p['slug'])

# Add AegisPay, Neuro-VX, VisionGuard manually since they were in the original but maybe not in the 75
extra_originals = [
    {
        "id": "A1",
        "title": "AegisPay \u2013 Fraud Detection Prototype",
        "category": "machine-learning",
        "year": "2024",
        "slug": "aegispay-fraud-detection",
        "description": "A simulated digital payment environment demonstrating real-time fraud detection through behavioral analytics and dynamic risk scoring.",
        "technologies": ["Python", "Scikit-learn", "PyTorch", "FastAPI", "PostgreSQL", "Docker"]
    },
    {
        "id": "A2",
        "title": "Neuro-VX \u2013 Cognitive Risk Intelligence",
        "category": "data-science",
        "year": "2024",
        "slug": "neuro-vx-cognitive-health",
        "description": "A prototype system demonstrating predictive cognitive health analysis using behavioral and response-based micro-assessments.",
        "technologies": ["Python", "OpenCV", "PyTorch", "MediaPipe", "NumPy", "Flask"]
    },
    {
        "id": "A3",
        "title": "VisionGuard-CCTV",
        "title_long": "Intelligent CCTV Monitoring",
        "category": "computer-vision",
        "year": "2023",
        "slug": "visionguard-cctv",
        "description": "A computer vision prototype for automated visual intelligence using CCTV footage with real-time object detection and motion tracking.",
        "technologies": ["Python", "YOLOv8", "OpenCV", "PyTorch", "TensorRT", "Docker"]
    }
]

for extra in extra_originals:
    if extra['slug'] not in seen_slugs:
        final_projects.append(extra)

# Output
output_path = 'c:/Users/anshu/OneDrive/Desktop/Portflio/src/data/projects.ts'

header = """import type { Project } from '@/types';
import projectChurn from '@/assets/project-churn.jpg';

import aegisLanding from '@/assets/aegispay/01-landing.jpg';
import aegisLogin from '@/assets/aegispay/02-login.jpg';
import aegisDashboard from '@/assets/aegispay/03-dashboard.jpg';
import aegisServices from '@/assets/aegispay/04-services.jpg';
import aegisQR from '@/assets/aegispay/05-qrcode.jpg';
import aegisPayment from '@/assets/aegispay/06-payment.jpg';
import aegisSuccess from '@/assets/aegispay/07-success.jpg';
import aegisProfile from '@/assets/aegispay/08-profile.jpg';
import aegisMLLayers from '@/assets/aegispay/09-ml-layers.jpg';
import aegisAccuracy from '@/assets/aegispay/10-accuracy.jpg';

import churnHero from '@/assets/churn/01-hero.png';
import churnHeroMobile from '@/assets/churn/02-hero-mobile.jpg';
import churnDashboard from '@/assets/churn/03-dashboard.jpg';
import churnUsecases from '@/assets/churn/04-usecases.jpg';
import churnCta from '@/assets/churn/05-cta.jpg';
import churnPredictor from '@/assets/churn/06-predictor.jpg';
import churnServices from '@/assets/churn/07-services.jpg';
import churnResults from '@/assets/churn/08-results.jpg';
import churnHistory from '@/assets/churn/09-history.jpg';

export const projects: Project[] = [
"""

# Hardcoded detailed data for the big ones (to avoid script complexity)
# I'll just write them out.
# Actually I'll use placeholders in the loop and replace them.

footer = """
];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find(project => project.slug === slug);
};

export const getProjectsByCategory = (category: string): Project[] => {
  if (category === 'all') return projects;
  return projects.filter(project => project.category === category);
};

export const getFeaturedProjects = (): Project[] => {
  return projects.slice(0, 4);
};

export const getAdjacentProjects = (currentSlug: string): { prev: Project | null; next: Project | null } => {
  const currentIndex = projects.findIndex(p => p.slug === currentSlug);
  if (currentIndex === -1) return { prev: null, next: null };
  return {
    prev: currentIndex > 0 ? projects[currentIndex - 1] : null,
    next: currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null
  };
};
"""

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(header)
    for p in final_projects:
        # Check if it's AegisPay or Churn to add images
        if p['slug'] == 'aegispay-fraud-detection':
            p['coverImage'] = 'PLACEHOLDER_AEGIS_LANDING'
            p['flowImages'] = 'PLACEHOLDER_AEGIS_FLOW'
            p['detailedDescription']['overview'] = 'AegisPay is a simulated digital payment environment...'
        elif p['slug'] == 'churn-prediction':
            p['coverImage'] = 'PLACEHOLDER_CHURN_HERO'
            p['flowImages'] = 'PLACEHOLDER_CHURN_FLOW'
        
        js = json.dumps(p, indent=2)
        # Replace placeholders with JS variables
        js = js.replace('"PLACEHOLDER_AEGIS_LANDING"', 'aegisLanding')
        js = js.replace('"PLACEHOLDER_CHURN_HERO"', 'projectChurn')
        # This is getting complex, I'll just write a cleaner version.
        indented = '\n'.join('  ' + line for line in js.splitlines())
        f.write(indented + ',\n')
    f.write(footer)

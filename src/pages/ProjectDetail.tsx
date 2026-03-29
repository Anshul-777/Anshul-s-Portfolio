import { lazy, Suspense } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoadingFallback } from '@/components/ui/LoadingFallback';

import { getProjectBySlug } from '@/data/projects';
import GenericProjectDetail from './projects/GenericProjectDetail';

// Core High-Fidelity React Project Pages (Manual Overrides)
const PolyAgent = lazy(() => import('./projects/PolyAgent'));
const ChurnPredictor = lazy(() => import('./projects/ChurnPredictor'));
const ESGLens = lazy(() => import('./projects/ESGLens'));
const SkyAnalyst = lazy(() => import('./projects/SkyAnalyst'));
const VoiceGuard = lazy(() => import('./projects/VoiceGuard'));

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = slug ? getProjectBySlug(slug) : undefined;

  // 1. Specialized React Renderers (Full UI Overrides)
  const renderSpecialized = () => {
    switch(slug) {
      case 'poly-agent': return <PolyAgent />;
      case 'churn-prediction': return <ChurnPredictor />;
      case 'esg-lens': return <ESGLens />;
      case 'sky-analyst': return <SkyAnalyst />;
      case 'voice-guard': return <VoiceGuard />;
      default: return null;
    }
  };

  const specialized = renderSpecialized();

  // If the project doesn't exist, redirect to portfolio
  if (!project) {
    return <Navigate to="/portfolio" replace />;
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Dynamic Back Button */}
      <motion.button
        onClick={() => navigate('/portfolio')}
        className="fixed top-6 left-6 z-[100] w-10 h-10 rounded-full bg-background/20 backdrop-blur-md border border-foreground/10 flex items-center justify-center hover:bg-background/40 transition-all shadow-lg group"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        title="Return to Portfolio"
      >
        <ArrowLeft className="size-5 text-foreground group-hover:-translate-x-1 transition-transform" />
      </motion.button>

      <Suspense fallback={<LoadingFallback />}>
        {specialized ? specialized : <GenericProjectDetail project={project} />}
      </Suspense>
    </div>
  );
}

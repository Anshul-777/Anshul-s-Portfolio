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
    <div className="relative min-h-screen bg-black">
      <motion.button
        onClick={() => navigate('/portfolio')}
        className="fixed top-24 left-6 z-50 w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all shadow-2xl group"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        title="Return to Portfolio Arsenal"
      >
        <ArrowLeft className="size-6 text-white group-hover:-translate-x-1 transition-transform" />
      </motion.button>

      <Suspense fallback={<LoadingFallback />}>
        {specialized ? specialized : <GenericProjectDetail project={project} />}
      </Suspense>
    </div>
  );
}

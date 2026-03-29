import { lazy, Suspense } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoadingFallback } from '@/components/ui/LoadingFallback';

// Core High-Fidelity React Project Pages
const PolyAgent = lazy(() => import('./projects/PolyAgent'));
const ChurnPredictor = lazy(() => import('./projects/ChurnPredictor'));
const ESGLens = lazy(() => import('./projects/ESGLens'));
const SkyAnalyst = lazy(() => import('./projects/SkyAnalyst'));
const VoiceGuard = lazy(() => import('./projects/VoiceGuard'));

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // 1. Specialized React Renderers (High-Fidelity)
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

  // If it's a specialized project, show it in the React view
  if (specialized) {
    return (
      <div className="relative min-h-screen bg-white">
        <motion.button
          onClick={() => navigate('/portfolio')}
          className="fixed top-24 left-6 z-50 w-10 h-10 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center hover:bg-accent transition-all shadow-xl group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          title="Return to Arsenal"
        >
          <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform text-foreground" />
        </motion.button>

        <Suspense fallback={<LoadingFallback />}>
          {specialized}
        </Suspense>
      </div>
    );
  }

  // 2. Fallback: For all other 70 projects, return to the Arsenal Portfolio (iframe)
  // This ensures the user stays in the 'Working state' environment.
  return <Navigate to="/portfolio" replace />;
}

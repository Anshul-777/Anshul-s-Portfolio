import React from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, Shield, Zap, Globe, Cpu, BarChart3,
  ArrowRight, CheckCircle2, AlertCircle, Layers,
  ChevronRight, Sparkles, Database, Code
} from 'lucide-react';
import { Project } from '@/types';

interface GenericProjectDetailProps {
  project: Project;
}

const GenericProjectDetail: React.FC<GenericProjectDetailProps> = ({ project }) => {
  // Theme selection based on category
  const getTheme = () => {
    const cat = project.category.toLowerCase();
    if (cat.includes('ai') || cat.includes('machine')) return { color: '#6366f1', name: 'indigo' };
    if (cat.includes('data') || cat.includes('analytic')) return { color: '#0ea5e9', name: 'azure' };
    if (cat.includes('security') || cat.includes('privacy')) return { color: '#ef4444', name: 'crimson' };
    if (cat.includes('finance') || cat.includes('esg')) return { color: '#10b981', name: 'emerald' };
    return { color: '#06b6d4', name: 'cyan' };
  };

  const theme = getTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20">
      <motion.div 
        className="max-w-7xl mx-auto px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Institutional Header */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="flex items-center gap-3 mb-6 text-sm font-medium tracking-widest text-[#888] uppercase">
            <span className="bg-white/10 px-3 py-1 rounded-full border border-white/5">{project.category}</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span>Est. {project.year}</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span className="text-white/40">INTERNAL REPOSITORY</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            {project.fullTitle || project.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/50 max-w-4xl leading-relaxed mb-12">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-4">
            {project.technologies?.map((tech, i) => (
              <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white/70">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Premium Stats Row */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10 mb-20"
        >
          {[
            { label: 'PORTFOLIO RANK', value: project.rank || 'Active', icon: Globe },
            { label: 'COMPLEXITY ARCH', value: project.difficulty || 'Advanced', icon: Cpu },
            { label: 'MODULE IDENTITY', value: project.category?.toUpperCase(), icon: Shield },
            { label: 'DOMAIN SCALE', value: 'Enterprise Grade', icon: BarChart3 }
          ].map((stat, i) => (
            <div key={i} className="bg-black/40 backdrop-blur-xl p-8 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] font-bold text-white/40 uppercase">
                <stat.icon size={12} className="opacity-50" />
                {stat.label}
              </div>
              <div className="text-xl font-bold tracking-tight">{stat.value}</div>
            </div>
          ))}
        </motion.div>

        {/* Detailed Content Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Problem Statement */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-red-500/20 bg-red-500/10 text-red-500">
                <AlertCircle size={20} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Institutional Friction</h3>
            </div>
            <div 
              className="text-lg text-white/60 leading-relaxed font-light space-y-4"
              dangerouslySetInnerHTML={{ __html: project.detailedDescription?.problem || '' }}
            />
          </div>

          {/* Solution Concept */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-blue-500/20 bg-blue-500/10 text-blue-500">
                <Sparkles size={20} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Architectural Solution</h3>
            </div>
            <div 
              className="text-lg text-white/60 leading-relaxed font-light space-y-4"
              dangerouslySetInnerHTML={{ __html: project.detailedDescription?.solution || '' }}
            />
          </div>

          {/* Technical Implementation */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                <Database size={20} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Technical Topology</h3>
            </div>
            <div 
              className="text-lg text-white/60 leading-relaxed font-light space-y-4"
              dangerouslySetInnerHTML={{ __html: project.detailedDescription?.architecture || '' }}
            />
          </div>
        </motion.div>

        {/* Next/Prev Navigation could be added here */}
      </motion.div>
    </div>
  );
};

export default GenericProjectDetail;

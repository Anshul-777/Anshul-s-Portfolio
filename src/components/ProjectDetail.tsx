import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../data/projects';
import { ArrowLeft, ExternalLink, Github, Linkedin, Shield, Search, Filter, Download, CreditCard, ChevronRight } from 'lucide-react';
import { useCredits } from '../contexts/CreditContext';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  const { credits, useCredit } = useCredits();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900"
    >
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Portfolio</span>
          </button>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-semibold text-gray-600">
              <CreditCard size={14} className={credits === 0 ? "text-red-400" : "text-indigo-400"} />
              <span className={credits === 0 ? "text-red-600" : ""}>{credits} Credits Left</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors"><Github size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                  Project #{project.number}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border" 
                  style={{ backgroundColor: `${project.color}11`, color: project.color, borderColor: `${project.color}33` }}>
                  {project.domain}
                </span>
                <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-[10px] font-bold tracking-widest uppercase">
                  {project.difficulty}
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]" 
                style={{ color: project.color }}>
                {project.title.split(':')[0]}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-xl">
                {project.coreIdea}
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-semibold flex items-center gap-2 hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-200">
                  <Download size={20} />
                  Download Assets
                </button>
                <button 
                  onClick={() => {
                    if (useCredit()) {
                      alert("Successfully revealed prompt! (Feature placeholder)");
                    } else {
                      alert("Out of credits! Please check back tomorrow.");
                    }
                  }}
                  className="px-8 py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl font-semibold flex items-center gap-2 hover:border-gray-900 transition-all active:scale-95">
                  <CreditCard size={20} />
                  Reveal Prompt (1 Credit)
                </button>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="relative aspect-square">
              <div className="absolute inset-0 bg-gray-100 rounded-[3rem] overflow-hidden border border-gray-200 shadow-2xl">
                {/* Mockup or Visualization Space */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-dashed border-gray-200" />
                    <span className="text-sm font-medium uppercase tracking-[0.2em]">Visual Representation Loading...</span>
                  </div>
                </div>
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/40" />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 p-8 bg-white border border-gray-100 rounded-3xl shadow-xl max-w-[240px]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl" style={{ backgroundColor: `${project.color}22` }}>
                    <Shield size={20} style={{ color: project.color }} />
                  </div>
                  <span className="font-bold text-sm tracking-tight">Verified Solution</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Extracted from the God's Project Arsenal. Validated architectural patterns.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Detailed Content - Bento Grid Inspired */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24">
            
            {/* Problem & Solution */}
            <motion.div variants={itemVariants} className="md:col-span-8 p-12 bg-gray-50 border border-gray-100 rounded-[2.5rem]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-red-500 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Problem Statement
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {project.problem}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-green-500 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Idea & Concept
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Rank & Metadata */}
            <motion.div variants={itemVariants} className="md:col-span-4 p-12 bg-indigo-50 border border-indigo-100 rounded-[2.5rem] flex flex-col justify-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-4">Internal Priority</h3>
              <div className="text-6xl font-bold text-indigo-900 mb-6 tracking-tight">
                {project.rank.split(' ')[0]}
              </div>
              <p className="text-sm text-indigo-700/70 leading-relaxed font-medium">
                Ranked in top {project.rank.split(' ')[2]} projects based on technical complexity and market impact.
              </p>
            </motion.div>

            {/* Technical Architecture */}
            <motion.div variants={itemVariants} className="md:col-span-12 p-12 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
                <Tool size={16} />
                Core Technical Architecture & Working
              </h3>
              <div className="text-xl text-gray-700 leading-relaxed max-w-5xl">
                {project.technicalArchitecture}
              </div>
            </motion.div>

            {/* Features */}
            <motion.div variants={itemVariants} className="md:col-span-12 lg:col-span-7 p-12 bg-gray-900 text-white rounded-[2.5rem]">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-10 flex items-center gap-2">
                <Shield size={16} />
                Key Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                {project.features.map((feature, i) => (
                  <div key={i} className="flex gap-4 group">
                    <span className="text-indigo-400 font-mono text-sm group-hover:translate-x-1 transition-transform">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors leading-snug">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tech Stack & Links */}
            <motion.div variants={itemVariants} className="md:col-span-12 lg:col-span-5 flex flex-col gap-8">
              <div className="flex-1 p-12 bg-white border border-gray-100 rounded-[2.5rem]">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">Tools & Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool, i) => (
                    <span key={i} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-700">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-8 bg-gray-50 border border-gray-100 rounded-[2.5rem] flex items-center justify-between">
                <div className="flex gap-4">
                  {project.links.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-gray-200 rounded-2xl hover:border-indigo-500 hover:text-indigo-600 transition-all">
                      <ExternalLink size={20} />
                    </a>
                  ))}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Project Integrity: 100%</span>
              </div>
            </motion.div>
          </div>

          {/* Footer Impact */}
          <motion.div variants={itemVariants} className="border-t border-gray-100 pt-16 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-500 mb-4">Market Impact</h4>
              <p className="text-2xl font-bold text-gray-900 leading-tight">
                "{project.impact}"
              </p>
            </div>
            <button 
              onClick={onBack}
              className="px-10 py-5 bg-gray-50 text-gray-900 rounded-3xl font-bold hover:bg-indigo-600 hover:text-white transition-all group"
            >
              Explore Other Projects
              <ChevronRight size={20} className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
};

const Tool = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

export default ProjectDetail;

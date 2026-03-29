import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, eliteProjects } from '../data/projects';
import { Search, Filter, Shield, ArrowRight, Layers, Github, Linkedin, Maximize2 } from 'lucide-react';
import ParticleBackground from './ParticleBackground';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface ProjectListProps {
  onSelectProject: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ onSelectProject }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const filters = ['All', 'AGI', 'FinTech', 'AI Security', 'ML', 'Geospatial', 'Legal', 'Healthcare'];

  const filteredProjects = useMemo(() => {
    return eliteProjects.filter(project => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.coreIdea.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = activeFilter === 'All' || project.domain.includes(activeFilter);

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden bg-white border-b border-gray-100">
        <ParticleBackground />
        
        {/* Subtle glowing orb in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-[120px] opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50/50 backdrop-blur-md border border-indigo-100/50 rounded-full text-indigo-700 font-bold text-xs uppercase tracking-widest mb-8 shadow-sm">
              <Shield size={14} />
              God's Project Arsenal 2.0
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 mb-8 leading-[0.9]">
              The Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600">75 Projects</span>
            </h1>
            
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
              A curated collection of high-fidelity, production-grade project architectures.
              Engineered for scale, security, and market impact.
            </p>

            {/* Search & Filters */}
            <div className="max-w-3xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors z-10" size={22} />
                <input
                  type="text"
                  placeholder="Search projects, domains, or tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-6 bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 transition-all text-lg font-medium relative z-10"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto hide-scrollbar gap-8">
          <div className="flex gap-2">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeFilter === filter
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-4 text-gray-400">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {filteredProjects.length} Projects
            </span>
            <div className="h-4 w-px bg-gray-200" />
            <Filter size={18} />
          </div>
        </div>
      </div>

      {/* 3D Carousel Section */}
      <section className="py-24 px-0 max-w-[100vw] overflow-hidden bg-slate-50 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {filteredProjects.length > 0 ? (
          <div className="relative z-10 max-w-screen-2xl mx-auto px-4 md:px-8">
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              initialSlide={2}
              coverflowEffect={{
                rotate: 20,
                stretch: 0,
                depth: 250,
                modifier: 1,
                slideShadows: false,
              }}
              mousewheel={true}
              pagination={{ clickable: true, dynamicBullets: true }}
              navigation={true}
              modules={[EffectCoverflow, Pagination, Navigation, Mousewheel]}
              className="w-full py-12"
            >
              {filteredProjects.map((project, index) => (
                <SwiperSlide key={project.id} className="w-[340px] md:w-[480px] lg:w-[560px] self-center">
                  <motion.div
                    layoutId={`project-card-${project.id}`}
                    className={`relative bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-xl transition-all duration-500 ease-out h-[500px] flex flex-col group
                      ${hoveredProject === project.id ? 'shadow-2xl shadow-indigo-100 scale-[1.02] border-indigo-200 z-50' : ''}
                    `}
                    onMouseEnter={() => setHoveredProject(project.id)}
                    onMouseLeave={() => setHoveredProject(null)}
                    onClick={() => onSelectProject(project)}
                  >
                    {/* Hover Expand Overlay containing detailed info */}
                    <AnimatePresence>
                      {hoveredProject === project.id && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center border-2 border-indigo-500/20"
                        >
                          <Maximize2 className="text-indigo-400 mb-6" size={48} strokeWidth={1.5} />
                          <h4 className="text-2xl font-bold text-gray-900 mb-4">{project.title.split(':')[0]}</h4>
                          <p className="text-sm text-gray-500 mb-8 max-w-sm">
                            Click to explore the full architecture, code components, and AI prompts.
                          </p>
                          <button className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-200">
                            Enter Project <ArrowRight size={18} />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Standard Card Content */}
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none">
                      <div style={{ color: project.color }}><Layers size={180} /></div>
                    </div>

                    <div className="flex items-center justify-between mb-8 relative z-10 w-full">
                      <span className="text-[11px] font-black tracking-widest text-gray-400 uppercase bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">#{project.number}</span>
                      <div className="flex gap-2">
                        <span className="px-3 py-1.5 bg-gray-900 text-[10px] font-bold text-white rounded-lg uppercase tracking-wider">{project.difficulty}</span>
                        <span className="px-3 py-1.5 bg-indigo-50 text-[10px] font-bold text-indigo-700 rounded-lg uppercase tracking-wider border border-indigo-100">
                          {project.domain.split(' / ')[0]}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-3xl font-black text-gray-900 mb-5 leading-[1.1] relative z-10 shrink-0">
                      {project.title.split(':')[0]}
                    </h3>

                    <p className="text-base text-gray-500 leading-relaxed mb-auto relative z-10 flex-1 overflow-hidden line-clamp-4">
                      {project.coreIdea}
                    </p>

                    <div className="pt-8 border-t border-gray-100 relative z-10 shrink-0">
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tools.slice(0, 4).map((tool, i) => (
                          <span key={i} className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600">
                            {tool}
                          </span>
                        ))}
                        {project.tools.length > 4 && (
                          <span className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-600">
                            +{project.tools.length - 4}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-bold text-indigo-600 flex items-center gap-2">
                          View Architecture <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="py-32 text-center relative z-10">
            <Search size={48} className="mx-auto text-gray-200 mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </section>

      {/* Footer Branding */}
      <footer className="py-24 border-t border-gray-100 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block p-5 bg-indigo-50 border border-indigo-100 rounded-3xl shadow-sm mb-8">
            <Shield size={36} className="text-indigo-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">The 75 Project Arsenal</h2>
          <p className="text-lg text-gray-500 max-w-lg mx-auto mb-12">
            Engineered for elite developers. Explore the limits of what's possible with modern architecture.
          </p>
          <div className="flex justify-center gap-8">
            <a href="#" className="flex items-center gap-2 font-bold text-gray-600 hover:text-indigo-600 transition-colors">
              <Github size={22} />
              GitHub
            </a>
            <a href="#" className="flex items-center gap-2 font-bold text-gray-600 hover:text-indigo-600 transition-colors">
              <Linkedin size={22} />
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProjectList;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '@/data/projects';
import { SEOHead } from '@/components/seo/SEOHead';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';

export default function Portfolio() {
  return (
    <>
      <SEOHead title="Projects" description="Browse my ML, Data Science, and AI projects — from predictive systems to computer vision." />

      <div className="min-h-screen">
        <section className="relative py-24 md:py-32 px-6 lg:px-8 border-b border-border">
          <div className="max-w-7xl mx-auto text-center space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="flex items-center justify-center gap-3 mb-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-wide vibrant-text-gradient">Projects</h1>
                <span className="px-3 py-1 text-sm font-light border border-border rounded-full bg-accent/50">{projects.length}</span>
              </div>
              <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide max-w-2xl mx-auto">Machine Learning, Data Science & AI systems built end-to-end</p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 md:py-16 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
            {projects.map((project, index) => (
              <ScrollReveal key={project.id} delay={index * 0.1}>
                <PortfolioProjectCard project={project} index={index} />
              </ScrollReveal>
            ))}
          </div>
        </section>
        <div className="h-24" />
      </div>
    </>
  );
}

function PortfolioProjectCard({ project, index = 0 }: { project: any; index?: number }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const hasImage = project.coverImage && project.coverImage.length > 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
      <Link to={`/project/${project.slug}`} className="group block relative overflow-hidden rounded-sm gradient-border">
        <div className={cn('relative overflow-hidden bg-muted aspect-[3/2]')}>
          {(!hasImage || hasError) ? (
            <div className="absolute inset-0 bg-white flex flex-col items-center justify-center gap-3">
              <ImageOff className="size-10 text-muted-foreground/40" />
              <span className="text-sm font-light text-muted-foreground/60">Can't Load Image</span>
            </div>
          ) : (
            <>
              {!isLoaded && <div className="absolute inset-0 bg-muted" />}
              <motion.img
                src={project.coverImage}
                alt={project.title}
                className={cn('absolute inset-0 w-full h-full object-cover transition-all duration-700', isLoaded ? 'opacity-100' : 'opacity-0', 'group-hover:scale-110')}
                loading={index < 6 ? 'eager' : 'lazy'}
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
              />
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
              <h3 className="text-white text-xl md:text-2xl font-light tracking-wide">{project.title}</h3>
              <div className="flex items-center gap-3 text-sm text-white/80 font-light tracking-wide">
                <span className="capitalize">{project.category}</span>
                <span>•</span>
                <span>{project.year}</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-colors duration-500" />
        </div>
      </Link>
    </motion.div>
  );
}

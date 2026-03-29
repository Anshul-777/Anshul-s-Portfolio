import { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Tag, Github, MessageCircle, ArrowLeft, ImageOff } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { SEOHead } from '@/components/seo/SEOHead';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { StarRating } from '@/components/StarRating';
import { Chatbot } from '@/components/Chatbot';
import { getProjectBySlug } from '@/data/projects';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const navigate = useNavigate();

  if (!project) {
    return <Navigate to="/404" replace />;
  }

  const detail = project.detailedDescription;
  const flowImages = project.flowImages;
  const hasCover = project.coverImage && project.coverImage.length > 0 && !coverError;

  return (
    <>
      <SEOHead title={project.title} description={project.description} image={project.coverImage} type="article" />
      
      <div className="min-h-screen">
        {/* Back button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="fixed top-24 left-6 z-40 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-accent transition-colors shadow-lg vibrant-hover"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          aria-label="Go back"
        >
          <ArrowLeft className="size-5" />
        </motion.button>

        <motion.div className="relative w-full h-[50vh] overflow-hidden bg-muted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          {hasCover ? (
            <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" loading="eager" fetchPriority="high" onError={() => setCoverError(true)} />
          ) : (
            <div className="w-full h-full bg-white flex flex-col items-center justify-center gap-3">
              <ImageOff className="size-16 text-muted-foreground/30" />
              <span className="text-lg font-light text-muted-foreground/50">Can't Load Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
        </motion.div>

        <section className="max-w-4xl mx-auto px-6 lg:px-8 py-12 md:py-16">
          <motion.div className="space-y-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide vibrant-text-gradient">{project.title}</h1>
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground font-light">
                <div className="flex items-center gap-2"><Calendar className="size-4" /><span>{project.year}</span></div>
                <div className="flex items-center gap-2 capitalize"><Tag className="size-4" /><span>{project.category.replace('-', ' ')}</span></div>
              </div>
            </div>
            <Separator />
            <p className="text-lg md:text-xl font-light leading-relaxed text-foreground">{project.description}</p>
            {project.technologies && project.technologies.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-light tracking-widest uppercase text-muted-foreground">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="px-3 py-1 text-sm font-light border border-border rounded-sm bg-accent/50 text-foreground vibrant-tag">{tech}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </section>

        {detail && (
          <section className="max-w-4xl mx-auto px-6 lg:px-8 pb-16 space-y-12">
            {[
              { title: 'Project Overview', content: detail.overview, delay: 0 },
              { title: 'Core Concept', content: detail.coreConcept, delay: 0.1 },
              { title: 'Technical Approach', content: detail.technicalApproach, delay: 0.15 },
              { title: 'Prototype Demonstration', content: detail.prototype, delay: 0.2 },
              { title: 'Learning Outcomes & Impact', content: detail.learningOutcomes, delay: 0.25 },
            ].map((section) => (
              <ScrollReveal key={section.title} delay={section.delay}>
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-light tracking-wide text-foreground">{section.title}</h2>
                  <Separator />
                  <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground">{section.content}</p>
                </div>
              </ScrollReveal>
            ))}

            {/* Application Flow Screenshots */}
            {flowImages && flowImages.length > 0 && (
              <ScrollReveal delay={0.3}>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-light tracking-wide text-foreground">Application Flow</h2>
                    <Separator />
                    <p className="text-base font-light text-muted-foreground">Step-by-step walkthrough of the prototype interface and its key features.</p>
                  </div>

                  <div className="space-y-10">
                    {flowImages.map((img, index) => (
                      <FlowImageCard key={index} img={img} index={index} />
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* GitHub + Ask Chatbot */}
            <ScrollReveal delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <a href="https://github.com/Anshul-777" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 border border-border rounded-sm font-light tracking-wide text-foreground hover:bg-accent transition-colors vibrant-hover">
                  <Github className="size-5" /> View on GitHub
                </a>
                <button onClick={() => setChatbotOpen(true)} className="inline-flex items-center gap-2 px-8 py-3 bg-foreground text-background rounded-sm font-light tracking-wide hover:bg-foreground/90 transition-colors vibrant-btn">
                  <MessageCircle className="size-5" /> Ask Chatbot About This Project
                </button>
              </div>
            </ScrollReveal>

            {/* Project Rating */}
            <ScrollReveal delay={0.35}>
              <div className="max-w-md mx-auto space-y-4 pt-8">
                <h3 className="text-xl font-light tracking-wide text-center">Rate This Project</h3>
                <p className="text-sm text-muted-foreground font-light text-center">How would you rate this project?</p>
                <StarRating context={project.title} />
              </div>
            </ScrollReveal>
          </section>
        )}

        <div className="h-16" />
      </div>

      {chatbotOpen && (
        <Chatbot projectSlug={slug} autoOpen={true} onClose={() => setChatbotOpen(false)} />
      )}
    </>
  );
}

function FlowImageCard({ img, index }: { img: { src: string; alt: string; caption: string }; index: number }) {
  const [hasError, setHasError] = useState(false);

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium">
          {index + 1}
        </span>
        <span className="text-sm font-light tracking-widest uppercase text-muted-foreground">{img.alt}</span>
      </div>
      <div className="relative overflow-hidden rounded-sm border border-border bg-muted gradient-border">
        {hasError ? (
          <div className="w-full h-48 bg-white flex flex-col items-center justify-center gap-2">
            <ImageOff className="size-8 text-muted-foreground/30" />
            <span className="text-sm font-light text-muted-foreground/50">Can't Load Image</span>
          </div>
        ) : (
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-auto object-contain"
            loading="lazy"
            onError={() => setHasError(true)}
          />
        )}
      </div>
      <p className="text-sm font-light text-muted-foreground leading-relaxed pl-11">{img.caption}</p>
    </motion.div>
  );
}

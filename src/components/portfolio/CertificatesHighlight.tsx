import { motion } from 'framer-motion';
import { certificates } from '@/data/certificates';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Award, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const categoryDot: Record<string, string> = {
  badge: 'bg-blue-400',
  certificate: 'bg-emerald-400',
  hackathon: 'bg-amber-400',
};

export function CertificatesHighlight() {
  return (
    <section className="py-24 md:py-32 border-t border-border px-6 lg:px-8">
      <ScrollReveal>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground font-light">
              <Award className="size-4" /> Credentials
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-wide vibrant-text-gradient">
              Certificates & Badges
            </h2>
            <p className="text-lg text-muted-foreground font-light tracking-wide">
              Industry-recognized certifications validating my expertise
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {certificates.slice(0, 9).map((cert, i) => (
              <motion.div
                key={cert.id}
                className="group rounded-xl border border-border bg-card/60 backdrop-blur-sm p-5 space-y-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 gradient-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                    <img src={cert.badgeImage || cert.image} alt={cert.title} className="w-full h-full object-cover" />
                  </div>
                  <div className={cn('w-2 h-2 rounded-full shrink-0', categoryDot[cert.category])} />
                </div>
                <h3 className="text-sm font-light tracking-wide text-foreground leading-snug line-clamp-2">
                  {cert.title}
                </h3>
                <p className="text-xs text-muted-foreground font-light">{cert.issuer} · {cert.date}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
            <Link
              to="/certificates"
              className="group inline-flex items-center gap-2 text-base font-light tracking-wide text-foreground hover:text-muted-foreground transition-colors"
            >
              View All Certificates <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://www.credly.com/users/anshul-rathod.37fcdcf5"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="size-3.5" /> Credly Profile
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

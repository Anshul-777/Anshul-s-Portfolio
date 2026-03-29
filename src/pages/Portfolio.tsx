import { SEOHead } from '@/components/seo/SEOHead';
import { motion } from 'framer-motion';

export default function Portfolio() {
  return (
    <>
      <SEOHead title="Portfolio Arsenal | 75 Elite Projects" description="Deep-dive into the 75-project repository covering AI, ML, Computer Vision, and full-stack development." />
      
      <div className="w-full h-screen pt-16 overflow-hidden bg-black">
        <motion.div 
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <iframe 
            src="/Project.html" 
            className="w-full h-full border-none shadow-2xl"
            title="God's Project Arsenal"
          />
        </motion.div>
      </div>
    </>
  );
}

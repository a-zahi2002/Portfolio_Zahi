import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useHeroSection } from '../hooks/cms/useHeroSection';

const HeroSkeleton: React.FC = () => (
  <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-charcoal-950 transition-colors duration-300">
    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
      <div className="mb-8 space-y-4 animate-pulse">
        <div className="h-16 md:h-24 bg-white/5 rounded-2xl w-3/4 mx-auto" />
        <div className="h-1 w-24 mx-auto bg-white/5 rounded-full" />
        <div className="h-8 bg-white/5 rounded-xl w-1/2 mx-auto mt-6" />
      </div>
    </div>
  </section>
);

const Hero: React.FC = () => {
  const { data: hero, isLoading } = useHeroSection();

  if (isLoading) return <HeroSkeleton />;

  // Fallback to hardcoded values if Supabase is not configured
  const heading = hero?.heading ?? 'A. Zahi';
  const headingHighlight = hero?.heading_highlight ?? 'Faleel';
  const subheading = hero?.subheading ?? 'Building immersive Digital Experiences with robust engineering and elegant design.';
  const ctaText = hero?.cta_text ?? 'Explore Work';
  const ctaTarget = hero?.cta_scroll_target ?? 'projects';
  const availabilityStatus = hero?.availability_status ?? true;
  const availabilityLabel = hero?.availability_label ?? 'OPEN TO WORK';

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-charcoal-950 transition-colors duration-300">
      {/* Overlay Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pointer-events-none">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
            {heading} <span className="text-blue-600 dark:text-accent-cyan text-glow">{headingHighlight}</span>
          </h1>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-accent-cyan dark:to-blue-500 rounded-full" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          {subheading}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="pointer-events-auto flex flex-col items-center gap-4"
        >
          <button
            onClick={() => document.getElementById(ctaTarget)?.scrollIntoView({ behavior: 'smooth' })}
            className="glass-button group flex items-center gap-2 mx-auto"
          >
            {ctaText}
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>

          {availabilityStatus && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-semibold uppercase tracking-wider"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {availabilityLabel}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-blue-500 dark:via-accent-cyan to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
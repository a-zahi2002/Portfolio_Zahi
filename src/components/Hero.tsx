import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useHeroSection } from '../hooks/cms/useHeroSection';
import { animateTextReveal } from '../utils/animations';

const HeroSkeleton: React.FC = () => (
  <section className="min-h-screen flex items-center bg-[#f5f5f7] dark:bg-charcoal-950 px-6">
    <div className="max-w-7xl mx-auto w-full animate-pulse">
      <div className="h-24 md:h-40 bg-charcoal-900/5 dark:bg-white/5 rounded-2xl w-3/4 mb-4" />
      <div className="h-24 md:h-40 bg-charcoal-900/5 dark:bg-white/5 rounded-2xl w-2/4" />
    </div>
  </section>
);

const Hero: React.FC = () => {
  const { data: hero, isLoading } = useHeroSection();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!isLoading && titleRef.current) {
      // Split text for cinematic reveal (basic split by space for demo purposes)
      const text = titleRef.current.innerText;
      titleRef.current.innerHTML = text
        .split(' ')
        .map(word => `<span class="inline-block overflow-hidden"><span class="inline-block translate-y-full hero-word">${word}</span></span>`)
        .join(' ');
        
      animateTextReveal('.hero-word');
      
      // Animate subtitle
      if (subtitleRef.current) {
        animateTextReveal(subtitleRef.current);
      }
    }
  }, [isLoading]);

  if (isLoading) return <HeroSkeleton />;

  const heading = hero?.heading ?? 'A. Zahi';
  const headingHighlight = hero?.heading_highlight ?? 'Faleel';
  const subheading = hero?.subheading ?? 'Building immersive Digital Experiences with robust engineering and elegant design.';
  const availabilityStatus = hero?.availability_status ?? true;
  const availabilityLabel = hero?.availability_label ?? 'OPEN TO WORK';

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      
      {/* Background Graphic Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full bg-charcoal-900/5 dark:bg-white/5 blur-[100px] pointer-events-none parallax" data-speed="0.2" />

      <div className="container-padding relative z-10 w-full mt-24">
        
        {/* Availability Badge */}
        {availabilityStatus && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-3 mb-8 w-max px-4 py-2 rounded-full border border-charcoal-900/10 dark:border-white/10 bg-white/50 dark:bg-charcoal-900/50 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-gold"></span>
            </span>
            <span className="text-xs font-semibold tracking-widest uppercase text-charcoal-500 dark:text-gray-400">
              {availabilityLabel}
            </span>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start lg:items-end justify-between">
          
          {/* Main Title */}
          <div className="max-w-4xl">
            <h1 
              ref={titleRef}
              className="text-6xl sm:text-7xl md:text-9xl font-display font-medium leading-[0.9] tracking-tight text-charcoal-900 dark:text-white uppercase"
            >
              {heading} <span className="text-accent-gold italic font-light">{headingHighlight}</span>
            </h1>
          </div>
          
          {/* Subtitle & CTA */}
          <div className="max-w-sm flex flex-col gap-8 pb-4 lg:pb-8">
            <p 
              ref={subtitleRef}
              className="text-lg md:text-xl text-charcoal-600 dark:text-gray-400 leading-relaxed font-sans"
            >
              {subheading}
            </p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView()}
                className="group flex items-center gap-4 text-sm font-bold tracking-widest uppercase text-charcoal-900 dark:text-white hover:text-accent-gold dark:hover:text-accent-gold transition-colors"
              >
                <span>Discover Work</span>
                <span className="w-10 h-10 rounded-full border border-charcoal-900/20 dark:border-white/20 flex items-center justify-center group-hover:border-accent-gold transition-colors">
                  <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                </span>
              </button>
            </motion.div>
          </div>
          
        </div>
      </div>
      
    </section>
  );
};

export default Hero;
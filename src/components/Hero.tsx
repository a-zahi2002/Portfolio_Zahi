// CYBER TERMINAL THEME
// Hero.tsx — Full-viewport cinematic hero with 3D background integration.
// CMS hooks, data, props, handlers: UNTOUCHED.

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, FileText } from 'lucide-react';
import { useHeroSection } from '../hooks/cms/useHeroSection';
import { useSiteSettings } from '../hooks/cms/useSiteSettings';
import { useAudio } from './audio/AudioProvider';

// ── Magnetic Button ──────────────────────────────────────────────────────────
const MagneticButton = ({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { playClick } = useAudio();

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    ref.current.style.transform = `translate(${middleX * 0.15}px, ${middleY * 0.15}px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = 'translate(0px, 0px)';
  };

  const handleClick = () => {
    playClick();
    onClick();
  };

  return (
    <button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={handleClick}
      className={`cyber-button-filled group relative flex items-center justify-center gap-3 px-10 py-5 rounded-full font-bold tracking-wide overflow-hidden transition-all duration-300 hover:scale-105 ${className}`}
      style={{ transition: 'transform 0.2s ease-out, box-shadow 0.3s ease, scale 0.3s ease' }}
    >
      <span className="relative z-10">{children}</span>
      <ArrowDown className="relative z-10 w-4 h-4 group-hover:translate-y-1 transition-transform" />
    </button>
  );
};

// ── Skeleton ────────────────────────────────────────────────────────────────
const HeroSkeleton: React.FC = () => (
  <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
      <div className="mb-8 space-y-4 animate-pulse">
        <div className="h-16 md:h-24 bg-white/5 rounded-2xl w-3/4 mx-auto" />
        <div className="h-1 w-24 mx-auto bg-white/5 rounded-full" />
      </div>
    </div>
  </section>
);

// ── Hero Component ──────────────────────────────────────────────────────────
const Hero: React.FC = () => {
  const { data: hero, isLoading } = useHeroSection();
  const { data: settings } = useSiteSettings();

  if (isLoading) return <HeroSkeleton />;

  const heading = hero?.heading ?? 'A. Zahi';
  const headingHighlight = hero?.heading_highlight ?? 'Faleel';
  const subheading = hero?.subheading ?? 'Crafting intuitive and immersive digital experiences bridging robust engineering with elegant design.';
  const ctaText = hero?.cta_text ?? 'Explore Work';
  const ctaTarget = hero?.cta_scroll_target ?? 'projects';
  const availabilityStatus = hero?.availability_status ?? true;
  const availabilityLabel = hero?.availability_label ?? 'OPEN TO WORK';

  return (
    <section
      id="hero"
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden"
    >
      {/* Content — sits above the 3D canvas */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
        {/* Availability Badge */}
        {availabilityStatus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-cyber"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-300">
              {availabilityLabel}
            </span>
          </motion.div>
        )}

        {/* Heading — cinematic entrance */}
        <div className="mb-6 overflow-hidden py-2">
          <motion.h1
            initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-[7rem] font-display font-bold tracking-tighter text-charcoal-900 dark:text-white leading-[1.05]"
          >
            {heading}{' '}
            <span className="text-gradient-cyber">
              {headingHighlight}
            </span>
          </motion.h1>
        </div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-2xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-sans"
        >
          {subheading}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <MagneticButton
            onClick={() => document.getElementById(ctaTarget)?.scrollIntoView({ behavior: 'smooth' })}
          >
            {ctaText}
          </MagneticButton>

          {settings?.resume_url && (
            <a
              href={settings.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-button flex items-center gap-2"
            >
              Resume
              <FileText className="w-4 h-4" />
            </a>
          )}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        aria-hidden="true"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
          Scroll
        </span>
        <div className="indicator-line" />
      </motion.div>
    </section>
  );
};

export default Hero;
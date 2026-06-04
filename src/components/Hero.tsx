// ANIMATION ONLY — does not modify data, props, or CMS logic
// Hero.tsx — original component props, handlers, and CMS data unchanged.
// Animation layer is additive via data attributes + useHeroAnimation hook.

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, FileText } from 'lucide-react';
import { useHeroSection } from '../hooks/cms/useHeroSection';
import { useSiteSettings } from '../hooks/cms/useSiteSettings';
import { useHeroAnimation } from '../hooks/animations/useHeroAnimation';

const MagneticButton = ({ onClick }: { onClick: () => void }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.25, y: middleY * 0.25 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onClick={onClick}
      className="group relative w-32 h-32 md:w-36 md:h-36 rounded-full flex flex-col items-center justify-center p-4 border border-charcoal-900/10 dark:border-white/10 hover:border-charcoal-900/30 dark:hover:border-white/30 bg-white/20 dark:bg-white/5 backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(0,0,0,0.03)] dark:shadow-[0_0_30px_rgba(255,255,255,0.02)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--universe-accent)]/10 to-[var(--universe-accent-secondary)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <span className="font-mono text-[9px] font-bold tracking-[0.25em] text-charcoal-800 dark:text-gray-300 group-hover:text-[var(--universe-accent)] transition-colors mb-1 uppercase leading-none">
        Explore
      </span>
      <span className="font-display text-[10px] font-bold tracking-[0.3em] text-charcoal-900 dark:text-white group-hover:text-[var(--universe-accent)] transition-colors uppercase leading-none">
        Work
      </span>
      
      <div className="absolute w-[82%] h-[82%] rounded-full border border-dashed border-charcoal-900/10 dark:border-white/10 group-hover:border-[var(--universe-accent)]/30 group-hover:animate-spin pointer-events-none" style={{ animationDuration: '18s' }} />

      <ArrowDown className="w-3.5 h-3.5 mt-2 text-charcoal-600 dark:text-gray-400 group-hover:text-[var(--universe-accent)] group-hover:translate-y-1 transition-all duration-300" />
    </motion.button>
  );
};

const FloatingShape = ({ className, delay = 0, yOffset = 20 }: { className: string; delay?: number; yOffset?: number }) => (
  <motion.div
    animate={{
      y: [0, yOffset, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay
    }}
    className={`absolute pointer-events-none rounded-3xl backdrop-blur-2xl border border-white/20 shadow-2xl ${className}`}
  />
);

const HeroSkeleton: React.FC = () => (
  <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
      <div className="mb-8 space-y-4 animate-pulse">
        <div className="h-16 md:h-24 bg-charcoal-900/5 dark:bg-white/5 rounded-2xl w-3/4 mx-auto" />
        <div className="h-1 w-24 mx-auto bg-charcoal-900/5 dark:bg-white/5 rounded-full" />
      </div>
    </div>
  </section>
);

const Hero: React.FC = () => {
  const { data: hero, isLoading } = useHeroSection();
  const { data: settings } = useSiteSettings();

  // ── Animation refs ─────────────────────────────────────────────────────
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useHeroAnimation(
    { sectionRef, headingRef, subheadingRef, contentRef, scrollIndicatorRef, overlayRef },
    isLoading ?? false,
  );

  if (isLoading) return <HeroSkeleton />;

  const heading = hero?.heading ?? 'A. Zahi';
  const headingHighlight = hero?.heading_highlight ?? 'Faleel';
  const subheading = hero?.subheading ?? 'Crafting intuitive and immersive digital experiences bridging robust engineering with elegant design.';
  const ctaTarget = hero?.cta_scroll_target ?? 'projects';
  const availabilityStatus = hero?.availability_status ?? true;
  const availabilityLabel = hero?.availability_label ?? 'OPEN TO WORK';

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent"
    >
      {/* ── Ambient Mesh Gradient (CSS only, pure additive) ── */}
      <div className="hero-mesh-gradient" aria-hidden="true">
        <div className="mesh-blob-3" />
        <div className="mesh-blob-4" />
      </div>

      {/* ── Blur overlay that fades IN as hero exits (pin phase) ── */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* ── Stellar Planet Sphere Behind Content ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-visible" aria-hidden="true">
        {/* Atmospheric Backing Glow */}
        <div 
          className="absolute w-[300px] h-[300px] md:w-[475px] md:h-[475px] lg:w-[580px] lg:h-[580px] rounded-full pointer-events-none blur-[40px] opacity-75 dark:opacity-90 transition-all duration-700 parallax-slow"
          style={{
            background: 'radial-gradient(circle at 75% 25%, var(--universe-accent) 0%, var(--universe-accent-secondary) 35%, transparent 70%)'
          }}
        />

        {/* Central Planet Body (Quartz-glass on light mode, Eclipse on dark mode) */}
        <div className="absolute w-[260px] h-[260px] md:w-[420px] md:h-[420px] lg:w-[500px] lg:h-[500px] rounded-full overflow-hidden border border-charcoal-200/20 dark:border-white/5 
          bg-gradient-to-tr from-white/30 via-white/80 to-white/10 dark:bg-[#020204] 
          backdrop-blur-[8px] dark:backdrop-blur-none
          shadow-[inset_-12px_12px_30px_rgba(255,255,255,0.7),_inset_12px_-12px_30px_rgba(var(--universe-accent-rgb),0.12),_0_20px_50px_rgba(0,0,0,0.06)] 
          dark:shadow-[inset_-12px_12px_50px_rgba(255,255,255,0.04),_inset_35px_-35px_80px_rgba(var(--universe-accent-rgb),0.35)] 
          transition-all duration-700 parallax-slow"
        >
          {/* Internal space gas/clouds */}
          <div className="absolute inset-0 opacity-20 dark:opacity-35 mix-blend-color-dodge animate-spin-slow" 
               style={{ 
                 animationDuration: '180s',
                 backgroundImage: 'radial-gradient(circle, var(--universe-accent) 0%, transparent 60%), repeating-radial-gradient(circle, transparent, transparent 15px, rgba(255,255,255,0.03) 15px, rgba(255,255,255,0.03) 30px)' 
               }} 
          />
          {/* Eclipse shading for dark mode */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/85 to-transparent pointer-events-none hidden dark:block" />
          {/* Subtle starry points in the shadow */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40 mix-blend-screen hidden dark:block" />
        </div>
      </div>

      {/* Floating Glass Shapes with Antigravity Parallax */}
      <div className="absolute top-[20%] left-[10%] w-32 h-32 parallax-slow pointer-events-none">
        <FloatingShape className="w-full h-full bg-blue-500/10 dark:bg-white/5 rotate-12" delay={0} yOffset={30} />
      </div>
      <div className="absolute bottom-[20%] right-[10%] w-48 h-48 parallax-medium pointer-events-none">
        <FloatingShape className="w-full h-full bg-purple-500/10 dark:bg-white/5 -rotate-12 rounded-full" delay={1} yOffset={-40} />
      </div>
      <div className="absolute top-[30%] right-[20%] w-24 h-24 parallax-fast pointer-events-none">
        <FloatingShape className="w-full h-full bg-cyan-500/10 dark:bg-white/5 rotate-45" delay={2} yOffset={20} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none opacity-50" />

      {/* Main Content — this entire div is the parallax target */}
      <div ref={contentRef} className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center" style={{ willChange: 'transform, opacity' }}>
        
        {/* Availability Badge */}
        {availabilityStatus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 dark:bg-white/5 border border-charcoal-900/10 dark:border-white/10 backdrop-blur-md shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-xs font-bold uppercase tracking-widest text-charcoal-700 dark:text-gray-300">
              {availabilityLabel}
            </span>
          </motion.div>
        )}

        {/* Heading with Mask Reveal — data-hero-heading for GSAP ScrambleText */}
        <div className="mb-4 overflow-hidden py-2">
          <h1
            ref={headingRef}
            data-hero-heading
            style={{ opacity: 0 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-[0.1em] text-charcoal-900 dark:text-white leading-[1.1] uppercase"
          >
            <span className="hero-name-base">{heading}</span>{' '}
            <span className="hero-name-highlight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-accent-cyan dark:to-accent-purple drop-shadow-sm">
              {headingHighlight}
            </span>
          </h1>
        </div>

        {/* Subheading — data-hero-subheading for ScrambleText */}
        <p
          ref={subheadingRef}
          data-hero-subheading
          style={{ opacity: 0 }}
          className="text-lg md:text-xl text-charcoal-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed font-sans whitespace-pre-line"
        >
          {subheading}
        </p>

        {/* Buttons */}
        <div
          data-hero-buttons
          style={{ opacity: 0 }}
          className="flex flex-row items-center gap-6 md:gap-10 mt-2"
        >
          <MagneticButton onClick={() => document.getElementById(ctaTarget)?.scrollIntoView({ behavior: 'smooth' })} />

          {settings?.resume_url && (
            <a
              href={settings.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-charcoal-700 dark:text-gray-300 border border-charcoal-900/10 dark:border-white/10 hover:border-[var(--universe-accent)]/30 hover:text-[var(--universe-accent)] hover:bg-charcoal-900/5 dark:hover:bg-white/5 transition-all duration-300 shadow-sm"
            >
              Resume
              <FileText className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* ── Scroll Indicator (animated via useHeroAnimation) ── */}
      <div
        ref={scrollIndicatorRef}
        className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        aria-hidden="true"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-400 dark:text-gray-500">Scroll</span>
        <div className="indicator-line" />
      </div>
    </section>
  );
};

export default Hero;
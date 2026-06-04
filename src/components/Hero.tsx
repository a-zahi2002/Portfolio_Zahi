// JARVIS-OS THEME — animation only
// Hero.tsx — additive JARVIS animations: targeting reticle, name scramble+reveal,
// typing cursor on role, identity scan sweep line, and hero pin.
// CMS hooks, data, props, handlers: UNTOUCHED.

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, FileText } from 'lucide-react';
import { useHeroSection } from '../hooks/cms/useHeroSection';
import { useSiteSettings } from '../hooks/cms/useSiteSettings';
import { gsap, ScrollTrigger, SplitText, ScrambleTextPlugin } from '../lib/gsap-config';

const MagneticButton = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
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
      className="group relative flex items-center justify-center gap-3 px-10 py-5 bg-charcoal-900 dark:bg-white text-white dark:text-charcoal-900 rounded-full font-bold tracking-wide overflow-hidden hover:scale-105 shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(255,255,255,0.1)]"
    >
      <span className="relative z-10">{children}</span>
      <ArrowDown className="relative z-10 w-4 h-4 group-hover:translate-y-1 transition-transform" />
    </motion.button>
  );
};

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
  const reticleRef = useRef<SVGSVGElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (isLoading) return;

    const section = sectionRef.current;
    const heading = headingRef.current;
    const subheading = subheadingRef.current;
    const content = contentRef.current;
    const indicator = scrollIndicatorRef.current;
    const reticle = reticleRef.current;
    const scanLine = scanLineRef.current;

    if (!section || !heading || !content) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        // Jump to final state
        gsap.set([heading, subheading, content, indicator, reticle], {
          opacity: 1, y: 0, filter: 'blur(0px)', clearProps: 'all',
        });
        return;
      }

      // ── 1. Targeting Reticle ───────────────────────────────────────────
      if (reticle && !isMobile) {
        const outerCircle = reticle.querySelector('.reticle-outer') as SVGCircleElement;
        const innerCircle = reticle.querySelector('.reticle-inner') as SVGCircleElement;
        const ticks = reticle.querySelectorAll('.reticle-tick');

        if (outerCircle && innerCircle) {
          gsap.set([outerCircle, innerCircle], { drawSVG: '0%', opacity: 1 });
          gsap.set(ticks, { scale: 0, opacity: 0, transformOrigin: 'center center' });

          gsap.to(outerCircle, { drawSVG: '100%', duration: 0.8, ease: 'power2.out' });
          gsap.to(innerCircle, { drawSVG: '100%', duration: 0.6, ease: 'power2.out', delay: 0.2 });
          gsap.to(ticks, {
            scale: 1, opacity: 1, duration: 0.3, stagger: 0.05,
            ease: 'back.out(2)', delay: 0.4,
          });

          // Slow rotation — infinite
          gsap.to(outerCircle, {
            rotation: 360, duration: 30, ease: 'none', repeat: -1,
            transformOrigin: '150px 150px',
          });
          gsap.to(innerCircle, {
            rotation: -360, duration: 60, ease: 'none', repeat: -1,
            transformOrigin: '150px 150px',
          });
        }
      }

      // ── 2. Name reveal — ScrambleText pass then SplitText chars ───────
      if (heading) {
        const split = new SplitText(heading, { type: 'chars' });
        gsap.set(split.chars, { opacity: 0, y: 20, filter: 'blur(4px)' });

        gsap.to(heading, {
          scrambleText: { text: heading.textContent ?? '', chars: 'upperCase', speed: 0.8 },
          duration: 0.2,
          onComplete: () => {
            gsap.to(split.chars, {
              opacity: 1, y: 0, filter: 'blur(0px)',
              duration: 0.6, stagger: 0.04, ease: 'power3.out',
            });
          },
        });
      }

      // ── 3. Subheading: typing cursor class + fade in ─────────────────
      if (subheading) {
        subheading.classList.add('j-typing-cursor');
        gsap.fromTo(subheading,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power3.out',
            onComplete: () => {
              // Blink cursor 3 times then remove
              setTimeout(() => {
                subheading.classList.remove('j-typing-cursor');
                subheading.classList.add('j-typing-done');
              }, 2100);
            },
          }
        );
      }

      // ── 4. Buttons + scroll indicator fade in ────────────────────────
      if (content) {
        const buttons = content.querySelectorAll('.flex.flex-col, .flex.flex-col.sm\\:flex-row');
        gsap.fromTo(buttons,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.8, ease: 'power3.out' }
        );
      }

      if (indicator) {
        gsap.fromTo(indicator,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, delay: 1.2 }
        );
      }

      // ── 5. Identity scan sweep line ──────────────────────────────────
      if (scanLine) {
        gsap.set(scanLine, { opacity: 0 });
        gsap.to(scanLine, {
          opacity: 1, duration: 0.1, delay: 1.0,
          onComplete: () => {
            gsap.to(scanLine, {
              y: '100vh', duration: 0.8, ease: 'none', delay: 0,
              onComplete: () => {
                gsap.to(scanLine, { opacity: 0, duration: 0.1 });
              },
            });
          },
        });
      }

      // ── 6. Hero Pin (80vh) — skip on mobile ──────────────────────────
      if (!isMobile) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: '+=80vh',
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => {
            const p = self.progress;
            // Reticle scale up
            if (reticle) gsap.set(reticle, { scale: 1 + p * 0.15, transformOrigin: 'center center' });
            // Text fade out
            if (content) gsap.set(content, { y: -40 * p, opacity: 1 - p });
            // Increase grid speed for parallax feel
            document.documentElement.style.setProperty(
              '--j-grid-speed', `${Math.max(2, 12 - p * 10)}s`
            );
          },
          onLeave: () => {
            document.documentElement.style.setProperty('--j-grid-speed', '12s');
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [isLoading]);

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
      ref={sectionRef}
      className="relative min-h-[95vh] flex items-center justify-center overflow-hidden"
    >
      {/* ── Targeting Reticle SVG — JARVIS identity scan ─────────── */}
      <svg
        ref={reticleRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          height: 300,
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.25,
        }}
        viewBox="0 0 300 300"
      >
        {/* Outer circle */}
        <circle
          className="reticle-outer"
          cx={150} cy={150} r={135}
          fill="none"
          stroke="var(--j-cyan)"
          strokeWidth={1}
          strokeOpacity={0.6}
        />
        {/* Inner circle */}
        <circle
          className="reticle-inner"
          cx={150} cy={150} r={50}
          fill="none"
          stroke="var(--j-cyan)"
          strokeWidth={1}
          strokeOpacity={0.6}
        />
        {/* 4 L-shaped tick marks at corners */}
        {[[-1,-1],[1,-1],[1,1],[-1,1]].map(([sx,sy], i) => {
          const bx = 150 + sx * 120;
          const by = 150 + sy * 120;
          return (
            <g key={i} className="reticle-tick" style={{ opacity: 0 }}>
              <line x1={bx} y1={by} x2={bx - sx * 14} y2={by} stroke="var(--j-cyan)" strokeWidth={1.5} />
              <line x1={bx} y1={by} x2={bx} y2={by - sy * 14} stroke="var(--j-cyan)" strokeWidth={1.5} />
            </g>
          );
        })}
      </svg>

      {/* ── Identity Scan Sweep Line ─────────────────────────────── */}
      <div
        ref={scanLineRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'var(--j-cyan)',
          opacity: 0,
          zIndex: 20,
          boxShadow: '0 0 12px var(--j-cyan-glow)',
          pointerEvents: 'none',
        }}
      />

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

      {/* Main Content */}
      <div ref={contentRef} className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center" style={{ willChange: 'transform, opacity' }}>
        
        {/* Availability Badge */}
        {availabilityStatus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 dark:bg-white/5 border border-charcoal-900/10 dark:border-white/10 backdrop-blur-md shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-xs font-bold uppercase tracking-widest text-charcoal-700 dark:text-gray-300">
              {availabilityLabel}
            </span>
          </motion.div>
        )}

        {/* Heading — data-hero-heading for GSAP ScrambleText */}
        <div className="mb-6 overflow-hidden py-2">
          <h1
            ref={headingRef}
            data-hero-heading
            className="text-6xl md:text-8xl lg:text-[7rem] font-display font-bold tracking-tighter text-charcoal-900 dark:text-white leading-[1.1]"
          >
            {heading}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-accent-cyan dark:to-accent-purple drop-shadow-sm">
              {headingHighlight}
            </span>
          </h1>
        </div>

        {/* Subheading — typing cursor added via GSAP */}
        <p
          ref={subheadingRef}
          data-hero-subheading
          className="text-lg md:text-2xl text-charcoal-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-sans whitespace-pre-line"
        >
          {subheading}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <MagneticButton onClick={() => document.getElementById(ctaTarget)?.scrollIntoView({ behavior: 'smooth' })}>
            {ctaText}
          </MagneticButton>

          {settings?.resume_url && (
            <a
              href={settings.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-charcoal-900 dark:text-white border-2 border-charcoal-900/10 dark:border-white/10 hover:border-charcoal-900/30 dark:hover:border-white/30 hover:bg-charcoal-900/5 dark:hover:bg-white/5 transition-all duration-300"
            >
              Resume
              <FileText className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* ── Scroll Indicator ── */}
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
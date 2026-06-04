// JARVIS-OS THEME — animation only
// Projects.tsx — additive JARVIS enhancements:
//   - Section header: ScrambleText "SCANNING..." → "ARTIFACT_REGISTRY — N RECORDS FOUND"
//   - Card label row: ARTIFACT_ID + CLASS metadata
//   - Card entrance: opacity/y/blur + border-top color flash (red→amber→cyan)
//   - Card hover: TARGET ACQUIRED label, amber border, scanBeep audio
//   - Scanning beam: horizontal line sweeping section top-to-bottom
// CMS hooks, data, card click handlers: UNTOUCHED.

import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useProjects } from '../hooks/cms/useProjects';
import type { CMSProject } from '../types/cms';
import { gsap, ScrollTrigger } from '../lib/gsap-config';
import { JarvisAudio } from '../lib/JarvisAudio';

// ── Skeleton card ─────────────────────────────────────────────────────────────
const ProjectCardSkeleton: React.FC<{ wide?: boolean }> = ({ wide }) => (
  <div className={`rounded-3xl bg-white dark:bg-charcoal-800 border border-gray-200 dark:border-white/5 overflow-hidden animate-pulse ${wide ? 'md:col-span-2' : ''}`}>
    <div className="w-full h-full bg-gray-100 dark:bg-white/5 min-h-[400px]" />
  </div>
);

// ── Spotlight Card with JARVIS overlay ───────────────────────────────────────
const SpotlightCard: React.FC<{ project: CMSProject; wide: boolean; index: number }> = ({ project, wide, index }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const borderTopRef = useRef<HTMLDivElement>(null);
  const targetLabelRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // ── Entrance animation ─────────────────────────────────────────────────────
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const borderTop = borderTopRef.current;
    if (!wrapper || !borderTop) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set(wrapper, { opacity: 1, y: 0, filter: 'blur(0px)' });
        gsap.set(borderTop, { backgroundColor: 'var(--j-cyan)' });
        return;
      }

      gsap.set(wrapper, { opacity: 0, y: 30, filter: 'blur(3px)' });
      gsap.set(borderTop, { backgroundColor: 'var(--j-red)' });

      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(wrapper, {
            opacity: 1, y: 0, filter: 'blur(0px)',
            duration: 0.5, delay: index * 0.1, ease: 'power3.out',
          });
          // Border-top color flash: red → amber → cyan
          gsap.to(borderTop, { backgroundColor: 'var(--j-amber)', duration: 0.2, delay: index * 0.1 + 0.1 });
          gsap.to(borderTop, { backgroundColor: 'var(--j-cyan)', duration: 0.3, delay: index * 0.1 + 0.3 });
        },
      });
    }, wrapper);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // ── Hover: TARGET ACQUIRED ─────────────────────────────────────────────────
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (borderTopRef.current) {
      gsap.to(borderTopRef.current, { backgroundColor: 'var(--j-amber)', duration: 0.2 });
    }
    if (wrapperRef.current) {
      gsap.to(wrapperRef.current, {
        boxShadow: `0 0 20px var(--j-amber-dim)`,
        duration: 0.2,
      });
    }
    if (targetLabelRef.current) {
      gsap.to(targetLabelRef.current, { opacity: 1, duration: 0.2 });
    }
    JarvisAudio.scanBeepCooled(wrapperRef.current!);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (borderTopRef.current) {
      gsap.to(borderTopRef.current, { backgroundColor: 'var(--j-cyan)', duration: 0.3 });
    }
    if (wrapperRef.current) {
      gsap.to(wrapperRef.current, { boxShadow: 'none', duration: 0.3 });
    }
    if (targetLabelRef.current) {
      gsap.to(targetLabelRef.current, { opacity: 0, duration: 0.2 });
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative ${wide ? 'md:col-span-2' : ''}`}
      style={{
        border: '1px solid var(--j-border)',
        background: 'var(--j-bg-panel)',
        overflow: 'hidden',
        opacity: 0,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top metadata label row */}
      <div
        style={{
          fontFamily: 'var(--j-font-mono)',
          fontSize: 10,
          color: 'var(--j-text-dim)',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '6px 12px',
          borderBottom: '1px solid var(--j-border)',
        }}
        aria-hidden="true"
      >
        <span style={{ color: 'var(--j-cyan)' }}>
          [ ARTIFACT_ID: PRJ_{String(index + 1).padStart(3, '0')} ]
        </span>
        <span style={{ color: 'var(--j-cyan)' }}>[ CLASS: SOFTWARE ]</span>
      </div>

      {/* Border-top accent line — color flashes on entrance */}
      <div
        ref={borderTopRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 30, // below the metadata bar
          left: 0,
          right: 0,
          height: 2,
          backgroundColor: 'var(--j-red)',
          zIndex: 5,
        }}
      />

      {/* TARGET ACQUIRED label */}
      <div
        ref={targetLabelRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 40,
          right: 12,
          fontFamily: 'var(--j-font-mono)',
          fontSize: 9,
          color: 'var(--j-amber)',
          letterSpacing: '0.1em',
          opacity: 0,
          zIndex: 30,
          pointerEvents: 'none',
        }}
      >
        [ TARGET ACQUIRED ]
      </div>

      {/* Spotlight card — the original SpotlightCard content */}
      <motion.div
        data-project-card
        onMouseMove={handleMouseMove}
        ref={cardRef}
        className="group relative overflow-hidden min-h-[400px]"
      >
        {/* Spotlight Effect */}
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-20 mix-blend-overlay dark:mix-blend-screen"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                600px circle at ${mouseX}px ${mouseY}px,
                rgba(59, 130, 246, 0.15),
                transparent 80%
              )
            `,
          }}
        />

        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full h-full object-cover opacity-90 dark:opacity-50 group-hover:opacity-100 dark:group-hover:opacity-80 group-hover:scale-110 transition-transform duration-1000 ease-out"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent dark:from-charcoal-950 dark:via-charcoal-950/70 dark:to-transparent pointer-events-none opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
        </div>

        <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end pointer-events-none">
          <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
            <div className="flex justify-between items-start mb-4 pointer-events-auto">
              <div className="flex gap-2 flex-wrap">
                {project.technologies.slice(0, 3).map(tech => (
                  <span key={tech} className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white bg-white/10 border border-white/20 backdrop-blur-md rounded-full shadow-sm">
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white bg-white/10 border border-white/20 backdrop-blur-md rounded-full shadow-sm">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {(project.live_url || project.github_url) && (
                  <a href={project.live_url || project.github_url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 hover:bg-white/30 border border-white/20 rounded-full text-white backdrop-blur-md transition-all shadow-sm group-hover:bg-blue-600 dark:group-hover:bg-accent-cyan dark:group-hover:text-charcoal-900 group-hover:border-transparent group-hover:scale-110">
                    <ArrowUpRight size={18} />
                  </a>
                )}
              </div>
            </div>

            <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 pointer-events-auto">{project.title}</h3>
            <p className="text-gray-300 dark:text-gray-400 line-clamp-2 text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 pointer-events-auto">
              {project.description}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Bottom signal meter */}
      <div
        style={{
          fontFamily: 'var(--j-font-mono)',
          fontSize: 10,
          color: 'var(--j-text-dim)',
          padding: '5px 12px',
          borderTop: '1px solid var(--j-border)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
        aria-hidden="true"
      >
        <span style={{ color: 'var(--j-cyan)' }}>[ SIGNAL:</span>
        <span style={{ color: 'var(--j-cyan)', letterSpacing: 1 }}>████████░░</span>
        <span style={{ color: 'var(--j-cyan)' }}>80% ]</span>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const Projects: React.FC = () => {
  const { data: projects, isLoading } = useProjects();

  // ── Animation refs ──────────────────────────────────────────
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scanBeamRef = useRef<HTMLDivElement>(null);
  const scanBeepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const beam = scanBeamRef.current;
    if (!section || !header || !beam) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set(header, { opacity: 1 });
        return;
      }

      // ── Section header ScrambleText ───────────────────────────────
      gsap.set(header, { opacity: 0 });
      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        once: true,
        onEnter: () => {
          const count = (projects ?? []).length;
          gsap.to(header, { opacity: 1, duration: 0.1 });
          gsap.to(header, {
            scrambleText: { text: '[ SCANNING FOR ARTIFACTS... ]', chars: 'upperCase', speed: 1 },
            duration: 0.5,
            onComplete: () => {
              gsap.to(header, {
                scrambleText: {
                  text: `[ ARTIFACT_REGISTRY — ${count} RECORDS FOUND ]`,
                  chars: 'upperCase',
                  speed: 2,
                },
                duration: 0.3,
                delay: 0.3,
              });
            },
          });
        },
      });

      // ── Scanning beam ─────────────────────────────────────────────
      let beamAnim: gsap.core.Tween | null = null;

      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => {
          gsap.set(beam, { display: 'block', y: '0%', opacity: 0.5 });
          beamAnim = gsap.to(beam, {
            y: '100%',
            duration: 3,
            ease: 'none',
            repeat: -1,
          });
          // scanBeep loop
          scanBeepIntervalRef.current = setInterval(() => {
            JarvisAudio.scanBeep();
          }, 2800);
        },
        onLeave: () => {
          beamAnim?.pause();
          gsap.set(beam, { display: 'none' });
          if (scanBeepIntervalRef.current) {
            clearInterval(scanBeepIntervalRef.current);
            scanBeepIntervalRef.current = null;
          }
        },
        onEnterBack: () => {
          gsap.set(beam, { display: 'block' });
          beamAnim?.resume();
          if (!scanBeepIntervalRef.current) {
            scanBeepIntervalRef.current = setInterval(() => {
              JarvisAudio.scanBeep();
            }, 2800);
          }
        },
        onLeaveBack: () => {
          beamAnim?.pause();
          gsap.set(beam, { display: 'none' });
          if (scanBeepIntervalRef.current) {
            clearInterval(scanBeepIntervalRef.current);
            scanBeepIntervalRef.current = null;
          }
        },
      });
    }, section);

    return () => {
      ctx.revert();
      if (scanBeepIntervalRef.current) clearInterval(scanBeepIntervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects?.length]);

  return (
    <section id="projects" ref={sectionRef} className="py-32 relative">
      {/* ── JARVIS: Scanning beam ─────────────────────────────────── */}
      <div
        ref={scanBeamRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: 'var(--j-cyan)',
          opacity: 0,
          boxShadow: '0 0 8px var(--j-cyan-glow)',
          display: 'none',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* ── JARVIS: Section header with ScrambleText ──────────────── */}
        <div
          ref={headerRef}
          aria-hidden="true"
          style={{
            fontFamily: 'var(--j-font-mono)',
            fontSize: 11,
            color: 'var(--j-cyan)',
            letterSpacing: '0.1em',
            marginBottom: 16,
            opacity: 0,
          }}
        >
          &nbsp;
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4 text-charcoal-900 dark:text-white">
            Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-accent-cyan dark:to-blue-400">Works</span>
          </h2>
          <p className="text-charcoal-600 dark:text-gray-400 max-w-xl text-lg font-sans">
            A showcase of recent production-ready applications and technical experiments.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]">
          {isLoading
            ? [true, false, false, true, false, false].map((wide, i) => <ProjectCardSkeleton key={i} wide={wide} />)
            : (projects ?? []).map((project, index) => (
                <SpotlightCard
                  key={project.id}
                  project={project}
                  index={index}
                  wide={project.featured || index === 0 || index === 3}
                />
              ))
          }
        </div>
      </div>
    </section>
  );
};

export default Projects;
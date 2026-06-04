// JARVIS-OS THEME — animation only
// About.tsx — additive JARVIS enhancements:
//   - "ANALYZING..." → "ANALYSIS COMPLETE" status line above panel
//   - Data panel clip-path reveal
//   - Bio text SplitText word-by-word data readout
//   - Profile image scan overlay (CSS animation via j-image-scan-overlay class)
// CMS hooks, data, props, handlers: UNTOUCHED.

import React, { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Layout, Smartphone, Code, Zap } from 'lucide-react';
import { useAboutSection } from '../hooks/cms/useAboutSection';
import { useSiteSettings } from '../hooks/cms/useSiteSettings';
import { parseMarkdown } from '../utils/markdown';
import { gsap, SplitText, ScrollTrigger } from '../lib/gsap-config';

// Map icon name strings to Lucide components
const ICON_MAP: Record<string, React.ReactNode> = {
  Code: <Code className="text-blue-600 dark:text-accent-cyan shrink-0" />,
  Zap: <Zap className="text-purple-600 dark:text-accent-purple shrink-0" />,
  Layout: <Layout className="text-blue-600 dark:text-accent-cyan shrink-0" />,
  Smartphone: <Smartphone className="text-purple-600 dark:text-accent-purple shrink-0" />,
};

const About: React.FC = () => {
  const { data: about, isLoading } = useAboutSection();
  const { data: settings } = useSiteSettings();

  // ── Animation refs ─────────────────────────────────────────────────
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const bioSecRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const statusLineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (isLoading) return;

    const section = sectionRef.current;
    const panel = panelRef.current;
    const statusLine = statusLineRef.current;
    const bioEl = bioRef.current;
    const bioSecEl = bioSecRef.current;

    if (!section || !panel) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set([panel, statusLine], { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' });
        return;
      }

      // ── Status line: "ANALYZING..." → "ANALYSIS COMPLETE" ────────────
      if (statusLine) {
        gsap.set(statusLine, { opacity: 0 });
        ScrollTrigger.create({
          trigger: section,
          start: 'top 70%',
          once: true,
          onEnter: () => {
            gsap.to(statusLine, { opacity: 1, duration: 0.2 });
            gsap.to(statusLine, {
              scrambleText: { text: '[ RUNNING BIO_ANALYSIS... ]', chars: 'upperCase', speed: 1 },
              duration: 0.4,
              onComplete: () => {
                setTimeout(() => {
                  if (statusLine) {
                    gsap.to(statusLine, {
                      scrambleText: { text: '[ ANALYSIS COMPLETE ]', chars: 'upperCase', speed: 2 },
                      duration: 0.3,
                    });
                    gsap.to(statusLine, { color: 'var(--j-green)', duration: 0.3 });
                  }
                }, 500);
              },
            });
          },
        });
      }

      // ── Data panel clip-path reveal ───────────────────────────────────
      gsap.set(panel, { clipPath: 'inset(50% 50% 50% 50%)', opacity: 0 });

      ScrollTrigger.create({
        trigger: panel,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.to(panel, {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
          });

          // Bio text word-by-word data readout
          if (bioEl) {
            const split = new SplitText(bioEl, { type: 'words' });
            gsap.fromTo(split.words,
              { opacity: 0, x: -6 },
              { opacity: 1, x: 0, stagger: 0.025, duration: 0.4, delay: 0.3, ease: 'power2.out' }
            );
          }
          if (bioSecEl) {
            const splitSec = new SplitText(bioSecEl, { type: 'words' });
            gsap.fromTo(splitSec.words,
              { opacity: 0, x: -6 },
              { opacity: 1, x: 0, stagger: 0.02, duration: 0.4, delay: 0.6, ease: 'power2.out' }
            );
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, [isLoading]);

  // Fallback values
  const title = about?.title ?? 'About';
  const titleHighlight = about?.title_highlight ?? 'Me';
  const bioPrimary = about?.bio_primary ?? 'I am a passionate **Creative Developer** dedicated to building immersive web experiences. My work bridges the gap between robust engineering and elegant design, ensuring every pixel serves a purpose.';
  const bioSecondary = about?.bio_secondary ?? 'With a strong foundation in modern web technologies, I focus on performance, accessibility, and creating interfaces that feel "alive" through subtle interactions and 3D elements.';
  const profileImageUrl = about?.profile_image_url ?? './assets/profile.jpg';
  const availabilityStatus = about?.availability_status ?? true;
  const availabilityLabel = about?.availability_label ?? 'OPEN TO WORK';
  const highlights = about?.highlights ?? [
    { icon: 'Code', title: 'Clean Code', subtitle: 'Scalable & Maintainable' },
    { icon: 'Zap', title: 'Performance', subtitle: 'Lightning Fast Loads' },
  ];

  return (
    <section id="about" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-accent-purple/20 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none parallax-glow" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* ── JARVIS: "ANALYZING" status line ──────────────────────── */}
        <div
          ref={statusLineRef}
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
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Image Column */}
          <div className="relative group parallax-card">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-accent-cyan dark:to-accent-purple rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
            <div className="relative glass-panel p-2 rounded-2xl overflow-hidden aspect-square max-w-md mx-auto lg:mx-0">
              {isLoading ? (
                <div className="w-full h-full bg-white/5 animate-pulse rounded-xl" />
              ) : (
                <>
                  <img
                    src={profileImageUrl}
                    alt={`${title} ${titleHighlight}`}
                    className="w-full h-full object-cover rounded-xl filter grayscale group-hover:grayscale-0 transition-all duration-500 dark:saturate-[0.8] dark:hue-rotate-[10deg]"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80';
                    }}
                  />
                  {/* ── JARVIS: Bio scan overlay ── */}
                  <div className="j-image-scan-overlay rounded-xl" aria-hidden="true" />
                </>
              )}
              {availabilityStatus && (
                <div className="absolute bottom-6 right-6 glass-panel px-4 py-2 flex items-center gap-2 border border-gray-200 dark:border-white/20">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-semibold tracking-wider text-gray-900 dark:text-white">{availabilityLabel}</span>
                </div>
              )}
            </div>
          </div>

          {/* Text Column */}
          <div>
            <h2 ref={headingRef} className="text-4xl lg:text-5xl font-bold mb-8 text-gray-900 dark:text-white">
              {title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-accent-cyan dark:to-blue-500">{titleHighlight}</span>
            </h2>

            {/* ── JARVIS: Data panel with corner decorations ─────────── */}
            <div
              ref={panelRef}
              className="glass-panel p-8 md:p-10 relative overflow-hidden group border-gray-200 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-accent-cyan/30 transition-colors duration-500 parallax-card"
              style={{ border: '1px solid var(--j-border)', borderRadius: 0 }}
            >
              {/* Corner decorations */}
              <div className="j-panel-corner tl" aria-hidden="true" />
              <div className="j-panel-corner tr" aria-hidden="true" />
              <div className="j-panel-corner bl" aria-hidden="true" />
              <div className="j-panel-corner br" aria-hidden="true" />

              {/* Inner glow */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  boxShadow: 'inset 0 0 40px var(--j-cyan-dim)',
                  pointerEvents: 'none',
                  borderRadius: 0,
                }}
              />

              {isLoading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-white/5 rounded w-full" />
                  <div className="h-4 bg-white/5 rounded w-4/5" />
                  <div className="h-4 bg-white/5 rounded w-3/4 mt-4" />
                </div>
              ) : (
                <>
                  <div
                    ref={bioRef}
                    className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6 relative z-10
                      prose prose-sm dark:prose-invert max-w-none
                      prose-p:mb-4 prose-p:leading-relaxed
                      prose-strong:text-blue-600 dark:prose-strong:text-accent-cyan prose-strong:font-semibold
                      prose-a:text-blue-600 dark:prose-a:text-accent-cyan prose-a:underline hover:opacity-80"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(bioPrimary) }}
                  />
                  {bioSecondary && (
                    <div
                      ref={bioSecRef}
                      data-about-bio
                      className="text-gray-500 dark:text-gray-400 text-base leading-relaxed mb-8 relative z-10
                        prose prose-sm dark:prose-invert max-w-none
                        prose-p:mb-4 prose-p:leading-relaxed
                        prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                        prose-a:text-blue-600 dark:prose-a:text-accent-cyan prose-a:underline hover:opacity-80"
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(bioSecondary) }}
                    />
                  )}
                  {settings?.resume_url && (
                    <div className="mb-8 relative z-10">
                      <a
                        href={settings.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-accent-cyan dark:to-blue-500 text-white font-bold rounded-full shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-accent-cyan/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm group"
                      >
                        <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                        Download CV / Resume
                      </a>
                    </div>
                  )}

                  {highlights.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                      {highlights.map((highlight, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                          {ICON_MAP[highlight.icon] ?? <Code className="text-blue-600 dark:text-accent-cyan shrink-0" />}
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{highlight.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{highlight.subtitle}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

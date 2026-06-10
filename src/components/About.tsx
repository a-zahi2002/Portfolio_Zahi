// CYBER TERMINAL THEME
// About.tsx — Innovative 3D layout with floating holographic layers and glass-cyber data panel.
// CMS hooks, data, props, handlers: UNTOUCHED.

import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Download, Layout, Smartphone, Code, Zap, Cpu } from 'lucide-react';
import { useAboutSection } from '../hooks/cms/useAboutSection';
import { useSiteSettings } from '../hooks/cms/useSiteSettings';
import { parseMarkdown } from '../utils/markdown';

// Map icon name strings to Lucide components
const ICON_MAP: Record<string, React.ReactNode> = {
  Code: <Code className="text-accent-cyan shrink-0" />,
  Zap: <Zap className="text-accent-purple shrink-0" />,
  Layout: <Layout className="text-accent-cyan shrink-0" />,
  Smartphone: <Smartphone className="text-accent-purple shrink-0" />,
};

const About: React.FC = () => {
  const { data: about, isLoading } = useAboutSection();
  const { data: settings } = useSiteSettings();

  // Fallback values
  const title = about?.title ?? 'About';
  const titleHighlight = about?.title_highlight ?? 'Me';
  const bioPrimary = about?.bio_primary ?? 'I am a passionate **Creative Developer** dedicated to building immersive web experiences.';
  const bioSecondary = about?.bio_secondary ?? 'With a strong foundation in modern web technologies, I focus on performance, accessibility, and creating interfaces that feel alive.';
  const profileImageUrl = about?.profile_image_url ?? './assets/profile.jpg';
  const availabilityStatus = about?.availability_status ?? true;
  const availabilityLabel = about?.availability_label ?? 'OPEN TO WORK';
  const highlights = about?.highlights ?? [
    { icon: 'Code', title: 'Clean Code', subtitle: 'Scalable & Maintainable' },
    { icon: 'Zap', title: 'Performance', subtitle: 'Lightning Fast Loads' },
  ];

  // 3D Tilt Logic for Image
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-12deg", "12deg"]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: none)');
    setIsTouchDevice(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    x.set(0);
    y.set(0);
  };

  return (
    <section id="about" className="relative py-32 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none parallax-glow" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center"
        >
          {/* Image Column — Innovative 3D Layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative perspective-[1000px] w-full max-w-md mx-auto lg:mx-0"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              style={{
                rotateX: isTouchDevice ? 0 : rotateX,
                rotateY: isTouchDevice ? 0 : rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative w-full aspect-[4/5] rounded-3xl"
            >
              {/* Backglow layer */}
              <div 
                className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-accent-cyan via-transparent to-accent-purple opacity-30 blur-2xl transition-opacity duration-500" 
                style={{ transform: "translateZ(-50px)" }}
              />
              
              {/* Main Image Layer */}
              <div 
                className="absolute inset-0 glass-cyber p-2 rounded-3xl overflow-hidden shadow-2xl z-10"
                style={{ transform: "translateZ(0px)" }}
              >
                {isLoading ? (
                  <div className="w-full h-full bg-black/10 dark:bg-white/5 animate-pulse rounded-2xl" />
                ) : (
                  <img
                    src={profileImageUrl}
                    alt={`${title} ${titleHighlight}`}
                    className="w-full h-full object-cover rounded-2xl opacity-90 transition-all duration-700 hover:scale-[1.05]"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80';
                    }}
                  />
                )}
                {/* Image overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 to-transparent pointer-events-none rounded-2xl" />
              </div>

              {/* Floating Badge 1 - Top Left */}
              <motion.div 
                className="absolute -top-6 -left-6 glass-cyber px-5 py-3 rounded-2xl shadow-xl z-20 flex items-center gap-3 border-accent-cyan/30"
                style={{ transform: isTouchDevice ? "translateZ(0)" : "translateZ(40px)" }}
              >
                <div className="w-10 h-10 rounded-full bg-accent-cyan/10 flex items-center justify-center text-accent-cyan">
                  <Cpu size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold">System</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Online</p>
                </div>
              </motion.div>

              {/* Floating Badge 2 - Bottom Right (Availability) */}
              {availabilityStatus && (
                <motion.div 
                  className="absolute -bottom-6 -right-6 glass-cyber px-6 py-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 border-green-500/30"
                  style={{ transform: isTouchDevice ? "translateZ(0)" : "translateZ(60px)" }}
                >
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </div>
                  <span className="text-sm font-bold tracking-widest text-gray-900 dark:text-white uppercase">{availabilityLabel}</span>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-gray-900 dark:text-white font-display">
              {title}{' '}
              <span className="text-gradient-cyber">{titleHighlight}</span>
            </h2>

            {/* Data panel with HUD corners */}
            <div className="glass-cyber p-8 md:p-10 relative overflow-hidden hud-corners rounded-2xl group">
              <div className="hud-corner tl" />
              <div className="hud-corner tr" />
              <div className="hud-corner bl" />
              <div className="hud-corner br" />

              {/* Subtle background circuit pattern for text panel */}
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                   style={{ backgroundImage: 'radial-gradient(var(--ct-cyan) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

              {isLoading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-4/5" />
                  <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-3/4 mt-4" />
                </div>
              ) : (
                <div className="relative z-10">
                  <div
                    className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6
                      prose prose-sm dark:prose-invert max-w-none
                      prose-p:mb-4 prose-p:leading-relaxed
                      prose-strong:text-accent-cyan prose-strong:font-semibold
                      prose-a:text-accent-cyan prose-a:underline hover:opacity-80"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(bioPrimary) }}
                  />
                  {bioSecondary && (
                    <div
                      className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-8
                        prose prose-sm dark:prose-invert max-w-none
                        prose-p:mb-4 prose-p:leading-relaxed
                        prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                        prose-a:text-accent-cyan prose-a:underline hover:opacity-80"
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(bioSecondary) }}
                    />
                  )}
                  {settings?.resume_url && (
                    <div className="mb-8">
                      <a
                        href={settings.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cyber-button-filled inline-flex items-center justify-center gap-2 px-8 py-3.5 !rounded-full text-sm group/btn shadow-lg hover:shadow-xl transition-all"
                      >
                        <Download className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" />
                        Download CV / Resume
                      </a>
                    </div>
                  )}

                  {highlights.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {highlights.map((highlight, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 * i, duration: 0.5 }}
                          className="flex items-start gap-4 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:border-accent-cyan/30 dark:hover:border-accent-cyan/30 transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="p-2 rounded-lg bg-white dark:bg-charcoal-900 shadow-sm border border-gray-100 dark:border-white/5">
                            {ICON_MAP[highlight.icon] ?? <Code className="text-accent-cyan shrink-0" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{highlight.title}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{highlight.subtitle}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

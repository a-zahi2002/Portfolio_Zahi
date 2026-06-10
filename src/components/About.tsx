// CYBER TERMINAL THEME
// About.tsx — Clean 2-column layout with parallax image and glass-cyber data panel.
// CMS hooks, data, props, handlers: UNTOUCHED.

import React from 'react';
import { motion } from 'framer-motion';
import { Download, Layout, Smartphone, Code, Zap } from 'lucide-react';
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
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative group"
          >
            {/* Gradient border ring */}
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-700" />
            <div className="relative glass-cyber p-2 rounded-2xl overflow-hidden aspect-square max-w-md mx-auto lg:mx-0">
              {isLoading ? (
                <div className="w-full h-full bg-white/5 animate-pulse rounded-xl" />
              ) : (
                <img
                  src={profileImageUrl}
                  alt={`${title} ${titleHighlight}`}
                  className="w-full h-full object-cover rounded-xl transition-all duration-700 group-hover:scale-[1.02]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80';
                  }}
                />
              )}
              {availabilityStatus && (
                <div className="absolute bottom-6 right-6 glass-cyber px-4 py-2 flex items-center gap-2 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-semibold tracking-wider text-white">{availabilityLabel}</span>
                </div>
              )}
            </div>
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
            <div className="glass-cyber p-8 md:p-10 relative overflow-hidden hud-corners rounded-2xl">
              <div className="hud-corner tl" />
              <div className="hud-corner tr" />
              <div className="hud-corner bl" />
              <div className="hud-corner br" />

              {isLoading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-white/5 rounded w-full" />
                  <div className="h-4 bg-white/5 rounded w-4/5" />
                  <div className="h-4 bg-white/5 rounded w-3/4 mt-4" />
                </div>
              ) : (
                <>
                  <div
                    className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6
                      prose prose-sm dark:prose-invert max-w-none
                      prose-p:mb-4 prose-p:leading-relaxed
                      prose-strong:text-accent-cyan prose-strong:font-semibold
                      prose-a:text-accent-cyan prose-a:underline hover:opacity-80"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(bioPrimary) }}
                  />
                  {bioSecondary && (
                    <div
                      className="text-gray-500 dark:text-gray-400 text-base leading-relaxed mb-8
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
                        className="cyber-button-filled inline-flex items-center gap-2 !rounded-full text-sm group"
                      >
                        <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
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
                          className="flex items-start gap-4 p-4 rounded-xl bg-white/5 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-accent-cyan/30 transition-colors"
                        >
                          {ICON_MAP[highlight.icon] ?? <Code className="text-accent-cyan shrink-0" />}
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{highlight.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{highlight.subtitle}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Layout, Smartphone, Code, Zap } from 'lucide-react';
import { useAboutSection } from '../hooks/cms/useAboutSection';
import { useSiteSettings } from '../hooks/cms/useSiteSettings';
import { parseMarkdown } from '../utils/markdown';
import { useAboutAnimation } from '../hooks/animations/useAboutAnimation';

// Map icon name strings to Lucide components
const ICON_MAP: Record<string, React.ReactNode> = {
  Code: <Code className="shrink-0 w-5 h-5" />,
  Zap: <Zap className="shrink-0 w-5 h-5" />,
  Layout: <Layout className="shrink-0 w-5 h-5" />,
  Smartphone: <Smartphone className="shrink-0 w-5 h-5" />,
};

const About: React.FC = () => {
  const { data: about, isLoading } = useAboutSection();
  const { data: settings } = useSiteSettings();

  // ── Animation refs ─────────────────────────────────────────────────
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const bioSecRef = useRef<HTMLDivElement>(null);

  useAboutAnimation({ sectionRef, headingRef, bioRef, bioSecRef }, isLoading ?? false);

  // Fallback values for when Supabase is not yet configured
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
    { icon: 'Layout', title: 'Modern UI/UX', subtitle: 'Pixel Perfect Design' },
    { icon: 'Smartphone', title: 'Responsive', subtitle: 'Mobile & Tablet Ready' },
  ];

  return (
    <section id="about" ref={sectionRef} className="relative py-32 overflow-hidden bg-transparent">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-accent-purple/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none parallax-glow" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Solar System / Orbital Column */}
          <div className="relative group parallax-card flex justify-center items-center">
            
            {/* Pulsing Central Star (User CMS Profile Image) */}
            <div className="relative w-[300px] h-[300px] md:w-[380px] md:h-[380px] flex items-center justify-center animate-cosmic-float">
              
              {/* Elliptical Orbit Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 dark:opacity-60" viewBox="0 0 100 100">
                {/* Orbit 1 */}
                <ellipse cx="50" cy="50" rx="36" ry="24" fill="none" stroke="var(--universe-accent)" strokeWidth="0.2" strokeDasharray="2 3" transform="rotate(-15 50 50)" />
                {/* Orbit 2 */}
                <ellipse cx="50" cy="50" rx="46" ry="32" fill="none" stroke="var(--universe-accent-secondary)" strokeWidth="0.2" strokeDasharray="1 4" transform="rotate(-15 50 50)" />
              </svg>
              
              {/* Pulse Flare Corona behind the photo */}
              <div className="absolute w-[180px] h-[180px] md:w-[240px] md:h-[240px] rounded-full animate-solar-flare pointer-events-none opacity-80" />
              
              {/* Circular profile image (The Star Core) */}
              <div className="relative w-[170px] h-[170px] md:w-[220px] md:h-[220px] rounded-full overflow-hidden border border-white/20 shadow-inner z-10 bg-white dark:bg-[#050505]">
                {isLoading ? (
                  <div className="w-full h-full bg-white/5 animate-pulse" />
                ) : (
                  <img
                    src={profileImageUrl}
                    alt={`${title} ${titleHighlight}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80';
                    }}
                  />
                )}
                {/* Gentle cosmic light sweep overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--universe-accent)]/10 via-transparent to-[var(--universe-accent-secondary)]/15 pointer-events-none mix-blend-overlay" />
              </div>
            </div>

            {/* Orbiting Satellite Highlights (Desktop absolute, positioned dynamically) */}
            {!isLoading && highlights.slice(0, 4).map((highlight, index) => {
              const positions = [
                {
                  // Highlight 1 (Orbit 1, Top-Left)
                  className: "top-[6%] left-[-12%] animate-cosmic-float",
                  borderClass: "dark:border-[var(--universe-accent)]/20",
                  iconBg: "bg-[var(--universe-accent)]/10 text-[var(--universe-accent)]"
                },
                {
                  // Highlight 2 (Orbit 1, Bottom-Right)
                  className: "bottom-[8%] right-[-12%] animate-cosmic-float-delay",
                  borderClass: "dark:border-[var(--universe-accent-secondary)]/20",
                  iconBg: "bg-[var(--universe-accent-secondary)]/10 text-[var(--universe-accent-secondary)]"
                },
                {
                  // Highlight 3 (Orbit 2, Bottom-Left)
                  className: "top-[55%] left-[-18%] animate-cosmic-float-delay",
                  borderClass: "dark:border-[var(--universe-accent)]/20",
                  iconBg: "bg-[var(--universe-accent)]/10 text-[var(--universe-accent)]"
                },
                {
                  // Highlight 4 (Orbit 2, Top-Right)
                  className: "top-[12%] right-[-8%] animate-cosmic-float",
                  borderClass: "dark:border-[var(--universe-accent-secondary)]/20",
                  iconBg: "bg-[var(--universe-accent-secondary)]/10 text-[var(--universe-accent-secondary)]"
                }
              ];

              const pos = positions[index] || positions[0];

              return (
                <div 
                  key={index}
                  className={`absolute z-20 hidden lg:flex items-start gap-4 p-4 rounded-2xl backdrop-blur-md bg-white/80 dark:bg-charcoal-950/45 border border-gray-200/50 ${pos.borderClass} shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(var(--universe-accent-rgb),0.06)] hover:bg-gray-50 dark:hover:bg-charcoal-900/40 hover:border-[var(--universe-accent)]/30 transition-all duration-500 w-60 ${pos.className} pointer-events-auto`}
                >
                  <div className={`p-2 rounded-lg ${pos.iconBg}`}>
                    {ICON_MAP[highlight.icon] ?? <Code className="shrink-0 w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{highlight.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{highlight.subtitle}</p>
                  </div>
                </div>
              );
            })}

          </div>

          {/* Text Column / Cyber-Card */}
          <div className="relative flex flex-col justify-center">
            
            {/* Cosmic Header Status Tag */}
            <div className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-[var(--universe-accent-secondary)] select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--universe-accent-secondary)] animate-ping" />
              <span>[ STELLAR CORE DETECTED ]</span>
            </div>

            <h2 ref={headingRef} className="text-4xl lg:text-5xl font-bold mb-8 text-gray-900 dark:text-white">
              {title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--universe-accent)] to-[var(--universe-accent-secondary)]">{titleHighlight}</span>
            </h2>

            {/* Organic Cosmic Bio Card */}
            <div className="relative rounded-3xl bg-white/80 dark:bg-charcoal-900/30 backdrop-blur-xl p-8 md:p-10 border border-white/20 dark:border-[var(--universe-accent)]/15 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(var(--universe-accent-rgb),0.05)] hover:shadow-[0_12px_48px_rgba(var(--universe-accent-rgb),0.1)] hover:border-[var(--universe-accent)]/30 transition-all duration-700">
              
              {/* Soft galaxy backlight inside the card */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[var(--universe-accent)]/10 to-transparent blur-3xl pointer-events-none rounded-full" />
              
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
                      prose-strong:text-[var(--universe-accent)] prose-strong:font-semibold
                      prose-a:text-[var(--universe-accent)] prose-a:underline hover:opacity-80"
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
                        prose-a:text-[var(--universe-accent)] prose-a:underline hover:opacity-80"
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(bioSecondary) }}
                    />
                  )}
                  
                  {/* Availability badge inside card for mobile */}
                  {availabilityStatus && (
                    <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full bg-[var(--universe-accent)]/10 border border-[var(--universe-accent)]/20 font-mono text-xs tracking-wider text-[var(--universe-accent)] select-none">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span>{availabilityLabel}</span>
                    </div>
                  )}

                  {settings?.resume_url && (
                    <div className="mb-4 relative z-10">
                      <a
                        href={settings.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[var(--universe-accent)] to-[var(--universe-accent-secondary)] text-white font-bold rounded-full shadow-lg hover:shadow-[var(--universe-accent)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm group"
                      >
                        <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                        Download CV / Resume
                      </a>
                    </div>
                  )}

                  {/* Highlights Grid inside card for Mobile / Tablet */}
                  {highlights.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 lg:hidden">
                      {highlights.map((highlight, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                          <div className="p-2 rounded-lg bg-[var(--universe-accent)]/10 text-[var(--universe-accent)]">
                            {ICON_MAP[highlight.icon] ?? <Code className="shrink-0 w-5 h-5" />}
                          </div>
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

import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Smartphone, Code, Zap } from 'lucide-react';
import { useAboutSection } from '../hooks/cms/useAboutSection';
import { parseMarkdown } from '../utils/markdown';

// Map icon name strings to Lucide components
const ICON_MAP: Record<string, React.ReactNode> = {
  Code: <Code className="text-blue-600 dark:text-accent-cyan shrink-0" />,
  Zap: <Zap className="text-purple-600 dark:text-accent-purple shrink-0" />,
  Layout: <Layout className="text-blue-600 dark:text-accent-cyan shrink-0" />,
  Smartphone: <Smartphone className="text-purple-600 dark:text-accent-purple shrink-0" />,
};

const About: React.FC = () => {
  const { data: about, isLoading } = useAboutSection();

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
  ];

  return (
    <section id="about" className="relative py-32 bg-white dark:bg-charcoal-950 overflow-hidden transition-colors duration-300">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-accent-purple/20 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Image Column */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-accent-cyan dark:to-accent-purple rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
            <div className="relative glass-panel p-2 rounded-2xl overflow-hidden aspect-square max-w-md mx-auto lg:mx-0">
              {isLoading ? (
                <div className="w-full h-full bg-white/5 animate-pulse rounded-xl" />
              ) : (
                <img
                  src={profileImageUrl}
                  alt={`${title} ${titleHighlight}`}
                  className="w-full h-full object-cover rounded-xl filter grayscale group-hover:grayscale-0 transition-all duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80';
                  }}
                />
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
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-gray-900 dark:text-white">
              {title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-accent-cyan dark:to-blue-500">{titleHighlight}</span>
            </h2>

            <div className="glass-panel p-8 md:p-10 relative overflow-hidden group border-gray-200 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-accent-cyan/30 transition-colors duration-500">
              {isLoading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-white/5 rounded w-full" />
                  <div className="h-4 bg-white/5 rounded w-4/5" />
                  <div className="h-4 bg-white/5 rounded w-3/4 mt-4" />
                </div>
              ) : (
                <>
                  <div
                    className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6 relative z-10
                      prose prose-sm dark:prose-invert max-w-none
                      prose-p:mb-4 prose-p:leading-relaxed
                      prose-strong:text-blue-600 dark:prose-strong:text-accent-cyan prose-strong:font-semibold
                      prose-a:text-blue-600 dark:prose-a:text-accent-cyan prose-a:underline hover:opacity-80"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(bioPrimary) }}
                  />
                  {bioSecondary && (
                    <div
                      className="text-gray-500 dark:text-gray-400 text-base leading-relaxed mb-8 relative z-10
                        prose prose-sm dark:prose-invert max-w-none
                        prose-p:mb-4 prose-p:leading-relaxed
                        prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                        prose-a:text-blue-600 dark:prose-a:text-accent-cyan prose-a:underline hover:opacity-80"
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(bioSecondary) }}
                    />
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

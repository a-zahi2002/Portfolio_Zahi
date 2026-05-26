import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Smartphone, Code, Zap } from 'lucide-react';
import { useAboutSection } from '../hooks/cms/useAboutSection';
import { parseMarkdown } from '../utils/markdown';

const ICON_MAP: Record<string, React.ReactNode> = {
  Code: <Code className="text-charcoal-900 dark:text-white shrink-0" />,
  Zap: <Zap className="text-charcoal-900 dark:text-white shrink-0" />,
  Layout: <Layout className="text-charcoal-900 dark:text-white shrink-0" />,
  Smartphone: <Smartphone className="text-charcoal-900 dark:text-white shrink-0" />,
};

const About: React.FC = () => {
  const { data: about, isLoading } = useAboutSection();

  const title = about?.title ?? 'About';
  const titleHighlight = about?.title_highlight ?? 'Me';
  const bioPrimary = about?.bio_primary ?? 'I am a passionate **Creative Developer** dedicated to building immersive web experiences. My work bridges the gap between robust engineering and elegant design, ensuring every pixel serves a purpose.';
  const bioSecondary = about?.bio_secondary ?? 'With a strong foundation in modern web technologies, I focus on performance, accessibility, and creating interfaces that feel "alive" through subtle interactions and spatial design.';
  const profileImageUrl = about?.profile_image_url ?? './assets/profile.jpg';
  const availabilityStatus = about?.availability_status ?? true;
  const availabilityLabel = about?.availability_label ?? 'OPEN TO WORK';
  const highlights = about?.highlights ?? [
    { icon: 'Code', title: 'Clean Architecture', subtitle: 'Scalable & Maintainable' },
    { icon: 'Zap', title: 'Performance', subtitle: 'Lightning Fast Experiences' },
  ];

  return (
    <section id="about" className="relative py-32 md:py-48 bg-white dark:bg-[#030303] transition-colors duration-500">
      <div className="container-padding max-w-[90rem]">
        
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Sticky Image Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 relative">
            <div className="aspect-[3/4] rounded-sm overflow-hidden relative group">
              {isLoading ? (
                <div className="w-full h-full bg-charcoal-900/5 dark:bg-white/5 animate-pulse" />
              ) : (
                <div className="w-full h-full relative">
                  <img
                    src={profileImageUrl}
                    alt={`${title} ${titleHighlight}`}
                    className="w-full h-full object-cover grayscale opacity-90 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-charcoal-950/10 dark:bg-black/20 mix-blend-overlay pointer-events-none" />
                </div>
              )}
            </div>
          </div>

          {/* Scrolling Content Column */}
          <div className="lg:col-span-7 flex flex-col justify-center pb-24">
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium mb-12 text-charcoal-900 dark:text-white uppercase leading-[0.9]">
                {title} <br/>
                <span className="text-accent-gold italic font-light">{titleHighlight}</span>
              </h2>
            </motion.div>

            {isLoading ? (
              <div className="space-y-4 animate-pulse mt-8">
                <div className="h-6 bg-charcoal-900/5 dark:bg-white/5 w-full" />
                <div className="h-6 bg-charcoal-900/5 dark:bg-white/5 w-5/6" />
                <div className="h-6 bg-charcoal-900/5 dark:bg-white/5 w-4/6" />
              </div>
            ) : (
              <div className="space-y-16">
                
                {/* Biography */}
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-2xl md:text-3xl lg:text-4xl leading-tight font-sans text-charcoal-900 dark:text-gray-200
                      prose-strong:text-charcoal-950 dark:prose-strong:text-white prose-strong:font-medium
                      prose-a:text-accent-gold prose-a:underline hover:opacity-100"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(bioPrimary) }}
                  />
                  
                  {bioSecondary && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="text-lg md:text-xl leading-relaxed font-sans text-charcoal-600 dark:text-gray-400 max-w-2xl
                        prose-strong:text-charcoal-800 dark:prose-strong:text-gray-200 prose-strong:font-medium
                        prose-a:text-accent-gold prose-a:underline hover:opacity-100"
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(bioSecondary) }}
                    />
                  )}
                </div>

                {/* Divider */}
                <div className="h-[1px] w-full bg-charcoal-900/10 dark:bg-white/10" />

                {/* Highlights */}
                {highlights.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8"
                  >
                    {highlights.map((highlight, i) => (
                      <div key={i} className="flex items-start gap-6 group">
                        <div className="w-12 h-12 rounded-full border border-charcoal-900/20 dark:border-white/20 flex items-center justify-center shrink-0 group-hover:border-accent-gold transition-colors duration-300">
                          {ICON_MAP[highlight.icon] ?? <Code className="text-charcoal-900 dark:text-white shrink-0" />}
                        </div>
                        <div>
                          <h4 className="font-display font-medium text-xl text-charcoal-900 dark:text-white mb-2 group-hover:text-accent-gold transition-colors">{highlight.title}</h4>
                          <p className="text-sm font-sans text-charcoal-500 dark:text-gray-400 leading-relaxed">{highlight.subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
                
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

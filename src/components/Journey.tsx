import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperiences } from '../hooks/cms/useExperiences';
import { useEducation } from '../hooks/cms/useEducation';
import { parseMarkdown } from '../utils/markdown';

const Journey: React.FC = () => {
  const { data: experiences, isLoading: expLoading } = useExperiences();
  const { data: education, isLoading: eduLoading } = useEducation();
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');

  const isLoading = activeTab === 'experience' ? expLoading : eduLoading;

  const fallbackExperiences = [
    {
      id: 'mock-1',
      role: 'Creative Developer',
      company: 'Digital Wonders Agency',
      start_date: 'Jun 2023',
      end_date: 'Present',
      description: 'Building premium, high-performance web applications using **React**, **Three.js**, and **Tailwind CSS**. Focused on custom micro-interactions and smooth user experience.',
      technologies: ['React', 'Three.js', 'Framer Motion', 'Tailwind'],
    },
    {
      id: 'mock-2',
      role: 'Junior Frontend Developer',
      company: 'Tech Solutions Ltd',
      start_date: 'Jan 2021',
      end_date: 'May 2023',
      description: 'Worked closely with designers to implement responsive, pixel-perfect user interfaces. Participated in migration of legacy codebase to TypeScript.',
      technologies: ['HTML/CSS', 'JavaScript', 'TypeScript', 'Git'],
    }
  ];

  const fallbackEducation = [
    {
      id: 'mock-edu-1',
      degree: 'B.Sc. in Computer Science',
      institution: 'University of Moratuwa',
      start_date: 'Oct 2021',
      end_date: 'Present',
      description: 'Specializing in software engineering, algorithms, and web technologies. Active member of the computer society.',
    },
    {
      id: 'mock-edu-2',
      degree: 'Secondary Education',
      institution: 'Royal College',
      start_date: 'Jan 2013',
      end_date: 'Dec 2020',
      description: 'Passed GCE A/L examination with top distinctions in Mathematics, Physics, and Chemistry.',
    }
  ];

  const currentItems = activeTab === 'experience'
    ? (experiences && experiences.length > 0 ? experiences : fallbackExperiences)
    : (education && education.length > 0 ? education : fallbackEducation);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id="journey" className="relative py-32 bg-[#f5f5f7] dark:bg-charcoal-950 transition-colors duration-500 overflow-hidden">
      
      <div className="container-padding max-w-5xl">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div>
            <h2 className="text-4xl md:text-6xl font-display font-medium text-charcoal-900 dark:text-white uppercase tracking-tight">
              Curriculum <br/> <span className="text-accent-gold italic font-light">Vitae</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-4 border-b border-charcoal-900/10 dark:border-white/10 pb-4">
            <button
              onClick={() => setActiveTab('experience')}
              className={`text-sm tracking-widest uppercase transition-colors duration-300 ${
                activeTab === 'experience'
                  ? 'text-charcoal-900 dark:text-white font-medium'
                  : 'text-charcoal-400 hover:text-charcoal-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
            >
              Experience
            </button>
            <span className="text-charcoal-900/20 dark:text-white/20">/</span>
            <button
              onClick={() => setActiveTab('education')}
              className={`text-sm tracking-widest uppercase transition-colors duration-300 ${
                activeTab === 'education'
                  ? 'text-charcoal-900 dark:text-white font-medium'
                  : 'text-charcoal-400 hover:text-charcoal-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
            >
              Education
            </button>
          </div>
        </div>

        {/* Timeline Content */}
        {isLoading ? (
          <div className="space-y-16">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-charcoal-900/5 dark:bg-white/5 w-32 mb-4" />
                <div className="h-8 bg-charcoal-900/5 dark:bg-white/5 w-3/4 md:w-1/2 mb-4" />
                <div className="h-4 bg-charcoal-900/5 dark:bg-white/5 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-0"
          >
            <AnimatePresence mode="wait">
              {currentItems.map((item, idx) => {
                const itemTitle = 'role' in item ? item.role : item.degree;
                const itemSub = 'company' in item ? item.company : item.institution;
                const itemTech = 'technologies' in item ? item.technologies : null;

                return (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="group border-t border-charcoal-900/10 dark:border-white/10 py-12 first:border-0 md:first:border-t relative hover:bg-white/50 dark:hover:bg-white-[0.02] transition-colors duration-500"
                  >
                    {/* Hover indicator line */}
                    <div className="absolute left-0 top-0 bottom-0 w-0 bg-accent-gold transition-all duration-500 group-hover:w-1" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 px-4 md:px-8">
                      
                      {/* Date & Company */}
                      <div className="md:col-span-4 flex flex-col gap-2">
                        <span className="text-xs font-medium tracking-widest uppercase text-charcoal-500 dark:text-gray-400">
                          {item.start_date} — {item.end_date || 'Present'}
                        </span>
                        <span className="text-lg font-display text-charcoal-900 dark:text-gray-300">
                          {itemSub}
                        </span>
                      </div>
                      
                      {/* Role & Description */}
                      <div className="md:col-span-8 flex flex-col gap-6">
                        <h3 className="text-2xl md:text-3xl font-display font-medium text-charcoal-900 dark:text-white">
                          {itemTitle}
                        </h3>
                        
                        <div
                          className="text-base text-charcoal-600 dark:text-gray-400 leading-relaxed font-sans max-w-2xl
                            prose-strong:text-charcoal-900 dark:prose-strong:text-white prose-strong:font-medium"
                          dangerouslySetInnerHTML={{ __html: parseMarkdown(item.description ?? '') }}
                        />

                        {/* Tech Pills */}
                        {itemTech && itemTech.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {itemTech.map(tech => (
                              <span
                                key={tech}
                                className="text-xs uppercase tracking-widest px-3 py-1 rounded-full border border-charcoal-900/10 dark:border-white/10 text-charcoal-500 dark:text-gray-400"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Journey;

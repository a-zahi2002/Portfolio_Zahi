// CYBER TERMINAL THEME
// Journey.tsx — Clean vertical timeline with gradient connector and glass-cyber cards.
// CMS hooks, data, tab handlers: UNTOUCHED.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';
import { useExperiences } from '../hooks/cms/useExperiences';
import { useEducation } from '../hooks/cms/useEducation';
import { parseMarkdown } from '../utils/markdown';
import { useAudio } from './audio/AudioProvider';

const Journey: React.FC = () => {
  const { data: experiences, isLoading: expLoading } = useExperiences();
  const { data: education, isLoading: eduLoading } = useEducation();
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');
  const { playClick } = useAudio();

  const isLoading = activeTab === 'experience' ? expLoading : eduLoading;

  // Fallback mock data
  const fallbackExperiences = [
    {
      id: 'mock-1', role: 'Creative Developer', company: 'Digital Wonders Agency',
      start_date: 'Jun 2023', end_date: 'Present',
      description: 'Building premium, high-performance web applications using **React**, **Three.js**, and **Tailwind CSS**.',
      technologies: ['React', 'Three.js', 'Framer Motion', 'Tailwind'],
    },
    {
      id: 'mock-2', role: 'Junior Frontend Developer', company: 'Tech Solutions Ltd',
      start_date: 'Jan 2021', end_date: 'May 2023',
      description: 'Worked closely with designers to implement responsive, pixel-perfect user interfaces.',
      technologies: ['HTML/CSS', 'JavaScript', 'TypeScript', 'Git'],
    },
  ];
  const fallbackEducation = [
    {
      id: 'mock-edu-1', degree: 'B.Sc. in Computer Science & Engineering',
      institution: 'University of Moratuwa', start_date: 'Oct 2021', end_date: 'Present',
      description: 'Specializing in software engineering, algorithms, and web technologies.',
    },
    {
      id: 'mock-edu-2', degree: 'Secondary Education', institution: 'Royal College Colombo',
      start_date: 'Jan 2013', end_date: 'Dec 2020',
      description: 'Passed GCE A/L examination with top distinctions.',
    },
  ];

  const experienceList = experiences && experiences.length > 0 ? experiences : (experiences ? [] : fallbackExperiences);
  const educationList = education && education.length > 0 ? education : (education ? [] : fallbackEducation);
  const currentItems = activeTab === 'experience' ? experienceList : educationList;

  return (
    <section id="journey" className="relative py-32 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/3 right-1/4 w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] bg-accent-purple/5 rounded-full blur-[100px] pointer-events-none parallax-glow" />
      <div className="absolute bottom-1/3 left-1/4 w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] bg-accent-cyan/5 rounded-full blur-[100px] pointer-events-none parallax-glow" />

      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4 text-charcoal-900 dark:text-white">
              My <span className="text-gradient-cyber">Journey</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-sans max-w-md mx-auto">
              A timeline of my professional experience and academic achievements.
            </p>
          </motion.div>

          {/* Tab switcher with layoutId pill */}
          <div className="flex justify-center mt-10">
            <div className="flex p-1 glass-cyber rounded-full">
              {(['experience', 'education'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); playClick(); }}
                  className="relative flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-300"
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="journey-tab"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: tab === 'experience'
                          ? 'linear-gradient(135deg, var(--ct-cyan), #0088cc)'
                          : 'linear-gradient(135deg, var(--ct-purple), #6d28d9)',
                      }}
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <span className={`relative z-10 flex items-center gap-2 ${
                    activeTab === tab ? 'text-white dark:text-charcoal-950' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {tab === 'experience' ? <Briefcase className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Content */}
        {isLoading ? (
          <div className="space-y-6 max-w-3xl mx-auto">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-6 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-white/5 shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-white/5 rounded w-1/3" />
                  <div className="h-4 bg-white/5 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative max-w-3xl mx-auto">
            {/* Timeline gradient line */}
            <div
              className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2"
              style={{
                background: 'linear-gradient(to bottom, var(--ct-cyan-dim), var(--ct-purple-dim), transparent)',
              }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="space-y-12 w-full"
              >
                {currentItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                      {activeTab === 'experience' ? (
                        <Briefcase className="w-6 h-6 text-gray-400" />
                      ) : (
                        <GraduationCap className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">
                      No {activeTab} added yet
                    </h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      Check back later for updates.
                    </p>
                  </motion.div>
                ) : (
                  currentItems.map((item, idx) => {
                    const isLeft = idx % 2 === 0;
                    const itemTitle = 'role' in item ? item.role : item.degree;
                    const itemSub = 'company' in item ? item.company : item.institution;
                    const itemTech = 'technologies' in item ? item.technologies : null;

                    return (
                      <motion.div
                        key={`${activeTab}-${item.id}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, type: 'spring', bounce: 0.2, duration: 0.6 }}
                        className={`relative flex flex-col md:flex-row items-start md:items-center ${
                          isLeft ? 'md:flex-row-reverse' : ''
                        }`}
                      >
                        {/* Timeline Node */}
                        <div className="absolute left-6 md:left-1/2 w-10 h-10 rounded-full glass-cyber flex items-center justify-center -translate-x-1/2 z-20 border border-accent-cyan/30">
                          {activeTab === 'experience' ? (
                            <Briefcase className="w-4 h-4 text-accent-cyan" />
                          ) : (
                            <GraduationCap className="w-4 h-4 text-accent-purple" />
                          )}
                        </div>

                        {/* Card */}
                        <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                          <div className="glass-cyber p-6 md:p-8 rounded-2xl group hover:border-accent-cyan/30 transition-all duration-500 hud-corners">
                            <div className="hud-corner tl" />
                            <div className="hud-corner tr" />
                            <div className="hud-corner bl" />
                            <div className="hud-corner br" />

                            {/* Gradient top accent */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-cyan to-accent-purple opacity-20 group-hover:opacity-100 transition-opacity rounded-t-2xl" />

                            {/* Date badge */}
                            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-3 py-1.5 rounded-full mb-4 tracking-widest uppercase">
                              <Calendar className="w-3 h-3" />
                              {item.start_date} - {item.end_date || 'Present'}
                            </div>

                            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-1 group-hover:text-accent-cyan transition-colors">
                              {itemTitle}
                            </h3>
                            <h4 className="text-sm font-medium font-sans text-gray-400 mb-4">
                              {itemSub}
                            </h4>

                            <div
                              className="text-gray-400 text-sm leading-relaxed mb-4
                                prose prose-sm dark:prose-invert max-w-none
                                prose-p:mb-2 font-sans
                                prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
                                prose-ul:list-disc prose-ul:pl-4 prose-ul:mb-2
                                prose-li:my-0.5"
                              dangerouslySetInnerHTML={{ __html: parseMarkdown(item.description ?? '') }}
                            />

                            {itemTech && itemTech.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5 mt-4">
                                {itemTech.map(tech => (
                                  <span
                                    key={tech}
                                    className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-gray-600 dark:text-gray-300 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-2.5 py-1 rounded-full"
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
                  })
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

export default Journey;

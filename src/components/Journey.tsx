import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';
import { useExperiences } from '../hooks/cms/useExperiences';
import { useEducation } from '../hooks/cms/useEducation';
import { parseMarkdown } from '../utils/markdown';

const Journey: React.FC = () => {
  const { data: experiences, isLoading: expLoading } = useExperiences();
  const { data: education, isLoading: eduLoading } = useEducation();
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');

  const isLoading = activeTab === 'experience' ? expLoading : eduLoading;

  // Fallback mock data in case Supabase has not been seeded yet
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
      degree: 'B.Sc. in Computer Science & Engineering',
      institution: 'University of Moratuwa',
      start_date: 'Oct 2021',
      end_date: 'Present',
      description: 'Specializing in software engineering, algorithms, and web technologies. Active member of the computer society.',
    },
    {
      id: 'mock-edu-2',
      degree: 'Secondary Education',
      institution: 'Royal College Colombo',
      start_date: 'Jan 2013',
      end_date: 'Dec 2020',
      description: 'Passed GCE A/L examination with top distinctions in Mathematics, Physics, and Chemistry.',
    }
  ];

  // If data is loaded but empty, we don't want fallbacks, we want the empty state.
  // Fallbacks are only for when we literally have null/undefined (not fetched yet or error) but wait, if it's an empty array, supabase returns [].
  // Let's use fallbacks ONLY if we haven't fetched OR if we explicitly want to show mocks when no DB connection.
  // Assuming a real DB returns [] when empty.
  const experienceList = experiences && experiences.length > 0 ? experiences : (experiences ? [] : fallbackExperiences);
  const educationList = education && education.length > 0 ? education : (education ? [] : fallbackEducation);

  const currentItems = activeTab === 'experience' ? experienceList : educationList;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0.25, duration: 0.6 } }
  };

  return (
    <section id="journey" className="relative py-32 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/3 right-1/4 w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] bg-purple-500/5 dark:bg-accent-purple/5 rounded-full blur-[100px] pointer-events-none parallax-glow" />
      <div className="absolute bottom-1/3 left-1/4 w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] bg-blue-500/5 dark:bg-accent-cyan/5 rounded-full blur-[100px] pointer-events-none parallax-glow" />

      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4 text-charcoal-900 dark:text-white">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-accent-cyan dark:to-accent-purple">Journey</span>
            </h2>
            <p className="text-charcoal-600 dark:text-gray-400 text-lg font-sans max-w-md mx-auto">
              A timeline of my professional experience and academic achievements.
            </p>
          </motion.div>

          {/* Custom interactive tab switcher */}
          <div className="flex justify-center mt-10">
            <div className="flex p-1 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full backdrop-blur-md shadow-sm">
              <button
                onClick={() => setActiveTab('experience')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === 'experience'
                    ? 'bg-blue-600 text-white dark:bg-accent-cyan dark:text-charcoal-950 shadow-md'
                    : 'text-charcoal-600 dark:text-gray-400 hover:text-charcoal-900 dark:hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Experience
              </button>
              <button
                onClick={() => setActiveTab('education')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === 'education'
                    ? 'bg-purple-600 text-white dark:bg-accent-purple dark:text-white shadow-md'
                    : 'text-charcoal-600 dark:text-gray-400 hover:text-charcoal-900 dark:hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Education
              </button>
            </div>
          </div>
        </div>

        {/* Timeline Content */}
        {isLoading ? (
          <div className="space-y-6 max-w-3xl mx-auto">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-6 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-charcoal-900/10 dark:bg-white/5 shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-charcoal-900/10 dark:bg-white/5 rounded w-1/3" />
                  <div className="h-4 bg-charcoal-900/10 dark:bg-white/5 rounded w-full" />
                  <div className="h-4 bg-charcoal-900/10 dark:bg-white/5 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative max-w-3xl mx-auto">
            {/* Center line for desktop, left line for mobile */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-600/30 via-purple-600/30 to-transparent dark:from-accent-cyan/20 dark:via-accent-purple/20 dark:to-transparent -translate-x-1/2" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="space-y-12 w-full"
              >
                {currentItems.length === 0 ? (
                  <motion.div variants={itemVariants} className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-white/10">
                      {activeTab === 'experience' ? (
                        <Briefcase className="w-6 h-6 text-gray-400" />
                      ) : (
                        <GraduationCap className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <h3 className="text-xl font-display font-bold text-charcoal-900 dark:text-white mb-2">
                      No {activeTab} added yet
                    </h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      Check back later for updates to this section.
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
                        variants={itemVariants}
                        className={`relative flex flex-col md:flex-row items-start md:items-center ${
                          isLeft ? 'md:flex-row-reverse' : ''
                        }`}
                      >
                        {/* Timeline Node Icon */}
                        <div className="absolute left-6 md:left-1/2 w-10 h-10 rounded-full bg-white dark:bg-[#0a0a0a] border border-blue-200 dark:border-accent-cyan/50 flex items-center justify-center -translate-x-1/2 z-20 shadow-[0_0_15px_rgba(59,130,246,0.15)] dark:shadow-[0_0_15px_rgba(0,243,255,0.1)]">
                          {activeTab === 'experience' ? (
                            <Briefcase className="w-4 h-4 text-blue-600 dark:text-accent-cyan" />
                          ) : (
                            <GraduationCap className="w-4 h-4 text-purple-600 dark:text-accent-purple" />
                          )}
                        </div>

                        {/* Content Card container */}
                        <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                          <div className="bg-white dark:bg-charcoal-800/50 p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-blue-500/30 dark:hover:border-accent-cyan/30 transition-all duration-300 hover:-translate-y-1 relative group parallax-card">
                            {/* Inner glowing accent */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-3xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-accent-cyan dark:to-accent-purple opacity-20 group-hover:opacity-100 transition-opacity" />

                            {/* Date badge */}
                            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-600 dark:text-accent-cyan bg-blue-50 dark:bg-accent-cyan/10 border border-blue-100 dark:border-accent-cyan/20 px-3 py-1.5 rounded-full mb-4 tracking-widest uppercase">
                              <Calendar className="w-3 h-3" />
                              {item.start_date} - {item.end_date || 'Present'}
                            </div>

                            <h3 className="text-xl font-display font-bold text-charcoal-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-accent-cyan transition-colors">
                              {itemTitle}
                            </h3>
                            <h4 className="text-sm font-medium font-sans text-charcoal-600 dark:text-gray-400 mb-4">
                              {itemSub}
                            </h4>

                            {/* Description */}
                            <div
                              className="text-charcoal-600 dark:text-gray-400 text-sm leading-relaxed mb-4
                                prose prose-sm dark:prose-invert max-w-none
                                prose-p:mb-2 font-sans
                                prose-strong:text-charcoal-900 dark:prose-strong:text-white prose-strong:font-bold
                                prose-ul:list-disc prose-ul:pl-4 prose-ul:mb-2
                                prose-li:my-0.5"
                              dangerouslySetInnerHTML={{ __html: parseMarkdown(item.description ?? '') }}
                            />

                            {/* Tech pills for Experience */}
                            {itemTech && itemTech.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-white/5 mt-4">
                                {itemTech.map(tech => (
                                  <span
                                    key={tech}
                                    className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-charcoal-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-2.5 py-1 rounded-full"
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

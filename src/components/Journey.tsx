import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar, Tag } from 'lucide-react';
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

  const currentItems = activeTab === 'experience'
    ? (experiences && experiences.length > 0 ? experiences : fallbackExperiences)
    : (education && education.length > 0 ? education : fallbackEducation);

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
    <section id="journey" className="relative py-32 bg-white dark:bg-charcoal-950 overflow-hidden transition-colors duration-300">
      {/* Background Glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-accent-purple/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-accent-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-accent-cyan dark:to-accent-purple">Journey</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
            A timeline of my professional experience and academic achievements.
          </p>

          {/* Custom interactive tab switcher */}
          <div className="flex justify-center mt-10">
            <div className="flex p-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full backdrop-blur-md">
              <button
                onClick={() => setActiveTab('experience')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === 'experience'
                    ? 'bg-blue-600 text-white dark:bg-accent-cyan dark:text-charcoal-950 shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Experience
              </button>
              <button
                onClick={() => setActiveTab('education')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === 'education'
                    ? 'bg-purple-600 text-white dark:bg-accent-purple dark:text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
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
                <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-white/5 shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative max-w-3xl mx-auto">
            {/* Center line for desktop, left line for mobile */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-transparent dark:from-accent-cyan dark:via-accent-purple dark:to-transparent -translate-x-1/2 opacity-30" />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
              className="space-y-12"
            >
              <AnimatePresence mode="wait">
                {currentItems.map((item, idx) => {
                  const isLeft = idx % 2 === 0;
                  const itemTitle = 'role' in item ? item.role : item.degree;
                  const itemSub = 'company' in item ? item.company : item.institution;
                  const itemTech = 'technologies' in item ? item.technologies : null;

                  return (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      className={`relative flex flex-col md:flex-row items-start md:items-center ${
                        isLeft ? 'md:flex-row-reverse' : ''
                      }`}
                    >
                      {/* Timeline Node Icon */}
                      <div className="absolute left-6 md:left-1/2 w-10 h-10 rounded-full bg-white dark:bg-charcoal-900 border-2 border-blue-600 dark:border-accent-cyan flex items-center justify-center -translate-x-1/2 z-20 shadow-[0_0_15px_rgba(59,130,246,0.3)] dark:shadow-[0_0_15px_rgba(0,243,255,0.2)]">
                        {activeTab === 'experience' ? (
                          <Briefcase className="w-4 h-4 text-blue-600 dark:text-accent-cyan" />
                        ) : (
                          <GraduationCap className="w-4 h-4 text-purple-600 dark:text-accent-purple" />
                        )}
                      </div>

                      {/* Content Card container */}
                      <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                        <div className="glass-panel p-6 md:p-8 hover:border-blue-500/30 dark:hover:border-accent-cyan/30 border-gray-200 dark:border-white/5 transition-all duration-300 hover:-translate-y-1 relative group">
                          {/* Inner glowing accent */}
                          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-accent-cyan dark:to-accent-purple opacity-40 group-hover:opacity-100 transition-opacity" />

                          {/* Date badge */}
                          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-accent-cyan bg-blue-500/10 dark:bg-accent-cyan/10 px-2.5 py-1 rounded-full mb-4">
                            <Calendar className="w-3.5 h-3.5" />
                            {item.start_date} - {item.end_date || 'Present'}
                          </div>

                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-accent-cyan transition-colors font-['Space_Grotesk']">
                            {itemTitle}
                          </h3>
                          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                            {itemSub}
                          </h4>

                          {/* Description */}
                          <div
                            className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mb-4
                              prose prose-sm dark:prose-invert max-w-none
                              prose-p:mb-2
                              prose-strong:text-gray-800 dark:prose-strong:text-white prose-strong:font-semibold
                              prose-ul:list-disc prose-ul:pl-4 prose-ul:mb-2
                              prose-li:my-0.5"
                            dangerouslySetInnerHTML={{ __html: parseMarkdown(item.description ?? '') }}
                          />

                          {/* Tech pills for Experience */}
                          {itemTech && itemTech.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100 dark:border-white/5">
                              {itemTech.map(tech => (
                                <span
                                  key={tech}
                                  className="inline-flex items-center gap-1 text-[10px] text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 px-2 py-0.5 rounded-md"
                                >
                                  <Tag className="w-2.5 h-2.5" />
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
          </div>
        )}
      </div>
    </section>
  );
};

export default Journey;

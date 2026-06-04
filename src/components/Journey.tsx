import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';
import { useExperiences } from '../hooks/cms/useExperiences';
import { useEducation } from '../hooks/cms/useEducation';
import { parseMarkdown } from '../utils/markdown';
import { useJourneyAnimation } from '../hooks/animations/useJourneyAnimation';

const Journey: React.FC = () => {
  const { data: experiences, isLoading: expLoading } = useExperiences();
  const { data: education, isLoading: eduLoading } = useEducation();
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');
  const sectionRef = React.useRef<HTMLElement>(null);

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

  const experienceList = experiences && experiences.length > 0 ? experiences : (experiences ? [] : fallbackExperiences);
  const educationList = education && education.length > 0 ? education : (education ? [] : fallbackEducation);

  const currentItems = activeTab === 'experience' ? experienceList : educationList;

  return (
    <section id="journey" ref={sectionRef} className="relative py-32 overflow-hidden bg-transparent">
      
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
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--universe-accent)] to-[var(--universe-accent-secondary)]">Journey</span>
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
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300
                  ${activeTab === 'experience'
                    ? 'bg-[var(--universe-accent)] text-white dark:text-charcoal-950 shadow-[0_0_15px_rgba(var(--universe-accent-rgb),0.2)]'
                    : 'text-charcoal-600 dark:text-gray-400 hover:text-charcoal-900 dark:hover:text-white'
                  }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Experience
              </button>
              <button
                onClick={() => setActiveTab('education')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300
                  ${activeTab === 'education'
                    ? 'bg-[var(--universe-accent-secondary)] text-white dark:text-white shadow-[0_0_15px_rgba(var(--universe-accent-secondary-rgb),0.2)]'
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
          <JourneyTimeline
            key={activeTab}
            activeTab={activeTab}
            currentItems={currentItems}
            isLoading={isLoading}
          />
        )}
      </div>
    </section>
  );
};

interface JourneyTimelineProps {
  activeTab: 'experience' | 'education';
  currentItems: any[];
  isLoading: boolean;
}

const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ activeTab, currentItems, isLoading }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  useJourneyAnimation(containerRef, isLoading, activeTab);

  return (
    <div ref={containerRef} className="relative max-w-3xl mx-auto journey-timeline-container">
      {/* Constellation dust lane connector */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 pointer-events-none">
        <svg className="w-[10px] h-full" preserveAspectRatio="none">
          <line 
            x1="5" y1="0" 
            x2="5" y2="100%" 
            stroke="var(--universe-accent)" 
            strokeWidth="1.5" 
            strokeDasharray="4 6" 
            strokeOpacity="0.45" 
            className="timeline-svg-line"
          />
        </svg>
      </div>

      <div className="space-y-12 w-full">
        {currentItems.length === 0 ? (
          <div className="text-center py-12">
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
          </div>
        ) : (
          currentItems.map((item, idx) => {
            const isLeft = idx % 2 === 0;
            const itemTitle = 'role' in item ? item.role : item.degree;
            const itemSub = 'company' in item ? item.company : item.institution;
            const itemTech = 'technologies' in item ? item.technologies : null;

            return (
              <div
                key={`${activeTab}-${item.id}`}
                className={`relative flex flex-col md:flex-row items-start md:items-center journey-card-wrapper ${
                  isLeft ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Constellation Glowing Star Node */}
                <div className="absolute left-6 md:left-1/2 w-8 h-8 rounded-full blur-[8px] bg-[var(--universe-accent)]/30 -translate-x-1/2 z-10 pointer-events-none animate-pulse" />
                <div className="absolute left-6 md:left-1/2 w-10 h-10 rounded-full bg-white dark:bg-[#050505] border-2 border-[var(--universe-accent)] flex items-center justify-center -translate-x-1/2 z-20 shadow-[0_0_20px_rgba(var(--universe-accent-rgb),0.25)] group transition-all duration-300">
                  {activeTab === 'experience' ? (
                    <Briefcase className="w-4 h-4 text-[var(--universe-accent)]" />
                  ) : (
                    <GraduationCap className="w-4 h-4 text-[var(--universe-accent-secondary)]" />
                  )}
                </div>

                {/* Content Card container */}
                <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                  <div className="bg-white/85 dark:bg-charcoal-900/30 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-[var(--universe-accent)]/30 transition-all duration-300 hover:-translate-y-1 relative group parallax-card">
                    
                    {/* Constellation glowing edge accent */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-3xl bg-gradient-to-r from-[var(--universe-accent)] to-[var(--universe-accent-secondary)] opacity-20 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Date badge */}
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--universe-accent)] bg-[var(--universe-accent)]/10 border border-[var(--universe-accent)]/20 px-3 py-1.5 rounded-full mb-4 tracking-widest uppercase select-none">
                      <Calendar className="w-3 h-3 text-[var(--universe-accent)]" />
                      {item.start_date} - {item.end_date || 'Present'}
                    </div>

                    <h3 className="text-xl font-display font-bold text-charcoal-900 dark:text-white mb-1 group-hover:text-[var(--universe-accent)] transition-colors duration-300">
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
                        prose-strong:text-[var(--universe-accent)] dark:prose-strong:text-[var(--universe-accent)] prose-strong:font-bold
                        prose-ul:list-disc prose-ul:pl-4 prose-ul:mb-2
                        prose-li:my-0.5"
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(item.description ?? '') }}
                    />

                    {/* Tech pills for Experience */}
                    {itemTech && itemTech.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-white/5 mt-4">
                        {itemTech.map((tech: string) => (
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
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Journey;

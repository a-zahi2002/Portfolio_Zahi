import React from 'react';
import { motion } from 'framer-motion';
import { useSkills } from '../hooks/cms/useSkills';
import type { CMSSkill } from '../types/cms';

const MarqueeRow: React.FC<{ skills: CMSSkill[]; direction: 'left' | 'right'; speed: number }> = ({ skills, direction, speed }) => {
  if (!skills.length) return null;
  return (
    <div className="relative flex overflow-hidden group">
      <motion.div
        className="flex gap-4 md:gap-8 flex-nowrap whitespace-nowrap"
        animate={{ x: direction === 'left' ? [0, -1000] : [-1000, 0] }}
        transition={{ ease: 'linear', duration: speed, repeat: Infinity }}
      >
        {[...skills, ...skills, ...skills, ...skills].map((skill, index) => (
          <div
            key={`${skill.id}-${index}`}
            className="glass-panel px-8 py-4 rounded-full border border-gray-200 dark:border-white/5 hover:border-blue-500/50 dark:hover:border-accent-cyan/50 transition-colors duration-300 flex items-center gap-3 cursor-default bg-white/50 dark:bg-transparent"
          >
            <span
              className="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]"
              style={{ backgroundColor: skill.color }}
            />
            <span className="text-lg font-medium text-gray-800 dark:text-gray-200">{skill.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const Skills: React.FC = () => {
  const { data: skills, isLoading } = useSkills();

  return (
    <section id="skills" className="py-32 bg-white dark:bg-charcoal-950 relative overflow-hidden transition-colors duration-300">
      {/* Background Fade Edges */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white dark:from-charcoal-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white dark:from-charcoal-900 to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-16 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-accent-purple dark:to-pink-500">Arsenal</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The tools and technologies I use to bring ideas to life.
          </p>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-8">
          {[30, 40].map((_, i) => (
            <div key={i} className="flex gap-6 overflow-hidden">
              {Array.from({ length: 8 }).map((__, j) => (
                <div key={j} className="px-8 py-4 rounded-full bg-white/5 animate-pulse w-36 shrink-0 h-12" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-8 relative z-0">
          <MarqueeRow skills={skills ?? []} direction="left" speed={30} />
          <MarqueeRow skills={[...(skills ?? [])].reverse()} direction="right" speed={40} />
        </div>
      )}
    </section>
  );
};

export default Skills;
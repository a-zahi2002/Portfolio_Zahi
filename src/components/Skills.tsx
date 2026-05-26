import React from 'react';
import { motion } from 'framer-motion';
import { useSkills } from '../hooks/cms/useSkills';
import type { CMSSkill } from '../types/cms';

const MarqueeRow: React.FC<{ skills: CMSSkill[]; direction: 'left' | 'right'; speed: number }> = ({ skills, direction, speed }) => {
  if (!skills.length) return null;
  return (
    <div className="relative flex overflow-hidden group">
      <motion.div
        className="flex gap-8 md:gap-16 flex-nowrap whitespace-nowrap items-center"
        animate={{ x: direction === 'left' ? [0, -2000] : [-2000, 0] }}
        transition={{ ease: 'linear', duration: speed, repeat: Infinity }}
      >
        {[...skills, ...skills, ...skills, ...skills, ...skills, ...skills].map((skill, index) => (
          <div
            key={`${skill.id}-${index}`}
            className="flex items-center gap-8 cursor-default"
          >
            <span className="text-6xl md:text-8xl lg:text-[10rem] font-display font-bold uppercase text-transparent tracking-tighter"
                  style={{ WebkitTextStroke: '1.5px rgba(150, 150, 150, 0.4)' }}>
              {skill.name}
            </span>
            <span
              className="w-4 h-4 md:w-8 md:h-8 rounded-full"
              style={{ backgroundColor: skill.color }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const Skills: React.FC = () => {
  const { data: skills, isLoading } = useSkills();

  return (
    <section id="skills" className="py-24 md:py-48 bg-white dark:bg-charcoal-950 relative overflow-hidden transition-colors duration-500">
      
      {/* Background Fade Edges to blend Marquee */}
      <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-white dark:from-charcoal-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-white dark:from-charcoal-950 to-transparent z-10 pointer-events-none" />

      <div className="container-padding mb-16 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl"
        >
          <h2 className="text-4xl md:text-6xl font-display font-medium mb-6 text-charcoal-900 dark:text-white uppercase tracking-tight">
            Technical <br/> <span className="text-accent-gold italic font-light">Arsenal</span>
          </h2>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-8 md:gap-16 opacity-30 mt-20">
          {[1, 2].map((_, i) => (
            <div key={i} className="flex gap-16 overflow-hidden">
              {Array.from({ length: 5 }).map((__, j) => (
                <div key={j} className="h-24 md:h-40 bg-charcoal-900/10 dark:bg-white/10 rounded-xl animate-pulse w-[400px] shrink-0" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:gap-8 relative z-0 mt-12 md:mt-24 rotate-0 lg:-rotate-2 scale-110">
          <MarqueeRow skills={skills ?? []} direction="left" speed={40} />
          <MarqueeRow skills={[...(skills ?? [])].reverse()} direction="right" speed={50} />
        </div>
      )}
    </section>
  );
};

export default Skills;
// CYBER TERMINAL THEME
// Skills.tsx — Glass-cyber cards with 3D tilt and gradient progress bars.
// CMS hooks, data: UNTOUCHED.

import React from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Code2, Database, Layout, Wrench, Cpu, Layers, Globe, Palette, Terminal, Settings } from 'lucide-react';
import { useSkills } from '../hooks/cms/useSkills';
import type { CMSSkill } from '../types/cms';

// Map icon name strings to Lucide components with themed colors
const ICON_MAP: Record<string, React.ReactNode> = {
  Code2: <Code2 className="text-accent-cyan shrink-0" size={22} />,
  Database: <Database className="text-accent-purple shrink-0" size={22} />,
  Layout: <Layout className="text-accent-cyan shrink-0" size={22} />,
  Wrench: <Wrench className="text-green-400 shrink-0" size={22} />,
  Cpu: <Cpu className="text-red-400 shrink-0" size={22} />,
  Layers: <Layers className="text-accent-gold shrink-0" size={22} />,
  Globe: <Globe className="text-emerald-400 shrink-0" size={22} />,
  Palette: <Palette className="text-pink-400 shrink-0" size={22} />,
  Terminal: <Terminal className="text-sky-400 shrink-0" size={22} />,
  Settings: <Settings className="text-violet-400 shrink-0" size={22} />,
};

interface GroupedSkill {
  category: string;
  icon: string;
  items: CMSSkill[];
}

// ── SkillsCard ────────────────────────────────────────────────────────────────
const SkillsCard: React.FC<{
  skillGroup: GroupedSkill;
  index: number;
  isTouchDevice: boolean;
}> = ({ skillGroup, index, isTouchDevice }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const cardRef = React.useRef<HTMLDivElement>(null);
  const isHorizontal = skillGroup.items.length >= 5;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
    rotateX.set(((y - rect.height / 2) / (rect.height / 2)) * -4);
    rotateY.set(((x - rect.width / 2) / (rect.width / 2)) * 4);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    rotateX.set(0);
    rotateY.set(0);
  };

  const backgroundSpotlight = useMotionTemplate`
    radial-gradient(
      350px circle at ${mouseX}px ${mouseY}px,
      rgba(0, 243, 255, 0.06) 0%,
      rgba(157, 95, 255, 0.02) 50%,
      transparent 100%
    )
  `;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{
        rotateX: isTouchDevice ? 0 : rotateX,
        rotateY: isTouchDevice ? 0 : rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`glass-cyber p-8 rounded-2xl relative overflow-hidden group flex-grow hud-corners
        ${isHorizontal
          ? 'w-full md:w-full lg:w-[calc(66.666%-1.5rem)]'
          : 'w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]'
        }`}
    >
      <div className="hud-corner tl" />
      <div className="hud-corner tr" />
      <div className="hud-corner bl" />
      <div className="hud-corner br" />

      {/* Spotlight overlay */}
      {!isTouchDevice && (
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
          style={{ background: backgroundSpotlight }}
        />
      )}

      {/* Content */}
      <div className="relative z-10" style={{ transform: isTouchDevice ? 'none' : 'translateZ(20px)' }}>
        {/* Category Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform duration-300">
              {ICON_MAP[skillGroup.icon] ?? <Code2 className="text-accent-cyan shrink-0" size={22} />}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display leading-none">
              {skillGroup.category}
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 text-gray-400">
            {skillGroup.items.length} {skillGroup.items.length === 1 ? 'Skill' : 'Skills'}
          </span>
        </div>

        {/* Skill Items */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-8 gap-y-5">
          {skillGroup.items.map((skill, i) => {
            const skillColor = skill.color || '#00f3ff';
            return (
              <div key={skill.id} className="space-y-2 group/item">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-200 group-hover/item:text-accent-cyan transition-colors">
                    {skill.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono font-semibold">
                    {skill.proficiency}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.proficiency}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.08 }}
                    className="h-full rounded-full absolute left-0 top-0"
                    style={{
                      background: `linear-gradient(90deg, ${skillColor}, ${skillColor}88)`,
                      boxShadow: `0 0 8px ${skillColor}40`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

// ── Main Skills Component ──────────────────────────────────────────────────────
const Skills: React.FC = () => {
  const { data: skills, isLoading } = useSkills();
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: none)');
    setIsTouchDevice(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Group skills by category
  const skillGroups = React.useMemo(() => {
    const grouped = (skills ?? []).reduce<Record<string, GroupedSkill>>((acc, skill) => {
      if (!skill.visible) return acc;
      if (!acc[skill.category]) {
        acc[skill.category] = { category: skill.category, icon: skill.icon || 'Code2', items: [] };
      }
      acc[skill.category].items.push(skill);
      return acc;
    }, {});
    const groups = Object.values(grouped);
    groups.forEach(g => { g.items.sort((a, b) => a.display_order - b.display_order); });
    return groups;
  }, [skills]);

  return (
    <section id="skills" className="py-32 relative overflow-hidden">
      {/* Background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-accent-purple/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4 text-charcoal-900 dark:text-white">
            Technical <span className="text-gradient-cyber">Arsenal</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg font-sans">
            Tools, languages, and frameworks I use to bring ideas to life.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-wrap gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-72 rounded-2xl bg-white/5 border border-white/5 animate-pulse w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-8 items-stretch">
            {skillGroups.map((skillGroup, groupIndex) => (
              <SkillsCard
                key={skillGroup.category}
                skillGroup={skillGroup}
                index={groupIndex}
                isTouchDevice={isTouchDevice}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
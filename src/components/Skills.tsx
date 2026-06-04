import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Database, Layout, Wrench, Cpu, Layers, Globe, Palette, Terminal, Settings } from 'lucide-react';
import { useSkills } from '../hooks/cms/useSkills';
import type { CMSSkill } from '../types/cms';
import { useSkillsAnimation } from '../hooks/animations/useSkillsAnimation';

// Map icon name strings to Lucide components with themed colors
const ICON_MAP: Record<string, React.ReactNode> = {
  Code2: <Code2 className="text-blue-500 shrink-0" size={22} />,
  Database: <Database className="text-purple-500 shrink-0" size={22} />,
  Layout: <Layout className="text-cyan-500 shrink-0" size={22} />,
  Wrench: <Wrench className="text-green-500 shrink-0" size={22} />,
  Cpu: <Cpu className="text-red-500 shrink-0" size={22} />,
  Layers: <Layers className="text-amber-500 shrink-0" size={22} />,
  Globe: <Globe className="text-emerald-500 shrink-0" size={22} />,
  Palette: <Palette className="text-pink-500 shrink-0" size={22} />,
  Terminal: <Terminal className="text-sky-500 shrink-0" size={22} />,
  Settings: <Settings className="text-violet-500 shrink-0" size={22} />,
};

interface GroupedSkill {
  category: string;
  icon: string;
  items: CMSSkill[];
}

// ── SkillsCard Sub-Component ───────────────────────────────────────────────────
const SkillsCard: React.FC<{
  skillGroup: GroupedSkill;
  index: number;
  isTouchDevice: boolean;
}> = ({ skillGroup, index, isTouchDevice }) => {
  // ✅ PERF: Replaced useMotionValue + useMotionTemplate (Framer reconciliation on every pixel)
  // with plain refs + inline style written directly in onMouseMove handler.
  const cardRef = React.useRef<HTMLDivElement>(null);
  const spotlightRef = React.useRef<HTMLDivElement>(null);
  const borderGlowRef = React.useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = React.useState({ rotateX: 0, rotateY: 0 });

  const isHorizontal = skillGroup.items.length >= 5;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // ✅ Write spotlight gradient directly to DOM — no motion value reconciliation
    const grad = `radial-gradient(350px circle at ${x}px ${y}px, rgba(var(--universe-accent-rgb, 0, 243, 255), 0.06) 0%, rgba(var(--universe-accent-secondary-rgb, 139, 92, 246), 0.02) 50%, transparent 100%)`;
    if (spotlightRef.current) spotlightRef.current.style.background = grad;

    const borderGrad = `radial-gradient(200px circle at ${x}px ${y}px, rgba(var(--universe-accent-rgb, 0, 243, 255), 0.25), transparent 80%)`;
    if (borderGlowRef.current) borderGlowRef.current.style.background = borderGrad;

    // 3D tilt (max 4 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rX = ((y - centerY) / centerY) * -4;
    const rY = ((x - centerX) / centerX) * 4;
    setTilt({ rotateX: rX, rotateY: rY });
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    if (spotlightRef.current) spotlightRef.current.style.background = '';
    if (borderGlowRef.current) borderGlowRef.current.style.background = '';
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      data-skill-item
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{
        rotateX: isTouchDevice ? 0 : tilt.rotateX,
        rotateY: isTouchDevice ? 0 : tilt.rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`p-8 rounded-3xl bg-white/80 dark:bg-charcoal-900/35 backdrop-blur-md border border-gray-200/50 dark:border-white/5 hover:border-[var(--universe-accent)]/30 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group flex-grow
        ${isHorizontal
          ? 'w-full md:w-full lg:w-[calc(66.666%-1.5rem)]'
          : 'w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]'
        }
      `}
    >
      {/* Spotlight overlay (Desktop only) — plain div, style written in handler */}
      {!isTouchDevice && (
        <div
          ref={spotlightRef}
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        />
      )}

      {/* Border shine glow */}
      {isTouchDevice ? (
        <div className="absolute inset-0 bg-gradient-to-tr from-accent-cyan/5 via-transparent to-accent-purple/5 opacity-40 pointer-events-none z-0" />
      ) : (
        <div
          ref={borderGlowRef}
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-accent-cyan/20 z-10"
          style={{
            WebkitMaskImage: 'linear-gradient(black, black)',
            maskImage: 'linear-gradient(black, black)',
          }}
        />
      )}

      {/* Content wrapper with translate-z to separate it from background tilt */}
      <div 
        className="relative z-10"
        style={{ transform: isTouchDevice ? 'none' : 'translateZ(20px)' }}
      >
        {/* Category Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3.5">
            {/* Spinning decorative core behind icon */}
            <div className="relative w-11 h-11 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-2xl group-hover:scale-105 transition-transform duration-500">
              <div className="absolute inset-0 bg-[var(--universe-accent)]/5 rounded-2xl group-hover:bg-[var(--universe-accent)]/15 group-hover:blur-[4px] transition-all" />
              <div className="absolute inset-0.5 rounded-2xl border border-dashed border-[var(--universe-accent)]/30 group-hover:border-[var(--universe-accent)]/60 animate-spin" style={{ animationDuration: '9s' }} />
              {ICON_MAP[skillGroup.icon] ?? <Code2 className="text-blue-500 shrink-0" size={22} />}
            </div>
            <div>
              {/* Sector tag */}
              <span className="block font-mono text-[7px] tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase leading-none mb-1">
                [ REACTOR CORE 0{index + 1} ]
              </span>
              <h3 className="text-base font-bold text-gray-900 dark:text-white font-display leading-none group-hover:text-[var(--universe-accent)] transition-colors">
                {skillGroup.category}
              </h3>
            </div>
          </div>
          <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400">
            {skillGroup.items.length} SPECTRA
          </span>
        </div>

        {/* Skill Items */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-8 gap-y-5">
          {skillGroup.items.map((skill, index) => {
            const skillColor = skill.color || 'var(--universe-accent)';
            return (
              <div key={skill.id} className="space-y-2 group/item" data-skill-item-inner>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-800 dark:text-gray-200 group-hover/item:text-[var(--universe-accent)] transition-colors">
                    {skill.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono font-semibold">
                    {skill.proficiency}%
                  </span>
                </div>
                
                {/* Progress Bar (translucent channel) */}
                <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full relative overflow-visible">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.proficiency}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.08 }}
                    className="h-full rounded-full absolute left-0 top-0 progress-bar-inner"
                    data-proficiency={skill.proficiency}
                    style={{ 
                      backgroundColor: skillColor,
                      boxShadow: `0 0 8px ${skillColor}aa`,
                    }}
                  >
                    {/* Glowing outer corona ring */}
                    <div 
                      className="absolute right-0 top-1/2 w-4.5 h-4.5 rounded-full border border-white/20 bg-white/5 pointer-events-none animate-ping z-10" 
                      style={{ 
                        transform: 'translate(50%, -50%)',
                        animationDuration: '3.5s'
                      }} 
                    />
                    
                    {/* Glowing planetary dot slider at the edge */}
                    <div 
                      className="absolute right-0 top-1/2 w-3.5 h-3.5 rounded-full border border-white z-20 pointer-events-none shadow-[0_0_8px_#ffffff]"
                      style={{ 
                        backgroundColor: skillColor, 
                        boxShadow: `0 0 12px ${skillColor}, 0 0 4px #ffffff`,
                        transform: 'translate(50%, -50%)'
                      }}
                    />
                  </motion.div>
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

  // ── Animation refs ──────────────────────────────────────────
  const sectionRef = React.useRef<HTMLElement>(null);
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  useSkillsAnimation({ sectionRef, headingRef }, isLoading ?? false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: none)');
    setIsTouchDevice(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Group the flat skills array by category
  const skillGroups = React.useMemo(() => {
    const grouped = (skills ?? []).reduce<Record<string, GroupedSkill>>((acc, skill) => {
      if (!skill.visible) return acc;
      if (!acc[skill.category]) {
        acc[skill.category] = {
          category: skill.category,
          icon: skill.icon || 'Code2',
          items: []
        };
      }
      acc[skill.category].items.push(skill);
      return acc;
    }, {});

    // Sort items within each category by display_order
    const groups = Object.values(grouped);
    groups.forEach(g => {
      g.items.sort((a, b) => a.display_order - b.display_order);
    });
    return groups;
  }, [skills]);

  return (
    <section id="skills" ref={sectionRef} className="py-32 relative overflow-hidden bg-transparent">
      
      {/* Decorative Star Constellation Lines & Concentric Orbits in background */}
      <div className="absolute inset-0 opacity-20 dark:opacity-40 pointer-events-none z-0">
        <svg className="w-full h-full" style={{ overflow: 'visible' }}>
          <ellipse cx="80%" cy="20%" rx="220" ry="110" fill="none" stroke="var(--universe-accent, #00f3ff)" strokeWidth="0.5" strokeDasharray="3 7" transform="rotate(-15)" />
          <ellipse cx="20%" cy="80%" rx="280" ry="140" fill="none" stroke="var(--universe-accent-secondary, #fcd34d)" strokeWidth="0.5" strokeDasharray="1 6" transform="rotate(10)" />
          
          {/* Wave line spectra indicators */}
          <path d="M 5% 50% Q 25% 40%, 50% 50% T 95% 50%" fill="none" stroke="var(--universe-accent, #00f3ff)" strokeWidth="0.25" strokeDasharray="2 8" opacity="0.3" />
        </svg>
      </div>

      {/* Decorative Background Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-purple-500/5 dark:bg-accent-purple/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          {/* Status Indicator Tag */}
          <div className="mb-4 inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.25em] text-[var(--universe-accent-secondary)] select-none uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--universe-accent-secondary)] animate-ping" />
            <span>[ SYSTEM TECH MATRIX DETECTED ]</span>
          </div>

          <h2 ref={headingRef} className="text-4xl lg:text-5xl font-display font-bold mb-4 text-charcoal-900 dark:text-white">
            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 dark:from-accent-purple dark:to-pink-400">Arsenal</span>
          </h2>
          <p className="text-charcoal-600 dark:text-gray-400 max-w-2xl mx-auto text-lg font-sans">
            Tools, languages, and frameworks I use to bring ideas to life.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-wrap gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-72 rounded-3xl bg-white/50 dark:bg-charcoal-800/50 border border-gray-200 dark:border-white/5 animate-pulse w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]" />
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
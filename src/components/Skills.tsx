// JARVIS-OS THEME — animation only
// Skills.tsx — additive JARVIS enhancements:
//   - Section header ScrambleText: "RUNNING CAPABILITY_INDEX..."
//   - Category header clip-path wipe left-to-right
//   - Skill items stagger in (opacity + x)
//   - "CAPABILITY_INDEX COMPILED" status line after all skills revealed
// CMS hooks, data, 3D tilt, spotlight: UNTOUCHED.

import React, { useLayoutEffect } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Code2, Database, Layout, Wrench, Cpu, Layers, Globe, Palette, Terminal, Settings } from 'lucide-react';
import { useSkills } from '../hooks/cms/useSkills';
import type { CMSSkill } from '../types/cms';
import { gsap, ScrollTrigger } from '../lib/gsap-config';

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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const cardRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const itemsRef = React.useRef<HTMLDivElement>(null);
  const isHorizontal = skillGroup.items.length >= 5;

  // ── JARVIS: Category wipe and items stagger ────────────────────────────────
  useLayoutEffect(() => {
    const card = cardRef.current;
    const header = headerRef.current;
    const items = itemsRef.current;
    if (!card || !header || !items) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set([header, items], { clipPath: 'inset(0 0% 0 0)', opacity: 1, x: 0 });
        return;
      }

      gsap.set(header, { clipPath: 'inset(0 0 100% 0)', opacity: 0 });
      const skillItems = items.querySelectorAll('.skill-item-row');
      gsap.set(skillItems, { opacity: 0, x: -10 });

      ScrollTrigger.create({
        trigger: card,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          // Category header wipe (top-to-bottom)
          gsap.to(header, {
            clipPath: 'inset(0 0 0% 0)',
            opacity: 1,
            duration: 0.6,
            delay: index * 0.15,
            ease: 'power3.out',
          });
          // Items stagger
          gsap.to(skillItems, {
            opacity: 1,
            x: 0,
            stagger: 0.06,
            duration: 0.4,
            delay: index * 0.15 + 0.3,
            ease: 'power2.out',
          });
        },
      });
    }, card);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
    const cardWidth = rect.width;
    const cardHeight = rect.height;
    const centerX = cardWidth / 2;
    const centerY = cardHeight / 2;
    rotateX.set(((y - centerY) / centerY) * -4);
    rotateY.set(((x - centerX) / centerX) * 4);
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
      rgba(139, 92, 246, 0.02) 50%,
      transparent 100%
    )
  `;

  return (
    <motion.div
      ref={cardRef}
      data-skill-item
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
      className={`p-8 rounded-3xl bg-white/70 dark:bg-charcoal-900/40 backdrop-blur-md border border-gray-200/50 dark:border-white/10 hover:border-blue-500/30 dark:hover:border-accent-cyan/30 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group flex-grow
        ${isHorizontal
          ? 'w-full md:w-full lg:w-[calc(66.666%-1.5rem)]'
          : 'w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]'
        }
      `}
    >
      {/* Spotlight overlay (Desktop only) */}
      {!isTouchDevice && (
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
          style={{ background: backgroundSpotlight }}
        />
      )}

      {isTouchDevice ? (
        <div className="absolute inset-0 bg-gradient-to-tr from-accent-cyan/5 via-transparent to-accent-purple/5 opacity-40 pointer-events-none z-0" />
      ) : (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-accent-cyan/20 z-10"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                200px circle at ${mouseX}px ${mouseY}px,
                rgba(0, 243, 255, 0.3),
                transparent 80%
              )
            `,
            WebkitMaskImage: 'linear-gradient(black, black)',
            maskImage: 'linear-gradient(black, black)',
          }}
        />
      )}

      {/* Content wrapper */}
      <div
        className="relative z-10"
        style={{ transform: isTouchDevice ? 'none' : 'translateZ(20px)' }}
      >
        {/* ── JARVIS: Category Header with clip-path wipe ────────────── */}
        <div
          ref={headerRef}
          className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-white/5"
          style={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-gray-100 dark:bg-white/5 group-hover:scale-110 transition-transform duration-300">
              {ICON_MAP[skillGroup.icon] ?? <Code2 className="text-blue-500 shrink-0" size={22} />}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display leading-none">
              {skillGroup.category}
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
            {skillGroup.items.length} {skillGroup.items.length === 1 ? 'Skill' : 'Skills'}
          </span>
        </div>

        {/* ── Skill Items ──────────────────────────────────────────────── */}
        <div ref={itemsRef} className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-8 gap-y-5">
          {skillGroup.items.map((skill, i) => {
            const skillColor = skill.color || '#00f3ff';
            return (
              <div key={skill.id} className="skill-item-row space-y-2 group/item">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-800 dark:text-gray-200 group-hover/item:text-blue-600 dark:group-hover/item:text-accent-cyan transition-colors">
                    {skill.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono font-semibold">
                    {skill.proficiency}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.proficiency}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.08 }}
                    className="h-full rounded-full absolute left-0 top-0"
                    style={{
                      backgroundColor: skillColor,
                      boxShadow: `0 0 6px ${skillColor}60`,
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

  const sectionRef = React.useRef<HTMLElement>(null);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const headerStatusRef = React.useRef<HTMLDivElement>(null);
  const compiledRef = React.useRef<HTMLDivElement>(null);

  // ── JARVIS: Section header ScrambleText + compiled status ──────────────────
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const headerStatus = headerStatusRef.current;
    const compiled = compiledRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        if (headerStatus) gsap.set(headerStatus, { opacity: 1 });
        return;
      }

      if (headerStatus) {
        gsap.set(headerStatus, { opacity: 0 });
        ScrollTrigger.create({
          trigger: section,
          start: 'top 70%',
          once: true,
          onEnter: () => {
            gsap.to(headerStatus, { opacity: 1, duration: 0.25 });
            gsap.to(headerStatus, {
              scrambleText: {
                text: '[ RUNNING CAPABILITY_INDEX... ]',
                chars: 'upperCase',
                speed: 0.8,
              },
              duration: 0.8,
            });
          },
        });
      }

      if (compiled) {
        gsap.set(compiled, { opacity: 0 });
        ScrollTrigger.create({
          trigger: compiled,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.to(compiled, { opacity: 1, duration: 0.25 });
            gsap.to(compiled, {
              scrambleText: {
                text: '[ CAPABILITY_INDEX COMPILED — ALL SYSTEMS INDEXED ]',
                chars: 'upperCase',
                speed: 0.8,
              },
              duration: 0.8,
            });
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [isLoading]);

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
    <section id="skills" ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Decorative Background Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-purple-500/5 dark:bg-accent-purple/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* ── JARVIS: Status header ──────────────────────────────────── */}
        <div
          ref={headerStatusRef}
          aria-hidden="true"
          style={{
            fontFamily: 'var(--j-font-mono)',
            fontSize: 11,
            color: 'var(--j-cyan)',
            letterSpacing: '0.1em',
            marginBottom: 12,
            opacity: 0,
          }}
        >
          &nbsp;
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
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
          <>
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

            {/* ── JARVIS: Compiled status ─────────────────────────────── */}
            <div
              ref={compiledRef}
              aria-hidden="true"
              style={{
                fontFamily: 'var(--j-font-mono)',
                fontSize: 11,
                color: 'var(--j-green)',
                letterSpacing: '0.1em',
                marginTop: 24,
                opacity: 0,
                textAlign: 'center',
              }}
            >
              &nbsp;
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Skills;
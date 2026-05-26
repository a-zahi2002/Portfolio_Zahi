import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Database, Layout, Wrench, Cpu, Layers, Globe, Palette, Terminal, Settings } from 'lucide-react';
import { useSkills } from '../hooks/cms/useSkills';
import type { CMSSkill } from '../types/cms';

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

const Skills: React.FC = () => {
  const { data: skills, isLoading } = useSkills();

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
    <section id="skills" className="py-32 relative overflow-hidden">
      
      {/* Decorative Background Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-purple-500/5 dark:bg-accent-purple/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4 text-charcoal-900 dark:text-white">
            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 dark:from-accent-purple dark:to-pink-400">Arsenal</span>
          </h2>
          <p className="text-charcoal-600 dark:text-gray-400 max-w-2xl mx-auto text-lg font-sans">
            Tools, languages, and frameworks I use to bring ideas to life.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-72 rounded-3xl bg-white/50 dark:bg-charcoal-800/50 border border-gray-200 dark:border-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 [column-fill:_balance]">
            {skillGroups.map((skillGroup, groupIndex) => (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: groupIndex * 0.08 }}
                className="break-inside-avoid mb-8 p-8 rounded-3xl bg-white/70 dark:bg-charcoal-900/40 backdrop-blur-md border border-gray-200/50 dark:border-white/10 hover:border-blue-500/30 dark:hover:border-accent-cyan/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/[0.02] dark:hover:shadow-accent-cyan/[0.02]"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
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

                {/* Skill Items */}
                <div className="space-y-5">
                  {skillGroup.items.map((skill, index) => {
                    const skillColor = skill.color || '#00f3ff';
                    return (
                      <div key={skill.id} className="space-y-2 group/item">
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
                            transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.08 }}
                            className="h-full rounded-full absolute left-0 top-0"
                            style={{ 
                              backgroundColor: skillColor,
                              boxShadow: `0 0 6px ${skillColor}60` 
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
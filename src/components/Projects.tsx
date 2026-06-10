// CYBER TERMINAL THEME
// Projects.tsx — Bento grid with spotlight cards and HUD overlays.
// CMS hooks, data, card click handlers: UNTOUCHED.

import React, { useRef } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useProjects } from '../hooks/cms/useProjects';
import type { CMSProject } from '../types/cms';
import { useAudio } from './audio/AudioProvider';

// ── Skeleton card ─────────────────────────────────────────────────────────────
const ProjectCardSkeleton: React.FC<{ wide?: boolean }> = ({ wide }) => (
  <div className={`rounded-2xl bg-white/5 border border-white/5 overflow-hidden animate-pulse ${wide ? 'md:col-span-2' : ''}`}>
    <div className="w-full h-full bg-white/5 min-h-[400px]" />
  </div>
);

// ── Spotlight Card ──────────────────────────────────────────────────────────
const SpotlightCard: React.FC<{ project: CMSProject; wide: boolean; index: number }> = ({ project, wide, index }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const { playHover } = useAudio();

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative glass-cyber rounded-2xl overflow-hidden ${wide ? 'md:col-span-2' : ''}`}
      onMouseEnter={playHover}
    >
      {/* HUD corners */}
      <div className="hud-corners absolute inset-0 pointer-events-none z-30">
        <div className="hud-corner tl" />
        <div className="hud-corner tr" />
        <div className="hud-corner bl" />
        <div className="hud-corner br" />
      </div>

      <motion.div
        data-project-card
        onMouseMove={handleMouseMove}
        ref={cardRef}
        className="group relative overflow-hidden min-h-[400px]"
      >
        {/* Spotlight Effect */}
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-20"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                600px circle at ${mouseX}px ${mouseY}px,
                rgba(0, 243, 255, 0.08),
                transparent 80%
              )
            `,
          }}
        />

        {/* Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-1000 ease-out"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-transparent pointer-events-none" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end pointer-events-none">
          <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
            <div className="flex justify-between items-start mb-4 pointer-events-auto">
              <div className="flex gap-2 flex-wrap">
                {project.technologies.slice(0, 3).map(tech => (
                  <span key={tech} className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white bg-white/10 border border-white/20 backdrop-blur-md rounded-full">
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white bg-white/10 border border-white/20 backdrop-blur-md rounded-full">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {(project.live_url || project.github_url) && (
                  <a
                    href={project.live_url || project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/10 hover:bg-accent-cyan border border-white/20 hover:border-accent-cyan rounded-full text-white hover:text-charcoal-950 backdrop-blur-md transition-all group-hover:scale-110"
                  >
                    <ArrowUpRight size={18} />
                  </a>
                )}
              </div>
            </div>

            <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">{project.title}</h3>
            <p className="text-gray-400 line-clamp-2 text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              {project.description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const Projects: React.FC = () => {
  const { data: projects, isLoading } = useProjects();

  return (
    <section id="projects" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4 text-charcoal-900 dark:text-white">
            Selected <span className="text-gradient-cyber">Works</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl text-lg font-sans">
            A showcase of recent production-ready applications and technical experiments.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]">
          {isLoading
            ? [true, false, false, true, false, false].map((wide, i) => <ProjectCardSkeleton key={i} wide={wide} />)
            : (projects ?? []).map((project, index) => (
                <SpotlightCard
                  key={project.id}
                  project={project}
                  index={index}
                  wide={project.featured || index === 0 || index === 3}
                />
              ))
          }
        </div>
      </div>
    </section>
  );
};

export default Projects;
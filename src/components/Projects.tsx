import React, { useRef } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useProjects } from '../hooks/cms/useProjects';
import type { CMSProject } from '../types/cms';
import { useProjectsAnimation } from '../hooks/animations/useProjectsAnimation';

// ── Skeleton card ─────────────────────────────────────────────────────────────
const ProjectCardSkeleton: React.FC<{ wide?: boolean }> = ({ wide }) => (
  <div className={`rounded-3xl bg-white dark:bg-charcoal-800 border border-gray-200 dark:border-white/5 overflow-hidden animate-pulse ${wide ? 'md:col-span-2' : ''}`}>
    <div className="w-full h-full bg-gray-100 dark:bg-white/5 min-h-[400px]" />
  </div>
);

// ── Spotlight Card ────────────────────────────────────────────────────────────
const SpotlightCard: React.FC<{ project: CMSProject; wide: boolean; index: number }> = ({ project, wide, index }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const isEven = index % 2 === 0;

  return (
    <motion.div
      data-project-card
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      onMouseMove={handleMouseMove}
      ref={cardRef}
      className={`group relative rounded-3xl overflow-hidden bg-white/70 dark:bg-[#07070a]/30 border border-gray-200/50 dark:border-white/10 hover:border-[var(--universe-accent)]/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between p-6 ${wide ? 'md:col-span-2' : ''}`}
    >
      {/* Spotlight Effect (Dynamic Glow) */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-0 mix-blend-overlay dark:mix-blend-screen"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(var(--universe-accent-rgb), 0.12),
              transparent 80%
            )
          `,
        }}
      />

      {/* Star Grid Background Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(var(--universe-accent-rgb),0.08)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-60 z-0" />

      {/* Visual Space Object Center */}
      <div className="relative w-full flex items-center justify-center py-4 z-10 flex-1">
        
        {/* Swirling Gravitational Lensing Glow behind the orb (Black Hole accretion disk) */}
        <div 
          className="absolute w-[240px] h-[240px] rounded-full blur-[30px] opacity-10 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none animate-spin-slow"
          style={{ background: 'radial-gradient(circle, var(--universe-accent) 0%, var(--universe-accent-secondary) 50%, transparent 70%)' }}
        />

        {/* Orbit Lines */}
        <svg className="absolute w-[220px] h-[220px] pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity" viewBox="0 0 100 100">
          <ellipse cx="50" cy="50" rx="38" ry="18" fill="none" stroke="var(--universe-accent)" strokeWidth="0.2" strokeDasharray="2 3" transform="rotate(-15 50 50)" />
          <ellipse cx="50" cy="50" rx="44" ry="22" fill="none" stroke="var(--universe-accent-secondary)" strokeWidth="0.2" strokeDasharray="1 4" transform="rotate(-15 50 50)" />
        </svg>

        {/* The Planet/Stellar Core Image (The Object) */}
        <div 
          className={`relative w-[130px] h-[130px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden border border-white/20 shadow-[0_0_20px_rgba(var(--universe-accent-rgb),0.1)] group-hover:shadow-[0_0_30px_rgba(var(--universe-accent-rgb),0.25)] bg-white dark:bg-[#050505] transition-all duration-500 z-10 group-hover:scale-105
            ${isEven ? 'animate-cosmic-float' : 'animate-cosmic-float-delay'}`}
        >
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-95 transition-opacity duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800';
            }}
          />
          {/* Gravitational lensing overlay ring inside core */}
          <div className="absolute inset-0 bg-radial-gradient(circle, transparent 65%, rgba(0,0,0,0.5) 100%) pointer-events-none" />
        </div>
      </div>

      {/* Meta Text details at the bottom */}
      <div className="relative z-10 mt-auto pt-4 border-t border-gray-100 dark:border-white/5 bg-transparent w-full">
        <div className="flex justify-between items-start mb-2.5">
          <h3 className="text-xl font-display font-bold text-charcoal-900 dark:text-white group-hover:text-[var(--universe-accent)] transition-colors duration-300">
            {project.title}
          </h3>
          <div className="flex gap-2 shrink-0">
            {(project.live_url || project.github_url) && (
              <a 
                href={project.live_url || project.github_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-full text-charcoal-600 dark:text-white hover:text-white dark:hover:text-charcoal-900 hover:bg-[var(--universe-accent)] dark:hover:bg-[var(--universe-accent)] hover:border-transparent transition-all shadow-sm duration-300 hover:scale-105"
              >
                <ArrowUpRight size={15} />
              </a>
            )}
          </div>
        </div>

        <p className="text-charcoal-600 dark:text-gray-400 text-xs md:text-sm line-clamp-2 leading-relaxed mb-4 font-sans">
          {project.description}
        </p>

        <div className="flex gap-2 flex-wrap">
          {project.technologies.slice(0, 3).map(tech => (
            <span key={tech} className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-charcoal-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-full">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-charcoal-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-full">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const Projects: React.FC = () => {
  const { data: projects, isLoading } = useProjects();

  // ── Animation refs ──────────────────────────────────────────
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useProjectsAnimation({ sectionRef, containerRef, marqueeRef }, isLoading ?? false);

  return (
    <section id="projects" ref={sectionRef} className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4 text-charcoal-900 dark:text-white">
            Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-accent-cyan dark:to-blue-400">Works</span>
          </h2>
          <p className="text-charcoal-600 dark:text-gray-400 max-w-xl text-lg font-sans">
            A showcase of recent production-ready applications and technical experiments.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]">
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

        {/* ── Tech Marquee ── shown if there are projects and at least one has technologies */}
        {!isLoading && (projects ?? []).some(p => p.technologies?.length > 0) && (
          <div
            ref={marqueeRef}
            className="mt-12 overflow-hidden relative"
            aria-hidden="true"
          >
            <div className="marquee-inner flex gap-6 whitespace-nowrap w-max">
              {/* Duplicate items twice so the seamless loop works */}
              {[0, 1].flatMap((dupIdx) =>
                (projects ?? []).flatMap((project) =>
                  project.technologies.slice(0, 4).map((tech, i) => (
                    <span
                      key={`dup${dupIdx}-${project.id}-${tech}-${i}`}
                      className="inline-flex items-center px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full border border-gray-200/50 dark:border-white/10 bg-white/60 dark:bg-white/5 text-charcoal-600 dark:text-gray-400 backdrop-blur-sm"
                    >
                      {tech}
                    </span>
                  ))
                )
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
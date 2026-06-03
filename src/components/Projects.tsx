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

  return (
    <motion.div
      data-project-card
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      onMouseMove={handleMouseMove}
      ref={cardRef}
      className={`group relative rounded-3xl overflow-hidden bg-white/60 dark:bg-charcoal-900/40 backdrop-blur-md border border-gray-200/50 dark:border-white/10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${wide ? 'md:col-span-2' : ''}`}
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-20 mix-blend-overlay dark:mix-blend-screen"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={project.thumbnail_url}
          alt={project.title}
          className="w-full h-full object-cover opacity-90 dark:opacity-50 group-hover:opacity-100 dark:group-hover:opacity-80 group-hover:scale-110 transition-transform duration-1000 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent dark:from-charcoal-950 dark:via-charcoal-950/70 dark:to-transparent pointer-events-none opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
      </div>

      <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end pointer-events-none">
        <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
          <div className="flex justify-between items-start mb-4 pointer-events-auto">
            <div className="flex gap-2 flex-wrap">
              {project.technologies.slice(0, 3).map(tech => (
                <span key={tech} className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white bg-white/10 border border-white/20 backdrop-blur-md rounded-full shadow-sm">
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white bg-white/10 border border-white/20 backdrop-blur-md rounded-full shadow-sm">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {(project.live_url || project.github_url) && (
                <a href={project.live_url || project.github_url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 hover:bg-white/30 border border-white/20 rounded-full text-white backdrop-blur-md transition-all shadow-sm group-hover:bg-blue-600 dark:group-hover:bg-accent-cyan dark:group-hover:text-charcoal-900 group-hover:border-transparent group-hover:scale-110">
                  <ArrowUpRight size={18} />
                </a>
              )}
            </div>
          </div>

          <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 pointer-events-auto">{project.title}</h3>
          <p className="text-gray-300 dark:text-gray-400 line-clamp-2 text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 pointer-events-auto">
            {project.description}
          </p>
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
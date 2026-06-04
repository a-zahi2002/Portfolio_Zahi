import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useProjects } from '../hooks/cms/useProjects';
import type { CMSProject } from '../types/cms';
import { useProjectsAnimation } from '../hooks/animations/useProjectsAnimation';

// ── Skeleton card ─────────────────────────────────────────────────────────────
const ProjectCardSkeleton: React.FC<{ wide?: boolean }> = ({ wide }) => (
  <div className={`rounded-3xl bg-white dark:bg-charcoal-800 border border-gray-200/50 dark:border-white/5 overflow-hidden animate-pulse ${wide ? 'md:col-span-2' : ''}`}>
    <div className="w-full h-full bg-gray-100 dark:bg-white/5 min-h-[400px]" />
  </div>
);

// ── Spotlight Card (Mobile Grid Layout) ────────────────────────────────────────
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

      <div className="absolute inset-0 bg-[radial-gradient(rgba(var(--universe-accent-rgb),0.08)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-60 z-0" />

      <div className="relative w-full flex items-center justify-center py-4 z-10 flex-1">
        <div 
          className="absolute w-[240px] h-[240px] rounded-full blur-[30px] opacity-10 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none animate-spin-slow"
          style={{ background: 'radial-gradient(circle, var(--universe-accent) 0%, var(--universe-accent-secondary) 50%, transparent 70%)' }}
        />

        <svg className="absolute w-[220px] h-[220px] pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity" viewBox="0 0 100 100">
          <ellipse cx="50" cy="50" rx="38" ry="18" fill="none" stroke="var(--universe-accent)" strokeWidth="0.2" strokeDasharray="2 3" transform="rotate(-15 50 50)" />
          <ellipse cx="50" cy="50" rx="44" ry="22" fill="none" stroke="var(--universe-accent-secondary)" strokeWidth="0.2" strokeDasharray="1 4" transform="rotate(-15 50 50)" />
        </svg>

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
          <div className="absolute inset-0 bg-radial-gradient(circle, transparent 65%, rgba(0,0,0,0.5) 100%) pointer-events-none" />
        </div>
      </div>

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

// ── Solar System Position Utility ─────────────────────────────────────────────
const getProjectPosition = (project: CMSProject, index: number) => {
  // Distribute projects across the 3 orbits
  const orbit = (index % 3) + 1; // 1, 2, or 3
  
  // Deterministic pseudo-random angle based on project ID/slug to keep positions stable
  let hash = 0;
  const idStr = project.id || index.toString();
  for (let i = 0; i < idStr.length; i++) {
    hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const seed = Math.abs(hash);
  const angle = seed % 360;
  
  // Convert to radians
  const rad = (angle * Math.PI) / 180;
  
  // Radii for orbits (elliptical squish for perspective)
  let rx = 180;
  let ry = 100;
  if (orbit === 2) {
    rx = 330;
    ry = 175;
  } else if (orbit === 3) {
    rx = 480;
    ry = 250;
  }
  
  const x = Math.cos(rad) * rx;
  const y = Math.sin(rad) * ry;
  
  return { x, y, orbit, angle };
};

// ── Solar System Card (Desktop Layout) ────────────────────────────────────────
const SolarSystemCard: React.FC<{
  project: CMSProject;
  x: number;
  y: number;
  orbit: number;
  angle: number;
  index: number;
}> = ({ project, x, y, orbit, angle, index }) => {
  const isEven = index % 2 === 0;

  return (
    <div
      data-project-card
      data-x={x}
      data-y={y}
      data-angle={angle}
      data-orbit={orbit}
      className="absolute w-[240px] z-20 group pointer-events-auto"
      style={{
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
      }}
    >
      <div className="relative rounded-2xl bg-white/80 dark:bg-charcoal-900/30 backdrop-blur-md p-4 border border-gray-200/50 dark:border-white/5 hover:border-[var(--universe-accent)]/30 shadow-md group-hover:shadow-[0_0_30px_rgba(var(--universe-accent-rgb),0.2)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center">
        
        {/* Soft background glow matching orbit */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[var(--universe-accent)]/5 to-transparent blur-md rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Planet Core (Project image as rotating sphere) */}
        <div className="relative w-20 h-20 rounded-full border border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.15)] group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(var(--universe-accent-rgb),0.3)] transition-all duration-500 overflow-hidden bg-white dark:bg-[#050505] mb-3">
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className={`w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-300
              ${isEven ? 'animate-cosmic-float' : 'animate-cosmic-float-delay'}`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800';
            }}
          />
          {/* Gravitational Lensing shade */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent pointer-events-none mix-blend-multiply" />
        </div>

        {/* Orbit indicator text */}
        <span className="font-mono text-[8px] tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase mb-1">
          [ ORBITAL ZONE 0{orbit} ]
        </span>

        {/* Title */}
        <h3 className="text-base font-display font-bold text-charcoal-900 dark:text-white group-hover:text-[var(--universe-accent)] transition-colors text-center truncate w-full">
          {project.title}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-charcoal-600 dark:text-gray-400 text-center line-clamp-2 leading-relaxed mt-1 mb-3 font-sans">
          {project.description}
        </p>

        {/* Tech Badges */}
        <div className="flex gap-1.5 justify-center flex-wrap mb-3.5">
          {project.technologies.slice(0, 2).map(tech => (
            <span key={tech} className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-charcoal-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-full">
              {tech}
            </span>
          ))}
          {project.technologies.length > 2 && (
            <span className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-charcoal-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-full">
              +{project.technologies.length - 2}
            </span>
          )}
        </div>

        {/* Project Link Action */}
        {(project.live_url || project.github_url) && (
          <a
            href={project.live_url || project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1 py-1.5 bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-charcoal-600 dark:text-white hover:text-white dark:hover:text-charcoal-950 hover:bg-[var(--universe-accent)] dark:hover:bg-[var(--universe-accent)] hover:border-transparent transition-all duration-300 group/btn"
          >
            <span>Launch Planet</span>
            <ArrowUpRight size={10} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </a>
        )}
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const Projects: React.FC = () => {
  const { data: projects, isLoading } = useProjects();
  const [isDesktop, setIsDesktop] = useState(false);

  // ── Animation refs ──────────────────────────────────────────
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkViewport = () => setIsDesktop(window.innerWidth >= 1024);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  useProjectsAnimation({ sectionRef, containerRef, marqueeRef }, isLoading ?? false, isDesktop);

  return (
    <section id="projects" ref={sectionRef} className="py-32 relative overflow-hidden bg-transparent">
      
      {/* Dynamic Glow in the background */}
      <div className="absolute top-1/2 left-1/2 w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] bg-cyan-500/5 dark:bg-accent-cyan/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />

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

        {/* Projects Layout Switcher */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]">
            {[true, false, false, true, false, false].map((wide, i) => (
              <ProjectCardSkeleton key={i} wide={wide} />
            ))}
          </div>
        ) : isDesktop ? (
          /* Desktop layout: Solar System */
          <div ref={containerRef} className="relative w-full h-[650px] flex items-center justify-center overflow-visible select-none mt-12 mb-16">
            
            {/* Concentric Orbits Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stellar-orbits" style={{ overflow: 'visible' }}>
              {/* Orbit 1 */}
              <ellipse cx="50%" cy="50%" rx="180" ry="100" fill="none" stroke="var(--universe-accent)" strokeWidth="1" strokeDasharray="3 6" className="opacity-0" />
              {/* Orbit 2 */}
              <ellipse cx="50%" cy="50%" rx="330" ry="175" fill="none" stroke="var(--universe-accent-secondary)" strokeWidth="1" strokeDasharray="2 8" className="opacity-0" />
              {/* Orbit 3 */}
              <ellipse cx="50%" cy="50%" rx="480" ry="250" fill="none" stroke="var(--universe-accent)" strokeWidth="1" strokeDasharray="4 4" className="opacity-0" />
            </svg>

            {/* Central Sun (The Star Core) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center stellar-sun-core opacity-0">
              {/* Pulsing Sun flares */}
              <div 
                className="absolute w-[180px] h-[180px] rounded-full blur-[35px] opacity-75 animate-solar-flare pointer-events-none"
                style={{ background: 'radial-gradient(circle, var(--universe-accent) 0%, var(--universe-accent-secondary) 60%, transparent 100%)' }} 
              />
              
              {/* Sun Core Sphere */}
              <div className="relative w-[130px] h-[130px] rounded-full border border-white/20 flex flex-col items-center justify-center bg-white/80 dark:bg-[#07070a]/60 backdrop-blur-xl shadow-[0_0_40px_rgba(var(--universe-accent-rgb),0.35)] animate-spin-slow">
                <div className="absolute inset-2 rounded-full border border-dashed border-[var(--universe-accent)]/30 animate-spin" style={{ animationDuration: '10s' }} />
                <div className="absolute inset-4 rounded-full border border-dotted border-[var(--universe-accent-secondary)]/30 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
              </div>

              {/* Core Text Info */}
              <div className="absolute pointer-events-none flex flex-col items-center justify-center text-center">
                <span className="font-mono text-[8px] tracking-[0.35em] text-[var(--universe-accent)] uppercase">[ ARCHIVE ]</span>
                <span className="font-display font-bold text-sm text-charcoal-900 dark:text-white mt-0.5">STELLAR</span>
                <span className="font-display font-bold text-xs text-[var(--universe-accent-secondary)]">WORKS</span>
              </div>
            </div>

            {/* Projects mapped as Orbiting Planet Cards */}
            {(projects ?? []).map((project, index) => {
              const { x, y, orbit, angle } = getProjectPosition(project, index);
              
              return (
                <SolarSystemCard
                  key={project.id}
                  project={project}
                  x={x}
                  y={y}
                  orbit={orbit}
                  angle={angle}
                  index={index}
                />
              );
            })}
          </div>
        ) : (
          /* Mobile / Tablet layout: Bento Grid */
          <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]">
            {(projects ?? []).map((project, index) => (
              <SpotlightCard
                key={project.id}
                project={project}
                index={index}
                wide={project.featured || index === 0 || index === 3}
              />
            ))}
          </div>
        )}

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
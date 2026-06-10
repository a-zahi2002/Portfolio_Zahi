// CYBER TERMINAL THEME
// Projects.tsx — Bento grid with spotlight cards and HUD overlays.
// CMS hooks, data, card click handlers: UNTOUCHED.

import React, { useRef } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useProjects } from '../hooks/cms/useProjects';
import type { CMSProject } from '../types/cms';
import { useAudio } from './audio/AudioProvider';

// Helper to get dynamic responsive span classes for a project card to perfectly fill a bento grid with zero gaps.
const getCardSpanClasses = (index: number, total: number): string => {
  if (total === 0) return '';
  
  // 1. Mobile layout: grid-cols-1, so all cards span 1 (default width)
  
  // 2. Medium layout (Tablet): md:grid-cols-2
  // If total is even, we can lay out all cards as span 1 (equal halves).
  // If total is odd, we want one card to be full width (span 2) to avoid any trailing gap.
  // We make the first card full width (col-span-2) if total is odd.
  let mdSpan = 'md:col-span-1';
  if (total === 1) {
    mdSpan = 'md:col-span-2';
  } else if (total % 2 !== 0) {
    if (index === 0) {
      mdSpan = 'md:col-span-2';
    }
  } else {
    // If total is even and > 2, we can alternate full-width cards at the beginning and end
    // for a more dynamic feel (e.g., total = 4: first and last are span 2, middle are span 1).
    if (total > 2) {
      if (index === 0 || index === total - 1) {
        mdSpan = 'md:col-span-2';
      }
    }
  }

  // 3. Large layout (Desktop): lg:grid-cols-6 (we use 6 cols for max flexibility)
  // We want to group items into rows where the sum of spans is exactly 6.
  // We partition the total items into rows of size 3 (spans [2, 2, 2]) and size 2 (spans [4, 2] or [2, 4]).
  let lgSpan = 'lg:col-span-2'; // Default to 1/3 width

  if (total === 1) {
    lgSpan = 'lg:col-span-6';
  } else {
    // Decompose total into row sizes of 3 and 2
    let numThrees = 0;
    let numTwos = 0;
    if (total % 3 === 0) {
      numThrees = total / 3;
    } else if (total % 3 === 1) {
      numThrees = (total - 4) / 3;
      numTwos = 2;
    } else { // total % 3 === 2
      numThrees = (total - 2) / 3;
      numTwos = 1;
    }

    // Interleave rows of size 2 and size 3 to create a dynamic bento mix
    const rowSizes: number[] = [];
    const totalRows = numThrees + numTwos;
    let tempThrees = numThrees;
    let tempTwos = numTwos;

    for (let i = 0; i < totalRows; i++) {
      if (tempTwos > 0 && (i % 2 === 0 || tempThrees === 0)) {
        rowSizes.push(2);
        tempTwos--;
      } else {
        rowSizes.push(3);
        tempThrees--;
      }
    }

    // Find which row and position the current index falls into
    let currentIndex = 0;
    let targetRowIndex = -1;
    let targetRowSize = 0;
    let positionInRow = 0;
    let twoRowCounter = 0;

    for (let r = 0; r < rowSizes.length; r++) {
      const size = rowSizes[r];
      if (index >= currentIndex && index < currentIndex + size) {
        targetRowIndex = r;
        targetRowSize = size;
        positionInRow = index - currentIndex;
        
        // Count how many size-2 rows are BEFORE this row
        // to alternate spans [4, 2] vs [2, 4]
        let tempTwoCounter = 0;
        for (let j = 0; j < r; j++) {
          if (rowSizes[j] === 2) tempTwoCounter++;
        }
        twoRowCounter = tempTwoCounter;
        break;
      }
      currentIndex += size;
    }

    if (targetRowSize === 3) {
      lgSpan = 'lg:col-span-2'; // Three items in row: each spans 2/6 (33.3%)
    } else if (targetRowSize === 2) {
      // Alternate span order between rows of size 2
      if (twoRowCounter % 2 === 0) {
        lgSpan = positionInRow === 0 ? 'lg:col-span-4' : 'lg:col-span-2';
      } else {
        lgSpan = positionInRow === 0 ? 'lg:col-span-2' : 'lg:col-span-4';
      }
    }
  }

  return `${mdSpan} ${lgSpan}`;
};

// ── Skeleton card ─────────────────────────────────────────────────────────────
const ProjectCardSkeleton: React.FC<{ spanClasses: string }> = ({ spanClasses }) => (
  <div className={`rounded-2xl bg-white/5 border border-white/5 overflow-hidden animate-pulse ${spanClasses}`}>
    <div className="w-full h-full bg-white/5 min-h-[400px]" />
  </div>
);

// ── Spotlight Card ──────────────────────────────────────────────────────────
const SpotlightCard: React.FC<{ project: CMSProject; spanClasses: string; index: number }> = ({ project, spanClasses, index }) => {
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
      className={`relative glass-cyber rounded-2xl overflow-hidden ${spanClasses}`}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 auto-rows-[400px]">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ProjectCardSkeleton key={i} spanClasses={getCardSpanClasses(i, 6)} />
              ))
            : (projects ?? []).map((project, index) => (
                <SpotlightCard
                  key={project.id}
                  project={project}
                  index={index}
                  spanClasses={getCardSpanClasses(index, (projects ?? []).length)}
                />
              ))
          }
        </div>
      </div>
    </section>
  );
};

export default Projects;
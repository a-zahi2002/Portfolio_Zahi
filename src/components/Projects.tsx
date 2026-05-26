import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useProjects } from '../hooks/cms/useProjects';
import type { CMSProject } from '../types/cms';

const ProjectSkeleton: React.FC = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-charcoal-900/5 dark:bg-white/5 animate-pulse border-b border-charcoal-900/10 dark:border-white/10" />
);

const ProjectCaseStudy: React.FC<{ project: CMSProject; index: number }> = ({ project, index }) => {
  const isEven = index % 2 === 0;

  return (
    <div className="relative min-h-[100vh] md:min-h-screen w-full flex items-center justify-center overflow-hidden group border-b border-charcoal-900/10 dark:border-white/10 last:border-0 bg-white dark:bg-charcoal-950">
      
      {/* Parallax Background Image */}
      <div className="absolute inset-0 w-full h-[120%] -top-[10%] z-0 parallax" data-speed="0.15">
        <div className="absolute inset-0 bg-charcoal-950/80 dark:bg-black/80 z-10 transition-opacity duration-700 group-hover:bg-charcoal-950/60 dark:group-hover:bg-black/60" />
        <img
          src={project.thumbnail_url}
          alt={project.title}
          className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';
          }}
        />
      </div>

      <div className="container-padding relative z-20 w-full">
        <div className={`flex flex-col ${isEven ? 'md:items-start' : 'md:items-end'} text-left ${isEven ? '' : 'md:text-right'}`}>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6 max-w-2xl"
          >
            {/* Tech Stack */}
            <div className={`flex flex-wrap gap-3 ${isEven ? 'justify-start' : 'md:justify-end justify-start'}`}>
              {project.technologies.slice(0, 4).map(tech => (
                <span key={tech} className="text-xs uppercase tracking-widest text-accent-gold font-medium">
                  {tech}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium text-white uppercase leading-[0.9]">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-lg md:text-xl font-sans text-gray-300 leading-relaxed max-w-xl">
              {project.description}
            </p>

            {/* Links */}
            <div className={`flex items-center gap-6 mt-4 ${isEven ? 'justify-start' : 'md:justify-end justify-start'}`}>
              {(project.live_url || project.github_url) && (
                <a 
                  href={project.live_url || project.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group/btn flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-white hover:text-accent-gold transition-colors"
                >
                  <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:border-accent-gold transition-colors backdrop-blur-sm">
                    <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </span>
                  <span>View Case</span>
                </a>
              )}
            </div>
          </motion.div>

        </div>
      </div>
      
    </div>
  );
};

const Projects: React.FC = () => {
  const { data: projects, isLoading } = useProjects();

  return (
    <section id="projects" className="bg-[#f5f5f7] dark:bg-charcoal-950 transition-colors duration-500">
      
      {/* Intro Header */}
      <div className="container-padding py-32 md:py-48">
        <div className="max-w-4xl">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-display font-medium mb-6 text-charcoal-900 dark:text-white uppercase tracking-tight"
          >
            Selected <br/> <span className="text-accent-gold italic font-light">Cases</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-charcoal-600 dark:text-gray-400 max-w-xl text-lg font-sans"
          >
            A curated selection of digital experiences, combining intentional design with robust engineering.
          </motion.p>
        </div>
      </div>

      {/* Case Studies */}
      <div className="flex flex-col w-full">
        {isLoading
          ? [true, false].map((_, i) => <ProjectSkeleton key={i} />)
          : (projects ?? []).map((project, index) => (
              <ProjectCaseStudy
                key={project.id}
                project={project}
                index={index}
              />
            ))
        }
      </div>
      
    </section>
  );
};

export default Projects;
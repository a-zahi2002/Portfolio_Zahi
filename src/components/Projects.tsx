import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

const projects: Project[] = [
  {
    name: "Taste of Tradition",
    description: "A visually appealing recipe site showcasing traditional Sri Lankan dishes.",
    techUsed: ["HTML", "CSS", "JS"],
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600",
    link: "https://github.com/a-zahi2002/Taste-of-Tradition-Cookbook"
  },
  {
    name: "BookMaster POS",
    description: "Electron-based desktop POS for bookstores with SQLite inventory tracking.",
    techUsed: ["Electron", "SQLite"],
    image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600",
    link: "https://github.com/a-zahi2002/BookMaster"
  },
  {
    name: "ExploreLanka",
    description: "Tourist-friendly platform for Sri Lankan travel planning.",
    techUsed: ["React", "TypeScript"],
    image: "https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=600",
    link: "https://github.com/a-zahi2002/ExploreLanka-TravelAdvisor-web"
  },
   {
    name: "Portfolio V1",
    description: "My previous personal site built with Bootstrap 5.",
    techUsed: ["Bootstrap"],
    image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600",
    link: "https://github.com/a-zahi2002/Portfolio"
  },
];

const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;
    
    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative active:scale-95 transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </motion.div>
  );
};

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-32 bg-gray-50 dark:bg-charcoal-900 relative transition-colors duration-300">
       {/* Decorative grid background */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-accent-cyan dark:to-blue-500">Works</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl text-lg">
            A showcase of my recent production-ready applications and experiments.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]">
          {projects.map((project, index) => (
            <TiltCard 
                key={index} 
                className={`group rounded-3xl bg-white dark:bg-charcoal-800 border border-gray-200 dark:border-white/5 overflow-hidden hover:shadow-2xl hover:border-blue-500/30 dark:hover:border-accent-cyan/30 transition-all duration-300 ${index === 0 || index === 3 ? 'md:col-span-2' : ''}`}
            >
              <div className="absolute inset-0 z-0">
                  <img src={project.image} alt={project.name} className="w-full h-full object-cover opacity-90 dark:opacity-60 group-hover:opacity-100 dark:group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent dark:from-charcoal-950 dark:via-charcoal-950/50 dark:to-transparent"></div>
              </div>
              
              <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end transform translate-z-20">
                <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-2 mb-3">
                            {project.techUsed.map(tech => (
                                <span key={tech} className="px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-100 bg-blue-600/20 border border-blue-400/20 dark:text-accent-cyan dark:bg-accent-cyan/10 dark:border-accent-cyan/20 backdrop-blur-md rounded-full">
                                    {tech}
                                </span>
                            ))}
                        </div>
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors">
                            <ArrowUpRight size={20} />
                        </a>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">{project.name}</h3>
                    <p className="text-gray-200 dark:text-gray-400 line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {project.description}
                    </p>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
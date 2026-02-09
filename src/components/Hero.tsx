import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
// import ParticleBackground from './ParticleBackground';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-charcoal-950 transition-colors duration-300">
      
      {/* 3D Background */}
      {/* <ParticleBackground /> */}
      
      {/* Overlay Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pointer-events-none">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
           <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
            A. Zahi <span className="text-blue-600 dark:text-accent-cyan text-glow">Faleel</span>
          </h1>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-accent-cyan dark:to-blue-500 rounded-full"></div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Building immersive <span className="text-gray-900 dark:text-white font-semibold">Digital Experiences</span> with robust engineering and elegant design.
        </motion.p>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.6, duration: 0.8 }}
           className="pointer-events-auto"
        >
          <button 
             onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
             className="glass-button group flex items-center gap-2 mx-auto"
          >
            Explore Work 
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </div>

       {/* Scroll Indicator */}
       <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-blue-500 dark:via-accent-cyan to-transparent"></div>
      </motion.div>
    </section>
  );
};

export default Hero;
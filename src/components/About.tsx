import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Smartphone, Code, Zap } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="relative py-32 bg-white dark:bg-charcoal-950 overflow-hidden transition-colors duration-300">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-accent-purple/20 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Image Column */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-accent-cyan dark:to-accent-purple rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative glass-panel p-2 rounded-2xl overflow-hidden aspect-square max-w-md mx-auto lg:mx-0">
               <img 
                  src="./assets/profile.jpg" 
                  alt="A. Zahi Faleel"
                  className="w-full h-full object-cover rounded-xl filter grayscale group-hover:grayscale-0 transition-all duration-500" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80';
                  }}
               />
               <div className="absolute bottom-6 right-6 glass-panel px-4 py-2 flex items-center gap-2 border border-gray-200 dark:border-white/20">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-semibold tracking-wider text-gray-900 dark:text-white">OPEN TO WORK</span>
               </div>
            </div>
          </div>

          {/* Text Column */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-gray-900 dark:text-white">
               About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-accent-cyan dark:to-blue-500">Me</span>
            </h2>
            
            <div className="glass-panel p-8 md:p-10 relative overflow-hidden group border-gray-200 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-accent-cyan/30 transition-colors duration-500">
               <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6 relative z-10 block">
                  I am a passionate <span className="text-blue-600 dark:text-accent-cyan font-medium">Creative Developer</span> dedicated to building immersive web experiences. 
                  My work bridges the gap between robust engineering and elegant design, ensuring every pixel serves a purpose.
               </p>
               <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed mb-8 relative z-10 block">
                  With a strong foundation in modern web technologies, I focus on performance, accessibility, and creating interfaces 
                  that feel "alive" through subtle interactions and 3D elements.
               </p>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                     <Code className="text-blue-600 dark:text-accent-cyan shrink-0" />
                     <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Clean Code</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Scalable & Maintainable</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                     <Zap className="text-purple-600 dark:text-accent-purple shrink-0" />
                     <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Performance</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Lightning Fast Loads</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default About;

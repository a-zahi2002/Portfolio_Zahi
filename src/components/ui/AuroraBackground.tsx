import React from 'react';
import { motion } from 'framer-motion';

const AuroraBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#fafafa] dark:bg-[#050505] transition-colors duration-700">
      <div className="absolute inset-0 opacity-30 dark:opacity-40 parallax-glow">
        <motion.div
          animate={{
            transform: [
              'translate(0%, 0%) scale(1)',
              'translate(20%, 10%) scale(1.1)',
              'translate(-10%, 20%) scale(0.9)',
              'translate(0%, 0%) scale(1)',
            ],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/30 dark:bg-accent-cyan/20 blur-[120px]"
        />
        <motion.div
          animate={{
            transform: [
              'translate(0%, 0%) scale(1)',
              'translate(-20%, -10%) scale(1.2)',
              'translate(10%, -20%) scale(0.8)',
              'translate(0%, 0%) scale(1)',
            ],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-400/30 dark:bg-accent-purple/20 blur-[150px]"
        />
        <motion.div
          animate={{
            transform: [
              'translate(0%, 0%) scale(1)',
              'translate(15%, -15%) scale(0.9)',
              'translate(-15%, 15%) scale(1.1)',
              'translate(0%, 0%) scale(1)',
            ],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-cyan-400/20 dark:bg-blue-500/20 blur-[100px]"
        />
      </div>
      {/* Light Noise Overlay for Texture */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default AuroraBackground;

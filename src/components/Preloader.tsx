// Cyber Terminal — Preloader
// Minimal brand reveal with neon trace line. Runs once per session.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !sessionStorage.getItem('ct-preloader-done');
  });

  useEffect(() => {
    if (!show) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      sessionStorage.setItem('ct-preloader-done', '1');
      setShow(false);
      onComplete();
    }, 2200);

    return () => clearTimeout(timer);
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: 'var(--ct-bg)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="flex flex-col items-center gap-6">
            {/* Brand Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-6xl font-display font-bold tracking-tight"
              style={{ color: 'var(--ct-text)' }}
            >
              A.ZAHI
              <span className="text-gradient-cyber">.</span>
            </motion.h1>

            {/* Neon trace line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
              className="h-[2px] w-32"
              style={{
                background: 'linear-gradient(90deg, var(--ct-cyan), var(--ct-purple))',
                transformOrigin: 'left center',
                boxShadow: '0 0 12px var(--ct-cyan-glow)',
              }}
            />

            {/* Loading text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-xs font-mono tracking-[0.2em] uppercase"
              style={{ color: 'var(--ct-text-dim)' }}
            >
              Initializing
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;

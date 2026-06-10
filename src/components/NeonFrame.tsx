// Cyber Terminal — Neon Frame
// Animated border that traces the viewport edges on load, then stays as ambient decoration.

import React from 'react';
import { motion } from 'framer-motion';

interface NeonFrameProps {
  isVisible: boolean;
}

const NeonFrame: React.FC<NeonFrameProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  const lineStyle = {
    background: 'linear-gradient(90deg, var(--ct-cyan), var(--ct-purple))',
    position: 'fixed' as const,
    pointerEvents: 'none' as const,
    zIndex: 90,
    opacity: 0.15,
  };

  return (
    <div aria-hidden="true">
      {/* Top */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
        style={{
          ...lineStyle,
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          transformOrigin: 'left',
        }}
      />
      {/* Right */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.0, delay: 1.0, ease: [0.65, 0, 0.35, 1] }}
        style={{
          ...lineStyle,
          top: 0,
          right: 0,
          bottom: 0,
          width: 1,
          transformOrigin: 'top',
          background: 'linear-gradient(180deg, var(--ct-purple), transparent)',
        }}
      />
      {/* Bottom */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.0, delay: 1.5, ease: [0.65, 0, 0.35, 1] }}
        style={{
          ...lineStyle,
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          transformOrigin: 'right',
          background: 'linear-gradient(270deg, transparent, var(--ct-cyan))',
        }}
      />
      {/* Left */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.0, delay: 2.0, ease: [0.65, 0, 0.35, 1] }}
        style={{
          ...lineStyle,
          top: 0,
          left: 0,
          bottom: 0,
          width: 1,
          transformOrigin: 'bottom',
          background: 'linear-gradient(0deg, var(--ct-cyan), transparent)',
        }}
      />
    </div>
  );
};

export default NeonFrame;

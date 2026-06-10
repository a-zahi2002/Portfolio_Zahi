// Cyber Terminal — Custom Cursor
// Magnetic dot cursor with outer ring. Desktop only.

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CyberCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only show on non-touch devices
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Track hover over interactive elements
    const handleElementEnter = () => setIsHovering(true);
    const handleElementLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Observe interactive elements
    const interactiveSelectors = 'a, button, [role="button"], input, textarea, select, [data-cursor-hover]';
    const addListeners = () => {
      document.querySelectorAll(interactiveSelectors).forEach(el => {
        el.addEventListener('mouseenter', handleElementEnter);
        el.addEventListener('mouseleave', handleElementLeave);
      });
    };

    addListeners();
    // Re-add listeners when DOM changes
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    // Add cursor-none class
    document.body.classList.add('cursor-none-global');

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.querySelectorAll(interactiveSelectors).forEach(el => {
        el.removeEventListener('mouseenter', handleElementEnter);
        el.removeEventListener('mouseleave', handleElementLeave);
      });
      observer.disconnect();
      document.body.classList.remove('cursor-none-global');
    };
  }, [cursorX, cursorY, isVisible]);

  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null;
  }

  return (
    <>
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 12 : 6,
            height: isHovering ? 12 : 6,
          }}
          transition={{ duration: 0.15 }}
          style={{
            borderRadius: '50%',
            background: '#fff',
          }}
        />
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 48 : 36,
            height: isHovering ? 48 : 36,
            borderColor: isHovering ? 'var(--ct-cyan)' : 'rgba(255,255,255,0.3)',
          }}
          transition={{ duration: 0.2 }}
          style={{
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: isHovering ? 'var(--ct-glow-cyan)' : 'none',
            transition: 'box-shadow 0.3s ease',
          }}
        />
      </motion.div>
    </>
  );
};

export default CyberCursor;

// ANIMATION LAYER ONLY — CMS/data/props untouched

import React, { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap-init';

const ScrollProgressBar: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set(bar, { scaleX: 1, transformOrigin: 'left center' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bar,
        { scaleX: 0, opacity: 1, boxShadow: 'none' },
        {
          scaleX: 1,
          ease: 'none',
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            onUpdate: (self) => {
              if (self.progress === 1) {
                // Glow pulse at bottom
                gsap.to(bar, {
                  boxShadow: '0 0 15px 2px var(--universe-accent, #00f3ff)',
                  opacity: 0.5,
                  duration: 0.4,
                  ease: 'power2.out',
                  overwrite: 'auto'
                });
              } else if (self.direction === -1 && self.progress > 0.95) {
                // Reset when scrolling up from bottom
                gsap.to(bar, {
                  boxShadow: 'none',
                  opacity: 1,
                  duration: 0.2,
                  overwrite: 'auto'
                });
              }
            }
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={barRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '2px',
        background: 'linear-gradient(to right, var(--universe-accent, #00f3ff), var(--universe-accent-secondary, #3b82f6))',
        zIndex: 9999,
        pointerEvents: 'none',
        willChange: 'transform'
      }}
    />
  );
};

export default ScrollProgressBar;

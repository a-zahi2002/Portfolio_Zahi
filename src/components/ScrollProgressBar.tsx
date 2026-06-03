// ANIMATION ONLY — does not modify data, props, or CMS logic

import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap-config';

const ScrollProgressBar: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      // Skip to final state immediately
      gsap.set(bar, { scaleX: 1, transformOrigin: 'left center' });
      return;
    }

    const ctx = gsap.context(() => {
      // Drive bar width from 0 → 1 (scaleX) based on page scroll progress
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
            onUpdate: (self) => {
              // Glow pulse when near 100%
              if (self.progress > 0.98) {
                gsap.to(bar, {
                  boxShadow: '0 0 12px 3px #00f3ff, 0 0 24px 6px rgba(0,243,255,0.4)',
                  duration: 0.4,
                  overwrite: 'auto',
                });
              } else {
                gsap.to(bar, {
                  boxShadow: '0 0 6px 1px rgba(0,243,255,0.5)',
                  duration: 0.4,
                  overwrite: 'auto',
                });
              }
            },
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <div
        ref={barRef}
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, #3b82f6, #00f3ff, #9d00ff)',
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
          boxShadow: '0 0 6px 1px rgba(0,243,255,0.5)',
        }}
      />
    </div>
  );
};

export default ScrollProgressBar;

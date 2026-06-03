// ANIMATION ONLY — does not modify data, props, or CMS logic

import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap-config';

interface SectionRevealProps {
  children: React.ReactNode;
  /** Extra delay in seconds before animation fires */
  delay?: number;
  /** Override duration in seconds */
  duration?: number;
  /** If true, skip blur animation (used on mobile) */
  simpleMode?: boolean;
  className?: string;
}

const SectionReveal: React.FC<SectionRevealProps> = ({
  children,
  delay = 0,
  duration = 1,
  simpleMode = false,
  className,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set(el, { opacity: 1, y: 0, filter: 'blur(0px)', clearProps: 'all' });
      return;
    }

    const isMobileView = window.matchMedia('(max-width: 768px)').matches;
    const useSimple = simpleMode || isMobileView;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: 80,
          filter: useSimple ? 'blur(0px)' : 'blur(4px)',
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration,
          delay,
          ease: 'power3.out',
          onComplete: () => {
            gsap.set(el, { willChange: 'auto' });
          },
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ctx.revert();
  }, [delay, duration, simpleMode]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </div>
  );
};

export default SectionReveal;

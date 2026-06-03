// ANIMATION ONLY — does not modify data, props, or CMS logic

import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap-config';

const SectionConnector: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set(path, { drawSVG: '100%' });
      return;
    }

    const ctx = gsap.context(() => {
      // Start fully hidden, animate to fully visible on scroll
      gsap.fromTo(
        path,
        { drawSVG: '0%' },
        {
          drawSVG: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: svg,
            start: 'top 90%',
            end: 'top 40%',
            scrub: 0.5,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        overflow: 'hidden',
        padding: '0',
        lineHeight: 0,
        position: 'relative',
        zIndex: 1,
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1440 2"
        preserveAspectRatio="none"
        style={{ width: '100%', height: 2, display: 'block' }}
      >
        <path
          ref={pathRef}
          d="M0 1 L1440 1"
          stroke="rgba(0,243,255,0.3)"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default SectionConnector;

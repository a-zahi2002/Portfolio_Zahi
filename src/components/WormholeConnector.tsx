// ANIMATION LAYER ONLY — CMS/data/props untouched

import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap-init';

const WormholeConnector: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const shapeRef = useRef<SVGPathElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const topHalfRef = useRef<HTMLDivElement>(null);
  const bottomHalfRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobileCheck = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    setIsMobile(mobileCheck);
  }, []);

  useLayoutEffect(() => {
    if (isMobile) return;

    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Morphing Shape
      const ovalPath = "M 50 10 C 90 10, 90 90, 50 90 C 10 90, 10 10, 50 10 Z";
      const diamondPath = "M 50 10 L 90 50 L 50 90 L 10 50 Z";

      gsap.set(shapeRef.current, { attr: { d: ovalPath } });
      gsap.to(shapeRef.current, {
        morphSVG: diamondPath,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "none"
      });

      // Scroll Interactions
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });

      // Top half fades out, Bottom half fades in
      tl.to(topHalfRef.current, { opacity: 0, duration: 1 }, 0);
      tl.to(bottomHalfRef.current, { opacity: 1, duration: 1 }, 0);

      // SVG Scale peak
      tl.to(svgRef.current, { scale: 1.0, duration: 0.5, ease: "power1.inOut" }, 0);
      tl.to(svgRef.current, { scale: 0.6, duration: 0.5, ease: "power1.inOut" }, 0.5);

      // Line draw down
      tl.fromTo(lineRef.current, 
        { drawSVG: "0%" }, 
        { drawSVG: "100%", duration: 1, ease: "none" }, 
      0);

    }, container);

    return () => ctx.revert();
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div ref={containerRef} className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Dynamic Background Halves */}
      <div 
        ref={topHalfRef}
        className="absolute top-0 left-0 w-full h-full opacity-100"
        style={{ background: 'linear-gradient(to bottom, var(--universe-accent), transparent 50%)', opacity: 0.05 }}
      />
      <div 
        ref={bottomHalfRef}
        className="absolute bottom-0 left-0 w-full h-full opacity-0"
        style={{ background: 'linear-gradient(to top, var(--universe-accent-secondary), transparent 50%)', opacity: 0.05 }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <svg 
          ref={svgRef}
          width="100" 
          height="100" 
          viewBox="0 0 100 100" 
          style={{ transform: 'scale(0.6)' }}
        >
          <defs>
            <linearGradient id="wormhole-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--universe-accent)" />
              <stop offset="100%" stopColor="var(--universe-accent-secondary)" />
            </linearGradient>
          </defs>
          <path 
            ref={shapeRef}
            fill="url(#wormhole-grad)" 
            opacity="0.8"
          />
        </svg>

        <svg className="absolute top-[100px] w-[2px] h-[40vh]">
          <line 
            ref={lineRef}
            x1="1" y1="0" x2="1" y2="100%" 
            stroke="var(--universe-accent-secondary)" 
            strokeWidth="2" 
            strokeOpacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
};

export default WormholeConnector;

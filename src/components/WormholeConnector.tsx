import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from '../lib/gsap-init';

const WormholeConnector: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const galaxyArmsRef = useRef<SVGGElement>(null);
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

    let rotationTween: gsap.core.Tween | null = null;

    const ctx = gsap.context(() => {
      // ✅ PERF: Store reference to the rotation tween so we can pause/resume it
      rotationTween = gsap.to(galaxyArmsRef.current, {
        rotation: 360,
        duration: 35,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50 50',
        paused: true, // Start paused — IntersectionObserver will play when visible
      });

      // Scroll-driven zoom and rotation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });

      tl.to(topHalfRef.current, { opacity: 0, duration: 1 }, 0);
      tl.to(bottomHalfRef.current, { opacity: 'var(--connector-glow-opacity)', duration: 1 }, 0);

      tl.fromTo(svgRef.current,
        { scale: 0.5, rotation: 0, opacity: 0, transformOrigin: 'center center' },
        { scale: 3.5, rotation: 200, opacity: 1, duration: 0.5, ease: 'power1.in', transformOrigin: 'center center' },
        0
      );
      tl.to(svgRef.current,
        { scale: 7.5, rotation: 400, opacity: 0, duration: 0.5, ease: 'power1.out', transformOrigin: 'center center' },
        0.5
      );
    }, container);

    // ✅ PERF: IntersectionObserver — only run the galaxy arm rotation tween
    // when this connector is actually visible. With 5 connectors on the page,
    // 4 are always off-screen and were wasting GPU/CPU time continuously.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            rotationTween?.play();
          } else {
            rotationTween?.pause();
          }
        });
      },
      { rootMargin: '200px 0px 200px 0px' } // 200px buffer — play slightly before visible
    );

    if (container) observer.observe(container);

    return () => {
      ctx.revert();
      observer.disconnect();
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div ref={containerRef} className="relative w-full h-[100vh] flex items-center justify-center overflow-visible bg-transparent">
      {/* Subtle Dynamic Local Glows behind the shape */}
      <div
        ref={topHalfRef}
        className="absolute top-1/2 left-1/2 w-[350px] h-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none blur-[90px]"
        style={{ background: 'radial-gradient(circle, var(--universe-accent) 0%, transparent 70%)', opacity: 'var(--connector-glow-opacity)' }}
      />
      <div
        ref={bottomHalfRef}
        className="absolute top-1/2 left-1/2 w-[350px] h-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none blur-[90px]"
        style={{ background: 'radial-gradient(circle, var(--universe-accent-secondary) 0%, transparent 70%)', opacity: 0 }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <svg
          ref={svgRef}
          width="200"
          height="200"
          viewBox="0 0 100 100"
          className="opacity-0 pointer-events-none"
          style={{ transform: 'scale(0.5)', overflow: 'visible' }}
        >
          <defs>
            <radialGradient id="galaxy-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="var(--universe-accent)" stopOpacity="0.8" />
              <stop offset="60%" stopColor="var(--universe-accent-secondary)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="galaxy-arm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--universe-accent)" />
              <stop offset="50%" stopColor="var(--universe-accent-secondary)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Galaxy Disk / Planetary Rings */}
          <ellipse cx="50" cy="50" rx="38" ry="12" fill="none" stroke="var(--universe-accent)" strokeWidth="0.15" opacity="0.3" transform="rotate(-15 50 50)" />
          <ellipse cx="50" cy="50" rx="44" ry="14" fill="none" stroke="var(--universe-accent-secondary)" strokeWidth="0.15" strokeDasharray="1 3" opacity="0.4" transform="rotate(-15 50 50)" />
          <ellipse cx="50" cy="50" rx="30" ry="9" fill="none" stroke="var(--universe-accent)" strokeWidth="0.2" opacity="0.2" transform="rotate(-15 50 50)" />

          {/* Swirling Galaxy Arms Group */}
          <g ref={galaxyArmsRef} transform-origin="50 50">
            <path
              d="M 50 50 C 52 42, 60 38, 68 42 C 78 46, 82 58, 76 70 C 68 83, 48 85, 34 76 C 18 65, 15 42, 28 24 C 40 8, 68 5, 84 20"
              fill="none"
              stroke="url(#galaxy-arm-grad)"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M 50 50 C 52 42, 60 38, 68 42 C 78 46, 82 58, 76 70 C 68 83, 48 85, 34 76 C 18 65, 15 42, 28 24 C 40 8, 68 5, 84 20"
              fill="none"
              stroke="url(#galaxy-arm-grad)"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.85"
              transform="rotate(180 50 50)"
            />
            <path
              d="M 50 50 C 52 42, 60 38, 68 42 C 78 46, 82 58, 76 70 C 68 83, 48 85, 34 76 C 18 65, 15 42, 28 24 C 40 8, 68 5, 84 20"
              fill="none"
              stroke="url(#galaxy-arm-grad)"
              strokeWidth="0.8"
              strokeLinecap="round"
              opacity="0.6"
              transform="rotate(90 50 50)"
            />
            <path
              d="M 50 50 C 52 42, 60 38, 68 42 C 78 46, 82 58, 76 70 C 68 83, 48 85, 34 76 C 18 65, 15 42, 28 24 C 40 8, 68 5, 84 20"
              fill="none"
              stroke="url(#galaxy-arm-grad)"
              strokeWidth="0.8"
              strokeLinecap="round"
              opacity="0.6"
              transform="rotate(270 50 50)"
            />
          </g>

          {/* Glowing Galaxy Core Center */}
          <circle cx="50" cy="50" r="14" fill="url(#galaxy-core)" />
        </svg>
      </div>
    </div>
  );
};

export default WormholeConnector;

// ANIMATION LAYER ONLY — CMS/data/props untouched

import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from '../lib/gsap-init';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<SVGSVGElement>(null);
  const ring1Ref = useRef<SVGCircleElement>(null);
  const ring2Ref = useRef<SVGCircleElement>(null);
  const ring3Ref = useRef<SVGCircleElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<SVGGElement>(null);
  const loadingTextRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  
  const [isDark, setIsDark] = useState(true);
  const [isDone, setIsDone] = useState(false);
  
  useEffect(() => {
    (window as any).preloaderExited = false;
    const isDarkTheme = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
    setIsDark(isDarkTheme);
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      document.body.style.visibility = 'visible';
      setIsDone(true);
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsDone(true);
          onComplete();
        }
      });

      // Phase 1 — Black void (0ms–400ms)
      tl.to(dotRef.current, { scale: 1, duration: 0.3, ease: 'power2.out' }, 0.1);

      // Phase 2 — Pulse and expand (400ms–900ms)
      tl.to(dotRef.current, { scale: 60, opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.4);
      
      const rings = [ring1Ref.current, ring2Ref.current, ring3Ref.current];
      rings.forEach((ring, i) => {
        tl.to(ring, {
          scale: 60,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          transformOrigin: '50% 50%'
        }, 0.4 + i * 0.08);
      });

      // Phase 3 — Name reveal (900ms–1800ms)
      tl.to(nameRef.current, {
        scrambleText: { text: 'A. Zahi Faleel', chars: 'upperCase' },
        duration: 0.9,
        ease: 'none'
      }, 0.9);

      tl.fromTo(lineRef.current, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9, ease: 'power2.inOut' }, 0.9);
      tl.to(loadingTextRef.current, { opacity: 1, duration: 0.5 }, 0.9);

      // Counter 00 -> 100
      tl.to(counterRef.current, {
        innerText: 100,
        duration: 1.4,
        snap: { innerText: 1 },
        ease: 'none',
        onUpdate: function() {
          if (counterRef.current) {
            let val = Math.round(Number(counterRef.current.innerText));
            counterRef.current.innerText = val < 10 ? `0${val}` : `${val}`;
            if (loadingTextRef.current) {
              if (val < 25) {
                loadingTextRef.current.innerText = "Initializing system...";
              } else if (val < 55) {
                loadingTextRef.current.innerText = "Connecting to portal...";
              } else if (val < 85) {
                loadingTextRef.current.innerText = "Compiling experiences...";
              } else {
                loadingTextRef.current.innerText = "System ready";
              }
            }
          }
        }
      }, 0.4); // Starts before name reveal so it takes 1.4s ending at 1.8s

      // Phase 4 — Portal exit (1800ms–3200ms)
      tl.add(() => {
        // Set body visibility to visible at start of phase 4
        const mainContent = document.querySelector('main') as HTMLElement;
        if (mainContent) mainContent.style.visibility = 'visible';
        
        // Dispatch preloader exit event for hero component
        (window as any).preloaderExited = true;
        window.dispatchEvent(new CustomEvent('preloader:exit'));
      }, 1.8);

      tl.to(loadingTextRef.current, { opacity: 0, duration: 0.3 }, 1.8);
      tl.to(counterRef.current, { opacity: 0, duration: 0.3 }, 1.8);

      // Portal collapse
      tl.to(container, {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 0.8,
        ease: 'portal'
      }, 1.8);

      // Name text scales up and fades out
      tl.to(nameRef.current, {
        scale: 1.4,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in'
      }, 1.8);

    }, container);

    return () => ctx.revert();
  }, [onComplete]);

  if (isDone) return null;

  const fgColor = isDark ? '#ffffff' : '#0a0a0a';
  const bgColor = isDark ? '#000000' : '#ffffff';

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: bgColor,
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        clipPath: 'circle(150% at 50% 50%)',
        willChange: 'transform, clip-path',
        color: fgColor
      }}
      className="preloader-container"
    >
      {/* Central Dot */}
      <div
        ref={dotRef}
        className="preloader-dot"
        style={{
          position: 'absolute',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          backgroundColor: fgColor,
          transform: 'scale(0)',
          top: '50%',
          left: '50%',
          marginTop: '-2px',
          marginLeft: '-2px'
        }}
      />

      {/* SVG Rings */}
      <svg
        ref={ringsRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '200px',
          height: '200px',
          transform: 'translate(-50%, -50%)',
          overflow: 'visible',
          pointerEvents: 'none'
        }}
      >
        <circle ref={ring1Ref} className="preloader-ring" cx="100" cy="100" r="2" fill="none" stroke={fgColor} strokeWidth="0.5" style={{ transformOrigin: '100px 100px' }} />
        <circle ref={ring2Ref} className="preloader-ring" cx="100" cy="100" r="2" fill="none" stroke={fgColor} strokeWidth="0.5" style={{ transformOrigin: '100px 100px' }} />
        <circle ref={ring3Ref} className="preloader-ring" cx="100" cy="100" r="2" fill="none" stroke={fgColor} strokeWidth="0.5" style={{ transformOrigin: '100px 100px' }} />
      </svg>

      {/* Text Container */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <h1
          ref={nameRef}
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            fontWeight: 300,
            letterSpacing: '0.2em',
            margin: '0 0 1rem 0'
          }}
        ></h1>

        <svg style={{ width: '100%', height: '2px', display: 'block', marginBottom: '1rem' }}>
          <g ref={lineRef}>
            <line className="preloader-line" x1="0" y1="1" x2="100%" y2="1" stroke={fgColor} strokeWidth="1" strokeOpacity="0.3" />
          </g>
        </svg>

        <p
          ref={loadingTextRef}
          style={{
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
            opacity: 0,
            textTransform: 'uppercase'
          }}
        >
          Initializing system...
        </p>
      </div>

      {/* Counter */}
      <div
        ref={counterRef}
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          opacity: 0.5
        }}
      >
        00
      </div>
    </div>
  );
};

export default Preloader;

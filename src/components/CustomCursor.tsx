// ANIMATION LAYER ONLY — CMS/data/props untouched

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap-init';

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobileCheck = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    setIsMobile(mobileCheck);
  }, []);

  useLayoutEffect(() => {
    if (isMobile) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const text = textRef.current;
    if (!dot || !ring || !text) return;

    document.body.classList.add('cursor-none-global');
    document.body.style.cursor = 'none';

    // QuickTo for high performance
    const xTo = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3.out" });

    // Inner dot stays exactly on cursor via transform to avoid lag
    const onMouseMove = (e: MouseEvent) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onMouseDown = () => {
      gsap.to(dot, { scale: 0.4, duration: 0.12, yoyo: true, repeat: 1 });
    };

    const onWheel = () => {
      // Drag-scroll effect
      gsap.to(dot, { scaleX: 2, scaleY: 0.4, duration: 0.15 });
      clearTimeout((window as any).wheelTimeout);
      (window as any).wheelTimeout = setTimeout(() => {
        gsap.to(dot, { scaleX: 1, scaleY: 1, duration: 0.2 });
      }, 150);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const isInteractive = target.closest('a') || target.closest('button');
      const isProjectCard = target.closest('[data-project-card]');

      if (isProjectCard) {
        gsap.to(ring, {
          scale: 3,
          backgroundColor: 'rgba(var(--universe-accent-rgb, 0, 243, 255), 0.9)',
          borderColor: 'transparent',
          duration: 0.25
        });
        const isDarkTheme = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
        gsap.to(text, { opacity: 1, color: isDarkTheme ? '#000' : '#fff', duration: 0.25 });
        gsap.to(dot, { opacity: 0, duration: 0.2 });
      } else if (isInteractive) {
        gsap.to(ring, {
          scale: 2.2,
          backgroundColor: 'rgba(var(--universe-accent-rgb, 0, 243, 255), 0.15)',
          duration: 0.25
        });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const related = e.relatedTarget as HTMLElement;
      
      const isInteractive = target.closest('a') || target.closest('button');
      const isProjectCard = target.closest('[data-project-card]');

      if (isProjectCard && (!related || !related.closest('[data-project-card]'))) {
        gsap.to(ring, {
          scale: 1,
          backgroundColor: 'transparent',
          borderColor: 'var(--universe-accent, #00f3ff)',
          duration: 0.25
        });
        gsap.to(text, { opacity: 0, duration: 0.25 });
        gsap.to(dot, { opacity: 1, duration: 0.2 });
      } else if (isInteractive && (!related || (!related.closest('a') && !related.closest('button')))) {
        gsap.to(ring, {
          scale: 1,
          backgroundColor: 'transparent',
          duration: 0.25
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });

    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('wheel', onWheel);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'var(--universe-accent, #00f3ff)',
          pointerEvents: 'none',
          zIndex: 100000,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform'
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: -20,
          left: -20,
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '1.5px solid var(--universe-accent, #00f3ff)',
          pointerEvents: 'none',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform'
        }}
      >
        <span
          ref={textRef}
          style={{
            fontSize: '8px',
            letterSpacing: '0.1em',
            fontWeight: 'bold',
            opacity: 0,
            pointerEvents: 'none',
          }}
        >
          OPEN
        </span>
      </div>
    </>
  );
};

export default CustomCursor;

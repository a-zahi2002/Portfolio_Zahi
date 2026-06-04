// ANIMATION LAYER ONLY — CMS/data/props untouched

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap-init';

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobileCheck = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    setIsMobile(mobileCheck);
  }, []);

  useLayoutEffect(() => {
    if (isMobile) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add('cursor-none-global');
    document.body.style.cursor = 'none';

    // QuickTo for high performance
    const xTo = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    // Inner dot stays exactly on cursor via transform to avoid lag
    const onMouseMove = (e: MouseEvent) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onMouseDown = () => {
      gsap.to(dot, { scale: 0.5, duration: 0.1, yoyo: true, repeat: 1 });
    };

    const onWheel = () => {
      // Drag-scroll effect
      gsap.to(dot, { scaleX: 1.8, scaleY: 0.5, duration: 0.15 });
      clearTimeout((window as any).wheelTimeout);
      (window as any).wheelTimeout = setTimeout(() => {
        gsap.to(dot, { scaleX: 1, scaleY: 1, duration: 0.15 });
      }, 150);
    };

    let currentHoverState: 'none' | 'interactive' = 'none';

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive = target.closest('a') || target.closest('button') || target.closest('[data-project-card]') || target.closest('[role="button"]');

      if (isInteractive) {
        if (currentHoverState !== 'interactive') {
          currentHoverState = 'interactive';
          gsap.to(ring, {
            scale: 1.6,
            backgroundColor: 'rgba(var(--universe-accent-rgb, 0, 243, 255), 0.12)',
            borderColor: 'var(--universe-accent, #00f3ff)',
            duration: 0.2,
            overwrite: 'auto'
          });
          gsap.to(dot, {
            scale: 1.3,
            backgroundColor: 'var(--universe-accent, #00f3ff)',
            duration: 0.2,
            overwrite: 'auto'
          });
        }
      } else {
        if (currentHoverState !== 'none') {
          currentHoverState = 'none';
          gsap.to(ring, {
            scale: 1,
            backgroundColor: 'transparent',
            borderColor: 'var(--universe-accent, #00f3ff)',
            duration: 0.2,
            overwrite: 'auto'
          });
          gsap.to(dot, {
            scale: 1,
            backgroundColor: 'var(--universe-accent, #00f3ff)',
            duration: 0.2,
            overwrite: 'auto'
          });
        }
      }
    };

    const onMouseLeave = () => {
      // Hide cursor elements when leaving window
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    };

    const onMouseEnter = () => {
      // Show cursor elements when entering window
      gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter, { passive: true });

    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('wheel', onWheel);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
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
      />
    </>
  );
};

export default CustomCursor;

// ANIMATION ONLY — does not modify data, props, or CMS logic

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap-config';

const isCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [isMobile, setIsMobile] = useState(isCoarsePointer());

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useLayoutEffect(() => {
    if (isMobile) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    // Hide OS cursor on body
    document.body.classList.add('cursor-none-global');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // Direct transform for the inner dot (0 lag)
    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    gsap.set(ring, { xPercent: -50, yPercent: -50 });

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(dot, { x: mouseX, y: mouseY });
      gsap.to(ring, {
        x: mouseX,
        y: mouseY,
        ease: 'power3.out',
        duration: 0.4,
        overwrite: 'auto',
      });
    };

    const onMouseDown = () => {
      gsap.to(dot, { scale: 0.5, duration: 0.1, overwrite: 'auto' });
    };
    const onMouseUp = () => {
      gsap.to(dot, { scale: 1, duration: 0.2, ease: 'back.out(2)', overwrite: 'auto' });
    };

    // Hover states
    const INTERACTIVE_SEL = 'a, button';
    const CARD_SEL = '[data-project-card]';

    const onEnterInteractive = () => {
      gsap.to(ring, {
        scale: 2.5,
        backgroundColor: 'rgba(0,243,255,0.2)',
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const onLeaveInteractive = () => {
      gsap.to(ring, {
        scale: 1,
        backgroundColor: 'transparent',
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const onEnterCard = () => {
      gsap.to(ring, {
        scale: 3,
        backgroundColor: 'rgba(0,243,255,0.15)',
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(label, { opacity: 1, duration: 0.2, overwrite: 'auto' });
    };

    const onLeaveCard = () => {
      gsap.to(ring, {
        scale: 1,
        backgroundColor: 'transparent',
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(label, { opacity: 0, duration: 0.15, overwrite: 'auto' });
    };

    // Delegate hover events using mouseover/mouseout on document
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest(CARD_SEL)) {
        onEnterCard();
      } else if (target.closest(INTERACTIVE_SEL)) {
        onEnterInteractive();
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = e.target as Element;
      const related = e.relatedTarget as Element | null;
      if (target.closest(CARD_SEL) && !related?.closest(CARD_SEL)) {
        onLeaveCard();
      } else if (
        target.closest(INTERACTIVE_SEL) &&
        !related?.closest(INTERACTIVE_SEL)
      ) {
        onLeaveInteractive();
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      document.body.classList.remove('cursor-none-global');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Inner dot — direct, 0 lag */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#00f3ff',
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'difference',
        }}
      />
      {/* Outer ring — GSAP eased follow */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '1.5px solid rgba(0,243,255,0.7)',
          pointerEvents: 'none',
          zIndex: 99998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 0.2s',
        }}
      >
        <span
          ref={labelRef}
          style={{
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: '#fff',
            textTransform: 'uppercase',
            opacity: 0,
            userSelect: 'none',
          }}
        >
          VIEW
        </span>
      </div>
    </>
  );
};

export default CustomCursor;

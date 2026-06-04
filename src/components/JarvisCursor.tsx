// JARVIS-OS THEME — animation only
// JarvisCursor.tsx — Custom OS-themed cursor.
// Inner: SVG crosshair (+), follows instantly.
// Outer: 32px square, GSAP quickTo ease follow.
// On a/button hover: outer rotates 45° (diamond), scale 1.8x.
// On [data-project-card]: outer scale 2.5x + [ INSPECT ] label.
// Mobile: return null.

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap-config';

const isCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

const JarvisCursor: React.FC = () => {
  const crosshairRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(isCoarsePointer());

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useLayoutEffect(() => {
    if (isMobile) return;

    const crosshair = crosshairRef.current;
    const outer = outerRef.current;
    const label = labelRef.current;
    const dot = dotRef.current;
    if (!crosshair || !outer || !label || !dot) return;

    document.body.classList.add('cursor-none-global');

    gsap.set(crosshair, { xPercent: -50, yPercent: -50, opacity: 0 });
    gsap.set(outer, { xPercent: -50, yPercent: -50, opacity: 0 });

    // Fade in cursors
    gsap.to([crosshair, outer], { opacity: 1, duration: 0.4, delay: 0.1 });

    // QuickTo for outer (eased follow)
    const quickX = gsap.quickTo(outer, 'x', { ease: 'power3.out', duration: 0.35 });
    const quickY = gsap.quickTo(outer, 'y', { ease: 'power3.out', duration: 0.35 });

    const onMove = (e: MouseEvent) => {
      // Crosshair: instant
      gsap.set(crosshair, { x: e.clientX, y: e.clientY });
      // Outer: eased
      quickX(e.clientX);
      quickY(e.clientY);
    };

    // Click flash
    const onDown = () => {
      gsap.to(crosshair, { scale: 0.6, duration: 0.08, overwrite: 'auto' });
      gsap.to(crosshair, { scale: 1, duration: 0.2, ease: 'back.out(2)', delay: 0.08, overwrite: 'auto' });
    };

    // Hover states via delegation
    const CARD_SEL = '[data-project-card]';
    const INTERACTIVE_SEL = 'a, button';

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest(CARD_SEL)) {
        // Project card: scale 2.5x, show INSPECT label
        gsap.to(outer, { scale: 2.5, rotate: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        gsap.to(label, { opacity: 1, duration: 0.2, overwrite: 'auto' });
        gsap.to(dot, { opacity: 1, duration: 0.15, overwrite: 'auto' });
      } else if (target.closest(INTERACTIVE_SEL)) {
        // Interactive: diamond + scale 1.8x
        gsap.to(outer, { scale: 1.8, rotate: 45, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        gsap.to(dot, { opacity: 1, duration: 0.15, overwrite: 'auto' });
        gsap.to(label, { opacity: 0, duration: 0.15, overwrite: 'auto' });
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = e.target as Element;
      const related = e.relatedTarget as Element | null;
      const leftCard = target.closest(CARD_SEL) && !related?.closest(CARD_SEL);
      const leftInteractive =
        target.closest(INTERACTIVE_SEL) && !related?.closest(INTERACTIVE_SEL);
      if (leftCard || leftInteractive) {
        gsap.to(outer, { scale: 1, rotate: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        gsap.to(label, { opacity: 0, duration: 0.15, overwrite: 'auto' });
        gsap.to(dot, { opacity: 0, duration: 0.15, overwrite: 'auto' });
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      document.body.classList.remove('cursor-none-global');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Inner crosshair — instant follow */}
      <div
        ref={crosshairRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 99999,
        }}
        aria-hidden="true"
      >
        <svg width={12} height={12} viewBox="0 0 12 12" style={{ overflow: 'visible' }}>
          {/* Horizontal bar */}
          <line x1={0} y1={6} x2={12} y2={6} stroke="var(--j-cyan)" strokeWidth={1} />
          {/* Vertical bar */}
          <line x1={6} y1={0} x2={6} y2={12} stroke="var(--j-cyan)" strokeWidth={1} />
          {/* Center dot — shown on hover */}
          <circle
            ref={dotRef as unknown as React.RefObject<SVGCircleElement>}
            cx={6}
            cy={6}
            r={1.5}
            fill="var(--j-cyan)"
            style={{ opacity: 0 }}
          />
        </svg>
      </div>

      {/* Outer square — GSAP eased follow */}
      <div
        ref={outerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          border: '1px solid rgba(0,212,255,0.6)',
          pointerEvents: 'none',
          zIndex: 99998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformOrigin: 'center center',
        }}
        aria-hidden="true"
      >
        <span
          ref={labelRef}
          style={{
            fontFamily: 'var(--j-font-mono)',
            fontSize: 7,
            color: 'var(--j-cyan)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            opacity: 0,
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          [ INSPECT ]
        </span>
      </div>
    </>
  );
};

export default JarvisCursor;

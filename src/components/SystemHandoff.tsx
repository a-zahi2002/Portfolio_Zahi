// JARVIS-OS THEME — animation only
// SystemHandoff.tsx — 60px section connector between OsModule sections.
// Replaces SectionConnector. Fast, crisp OS process-switch visual.

import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap-config';
import { ScrollTrigger } from '../lib/gsap-config';

interface SystemHandoffProps {
  from: string;  // e.g. "MODULE_01"
  to: string;    // e.g. "MODULE_02"
}

const SystemHandoff: React.FC<SystemHandoffProps> = ({ from, to }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile) {
      // Hide on mobile per spec
      gsap.set(el, { display: 'none' });
      return;
    }

    const ctx = gsap.context(() => {
      // Fade in as user scrolls to it, fade out as they scroll past
      gsap.fromTo(
        el,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            end: 'top 50%',
            scrub: 1,
          },
        }
      );
      gsap.fromTo(
        el,
        { opacity: 1 },
        {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'bottom 60%',
            end: 'bottom 30%',
            scrub: 1,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      style={{
        width: '100%',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        opacity: 0,
        pointerEvents: 'none',
      }}
    >
      {/* Full-width separator line */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: 1,
          background: 'var(--j-border)',
          transform: 'translateY(-50%)',
        }}
      />

      {/* Left triangle */}
      <span
        style={{
          position: 'absolute',
          left: '5%',
          fontFamily: 'var(--j-font-mono)',
          fontSize: 12,
          color: 'var(--j-cyan)',
          opacity: 0.3,
        }}
      >
        ◤
      </span>

      {/* Center handoff text */}
      <span
        style={{
          fontFamily: 'var(--j-font-mono)',
          fontSize: 9,
          color: 'var(--j-text-dim)',
          letterSpacing: '0.12em',
          background: 'var(--j-bg)',
          padding: '0 12px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        ◈ HANDOFF: {from} → {to} ◈
      </span>

      {/* Right triangle */}
      <span
        style={{
          position: 'absolute',
          right: '5%',
          fontFamily: 'var(--j-font-mono)',
          fontSize: 12,
          color: 'var(--j-cyan)',
          opacity: 0.3,
        }}
      >
        ◥
      </span>
    </div>
  );
};

export default SystemHandoff;

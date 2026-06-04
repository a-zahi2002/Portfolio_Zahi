// JARVIS-OS THEME — animation only
// OsModule.tsx — OS module section wrapper.
// Replaces SectionReveal + SectionConnector.
// Draws a top border via DrawSVGPlugin, types in a module header bar,
// and dispatches module:active events for HudFrame updates.

import React, { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap-config';
import { JarvisAudio } from '../lib/JarvisAudio';

interface OsModuleProps {
  moduleId: string;       // e.g. "MODULE_01"
  protocolName: string;   // e.g. "IDENTITY_SCAN"
  accentColor?: string;   // override --j-cyan
  children: React.ReactNode;
}

const OsModule: React.FC<OsModuleProps> = ({
  moduleId,
  protocolName,
  accentColor,
  children,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgLineRef = useRef<SVGLineElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const hasEntered = useRef(false);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const line = svgLineRef.current;
    const header = headerRef.current;
    if (!wrapper || !line || !header) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // ── Reduced motion: skip to final state ────────────────────
      if (prefersReduced) {
        gsap.set(line, { drawSVG: '100%' });
        gsap.set(header, { opacity: 1 });
        return;
      }

      // ── Top border draw-in ───────────────────────────────────────
      gsap.fromTo(
        line,
        { drawSVG: '0%' },
        {
          drawSVG: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 90%',
            end: 'top 50%',
            scrub: 0.5,
          },
        }
      );

      // ── Module header ScrambleText reveal ───────────────────────
      const headerText = `[ ${moduleId} ] ─── [ ${protocolName} ] ─── [ STATUS: ACTIVE ]`;
      const statusEl = statusRef.current;

      gsap.set(header, { opacity: 0 });

      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          if (hasEntered.current) return;
          hasEntered.current = true;

          // Dispatch module:active event for HudFrame
          document.dispatchEvent(
            new CustomEvent('module:active', {
              detail: { moduleId, protocolName },
              bubbles: true,
            })
          );

          // Play module sound
          JarvisAudio.moduleInitialize();

          // Header fade in + ScrambleText
          gsap.to(header, { opacity: 1, duration: 0.1 });
          gsap.to(header, {
            scrambleText: {
              text: headerText,
              chars: 'upperCase-_.',
              speed: 0.8,
            },
            duration: 0.4,
          });
        },
      });

      // ── On section leave — dim header, change status to LOGGED ──
      ScrollTrigger.create({
        trigger: wrapper,
        start: 'bottom 50%',
        onEnter: () => {
          if (!statusEl) return;
          gsap.to(header, { opacity: 0.4, duration: 0.4 });
          // Update text to show LOGGED
          const loggedText = `[ ${moduleId} ] ─── [ ${protocolName} ] ─── [ STATUS: LOGGED ]`;
          gsap.to(header, {
            scrambleText: {
              text: loggedText,
              chars: 'upperCase',
              speed: 2,
            },
            duration: 0.3,
          });
        },
        onLeaveBack: () => {
          // Re-enter from scrolling back up — restore ACTIVE
          gsap.to(header, { opacity: 1, duration: 0.3 });
          const activeText = `[ ${moduleId} ] ─── [ ${protocolName} ] ─── [ STATUS: ACTIVE ]`;
          gsap.to(header, {
            scrambleText: {
              text: activeText,
              chars: 'upperCase',
              speed: 2,
            },
            duration: 0.3,
          });

          // Re-dispatch module:active when scrolling back up into section
          document.dispatchEvent(
            new CustomEvent('module:active', {
              detail: { moduleId, protocolName },
              bubbles: true,
            })
          );
        },
      });
    }, wrapper);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, protocolName]);

  const accent = accentColor ?? 'var(--j-cyan)';

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      {/* Top border SVG — drawn via DrawSVGPlugin */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 2,
          overflow: 'visible',
          pointerEvents: 'none',
          zIndex: 1,
        }}
        preserveAspectRatio="none"
        viewBox="0 0 1440 1"
      >
        <line
          ref={svgLineRef}
          x1="0"
          y1="0.5"
          x2="1440"
          y2="0.5"
          stroke={accent}
          strokeWidth="1"
          strokeOpacity="0.4"
        />
      </svg>

      {/* Module header bar */}
      <div
        ref={headerRef}
        className="j-module-header"
        style={{
          paddingLeft: 'calc(1.5rem)',
          paddingRight: 'calc(1.5rem)',
          marginBottom: 0,
          paddingTop: 12,
          opacity: 0,
        }}
        aria-hidden="true"
      >
        <span ref={statusRef} className="j-bracket">
          {/* Filled by ScrambleText */}
          &nbsp;
        </span>
      </div>

      {/* Section content */}
      {children}
    </div>
  );
};

// Need ScrollTrigger available globally after gsap-config init

export default OsModule;

// JARVIS-OS THEME — animation only
// JarvisPreloader.tsx — Full 4.2s OS boot sequence.
// Phases: Arc Reactor → System ID → Progress bar → Horizontal split exit.
// Fires JarvisAudio.systemBoot(). Session skip via sessionStorage.

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap-config';
import { JarvisAudio } from '../lib/JarvisAudio';

// Arc Reactor SVG — pure inline SVG, no external files
const ArcReactor: React.FC<{ size?: number; style?: React.CSSProperties; className?: string }> = ({
  size = 120,
  style,
  className,
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const r1 = size * 0.45; // outer ring
  const r2 = size * 0.28; // middle ring
  const r3 = size * 0.14; // inner circle

  // 6 hexagon points for inner ring
  const hexPoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * 60 - 30) * (Math.PI / 180);
    return [cx + r2 * Math.cos(angle), cy + r2 * Math.sin(angle)];
  });
  const hexStr = hexPoints.map(([x, y]) => `${x},${y}`).join(' ');

  // 6 spoke lines from inner to middle ring
  const spokes = hexPoints.map(([x, y]) => ({ x1: cx, y1: cy, x2: x, y2: y }));

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: 'visible', ...style }}
      className={className}
      aria-hidden="true"
    >
      {/* Outer ring */}
      <circle
        className="arc-outer"
        cx={cx}
        cy={cy}
        r={r1}
        fill="none"
        stroke="var(--j-cyan)"
        strokeWidth="1.5"
      />
      {/* Middle ring */}
      <circle
        className="arc-middle"
        cx={cx}
        cy={cy}
        r={r2}
        fill="none"
        stroke="var(--j-cyan)"
        strokeWidth="1.5"
      />
      {/* Inner small circle */}
      <circle
        className="arc-inner"
        cx={cx}
        cy={cy}
        r={r3}
        fill="none"
        stroke="var(--j-cyan)"
        strokeWidth="1"
      />
      {/* Hexagon */}
      <polygon
        className="arc-hex"
        points={hexStr}
        fill="none"
        stroke="var(--j-cyan)"
        strokeWidth="1"
      />
      {/* Spoke lines */}
      {spokes.map((s, i) => (
        <line
          key={i}
          className="arc-spoke"
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke="var(--j-cyan)"
          strokeWidth="0.8"
          opacity="0.7"
        />
      ))}
    </svg>
  );
};

interface JarvisPreloaderProps {
  onComplete: () => void;
}

const SYSTEM_CHECKS = [
  '[ CORE SYSTEMS ............... ONLINE ]',
  '[ MEMORY ALLOCATION ........... 100% ]',
  '[ SECURITY PROTOCOLS ........ ACTIVE ]',
  '[ PORTFOLIO DATABASE ......... READY ]',
];

const SESSION_KEY = 'jarvis-booted';

const JarvisPreloader: React.FC<JarvisPreloaderProps> = ({ onComplete }) => {
  const [mounted, setMounted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const topHalfRef = useRef<HTMLDivElement>(null);
  const bottomHalfRef = useRef<HTMLDivElement>(null);
  const reactorRef = useRef<HTMLDivElement>(null);
  const systemTextRef = useRef<HTMLDivElement>(null);
  const checksRef = useRef<HTMLDivElement>(null);
  const progressBarFillRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const accessTextRef = useRef<HTMLDivElement>(null);
  const isFastBoot = useRef(false);

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const alreadyBooted = sessionStorage.getItem(SESSION_KEY) === '1';
    isFastBoot.current = alreadyBooted;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        // Skip straight to final state
        sessionStorage.setItem(SESSION_KEY, '1');
        onComplete();
        return;
      }

      if (alreadyBooted) {
        // Fast boot: 0.6s version
        fastBoot();
      } else {
        fullBoot();
      }
    }, containerRef);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const splitReveal = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem(SESSION_KEY, '1');
        setMounted(false);
        onComplete();
      },
    });

    // Reactor fades out
    tl.to(reactorRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
    }, 0);

    // Top half slides up
    tl.to(topHalfRef.current, {
      y: '-100%',
      duration: 0.7,
      ease: 'power3.inOut',
    }, 0.1);

    // Bottom half slides down simultaneously
    tl.to(bottomHalfRef.current, {
      y: '100%',
      duration: 0.7,
      ease: 'power3.inOut',
    }, 0.1);
  };

  const fastBoot = () => {
    const tl = gsap.timeline();

    if (accessTextRef.current) {
      tl.fromTo(accessTextRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      tl.to({}, {
        duration: 0.2,
        onComplete: () => {
          if (accessTextRef.current) {
            gsap.to(accessTextRef.current, {
              scrambleText: {
                text: 'PROFILE LOADED — GRANTING ACCESS',
                chars: 'upperCase',
                speed: 1,
              },
              duration: 0.3,
            });
          }
        },
      });
    }

    tl.call(splitReveal, [], 0.5);
  };

  const fullBoot = () => {
    const tl = gsap.timeline();

    // Phase 1 — Arc Reactor (0–600ms)
    const svgEls = reactorRef.current
      ? reactorRef.current.querySelectorAll('.arc-outer, .arc-middle, .arc-inner, .arc-hex, .arc-spoke')
      : [];

    gsap.set(svgEls, { opacity: 0, scale: 0, transformOrigin: 'center center' });
    gsap.set(reactorRef.current, { opacity: 1 });

    tl.to(svgEls, {
      opacity: 1,
      scale: 1,
      duration: 0.15,
      stagger: 0.08,
      ease: 'back.out(2)',
    });

    // Glow pulse on reactor
    tl.to(reactorRef.current!.querySelector('svg'), {
      filter: 'drop-shadow(0 0 20px var(--j-cyan))',
      duration: 0.4,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: 1,
    }, '<');

    // Fire systemBoot audio at phase 1 start
    tl.call(() => JarvisAudio.systemBoot(), [], 0);

    // Phase 2 — System identification (600ms–1400ms)
    if (systemTextRef.current) {
      const titleEl = systemTextRef.current.querySelector('.preloader-title');
      tl.fromTo(systemTextRef.current, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.6);

      if (titleEl) {
        tl.to(titleEl, {
          scrambleText: {
            text: 'INITIALIZING J.A.R.V.I.S PORTFOLIO OS v2.1.0',
            chars: 'upperCase',
            speed: 0.8,
          },
          duration: 0.7,
        }, 0.6);
      }

      // System check lines with stagger
      const checkEls = checksRef.current
        ? Array.from(checksRef.current.querySelectorAll('.check-line'))
        : [];

      checkEls.forEach((el, i) => {
        const target = SYSTEM_CHECKS[i] ?? '';
        tl.fromTo(el, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.15 }, 0.9 + i * 0.18);
        tl.to(el, {
          scrambleText: {
            text: target,
            chars: 'upperCase!@#',
            speed: 2,
          },
          duration: 0.2,
          onStart: () => JarvisAudio.dataStream(),
        }, 0.9 + i * 0.18);
      });
    }

    // Phase 3 — Progress bar (1400ms–3000ms)
    const counterObj = { val: 0 };

    tl.fromTo(
      progressBarFillRef.current,
      { width: '0%' },
      {
        width: '100%',
        duration: 1.5,
        ease: 'power1.inOut',
        onUpdate: function() {
          const pct = Math.round(this.progress() * 100);
          if (counterRef.current) {
            counterRef.current.textContent = String(pct).padStart(3, '0') + '%';
          }
          // At 60%: start spinning reactor
          if (pct >= 60 && reactorRef.current) {
            const svg = reactorRef.current.querySelector('svg');
            if (svg && !svg.classList.contains('spinning')) {
              svg.classList.add('spinning');
              gsap.to(svg, {
                rotation: 360,
                duration: 2,
                ease: 'none',
                repeat: -1,
                transformOrigin: 'center center',
              });
            }
          }
        },
      },
      1.4
    );

    // At 100% counter: fire the ping (already embedded in systemBoot timeline at 2.0s)

    // Phase 4 — Access granted + split (3000ms–4200ms)
    if (accessTextRef.current) {
      tl.fromTo(accessTextRef.current, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 3.0);
      tl.to(accessTextRef.current, {
        scrambleText: {
          text: 'PROFILE LOADED — GRANTING ACCESS',
          chars: 'upperCase',
          speed: 1,
        },
        duration: 0.4,
      }, 3.0);
    }

    tl.call(splitReveal, [], 3.5);

    void counterObj; // suppress unused warning
  };

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'hidden',
        background: 'var(--j-bg)',
      }}
      aria-label="System booting"
      role="status"
    >
      {/* Top half — for split exit */}
      <div
        ref={topHalfRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'var(--j-bg)',
          zIndex: 2,
        }}
      />
      {/* Bottom half — for split exit */}
      <div
        ref={bottomHalfRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'var(--j-bg)',
          zIndex: 2,
        }}
      />

      {/* Grid background visible during preloader */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: [
            'linear-gradient(var(--j-grid) 1px, transparent 1px)',
            'linear-gradient(90deg, var(--j-grid) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '48px 48px',
          animation: 'jarvis-grid-drift 12s linear infinite',
        }}
      />

      {/* Scanlines */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            var(--j-scanline) 2px,
            var(--j-scanline) 4px
          )`,
          pointerEvents: 'none',
        }}
      />

      {/* Main content — centered, above the halves (z-index: 3) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          padding: '0 24px',
        }}
      >
        {/* Arc Reactor */}
        <div ref={reactorRef} style={{ opacity: 0 }}>
          <ArcReactor size={120} />
        </div>

        {/* System Identification text */}
        <div
          ref={systemTextRef}
          style={{
            textAlign: 'center',
            opacity: 0,
            maxWidth: 480,
            width: '100%',
          }}
        >
          <div
            className="preloader-title"
            style={{
              fontFamily: 'var(--j-font-mono)',
              fontSize: 13,
              color: 'var(--j-cyan)',
              letterSpacing: '0.08em',
              marginBottom: 8,
            }}
          >
            &nbsp;
          </div>

          {/* Blinking cursor after title */}
          <div
            style={{
              fontFamily: 'var(--j-font-mono)',
              fontSize: 13,
              color: 'var(--j-cyan)',
              opacity: 0.7,
              marginBottom: 16,
            }}
          >
            <span className="j-typing-cursor">&nbsp;</span>
          </div>

          {/* System check lines */}
          <div ref={checksRef} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {SYSTEM_CHECKS.map((_, i) => (
              <div
                key={i}
                className="check-line"
                style={{
                  fontFamily: 'var(--j-font-mono)',
                  fontSize: 12,
                  color: 'var(--j-text)',
                  opacity: 0,
                  textAlign: 'left',
                }}
              >
                &nbsp;
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div
            style={{
              fontFamily: 'var(--j-font-mono)',
              fontSize: 10,
              color: 'var(--j-text-dim)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            LOADING PROFILE: A. ZAHI FALEEL
          </div>
          <div
            style={{
              width: '100%',
              height: 2,
              background: 'var(--j-border)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              ref={progressBarFillRef}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: '0%',
                background: 'var(--j-cyan)',
                boxShadow: '0 0 8px var(--j-cyan-glow)',
              }}
            />
          </div>
          <div style={{ textAlign: 'right' }}>
            <span
              ref={counterRef}
              style={{
                fontFamily: 'var(--j-font-mono)',
                fontSize: 11,
                color: 'var(--j-cyan)',
              }}
            >
              000%
            </span>
          </div>
        </div>

        {/* Access granted text */}
        <div
          ref={accessTextRef}
          style={{
            fontFamily: 'var(--j-font-mono)',
            fontSize: 11,
            color: 'var(--j-green)',
            letterSpacing: '0.12em',
            opacity: 0,
          }}
        >
          &nbsp;
        </div>
      </div>
    </div>
  );
};

export default JarvisPreloader;

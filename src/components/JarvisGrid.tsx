// JARVIS-OS THEME — animation only
// JarvisGrid.tsx — Three-layer fixed ambient background:
//   Layer 1: CSS grid that slowly drifts (pure CSS)
//   Layer 2: Static CRT scanline overlay (pure CSS)
//   Layer 3: Canvas data rain — hex fragments floating slowly downward

import React, { useEffect, useRef } from 'react';
import { getLenis } from '../lib/lenis-config';

// Data fragments for the rain
const FRAGMENTS = [
  '0x2AF3', 'INIT', 'OK', '7F', 'RDY', '2E', 'SYS', 'FF',
  '0xFF00', 'ACK', 'ERR', 'BF', '3C', 'D4', 'BOOT', 'NULL',
  '0x00A1', 'RUN', '9E', 'FE', 'API', '0xC3', 'SET', 'ACT',
  '0x1B', 'NET', 'OK', 'LNK', '4A', '0xDE', 'CPU', 'MEM',
];

interface Particle {
  x: number;
  y: number;
  speed: number;
  text: string;
  fontSize: number;
  opacity: number;
  baseOpacity: number;
  flashTimer: number;
}

const JarvisGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const scrollVelRef = useRef(0);
  const isMobileRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.matchMedia('(pointer: coarse)').matches ||
                     window.matchMedia('(max-width: 767px)').matches;
    isMobileRef.current = isMobile;

    const COUNT = isMobile ? 25 : 60;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get computed JARVIS color for the canvas fragments
    const getJColor = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--j-cyan')
        .trim() || '#00d4ff';

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = Array.from({ length: COUNT }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight, // scattered initially
        speed: 0.3 + Math.random() * 0.5,
        text: FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)],
        fontSize: 9 + Math.random() * 2,
        opacity: 0,
        baseOpacity: 0.08 + Math.random() * 0.06,
        flashTimer: 0,
      }));
    };
    initParticles();

    // Listen to lenis scroll velocity
    const lenis = getLenis();
    let lenisUnsubscribe: (() => void) | null = null;
    if (lenis) {
      const onScroll = ({ velocity }: { velocity: number }) => {
        scrollVelRef.current = Math.abs(velocity);
      };
      lenis.on('scroll', onScroll);
      lenisUnsubscribe = () => lenis.off('scroll', onScroll);
    } else {
      // Fallback: native scroll velocity approximation
      let lastScrollY = window.scrollY;
      let lastTime = performance.now();
      const onNativeScroll = () => {
        const now = performance.now();
        const dt = now - lastTime;
        if (dt > 0) {
          scrollVelRef.current = Math.abs(window.scrollY - lastScrollY) / dt * 16;
        }
        lastScrollY = window.scrollY;
        lastTime = now;
      };
      window.addEventListener('scroll', onNativeScroll, { passive: true });
      lenisUnsubscribe = () => window.removeEventListener('scroll', onNativeScroll);
    }

    // Flash particles on section changes
    const onModuleActive = () => {
      const ps = particlesRef.current;
      const count = Math.floor(Math.random() * 3) + 3;
      const indices = Array.from({ length: ps.length }, (_, i) => i)
        .sort(() => Math.random() - 0.5)
        .slice(0, count);
      indices.forEach(i => { ps[i].flashTimer = 60; }); // 60 frames of flash
    };
    document.addEventListener('module:active', onModuleActive);

    // Reduced motion check
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const color = getJColor();
      const vel = scrollVelRef.current;
      const speedBoost = 1 + vel * 0.4;

      particlesRef.current.forEach(p => {
        // Move downward
        const effectiveSpeed = prefersReduced ? 0 : p.speed * speedBoost;
        p.y += effectiveSpeed;

        // Wrap at bottom
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
          p.text = FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)];
        }

        // Alpha: fade in at top, fade out at bottom, based on y position
        const topFade = Math.min(1, p.y / (canvas.height * 0.1));
        const bottomFade = Math.max(0, 1 - (p.y - canvas.height * 0.8) / (canvas.height * 0.2));
        const baseAlpha = p.baseOpacity * topFade * bottomFade;

        // Flash
        if (p.flashTimer > 0) {
          p.flashTimer--;
          p.opacity = 0.6;
        } else {
          p.opacity = baseAlpha;
        }

        ctx.save();
        ctx.font = `${p.fontSize}px var(--j-font-mono, monospace)`;
        ctx.fillStyle = color;
        ctx.globalAlpha = p.opacity;
        ctx.fillText(p.text, p.x, p.y);
        ctx.restore();
      });

      // Decay scroll velocity
      scrollVelRef.current *= 0.95;
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('module:active', onModuleActive);
      lenisUnsubscribe?.();
    };
  }, []);

  return (
    <>
      {/* Layer 1 — CSS Grid drift */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -2,
          pointerEvents: 'none',
          backgroundImage: [
            'linear-gradient(var(--j-grid) 1px, transparent 1px)',
            'linear-gradient(90deg, var(--j-grid) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '48px 48px',
          animation: 'jarvis-grid-drift var(--j-grid-speed, 12s) linear infinite',
        }}
      />

      {/* Layer 2 — Scanline overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            var(--j-scanline) 2px,
            var(--j-scanline) 4px
          )`,
        }}
      />

      {/* Layer 3 — Data rain canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          opacity: 1,
        }}
      />
    </>
  );
};

export default JarvisGrid;

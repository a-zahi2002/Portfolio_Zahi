// JARVIS-OS THEME — animation only
// Footer.tsx — additive JARVIS enhancements:
//   - transmissionEnd() fires once on viewport enter
//   - [ END_OF_TRANSMISSION ] label above existing content
//   - Arc Reactor SVG (small, ~60px) spinning slowly at bottom
//   - "↑ REINITIALIZE SEQUENCE" scroll-to-top button with lenis + systemBoot
// CMS hooks, copyright text, original content: UNTOUCHED.

import React, { useLayoutEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';
import { useSiteSettings } from '../hooks/cms/useSiteSettings';
import { useSmoothScroll } from './SmoothScrollProvider';
import { gsap, ScrollTrigger } from '../lib/gsap-config';
import { JarvisAudio } from '../lib/JarvisAudio';

// Small Arc Reactor for footer callback
const MiniArcReactor: React.FC = () => {
  const size = 60;
  const cx = size / 2;
  const cy = size / 2;
  const r1 = size * 0.45;
  const r2 = size * 0.28;
  const r3 = size * 0.13;
  const hexPoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * 60 - 30) * (Math.PI / 180);
    return [cx + r2 * Math.cos(angle), cy + r2 * Math.sin(angle)];
  }).map(([x, y]) => `${x},${y}`).join(' ');

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      style={{
        animation: 'jarvis-spin 60s linear infinite', // 1 RPM
        transformOrigin: 'center center',
        opacity: 0.6,
        filter: 'drop-shadow(0 0 6px var(--j-cyan))',
      }}
    >
      <circle cx={cx} cy={cy} r={r1} fill="none" stroke="var(--j-cyan)" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={r2} fill="none" stroke="var(--j-cyan)" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={r3} fill="none" stroke="var(--j-cyan)" strokeWidth={0.8} />
      <polygon points={hexPoints} fill="none" stroke="var(--j-cyan)" strokeWidth={0.8} />
    </svg>
  );
};

const Footer: React.FC = () => {
  const { data: settings } = useSiteSettings();
  const { lenis } = useSmoothScroll();
  const copyrightText = settings?.copyright_text ?? '© 2025 A. Zahi Faleel. All rights reserved.';
  const footerRef = useRef<HTMLElement>(null);
  const [transmissionFired, setTransmissionFired] = useState(false);

  // ── JARVIS: Fire transmissionEnd on viewport enter ─────────────────────────
  useLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const SESSION_KEY = 'jarvis-transmission-ended';
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: footer,
        start: 'top bottom',
        once: true,
        onEnter: () => {
          if (!prefersReduced && !sessionStorage.getItem(SESSION_KEY)) {
            sessionStorage.setItem(SESSION_KEY, '1');
            JarvisAudio.transmissionEnd();
          }
          setTransmissionFired(true);
        },
      });
    }, footer);

    return () => ctx.revert();
  }, []);

  const handleReinitialize = () => {
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 2.5,
        easing: (t: number) => 1 - Math.pow(1 - t, 5),
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Play boot sound
    JarvisAudio.systemBoot();
  };

  return (
    <footer
      ref={footerRef}
      className="bg-charcoal-950 text-white py-12 border-t border-white/5"
      style={{ borderTop: '1px solid var(--j-border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">

          {/* ── JARVIS: END_OF_TRANSMISSION label ─────────────────────── */}
          <div
            aria-hidden="true"
            style={{
              fontFamily: 'var(--j-font-mono)',
              fontSize: 11,
              color: 'var(--j-text-dim)',
              letterSpacing: '0.12em',
              marginBottom: 16,
              opacity: transmissionFired ? 1 : 0,
              transition: 'opacity 0.6s ease',
            }}
          >
            <div style={{ width: '100%', height: 1, background: 'var(--j-border)', marginBottom: 10 }} />
            [ END_OF_TRANSMISSION ]
          </div>

          {/* Original footer content — UNTOUCHED */}
          <div className="flex items-center justify-center mb-4">
            <span className="text-gray-400">Made with</span>
            <Heart className="w-4 h-4 text-red-500 mx-2 animate-pulse" />
            <span className="text-gray-400">using React &amp; TailwindCSS</span>
          </div>

          <p className="text-gray-400 text-sm">{copyrightText}</p>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              Designed and developed with modern web technologies
            </p>
          </div>

          {/* ── JARVIS: Arc Reactor callback ────────────────────────────── */}
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
            <MiniArcReactor />
          </div>

          {/* ── JARVIS: REINITIALIZE SEQUENCE button ─────────────────────── */}
          <div style={{ marginTop: 16 }}>
            <button
              onClick={handleReinitialize}
              aria-label="Scroll back to top and reinitialize"
              style={{
                fontFamily: 'var(--j-font-mono)',
                fontSize: 10,
                letterSpacing: '0.12em',
                color: 'var(--j-cyan)',
                background: 'none',
                border: '1px solid var(--j-border)',
                padding: '6px 16px',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s, color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.boxShadow = '0 0 12px var(--j-cyan-dim)';
                el.style.color = '#fff';
                el.style.borderColor = 'var(--j-border-hot)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.boxShadow = '';
                el.style.color = 'var(--j-cyan)';
                el.style.borderColor = 'var(--j-border)';
              }}
            >
              ↑ REINITIALIZE SEQUENCE
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
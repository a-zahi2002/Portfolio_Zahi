// ANIMATION LAYER ONLY — CMS/data/props untouched

import React, { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap-init';

export type UniverseTheme = 'void' | 'nebula' | 'constellation' | 'artifact' | 'signal' | 'frequency' | 'abyss';

interface UniverseSectionProps {
  id?: string;
  theme: UniverseTheme;
  children: React.ReactNode;
  className?: string;
}

const themeConfigs: Record<UniverseTheme, { darkBg: string, lightBg: string, darkAccent: string, lightAccent: string, darkAccentSec: string, lightAccentSec: string }> = {
  void: {
    darkBg: '#050505',
    lightBg: '#fafafa', // warm white
    darkAccent: '#ffffff',
    lightAccent: '#0a0a0a', // rich dark charcoal
    darkAccentSec: '#22d3ee', // cyan-400
    lightAccentSec: '#0891b2', // cyan-600
  },
  nebula: {
    darkBg: '#1e1b4b', // purple-900
    lightBg: '#faf5ff', // pale lavender
    darkAccent: '#a78bfa', // violet-400
    lightAccent: '#6d28d9', // violet-700
    darkAccentSec: '#fda4af', // rose-300
    lightAccentSec: '#e11d48', // rose-600
  },
  constellation: {
    darkBg: '#020617', // midnight blue
    lightBg: '#f0f9ff', // pale sky
    darkAccent: '#38bdf8', // sky-400
    lightAccent: '#0284c7', // sky-600
    darkAccentSec: '#fcd34d', // amber-300
    lightAccentSec: '#d97706', // amber-600
  },
  artifact: {
    darkBg: '#0f172a', // dark slate
    lightBg: '#f4f4f5', // zinc
    darkAccent: '#34d399', // emerald-400
    lightAccent: '#059669', // emerald-600
    darkAccentSec: '#5eead4', // teal-300
    lightAccentSec: '#0d9488', // teal-600
  },
  signal: {
    darkBg: '#1a1005', // near-black warm
    lightBg: '#fffbeb', // warm amber
    darkAccent: '#fb923c', // orange-400
    lightAccent: '#ea580c', // orange-600
    darkAccentSec: '#fbbf24', // amber-400
    lightAccentSec: '#d97706', // amber-600
  },
  frequency: {
    darkBg: '#0a0a0a',
    lightBg: '#fcfcfc',
    darkAccent: '#c084fc', // purple-400
    lightAccent: '#7c3aed', // purple-600
    darkAccentSec: '#818cf8', // indigo-400
    lightAccentSec: '#4f46e5', // indigo-600
  },
  abyss: {
    darkBg: '#050505',
    lightBg: '#fafafa',
    darkAccent: '#ffffff',
    lightAccent: '#0a0a0a',
    darkAccentSec: '#3b82f6',
    lightAccentSec: '#2563eb',
  }
};

const animateThemeColors = (targetAccent: string, targetAccentSec: string) => {
  if (typeof window === 'undefined') return;
  const rootStyle = getComputedStyle(document.documentElement);
  const currentAccent = rootStyle.getPropertyValue('--universe-accent').trim() || '#ffffff';
  const currentAccentSec = rootStyle.getPropertyValue('--universe-accent-secondary').trim() || '#22d3ee';

  const colorObj = {
    accent: currentAccent,
    accentSec: currentAccentSec
  };

  // ✅ PERF: Memoize hexToRgb — regex only runs once per unique hex value
  const hexRgbCache = new Map<string, string>();
  const hexToRgb = (hex: string) => {
    if (hexRgbCache.has(hex)) return hexRgbCache.get(hex)!;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const rgb = result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 243, 255';
    hexRgbCache.set(hex, rgb);
    return rgb;
  };

  // ✅ PERF: rAF gate on onUpdate — coalesces multiple GSAP tick callbacks within
  // the same animation frame into a single DOM write (setProperty).
  let rafPending = false;

  gsap.to(colorObj, {
    accent: targetAccent,
    accentSec: targetAccentSec,
    duration: 1.2,
    ease: 'power2.out',
    overwrite: 'auto',
    onUpdate: () => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--universe-accent', colorObj.accent);
          document.documentElement.style.setProperty('--universe-accent-secondary', colorObj.accentSec);
          document.documentElement.style.setProperty('--universe-accent-rgb', hexToRgb(colorObj.accent));
          document.documentElement.style.setProperty('--universe-accent-secondary-rgb', hexToRgb(colorObj.accentSec));
          rafPending = false;
        });
      }
    }
  });
};

// Global theme change listener to keep the active universe properties in sync
if (typeof window !== 'undefined') {
  window.addEventListener('themechanged', () => {
    const activeTheme = document.body.getAttribute('data-active-universe') as UniverseTheme || 'void';
    const isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
    const config = themeConfigs[activeTheme];
    if (config) {
      const bgColor = isDark ? '#050505' : '#fafafa';
      gsap.to(document.body, {
        backgroundColor: bgColor,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });

      const accentColor = isDark ? config.darkAccent : config.lightAccent;
      const accentSecColor = isDark ? config.darkAccentSec : config.lightAccentSec;

      animateThemeColors(accentColor, accentSecColor);
      
      // Notify components like AmbientCanvas of the live update
      window.dispatchEvent(new CustomEvent('universe:change', { detail: { theme: activeTheme, isDark } }));
    }
  });
}

const UniverseSection: React.FC<UniverseSectionProps> = ({ id, theme, children, className = '' }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => dispatchUniverseChange(theme),
        onEnterBack: () => dispatchUniverseChange(theme),
      });
    }, section);

    return () => ctx.revert();
  }, [theme]);

  const dispatchUniverseChange = (newTheme: UniverseTheme) => {
    document.body.setAttribute('data-active-universe', newTheme);
    const isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
    const config = themeConfigs[newTheme];
    const bgColor = isDark ? '#050505' : '#fafafa';

    // Cross-fade body background color
    gsap.to(document.body, {
      backgroundColor: bgColor,
      duration: 0.8,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    const accentColor = isDark ? config.darkAccent : config.lightAccent;
    const accentSecColor = isDark ? config.darkAccentSec : config.lightAccentSec;

    animateThemeColors(accentColor, accentSecColor);

    // Dispatch event for AmbientCanvas or others
    const event = new CustomEvent('universe:change', { detail: { theme: newTheme, isDark } });
    window.dispatchEvent(event);
  };

  return (
    <section 
      id={id} 
      ref={sectionRef} 
      data-universe={theme} 
      className={`relative w-full overflow-hidden ${className}`}
      style={{ minHeight: ['void','nebula','constellation','artifact'].includes(theme) ? '100vh' : 'auto' }}
    >
      {/* Light theme grain for void */}
      {theme === 'void' && (
        <div className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-0 .light-mode:opacity-5 mix-blend-multiply z-0">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
          </svg>
        </div>
      )}

      {/* Nebula Bloom */}
      {theme === 'nebula' && (
        <div className="absolute top-1/2 left-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-screen opacity-30 z-0 animate-nebula-drift"
             style={{ background: 'radial-gradient(circle, var(--universe-accent) 0%, transparent 70%)' }} />
      )}

      {/* Signal Rings */}
      {theme === 'signal' && (
        <div className="absolute top-1/2 left-1/2 w-0 h-0 pointer-events-none z-0 hidden md:block">
          {[0, 1, 2].map((i) => (
            <div key={i} className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--universe-accent)] opacity-60 animate-sonar-ring"
                 style={{ animationDelay: `${i * 0.8}s` }} />
          ))}
        </div>
      )}

      <div className="relative z-10">
        {children}
      </div>

      <style>{`
        @keyframes nebula-drift {
          0% { transform: translate(-50%, -50%) translate(-5%, -5%) scale(1); }
          100% { transform: translate(-50%, -50%) translate(5%, 5%) scale(1.1); }
        }
        .animate-nebula-drift {
          animation: nebula-drift 20s infinite alternate ease-in-out;
        }
        @keyframes sonar-ring {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
        }
        .animate-sonar-ring {
          animation: sonar-ring 2.4s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
        }
      `}</style>
    </section>
  );
};

export default UniverseSection;

// ANIMATION LAYER ONLY — CMS/data/props untouched

import { useLayoutEffect, RefObject } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap-init';

interface ProjectsAnimationRefs {
  sectionRef: RefObject<HTMLElement>;
  containerRef: RefObject<HTMLElement>;
  marqueeRef: RefObject<HTMLElement>;
}

export function useProjectsAnimation(refs: ProjectsAnimationRefs, isLoading: boolean) {
  useLayoutEffect(() => {
    if (isLoading) return;

    const { sectionRef, containerRef, marqueeRef } = refs;
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Create Chapter Label
      const chapterLabel = document.createElement('div');
      chapterLabel.textContent = '[ CHAPTER 04 — THE ARTIFACTS ]';
      chapterLabel.className = 'absolute top-24 md:top-28 left-6 md:left-12 font-mono text-xs font-bold tracking-widest text-charcoal-500 dark:text-gray-400 opacity-0 z-50';
      section.appendChild(chapterLabel);

      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => gsap.to(chapterLabel, { opacity: 1, duration: 0.6 }),
        onLeave: () => gsap.to(chapterLabel, { opacity: 0, duration: 0.6 }),
        onEnterBack: () => gsap.to(chapterLabel, { opacity: 1, duration: 0.6 }),
        onLeaveBack: () => gsap.to(chapterLabel, { opacity: 0, duration: 0.6 }),
      });

      const cards = section.querySelectorAll<HTMLElement>('[data-project-card]');

      if (prefersReduced) {
        cards.forEach((c) => gsap.set(c, { opacity: 1, y: 0, rotateX: 0, scale: 1, clearProps: 'all' }));
        return;
      }

      // ── 1. PROJECT CARD ENTRANCE — ORBITAL DROP ───────────────────────
      if (cards.length > 0) {
        const container = containerRef.current;
        if (container) {
          gsap.set(container, { perspective: 1200 });
        }

        // Reset framer-motion defaults
        gsap.set(cards, { opacity: 0, y: -60, rotateX: -25, scale: 0.9, transformOrigin: 'top center' });

        ScrollTrigger.batch(cards, {
          start: 'top 72%',
          onEnter: (elements) => {
            gsap.to(elements, {
              opacity: 1,
              y: 0,
              rotateX: 0,
              scale: 1,
              ease: 'portal',
              duration: 0.9,
              stagger: 0.18,
              overwrite: 'auto',
              onComplete: () => {
                elements.forEach((el) => {
                  el.style.willChange = 'auto';
                });
              }
            });
          },
          onLeave: (elements) => {
            gsap.to(elements, {
              opacity: 0,
              y: -60,
              rotateX: -25,
              scale: 0.9,
              overwrite: 'auto'
            });
          },
          onEnterBack: (elements) => {
            gsap.to(elements, {
              opacity: 1,
              y: 0,
              rotateX: 0,
              scale: 1,
              ease: 'portal',
              duration: 0.9,
              stagger: 0.18,
              overwrite: 'auto'
            });
          },
          onLeaveBack: (elements) => {
            gsap.to(elements, {
              opacity: 0,
              y: -60,
              rotateX: -25,
              scale: 0.9,
              overwrite: 'auto'
            });
          }
        });

        // ── 2. CARD HOVER — ARTIFACT EXAMINATION ─────────────────────────
        cards.forEach((card) => {
          card.style.willChange = 'transform, box-shadow';

          // Create Grid Overlay
          const gridOverlay = document.createElement('div');
          gridOverlay.className = 'absolute inset-0 pointer-events-none z-10';
          gridOverlay.style.background = 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,243,255,0.2) 1px, rgba(0,243,255,0.2) 2px)';
          gridOverlay.style.backgroundSize = '100% 4px';
          gridOverlay.style.opacity = '0';
          card.appendChild(gridOverlay);

          card.addEventListener('mouseenter', () => {
            // Card Float
            gsap.to(card, {
              y: -10,
              scale: 1.02,
              boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
              duration: 0.3,
              ease: 'power2.out',
              overwrite: 'auto',
            });
            // Grid Overlay appear
            gsap.to(gridOverlay, { opacity: 0.08, duration: 0.3 });

            // Pause Scanning Beam
            const beam = section.parentElement?.querySelector('.absolute.top-0.left-0.w-full.h-\\[2px\\]');
            if (beam) {
              const tweens = gsap.getTweensOf(beam);
              tweens.forEach(t => t.pause());
            }
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              duration: 0.4,
              ease: 'power2.out',
              overwrite: 'auto',
            });
            gsap.to(gridOverlay, { opacity: 0, duration: 0.3 });

            // Resume Scanning Beam
            const beam = section.parentElement?.querySelector('.absolute.top-0.left-0.w-full.h-\\[2px\\]');
            if (beam) {
              const tweens = gsap.getTweensOf(beam);
              tweens.forEach(t => t.resume());
            }
          });
        });
      }

      // ── 3. Tech Stack Marquee ─────────────────────────────────────────
      const marquee = marqueeRef.current;
      if (marquee) {
        const inner = marquee.querySelector<HTMLElement>('.marquee-inner');
        if (inner) {
          const totalWidth = inner.scrollWidth / 2;
          const marqueeTween = gsap.to(inner, {
            x: -totalWidth,
            duration: 20,
            ease: 'none',
            repeat: -1,
          });

          // Pause on hover
          marquee.addEventListener('mouseenter', () => marqueeTween.pause());
          marquee.addEventListener('mouseleave', () => marqueeTween.resume());
        }
      }

      return () => {
        if (chapterLabel.parentNode) chapterLabel.parentNode.removeChild(chapterLabel);
        cards.forEach(c => {
          const grid = c.querySelector('div[style*="repeating-linear-gradient"]');
          if (grid && grid.parentNode) grid.parentNode.removeChild(grid);
        });
      };
    }, section);

    return () => ctx.revert();
  }, [isLoading]);
}

// ANIMATION ONLY — does not modify data, props, or CMS logic

import { useLayoutEffect, RefObject } from 'react';
import { gsap } from '../../lib/gsap-config';

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

    if (prefersReduced) {
      const cards = section.querySelectorAll<HTMLElement>('[data-project-card]');
      cards.forEach((c) => gsap.set(c, { opacity: 1, y: 0, rotateX: 0, clearProps: 'all' }));
      return;
    }

    const ctx = gsap.context(() => {
      // ── 1. Staggered Card Entrance with rotateX ───────────────────────
      const cards = section.querySelectorAll<HTMLElement>('[data-project-card]');
      if (cards.length > 0) {
        const container = containerRef.current;
        if (container) {
          gsap.set(container, { perspective: 1000 });
        }

        gsap.fromTo(
          cards,
          { opacity: 0, y: 60, rotateX: 8 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            ease: 'power3.out',
            duration: 0.9,
            stagger: 0.15,
            onComplete: () => {
              cards.forEach((c) => gsap.set(c, { willChange: 'auto' }));
            },
            scrollTrigger: {
              trigger: container || section,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );

        // ── 2. Card Hover State via GSAP ─────────────────────────────────
        cards.forEach((card) => {
          const accent = card.querySelector<HTMLElement>('.card-accent-border');

          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              y: -8,
              boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
              duration: 0.3,
              ease: 'power2.out',
              overwrite: 'auto',
            });
            if (accent) gsap.to(accent, { opacity: 1, duration: 0.3 });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              y: 0,
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              duration: 0.4,
              ease: 'power2.out',
              overwrite: 'auto',
            });
            if (accent) gsap.to(accent, { opacity: 0, duration: 0.3 });
          });
        });
      }

      // ── 3. Tech Stack Marquee ─────────────────────────────────────────
      const marquee = marqueeRef.current;
      if (marquee) {
        const inner = marquee.querySelector<HTMLElement>('.marquee-inner');
        if (inner) {
          const totalWidth = inner.scrollWidth / 2;
          gsap.to(inner, {
            x: -totalWidth,
            duration: 20,
            ease: 'none',
            repeat: -1,
          });

          // Pause on hover
          marquee.addEventListener('mouseenter', () => gsap.globalTimeline.pause());
          marquee.addEventListener('mouseleave', () => gsap.globalTimeline.resume());
        }
      }
    }, section);

    return () => ctx.revert();
  }, [isLoading, refs]);
}

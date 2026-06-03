// ANIMATION ONLY — does not modify data, props, or CMS logic

import { useLayoutEffect, RefObject } from 'react';
import { gsap } from '../../lib/gsap-config';

interface SkillsAnimationRefs {
  sectionRef: RefObject<HTMLElement>;
  headingRef: RefObject<HTMLElement>;
}

export function useSkillsAnimation(refs: SkillsAnimationRefs, isLoading: boolean) {
  useLayoutEffect(() => {
    if (isLoading) return;

    const { sectionRef, headingRef } = refs;
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      const heading = headingRef.current;
      if (heading) gsap.set(heading, { y: 0, opacity: 1, clearProps: 'all' });
      const cards = section.querySelectorAll<HTMLElement>('[data-skill-item]');
      cards.forEach((c) => gsap.set(c, { y: 0, opacity: 1, clearProps: 'all' }));
      return;
    }

    const ctx = gsap.context(() => {
      // ── 1. Heading Mask Reveal ──────────────────────────────────────────
      const heading = headingRef.current;
      if (heading) {
        const wrapper = heading.parentElement;
        if (wrapper) gsap.set(wrapper, { overflow: 'hidden' });
        gsap.fromTo(
          heading,
          { y: '100%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            duration: 0.8,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // ── 2. Skill Cards Stagger Entrance ──────────────────────────────────
      const cards = section.querySelectorAll<HTMLElement>('[data-skill-item]');
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.7,
            ease: 'power3.out',
            onComplete: () => {
              cards.forEach((c) => gsap.set(c, { willChange: 'auto' }));
            },
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, [isLoading, refs]);
}

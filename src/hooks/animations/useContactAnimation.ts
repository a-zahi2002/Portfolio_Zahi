// ANIMATION ONLY — does not modify data, props, or CMS logic

import { useLayoutEffect, RefObject } from 'react';
import { gsap, SplitText } from '../../lib/gsap-config';

interface ContactAnimationRefs {
  sectionRef: RefObject<HTMLElement>;
  headingRef: RefObject<HTMLElement>;
}

export function useContactAnimation(refs: ContactAnimationRefs, isLoading: boolean) {
  useLayoutEffect(() => {
    if (isLoading) return;

    const { sectionRef, headingRef } = refs;
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      if (headingRef.current) gsap.set(headingRef.current, { opacity: 1, clearProps: 'all' });
      gsap.set(section, { opacity: 1, clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      // ── 1. Section slow fade (1.4s) ─────────────────────────────────────
      gsap.fromTo(
        section,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // ── 2. Character-by-character heading stagger ────────────────────────
      const heading = headingRef.current;
      if (heading) {
        const split = new SplitText(heading, { type: 'chars,words' });

        gsap.fromTo(
          split.chars,
          { opacity: 0, y: 20, rotateX: -30 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            stagger: 0.06,
            duration: 0.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
            onComplete: () => {
              split.revert();
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, [isLoading, refs]);
}

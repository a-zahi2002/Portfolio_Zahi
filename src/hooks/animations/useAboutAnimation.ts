// ANIMATION ONLY — does not modify data, props, or CMS logic

import { useLayoutEffect, RefObject } from 'react';
import { gsap, SplitText } from '../../lib/gsap-config';

interface AboutAnimationRefs {
  sectionRef: RefObject<HTMLElement>;
  headingRef: RefObject<HTMLElement>;
  bioRef: RefObject<HTMLElement>;
  bioSecRef: RefObject<HTMLElement>;
}

export function useAboutAnimation(refs: AboutAnimationRefs, isLoading: boolean) {
  useLayoutEffect(() => {
    if (isLoading) return;

    const { sectionRef, headingRef, bioRef, bioSecRef } = refs;
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      // Jump to final state immediately
      [headingRef, bioRef, bioSecRef].forEach((r) => {
        if (r.current) gsap.set(r.current, { opacity: 1, y: 0, clearProps: 'all' });
      });
      return;
    }

    const ctx = gsap.context(() => {
      // ── 1. Section Heading Mask Reveal ─────────────────────────────────
      const heading = headingRef.current;
      if (heading) {
        const wrapper = heading.parentElement;
        if (wrapper) {
          gsap.set(wrapper, { overflow: 'hidden' });
        }
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

      // ── 2. Word-by-word Bio Reveal ─────────────────────────────────────
      const bioDivs = [bioRef.current, bioSecRef.current].filter(Boolean) as HTMLElement[];
      bioDivs.forEach((bio) => {
        // SplitText on the inner text content
        const split = new SplitText(bio, { type: 'words' });

        gsap.fromTo(
          split.words,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.035,
            duration: 0.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: bio,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
            onComplete: () => {
              // Revert split to avoid accessibility/layout issues after animation
              split.revert();
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, [isLoading, refs]);
}

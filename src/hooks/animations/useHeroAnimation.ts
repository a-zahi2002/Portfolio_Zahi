// ANIMATION ONLY — does not modify data, props, or CMS logic

import { useLayoutEffect, RefObject } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { gsap, ScrambleTextPlugin as _ScrambleText, ScrollTrigger } from '../../lib/gsap-config';

const isMobile = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches ||
    window.matchMedia('(max-width: 768px)').matches);

interface HeroAnimationRefs {
  sectionRef: RefObject<HTMLElement>;
  headingRef: RefObject<HTMLElement>;
  subheadingRef: RefObject<HTMLElement>;
  contentRef: RefObject<HTMLElement>;
  scrollIndicatorRef: RefObject<HTMLElement>;
  overlayRef: RefObject<HTMLElement>;
}

export function useHeroAnimation(
  refs: HeroAnimationRefs,
  isLoading: boolean,
) {
  useLayoutEffect(() => {
    if (isLoading) return;

    const { sectionRef, headingRef, subheadingRef, contentRef, scrollIndicatorRef, overlayRef } = refs;
    const section = sectionRef.current;
    const heading = headingRef.current;
    const subheading = subheadingRef.current;
    const content = contentRef.current;
    const scrollIndicator = scrollIndicatorRef.current;
    const overlay = overlayRef.current;

    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = isMobile();

    const ctx = gsap.context(() => {
      // ── 1. Text Scramble Intro ─────────────────────────────────────────
      if (!mobile && !prefersReduced && heading && subheading) {
        const originalSubText = subheading.textContent ?? '';

        // Small delay so framer-motion entrance (y: 100%→0) completes first
        gsap.delayedCall(0.35, () => {
          if (heading) {
            gsap.to(heading, {
              duration: 1.4,
              scrambleText: {
                text: heading.textContent ?? '',
                chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%',
                revealDelay: 0,
                speed: 0.4,
              },
              ease: 'none',
            });
          }

          if (subheading) {
            gsap.to(subheading, {
              delay: 0.5,
              duration: 1.2,
              scrambleText: {
                text: originalSubText,
                chars: 'abcdefghijklmnopqrstuvwxyz.,',
                revealDelay: 0.1,
                speed: 0.35,
              },
              ease: 'none',
            });
          }
        });
      }

      // ── 2. Hero Pin + Parallax Exit ────────────────────────────────────
      if (!mobile && !prefersReduced && content) {
        const pinTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=120vh',
            pin: true,
            anticipatePin: 1,
            scrub: 1.5,
          },
        });

        pinTl
          .to(content, { y: -120, ease: 'none' }, 0)
          .to(content, { opacity: 0, ease: 'none' }, 0.6);

        if (overlay) {
          pinTl.to(overlay, { opacity: 1, ease: 'none' }, 0.5);
        }
      }

      // ── 3. Scroll Indicator ────────────────────────────────────────────
      if (scrollIndicator && !prefersReduced) {
        // Looping line extend + retract
        const indicatorLine = scrollIndicator.querySelector('.indicator-line');
        if (indicatorLine) {
          gsap.fromTo(
            indicatorLine,
            { scaleY: 0, transformOrigin: 'top center' },
            {
              scaleY: 1,
              duration: 0.8,
              ease: 'power2.inOut',
              yoyo: true,
              repeat: -1,
              repeatDelay: 0.3,
            }
          );
        }

        // Fade out on first scroll
        ScrollTrigger.create({
          trigger: section,
          start: 'top+=60 top',
          onEnter: () => {
            gsap.to(scrollIndicator, { opacity: 0, duration: 0.4 });
          },
          onEnterBack: () => {
            gsap.to(scrollIndicator, { opacity: 1, duration: 0.4 });
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [isLoading, refs]);
}

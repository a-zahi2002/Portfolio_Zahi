// ANIMATION LAYER ONLY — CMS/data/props untouched

import { useLayoutEffect, RefObject } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap-init';

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
    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Create Chapter Label
      const chapterLabel = document.createElement('div');
      chapterLabel.textContent = '[ CHAPTER 06 — THE SINGULARITY ]';
      chapterLabel.className = 'absolute top-24 md:top-28 left-6 md:left-12 font-mono text-xs font-bold tracking-widest text-charcoal-500 dark:text-gray-400 opacity-0 z-50';
      section.appendChild(chapterLabel);

      const contentContainer = section.querySelector('.max-w-4xl');

      if (prefersReduced) {
        if (headingRef.current) gsap.set(headingRef.current, { opacity: 1, clearProps: 'all' });
        if (contentContainer) gsap.set(contentContainer, { opacity: 1, scale: 1, y: 0 });
        gsap.set(section, { opacity: 1, clearProps: 'all' });
        return;
      }

      // Label Fade
      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => gsap.to(chapterLabel, { opacity: 1, duration: 0.6 }),
        onLeave: () => gsap.to(chapterLabel, { opacity: 0, duration: 0.6 }),
        onEnterBack: () => gsap.to(chapterLabel, { opacity: 1, duration: 0.6 }),
        onLeaveBack: () => gsap.to(chapterLabel, { opacity: 0, duration: 0.6 }),
      });

      // ── 1. BLACK HOLE VISUAL ──────────────────────────────────────────
      const blackHole = section.querySelector('.parallax-glow');
      if (blackHole) {
        gsap.to(blackHole, {
          scale: 1.1,
          duration: 4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
      }

      // ── 2. FORM / CONTENT REVEAL ──────────────────────────────────────
      if (contentContainer) {
        // override framer-motion defaults safely
        gsap.set(contentContainer.children, { opacity: 1, y: 0, scale: 1, rotateX: 0 });

        gsap.fromTo(
          contentContainer,
          { opacity: 0, scale: 0.8, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.2,
            ease: 'portal',
            scrollTrigger: {
              trigger: contentContainer,
              start: 'top 80%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      }

      // ── 3. SUBMIT BUTTON MAGNETIC PULL ────────────────────────────────
      const button = section.querySelector('button');
      if (button && !isMobile) {
        // Let's create a magnetic wrapper or just attach event to button
        const magneticWrap = document.createElement('div');
        magneticWrap.style.display = 'inline-block';
        
        button.addEventListener('mousemove', (e) => {
          const rect = button.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          // Limit translation to max 15px
          const tx = (x / (rect.width / 2)) * 15;
          const ty = (y / (rect.height / 2)) * 15;

          gsap.to(button, {
            x: tx,
            y: ty,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        });

        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.3)',
            overwrite: 'auto'
          });
        });
      }

    }, section);

    return () => ctx.revert();
  }, [isLoading]);
}

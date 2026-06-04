// ANIMATION LAYER ONLY — CMS/data/props untouched

import { useLayoutEffect, RefObject } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap-init';

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

    const ctx = gsap.context(() => {
      // Create Chapter Label
      const chapterLabel = document.createElement('div');
      chapterLabel.textContent = '[ CHAPTER 05 — THE FREQUENCIES ]';
      chapterLabel.className = 'absolute top-24 md:top-28 left-6 md:left-12 font-mono text-xs font-bold tracking-widest text-charcoal-500 dark:text-gray-400 opacity-0 z-50';
      section.appendChild(chapterLabel);

      if (prefersReduced) {
        gsap.set(headingRef.current, { y: 0, opacity: 1, clearProps: 'all' });
        const items = section.querySelectorAll('[data-skill-item-inner]');
        gsap.set(items, { y: 0, opacity: 1 });
        const bars = section.querySelectorAll('.progress-bar-inner');
        bars.forEach((bar) => {
          const prof = bar.getAttribute('data-proficiency');
          if (prof) gsap.set(bar, { width: `${prof}%` });
        });
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

      // ── 1. Heading Mask Reveal ──────────────────────────────────────────
      const heading = headingRef.current;
      if (heading) {
        const originalHTML = heading.innerHTML;
        heading.innerHTML = `<div style="overflow: hidden; padding: 10px 0;"><div class="skills-heading-inner" style="will-change: transform">${originalHTML}</div></div>`;
        const inner = heading.querySelector('.skills-heading-inner');

        if (inner) {
          gsap.fromTo(
            inner,
            { y: '110%' },
            {
              y: '0%',
              duration: 0.9,
              ease: 'reveal',
              scrollTrigger: {
                trigger: heading,
                start: 'top 85%',
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        }
      }

      // ── 2. Skill Items Stagger Entrance ──────────────────────────────────
      const items = section.querySelectorAll<HTMLElement>('[data-skill-item-inner]');
      if (items.length > 0) {
        gsap.set(items, { opacity: 0, y: 20 });
        ScrollTrigger.batch(items, {
          start: 'top 85%',
          onEnter: (elements) => {
            gsap.to(elements, {
              opacity: 1,
              y: 0,
              stagger: 0.05,
              duration: 0.7,
              ease: 'power3.out',
              overwrite: 'auto'
            });
          },
          onLeave: (elements) => {
            gsap.to(elements, {
              opacity: 0,
              y: 20,
              overwrite: 'auto'
            });
          },
          onEnterBack: (elements) => {
            gsap.to(elements, {
              opacity: 1,
              y: 0,
              stagger: 0.05,
              duration: 0.7,
              ease: 'power3.out',
              overwrite: 'auto'
            });
          },
          onLeaveBack: (elements) => {
            gsap.to(elements, {
              opacity: 0,
              y: 20,
              overwrite: 'auto'
            });
          }
        });
      }

      // ── 3. Progress Bars Fill ────────────────────────────────────────────
      const bars = section.querySelectorAll<HTMLElement>('.progress-bar-inner');
      bars.forEach((bar) => {
        const profStr = bar.getAttribute('data-proficiency');
        if (!profStr) return;
        const targetProficiency = parseFloat(profStr);
        
        // Reset width to 0 forcefully against framer-motion
        bar.style.width = '0%';
        
        const proxy = { width: 0 };
        gsap.to(proxy, {
          width: targetProficiency,
          duration: 1.2,
          ease: 'power2.out',
          snap: { width: 0.1 },
          onUpdate: () => {
            bar.style.width = `${proxy.width}%`;
          },
          scrollTrigger: {
            trigger: bar,
            start: 'top 90%',
            toggleActions: 'play reverse play reverse'
          }
        });
      });

      return () => {
        if (chapterLabel.parentNode) chapterLabel.parentNode.removeChild(chapterLabel);
        if (heading && heading.querySelector('.skills-heading-inner')) {
          heading.innerHTML = heading.querySelector('.skills-heading-inner')?.innerHTML || heading.innerHTML;
        }
      };
    }, section);

    return () => ctx.revert();
  }, [isLoading]);
}

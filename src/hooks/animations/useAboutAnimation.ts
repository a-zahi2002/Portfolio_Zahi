// ANIMATION LAYER ONLY — CMS/data/props untouched

import { useLayoutEffect, RefObject } from 'react';
import { gsap, ScrollTrigger, SplitText } from '../../lib/gsap-init';

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
    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Create and append floating chapter label
      const chapterLabel = document.createElement('div');
      chapterLabel.textContent = '[ CHAPTER 02 — THE BEING ]';
      chapterLabel.className = 'absolute top-24 md:top-28 left-6 md:left-12 font-mono text-xs font-bold tracking-widest text-charcoal-500 dark:text-gray-400 opacity-0 z-50';
      section.appendChild(chapterLabel);

      if (prefersReduced) {
        const h2 = headingRef.current;
        if (h2) gsap.set(h2, { opacity: 1, y: 0 });
        [bioRef, bioSecRef].forEach(r => {
          if (r.current) gsap.set(r.current, { opacity: 1, filter: 'blur(0)', y: 0 });
        });
        return;
      }

      // Floating label animation
      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => gsap.to(chapterLabel, { opacity: 1, duration: 0.6 }),
        onLeave: () => gsap.to(chapterLabel, { opacity: 0, duration: 0.6 }),
        onEnterBack: () => gsap.to(chapterLabel, { opacity: 1, duration: 0.6 }),
        onLeaveBack: () => gsap.to(chapterLabel, { opacity: 0, duration: 0.6 }),
      });

      // ── 1. Section Heading Mask Reveal ─────────────────────────────────
      const heading = headingRef.current;
      if (heading) {
        // Since we cannot strictly change the JSX without potential issues,
        // we can wrap the inner contents in an overflow-hidden div using DOM manipulation
        const originalHTML = heading.innerHTML;
        heading.innerHTML = `<div style="overflow: hidden; padding: 10px 0;"><div class="about-heading-inner" style="will-change: transform">${originalHTML}</div></div>`;
        const inner = heading.querySelector('.about-heading-inner');

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

      // ── 2. Word-by-word Materialization ────────────────────────────────
      const bioDivs = [bioRef.current, bioSecRef.current].filter(Boolean) as HTMLElement[];
      const paragraphSplits: SplitText[] = [];

      bioDivs.forEach((bio) => {
        // Get paragraphs inside the bio divs
        const paragraphs = bio.querySelectorAll('p');
        
        paragraphs.forEach((p) => {
          const split = new SplitText(p, { type: 'words' });
          paragraphSplits.push(split);

          gsap.fromTo(
            split.words,
            { opacity: 0, filter: isMobile ? 'none' : 'blur(3px)', y: 8 },
            {
              opacity: 1,
              filter: 'blur(0px)',
              y: 0,
              stagger: 0.03,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: p,
                start: 'top 85%',
                toggleActions: 'play reverse play reverse',
              }
            }
          );
        });
      });

      return () => {
        if (chapterLabel.parentNode) chapterLabel.parentNode.removeChild(chapterLabel);
        if (heading && heading.querySelector('.about-heading-inner')) {
          heading.innerHTML = heading.querySelector('.about-heading-inner')?.innerHTML || heading.innerHTML;
        }
        paragraphSplits.forEach((split) => split.revert());
      };
    }, section);

    return () => ctx.revert();
  }, [isLoading]);
}

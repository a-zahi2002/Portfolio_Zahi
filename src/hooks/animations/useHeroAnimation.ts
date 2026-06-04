// ANIMATION LAYER ONLY — CMS/data/props untouched

import { useLayoutEffect, RefObject } from 'react';
import { gsap, ScrollTrigger, SplitText } from '../../lib/gsap-init';

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

    const { sectionRef, headingRef, subheadingRef, contentRef, scrollIndicatorRef } = refs;
    const section = sectionRef.current;
    const heading = headingRef.current;
    const subheading = subheadingRef.current;
    const content = contentRef.current;
    const scrollIndicator = scrollIndicatorRef.current;

    if (!section || !heading || !subheading || !content) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set([heading, subheading, content.querySelector('[data-hero-buttons]')], { opacity: 1, y: 0, rotateX: 0 });
        return;
      }

      // Add Chapter Label
      const chapterLabel = document.createElement('div');
      chapterLabel.textContent = '[ CHAPTER 01 — ARRIVAL ]';
      chapterLabel.className = 'absolute top-24 md:top-28 left-6 md:left-12 font-mono text-xs font-bold tracking-widest text-charcoal-500 dark:text-gray-400 opacity-0 z-50';
      section.appendChild(chapterLabel);

      const buttonsContainer = content.querySelector('[data-hero-buttons]'); // Selects the buttons wrapper
      const backgroundGrid = section.querySelector('.bg-\\[linear-gradient\\(rgba\\(0\\,0\\,0\\,0\\.02\\)_1px\\,transparent_1px\\)\\]') || section.querySelector('.absolute.inset-0.bg-\\[linear-gradient');

      // 1. HEADLINE ARRIVAL
      gsap.set(heading, { opacity: 1, y: 0, rotateZ: 0 });
      
      const nameBase = heading.querySelector('.hero-name-base');
      const nameHighlight = heading.querySelector('.hero-name-highlight');
      
      let targets: any[] = [];
      let splitBase: SplitText | null = null;
      
      if (nameBase) {
        splitBase = new SplitText(nameBase, { type: 'chars' });
        gsap.set(splitBase.chars, {
          opacity: 0,
          y: 40,
          rotateX: 90,
        });
        targets = [...splitBase.chars];
      }
      
      if (nameHighlight) {
        gsap.set(nameHighlight, {
          opacity: 0,
          y: 40,
          rotateX: 90,
          display: 'inline-block',
        });
        targets.push(nameHighlight);
      }
      
      // Fallback in case spans are not found
      if (!nameBase && !nameHighlight) {
        splitBase = new SplitText(heading, { type: 'chars' });
        gsap.set(splitBase.chars, {
          opacity: 0,
          y: 40,
          rotateX: 90,
        });
        targets = splitBase.chars;
      }

      gsap.set(content, { perspective: 800 });

      // Paused entrance timeline to be triggered by preloader exit event
      const enterTl = gsap.timeline({ paused: true });

      // 1. Heading chars stagger in
      enterTl.to(targets, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.9,
        stagger: 0.04,
        ease: 'reveal',
      }, 0);

      // 2. SUBTITLE SCRAMBLE (animating opacity/y in same tween for smooth fade-in reveal)
      const originalSubText = subheading.textContent || '';
      gsap.set(subheading, { opacity: 0, y: 15 });
      
      enterTl.to(subheading, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        scrambleText: {
          text: originalSubText,
          chars: 'lowerCase',
          revealDelay: 0.2,
          speed: 0.4,
        },
        ease: 'power1.out',
      }, 0.4);

      // 3. CTA / BUTTONS
      if (buttonsContainer) {
        gsap.set(buttonsContainer, { opacity: 0, y: 20 });
        enterTl.to(buttonsContainer, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out'
        }, 1.0);
      }

      // Floating label entrance
      enterTl.to(chapterLabel, { opacity: 1, duration: 1 }, 1.4);

      // ── Event Listener for preloader exit handoff ──
      const handlePreloaderExit = () => {
        gsap.delayedCall(0.1, () => {
          enterTl.play();
        });
      };

      if ((window as any).preloaderExited) {
        handlePreloaderExit();
      } else {
        window.addEventListener('preloader:exit', handlePreloaderExit);
      }

      // 4. HERO PIN + PARALLAX EXIT
      if (!isMobile) {
        const pinTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=100vh',
            pin: true,
            scrub: 1.5,
          },
        });

        pinTl.to(heading, {
          y: -80,
          opacity: 0,
          ease: 'none',
        }, 0);

        if (backgroundGrid) {
          pinTl.to(backgroundGrid, {
            scale: 1.08,
            ease: 'none',
            transformOrigin: 'center center'
          }, 0);
        }

        // Subtitle and buttons fade out too
        pinTl.to([subheading, buttonsContainer, chapterLabel], {
          opacity: 0,
          y: -40,
          ease: 'none'
        }, 0.2);
      }

      // Scroll Indicator 
      if (scrollIndicator) {
        gsap.fromTo(
          scrollIndicator.querySelector('.indicator-line'),
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

        ScrollTrigger.create({
          trigger: section,
          start: 'top+=60 top',
          onEnter: () => gsap.to(scrollIndicator, { opacity: 0, duration: 0.4 }),
          onEnterBack: () => gsap.to(scrollIndicator, { opacity: 1, duration: 0.4 }),
        });
      }
      
      return () => {
        window.removeEventListener('preloader:exit', handlePreloaderExit);
        if (splitBase) {
          splitBase.revert();
        }
        if (chapterLabel.parentNode) {
          chapterLabel.parentNode.removeChild(chapterLabel);
        }
      };
    }, section);

    return () => ctx.revert();
  }, [isLoading]);
}

// ANIMATION LAYER ONLY — CMS/data/props untouched

import { useLayoutEffect, RefObject } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap-init';

interface ProjectsAnimationRefs {
  sectionRef: RefObject<HTMLElement>;
  containerRef: RefObject<HTMLElement>;
  marqueeRef: RefObject<HTMLElement>;
}

export function useProjectsAnimation(
  refs: ProjectsAnimationRefs, 
  isLoading: boolean, 
  isDesktop: boolean
) {
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
        cards.forEach((c) => {
          gsap.set(c, { opacity: 1, x: 0, y: 0, scale: 1, clearProps: 'all' });
        });
        return;
      }

      if (isDesktop && cards.length > 0) {
        // ─── DESKTOP SOLAR SYSTEM ANIMATION ────────────────────────────
        const orbits = section.querySelectorAll('.stellar-orbits ellipse');
        const sun = section.querySelector('.stellar-sun-core');

        // Set initial positions
        gsap.set(cards, { x: 0, y: 0, scale: 0, opacity: 0 });
        if (orbits.length) gsap.set(orbits, { scale: 0, opacity: 0, transformOrigin: 'center center' });
        if (sun) gsap.set(sun, { scale: 0, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current || section,
            start: 'top 75%',
          }
        });

        // Orbits and Sun expand
        if (sun) {
          tl.to(sun, {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: 'back.out(1.4)'
          }, 0);
        }

        if (orbits.length) {
          tl.to(orbits, {
            scale: 1,
            opacity: (i) => i === 0 ? 0.35 : (i === 1 ? 0.45 : 0.35),
            duration: 1,
            stagger: 0.15,
            ease: 'power2.out'
          }, 0.2);
        }

        // Explode cards outward (Big Bang)
        tl.to(cards, {
          x: (_, target) => parseFloat(target.getAttribute('data-x') || '0'),
          y: (_, target) => parseFloat(target.getAttribute('data-y') || '0'),
          scale: 1,
          opacity: 1,
          duration: 1.5,
          stagger: 0.08,
          ease: 'back.out(1.15)',
          onComplete: () => {
            // Setup card continuous circular orbit rotation!
            ctx.add(() => {
              cards.forEach((card, i) => {
                // Kill any pre-existing tween to avoid leaks
                if ((card as any)._orbitTween) {
                  (card as any)._orbitTween.kill();
                }

                const initialAngle = parseFloat(card.getAttribute('data-angle') || '0');
                const orbit = parseInt(card.getAttribute('data-orbit') || '1');
                
                const state = { angle: initialAngle };
                // Inner orbits rotate faster, outer orbits rotate slower
                const duration = 65 + orbit * 35 + (i * 6);

                const orbitTween = gsap.to(state, {
                  angle: initialAngle + 360,
                  duration: duration,
                  repeat: -1,
                  ease: 'none',
                  onUpdate: () => {
                    const rad = (state.angle * Math.PI) / 180;
                    
                    // Radii for orbits (keep in sync with Projects.tsx)
                    let rx = 180;
                    let ry = 100;
                    if (orbit === 2) {
                      rx = 330;
                      ry = 175;
                    } else if (orbit === 3) {
                      rx = 480;
                      ry = 250;
                    }
                    
                    const x = Math.cos(rad) * rx;
                    const y = Math.sin(rad) * ry;
                    
                    gsap.set(card, {
                      x,
                      y,
                      attr: { 'data-x': x, 'data-y': y }
                    });
                  }
                });
                (card as any)._orbitTween = orbitTween;
              });
            });
          }
        }, 0.3);

        // Hover animations
        cards.forEach((card) => {
          card.addEventListener('mouseenter', () => {
            if ((card as any)._orbitTween) {
              (card as any)._orbitTween.pause();
            }

            // Animate scale & bring to front
            gsap.to(card, {
              scale: 1.08,
              zIndex: 50,
              duration: 0.35,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          });

          card.addEventListener('mouseleave', () => {
            // Animate scale back
            gsap.to(card, {
              scale: 1,
              zIndex: 20,
              duration: 0.35,
              ease: 'power2.out',
              overwrite: 'auto',
              onComplete: () => {
                // Resume orbit
                if ((card as any)._orbitTween) {
                  (card as any)._orbitTween.play();
                }
              }
            });
          });
        });

      } else if (cards.length > 0) {
        // ─── MOBILE BENTO GRID ANIMATION (ORBITAL DROP) ────────────────
        const container = containerRef.current;
        if (container) {
          gsap.set(container, { perspective: 1200 });
        }

        gsap.set(cards, { opacity: 0, y: -60, rotateX: -25, scale: 0.9, transformOrigin: 'top center' });

        ScrollTrigger.batch(cards, {
          start: 'top 75%',
          onEnter: (elements) => {
            gsap.to(elements, {
              opacity: 1,
              y: 0,
              rotateX: 0,
              scale: 1,
              ease: 'portal',
              duration: 0.8,
              stagger: 0.15,
              overwrite: 'auto'
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
              duration: 0.8,
              stagger: 0.15,
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
      }

      // ── Tech Stack Marquee ─────────────────────────────────────────
      const marquee = marqueeRef.current;
      if (marquee) {
        const inner = marquee.querySelector<HTMLElement>('.marquee-inner');
        if (inner) {
          const totalWidth = inner.scrollWidth / 2;
          const marqueeTween = gsap.to(inner, {
            x: -totalWidth,
            duration: 25,
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
        cards.forEach((card) => {
          if ((card as any)._orbitTween) {
            (card as any)._orbitTween.kill();
          }
          if ((card as any)._floatTween) {
            (card as any)._floatTween.kill();
          }
        });
      };
    }, section);

    return () => ctx.revert();
  }, [isLoading, isDesktop]);
}

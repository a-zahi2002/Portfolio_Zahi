// ANIMATION LAYER ONLY — CMS/data/props untouched

import { useLayoutEffect, RefObject } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap-init';

export function useJourneyAnimation(
  containerRef: RefObject<HTMLElement>,
  isLoading: boolean,
  activeTab: string
) {
  useLayoutEffect(() => {
    if (isLoading) return;

    const container = containerRef.current;
    if (!container) return;

    const section = container.closest('section') || container;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Create Chapter Label
      const chapterLabel = document.createElement('div');
      chapterLabel.textContent = '[ CHAPTER 03 — THE CONSTELLATION ]';
      chapterLabel.className = 'absolute top-10 left-10 font-mono text-xs font-bold tracking-widest text-charcoal-500 dark:text-gray-400 opacity-0 z-50';
      section.appendChild(chapterLabel);

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

      const cards = container.querySelectorAll('.journey-card-wrapper');
      
      if (prefersReduced) {
        gsap.set(cards, { opacity: 1, scale: 1, clipPath: 'none' });
        const line = container.querySelector('.timeline-svg-line line');
        if (line) gsap.set(line, { drawSVG: '100%' });
        return;
      }

      // ── 1. CONSTELLATION SVG LAYER ─────────────────────────────────────
      if (!isMobile) {
        const svgNS = "http://www.w3.org/2000/svg";
        const constellationSvg = document.createElementNS(svgNS, "svg");
        const svgId = "constellation-bg-" + Date.now();
        constellationSvg.setAttribute("id", svgId);
        constellationSvg.setAttribute("class", "absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40");
        
        const width = section.offsetWidth || window.innerWidth;
        const height = section.offsetHeight || window.innerHeight;
        constellationSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);

        const numDots = 14;
        const dots: { el: SVGElement; x: number; y: number }[] = [];
        const lines: SVGElement[] = [];

        // Generate dots
        for (let i = 0; i < numDots; i++) {
          const cx = Math.random() * width;
          const cy = Math.random() * height;
          const r = Math.random() * 3 + 3; // 3 to 6px
          
          const dot = document.createElementNS(svgNS, "circle");
          dot.setAttribute("cx", cx.toString());
          dot.setAttribute("cy", cy.toString());
          dot.setAttribute("r", r.toString());
          dot.setAttribute("fill", "var(--universe-accent, #38bdf8)");
          dots.push({ el: dot, x: cx, y: cy });
        }

        // Connect dots (each dot connects to 1-2 nearest neighbors)
        dots.forEach((dot, i) => {
          let nearest = dots
            .map((other, j) => {
              if (i === j) return { dist: Infinity, index: j };
              const dx = dot.x - other.x;
              const dy = dot.y - other.y;
              return { dist: Math.sqrt(dx * dx + dy * dy), index: j };
            })
            .sort((a, b) => a.dist - b.dist);

          // Connect to top 2 nearest
          for (let k = 0; k < 2; k++) {
            const target = dots[nearest[k].index];
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", dot.x.toString());
            line.setAttribute("y1", dot.y.toString());
            line.setAttribute("x2", target.x.toString());
            line.setAttribute("y2", target.y.toString());
            line.setAttribute("stroke", "var(--universe-accent-secondary, #fcd34d)");
            line.setAttribute("stroke-width", "0.5");
            line.setAttribute("opacity", "0.4");
            lines.push(line);
            constellationSvg.appendChild(line);
          }
          constellationSvg.appendChild(dot.el);
        });

        // Insert behind everything
        section.insertBefore(constellationSvg, section.firstChild);

        // Animate Constellation
        gsap.set(lines, { drawSVG: "0%" });
        gsap.set(dots.map(d => d.el), { scale: 0, transformOrigin: 'center center' });

        const constTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          }
        });

        constTl.to(lines, {
          drawSVG: "100%",
          stagger: 0.15,
          duration: 2,
          ease: "none"
        }, 0);

        constTl.to(dots.map(d => d.el), {
          scale: 1,
          stagger: 0.1,
          duration: 1,
          ease: "back.out(1.7)"
        }, 0.2);

        // Constellation Rotation
        gsap.fromTo(constellationSvg, 
          { rotation: -2 }, 
          { 
            rotation: 2, 
            transformOrigin: "center center",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 3
            }
          }
        );
      }

      // ── 2. TIMELINE CARDS — STAR ENTRANCE ──────────────────────────────
      if (cards.length > 0) {
        // Reset framer-motion states forcefully
        gsap.set(cards, { opacity: 0, scale: 0.85, clipPath: 'circle(30% at 50% 50%)' });

        ScrollTrigger.batch(cards, {
          start: 'top 70%',
          onEnter: (elements) => {
            gsap.to(elements, {
              opacity: 1,
              scale: 1,
              clipPath: 'circle(150% at 50% 50%)',
              duration: 0.7,
              stagger: 0.2,
              ease: 'portal',
              overwrite: 'auto'
            });
          },
          onLeave: (elements) => {
            gsap.to(elements, {
              opacity: 0,
              scale: 0.85,
              clipPath: 'circle(30% at 50% 50%)',
              overwrite: 'auto'
            });
          },
          onEnterBack: (elements) => {
            gsap.to(elements, {
              opacity: 1,
              scale: 1,
              clipPath: 'circle(150% at 50% 50%)',
              duration: 0.7,
              stagger: 0.2,
              ease: 'portal',
              overwrite: 'auto'
            });
          },
          onLeaveBack: (elements) => {
            gsap.to(elements, {
              opacity: 0,
              scale: 0.85,
              clipPath: 'circle(30% at 50% 50%)',
              overwrite: 'auto'
            });
          }
        });
      }

      // ── 3. TIMELINE CONNECTOR LINE ─────────────────────────────────────
      const centerLine = container.querySelector('.timeline-svg-line line');
      if (centerLine) {
        gsap.fromTo(centerLine, 
          { drawSVG: '0%' },
          {
            drawSVG: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: '.journey-timeline-container',
              start: 'top 60%',
              end: 'bottom 60%',
              scrub: 0.6
            }
          }
        );
      }

      // ── 4. SECTION PIN ─────────────────────────────────────────────────
      if (!isMobile && cards.length >= 4) {
        const headingArea = section.querySelector('.text-center.mb-16');
        if (headingArea) {
          ScrollTrigger.create({
            trigger: headingArea,
            start: 'top 10%',
            endTrigger: section,
            end: 'bottom 80%',
            pin: true,
            pinSpacing: false,
          });
        }
      }

      return () => {
        if (chapterLabel.parentNode) chapterLabel.parentNode.removeChild(chapterLabel);
        const svg = document.getElementById("constellation-bg-" + Date.now().toString());
        if (svg && svg.parentNode) svg.parentNode.removeChild(svg);
        // Ensure any dynamic SVGs are cleaned up
        const dynamicSvgs = section.querySelectorAll('svg[id^="constellation-bg-"]');
        dynamicSvgs.forEach(s => s.parentNode?.removeChild(s));
      };
    }, section);

    return () => ctx.revert();
  }, [isLoading, activeTab]);
}

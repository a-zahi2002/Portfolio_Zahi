import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export const initScrollAnimations = () => {
  // Initialize Lenis
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo easing
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Default Fade in
  gsap.utils.toArray('.fade-in').forEach((element: any) => {
    gsap.fromTo(element, 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Parallax utility
  gsap.utils.toArray('.parallax').forEach((element: any) => {
    const speed = element.dataset.speed || 0.5;
    gsap.to(element, {
      y: () => `${-100 * speed}px`,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });
};

export const animateTextReveal = (selector: string | HTMLElement) => {
  return gsap.fromTo(selector,
    { opacity: 0, y: 40, rotationX: -20 },
    { opacity: 1, y: 0, rotationX: 0, duration: 1.2, stagger: 0.1, ease: "power4.out" }
  );
};

// Cleanup utility
export const destroyScrollAnimations = () => {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
};
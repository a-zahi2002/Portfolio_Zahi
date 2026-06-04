// ANIMATION ONLY — does not modify data, props, or CMS logic

import Lenis from 'lenis';
import { gsap } from './gsap-config';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

const isMobile = (): boolean =>
  window.matchMedia('(pointer: coarse)').matches ||
  window.matchMedia('(max-width: 768px)').matches;

export function initLenis(): Lenis | null {
  if (isMobile()) return null;
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    lerp: 0.12,          // slightly snappier — still silky smooth
    smoothWheel: true,
    syncTouch: false,    // touch devices use native scroll
    duration: 1.2,       // governs how long a single scroll impulse lasts
  });

  // Wire Lenis into GSAP ticker
  gsap.ticker.add((time) => {
    lenisInstance?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // ScrollTrigger proxy so it reads Lenis scroll position
  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length && lenisInstance) {
        lenisInstance.scrollTo(value as number, { immediate: true });
      }
      return lenisInstance?.scroll ?? window.scrollY;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  lenisInstance.on('scroll', () => ScrollTrigger.update());

  return lenisInstance;
}

export function destroyLenis(): void {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

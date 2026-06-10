// Cyber Terminal — Scroll Animation Utilities
import { gsap, ScrollTrigger } from '../lib/gsap-config';

/**
 * Initialize global scroll-triggered animations.
 * Called once from Portfolio component after mount.
 */
export function initScrollAnimations(): void {
  // Batch animate all elements with data-animate attribute
  const animateEls = document.querySelectorAll('[data-animate]');

  animateEls.forEach((el) => {
    const direction = el.getAttribute('data-animate') || 'up';
    const delay = parseFloat(el.getAttribute('data-animate-delay') || '0');

    const from: gsap.TweenVars = { opacity: 0 };
    if (direction === 'up') from.y = 40;
    else if (direction === 'down') from.y = -40;
    else if (direction === 'left') from.x = 40;
    else if (direction === 'right') from.x = -40;
    else if (direction === 'scale') { from.scale = 0.95; from.y = 20; }

    gsap.fromTo(el, from, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration: 0.8,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    });
  });
}

/**
 * Create a stagger-in animation for a group of children.
 */
export function staggerIn(
  container: Element,
  childSelector: string,
  options?: { stagger?: number; delay?: number }
): void {
  const children = container.querySelectorAll(childSelector);
  if (!children.length) return;

  gsap.fromTo(children,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: options?.stagger ?? 0.1,
      delay: options?.delay ?? 0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        once: true,
      },
    }
  );
}
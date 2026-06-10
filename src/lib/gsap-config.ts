// Cyber Terminal — GSAP Configuration
// Lean setup: only ScrollTrigger + ScrollToPlugin (no premium plugins)

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register plugins eagerly at module level
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

gsap.defaults({ duration: 0.8, ease: 'power3.out' });

let initialized = false;

export function initGSAP(): void {
  if (initialized) return;
  initialized = true;
}

export { gsap, ScrollTrigger, ScrollToPlugin };

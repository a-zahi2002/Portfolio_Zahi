// ANIMATION ONLY — does not modify data, props, or CMS logic

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

let initialized = false;

export function initGSAP(): void {
  if (initialized) return;
  initialized = true;

  gsap.registerPlugin(
    ScrollTrigger,
    ScrollToPlugin,
    SplitText,
    ScrambleTextPlugin,
    DrawSVGPlugin,
  );

  gsap.defaults({ duration: 0.9, ease: 'power3.out' });
}

export { gsap, ScrollTrigger, ScrollToPlugin, SplitText, ScrambleTextPlugin, DrawSVGPlugin };

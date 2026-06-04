// ANIMATION LAYER ONLY — CMS/data/props untouched

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { CustomEase } from 'gsap/CustomEase';

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
    MorphSVGPlugin,
    CustomEase
  );

  CustomEase.create("portal", "M0,0 C0.16,1.52 0.3,1 1,1");
  CustomEase.create("drift",  "M0,0 C0.25,0.46 0.45,0.94 1,1");
  CustomEase.create("reveal", "M0,0 C0.77,0 0.175,1 1,1");

  gsap.defaults({ duration: 0.9, ease: 'power3.out' });
}

// Initialize GSAP immediately on module import to ensure all plugins and custom eases are registered
initGSAP();

export { gsap, ScrollTrigger, ScrollToPlugin, SplitText, ScrambleTextPlugin, DrawSVGPlugin, MorphSVGPlugin, CustomEase };

// ANIMATION ONLY — does not modify data, props, or CMS logic

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

// ── Eagerly register all plugins on module import ─────────────────────────────
// Must be done at module level (not inside useEffect) so that
// useLayoutEffect animations in JarvisPreloader and OsModule have
// immediate access to DrawSVG and ScrambleText.
gsap.registerPlugin(
  ScrollTrigger,
  ScrollToPlugin,
  SplitText,
  ScrambleTextPlugin,
  DrawSVGPlugin,
);

gsap.defaults({ duration: 0.9, ease: 'power3.out' });

let initialized = false;

export function initGSAP(): void {
  if (initialized) return;
  initialized = true;
  // Plugins already registered above — this function now only serves
  // as a hook for future per-instance GSAP configuration.
}

export { gsap, ScrollTrigger, ScrollToPlugin, SplitText, ScrambleTextPlugin, DrawSVGPlugin };

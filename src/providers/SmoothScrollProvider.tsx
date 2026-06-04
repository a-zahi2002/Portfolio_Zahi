// ANIMATION LAYER ONLY — CMS/data/props untouched

import React, { createContext, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/gsap-init';

interface SmoothScrollContextValue {
  lenis: Lenis | null;
  isMobile: boolean;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({ lenis: null, isMobile: false });

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export const SmoothScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobileCheck = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    setIsMobile(mobileCheck);

    if (mobileCheck) {
      // Disable Lenis on mobile, use native scroll
      document.documentElement.style.scrollBehavior = 'auto';
      
      // Disable pinning globally if requested
      ScrollTrigger.config({ ignoreMobileResize: true });
      
      // We can iterate over all ScrollTriggers to disable pins on mobile, 
      // but usually we just conditionally apply pins in our components based on `isMobile`.
      return;
    }

    const lenisInstance = new Lenis({
      lerp: 0.075,
      syncTouch: false,
    });
    
    setLenis(lenisInstance);

    // Wire Lenis to GSAP ticker
    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // ScrollerProxy setup is usually optional for standard body scrolling in modern Lenis,
    // but requested by instructions
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenisInstance.scrollTo(value, { immediate: true });
        }
        return lenisInstance.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      }
    });

    // Refresh ScrollTrigger when lenis scrolls
    // lenisInstance.on('scroll', ScrollTrigger.update); // Optional

    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      lenisInstance.destroy();
      gsap.ticker.remove((time) => lenisInstance.raf(time * 1000));
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ lenis, isMobile }}>
      {children}
    </SmoothScrollContext.Provider>
  );
};

export default SmoothScrollProvider;

// ANIMATION ONLY — does not modify data, props, or CMS logic

import React, { createContext, useContext, useEffect } from 'react';
import type Lenis from 'lenis';
import { initGSAP } from '../lib/gsap-config';
import { initLenis, destroyLenis, getLenis } from '../lib/lenis-config';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SmoothScrollContextValue {
  lenis: Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({ lenis: null });

export const useSmoothScroll = () => useContext(SmoothScrollContext);

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children }) => {
  useEffect(() => {
    // 1. Register all GSAP plugins (idempotent singleton)
    initGSAP();

    // 2. Disable native smooth scroll so Lenis takes over
    document.documentElement.style.scrollBehavior = 'auto';

    // 3. Init Lenis (returns null on mobile/touch)
    initLenis();

    // 4. Refresh ScrollTrigger after fonts are loaded
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      destroyLenis();
      // Restore scroll behavior on unmount
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ lenis: getLenis() }}>
      {children}
    </SmoothScrollContext.Provider>
  );
};

export default SmoothScrollProvider;

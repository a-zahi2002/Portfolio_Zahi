// ✅ PERF: AuroraBackground — replaced Framer Motion with pure CSS keyframes.
// This moves all animation work off the JS thread onto the GPU compositor.
// Visual output is identical. framer-motion import removed from this file.

import React from 'react';

const AuroraBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#fafafa] dark:bg-[#050505] transition-colors duration-700">
      <div className="absolute inset-0 opacity-30 dark:opacity-40 parallax-glow">
        {/* Orb 1 — pure CSS, no JS animation */}
        <div
          className="aurora-orb-1 absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-colors duration-1000 ease-in-out"
          style={{ backgroundColor: 'var(--universe-accent)', opacity: 'var(--aurora-opacity-1)' }}
        />
        {/* Orb 2 — pure CSS */}
        <div
          className="aurora-orb-2 absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] transition-colors duration-1000 ease-in-out"
          style={{ backgroundColor: 'var(--universe-accent-secondary)', opacity: 'var(--aurora-opacity-2)' }}
        />
        {/* Orb 3 — pure CSS */}
        <div
          className="aurora-orb-3 absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full blur-[100px] transition-colors duration-1000 ease-in-out"
          style={{ backgroundColor: 'var(--universe-accent)', opacity: 'var(--aurora-opacity-3)' }}
        />
      </div>
      {/* Native SVG Noise Overlay for Texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.015] dark:opacity-[0.035] mix-blend-overlay pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilterBg">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilterBg)" />
      </svg>
    </div>
  );
};

export default AuroraBackground;

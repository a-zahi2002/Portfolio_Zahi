// Cyber Terminal — Background Grid
// Pure CSS animated grid background. Fixed position, GPU-composited.

import React from 'react';

const CyberGrid: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
      style={{
        backgroundImage: `
          linear-gradient(var(--ct-grid-color) 1px, transparent 1px),
          linear-gradient(90deg, var(--ct-grid-color) 1px, transparent 1px)
        `,
        backgroundSize: 'var(--ct-grid-size) var(--ct-grid-size)',
        maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)',
      }}
    >
      {/* Subtle glow at grid intersections via radial gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle 1px at center, var(--ct-cyan-dim) 0%, transparent 100%)
          `,
          backgroundSize: 'var(--ct-grid-size) var(--ct-grid-size)',
          opacity: 0.3,
        }}
      />
    </div>
  );
};

export default CyberGrid;

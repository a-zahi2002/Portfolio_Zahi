// Cyber Terminal — Scroll Progress Bar
// Gradient progress line at top of viewport.

import React, { useEffect, useState } from 'react';

const ScrollProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-[2px]"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="h-full transition-[width] duration-100 ease-out"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--ct-cyan), var(--ct-purple))',
          boxShadow: '0 0 10px var(--ct-cyan-glow)',
        }}
      />
    </div>
  );
};

export default ScrollProgressBar;

// ANIMATION LAYER ONLY — CMS/data/props untouched

import React, { useEffect, useRef } from 'react';

const AmbientCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    let isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    // ✅ PERF: Reduced particle count — 280→140 desktop, 180→70 mobile
    let particleCount = isMobile ? 70 : 140;

    let mouseX = -9999;
    let mouseY = -9999;

    // ✅ PERF: Pre-build color strings once per mode change — not per particle per frame
    let isDark = document.documentElement.classList.contains('dark');
    let warmColor = isDark ? 'rgba(255,255,255,' : 'rgba(218,165,32,';
    let coolColor = isDark ? 'rgba(200,230,255,' : 'rgba(75,0,130,';

    const observer = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains('dark');
      warmColor = isDark ? 'rgba(255,255,255,' : 'rgba(218,165,32,';
      coolColor = isDark ? 'rgba(200,230,255,' : 'rgba(75,0,130,';
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

    // ✅ PERF: Pause animation when tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        render();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // ✅ PERF: Mobile frame-skip counter
    let frameCount = 0;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      isWarm: boolean;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.isWarm = Math.random() > 0.5;
      }

      update(scrollVelocity: number) {
        // ✅ PERF: Use squared distance — avoids Math.sqrt entirely
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < 14400 && !isMobile) { // 120² = 14400
          const dist = Math.sqrt(distSq); // only called when within range (~10% of particles)
          const force = (120 - dist) / 120;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        } else {
          this.x += this.speedX;
          this.y += this.speedY + (scrollVelocity * 0.05 * (this.size / 2));
        }

        // Screen wrap
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw(scrollVelocity: number) {
        if (!ctx) return;
        const absoluteVelocity = Math.abs(scrollVelocity);
        // ✅ PERF: Use pre-built color prefix strings
        const colorBase = this.isWarm ? warmColor : coolColor;

        ctx.fillStyle = colorBase + this.opacity + ')';

        if (absoluteVelocity > 1.5 && !isMobile) {
          const stretch = Math.max(-60, Math.min(60, -scrollVelocity * 0.5 * (this.size / 1.2)));
          ctx.strokeStyle = colorBase + this.opacity + ')';
          ctx.lineWidth = this.size;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x, this.y + stretch);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    let lastScrollY = window.scrollY;

    const render = () => {
      if (document.hidden) return;

      // ✅ PERF: Skip every other frame on mobile (30fps cap)
      frameCount++;
      if (isMobile && frameCount % 2 !== 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const currentScrollY = window.scrollY;
      const scrollVelocity = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particleCount; i++) {
        particles[i].update(scrollVelocity);
        particles[i].draw(scrollVelocity);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      width = newWidth;
      height = newHeight;
      canvas.width = width;
      canvas.height = height;

      isMobile = window.matchMedia('(pointer: coarse)').matches || width < 768;
      particleCount = isMobile ? 70 : 140;

      initParticles();
    };

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const debounceResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 200);
    };

    // ✅ PERF: rAF-gate mousemove — at most one update per frame
    let mousePending = false;
    let pendingX = -9999;
    let pendingY = -9999;

    const handleMouseMove = (e: MouseEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (!mousePending) {
        mousePending = true;
        requestAnimationFrame(() => {
          mouseX = pendingX;
          mouseY = pendingY;
          mousePending = false;
        });
      }
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    // Initial setup
    canvas.width = width;
    canvas.height = height;
    initParticles();
    render();

    window.addEventListener('resize', debounceResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', debounceResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
};

export default AmbientCanvas;

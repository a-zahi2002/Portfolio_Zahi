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
    let particleCount = isMobile ? 180 : 280;

    let mouseX = width / 2;
    let mouseY = height / 2;
    
    // Theme colors
    let isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark') || document.documentElement.getAttribute('data-theme') === 'dark';
    
    // Default to dark since we didn't initially check
    // We'll update in loop if needed, but a MutationObserver is better
    const observer = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains('dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      isWarm: boolean;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 2 + 0.5; // 0.5px to 2.5px
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.isWarm = Math.random() > 0.5;
      }

      update(scrollVelocity: number) {
        // Repel from mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        
        // Max distance 120px
        if (distance < 120 && !isMobile) {
          const force = (120 - distance) / 120;
          this.x -= forceDirectionX * force * 2;
          this.y -= forceDirectionY * force * 2;
        } else {
          // Return to base slightly
          this.x += this.speedX;
          this.y += this.speedY + (scrollVelocity * 0.05 * (this.size / 2)); // Parallax effect
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

        if (isDark) {
          ctx.strokeStyle = this.isWarm ? `rgba(255, 255, 255, ${this.opacity})` : `rgba(200, 230, 255, ${this.opacity})`;
          ctx.fillStyle = this.isWarm ? `rgba(255, 255, 255, ${this.opacity})` : `rgba(200, 230, 255, ${this.opacity})`;
        } else {
          ctx.strokeStyle = this.isWarm ? `rgba(218, 165, 32, ${this.opacity})` : `rgba(75, 0, 130, ${this.opacity})`;
          ctx.fillStyle = this.isWarm ? `rgba(218, 165, 32, ${this.opacity})` : `rgba(75, 0, 130, ${this.opacity})`;
        }

        // Draw as speed line if scrolling fast (starfield warp speed)
        if (absoluteVelocity > 1.5 && !isMobile) {
          ctx.beginPath();
          ctx.lineWidth = this.size;
          ctx.lineCap = 'round';
          ctx.moveTo(this.x, this.y);
          // Stretch along the scroll axis (negative velocity stretches upwards when scrolling down)
          const stretch = Math.max(-60, Math.min(60, -scrollVelocity * 0.5 * (this.size / 1.2)));
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
      const currentScrollY = window.scrollY;
      const scrollVelocity = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Use clearRect for performance as instructed
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
      particleCount = isMobile ? 180 : 280;
      
      initParticles();
    };

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const debounceResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 200);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      // Move mouse off screen so repel stops
      mouseX = -1000;
      mouseY = -1000;
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

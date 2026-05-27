import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, FileText } from 'lucide-react';
import { useHeroSection } from '../hooks/cms/useHeroSection';
import { useSiteSettings } from '../hooks/cms/useSiteSettings';

const MagneticButton = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onClick={onClick}
      className="group relative flex items-center justify-center gap-3 px-10 py-5 bg-charcoal-900 dark:bg-white text-white dark:text-charcoal-900 rounded-full font-bold tracking-wide overflow-hidden hover:scale-105 shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(255,255,255,0.1)]"
    >
      <span className="relative z-10">{children}</span>
      <ArrowDown className="relative z-10 w-4 h-4 group-hover:translate-y-1 transition-transform" />
    </motion.button>
  );
};

const FloatingShape = ({ className, delay = 0, yOffset = 20 }: { className: string; delay?: number; yOffset?: number }) => (
  <motion.div
    animate={{
      y: [0, yOffset, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay
    }}
    className={`absolute pointer-events-none rounded-3xl backdrop-blur-2xl border border-white/20 shadow-2xl ${className}`}
  />
);

const HeroSkeleton: React.FC = () => (
  <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
      <div className="mb-8 space-y-4 animate-pulse">
        <div className="h-16 md:h-24 bg-charcoal-900/5 dark:bg-white/5 rounded-2xl w-3/4 mx-auto" />
        <div className="h-1 w-24 mx-auto bg-charcoal-900/5 dark:bg-white/5 rounded-full" />
      </div>
    </div>
  </section>
);

const Hero: React.FC = () => {
  const { data: hero, isLoading } = useHeroSection();
  const { data: settings } = useSiteSettings();

  if (isLoading) return <HeroSkeleton />;

  const heading = hero?.heading ?? 'A. Zahi';
  const headingHighlight = hero?.heading_highlight ?? 'Faleel';
  const subheading = hero?.subheading ?? 'Crafting intuitive and immersive digital experiences bridging robust engineering with elegant design.';
  const ctaText = hero?.cta_text ?? 'Explore Work';
  const ctaTarget = hero?.cta_scroll_target ?? 'projects';
  const availabilityStatus = hero?.availability_status ?? true;
  const availabilityLabel = hero?.availability_label ?? 'OPEN TO WORK';

  return (
    <section id="hero" className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
      
      {/* Floating Glass Shapes with Antigravity Parallax */}
      <div className="absolute top-[20%] left-[10%] w-32 h-32 parallax-slow pointer-events-none">
        <FloatingShape className="w-full h-full bg-blue-500/10 dark:bg-white/5 rotate-12" delay={0} yOffset={30} />
      </div>
      <div className="absolute bottom-[20%] right-[10%] w-48 h-48 parallax-medium pointer-events-none">
        <FloatingShape className="w-full h-full bg-purple-500/10 dark:bg-white/5 -rotate-12 rounded-full" delay={1} yOffset={-40} />
      </div>
      <div className="absolute top-[30%] right-[20%] w-24 h-24 parallax-fast pointer-events-none">
        <FloatingShape className="w-full h-full bg-cyan-500/10 dark:bg-white/5 rotate-45" delay={2} yOffset={20} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none opacity-50" />

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Availability Badge */}
        {availabilityStatus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 dark:bg-white/5 border border-charcoal-900/10 dark:border-white/10 backdrop-blur-md shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-xs font-bold uppercase tracking-widest text-charcoal-700 dark:text-gray-300">
              {availabilityLabel}
            </span>
          </motion.div>
        )}

        {/* Heading with Mask Reveal */}
        <div className="mb-6 overflow-hidden py-2">
          <motion.h1
            initial={{ y: "100%", opacity: 0, rotateZ: 5 }}
            animate={{ y: 0, opacity: 1, rotateZ: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-[7rem] font-display font-bold tracking-tighter text-charcoal-900 dark:text-white leading-[1.1]"
          >
            {heading}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-accent-cyan dark:to-accent-purple drop-shadow-sm">
              {headingHighlight}
            </span>
          </motion.h1>
        </div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-2xl text-charcoal-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-sans"
        >
          {subheading}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <MagneticButton onClick={() => document.getElementById(ctaTarget)?.scrollIntoView({ behavior: 'smooth' })}>
            {ctaText}
          </MagneticButton>

          {settings?.resume_url && (
            <a
              href={settings.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-charcoal-900 dark:text-white border-2 border-charcoal-900/10 dark:border-white/10 hover:border-charcoal-900/30 dark:hover:border-white/30 hover:bg-charcoal-900/5 dark:hover:bg-white/5 transition-all duration-300"
            >
              Resume
              <FileText className="w-4 h-4" />
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
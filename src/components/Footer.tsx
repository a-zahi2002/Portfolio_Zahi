// CYBER TERMINAL THEME
// Footer.tsx — Clean minimal footer with back-to-top button.
// CMS hooks, copyright text: UNTOUCHED.

import React from 'react';
import { Heart, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSiteSettings } from '../hooks/cms/useSiteSettings';
import { useSmoothScroll } from './SmoothScrollProvider';
import { useAudio } from './audio/AudioProvider';

const Footer: React.FC = () => {
  const { data: settings } = useSiteSettings();
  const { lenis } = useSmoothScroll();
  const { playClick } = useAudio();
  const copyrightText = settings?.copyright_text ?? '© 2025 A. Zahi Faleel. All rights reserved.';

  const handleScrollToTop = () => {
    playClick();
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 2.5,
        easing: (t: number) => 1 - Math.pow(1 - t, 5),
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer
      className="relative py-12"
      style={{
        background: 'var(--ct-bg)',
        borderTop: '1px solid var(--ct-border)',
      }}
    >
      {/* Gradient top border */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--ct-cyan-dim), var(--ct-purple-dim), transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Made with love */}
          <div className="flex items-center justify-center mb-4">
            <span className="text-gray-500">Made with</span>
            <Heart className="w-4 h-4 text-accent-rose mx-2 animate-pulse" />
            <span className="text-gray-500">using React & Three.js</span>
          </div>

          <p className="text-gray-500 text-sm">{copyrightText}</p>

          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-xs text-gray-600">
              Designed and developed with modern web technologies
            </p>
          </div>

          {/* Back to top button */}
          <div className="mt-8">
            <motion.button
              onClick={handleScrollToTop}
              whileHover={{ y: -3, boxShadow: 'var(--ct-glow-cyan)' }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-cyber text-gray-400 hover:text-accent-cyan transition-colors text-sm font-medium"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-4 h-4" />
              Back to top
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
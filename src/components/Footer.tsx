// ANIMATION ONLY additions: SectionReveal wrapper + BackToTop button.
// All original footer content, CMS hooks, and handlers are completely untouched.

import React from 'react';
import { Heart } from 'lucide-react';
import { useSiteSettings } from '../hooks/cms/useSiteSettings';
import { useSmoothScroll } from './SmoothScrollProvider';
import { useFooterAnimation } from '../hooks/animations/useFooterAnimation';

const BackToTopButton: React.FC = () => {
  const { lenis } = useSmoothScroll();

  const handleClick = () => {
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 2,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Back to top"
      className="group mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-blue-500 dark:hover:text-accent-cyan transition-colors duration-300"
    >
      <span
        className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-600/30 dark:border-white/10 group-hover:border-blue-500 dark:group-hover:border-accent-cyan transition-colors duration-300 group-hover:-translate-y-0.5 transition-transform"
        aria-hidden="true"
      >
        ↑
      </span>
      Back to top
    </button>
  );
};

const Footer: React.FC = () => {
  const { data: settings } = useSiteSettings();
  const copyrightText = settings?.copyright_text ?? '© 2025 A. Zahi Faleel. All rights reserved.';
  const sectionRef = React.useRef<HTMLElement>(null);
  useFooterAnimation(sectionRef);

  return (
    <footer 
      ref={sectionRef} 
      className="bg-transparent text-white py-16 border-t relative"
      style={{ 
        borderTopColor: 'var(--universe-accent)', 
        boxShadow: '0 -15px 40px -15px rgba(var(--universe-accent-rgb), 0.12)' 
      }}
    >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-gray-400">Made with</span>
              <Heart className="w-4 h-4 text-red-500 mx-2 animate-pulse" />
              <span className="text-gray-400">using React &amp; TailwindCSS</span>
            </div>

            <p className="text-gray-400 text-sm">{copyrightText}</p>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-xs text-gray-500">
                Designed and developed with modern web technologies
              </p>
            </div>

            {/* Back to top — appended after original content, not replacing anything */}
            <div className="mt-6">
              <BackToTopButton />
            </div>
          </div>
        </div>
    </footer>
  );
};

export default Footer;
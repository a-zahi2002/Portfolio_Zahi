import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DarkModeToggle from './DarkModeToggle';
import { useSiteSettings } from '../hooks/cms/useSiteSettings';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: settings } = useSiteSettings();

  const brandName = settings?.brand_name ?? 'ZAHI';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Index', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Work', href: '#projects' },
    { name: 'Expertise', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // If lenis is active, pause it
      document.documentElement.classList.add('lenis-stopped');
    } else {
      document.body.style.overflow = '';
      document.documentElement.classList.remove('lenis-stopped');
    }
  }, [isOpen]);

  const menuVariants = {
    closed: {
      opacity: 0,
      y: '-100%',
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    }
  };

  const linkVariants = {
    closed: { y: 100, opacity: 0 },
    open: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 * i + 0.3 }
    })
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ease-out ${scrolled && !isOpen ? 'py-4 mix-blend-difference text-white' : 'py-8 mix-blend-normal'}`}>
        <div className="container-padding flex justify-between items-center">
          
          <a href="#" className="relative z-[60] overflow-hidden group" onClick={() => setIsOpen(false)}>
            <h1 className={`text-2xl font-display font-medium tracking-widest uppercase transition-colors duration-500 ${isOpen ? 'text-charcoal-900 dark:text-white' : ''}`}>
              {brandName.replace('.', '')}
              <span className="text-accent-gold">.</span>
            </h1>
          </a>

          <div className="flex items-center gap-6 z-[60]">
            <div className={`transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
              <DarkModeToggle />
            </div>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative group flex items-center justify-center w-12 h-12 rounded-full overflow-hidden"
            >
              <div className={`absolute inset-0 bg-charcoal-900 dark:bg-white rounded-full transition-transform duration-500 ease-expo ${isOpen ? 'scale-100' : 'scale-0 group-hover:scale-100'}`} />
              
              <span className={`relative z-10 transition-colors duration-300 flex items-center justify-center ${isOpen || scrolled ? (isOpen ? 'text-white dark:text-charcoal-950' : 'text-white group-hover:text-white dark:group-hover:text-charcoal-950') : 'text-charcoal-900 dark:text-white group-hover:text-white dark:group-hover:text-charcoal-950'}`}>
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-40 bg-white dark:bg-charcoal-950 flex flex-col justify-center px-6 lg:px-24"
          >
            <div className="noise-overlay pointer-events-none opacity-20" />
            
            <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex flex-col space-y-2 md:space-y-4">
                {navLinks.map((link, i) => (
                  <div key={link.name} className="overflow-hidden">
                    <motion.a
                      custom={i}
                      variants={linkVariants}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block font-display text-5xl md:text-8xl lg:text-[10rem] font-medium leading-[0.85] text-charcoal-900 dark:text-white hover:text-accent-gold dark:hover:text-accent-gold transition-colors duration-500"
                    >
                      {link.name}
                    </motion.a>
                  </div>
                ))}
              </div>

              <div className="mt-16 md:mt-0 flex flex-col gap-8 text-charcoal-500 dark:text-gray-400 font-sans">
                <div className="overflow-hidden">
                  <motion.div custom={4} variants={linkVariants}>
                    <p className="text-sm tracking-widest uppercase mb-2 text-charcoal-900 dark:text-white">Socials</p>
                    <div className="flex flex-col gap-1">
                      <a href="#" className="hover:text-accent-gold transition-colors">Twitter</a>
                      <a href="#" className="hover:text-accent-gold transition-colors">LinkedIn</a>
                      <a href="#" className="hover:text-accent-gold transition-colors">GitHub</a>
                    </div>
                  </motion.div>
                </div>
                
                <div className="overflow-hidden">
                  <motion.div custom={5} variants={linkVariants}>
                    <p className="text-sm tracking-widest uppercase mb-2 text-charcoal-900 dark:text-white">Email</p>
                    <a href="mailto:hello@azahi.com" className="hover:text-accent-gold transition-colors">hello@azahi.com</a>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
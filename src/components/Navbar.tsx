// CYBER TERMINAL THEME
// Navbar.tsx — Floating glass-cyber navbar with mute toggle.
// CMS hooks, data: UNTOUCHED.

import React, { useState, useEffect } from 'react';
import { Menu, X, Download } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import MuteToggle from './audio/MuteToggle';
import { useSiteSettings } from '../hooks/cms/useSiteSettings';
import { useAudio } from './audio/AudioProvider';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { data: settings } = useSiteSettings();
  const { playClick } = useAudio();

  const brandName = settings?.brand_name ?? 'A.ZAHI';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ['hero', 'about', 'journey', 'projects', 'skills', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Journey', href: '#journey' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
  ];

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        scrolled
          ? 'w-[95%] max-w-5xl'
          : 'w-[95%] max-w-6xl'
      }`}
    >
      <div
        className={`glass-cyber rounded-2xl px-6 py-3 transition-all duration-500 ${
          scrolled
            ? 'shadow-lg shadow-black/20 dark:shadow-accent-cyan/5'
            : 'border-transparent bg-transparent dark:bg-transparent backdrop-blur-none'
        }`}
        style={!scrolled ? { border: '1px solid transparent', background: 'transparent', backdropFilter: 'none' } : undefined}
      >
        <div className="flex justify-between items-center">
          {/* Brand */}
          <a href="#" className="group relative" onClick={() => playClick()}>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display tracking-widest">
              {brandName.replace('.', '')}
              <span className="text-accent-cyan">.</span>
            </h1>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-cyan transition-all duration-300 group-hover:w-full" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => playClick()}
                  className="relative px-4 py-2 text-sm font-medium transition-colors duration-300"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: 'var(--ct-cyan-dim)',
                        border: '1px solid var(--ct-border-hover)',
                      }}
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <span className={`relative z-10 ${isActive ? 'text-accent-cyan' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                    {link.name}
                  </span>
                </a>
              );
            })}

            <div className="flex items-center gap-2 pl-4 ml-4 border-l border-gray-200 dark:border-white/10">
              <MuteToggle />
              <DarkModeToggle />
              {settings?.resume_url && (
                <a
                  href={settings.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playClick()}
                  className="cyber-button !py-2 !px-4 !text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  Resume
                </a>
              )}
              <a
                href="#contact"
                onClick={() => playClick()}
                className="cyber-button-filled !py-2 !px-5 !text-xs !rounded-full"
              >
                Let's Talk
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <MuteToggle />
            <DarkModeToggle />
            <button
              onClick={() => {
                setIsOpen(!isOpen);
                playClick();
              }}
              className="text-gray-900 dark:text-white hover:text-accent-cyan transition-colors p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu — Full Screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-2 glass-cyber rounded-2xl overflow-hidden"
          >
            <div className="px-6 py-6 space-y-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="block py-3 text-lg font-medium text-gray-300 hover:text-accent-cyan transition-colors"
                  onClick={() => {
                    setIsOpen(false);
                    playClick();
                  }}
                >
                  {link.name}
                </motion.a>
              ))}
              <div className="pt-4 border-t border-white/10 space-y-3">
                {settings?.resume_url && (
                  <a
                    href={settings.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 hover:text-accent-cyan transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Download className="w-4 h-4" />
                    Download Resume
                  </a>
                )}
                <a
                  href="#contact"
                  className="block text-lg font-bold text-accent-cyan"
                  onClick={() => setIsOpen(false)}
                >
                  Contact Me
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
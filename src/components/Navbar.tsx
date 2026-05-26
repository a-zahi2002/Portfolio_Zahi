import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import { useSiteSettings } from '../hooks/cms/useSiteSettings';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { data: settings } = useSiteSettings();

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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-charcoal-950/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="#" className="group relative">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white font-['Space_Grotesk'] tracking-widest">
                {brandName.replace('.', '')}<span className="text-blue-500 dark:text-accent-cyan">.</span>
              </h1>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 dark:bg-accent-cyan transition-all duration-300 group-hover:w-full" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm uppercase tracking-wider font-medium transition-all duration-300 hover:text-blue-600 dark:hover:text-accent-cyan relative group ${activeSection === link.href.substring(1) ? 'text-blue-600 dark:text-accent-cyan' : 'text-gray-600 dark:text-gray-400'}`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 dark:bg-accent-cyan transition-all duration-300 ${activeSection === link.href.substring(1) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </a>
            ))}
            <div className="flex items-center space-x-4 pl-8 border-l border-gray-300 dark:border-white/10">
              <DarkModeToggle />
              <a href="#contact" className="px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-charcoal-950 text-sm font-bold rounded-full hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors">
                Let's Talk
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <DarkModeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-accent-cyan transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white dark:bg-charcoal-950 border-b border-gray-200 dark:border-white/5 shadow-xl transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
        <div className="px-4 py-6 space-y-4">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="block text-lg font-medium text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-accent-cyan hover:pl-2 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contact"
            className="block text-lg font-bold text-blue-600 dark:text-accent-cyan hover:pl-2 transition-all duration-200"
            onClick={() => setIsOpen(false)}
          >
            Contact Me
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
// CYBER TERMINAL THEME
// Contact.tsx — Bold typography contact section with glass-cyber email button.
// CMS hooks, copy handler, data: UNTOUCHED.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Copy, Check, Mail } from 'lucide-react';
import { useContactInfo } from '../hooks/cms/useContactInfo';
import { useSocialLinks } from '../hooks/cms/useSocialLinks';
import { useAudio } from './audio/AudioProvider';

// Map icon name strings to Lucide components
const ICON_MAP: Record<string, React.ReactNode> = {
  Github: <Github size={24} />,
  Linkedin: <Linkedin size={24} />,
};

const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const { data: contact, isLoading: contactLoading } = useContactInfo();
  const { data: socialLinks, isLoading: socialLoading } = useSocialLinks();
  const { playClick } = useAudio();

  const email = contact?.email ?? 'a.zahi2002@gmail.com';
  const eyebrow = contact?.section_eyebrow ?? "What's Next?";
  const heading = contact?.section_heading ?? "Let's build something";
  const headingHighlight = contact?.section_heading_highlight ?? 'extraordinary.';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="contact"
      className="py-32 relative overflow-hidden flex flex-col items-center justify-center min-h-[60vh]"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 pointer-events-none parallax-glow">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full h-full bg-accent-cyan/10 rounded-full blur-[150px]"
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10 text-center">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-cyber mb-8"
        >
          <Mail className="w-4 h-4 text-accent-cyan" />
          <span className="text-sm font-bold uppercase tracking-widest text-gray-300">
            {contactLoading ? '...' : eyebrow}
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-5xl md:text-7xl font-display font-bold text-white mb-16 leading-[1.1]"
        >
          {contactLoading ? (
            <div className="h-16 bg-white/5 animate-pulse rounded-2xl w-3/4 mx-auto" />
          ) : (
            <>
              {heading}
              <br />
              <span className="text-gradient-cyber">{headingHighlight}</span>
            </>
          )}
        </motion.h2>

        {/* Email button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative inline-block group"
        >
          <button
            onClick={handleCopy}
            disabled={contactLoading}
            className="relative z-10 text-base sm:text-2xl md:text-5xl font-sans font-bold text-gray-200 hover:text-white transition-all duration-300 flex items-center justify-center gap-3 md:gap-6 py-4 md:py-6 px-6 md:px-10 w-full max-w-[90vw] sm:w-auto rounded-full glass-cyber hover:border-accent-cyan/50 disabled:opacity-50 hover:shadow-lg hover:shadow-accent-cyan/10 hover:-translate-y-1"
          >
            <span className="truncate">{contactLoading ? '…' : email}</span>
            <div className="p-2.5 md:p-4 shrink-0 rounded-full bg-white/5 text-gray-400 group-hover:bg-accent-cyan group-hover:text-charcoal-950 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12">
              {copied ? <Check className="w-5 h-5 md:w-7 md:h-7" /> : <Copy className="w-5 h-5 md:w-7 md:h-7" />}
            </div>
          </button>

          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.8 }}
                className="absolute -top-14 left-1/2 -translate-x-1/2 bg-accent-cyan text-charcoal-950 text-sm font-bold px-4 py-2 rounded-full shadow-lg whitespace-nowrap"
              >
                Email Copied to Clipboard!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-24 flex justify-center gap-6"
        >
          {socialLoading ? (
            <>
              <div className="w-14 h-14 rounded-full bg-white/5 animate-pulse" />
              <div className="w-14 h-14 rounded-full bg-white/5 animate-pulse" />
            </>
          ) : (
            (socialLinks ?? []).map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-full glass-cyber text-gray-400 hover:text-accent-cyan hover:border-accent-cyan/30 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                aria-label={link.platform}
              >
                {ICON_MAP[link.icon] ?? <span className="text-sm font-bold">{link.platform}</span>}
              </a>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
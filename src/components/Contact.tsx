import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Copy, Check, Mail } from 'lucide-react';
import { useContactInfo } from '../hooks/cms/useContactInfo';
import { useSocialLinks } from '../hooks/cms/useSocialLinks';

// Map icon name strings to Lucide components
const ICON_MAP: Record<string, React.ReactNode> = {
  Github: <Github size={24} />,
  Linkedin: <Linkedin size={24} />,
};

const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const { data: contact, isLoading: contactLoading } = useContactInfo();
  const { data: socialLinks, isLoading: socialLoading } = useSocialLinks();

  const email = contact?.email ?? 'a.zahi2002@gmail.com';
  const eyebrow = contact?.section_eyebrow ?? "What's Next?";
  const heading = contact?.section_heading ?? "Let's build something";
  const headingHighlight = contact?.section_heading_highlight ?? 'extraordinary.';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-32 relative overflow-hidden flex flex-col items-center justify-center min-h-[60vh]">
      
      {/* Massive Immersive Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-blue-500/20 dark:bg-accent-cyan/20 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />

      <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-charcoal-900/10 dark:border-white/10 backdrop-blur-md mb-8"
        >
          <Mail className="w-4 h-4 text-blue-600 dark:text-accent-cyan" />
          <span className="text-sm font-bold uppercase tracking-widest text-charcoal-700 dark:text-gray-300">
            {contactLoading ? '...' : eyebrow}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-display font-bold text-charcoal-900 dark:text-white mb-16 leading-[1.1]"
        >
          {contactLoading ? (
            <div className="h-16 bg-charcoal-900/5 dark:bg-white/5 animate-pulse rounded-2xl w-3/4 mx-auto" />
          ) : (
            <>
              {heading} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-accent-cyan dark:to-blue-400">
                {headingHighlight}
              </span>
            </>
          )}
        </motion.h2>

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
            className="relative z-10 text-2xl md:text-5xl font-sans font-bold text-charcoal-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-white transition-all duration-300 flex items-center gap-6 py-6 px-10 rounded-full border border-gray-200/50 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-accent-cyan/50 bg-white/60 dark:bg-charcoal-900/40 backdrop-blur-xl disabled:opacity-50 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            {contactLoading ? '…' : email}
            <div className="p-3 md:p-4 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 group-hover:bg-blue-600 dark:group-hover:bg-accent-cyan group-hover:text-white dark:group-hover:text-charcoal-950 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12">
              {copied ? <Check size={28} /> : <Copy size={28} />}
            </div>
          </button>

          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.8 }}
                className="absolute -top-14 left-1/2 -translate-x-1/2 bg-blue-600 dark:bg-accent-cyan text-white dark:text-charcoal-950 text-sm font-bold px-4 py-2 rounded-full shadow-lg whitespace-nowrap"
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
              <div className="w-14 h-14 rounded-full bg-charcoal-900/5 dark:bg-white/5 animate-pulse" />
              <div className="w-14 h-14 rounded-full bg-charcoal-900/5 dark:bg-white/5 animate-pulse" />
            </>
          ) : (
            (socialLinks ?? []).map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-full bg-white/60 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 text-charcoal-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-accent-cyan hover:bg-white dark:hover:bg-white/10 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-sm hover:shadow-md"
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
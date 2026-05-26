import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Copy, Check } from 'lucide-react';
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
    <section id="contact" className="py-32 bg-gray-50 dark:bg-charcoal-950 relative overflow-hidden flex flex-col items-center justify-center min-h-[60vh] transition-colors duration-300">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-blue-500/10 dark:bg-accent-cyan/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-blue-600 dark:text-accent-purple font-medium uppercase tracking-widest mb-8"
        >
          {contactLoading ? <span className="opacity-0">placeholder</span> : eyebrow}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-12 leading-tight"
        >
          {contactLoading ? (
            <span className="opacity-0">placeholder</span>
          ) : (
            <>
              {heading} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-accent-cyan dark:to-blue-600">{headingHighlight}</span>
            </>
          )}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative inline-block group"
        >
          <button
            onClick={handleCopy}
            disabled={contactLoading}
            className="relative z-10 text-2xl md:text-4xl lg:text-5xl font-mono text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 flex items-center gap-4 py-4 px-8 rounded-full border border-gray-200 dark:border-white/5 hover:border-blue-500 dark:hover:border-white/20 bg-white/50 dark:bg-white/5 backdrop-blur-md disabled:opacity-50"
          >
            {contactLoading ? '…' : email}
            <div className="p-2 rounded-full bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white group-hover:bg-blue-500 dark:group-hover:bg-accent-cyan group-hover:text-white dark:group-hover:text-charcoal-950 transition-all duration-300">
              {copied ? <Check size={24} /> : <Copy size={24} />}
            </div>
          </button>

          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-500 dark:bg-accent-cyan text-white dark:text-charcoal-950 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap"
              >
                Email Copied!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-20 flex justify-center gap-8"
        >
          {socialLoading ? (
            <>
              <div className="w-12 h-12 rounded-full bg-white/5 animate-pulse" />
              <div className="w-12 h-12 rounded-full bg-white/5 animate-pulse" />
            </>
          ) : (
            (socialLinks ?? []).map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 dark:hover:text-white transition-colors p-2 md:p-4 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full"
                aria-label={link.platform}
              >
                {ICON_MAP[link.icon] ?? <span className="text-sm font-medium">{link.platform}</span>}
              </a>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
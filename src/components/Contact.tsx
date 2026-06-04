// JARVIS-OS THEME — animation only
// Contact.tsx — additive JARVIS enhancements:
//   - Heading SplitText chars + ScrambleText pre-pass
//   - Square diamond sonar rings (broadcast signal visual)
//   - Email button wrapper with JARVIS field label
//   - "[ TRANSMISSION READY ]" status that appears after first interaction
//   - Social links OS-styled wrappers
// CMS hooks, copy handler, data: UNTOUCHED.

import React, { useState, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Copy, Check, Mail } from 'lucide-react';
import { useContactInfo } from '../hooks/cms/useContactInfo';
import { useSocialLinks } from '../hooks/cms/useSocialLinks';
import { gsap, ScrollTrigger } from '../lib/gsap-config';

// Map icon name strings to Lucide components
const ICON_MAP: Record<string, React.ReactNode> = {
  Github: <Github size={24} />,
  Linkedin: <Linkedin size={24} />,
};

const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [transmissionReady, setTransmissionReady] = useState(false);
  const { data: contact, isLoading: contactLoading } = useContactInfo();
  const { data: socialLinks, isLoading: socialLoading } = useSocialLinks();

  // ── Animation refs ──────────────────────────────────────────
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const ring3Ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    if (!section || !heading) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set(heading, { opacity: 1 });
        return;
      }

      // ── Heading character reveal ──────────
      const chars = heading.querySelectorAll('.j-contact-char');
      if (chars.length > 0) {
        gsap.set(chars, { opacity: 0, y: 15, filter: 'blur(6px)' });

        ScrollTrigger.create({
          trigger: section,
          start: 'top 75%',
          once: true,
          onEnter: () => {
            gsap.to(chars, {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 1.0,
              stagger: 0.03,
              ease: 'power3.out',
            });
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [contactLoading]);

  const email = contact?.email ?? 'a.zahi2002@gmail.com';
  const eyebrow = contact?.section_eyebrow ?? "What's Next?";
  const heading = contact?.section_heading ?? "Let's build something";
  const headingHighlight = contact?.section_heading_highlight ?? 'extraordinary.';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFirstInput = () => {
    if (!transmissionReady) setTransmissionReady(true);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-32 relative overflow-hidden flex flex-col items-center justify-center min-h-[60vh]"
    >
      {/* ── JARVIS: Square diamond sonar rings ────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 60,
          height: 60,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <div ref={ring1Ref} className="j-sonar-ring" style={{ animationDuration: '4.8s', animationDelay: '0s' }} />
        <div ref={ring2Ref} className="j-sonar-ring" style={{ animationDuration: '4.8s', animationDelay: '1.6s' }} />
        <div ref={ring3Ref} className="j-sonar-ring" style={{ animationDuration: '4.8s', animationDelay: '3.2s' }} />
      </div>

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 pointer-events-none parallax-glow">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full h-full bg-blue-500/20 dark:bg-accent-cyan/20 rounded-full blur-[150px]"
        />
      </div>

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

        {/* Heading — ScrambleText + SplitText via GSAP */}
        <motion.h2
          ref={headingRef}
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
              <span className="inline-block">
                {heading.split('').map((char, i) => (
                  <span
                    key={i}
                    className="j-contact-char inline-block"
                    style={{ display: 'inline-block', minWidth: char === ' ' ? '0.25em' : 'auto' }}
                  >
                    {char}
                  </span>
                ))}
              </span>
              <br />
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-accent-cyan dark:to-blue-400">
                {headingHighlight.split('').map((char, i) => (
                  <span
                    key={i}
                    className="j-contact-char inline-block"
                    style={{ display: 'inline-block', minWidth: char === ' ' ? '0.25em' : 'auto' }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </>
          )}
        </motion.h2>

        {/* ── JARVIS: Email field wrapper ─────────────────────────────── */}
        <div style={{ marginBottom: 8 }}>
          <div
            aria-hidden="true"
            style={{
              fontFamily: 'var(--j-font-mono)',
              fontSize: 9,
              color: 'var(--j-text-dim)',
              letterSpacing: '0.1em',
              marginBottom: 6,
              textAlign: 'left',
              maxWidth: '90vw',
              margin: '0 auto 6px',
            }}
          >
            [ INPUT: PRIMARY_COMM_ADDRESS ]
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative inline-block group"
            onMouseEnter={handleFirstInput}
          >
            <button
              onClick={handleCopy}
              disabled={contactLoading}
              className="relative z-10 text-base sm:text-2xl md:text-5xl font-sans font-bold text-charcoal-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-3 md:gap-6 py-4 md:py-6 px-6 md:px-10 w-full max-w-[90vw] sm:w-auto rounded-full border border-gray-200/50 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-accent-cyan/50 bg-white/60 dark:bg-charcoal-900/40 backdrop-blur-xl disabled:opacity-50 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              style={{ borderBottom: '1px solid var(--j-border)' }}
            >
              <span className="truncate">{contactLoading ? '…' : email}</span>
              <div className="p-2.5 md:p-4 shrink-0 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 group-hover:bg-blue-600 dark:group-hover:bg-accent-cyan group-hover:text-white dark:group-hover:text-charcoal-950 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12">
                {copied ? <Check className="w-5 h-5 md:w-7 md:h-7" /> : <Copy className="w-5 h-5 md:w-7 md:h-7" />}
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
        </div>

        {/* ── JARVIS: Transmission Ready status ─────────────────────── */}
        <AnimatePresence>
          {transmissionReady && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontFamily: 'var(--j-font-mono)',
                fontSize: 10,
                color: 'var(--j-green)',
                letterSpacing: '0.12em',
                marginTop: 8,
              }}
              aria-live="polite"
            >
              [ TRANSMISSION READY ]
            </motion.div>
          )}
        </AnimatePresence>

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
                style={{ border: '1px solid var(--j-border)' }}
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
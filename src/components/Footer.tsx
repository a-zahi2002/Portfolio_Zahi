import React from 'react';
import { motion } from 'framer-motion';
import { useSiteSettings } from '../hooks/cms/useSiteSettings';
import { ArrowUpRight } from 'lucide-react';

const Footer: React.FC = () => {
  const { data: settings } = useSiteSettings();
  const copyrightText = settings?.copyright_text ?? '© 2025 Zahi. All rights reserved.';
  const email = settings?.email ?? 'contact@zahifaleel.com';

  return (
    <footer className="relative bg-charcoal-950 text-white overflow-hidden" style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}>
      
      {/* Sticky Parallax Wrapper */}
      <div className="relative h-screen min-h-[600px] w-full flex flex-col justify-between -z-10 fixed-parallax">
        
        {/* Top Info */}
        <div className="container-padding pt-32 w-full grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="flex flex-col gap-6">
            <h3 className="text-3xl font-display font-medium text-white max-w-sm">
              Let's create something <span className="text-accent-gold italic">extraordinary</span> together.
            </h3>
            <a href={`mailto:${email}`} className="group flex items-center gap-4 w-fit">
              <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-accent-gold transition-colors backdrop-blur-sm">
                <ArrowUpRight className="w-5 h-5 text-white group-hover:text-accent-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </span>
              <span className="text-lg font-sans font-medium text-gray-300 group-hover:text-white transition-colors">
                {email}
              </span>
            </a>
          </div>

          <div className="flex flex-col md:items-end justify-between md:text-right gap-8">
            <div className="flex gap-8">
              <a href={settings?.github_url ?? '#'} target="_blank" rel="noopener noreferrer" className="text-sm uppercase tracking-widest text-gray-400 hover:text-white transition-colors font-medium">GitHub</a>
              <a href={settings?.linkedin_url ?? '#'} target="_blank" rel="noopener noreferrer" className="text-sm uppercase tracking-widest text-gray-400 hover:text-white transition-colors font-medium">LinkedIn</a>
              <a href={settings?.twitter_url ?? '#'} target="_blank" rel="noopener noreferrer" className="text-sm uppercase tracking-widest text-gray-400 hover:text-white transition-colors font-medium">Twitter</a>
            </div>
          </div>
          
        </div>

        {/* Massive Typography */}
        <div className="w-full flex justify-center items-end px-4 overflow-hidden pointer-events-none select-none">
          <motion.h1 
            className="text-[15vw] md:text-[20vw] leading-[0.75] font-display font-bold uppercase text-transparent tracking-tighter"
            style={{ WebkitTextStroke: '2px rgba(255, 255, 255, 0.05)' }}
            initial={{ y: "10%" }}
            whileInView={{ y: 0 }}
            transition={{ ease: "easeOut", duration: 1.5 }}
            viewport={{ once: true }}
          >
            ZAHI
          </motion.h1>
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-0 w-full container-padding py-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10 text-xs uppercase tracking-widest text-gray-500">
          <p>{copyrightText}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Available for work
            </span>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Award, FileText, ExternalLink, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCertificates } from '../hooks/cms/useCertificates';
import type { CMSCertificate } from '../types/cms';

const Certificates: React.FC = () => {
  const { data: certificates, isLoading } = useCertificates();
  const [selectedCertificate, setSelectedCertificate] = useState<CMSCertificate | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const totalScroll = container.scrollWidth - container.clientWidth;
    if (totalScroll <= 0) {
      setScrollProgress(0);
      return;
    }
    setScrollProgress((container.scrollLeft / totalScroll) * 100);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeftState(container.scrollLeft);
    container.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const container = scrollContainerRef.current;
    if (container) container.style.cursor = 'grab';
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const container = scrollContainerRef.current;
    if (container) container.style.cursor = 'grab';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const container = scrollContainerRef.current;
    if (!container) return;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag speed multiplier
    container.scrollLeft = scrollLeftState - walk;
    if (Math.abs(x - startX) > 5) {
      setHasDragged(true);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const amount = 344; // Card width + gap
    container.scrollTo({
      left: container.scrollLeft + (direction === 'left' ? -amount : amount),
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [certificates, isLoading]);

  return (
    <section id="certificates" className="py-32 overflow-hidden relative bg-transparent">
      
      {/* Futuristic Diagonal Neon Stripes & Grid Dots Backdrop */}
      <div className="absolute inset-0 opacity-15 dark:opacity-30 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Dot Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(var(--universe-accent-rgb),0.12)_1.2px,transparent_1.2px)] bg-[size:32px_32px]" />
        
        {/* Diagonal Light Stripes */}
        <div 
          className="absolute top-[-50%] left-[-20%] w-[150%] h-[200%] rotate-[35deg] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(90deg, 
                transparent 0%, 
                rgba(var(--universe-accent-rgb), 0.03) 20%, 
                rgba(var(--universe-accent-rgb), 0.08) 25%, 
                rgba(var(--universe-accent-rgb), 0.03) 30%, 
                transparent 50%,
                rgba(var(--universe-accent-secondary-rgb), 0.03) 70%, 
                rgba(var(--universe-accent-secondary-rgb), 0.08) 75%, 
                rgba(var(--universe-accent-secondary-rgb), 0.03) 80%, 
                transparent 100%
              )
            `,
            backgroundSize: '240px 100%'
          }}
        />
        
        {/* Thin Coordinate Layout Lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
          <line x1="0" y1="20%" x2="100%" y2="20%" stroke="var(--universe-accent)" strokeWidth="0.2" strokeDasharray="5 15" opacity="0.25" />
          <line x1="0" y1="80%" x2="100%" y2="80%" stroke="var(--universe-accent-secondary)" strokeWidth="0.2" strokeDasharray="3 10" opacity="0.25" />
          <line x1="30%" y1="0" x2="30%" y2="100%" stroke="var(--universe-accent)" strokeWidth="0.15" strokeDasharray="2 12" opacity="0.15" />
          <line x1="70%" y1="0" x2="70%" y2="100%" stroke="var(--universe-accent-secondary)" strokeWidth="0.15" strokeDasharray="4 8" opacity="0.15" />
        </svg>
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-blue-500/5 dark:bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3 z-0" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] bg-purple-500/5 dark:bg-accent-purple/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/4 translate-y-1/4 z-0" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative"
        >
          {/* Status Indicator Tag with Diamond Accents */}
          <div className="mb-4 flex items-center justify-center gap-3 font-mono text-[9px] tracking-[0.3em] text-[var(--universe-accent-secondary)] select-none uppercase">
            <span className="w-1.5 h-1.5 border border-[var(--universe-accent-secondary)] rotate-45 bg-[var(--universe-accent-secondary)]/20 animate-pulse" />
            <span>[ SYSTEM CREDENTIAL INDEX ]</span>
            <span className="w-1.5 h-1.5 border border-[var(--universe-accent-secondary)] rotate-45 bg-[var(--universe-accent-secondary)]/20 animate-pulse" />
          </div>

          <h2 className="text-4xl lg:text-5xl font-display font-bold text-charcoal-900 dark:text-white mb-4 uppercase tracking-[0.05em] relative inline-block">
            <span className="absolute left-[-24px] top-1/2 -translate-y-1/2 font-mono text-xl text-[var(--universe-accent)] opacity-40">/</span>
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-accent-cyan dark:to-blue-400">Credentials</span>
            <span className="absolute right-[-24px] top-1/2 -translate-y-1/2 font-mono text-xl text-[var(--universe-accent)] opacity-40">/</span>
          </h2>
          
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[var(--universe-accent)]" />
            <div className="w-1 h-1 bg-[var(--universe-accent)] rotate-45" />
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[var(--universe-accent)]" />
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex overflow-x-auto gap-6 pb-12 pt-4 snap-x snap-mandatory hide-scrollbar -mx-6 px-6 lg:-mx-12 lg:px-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[85vw] sm:w-[320px] shrink-0 snap-center px-6 py-8 rounded-3xl bg-charcoal-900/5 dark:bg-white/5 animate-pulse border border-charcoal-900/10 dark:border-white/5">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-charcoal-900/10 dark:bg-white/10 mb-6" />
                  <div className="h-4 bg-charcoal-900/10 dark:bg-white/10 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-charcoal-900/10 dark:bg-white/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative group/scroll">
            
            {/* Scroll navigation buttons (visible on desktops and large screens) */}
            <div className="hidden lg:block">
              <button
                onClick={() => scroll('left')}
                className="absolute left-[-32px] top-1/2 -translate-y-1/2 z-30 p-3 rounded-xl bg-white/80 dark:bg-charcoal-900/60 backdrop-blur-md border border-gray-200 dark:border-white/10 text-charcoal-700 dark:text-gray-300 hover:text-[var(--universe-accent)] dark:hover:text-[var(--universe-accent)] hover:border-[var(--universe-accent)]/30 hover:scale-105 transition-all shadow-md active:scale-95 pointer-events-auto"
                aria-label="Scroll Left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="absolute right-[-32px] top-1/2 -translate-y-1/2 z-30 p-3 rounded-xl bg-white/80 dark:bg-charcoal-900/60 backdrop-blur-md border border-gray-200 dark:border-white/10 text-charcoal-700 dark:text-gray-300 hover:text-[var(--universe-accent)] dark:hover:text-[var(--universe-accent)] hover:border-[var(--universe-accent)]/30 hover:scale-105 transition-all shadow-md active:scale-95 pointer-events-auto"
                aria-label="Scroll Right"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Scroll container (supports swipe/touch and grab scroll) */}
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-6 pb-12 pt-4 snap-x snap-mandatory hide-scrollbar -mx-6 px-6 lg:-mx-12 lg:px-12 cursor-grab select-none active:cursor-grabbing pointer-events-auto"
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
              {(certificates ?? []).map((certificate, index) => (
                <motion.div
                  key={certificate.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="group w-[85vw] sm:w-[320px] shrink-0 snap-center rounded-2xl bg-white/80 dark:bg-[#07070a]/40 backdrop-blur-md p-8 shadow-md hover:shadow-xl hover:shadow-[var(--universe-accent)]/10 hover:border-[var(--universe-accent)]/30 hover:-translate-y-1.5 transition-all duration-300 border border-gray-200 dark:border-white/5"
                  onClick={() => {
                    if (!hasDragged) {
                      setSelectedCertificate(certificate);
                    }
                  }}
                >
                  <div className="flex flex-col items-center text-center relative">
                    
                    {/* Index label */}
                    <span className="font-mono text-[8px] tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase mb-4">
                      [ DECK POSITION 0{index + 1} ]
                    </span>

                    {/* Diamond Badge Outlines */}
                    <div className="relative w-14 h-14 mb-6 flex items-center justify-center group-hover:scale-105 transition-all duration-500">
                      <div className="absolute inset-0 border border-charcoal-200 dark:border-white/10 rotate-45 bg-charcoal-50 dark:bg-[#07070a] group-hover:border-[var(--universe-accent)] group-hover:bg-[var(--universe-accent)]/10 group-hover:shadow-[0_0_15px_rgba(var(--universe-accent-rgb),0.3)] transition-all duration-500" />
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[var(--universe-accent-secondary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping" />
                      <Award className="w-6 h-6 text-charcoal-500 dark:text-gray-400 group-hover:text-[var(--universe-accent)] relative z-10 transition-colors duration-500" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-display font-bold text-charcoal-900 dark:text-white mb-2 group-hover:text-[var(--universe-accent)] transition-colors duration-300">
                      {certificate.title}
                    </h3>

                    <p className="text-sm text-charcoal-600 dark:text-gray-400 font-sans">{certificate.issuer}</p>
                    
                    {certificate.issue_date && (
                      <p className="text-xs text-charcoal-400 dark:text-gray-500 mt-2.5 font-medium">
                        {new Date(certificate.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="mt-6 flex items-center gap-1 text-[10px] font-bold text-[var(--universe-accent)] opacity-0 group-hover:opacity-100 transition-all duration-300 uppercase tracking-widest translate-y-2 group-hover:translate-y-0">
                      <span>Inspect core</span>
                      <ArrowUpRight size={12} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Drag scroll progress indicators */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <span className="font-mono text-[8px] tracking-[0.25em] text-gray-400 dark:text-gray-500 uppercase select-none">
                [ Drag to traverse • Scroll to explore ]
              </span>
              <div className="w-48 h-[2px] bg-charcoal-100 dark:bg-white/5 rounded-full relative overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--universe-accent)] to-[var(--universe-accent-secondary)] rounded-full shadow-[0_0_6px_rgba(var(--universe-accent-rgb),0.5)] transition-all duration-75"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Premium Lightbox Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12"
            onClick={() => setSelectedCertificate(null)}
          >
            {/* Backdrop blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#020204]/95 backdrop-blur-2xl"
            />

            {/* Glowing Nebulae */}
            <div className="absolute top-0 left-0 w-[45vw] h-[45vw] bg-[var(--universe-accent)]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[45vw] h-[45vw] bg-[var(--universe-accent-secondary)]/5 rounded-full blur-[120px] pointer-events-none" />
            
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-6xl h-full max-h-[85vh] bg-white/70 dark:bg-[#07070a]/50 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row z-10"
              onClick={e => e.stopPropagation()}
            >
              {/* Media viewer */}
              <div className="flex-1 relative bg-gray-50/50 dark:bg-charcoal-950/20 flex items-center justify-center overflow-hidden min-h-[40vh] md:min-h-0">
                {selectedCertificate.image_url && !imageErrors[selectedCertificate.id] ? (
                  selectedCertificate.image_url.toLowerCase().endsWith('.pdf') ? (
                    <iframe
                      src={selectedCertificate.image_url}
                      className="w-full h-full border-none bg-white"
                      title={selectedCertificate.title}
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
                      <img
                        src={selectedCertificate.image_url}
                        alt={selectedCertificate.title}
                        className="w-full h-full object-contain filter drop-shadow-2xl"
                        onError={() => setImageErrors(prev => ({ ...prev, [selectedCertificate.id]: true }))}
                      />
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-8 opacity-50">
                    <Award className="w-24 h-24 text-charcoal-300 dark:text-charcoal-600 mb-4 animate-pulse" />
                    <p className="text-charcoal-500 dark:text-charcoal-400">Media unavailable</p>
                  </div>
                )}
              </div>

              {/* Detail column */}
              <div className="w-full md:w-80 lg:w-96 flex flex-col border-t md:border-t-0 md:border-l border-gray-200/50 dark:border-white/10 bg-white/45 dark:bg-[#07070a]/40 z-10 relative">
                <div className="flex justify-end p-4 border-b border-gray-200/30 dark:border-white/5">
                  <button
                    onClick={() => setSelectedCertificate(null)}
                    className="p-2.5 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-gray-200/50 dark:border-white/10 rounded-full transition-all text-charcoal-500 dark:text-gray-400 hover:text-charcoal-900 dark:hover:text-white shadow-sm hover:shadow-md hover:scale-105"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-8 flex flex-col flex-1 overflow-y-auto">
                  <div className="mb-8">
                    <span className="block font-mono text-[8px] tracking-[0.25em] text-[var(--universe-accent-secondary)] uppercase mb-3 leading-none">
                      [ SECURE DATA ACCESS ]
                    </span>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-charcoal-900 dark:text-white mb-3 leading-tight">
                      {selectedCertificate.title}
                    </h3>
                    <div className="inline-block px-3 py-1 bg-charcoal-100 dark:bg-white/5 border border-charcoal-200 dark:border-white/10 rounded-full text-sm font-semibold text-charcoal-600 dark:text-gray-300 mb-6">
                      {selectedCertificate.issuer}
                    </div>
                    
                    {selectedCertificate.issue_date && (
                      <div className="text-sm text-charcoal-500 dark:text-gray-400 border-t border-gray-200/50 dark:border-white/10 pt-6">
                        <span className="block text-xs uppercase tracking-wider font-bold mb-1 opacity-70">Date Issued</span>
                        {new Date(selectedCertificate.issue_date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-6 border-t border-gray-200/50 dark:border-white/10 flex flex-col gap-3">
                    {selectedCertificate.credential_url && (
                      <a
                        href={selectedCertificate.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 px-4 rounded-xl bg-charcoal-900 dark:bg-white text-white dark:text-charcoal-900 font-bold text-center transition-transform hover:-translate-y-1 shadow-lg hover:shadow-charcoal-900/20 dark:hover:shadow-white/20 flex items-center justify-center gap-2"
                      >
                        Verify Credential
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                    
                    {selectedCertificate.image_url && !selectedCertificate.image_url.toLowerCase().endsWith('.pdf') && (
                      <a
                        href={selectedCertificate.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 px-4 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 text-charcoal-700 dark:text-gray-200 font-bold text-center transition-all hover:bg-white dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 flex items-center justify-center gap-2 shadow-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open Original File
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </section>
  );
};

export default Certificates;

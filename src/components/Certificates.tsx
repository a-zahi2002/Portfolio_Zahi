// CYBER TERMINAL THEME
// Certificates.tsx — Horizontal scroll carousel with glass-cyber cards and lightbox.
// CMS hooks, data: UNTOUCHED.

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Award, ExternalLink, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCertificates } from '../hooks/cms/useCertificates';
import type { CMSCertificate } from '../types/cms';
import { useAudio } from './audio/AudioProvider';

const Certificates: React.FC = () => {
  const { data: certificates, isLoading } = useCertificates();
  const [selectedCertificate, setSelectedCertificate] = useState<CMSCertificate | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const { playClick } = useAudio();

  return (
    <section id="certificates" className="py-32 overflow-hidden relative">
      {/* Decorative blur */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-accent-cyan/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-charcoal-900 dark:text-white mb-4">
            Professional <span className="text-gradient-cyber">Certifications</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg font-sans">
            Continuous learning and industry-recognized qualifications.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex overflow-x-auto gap-6 pb-12 pt-4 snap-x snap-mandatory hide-scrollbar -mx-6 px-6 lg:-mx-12 lg:px-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[85vw] sm:w-[320px] shrink-0 snap-center px-6 py-8 rounded-2xl bg-white/5 animate-pulse border border-white/5">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 mb-6" />
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-6 pb-12 pt-4 snap-x snap-mandatory hide-scrollbar -mx-6 px-6 lg:-mx-12 lg:px-12">
            {(certificates ?? []).map((certificate, index) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true, margin: '-50px' }}
                className="group w-[85vw] sm:w-[320px] shrink-0 snap-center cursor-pointer rounded-2xl glass-cyber p-8 hover:border-accent-cyan/30 transition-all duration-300 hover:-translate-y-1 hud-corners"
                onClick={() => { setSelectedCertificate(certificate); playClick(); }}
              >
                <div className="hud-corner tl" />
                <div className="hud-corner tr" />
                <div className="hud-corner bl" />
                <div className="hud-corner br" />

                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-accent-cyan/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-accent-cyan/20">
                    <Award className="w-8 h-8 text-accent-cyan group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-white mb-2 group-hover:text-accent-cyan transition-colors duration-300">
                    {certificate.title}
                  </h3>
                  <p className="text-sm text-gray-400 font-sans">{certificate.issuer}</p>
                  {certificate.issue_date && (
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                      {new Date(certificate.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </p>
                  )}
                  <div className="mt-6 text-xs font-bold text-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 uppercase tracking-widest">
                    View Credential
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-charcoal-950/90 backdrop-blur-2xl"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-6xl h-full max-h-[85vh] glass-cyber !rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
              onClick={e => e.stopPropagation()}
            >
              {/* Left: Media */}
              <div className="flex-1 relative bg-charcoal-950/50 flex items-center justify-center overflow-hidden min-h-[40vh] md:min-h-0">
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
                        className="w-full h-full object-contain"
                        onError={() => setImageErrors(prev => ({ ...prev, [selectedCertificate.id]: true }))}
                      />
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-8 opacity-50">
                    <Award className="w-24 h-24 text-gray-600 mb-4" />
                    <p className="text-gray-500">Media unavailable</p>
                  </div>
                )}
              </div>

              {/* Right: Details */}
              <div className="w-full md:w-80 lg:w-96 flex flex-col border-t md:border-t-0 md:border-l border-white/10 bg-charcoal-900/40 z-10 relative">
                <div className="flex justify-end p-4 border-b border-white/5">
                  <button
                    onClick={() => setSelectedCertificate(null)}
                    className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-gray-400 hover:text-white hover:scale-105"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-8 flex flex-col flex-1 overflow-y-auto">
                  <div className="mb-8">
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-3 leading-tight">
                      {selectedCertificate.title}
                    </h3>
                    <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm font-semibold text-gray-300 mb-6">
                      {selectedCertificate.issuer}
                    </div>
                    {selectedCertificate.issue_date && (
                      <div className="text-sm text-gray-400 border-t border-white/10 pt-6">
                        <span className="block text-xs uppercase tracking-wider font-bold mb-1 opacity-70">Date Issued</span>
                        {new Date(selectedCertificate.issue_date).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-3">
                    {selectedCertificate.credential_url && (
                      <a
                        href={selectedCertificate.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cyber-button-filled w-full !py-3.5 !rounded-xl justify-center"
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
                        className="cyber-button w-full !py-3.5 !rounded-xl justify-center"
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

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, ArrowUpRight } from 'lucide-react';
import { useCertificates } from '../hooks/cms/useCertificates';
import type { CMSCertificate } from '../types/cms';

const Certificates: React.FC = () => {
  const { data: certificates, isLoading } = useCertificates();
  const [selectedCertificate, setSelectedCertificate] = useState<CMSCertificate | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  return (
    <section id="certificates" className="py-24 md:py-48 bg-[#f5f5f7] dark:bg-charcoal-900 overflow-hidden relative transition-colors duration-500">
      
      <div className="container-padding max-w-5xl relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-medium text-charcoal-900 dark:text-white uppercase tracking-tight">
              Global <br/> <span className="text-accent-gold italic font-light">Recognition</span>
            </h2>
          </motion.div>
          <div className="border-b border-charcoal-900/10 dark:border-white/10 pb-4">
            <span className="text-sm tracking-widest uppercase text-charcoal-500 dark:text-gray-400 font-medium">
              Awards & Certifications
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="py-8 border-t border-charcoal-900/10 dark:border-white/10 animate-pulse flex justify-between">
                <div className="h-6 bg-charcoal-900/5 dark:bg-white/5 w-1/3" />
                <div className="h-4 bg-charcoal-900/5 dark:bg-white/5 w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col border-b border-charcoal-900/10 dark:border-white/10">
            {(certificates ?? []).map((certificate, index) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="group relative flex flex-col md:flex-row md:items-center justify-between py-8 md:py-12 border-t border-charcoal-900/10 dark:border-white/10 cursor-pointer hover:bg-white/40 dark:hover:bg-white/[0.02] transition-colors px-4 -mx-4"
                onClick={() => setSelectedCertificate(certificate)}
              >
                
                {/* Left - Title */}
                <div className="flex items-center gap-6 mb-4 md:mb-0 z-10">
                  <span className="text-sm font-sans text-charcoal-400 dark:text-gray-500">{(index + 1).toString().padStart(2, '0')}</span>
                  <h3 className="text-2xl md:text-4xl font-display font-medium text-charcoal-900 dark:text-white group-hover:text-accent-gold transition-colors duration-500">
                    {certificate.title}
                  </h3>
                </div>

                {/* Right - Issuer & Arrow */}
                <div className="flex items-center gap-8 z-10 md:pl-8">
                  <p className="text-sm md:text-base font-sans text-charcoal-500 dark:text-gray-400 uppercase tracking-widest text-right">
                    {certificate.issuer}
                  </p>
                  <div className="w-10 h-10 rounded-full border border-charcoal-900/20 dark:border-white/20 flex items-center justify-center group-hover:border-accent-gold group-hover:bg-accent-gold/10 transition-colors shrink-0">
                    <ArrowUpRight className="w-4 h-4 text-charcoal-900 dark:text-white group-hover:text-accent-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </div>

                {/* Floating Image Reveal (Desktop Only) */}
                {certificate.image_url && !imageErrors[certificate.id] && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] aspect-video rounded-lg overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-500 z-0 shadow-2xl hidden md:block">
                    <img
                      src={certificate.image_url}
                      alt={certificate.title}
                      className="w-full h-full object-cover"
                      onError={() => setImageErrors(prev => ({ ...prev, [certificate.id]: true }))}
                    />
                    <div className="absolute inset-0 bg-charcoal-950/20 mix-blend-overlay" />
                  </div>
                )}

              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal-950/90 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-8"
            onClick={() => setSelectedCertificate(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-charcoal-900 border border-charcoal-900/10 dark:border-white/10 rounded-none max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row"
              onClick={e => e.stopPropagation()}
            >
              
              {/* Image Side */}
              <div className="w-full md:w-3/5 bg-charcoal-50 dark:bg-charcoal-950 p-8 flex items-center justify-center min-h-[300px] border-b md:border-b-0 md:border-r border-charcoal-900/10 dark:border-white/10 relative">
                {selectedCertificate.image_url && !imageErrors[selectedCertificate.id] ? (
                  <img
                    src={selectedCertificate.image_url}
                    alt={selectedCertificate.title}
                    className="max-w-full max-h-full object-contain shadow-xl"
                    onError={() => setImageErrors(prev => ({ ...prev, [selectedCertificate.id]: true }))}
                  />
                ) : (
                  <Award className="w-24 h-24 text-charcoal-900/20 dark:text-white/20" />
                )}
              </div>

              {/* Content Side */}
              <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-between relative bg-white dark:bg-charcoal-900">
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="absolute top-6 right-6 p-2 hover:bg-charcoal-900/5 dark:hover:bg-white/10 rounded-full transition-colors text-charcoal-400 hover:text-charcoal-900 dark:text-gray-500 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mt-8">
                  <span className="text-xs font-medium uppercase tracking-widest text-accent-gold mb-4 block">
                    {selectedCertificate.issuer}
                  </span>
                  <h3 className="text-3xl font-display font-medium text-charcoal-900 dark:text-white mb-6 leading-tight">
                    {selectedCertificate.title}
                  </h3>
                  
                  {selectedCertificate.issue_date && (
                    <div className="mb-6">
                      <span className="text-xs uppercase tracking-widest text-charcoal-400 dark:text-gray-500 block mb-1">Issue Date</span>
                      <p className="text-sm font-sans text-charcoal-900 dark:text-gray-300">
                        {new Date(selectedCertificate.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                      </p>
                    </div>
                  )}
                </div>

                {selectedCertificate.credential_url && (
                  <a
                    href={selectedCertificate.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn flex items-center justify-between w-full p-4 border border-charcoal-900/20 dark:border-white/20 hover:border-accent-gold dark:hover:border-accent-gold transition-colors mt-8"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-charcoal-900 dark:text-white group-hover/btn:text-accent-gold transition-colors">
                      Verify Credential
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-charcoal-900 dark:text-white group-hover/btn:text-accent-gold transition-colors" />
                  </a>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certificates;

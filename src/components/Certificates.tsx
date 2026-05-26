import React, { useState } from 'react';
import { X, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCertificates } from '../hooks/cms/useCertificates';
import type { CMSCertificate } from '../types/cms';

const Certificates: React.FC = () => {
  const { data: certificates, isLoading } = useCertificates();
  const [selectedCertificate, setSelectedCertificate] = useState<CMSCertificate | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  return (
    <section id="certificates" className="py-32 overflow-hidden relative">
      
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-blue-500/5 dark:bg-accent-cyan/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-charcoal-900 dark:text-white mb-4">
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-accent-cyan dark:to-blue-400">Certifications</span>
          </h2>
          <p className="text-charcoal-600 dark:text-gray-400 max-w-xl mx-auto text-lg font-sans">
            Continuous learning and industry-recognized qualifications.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-6 py-8 rounded-3xl bg-charcoal-900/5 dark:bg-white/5 animate-pulse border border-charcoal-900/10 dark:border-white/5">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-charcoal-900/10 dark:bg-white/10 mb-6" />
                  <div className="h-4 bg-charcoal-900/10 dark:bg-white/10 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-charcoal-900/10 dark:bg-white/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(certificates ?? []).map((certificate, index) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
                className="group cursor-pointer rounded-3xl bg-white dark:bg-charcoal-800/50 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-white/10 hover:border-blue-500/30 dark:hover:border-accent-cyan/50"
                onClick={() => setSelectedCertificate(certificate)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-blue-100 dark:border-white/10">
                    {certificate.image_url && !imageErrors[certificate.id] ? (
                      <img
                        src={certificate.image_url}
                        alt={certificate.title}
                        className="w-10 h-10 object-cover rounded-full"
                        onError={() => setImageErrors(prev => ({ ...prev, [certificate.id]: true }))}
                      />
                    ) : (
                      <Award className="w-8 h-8 text-blue-500 dark:text-accent-cyan" />
                    )}
                  </div>
                  <h3 className="text-lg font-display font-bold text-charcoal-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-accent-cyan transition-colors duration-300">
                    {certificate.title}
                  </h3>
                  <p className="text-sm text-charcoal-600 dark:text-gray-400 font-sans">{certificate.issuer}</p>
                  {certificate.issue_date && (
                    <p className="text-xs text-charcoal-400 dark:text-gray-500 mt-2 font-medium">
                      {new Date(certificate.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </p>
                  )}
                  <div className="mt-6 text-xs font-bold text-blue-600 dark:text-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 uppercase tracking-widest">
                    View Credential
                  </div>
                </div>
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
            className="fixed inset-0 bg-charcoal-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCertificate(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-charcoal-900 border border-gray-200 dark:border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-white/10">
                <div>
                  <h3 className="text-xl font-display font-bold text-charcoal-900 dark:text-white">{selectedCertificate.title}</h3>
                  <p className="text-sm font-sans text-charcoal-600 dark:text-gray-400">{selectedCertificate.issuer}</p>
                </div>
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="p-2 hover:bg-charcoal-50 dark:hover:bg-white/10 rounded-full transition-colors text-charcoal-400 dark:text-gray-400 hover:text-charcoal-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto max-h-[calc(90vh-85px)] flex flex-col items-center">
                {selectedCertificate.image_url && !imageErrors[selectedCertificate.id] ? (
                  <img
                    src={selectedCertificate.image_url}
                    alt={selectedCertificate.title}
                    className="max-w-full max-h-[40vh] object-contain rounded-xl shadow-lg border border-gray-100 dark:border-white/5"
                    onError={() => setImageErrors(prev => ({ ...prev, [selectedCertificate.id]: true }))}
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-charcoal-50 dark:bg-charcoal-950 rounded-xl border border-gray-100 dark:border-white/5">
                    <Award className="w-16 h-16 text-blue-500/30 dark:text-accent-cyan/30" />
                  </div>
                )}
                
                <div className="mt-8 text-center">
                  <p className="text-charcoal-600 dark:text-gray-400 font-sans">
                    Issued by{' '}
                    <span className="font-bold text-charcoal-900 dark:text-white">{selectedCertificate.issuer}</span>
                  </p>
                  
                  {selectedCertificate.credential_url && (
                    <a
                      href={selectedCertificate.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-6 px-8 py-3 rounded-full bg-blue-50 dark:bg-accent-cyan/10 border border-blue-100 dark:border-accent-cyan/20 text-blue-600 dark:text-accent-cyan text-sm font-bold tracking-wide hover:bg-blue-100 dark:hover:bg-accent-cyan/20 hover:scale-105 transition-all"
                    >
                      Verify Credential →
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certificates;

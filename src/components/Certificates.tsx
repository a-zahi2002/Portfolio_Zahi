import React, { useState } from "react";
import { X, Award } from "lucide-react";
import { Certificate } from "../types";
import { motion, AnimatePresence } from "framer-motion";

const Certificates: React.FC = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const certificates: Certificate[] = [
    {
      name: "Web Design for Beginners",
      issuer: "Centre for Open & Distance Learning (CODL) - UoM",
      image: "/Portfolio_Zahi/assets/certificate1.jpg",
    },
    {
      name: "Front-end Web Development",
      issuer: "Centre for Open & Distance Learning (CODL) - UoM",
      image: "/Portfolio_Zahi/assets/certificate2.jpg",
    },
    {
      name: "Server-side Web Programming",
      issuer: "Centre for Open & Distance Learning (CODL) - UoM",
      image: "/Portfolio_Zahi/assets/certificate3.jpg",
    },
    {
      name: "Python for Beginners",
      issuer: "Centre for Open & Distance Learning (CODL) - UoM",
      image: "/Portfolio_Zahi/assets/certificate4.jpg",
    },
  ];

  return (
    <section id="certificates" className="py-20 bg-charcoal-900 overflow-hidden relative">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-16">
            Certifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificates.map((certificate, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer glass-panel p-6 hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-2 border border-white/5"
                onClick={() => setSelectedCertificate(certificate)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-accent-cyan/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ring-1 ring-accent-cyan/30">
                    <Award className="w-8 h-8 text-accent-cyan" />
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent-cyan transition-colors duration-300">
                    {certificate.name}
                  </h3>

                  <p className="text-sm text-gray-400">
                    {certificate.issuer}
                  </p>

                  <div className="mt-4 text-xs font-medium text-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 uppercase tracking-wider">
                    View Certificate
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCertificate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCertificate(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-charcoal-800 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">
                  {selectedCertificate.name}
                </h3>
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <img
                  src={selectedCertificate.image}
                  alt={selectedCertificate.name}
                  className="w-full rounded-lg shadow-lg"
                />
                <div className="mt-6 text-center">
                  <p className="text-gray-400">
                    Issued by{" "}
                    <span className="font-semibold text-accent-cyan">
                      {selectedCertificate.issuer}
                    </span>
                  </p>
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

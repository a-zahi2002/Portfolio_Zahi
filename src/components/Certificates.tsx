import React, { useState } from "react";
import { X, Award } from "lucide-react";
import { Certificate } from "../types";

const Certificates: React.FC = () => {
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);

  const certificates: Certificate[] = [
    {
      name: "Web Design for Beginners",
      issuer:
        "Centre for Open & Distance Learning(CODL) University of Moratuwa,Sri Lanka",
      image: "/Portfolio_Zahi/assets/certificate1.jpg",
    },
    {
      name: "Front-end Web Development",
      issuer:
        "Centre for Open & Distance Learning(CODL) University of Moratuwa,Sri Lanka",
      image: "/Portfolio_Zahi/assets/certificate2.jpg",
    },
    {
      name: "Server-side Web Programming",
      issuer:
        "Centre for Open & Distance Learning(CODL) University of Moratuwa,Sri Lanka",
      image: "/Portfolio_Zahi/assets/certificate3.jpg",
    },
    {
      name: "Python for Beginners",
      issuer:
        "Centre for Open & Distance Learning(CODL) University of Moratuwa,Sri Lanka",
      image: "/Portfolio_Zahi/assets/certificate4.jpg",
    },
  ];

  return (
    <section id="certificates" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Certificates
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificates.map((certificate, index) => (
              <div
                key={index}
                className="group cursor-pointer bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => setSelectedCertificate(certificate)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {certificate.name}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {certificate.issuer}
                  </p>

                  <div className="mt-3 text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to view
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedCertificate.name}
              </h3>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <img
                src={selectedCertificate.image}
                alt={selectedCertificate.name}
                className="w-full rounded-lg shadow-lg"
              />
              <div className="mt-4 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Issued by{" "}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {selectedCertificate.issuer}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Certificates;

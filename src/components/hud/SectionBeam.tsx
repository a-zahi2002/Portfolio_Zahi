// Cyber Terminal — Section Beam
// Horizontal light streak divider between sections.

import React from 'react';
import { motion } from 'framer-motion';

export const SectionBeam: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="w-full flex justify-center overflow-hidden"
    >
      <div className="section-beam w-full opacity-50" />
    </motion.div>
  );
};

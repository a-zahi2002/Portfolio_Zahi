// Cyber Terminal — Mute Toggle Button
// Speaker icon that toggles global audio. Used in Navbar.

import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from './AudioProvider';

const MuteToggle: React.FC = () => {
  const { isMuted, toggleMute } = useAudio();

  return (
    <motion.button
      onClick={toggleMute}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-accent-cyan dark:hover:text-accent-cyan transition-colors"
      aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      title={isMuted ? 'Enable sound effects' : 'Disable sound effects'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isMuted ? 0 : 360 }}
        transition={{ duration: 0.3 }}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </motion.div>
    </motion.button>
  );
};

export default MuteToggle;

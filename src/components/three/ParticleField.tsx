// Cyber Terminal — Particle Field
// Ambient floating sparkles around the 3D artifact. Fades with scroll.

import React from 'react';
import { Sparkles } from '@react-three/drei';

interface ParticleFieldProps {
  scrollProgress: number;
}

const ParticleField: React.FC<ParticleFieldProps> = ({ scrollProgress }) => {
  const opacity = Math.max(0, 1 - scrollProgress * 1.5);

  return (
    <Sparkles
      count={80}
      scale={6}
      size={1.5}
      speed={0.3}
      opacity={opacity * 0.6}
      color="#00f3ff"
    />
  );
};

export default ParticleField;

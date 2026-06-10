// Cyber Terminal — Hero 3D Scene
// R3F Canvas wrapper with CyberArtifact, ParticleField, and lighting.
// Receives scrollProgress (0-1) to transition from full hero → ambient background piece.

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import CyberArtifact from './CyberArtifact';
import ParticleField from './ParticleField';

interface HeroSceneProps {
  scrollProgress: number;
}

const HeroScene: React.FC<HeroSceneProps> = ({ scrollProgress }) => {
  // Transition canvas: full viewport → small ambient piece
  const scale = 1 - scrollProgress * 0.6;
  const opacity = Math.max(0.15, 1 - scrollProgress * 0.85);

  return (
    <div
      className="fixed inset-0 z-0 transition-opacity duration-300"
      style={{
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        pointerEvents: scrollProgress > 0.5 ? 'none' : 'auto',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Ambient lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} color="#00f3ff" />
          <directionalLight position={[-5, -3, 3]} intensity={0.3} color="#9d5fff" />
          <pointLight position={[0, 0, 3]} intensity={0.4} color="#00f3ff" distance={8} />

          {/* Main artifact */}
          <CyberArtifact scrollProgress={scrollProgress} />

          {/* Ambient particles */}
          <ParticleField scrollProgress={scrollProgress} />

          {/* Subtle ground shadow */}
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.15}
            scale={8}
            blur={2}
            far={4}
            color="#00f3ff"
          />

          {/* Environment for reflections (lightweight) */}
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene;

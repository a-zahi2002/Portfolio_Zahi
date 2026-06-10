// Cyber Terminal — 3D Cyber Artifact
// Interactive icosahedron with holographic wireframe that responds to mouse movement.

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface CyberArtifactProps {
  scrollProgress: number;
}

const CyberArtifact: React.FC<CyberArtifactProps> = ({ scrollProgress }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });

  // Track mouse for rotation
  React.useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseTarget.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseTarget.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  // Animated shader material color
  const gradientColors = useMemo(() => ({
    color1: new THREE.Color('#00f3ff'),
    color2: new THREE.Color('#9d5fff'),
  }), []);

  useFrame((_, delta) => {
    if (!meshRef.current || !wireRef.current) return;

    // Lerp mouse
    mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * 0.05;
    mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * 0.05;

    // Apply scroll-based scale and opacity
    const scale = THREE.MathUtils.lerp(1.2, 0.35, scrollProgress);
    const autoRotationSpeed = THREE.MathUtils.lerp(0.3, 0.1, scrollProgress);

    meshRef.current.scale.setScalar(scale);
    wireRef.current.scale.setScalar(scale);

    // Auto rotation + mouse influence
    meshRef.current.rotation.y += delta * autoRotationSpeed;
    meshRef.current.rotation.x += delta * autoRotationSpeed * 0.5;
    meshRef.current.rotation.x += (mouseCurrent.current.y * 0.3 - meshRef.current.rotation.x) * 0.02;
    meshRef.current.rotation.y += (mouseCurrent.current.x * 0.3 - meshRef.current.rotation.y) * 0.02;

    // Sync wireframe
    wireRef.current.rotation.copy(meshRef.current.rotation);

    // Float bob
    const bob = Math.sin(Date.now() * 0.001) * 0.1;
    meshRef.current.position.y = bob;
    wireRef.current.position.y = bob;
  });

  const opacity = THREE.MathUtils.lerp(1, 0.3, scrollProgress);

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group>
        {/* Solid body with distortion */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1, 1]} />
          <MeshDistortMaterial
            color={gradientColors.color1}
            emissive={gradientColors.color2}
            emissiveIntensity={0.15}
            roughness={0.2}
            metalness={0.8}
            distort={0.25}
            speed={2}
            transparent
            opacity={opacity * 0.6}
          />
        </mesh>

        {/* Wireframe overlay */}
        <mesh ref={wireRef}>
          <icosahedronGeometry args={[1.02, 1]} />
          <meshBasicMaterial
            color="#00f3ff"
            wireframe
            transparent
            opacity={opacity * 0.35}
          />
        </mesh>
      </group>
    </Float>
  );
};

export default CyberArtifact;

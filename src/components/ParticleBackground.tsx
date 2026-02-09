import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = (props: any) => {
  const ref = useRef<THREE.Points>(null!);
  
  // Generate random points in a sphere distribution
  const sphere = useMemo(() => {
    // 3000 particles
    const count = 3000;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        // Spherical distribution
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        // Radius between 1.2 and 2.5 for depth
        const r = 1.2 + Math.random() * 1.3;
        
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      // Automatic rotation
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
      
      // Subtle mouse interaction
      // We lerp current rotation towards mouse position for a "look at" feel
      const x = state.mouse.y * 0.2;
      const y = state.mouse.x * 0.2;
      
      ref.current.rotation.x += (x - ref.current.rotation.x) * 0.05;
      ref.current.rotation.y += (y - ref.current.rotation.y) * 0.05;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#00f3ff" // Electric Cyan
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 z-0 bg-charcoal-950">
      <Canvas camera={{ position: [0, 0, 3] }} dpr={[1, 2]}>
          <ParticleField />
      </Canvas>
    </div>
  );
};

export default ParticleBackground;

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars, ContactShadows, SpotLight } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { GeometricTree, Star } from './TreeParts';
import { Snow } from './Snow';
import { TreeConfig } from '../types';

interface SceneProps {
  config: TreeConfig;
  onTreeClick?: () => void;
}

export const Scene: React.FC<SceneProps> = ({ config, onTreeClick }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += config.rotationSpeed * delta;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1, 13]} fov={50} />
      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 3} 
        maxPolarAngle={Math.PI / 1.9}
        minDistance={8}
        maxDistance={20}
      />

      {/* Lighting - Trump style: Warm, Gold, Dramatic */}
      <ambientLight intensity={0.2} color="#000500" />
      
      <SpotLight 
        position={[8, 12, 8]} 
        angle={0.5} 
        penumbra={0.8} 
        intensity={200} 
        castShadow 
        color="#fff5e0"
        distance={40}
      />
      
      {/* Fill lights */}
      <pointLight position={[-8, 6, -5]} intensity={50} color={config.lightColor} distance={20} />
      <pointLight position={[5, -2, 5]} intensity={20} color="#ffaa00" distance={10} />

      <Environment preset="city" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />

      <group ref={groupRef} position={[0, -2.5, 0]} onClick={(e) => { e.stopPropagation(); onTreeClick?.(); }}>
        <GeometricTree primaryColor={config.ornamentColor} />
        <Star />
      </group>

      {config.showSnow && <Snow count={600} />}

      <ContactShadows opacity={0.7} scale={25} blur={2} far={4} color="#000000" />

      {/* Cinematic Effects */}
      <EffectComposer disableNormalPass>
        <Bloom 
            luminanceThreshold={1} 
            mipmapBlur 
            intensity={1.5} 
            radius={0.4}
        />
        <Vignette eskil={false} offset={0.1} darkness={1.0} />
        <Noise opacity={0.02} />
      </EffectComposer>
    </>
  );
};

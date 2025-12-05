import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Snow: React.FC<{ count?: number }> = ({ count = 400 }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = Math.random() * 20 - 5;
      const z = (Math.random() - 0.5) * 20;
      const speed = 0.02 + Math.random() * 0.05;
      const wobble = Math.random() * Math.PI * 2;
      temp.push({ x, y, z, speed, wobble, initialY: y });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!mesh.current) return;
    
    particles.forEach((particle, i) => {
      // Update position
      particle.y -= particle.speed;
      particle.x += Math.sin(state.clock.elapsedTime + particle.wobble) * 0.005;
      
      // Reset if below floor
      if (particle.y < -6) {
        particle.y = 15;
        particle.x = (Math.random() - 0.5) * 20;
        particle.z = (Math.random() - 0.5) * 20;
      }

      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.scale.setScalar(0.08); // Tiny flakes
      dummy.rotation.set(state.clock.elapsedTime, state.clock.elapsedTime, 0);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
    </instancedMesh>
  );
};

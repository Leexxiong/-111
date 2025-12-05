import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Float, Instance, Instances } from '@react-three/drei';

// Materials for instances
const materials = {
  gold: new THREE.Color("#FFD700"),
  red: new THREE.Color("#C41E3A"),
  green: new THREE.Color("#0f2f20"), // Deep dark emerald
  silver: new THREE.Color("#E0E0E0"),
  black: new THREE.Color("#111111"),
};

interface GeometricTreeProps {
  primaryColor: 'gold' | 'red' | 'silver';
}

export const GeometricTree: React.FC<GeometricTreeProps> = ({ primaryColor }) => {
  const { boxes, spheres, diamonds } = useMemo(() => {
    const boxes = [];
    const spheres = [];
    const diamonds = [];
    
    const count = 750; 
    const height = 10;
    const maxRadius = 4.0;
    
    for (let i = 0; i < count; i++) {
      // Cone distribution: y from -3.5 to 6.5
      const y = (Math.random() * height) - 3.5; 
      const hPercent = (y + 3.5) / height; // 0 (bottom) to 1 (top)
      
      // Radius at this height
      const rAtH = maxRadius * (1 - hPercent);
      
      // Distribution: More density towards the surface but filling the volume
      // sqrt(random) gives uniform distribution in a circle
      const r = rAtH * Math.sqrt(0.2 + 0.8 * Math.random()); 
      const theta = Math.random() * Math.PI * 2;
      
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      
      const pos: [number, number, number] = [x, y, z];
      
      // Scale varies - slightly larger at bottom? random mix.
      const scale = 0.15 + Math.random() * 0.35;
      
      // Determine color based on primaryColor prop
      let color;
      const rand = Math.random();
      
      if (primaryColor === 'gold') {
        if (rand < 0.6) color = materials.gold;
        else if (rand < 0.8) color = materials.green;
        else if (rand < 0.95) color = materials.red;
        else color = materials.black;
      } else if (primaryColor === 'red') {
        if (rand < 0.6) color = materials.red;
        else if (rand < 0.8) color = materials.gold;
        else if (rand < 0.95) color = materials.green;
        else color = materials.black;
      } else { // silver
        if (rand < 0.6) color = materials.silver;
        else if (rand < 0.8) color = materials.gold;
        else if (rand < 0.95) color = materials.green;
        else color = materials.black;
      }
      
      const item = { 
        position: pos, 
        scale, 
        color, 
        rotation: [Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI] as [number, number, number] 
      };
      
      const shapeRand = Math.random();
      if (shapeRand < 0.45) boxes.push(item);
      else if (shapeRand < 0.75) spheres.push(item);
      else diamonds.push(item);
    }
    
    return { boxes, spheres, diamonds };
  }, [primaryColor]);

  return (
    <group position={[0, -1.5, 0]}>
        {/* Core Trunk for density (optional, invisible mostly) */}
        <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.2, 0.8, 8, 8]} />
            <meshStandardMaterial color="#051005" roughness={0.9} />
        </mesh>

        <Instances range={boxes.length}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial roughness={0.2} metalness={0.8} />
            {boxes.map((d, i) => (
                <Instance key={i} position={d.position} scale={d.scale} rotation={d.rotation} color={d.color} />
            ))}
        </Instances>
        
        <Instances range={spheres.length}>
            <icosahedronGeometry args={[0.6, 1]} />
            <meshStandardMaterial roughness={0.1} metalness={0.9} />
            {spheres.map((d, i) => (
                <Instance key={i} position={d.position} scale={d.scale} color={d.color} />
            ))}
        </Instances>
        
        <Instances range={diamonds.length}>
            <octahedronGeometry args={[0.7]} />
            <meshStandardMaterial roughness={0.1} metalness={1.0} emissive="#443300" emissiveIntensity={0.2} />
            {diamonds.map((d, i) => (
                <Instance key={i} position={d.position} scale={d.scale} rotation={d.rotation} color={d.color} />
            ))}
        </Instances>
    </group>
  );
};

export const Star: React.FC = () => {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={[0, 5.2, 0]}>
        <mesh castShadow>
          <icosahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial 
            color="#FFD700" 
            emissive="#FFD700" 
            emissiveIntensity={2} 
            toneMapped={false} 
            roughness={0}
            metalness={1}
          />
        </mesh>
        {[0, 1, 2].map(i => (
            <mesh key={i} rotation={[0, 0, i * Math.PI / 3]}>
                <boxGeometry args={[0.2, 3, 0.2]} />
                <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={1} />
            </mesh>
        ))}
        <pointLight color="#ffaa00" intensity={2} distance={5} decay={2} />
      </group>
    </Float>
  );
};

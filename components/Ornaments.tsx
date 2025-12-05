import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Instance, Instances } from '@react-three/drei';

interface OrnamentsProps {
  count: number;
  color: string;
}

export const Ornaments: React.FC<OrnamentsProps> = ({ count = 50, color }) => {
  const data = useMemo(() => {
    const temp = [];
    // Tree approximate shape logic: A cone from y=-3 to y=4.5, radius goes from ~3.5 to 0.
    const height = 7.5;
    const baseY = -3.0;
    const maxRadius = 3.2;

    for (let i = 0; i < count; i++) {
      // Random height along the tree
      const y = Math.random() * height + baseY; // -3 to 4.5
      
      // Calculate max radius at this height (linear interpolation)
      // Top (y=4.5) -> r=0. Bottom (y=-3) -> r=maxRadius
      const normalizedH = (y - baseY) / height; // 0 to 1
      const rAtHeight = maxRadius * (1 - normalizedH);
      
      // Place at radius, random angle
      const theta = Math.random() * Math.PI * 2;
      const r = rAtHeight * (0.8 + Math.random() * 0.3); // Slight variation in depth
      
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      
      const scale = 0.2 + Math.random() * 0.15;
      
      temp.push({ position: [x, y, z] as [number, number, number], scale });
    }
    return temp;
  }, [count]);

  const materialColor = color === 'gold' ? '#FFD700' : color === 'red' ? '#800020' : '#C0C0C0';
  
  return (
    <Instances range={count}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        color={materialColor} 
        metalness={1} 
        roughness={0.1} 
        envMapIntensity={2}
      />
      {data.map((props, i) => (
        <Instance key={i} position={props.position} scale={[props.scale, props.scale, props.scale]} />
      ))}
    </Instances>
  );
};

export const Garland: React.FC = () => {
    // A simple spiral tube logic
    const curve = useMemo(() => {
        const points = [];
        const height = 8;
        const loops = 4.5;
        const radiusBase = 3.5;
        for (let t = 0; t <= 1; t += 0.005) {
            const y = -3 + t * height;
            const r = radiusBase * (1 - t);
            const angle = t * Math.PI * 2 * loops;
            points.push(new THREE.Vector3(
                Math.cos(angle) * r,
                y,
                Math.sin(angle) * r
            ));
        }
        return new THREE.CatmullRomCurve3(points);
    }, []);

    return (
        <mesh position={[0, 0, 0]}>
            <tubeGeometry args={[curve, 128, 0.12, 8, false]} />
            <meshStandardMaterial 
                color="#C5B358" 
                metalness={1} 
                roughness={0.2} 
                emissive="#C5B358"
                emissiveIntensity={0.2}
            />
        </mesh>
    );
};

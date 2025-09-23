import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const LoadingSpinner = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.02;
      meshRef.current.rotation.y += 0.03;
      meshRef.current.rotation.z += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1, 0]} />
      <meshPhongMaterial 
        color="#4ECDC4" 
        emissive="#4ECDC4"
        emissiveIntensity={0.2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

export const Loading3D: React.FC = () => {
  return (
    <div className="w-full h-64 flex items-center justify-center">
      <div className="w-32 h-32">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <LoadingSpinner />
        </Canvas>
      </div>
      <div className="ml-4">
        <div className="text-lg font-semibold text-primary">Loading 3D Experience...</div>
        <div className="text-sm text-muted-foreground">Preparing your immersive journey</div>
      </div>
    </div>
  );
};
import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const Traveler = ({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
      groupRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;
    }
  });

  // Optimize geometry creation with better memory management
  const [bodyGeometry, headGeometry, backpackGeometry] = useMemo(() => [
    new THREE.CylinderGeometry(0.3, 0.3, 1.2, 6),
    new THREE.SphereGeometry(0.25, 6, 6), 
    new THREE.BoxGeometry(0.4, 0.6, 0.2)
  ], []);

  const [bodyMaterial, headMaterial, backpackMaterial] = useMemo(() => [
    new THREE.MeshLambertMaterial({ color: color }),
    new THREE.MeshLambertMaterial({ color: '#FFE0BD' }),
    new THREE.MeshLambertMaterial({ color: '#8B4513' })
  ], [color]);

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
        {/* Body */}
        <mesh geometry={bodyGeometry} material={bodyMaterial} position={[0, 0.6, 0]} />
        {/* Head */}
        <mesh geometry={headGeometry} material={headMaterial} position={[0, 1.4, 0]} />
        {/* Backpack */}
        <mesh geometry={backpackGeometry} material={backpackMaterial} position={[0, 0.8, -0.3]} />
      </group>
    </Float>
  );
};

const WorldMap = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -2, -10]} scale={[8, 8, 8]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhongMaterial 
        color="#1a365d" 
        transparent 
        opacity={0.3}
        wireframe={true}
      />
    </mesh>
  );
};

const FloatingIcons = () => {
  const iconsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (iconsRef.current) {
      iconsRef.current.rotation.z += 0.005;
      iconsRef.current.children.forEach((child, index) => {
        child.position.y = Math.sin(state.clock.elapsedTime + index) * 0.3;
      });
    }
  });

  return (
    <group ref={iconsRef} position={[0, 0, -5]}>
      {/* Floating geometric shapes representing icons */}
      <mesh position={[-8, 2, 0]}>
        <octahedronGeometry args={[0.3]} />
        <meshPhongMaterial color="#FF6B35" />
      </mesh>
      <mesh position={[8, -1, 0]}>
        <dodecahedronGeometry args={[0.25]} />
        <meshPhongMaterial color="#4ECDC4" />
      </mesh>
      <mesh position={[-6, -3, 0]}>
        <icosahedronGeometry args={[0.2]} />
        <meshPhongMaterial color="#45B7D1" />
      </mesh>
      <mesh position={[6, 3, 0]}>
        <tetrahedronGeometry args={[0.35]} />
        <meshPhongMaterial color="#FFA07A" />
      </mesh>
    </group>
  );
};

export const FloatingTravelers: React.FC<{ mousePosition: { x: number; y: number } }> = ({ mousePosition }) => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        gl={{ 
          antialias: false, 
          alpha: true, 
          powerPreference: "high-performance",
          preserveDrawingBuffer: false
        }}
        dpr={[1, 1.5]}
        performance={{ min: 0.8 }}
      >
        <PerspectiveCamera makeDefault position={[0, 2, 8]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1}
          color="#FFE0BD"
        />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4ECDC4" />
        
        {/* Suspense wrapper for better loading performance */}
        <Suspense fallback={null}>
          {/* Environment */}
          <Environment preset="sunset" />
          
          {/* Background elements */}
          <WorldMap />
          <FloatingIcons />
          
          {/* Travelers */}
          <Traveler position={[-4, 0, 2]} color="#FF6B35" scale={0.8} />
          <Traveler position={[3, 0.5, 1]} color="#4ECDC4" scale={1.0} />
          <Traveler position={[-1, -0.5, 3]} color="#45B7D1" scale={0.9} />
          <Traveler position={[6, 1, 0]} color="#FFA07A" scale={0.7} />
          <Traveler position={[-6, -1, 1]} color="#98D8C8" scale={1.1} />
        </Suspense>
        
        {/* Parallax effect based on mouse position */}
        <group 
          rotation={[
            mousePosition.y * 0.1, 
            mousePosition.x * 0.1, 
            0
          ]}
        >
          {/* Additional floating elements for depth */}
          <mesh position={[0, 0, -8]}>
            <ringGeometry args={[2, 2.5, 32]} />
            <meshBasicMaterial color="#4ECDC4" transparent opacity={0.1} />
          </mesh>
        </group>
      </Canvas>
    </div>
  );
};
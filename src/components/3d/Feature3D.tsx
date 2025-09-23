import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const Feature3DCard = ({ 
  position, 
  title, 
  description, 
  icon, 
  color,
  index 
}: { 
  position: [number, number, number];
  title: string;
  description: string;
  icon: string;
  color: string;
  index: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.y = Math.sin(time + index) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(time * 2 + index) * 0.1;
    }
  });

  return (
    <Float speed={1 + index * 0.2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={position}>
        <mesh 
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? [1.05, 1.05, 1.05] : [1, 1, 1]}
        >
          <boxGeometry args={[3, 4, 0.5]} />
          <meshPhongMaterial 
            color={color} 
            transparent 
            opacity={0.9}
            emissive={hovered ? color : '#000000'}
            emissiveIntensity={hovered ? 0.1 : 0}
          />
        </mesh>
        
        {/* Icon */}
        <Text
          position={[0, 1, 0.3]}
          fontSize={1}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {icon}
        </Text>
        
        {/* Title */}
        <Text
          position={[0, 0, 0.3]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          maxWidth={2.5}
        >
          {title}
        </Text>
        
        {/* Description */}
        <Text
          position={[0, -0.8, 0.3]}
          fontSize={0.15}
          color="rgba(255,255,255,0.8)"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.2}
          textAlign="center"
        >
          {description}
        </Text>
        
        {/* Glow effect when hovered */}
        {hovered && (
          <mesh position={[0, 0, -0.1]}>
            <boxGeometry args={[3.2, 4.2, 0.1]} />
            <meshBasicMaterial color={color} transparent opacity={0.2} />
          </mesh>
        )}
      </group>
    </Float>
  );
};

export const Feature3D: React.FC<{ 
  features: Array<{
    title: string;
    description: string;
    icon: string;
    color: string;
  }>;
}> = ({ features }) => {
  return (
    <div className="h-[600px] w-full relative">
      <Canvas
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: "high-performance"
        }}
        dpr={[1, 1.5]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 12]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1}
          color="#ffffff"
        />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#4ECDC4" />
        
        {/* Feature Cards arranged in a circle */}
        {features.map((feature, index) => {
          const angle = (index / features.length) * Math.PI * 2;
          const radius = 4;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          
          return (
            <Feature3DCard
              key={index}
              position={[x, 0, z]}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              color={feature.color}
              index={index}
            />
          );
        })}
        
        {/* Central connecting element */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshPhongMaterial 
            color="#4ECDC4" 
            transparent 
            opacity={0.7}
            emissive="#4ECDC4"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Connecting lines */}
        {features.map((_, index) => {
          const angle = (index / features.length) * Math.PI * 2;
          const radius = 4;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          
          const points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(x, 0, z)
          ];
          
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          
          return (
            <primitive key={`line-${index}`} object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: '#4ECDC4', transparent: true, opacity: 0.3 }))} />
          );
        })}
      </Canvas>
    </div>
  );
};
import React, { useRef, useMemo, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Float, Environment, Text, OrbitControls, Stars, Cloud } from '@react-three/drei';
import * as THREE from 'three';
import EarthGlobe from './EarthGlobe';

const InteractiveTraveler = ({ 
  position, 
  color, 
  scale = 1, 
  onClick,
  isHovered 
}: { 
  position: [number, number, number]; 
  color: string; 
  scale?: number;
  onClick?: () => void;
  isHovered?: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [clicked, setClicked] = useState(false);
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.rotation.y += 0.01;
      groupRef.current.position.x = position[0] + Math.sin(time + position[0]) * 0.5;
      groupRef.current.position.y = position[1] + Math.sin(time * 2 + position[1]) * 0.2;
      
      // Scale effect on hover/click
      const targetScale = clicked ? scale * 1.3 : isHovered ? scale * 1.1 : scale;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const [bodyGeometry, headGeometry, backpackGeometry] = useMemo(() => [
    new THREE.CylinderGeometry(0.3, 0.3, 1.2, 8),
    new THREE.SphereGeometry(0.25, 8, 8), 
    new THREE.BoxGeometry(0.4, 0.6, 0.2)
  ], []);

  const [bodyMaterial, headMaterial, backpackMaterial] = useMemo(() => [
    new THREE.MeshPhongMaterial({ color: color }),
    new THREE.MeshPhongMaterial({ color: '#FFE0BD' }),
    new THREE.MeshPhongMaterial({ color: '#8B4513' })
  ], [color]);

  const handleClick = () => {
    setClicked(!clicked);
    onClick?.();
  };

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group 
        ref={groupRef} 
        position={position} 
        onClick={handleClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'default'}
      >
        {/* Body */}
        <mesh geometry={bodyGeometry} material={bodyMaterial} position={[0, 0.6, 0]} castShadow />
        {/* Head */}
        <mesh geometry={headGeometry} material={headMaterial} position={[0, 1.4, 0]} castShadow />
        {/* Backpack */}
        <mesh geometry={backpackGeometry} material={backpackMaterial} position={[0, 0.8, -0.3]} castShadow />
        
        {/* Safety aura when clicked */}
        {clicked && (
          <mesh position={[0, 0.8, 0]}>
            <ringGeometry args={[1.5, 2, 32]} />
            <meshBasicMaterial color="#4ECDC4" transparent opacity={0.3} />
          </mesh>
        )}
      </group>
    </Float>
  );
};

const FloatingFeatureCard = ({ 
  position, 
  title, 
  icon,
  color 
}: { 
  position: [number, number, number]; 
  title: string;
  icon: string;
  color: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group position={position}>
        <mesh 
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
        >
          <boxGeometry args={[2, 2.5, 0.3]} />
          <meshPhongMaterial 
            color={color} 
            transparent 
            opacity={0.8}
            emissive={hovered ? color : '#000000'}
            emissiveIntensity={hovered ? 0.2 : 0}
          />
        </mesh>
        
        <Text
          position={[0, 0.5, 0.2]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {title}
        </Text>
        
        <Text
          position={[0, -0.2, 0.2]}
          fontSize={0.8}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {icon}
        </Text>
      </group>
    </Float>
  );
};


const FloatingIcons = () => {
  const iconsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (iconsRef.current) {
      iconsRef.current.rotation.z += 0.003;
      iconsRef.current.children.forEach((child, index) => {
        child.position.y = Math.sin(state.clock.elapsedTime + index) * 0.5;
        child.rotation.x += 0.01;
      });
    }
  });

  const icons = [
    { position: [-10, 3, -2], color: "#FF6B35", size: 0.4 },
    { position: [10, -2, -1], color: "#4ECDC4", size: 0.3 },
    { position: [-8, -4, 0], color: "#45B7D1", size: 0.25 },
    { position: [8, 4, -3], color: "#FFA07A", size: 0.35 },
    { position: [-12, 0, -4], color: "#98D8C8", size: 0.3 },
    { position: [12, 1, -2], color: "#FFD700", size: 0.4 }
  ];

  return (
    <group ref={iconsRef} position={[0, 0, -5]}>
      {icons.map((icon, index) => (
        <mesh key={index} position={icon.position as [number, number, number]}>
          <octahedronGeometry args={[icon.size]} />
          <meshPhongMaterial 
            color={icon.color} 
            emissive={icon.color}
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
    </group>
  );
};

const CameraController = ({ mousePosition }: { mousePosition: { x: number; y: number } }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    camera.position.x += (mousePosition.x * 2 - camera.position.x) * 0.05;
    camera.position.y += (-mousePosition.y * 2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  
  return null;
};

export const Interactive3DWorld: React.FC<{ 
  mousePosition: { x: number; y: number };
  showFeatures?: boolean;
}> = ({ mousePosition, showFeatures = false }) => {
  const [selectedTraveler, setSelectedTraveler] = useState<number | null>(null);

  const handleTravelerClick = (index: number) => {
    setSelectedTraveler(selectedTraveler === index ? null : index);
  };

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: "high-performance",
          preserveDrawingBuffer: false
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        shadows
      >
        <PerspectiveCamera makeDefault position={[0, 2, 10]} />
        
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1}
          color="#FFE0BD"
          castShadow
        />
        <pointLight position={[-10, -10, -5]} intensity={0.6} color="#4ECDC4" />
        
        <Suspense fallback={null}>
            <Environment preset="city" />
            <Stars radius={300} depth={60} count={10000} factor={4} saturation={0} fade speed={0.5} />
          
          {/* Background elements */}
          <EarthGlobe mousePosition={mousePosition} />
          <FloatingIcons />
          
          {/* Floating clouds for atmosphere - reduced opacity */}
          <Cloud opacity={0.05} speed={0.4} segments={20} position={[5, 2, -8]} />
          <Cloud opacity={0.03} speed={0.2} segments={25} position={[-8, -3, -12]} />
          
          {/* Interactive Travelers */}
          <InteractiveTraveler 
            position={[-5, 0, 3]} 
            color="#FF6B35" 
            scale={0.9} 
            onClick={() => handleTravelerClick(0)}
            isHovered={selectedTraveler === 0}
          />
          <InteractiveTraveler 
            position={[4, 1, 2]} 
            color="#4ECDC4" 
            scale={1.1} 
            onClick={() => handleTravelerClick(1)}
            isHovered={selectedTraveler === 1}
          />
          <InteractiveTraveler 
            position={[-2, -1, 4]} 
            color="#45B7D1" 
            scale={0.8} 
            onClick={() => handleTravelerClick(2)}
            isHovered={selectedTraveler === 2}
          />
          <InteractiveTraveler 
            position={[7, 2, 1]} 
            color="#FFA07A" 
            scale={0.7} 
            onClick={() => handleTravelerClick(3)}
            isHovered={selectedTraveler === 3}
          />
          <InteractiveTraveler 
            position={[-7, -2, 2]} 
            color="#98D8C8" 
            scale={1.0} 
            onClick={() => handleTravelerClick(4)}
            isHovered={selectedTraveler === 4}
          />
          
          {/* Feature Cards (when showFeatures is true) */}
          {showFeatures && (
            <>
              <FloatingFeatureCard
                position={[-6, 3, 0]}
                title="Digital ID"
                icon="🆔"
                color="#FF6B35"
              />
              <FloatingFeatureCard
                position={[6, 2, 0]}
                title="AI Detection"
                icon="🤖"
                color="#4ECDC4"
              />
              <FloatingFeatureCard
                position={[-4, -2, 2]}
                title="Geo-Fencing"
                icon="📍"
                color="#45B7D1"
              />
              <FloatingFeatureCard
                position={[4, -3, 1]}
                title="SOS Alerts"
                icon="🚨"
                color="#FFA07A"
              />
            </>
          )}
        </Suspense>
        
        {/* Camera Controls */}
        <CameraController mousePosition={mousePosition} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          enableRotate={false}
          autoRotate={true}
          autoRotateSpeed={0.2}
        />
        
        {/* Depth particles - reduced opacity for better visibility */}
        <group rotation={[mousePosition.y * 0.05, mousePosition.x * 0.05, 0]}>
          <mesh position={[0, 0, -15]}>
            <ringGeometry args={[8, 12, 32]} />
            <meshBasicMaterial color="#4ECDC4" transparent opacity={0.02} />
          </mesh>
          <mesh position={[0, 0, -20]}>
            <ringGeometry args={[12, 16, 32]} />
            <meshBasicMaterial color="#45B7D1" transparent opacity={0.01} />
          </mesh>
        </group>
      </Canvas>
    </div>
  );
};
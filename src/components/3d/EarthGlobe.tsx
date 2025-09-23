import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

interface EarthGlobeProps {
  mousePosition?: { x: number; y: number };
}

const EarthGlobe: React.FC<EarthGlobeProps> = ({ mousePosition = { x: 0, y: 0 } }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Load Earth texture with fallback
  const earthTexture = useLoader(
    THREE.TextureLoader, 
    'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'
  );
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Base rotation plus mouse influence (matching the HTML version)
      meshRef.current.rotation.y += 0.005 + mousePosition.x * 0.01;
      meshRef.current.rotation.x += mousePosition.y * 0.005;
    }
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  // Create earth geometry and materials
  const earthGeometry = useMemo(() => new THREE.SphereGeometry(3, 64, 64), []);
  
  const earthMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    map: earthTexture,
  }), [earthTexture]);

  const glowMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#4A90E2',
    transparent: true,
    opacity: 0.1,
    side: THREE.BackSide,
  }), []);

  return (
    <Float speed={0.5} rotationIntensity={0.02} floatIntensity={0.05}>
      <group ref={groupRef} position={[0, -5, -15]}>
        {/* Main Earth sphere with realistic texture */}
        <mesh ref={meshRef} geometry={earthGeometry} material={earthMaterial} castShadow receiveShadow />
        
        {/* Subtle glow effect */}
        <mesh geometry={earthGeometry} material={glowMaterial} scale={[1.1, 1.1, 1.1]} />
        
        {/* GoSecure branding floating around globe */}
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <Text
            position={[0, 5.5, 0]}
            fontSize={0.9}
            color="#60a5fa"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
            outlineWidth={0.02}
            outlineColor="#1e293b"
          >
            GoSecure
          </Text>
        </Float>
        
        <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.15}>
          <Text
            position={[0, -6, 0]}
            fontSize={0.35}
            color="#3b82f6"
            anchorX="center"
            anchorY="middle"
            fontWeight="normal"
            outlineWidth={0.01}
            outlineColor="#1e293b"
          >
            AI-Powered Travel Security
          </Text>
        </Float>
      </group>
    </Float>
  );
};

export default EarthGlobe;
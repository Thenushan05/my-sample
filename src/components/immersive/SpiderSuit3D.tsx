import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const LowPolySpiderSuit = () => {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.7; // Rotate slowly
    }
  });

  return (
    <group ref={group} position={[0, -1, 0]}>
      {/* Hologram glitch/scan effect material helper */}
      
      {/* HEAD (Red) */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.8} emissive="#ef4444" emissiveIntensity={0.2} wireframe={true} />
      </mesh>
      
      {/* EYES (White with Black Trim) */}
      <mesh position={[-0.12, 1.85, 0.28]} rotation={[0, -0.3, 0.2]}>
        <planeGeometry args={[0.15, 0.1]} />
        <meshBasicMaterial color="cyan" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.12, 1.85, 0.28]} rotation={[0, 0.3, -0.2]}>
        <planeGeometry args={[0.15, 0.1]} />
        <meshBasicMaterial color="cyan" side={THREE.DoubleSide} />
      </mesh>

      {/* TORSO (Red/Blue) */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[0.7, 1.0, 0.35]} />
        <meshStandardMaterial color="#0ea5e9" roughness={0.2} metalness={0.8} emissive="#0ea5e9" emissiveIntensity={0.2} wireframe={true} />
      </mesh>
      {/* Front Red Torso Patch */}
      <mesh position={[0, 1.0, 0.18]}>
        <boxGeometry args={[0.4, 1.0, 0.05]} />
        <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.8} emissive="#ef4444" emissiveIntensity={0.2} wireframe={true} />
      </mesh>
      {/* Back Red Torso Patch */}
      <mesh position={[0, 1.0, -0.18]}>
        <boxGeometry args={[0.4, 1.0, 0.05]} />
        <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.8} emissive="#ef4444" emissiveIntensity={0.2} wireframe={true} />
      </mesh>

      {/* ARMS (Red/Blue) */}
      {/* Left Arm Upper */}
      <mesh position={[-0.45, 1.25, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 16]} />
        <meshStandardMaterial color="#0ea5e9" roughness={0.2} metalness={0.8} emissive="#0ea5e9" emissiveIntensity={0.2} wireframe={true} />
      </mesh>
      {/* Right Arm Upper */}
      <mesh position={[0.45, 1.25, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 16]} />
        <meshStandardMaterial color="#0ea5e9" roughness={0.2} metalness={0.8} emissive="#0ea5e9" emissiveIntensity={0.2} wireframe={true} />
      </mesh>
      {/* Left Arm Lower (Red) */}
      <mesh position={[-0.55, 0.8, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.1, 0.08, 0.5, 16]} />
        <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.8} emissive="#ef4444" emissiveIntensity={0.2} wireframe={true} />
      </mesh>
      {/* Right Arm Lower (Red) */}
      <mesh position={[0.55, 0.8, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.1, 0.08, 0.5, 16]} />
        <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.8} emissive="#ef4444" emissiveIntensity={0.2} wireframe={true} />
      </mesh>

      {/* LEGS (Red/Blue) */}
      {/* Left Leg Upper (Blue) */}
      <mesh position={[-0.2, 0.25, 0]}>
        <cylinderGeometry args={[0.15, 0.12, 0.5, 16]} />
        <meshStandardMaterial color="#0ea5e9" roughness={0.2} metalness={0.8} emissive="#0ea5e9" emissiveIntensity={0.2} wireframe={true} />
      </mesh>
      {/* Right Leg Upper (Blue) */}
      <mesh position={[0.2, 0.25, 0]}>
        <cylinderGeometry args={[0.15, 0.12, 0.5, 16]} />
        <meshStandardMaterial color="#0ea5e9" roughness={0.2} metalness={0.8} emissive="#0ea5e9" emissiveIntensity={0.2} wireframe={true} />
      </mesh>
      {/* Left Leg Lower (Red Boot) */}
      <mesh position={[-0.2, -0.25, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.5, 16]} />
        <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.8} emissive="#ef4444" emissiveIntensity={0.2} wireframe={true} />
      </mesh>
      {/* Right Leg Lower (Red Boot) */}
      <mesh position={[0.2, -0.25, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.5, 16]} />
        <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.8} emissive="#ef4444" emissiveIntensity={0.2} wireframe={true} />
      </mesh>
    </group>
  );
};

export const SpiderSuit3D = () => {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        {/* Hologram Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={2} color="#ef4444" />
        <spotLight position={[-5, 5, -5]} angle={0.15} penumbra={1} intensity={4} color="#06b6d4" />
        <pointLight position={[0, -2, 0]} intensity={2} color="#ef4444" />
        
        <LowPolySpiderSuit />
        
        {/* Holographic glowing ground shadow */}
        <ContactShadows position={[0, -1.6, 0]} opacity={0.8} scale={10} blur={2} far={4} color="#06b6d4" />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

/* eslint-disable react/no-unknown-property */
import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LoaderSceneProps {
  progress: number; // 0 - 100
  isLoaded: boolean;
}

const PARTICLE_COUNT = 700;

/* Rotating holographic data-core: nested wireframe shells + glowing center,
   spins faster and flares as `progress` climbs. */
const DataCore: React.FC<{ progress: number; isLoaded: boolean }> = ({
  progress,
  isLoaded,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const speed = 0.25 + (progress / 100) * 1.6;

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * speed;
      groupRef.current.rotation.x = Math.sin(t * 0.35) * 0.18;
    }
    if (shellRef.current) {
      shellRef.current.rotation.y -= delta * speed * 0.6;
      shellRef.current.rotation.z += delta * speed * 0.35;
    }
    if (outerRef.current) {
      outerRef.current.rotation.x += delta * speed * 0.2;
      outerRef.current.rotation.y += delta * speed * 0.45;
    }
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * (2 + progress / 40)) * 0.06;
      const grow = 0.85 + (progress / 100) * 0.55;
      const finale = isLoaded ? 1.7 : 1;
      coreRef.current.scale.setScalar(grow * pulse * finale);
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = isLoaded
        ? 0.9
        : 0.35 + Math.sin(t * 2.4) * 0.15 + (progress / 100) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.9} />
      </mesh>
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[2.0, 0]} />
        <meshBasicMaterial color="#5eead4" wireframe transparent opacity={0.3} />
      </mesh>
      <mesh ref={outerRef}>
        <torusGeometry args={[2.65, 0.012, 8, 64]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.4} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#c4ffe0" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

/* Data-particle field: a spherical cloud of drifting points that spiral
   inward and get "absorbed" into the core as loading approaches 100%. */
const DataParticles: React.FC<{ progress: number }> = ({ progress }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, baseRadius, speed, drift } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const baseRadius = new Float32Array(PARTICLE_COUNT);
    const speed = new Float32Array(PARTICLE_COUNT);
    const drift = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 2.8 + Math.random() * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      baseRadius[i] = radius;
      speed[i] = 0.15 + Math.random() * 0.5;
      drift[i] = Math.random() * Math.PI * 2;
    }

    return { positions, baseRadius, speed, drift };
  }, []);

  useFrame((state, delta) => {
    const geo = pointsRef.current?.geometry;
    const attr = geo?.getAttribute("position") as THREE.BufferAttribute | undefined;
    if (!attr) return;

    const pull = Math.min(progress / 100, 1);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = attr.getX(i);
      const y = attr.getY(i);
      const z = attr.getZ(i);

      const rot = delta * speed[i] * 0.5;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      const nx = x * cos - z * sin;
      const nz = x * sin + z * cos;
      const ny = y + Math.sin(state.clock.getElapsedTime() * speed[i] + drift[i]) * delta * 0.15;

      const targetRadius = baseRadius[i] * (1 - pull * 0.72);
      const current = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      const scale = targetRadius / current;

      attr.setXYZ(i, nx * scale, ny * scale, nz * scale);
    }

    attr.needsUpdate = true;
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.04;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        color="#6ee7b7"
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/* Infinite scrolling wireframe floor for a tron-style forward motion feel. */
const ScrollingGrid: React.FC = () => {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(60, 60, "#10b981", "#064e3b");
    const mats = Array.isArray(g.material) ? g.material : [g.material];
    mats.forEach((m) => {
      m.transparent = true;
      m.opacity = 0.32;
    });
    return g;
  }, []);

  useFrame((_, delta) => {
    grid.position.z = (grid.position.z + delta * 1.4) % 2; // grid cell size = 60/60 = 1
  });

  return <primitive object={grid} position={[0, -2.6, 0]} />;
};

/* Slow camera dolly-in that tightens as loading nears completion. */
const CameraRig: React.FC<{ progress: number }> = ({ progress }) => {
  useFrame((state) => {
    const targetZ = 7.4 - (progress / 100) * 1.6;
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.02;
    state.camera.position.y += (0.6 - state.camera.position.y) * 0.02;
    state.camera.lookAt(0, 0.25, 0);
  });
  return null;
};

export const LoaderScene: React.FC<LoaderSceneProps> = ({ progress, isLoaded }) => {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 7.4], fov: 48 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <fog attach="fog" args={["#000000", 6, 15]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 2, 4]} intensity={3} color="#10b981" />
      <CameraRig progress={progress} />
      <DataCore progress={progress} isLoaded={isLoaded} />
      <DataParticles progress={progress} />
      <ScrollingGrid />
    </Canvas>
  );
};

export default LoaderScene;

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

// ── Sphere node positions ──────────────────────────────────────────────────
function generateBrainNodes(count: number) {
  const positions: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = phi * i;
    // squash into brain-like ellipsoid
    positions.push(
      new THREE.Vector3(
        Math.cos(theta) * radius * 1.4,
        y * 1.1,
        Math.sin(theta) * radius * 0.9
      )
    );
  }
  return positions;
}

// ── Synaptic pulse along an edge ──────────────────────────────────────────
function Pulse({ start, end, speed, color }: { start: THREE.Vector3; end: THREE.Vector3; speed: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  const t = useRef(Math.random());

  useFrame((_, delta) => {
    t.current = (t.current + delta * speed) % 1;
    const pos = new THREE.Vector3().lerpVectors(start, end, t.current);
    ref.current.position.copy(pos);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.018, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  );
}

// ── Glowing node ───────────────────────────────────────────────────────────
function Node({ position, color, size }: { position: THREE.Vector3; color: string; size: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    const s = size + Math.sin(clock.getElapsedTime() * 2 + phase) * size * 0.3;
    ref.current.scale.setScalar(s / size);
    (ref.current.material as THREE.MeshBasicMaterial).opacity =
      0.6 + Math.sin(clock.getElapsedTime() * 1.5 + phase) * 0.4;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </mesh>
  );
}

// ── Main brain scene ───────────────────────────────────────────────────────
function BrainScene({ theme }: { theme: string }) {
  const groupRef = useRef<THREE.Group>(null!);
  const { size } = useThree();

  const isVibrant = theme === 'vibrant';
  const isDark = theme === 'dark' || isVibrant;

  const colors = isVibrant
    ? { nodes: ['#a855f7', '#06b6d4', '#ec4899', '#eab308', '#22c55e'], pulses: ['#f0abfc', '#67e8f9', '#f9a8d4'], bg: '#0d0015', edge: '#6d28d9' }
    : isDark
      ? { nodes: ['#60a5fa', '#34d399', '#f472b6', '#a78bfa', '#38bdf8'], pulses: ['#93c5fd', '#6ee7b7', '#f0abfc'], bg: '#030712', edge: '#374151' }
      : { nodes: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4'], pulses: ['#60a5fa', '#34d399', '#a78bfa'], bg: '#f8fafc', edge: '#cbd5e1' };

  const NODE_COUNT = 120;
  const nodes = useMemo(() => generateBrainNodes(NODE_COUNT), []);

  // Build edges between nearby nodes
  const edges = useMemo(() => {
    const result: { a: THREE.Vector3; b: THREE.Vector3; color: string }[] = [];
    const threshold = 0.55;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < threshold && result.length < 280) {
          result.push({
            a: nodes[i],
            b: nodes[j],
            color: colors.edge,
          });
        }
      }
    }
    return result;
  }, [nodes, colors.edge]);

  // Select pulse edges (subset)
  const pulseEdges = useMemo(() => edges.filter((_, i) => i % 5 === 0).slice(0, 30), [edges]);

  useFrame(({ clock }) => {
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.12;
    groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.08) * 0.12;
  });

  const scale = Math.min(size.width, size.height) < 600 ? 1.2 : 1.7;

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color={isVibrant ? '#a855f7' : '#60a5fa'} />
      <pointLight position={[-5, -5, -5]} intensity={1} color={isVibrant ? '#06b6d4' : '#34d399'} />

      <group ref={groupRef} scale={scale}>
        {/* Edges */}
        {edges.map((e, i) => (
          <Line
            key={i}
            points={[e.a, e.b]}
            color={e.color}
            lineWidth={0.3}
            transparent
            opacity={isVibrant ? 0.35 : 0.22}
          />
        ))}

        {/* Nodes */}
        {nodes.map((pos, i) => (
          <Node
            key={i}
            position={pos}
            color={colors.nodes[i % colors.nodes.length]}
            size={i % 15 === 0 ? 0.045 : 0.022}
          />
        ))}

        {/* Pulses */}
        {pulseEdges.map((e, i) => (
          <Pulse
            key={i}
            start={e.a}
            end={e.b}
            speed={0.4 + (i % 5) * 0.15}
            color={colors.pulses[i % colors.pulses.length]}
          />
        ))}
      </group>
    </>
  );
}

// ── Exported canvas ────────────────────────────────────────────────────────
export function NeuralBrain() {
  const { theme } = useTheme();

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <BrainScene theme={theme} />
      </Canvas>
    </div>
  );
}

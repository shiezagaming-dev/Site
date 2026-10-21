import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function Pepperoni({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.105, 0.105, 0.025, 32]} />
        <meshStandardMaterial color="#a72d20" roughness={0.48} />
      </mesh>
      <mesh position={[0, 0.014, 0]}>
        <cylinderGeometry args={[0.071, 0.071, 0.004, 28]} />
        <meshStandardMaterial color="#c84b32" roughness={0.5} />
      </mesh>
    </group>
  );
}

function Pizza({ cooking = true }) {
  const pizza = useRef();
  const cheese = useRef();
  useFrame((state, delta) => {
    if (pizza.current) {
      pizza.current.rotation.y += delta * 0.25;
      pizza.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.035;
    }
    if (cheese.current) cheese.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.012);
  });
  const toppings = [
    [-0.5, 0.47], [0.1, 0.57], [0.55, 0.22], [-0.55, -0.05],
    [0.0, 0.05], [0.36, -0.42], [-0.23, -0.5], [0.04, -0.3], [-0.02, 0.72]
  ];
  return (
    <group ref={pizza} rotation={[-0.12, 0, -0.08]} position={[0, 0.08, 0]}>
      {/* golden crust */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[1.48, 1.48, 0.22, 96]} />
        <meshStandardMaterial color="#c77b35" roughness={0.72} />
      </mesh>
      <mesh castShadow position={[0, 0.12, 0]}>
        <cylinderGeometry args={[1.34, 1.34, 0.055, 96]} />
        <meshStandardMaterial color="#f2d08a" roughness={0.62} />
      </mesh>
      {/* sauce */}
      <mesh position={[0, 0.151, 0]}>
        <cylinderGeometry args={[1.25, 1.25, 0.018, 96]} />
        <meshStandardMaterial color="#a92e1c" roughness={0.8} />
      </mesh>
      {/* melted mozzarella */}
      <group ref={cheese} position={[0, 0.168, 0]}>
        <mesh>
          <cylinderGeometry args={[1.19, 1.19, 0.025, 96]} />
          <meshStandardMaterial color="#f9e7b9" roughness={0.34} />
        </mesh>
        {Array.from({length: 22}).map((_, i) => {
          const a = i * 2.399;
          const r = 0.2 + (i % 5) * 0.19;
          return <mesh key={i} position={[Math.cos(a)*r, 0.017, Math.sin(a)*r]} rotation={[0, a, 0]}>
            <sphereGeometry args={[0.09 + (i%3)*0.018, 16, 10]} />
            <meshStandardMaterial color={i%4===0 ? '#f4d98e' : '#fff0c9'} roughness={0.3} />
          </mesh>;
        })}
      </group>
      {toppings.map(([x,z], i) => <Pepperoni key={i} position={[x, 0.205, z]} scale={i%3===0 ? 1.05 : 0.88} />)}
      {/* basil leaves */}
      {[[-0.75,0.1],[0.72,-0.15],[0.25,0.77]].map(([x,z],i)=>
        <mesh key={'b'+i} position={[x,0.22,z]} rotation={[0.1, i*1.7, 0.55]} scale={[0.12,0.025,0.28]}>
          <sphereGeometry args={[1,16,12]} />
          <meshStandardMaterial color="#39733e" roughness={0.58} />
        </mesh>
      )}
    </group>
  );
}

function OvenGlow() {
  return <group position={[0, -1.15, -1.7]}>
    <mesh position={[0, 0.1, 0]}>
      <boxGeometry args={[4.8, 2.5, 0.35]} />
      <meshStandardMaterial color="#29221c" roughness={0.8} />
    </mesh>
    <mesh position={[0, 0.05, 0.2]}>
      <boxGeometry args={[3.6, 1.55, 0.06]} />
      <meshStandardMaterial color="#4a1c0d" emissive="#d94b10" emissiveIntensity={1.4} />
    </mesh>
    <pointLight position={[0, 0.15, 1.0]} color="#ff6a20" intensity={4.5} distance={7} />
  </group>;
}

export default function PizzaScene() {
  return (
    <div className="pizza-canvas">
      <Canvas shadows camera={{ position: [0, 2.8, 5.4], fov: 42 }} dpr={[1, 1.7]}>
        <color attach="background" args={['#15110e']} />
        <fog attach="fog" args={['#15110e', 6, 12]} />
        <ambientLight intensity={1.1} />
        <spotLight position={[3, 5, 4]} angle={0.45} penumbra={1} intensity={3.5} castShadow color="#ffe0a4" />
        <pointLight position={[-3, 1, 0]} intensity={2.5} color="#ff6b2b" />
        <OvenGlow />
        <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.25}>
          <Pizza />
        </Float>
        <Sparkles count={32} scale={[4, 2, 4]} size={2} speed={0.25} color="#ffbd73" opacity={0.7} />
        <ContactShadows position={[0, -1.2, 0]} opacity={0.45} scale={6} blur={2.5} far={3} />
        <Environment preset="city" />
      </Canvas>
      <div className="scene-caption"><span className="live-dot" /> FRESH FROM THE FIRE</div>
    </div>
  );
}

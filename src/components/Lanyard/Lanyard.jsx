import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const Lanyard = ({ position = [0, 0, 0], gravity = [0, -28, 0], fov = 22 }) => {
  return (
    <div style={{ width: '100%', height: '200px' }}>
      <Canvas camera={{ fov }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -5]} intensity={0.3} />
        
        {/* Simple lanyard-like shape */}
        <mesh position={position}>
          <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        {/* Card hanging from lanyard */}
        <mesh position={[position[0], position[1] - 1, position[2]]}>
          <boxGeometry args={[0.8, 1.2, 0.05]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        
        {/* Card details */}
        <mesh position={[position[0], position[1] - 1, position[2] + 0.03]}>
          <planeGeometry args={[0.7, 1.1]} />
          <meshStandardMaterial color="#000000" transparent opacity={0.8} />
        </mesh>
        
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default Lanyard;

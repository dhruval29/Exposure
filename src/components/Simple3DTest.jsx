import React from 'react';
import { Canvas } from '@react-three/fiber';

const Simple3DTest = () => {
  return (
    <div style={{ width: '300px', height: '300px', border: '2px solid red' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </Canvas>
    </div>
  );
};

export default Simple3DTest;

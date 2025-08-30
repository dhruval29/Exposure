import React from 'react';

const DiagonalSection = () => {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Light blue section */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#E5F4F6',
        clipPath: 'polygon(0 0, 100% 0, 100% 35%, 0 55%)'
      }} />
      
      {/* Pink section */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#F2858E',
        clipPath: 'polygon(0 55%, 100% 35%, 100% 75%, 0 85%)'
      }} />

      {/* Dark grey section */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#4A4A4A',
        clipPath: 'polygon(0 85%, 100% 75%, 100% 100%, 0 100%)'
      }} />
    </div>
  );
};

export default DiagonalSection;

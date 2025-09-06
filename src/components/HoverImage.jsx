import React, { useState } from 'react';

const HoverImage = ({ src, style, caption }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 30,
        ...style
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={src}
        alt={caption || ''}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.4s cubic-bezier(0.42, 0, 0.58, 1)',
          transform: hovered ? 'scale(1.0125)' : 'scale(1)',
          cursor: 'pointer'
        }}
      />
      {/* Semi-transparent black grain overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'grain(0.8)',
          transition: 'opacity 0.4s cubic-bezier(0.42, 0, 0.58, 1)',
          opacity: hovered ? 1 : 0,
          pointerEvents: 'none',
          transform: 'scale(1.0125)',
          transformOrigin: 'center'
        }}
      />
      {/* Text overlay in bottom left with animation */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
          transition: 'all 0.4s cubic-bezier(0.42, 0, 0.58, 1)',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.95)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      >
        {caption || 'View Details'}
      </div>
    </div>
  );
};

export default HoverImage;

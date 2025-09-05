import React, { useState } from 'react';

const HoverImage = ({ src, style, caption }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 20,
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
          transition: 'transform 0.3s ease',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          cursor: 'pointer'
        }}
      />
      {hovered && caption && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '8px',
            fontSize: '14px',
            textAlign: 'center'
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
};

export default HoverImage;

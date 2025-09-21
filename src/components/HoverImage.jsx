import React, { useState, useEffect, useRef } from 'react';

const HoverImage = ({ src, style, caption }) => {
  const [hovered, setHovered] = useState(false);
  const [imageOrientation, setImageOrientation] = useState('landscape'); // 'landscape', 'portrait', or 'square'
  const imgRef = useRef(null);

  // Detect image orientation when image loads
  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      const handleLoad = () => {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        if (aspectRatio > 1.1) {
          setImageOrientation('landscape');
        } else if (aspectRatio < 0.9) {
          setImageOrientation('portrait');
        } else {
          setImageOrientation('square');
        }
      };

      if (img.complete) {
        handleLoad();
      } else {
        img.addEventListener('load', handleLoad);
        return () => img.removeEventListener('load', handleLoad);
      }
    }
  }, [src]);
  
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
        ref={imgRef}
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

      {/* Watermark - positioned based on image orientation */}
      <div
        style={{
          position: 'absolute',
          // Bottom right for landscape, top right for portrait/square
          ...(imageOrientation === 'landscape' 
            ? { bottom: '16px', right: '16px' }
            : { top: '16px', right: '16px' }
          ),
          color: 'white',
          fontSize: '12px',
          fontWeight: '400',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)',
          transition: 'all 0.4s cubic-bezier(0.42, 0, 0.58, 1)',
          opacity: hovered ? 1 : 0.8,
          transform: hovered ? 'translateY(0) scale(1)' : 'translateY(5px) scale(0.98)',
          pointerEvents: 'none',
          zIndex: 1,
          letterSpacing: '0.5px'
        }}
      >
        © DHR
      </div>
    </div>
  );
};

export default HoverImage;

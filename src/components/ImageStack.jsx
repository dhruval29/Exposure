import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

const images = [
  '/pictures/4ca5bc212bb689a1f9a15d95833b43b8ebb3b9ab.png',
  '/pictures/66b90841dac09204196c2799eb092dfc82cb4d49.png',
  '/pictures/a4127d727720d4c092e45fefaf0b05c0c79fe2d4.png',
  '/pictures/e6598e5c25c54119d943da26c46ea508e5daf7cf.png',
  '/pictures/e7643725a3b70e0bc912211e0911b18522585aa2.png',
  '/pictures/fea9ef66f94ec76e2005159a55ddfbe0fc03f4b9.png',
  '/forest.png'
];

const rotations = [-2, 7, -5, 3, -6, -2, -2];

const ImageStack = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef(null);
  const imagesRef = useRef([]);
  const timelineRef = useRef(null);

  useEffect(() => {
    // Initialize GSAP timeline
    // Create custom ease using the exact Figma bezier curve
    const customEase = "cubic-bezier(0.75, 0, 0.24, 1)";
    
    timelineRef.current = gsap.timeline({
      paused: true,
      defaults: {
        duration: 3.2, // Increased from 2.4s to 3.2s to compensate for much faster video scaling
        ease: customEase
      }
    });

    // Set initial positions with exact Figma dimensions scaled down to 0.8
    gsap.set(containerRef.current, {
      width: 654 * 0.8, // 523.2
      height: 360 * 0.8, // 288
      left: '50%',
      xPercent: -50,
      top: '50%',
      yPercent: -50
    });

    // Create the animation timeline
    const tl = timelineRef.current;

    // Animate container
    tl.to(containerRef.current, {
      width: '100%',
      height: 360 * 0.8 // 288
    });

    // Animate each image
    imagesRef.current.forEach((img, i) => {
      // Use exact Figma positions scaled down to 0.8
      const startPositions = [
        { x: 10 * 0.8, y: 10.93 * 0.8 }, // 8, 8.744
        { x: 38.53 * 0.8, y: -36.48 * 0.8 }, // 30.824, -29.184
        { x: 3 * 0.8, y: 28.59 * 0.8 }, // 2.4, 22.872
        { x: 25.21 * 0.8, y: -14.93 * 0.8 }, // 20.168, -11.944
        { x: 1 * 0.8, y: 33.30 * 0.8 }, // 0.8, 26.64
        { x: 10 * 0.8, y: 10.92 * 0.8 }, // 8, 8.736
        { x: 10 * 0.8, y: 10.93 * 0.8 } // 8, 8.744 - Last image (forest) uses same position as first
      ];
      const startX = startPositions[i].x;
      const startY = startPositions[i].y;
      // Calculate target X position with equal spacing scaled down to 0.8
      const targetX = (-1533 + (i * 657)) * 0.8;

      // Set exact Figma dimensions for each image scaled down to 0.8
      const imageWidth = (i === 2 || i === 3 || i === 4 ? 618.40 : 620.17) * 0.8;
      const imageHeight = (i === 2 || i === 3 || i === 4 ? 348 : 349) * 0.8;
      
      gsap.set(img, {
        width: imageWidth,
        height: imageHeight,
        left: startX,
        top: startY,
        rotation: rotations[i],
        transformOrigin: 'top left'
      });

      // Animate each image with the default ease
      tl.to(img, {
        left: targetX,
        top: 43 * 0.8, // 34.4
        rotation: 0
      }, 0);
    });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  const handleClick = () => {
    if (isExpanded) {
      timelineRef.current.reverse();
    } else {
      timelineRef.current.play();
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        background: 'white',
        overflow: 'hidden',
        cursor: "url('/W/cursor final.png') 0 0, pointer"
      }}
      onClick={handleClick}
    >
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          overflow: 'visible'
        }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            ref={el => imagesRef.current[index] = el}
            src={src}
            alt={`Gallery image ${index + 1}`}
            style={{
              position: 'absolute',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageStack;

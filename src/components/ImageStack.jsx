import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

// All available images in the sliding content directory
const allImages = [
  '/New folder/images/sliding content/1.webp',
  '/New folder/images/sliding content/2.webp',
  '/New folder/images/sliding content/3.webp',
  '/New folder/images/sliding content/4.webp',
  '/New folder/images/sliding content/5.webp',
  '/New folder/images/sliding content/6.webp',
  '/New folder/images/sliding content/7.webp',
  '/New folder/images/sliding content/8.webp',
  '/New folder/images/sliding content/9.webp',
  '/New folder/images/sliding content/10.webp',
  '/New folder/images/sliding content/11.webp',
  '/New folder/images/sliding content/12.webp',
  '/New folder/images/sliding content/13.webp',
  '/New folder/images/sliding content/14.webp',
  '/New folder/images/sliding content/15.webp'
];

// Function to randomly select 7 images from the pool
const getRandomImages = () => {
  const shuffled = [...allImages].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 7);
};

// Get 7 random images for this session
const getInitialImages = () => getRandomImages();



const ImageStack = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [images, setImages] = useState(getInitialImages());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef(null);
  const imagesRef = useRef([]);
  const timelineRef = useRef(null);

  // Auto-refresh images every 30 seconds for variety
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      setImages(getRandomImages());
      setTimeout(() => setIsRefreshing(false), 1000); // Show loading for 1 second
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Also refresh on initial mount
  useEffect(() => {
    setImages(getRandomImages());
  }, []);

  // Cleanup timeline on unmount
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  useEffect(() => {
    // Wait for images to load before initializing animations
    const imagePromises = images.map(src => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.src = src;
      });
    });

    Promise.all(imagePromises).then(() => {
      // Initialize GSAP timeline after all images are loaded
      initializeTimeline();
    });
  }, [images]);

  const initializeTimeline = () => {
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
      // Generate random start positions for variety
      const startX = (Math.random() * 40 - 20) * 0.8; // Random X between -16 and 16
      const startY = (Math.random() * 40 - 20) * 0.8; // Random Y between -16 and 16
      
      // Calculate target X position with equal spacing
      const targetX = (-1533 + (i * 657)) * 0.8;

      // Let images maintain their original aspect ratio
      // We'll set a max width/height and let the image scale proportionally
      const maxWidth = 620 * 0.8;
      const maxHeight = 349 * 0.8;
      
      // Generate random rotation for variety
      const randomRotation = (Math.random() * 14 - 7); // Random rotation between -7 and 7 degrees
      
      gsap.set(img, {
        width: maxWidth,
        height: maxHeight,
        left: startX,
        top: startY,
        rotation: randomRotation,
        transformOrigin: 'top left',
        objectFit: 'contain'
      });

      // Animate each image with the default ease
      tl.to(img, {
        left: targetX,
        top: 43 * 0.8, // 34.4
        rotation: 0,
        scale: 1 // Ensure consistent scaling
      }, 0);
    });
  };

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
            title={src.split('/').pop()} // Show filename on hover
            style={{
              position: 'absolute',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              objectFit: 'contain',
              objectPosition: 'center'
            }}
          />
        ))}
      </div>
      
            {/* Image counter */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '8px 12px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#333',
        border: '1px solid #ddd',
        zIndex: 1000
      }}>
        {images.length} images • {isRefreshing ? 'Refreshing...' : 'Auto-refresh'}
      </div>
    </div>
  );
};

export default ImageStack;

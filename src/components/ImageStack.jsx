import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

// All available images in the pictures directory
const allImages = [
  '/pictures/4ca5bc212bb689a1f9a15d95833b43b8ebb3b9ab.jpg',
  '/pictures/66b90841dac09204196c2799eb092dfc82cb4d49.jpg',
  '/pictures/a4127d727720d4c092e45fefaf0b05c0c79fe2d4.jpg',
  '/pictures/e6598e5c25c54119d943da26c46ea508e5daf7cf.jpg',
  '/pictures/e7643725a3b70e0bc912211e0911b18522585aa2.jpg',
  '/pictures/fea9ef66f94ec76e2005159a55ddfbe0fc03f4d9.jpg',
  '/pictures/forest.jpg',
  '/pictures/IMG_20250101_101901.jpg',
  '/pictures/IMG_20241231_163537.jpg',
  '/pictures/IMG_20241129_052647 (2).jpg',
  '/pictures/IMG_20241227_144906.jpg',
  '/pictures/IMG_20241227_143322.jpg',
  '/pictures/IMG_20241227_143955.jpg',
  '/pictures/IMG_20241227_150607.jpg',
  '/pictures/IMG_20241227_145117.jpg',
  '/pictures/IMG_20241227_151216.jpg',
  '/pictures/IMG_20241227_103029.jpg',
  '/pictures/IMG_20241227_102353.jpg',
  '/pictures/IMG_20241129_052647.jpg',
  '/pictures/IMG_20241129_044846.jpg',
  '/pictures/IMG_20250108_151138.jpg',
  '/pictures/IMG_20241227_143524.jpg',
  '/pictures/IMG_20250114_093607.jpg',
  '/pictures/IMG_20250105_192834.jpg',
  '/pictures/IMG_20250114_191924.jpg',
  '/pictures/IMG_20250105_133713.jpg',
  '/pictures/IMG_20250105_143206.jpg',
  '/pictures/IMG_20250106_201327.jpg',
  '/pictures/IMG_20250101_120715.jpg',
  '/pictures/IMG_20250105_135654.jpg',
  '/pictures/IMG_20241229_134149.jpg',
  '/pictures/IMG_20250101_151523.jpg',
  '/pictures/IMG_20241229_142232.jpg',
  '/pictures/IMG_20241229_133606.jpg',
  '/pictures/IMG_20241229_133635.jpg',
  '/pictures/IMG_20241227_151324.jpg',
  '/pictures/IMG_20241226_200855.jpg',
  '/pictures/IMG_20241227_220159.jpg',
  '/pictures/IMG_20241129_081550.jpg',
  '/pictures/IMG_20241129_081543.jpg',
  '/pictures/IMG_20250108_164936.jpg',
  '/pictures/IMG_20250106_191442-2.jpg',
  '/pictures/IMG_20250108_165155.jpg',
  '/pictures/IMG_20250114_201656.jpg',
  '/pictures/IMG_20250106_191442.jpg',
  '/pictures/IMG_20250105_140531-2.jpg',
  '/pictures/IMG_20250105_140531.jpg',
  '/pictures/IMG_20241129_045140 (2).jpg',
  '/pictures/IMG_20241229_133432.jpg',
  '/pictures/IMG_20241227_204306.jpg',
  '/pictures/IMG_20241225_153158-2.jpg',
  '/pictures/_SV16461.jpg',
  '/pictures/_SV16608.jpg',
  '/pictures/_SV16657.jpg'
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

import React, { useEffect, useRef, useState } from 'react';
import styles from './MobileSlidingFrame.module.css';
import MOBILEFRAME1 from './MOBILEFRAME1';
import MOBILEFRAME2 from './MOBILEFRAME2';

const MobileSlidingFrame = () => {
  const [screenSize, setScreenSize] = useState('mobile');
  const [componentHeight, setComponentHeight] = useState(200); // 200vh in pixels

  // Enhanced screen size detection with responsive height calculation
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Calculate responsive height for mobile devices - 200vh
      let newHeight = height * 2; // 200vh
      
      setComponentHeight(newHeight);
      
      if (width <= 480) {
        setScreenSize('small-mobile');
      } else if (width <= 768) {
        setScreenSize('mobile');
      } else if (width <= 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Responsive scaling based on screen size
  const getResponsiveScale = () => {
    switch (screenSize) {
      case 'small-mobile': return 0.8;  // 20% smaller for very small screens
      case 'mobile': return 1.0;        // Normal mobile size
      case 'tablet': return 1.1;        // 10% larger for tablets
      case 'desktop': return 1.0;       // Desktop size
      default: return 1.0;
    }
  };

  const scale = getResponsiveScale();

  return (
    <div 
      className={styles.mobileSlidingFrameParent}
      style={{ height: `${componentHeight}px` }}
    >
      {/* Frame 1 - Top Section (0vh to 100vh) */}
      <div className={styles.frame1Section}>
        <MOBILEFRAME1 />
      </div>

      {/* Frame 2 - Bottom Section (100vh to 200vh) */}
      <div className={styles.frame2Section}>
        <MOBILEFRAME2 />
      </div>
    </div>
  );
};

export default MobileSlidingFrame;

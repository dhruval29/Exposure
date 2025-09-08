import React, { useState, useEffect } from 'react';
import styles from './Rectangle18.module.css';

const Rectangle18 = () => {
  const [showText, setShowText] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isSlidingUp, setIsSlidingUp] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;

      // Align navbar title appearance with Frame50's scroll hint disappearance
      // Frame50 fades out the centered hint at: triggerPoint = 100vh - 200
      const triggerPoint = viewportHeight - 200;
      if (scrollTop >= triggerPoint) {
        setShowText(true);
      } else {
        setShowText(false);
      }

      // Hide nav bar when reaching the zoom component
      // ZoomReveal component starts at 100vh + 2768px
      const zoomComponentActualStart = viewportHeight + 2768;
      if (scrollTop >= zoomComponentActualStart) {
        setIsSlidingUp(true);
        // Hide completely after slide animation
        setTimeout(() => setIsVisible(false), 600);
      } else {
        // Reset states when scrolling back up
        setIsVisible(true);
        setIsSlidingUp(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`${styles.rectangleDiv} ${isSlidingUp ? styles.slideUp : ''}`}>
      <div className={styles.textContainer}>
        <div 
          className={`${styles.titleText} ${showText ? styles.fadeIn : ''}`}
        >
          <div className={styles.line1}>EXPOSURE</div>
          <div className={styles.line2}>EXPLORERS</div>
        </div>
      </div>
    </div>
  );
};

export default Rectangle18;

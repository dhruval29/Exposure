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

      // Show "EXPOSURE EXPLORERS" text when the initial 100vh section is scrolled past
      // This corresponds to when the sliding page effectively "reaches the top of the window"
      if (scrollTop >= viewportHeight) { // When scrollY passes 1 viewport height
        setShowText(true);
      } else {
        setShowText(false);
      }

      // Hide nav bar when reaching the zoom component
      // ZoomReveal component starts at 3544px
      const zoomComponentActualStart = 3544;
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
      <button className={styles.hamburgerButton}>
        <div className={styles.hamburgerIcon}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    </div>
  );
};

export default Rectangle18;

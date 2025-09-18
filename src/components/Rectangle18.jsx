import React, { useState, useEffect } from 'react';
import styles from './Rectangle18.module.css';

const Rectangle18 = ({ isVisible: externalIsVisible, isSlidingUp: externalIsSlidingUp, showText: externalShowText }) => {
  const [showText, setShowText] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isSlidingUp, setIsSlidingUp] = useState(false);
  
  // Use external props if provided, otherwise use internal state
  const finalIsVisible = externalIsVisible !== undefined ? externalIsVisible : isVisible;
  const finalIsSlidingUp = externalIsSlidingUp !== undefined ? externalIsSlidingUp : isSlidingUp;
  const finalShowText = externalShowText !== undefined ? externalShowText : showText;


  useEffect(() => {
    // Only manage scroll logic if external props are not provided
    if (externalIsVisible !== undefined || externalIsSlidingUp !== undefined || externalShowText !== undefined) {
      return;
    }

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

      // Hide nav bar when reaching the marquee text animation (Frame60 section)
      // Frame60 starts at 100vh + SLIDING_HEIGHT (same as marquee animation)
      const SLIDING_HEIGHT = 2768; // Same as Landing.jsx
      const marqueeSectionStart = viewportHeight + SLIDING_HEIGHT;
      if (scrollTop >= marqueeSectionStart) {
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
  }, [externalIsVisible, externalIsSlidingUp, externalShowText]);

  if (!finalIsVisible) return null;

  return (
    <div className={`${styles.rectangleDiv} ${finalIsSlidingUp ? styles.slideUp : ''}`}>
      <div className={styles.textContainer}>
        <div 
          className={`${styles.titleText} ${finalShowText ? styles.fadeIn : ''}`}
        >
          <div className={styles.line1}>EXPOSURE</div>
          <div className={styles.line2}>EXPLORERS</div>
        </div>
      </div>
    </div>
  );
};

export default Rectangle18;

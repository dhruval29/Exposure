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


  // Effect 1: Control title fade timing (independent of external visibility/slide props)
  useEffect(() => {
    // If parent explicitly controls showText, skip internal control
    if (externalShowText !== undefined) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const triggerAt = viewportHeight; // when sliding page top reaches window top
      setShowText(scrollTop >= triggerAt);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [externalShowText]);

  // Effect 2: Only manage navbar visibility/slide if not controlled externally
  useEffect(() => {
    if (externalIsVisible !== undefined || externalIsSlidingUp !== undefined) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const SLIDING_HEIGHT = 2768; // Same as Landing.jsx default desktop
      const marqueeSectionStart = viewportHeight + SLIDING_HEIGHT;
      if (scrollTop >= marqueeSectionStart) {
        setIsSlidingUp(true);
        setTimeout(() => setIsVisible(false), 600);
      } else {
        setIsVisible(true);
        setIsSlidingUp(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [externalIsVisible, externalIsSlidingUp]);

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

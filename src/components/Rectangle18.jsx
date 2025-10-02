import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Rectangle18.module.css';
import Menu from './Menu';

const Rectangle18 = ({ isVisible: externalIsVisible, isSlidingUp: externalIsSlidingUp, showText: externalShowText }) => {
  const [showText, setShowText] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isSlidingUp, setIsSlidingUp] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuAnimating, setIsMenuAnimating] = useState(false);
  const location = useLocation();
  const isOnContactPage = location.pathname === '/contact';
  
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
      const vw = window.innerWidth;
      const isHandheld = vw <= 1024;
      const SLIDING_HEIGHT = isHandheld
        ? (vw >= 400 && viewportHeight >= 900
            ? Math.max(2768, viewportHeight * 2.8)
            : (vw >= 375 && viewportHeight >= 800
                ? Math.max(2768, viewportHeight * 2.6)
                : Math.max(2768, viewportHeight * 2.4)))
        : viewportHeight * 3.0; // desktop 300vh
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

  const handleMenuToggle = () => {
    if (!isMenuOpen) {
      // Opening menu
      setIsMenuOpen(true);
      setTimeout(() => setIsMenuAnimating(true), 10);
    } else {
      // Closing menu
      setIsMenuAnimating(false);
      setTimeout(() => setIsMenuOpen(false), 600);
    }
  };

  if (!finalIsVisible) return null;

  return (
    <>
      <div className={`${styles.rectangleDiv} ${finalIsSlidingUp ? styles.slideUp : ''} ${isOnContactPage ? styles.noBorder : ''}`}>
        <button 
          className={`${styles.contactButton} ${finalShowText ? styles.textBlack : ''}`}
          onClick={() => window.location.href = isOnContactPage ? '/' : '/contact'}
        >
          {isOnContactPage ? 'Home' : 'Contact'}
        </button>
        {!isOnContactPage && (
          <div className={styles.textContainer}>
            <div 
              className={`${styles.titleText} ${finalShowText ? styles.fadeIn : ''}`}
            >
              <div className={styles.line1}>EXPOSURE</div>
              <div className={styles.line2}>EXPLORERS</div>
            </div>
          </div>
        )}
        <button 
          className={`${styles.menuText} ${finalShowText ? styles.textBlack : ''} ${isMenuOpen ? styles.menuOpen : ''}`}
          onClick={handleMenuToggle}
          data-menu-open={isMenuOpen}
        >
          <span className={styles.slotContainer}>
            <span className={styles.slotText}>Menu</span>
            <span className={styles.slotText}>Close</span>
          </span>
        </button>
      </div>
      
      {isMenuOpen && (
        <div className={`${styles.menuOverlay} ${isMenuAnimating ? styles.menuVisible : ''}`}>
          <Menu onClose={() => {
            setIsMenuAnimating(false);
            setTimeout(() => setIsMenuOpen(false), 600);
          }} />
        </div>
      )}
    </>
  );
};

export default Rectangle18;

import React, { useState, useEffect } from 'react';
import styles from './Rectangle18.module.css';
import StaggeredMenu from './StaggeredMenu';

const Rectangle18 = () => {
  const [showText, setShowText] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isSlidingUp, setIsSlidingUp] = useState(false);

  const menuItems = [
    { label: 'Our Journey', ariaLabel: 'Go to our journey page', link: '/' },
    { label: 'Gallery', ariaLabel: 'View our gallery', link: '/gallery' },
    { label: 'Team', ariaLabel: 'Meet our team', link: '/team' }
  ];

  const socialItems = [
    { label: 'Instagram', link: 'https://instagram.com' },
    { label: 'LinkedIn', link: 'https://linkedin.com' },
    { label: 'YouTube', link: 'https://youtube.com' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;

      // Show "EXPOSURE EXPLORERS" text when the initial 10vh section is scrolled past
      // This corresponds to when the sliding page effectively "reaches the top of the window"
      if (scrollTop >= viewportHeight * 0.1) { // When scrollY passes 0.1 viewport height
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
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={false}
        menuButtonColor="#fff"
        openMenuButtonColor="#fff"
        changeMenuColorOnOpen={false}
        colors={['#B19EEF', '#5227FF']}
        logoUrl="/src/assets/logos/reactbits-gh-white.svg"
        accentColor="#5227FF"
        onMenuOpen={() => {}}
        onMenuClose={() => {}}
      />
    </div>
  );
};

export default Rectangle18;

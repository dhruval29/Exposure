import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Menu.module.css';
import gsap from 'gsap';

const Menu = ({ onClose }) => {
  const menuRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const wordRefs = useRef([]);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (path === 'home') {
      onClose(); // Close menu for home
    } else {
      navigate(path);
      onClose(); // Close menu after navigation
    }
  };

  useEffect(() => {
    if (!menuRef.current) return;

    // Split text into individual words for animation
    const words1 = ['Home,', 'Our', 'Journey,'];
    const words2 = ['Featured,', 'Events,', 'Team'];

    // Create animated word elements
    const createAnimatedWords = (words, lineRef) => {
      return words.map((word, index) => (
        <span 
          key={index}
          ref={(el) => wordRefs.current.push(el)}
          className={styles.animatedWord}
          data-word-index={index}
        >
          {word}
        </span>
      ));
    };

    // Set words to visible state immediately - no animation
    gsap.set(wordRefs.current, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1
    });
  }, []);

  return (
    <div ref={menuRef} className={styles.menu}>
      {/* Desktop Layout - Horizontal */}
      <div ref={line1Ref} className={`${styles.homeOurJourneyContainer} ${styles.desktopLayout}`}>
        <p className={styles.homeOurJourney}>
          <button 
            ref={(el) => wordRefs.current.push(el)} 
            className={styles.animatedWord} 
            data-word-index={0}
            onClick={() => handleNavigation('home')}
          >
            Home, 
          </button>
          <button 
            ref={(el) => wordRefs.current.push(el)} 
            className={styles.animatedWord} 
            data-word-index={1}
            onClick={() => handleNavigation('/our-journey')}
          >
            Our Journey, 
          </button>
        </p>
        <p className={styles.homeOurJourney}>
          <button 
            ref={(el) => wordRefs.current.push(el)} 
            className={styles.animatedWord} 
            data-word-index={2}
            onClick={() => handleNavigation('/pictures')}
          >
            Featured, 
          </button>
          <button 
            ref={(el) => wordRefs.current.push(el)} 
            className={styles.animatedWord} 
            data-word-index={3}
            onClick={() => handleNavigation('/events')}
          >
            Events, 
          </button>
          <button 
            ref={(el) => wordRefs.current.push(el)} 
            className={styles.animatedWord} 
            data-word-index={4}
            onClick={() => handleNavigation('/team')}
          >
            Team
          </button>
        </p>
      </div>

      {/* Mobile Layout - Vertical List */}
      <div className={`${styles.mobileMenuList} ${styles.mobileLayout}`}>
        <button 
          className={styles.mobileMenuItem}
          onClick={() => handleNavigation('home')}
        >
          Home
        </button>
        <button 
          className={styles.mobileMenuItem}
          onClick={() => handleNavigation('/our-journey')}
        >
          Our Journey
        </button>
        <button 
          className={styles.mobileMenuItem}
          onClick={() => handleNavigation('/pictures')}
        >
          Featured
        </button>
        <button 
          className={styles.mobileMenuItem}
          onClick={() => handleNavigation('/events')}
        >
          Events
        </button>
        <button 
          className={styles.mobileMenuItem}
          onClick={() => handleNavigation('/team')}
        >
          Team
        </button>
      </div>
    </div>
  );
};

export default Menu;

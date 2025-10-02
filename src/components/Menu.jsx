import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Menu.module.css';
import gsap from 'gsap';

const Menu = ({ onClose }) => {
  const menuRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const wordRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    if (path === 'home') {
      // Check if currently on landing screen
      if (location.pathname === '/') {
        // If on landing screen, just close the menu
        onClose();
      } else {
        // If on any other page, navigate to home and close menu
        navigate('/');
        onClose();
      }
    } else {
      navigate(path);
      onClose(); // Close menu after navigation
    }
  };

  useEffect(() => {
    // CSS animations will handle the text reveal - no GSAP needed
    // The text elements start with opacity: 0 and animate in with cu-textReveal
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

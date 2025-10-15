import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Menu.module.css';
import gsap from 'gsap';
import { startRouteTransition } from './RouteTransitionLoader';
import { shouldShowTutorial, markMenuTutorialSeen } from '../utils/tutorialManager';
import TutorialCursor from './TutorialCursor';

const Menu = ({ onClose }) => {
  const menuRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const wordRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialTarget, setTutorialTarget] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const handleNavigation = (path) => {
    if (path === 'home') {
      // Check if currently on landing screen
      if (location.pathname === '/') {
        // If on landing screen, just close the menu
        onClose();
      } else {
        // If on any other page, navigate to home and close menu
        startRouteTransition('/');
        onClose();
      }
    } else {
      startRouteTransition(path);
      onClose(); // Close menu after navigation
    }
  };

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // CSS animations will handle the text reveal - no GSAP needed
    // The text elements start with opacity: 0 and animate in with cu-textReveal
    
    // Start tutorial after menu appears (for desktop only)
    if (!isMobile && shouldShowTutorial()) {
      setTimeout(() => {
        startTutorial();
      }, 1000); // Wait for CSS animations to complete
    }
  }, [isMobile]);

  // Tutorial functions
  const startTutorial = () => {
    // Target the first menu button (Home)
    const firstButton = wordRefs.current[0];
    if (firstButton) {
      setTutorialTarget(firstButton);
      setShowTutorial(true);
    }
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setTutorialTarget(null);
    markMenuTutorialSeen();
  };

  const handleTutorialInteraction = () => {
    if (showTutorial) {
      handleTutorialComplete();
    }
  };

  return (
    <div ref={menuRef} className={styles.menu}>
      {/* Desktop Layout - Horizontal */}
      <div ref={line1Ref} className={`${styles.homeOurJourneyContainer} ${styles.desktopLayout}`}>
        <p className={styles.homeOurJourney}>
          <button 
            ref={(el) => wordRefs.current.push(el)} 
            className={styles.animatedWord} 
            data-word-index={0}
            onClick={() => {
              handleTutorialInteraction();
              handleNavigation('home');
            }}
            onMouseEnter={handleTutorialInteraction}
            aria-label="Navigate to Home page"
          >
            Home, 
          </button>
          <button 
            ref={(el) => wordRefs.current.push(el)} 
            className={styles.animatedWord} 
            data-word-index={1}
            onClick={() => {
              handleTutorialInteraction();
              handleNavigation('/about-us');
            }}
            onMouseEnter={handleTutorialInteraction}
            aria-label="Navigate to About Us page"
          >
            About Us, 
          </button>
        </p>
        <p className={styles.homeOurJourney}>
          <button 
            ref={(el) => wordRefs.current.push(el)} 
            className={styles.animatedWord} 
            data-word-index={2}
            onClick={() => {
              handleTutorialInteraction();
              handleNavigation('/pictures');
            }}
            onMouseEnter={handleTutorialInteraction}
          >
            Featured, 
          </button>
          <button 
            ref={(el) => wordRefs.current.push(el)} 
            className={styles.animatedWord} 
            data-word-index={3}
            onClick={() => {
              handleTutorialInteraction();
              handleNavigation('/events');
            }}
            onMouseEnter={handleTutorialInteraction}
          >
            Events, 
          </button>
          <button 
            ref={(el) => wordRefs.current.push(el)} 
            className={styles.animatedWord} 
            data-word-index={4}
            onClick={() => {
              handleTutorialInteraction();
              handleNavigation('/the-team');
            }}
            onMouseEnter={handleTutorialInteraction}
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
          onClick={() => handleNavigation('/about-us')}
        >
          About Us
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
          onClick={() => handleNavigation('/the-team')}
        >
          Team
        </button>
        <button 
          className={styles.mobileMenuItem}
          onClick={() => handleNavigation('/contact')}
        >
          Contact
        </button>
      </div>

      {/* Tutorial Cursor - Only show on desktop for first-time users */}
      {!isMobile && (
        <TutorialCursor
          targetElement={tutorialTarget}
          isVisible={showTutorial}
          onAnimationComplete={handleTutorialComplete}
          tooltipText="Click to navigate"
        />
      )}
    </div>
  );
};

export default Menu;

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './SimpleNav.module.css';
import Menu from './Menu';

const SimpleNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuAnimating, setIsMenuAnimating] = useState(false);
  const location = useLocation();
  const isOnContactPage = location.pathname === '/contact';

  const handleMenuToggle = () => {
    if (!isMenuOpen) {
      setIsMenuOpen(true);
      setTimeout(() => setIsMenuAnimating(true), 10);
    } else {
      setIsMenuAnimating(false);
      setTimeout(() => setIsMenuOpen(false), 600);
    }
  };

  return (
    <>
      <div className={`${styles.simpleNav} ${isOnContactPage ? styles.noBorder : ''}`}>
        <button 
          className={styles.contactButton}
          onClick={() => window.location.href = isOnContactPage ? '/' : '/contact'}
        >
          {isOnContactPage ? 'Home' : 'Contact'}
        </button>
        {!isOnContactPage && (
          <div className={styles.textContainer}>
            <div className={styles.titleText}>
              <div className={styles.line1}>EXPOSURE</div>
              <div className={styles.line2}>EXPLORERS</div>
            </div>
          </div>
        )}
        <button
          className={`${styles.menuText} ${isMenuOpen ? styles.menuOpen : ''}`}
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
          <Menu onClose={handleMenuToggle} />
        </div>
      )}
    </>
  );
};

export default SimpleNav;

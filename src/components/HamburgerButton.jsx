import React, { useState, useRef, useEffect } from 'react';
import StaggeredMenu from './StaggeredMenu';

const HamburgerButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Trigger the menu's internal toggle
    if (menuRef.current) {
      const toggleButton = menuRef.current.querySelector('.sm-toggle');
      if (toggleButton) {
        toggleButton.click();
      }
    }
  };

  return (
    <>
      <button
        onClick={toggleMenu}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity 0.3s ease',
          zIndex: 100
        }}
        onMouseEnter={(e) => e.target.style.opacity = '0.7'}
        onMouseLeave={(e) => e.target.style.opacity = '1'}
      >
        <div style={{
          width: '24px',
          height: '18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <span style={{
            width: '100%',
            height: '2px',
            backgroundColor: '#000',
            transition: 'all 0.3s ease',
            transformOrigin: 'center'
          }} />
          <span style={{
            width: '100%',
            height: '2px',
            backgroundColor: '#000',
            transition: 'all 0.3s ease',
            transformOrigin: 'center'
          }} />
          <span style={{
            width: '100%',
            height: '2px',
            backgroundColor: '#000',
            transition: 'all 0.3s ease',
            transformOrigin: 'center'
          }} />
        </div>
      </button>

      <div ref={menuRef}>
        <StaggeredMenu
          position="right"
          items={menuItems}
          socialItems={socialItems}
          displaySocials={true}
          displayItemNumbering={false}
          menuButtonColor="#000"
          openMenuButtonColor="#000"
          changeMenuColorOnOpen={false}
          colors={['#B19EEF', '#5227FF']}
          logoUrl="/src/assets/logos/reactbits-gh-white.svg"
          accentColor="#5227FF"
          hideButton={true}
          onMenuOpen={() => setIsMenuOpen(true)}
          onMenuClose={() => setIsMenuOpen(false)}
        />
      </div>
    </>
  );
};

export default HamburgerButton;

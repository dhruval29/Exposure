import React from 'react';

const HamburgerButton = () => {
  return (
    <button
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
  );
};

export default HamburgerButton;

import React, { useEffect, useRef } from 'react';

import './FlowingMenu.css';

function FlowingMenu({ items = [], onUserInteraction }) {
  return (
    <div className="menu-wrap">
      <nav className="menu">
        {items.map((item, idx) => (
          <MenuItem key={idx} {...item} onUserInteraction={onUserInteraction} />
        ))}
      </nav>
    </div>
  );
}

function MenuItem({ link, text, image, monthYear, hasValidLink, showGuide, onUserInteraction }) {
  const itemRef = useRef(null);
  const textRef = useRef(null);
  const dateRef = useRef(null);
  const arrowRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    // Simply display text without animations
    textRef.current.textContent = text;
  }, [text]);

  // Removed GSAP hover animations - now using CSS animations

  const handleClick = (e) => {
    // Call interaction handler to hide guide
    if (onUserInteraction) {
      onUserInteraction();
    }
    
    if (!hasValidLink || link === '#') {
      e.preventDefault();
      return;
    }
    
    // For external links, open in new tab
    if (link.startsWith('http://') || link.startsWith('https://')) {
      e.preventDefault();
      window.open(link, '_blank', 'noopener,noreferrer');
    }
    // For internal links, let the default behavior handle it
  };

  const handleMouseEnter = () => {
    // Call interaction handler on hover to hide guide
    if (onUserInteraction) {
      onUserInteraction();
    }
  };

  return (
    <div className={`menu__item ${hasValidLink ? 'menu__item--clickable' : 'menu__item--disabled'} ${showGuide ? 'menu__item--guide' : ''}`} ref={itemRef} onMouseEnter={handleMouseEnter}>
      <div className="menu__bg" style={{ backgroundImage: `url(${image})` }} />
      {showGuide && (
        <div className="guide-tooltip">
          <div className="guide-tooltip__content">
            <span className="guide-tooltip__text">Click to view event details!</span>
            <div className="guide-tooltip__arrow"></div>
          </div>
        </div>
      )}
      <a 
        className="menu__item-link" 
        href={hasValidLink ? link : '#'}
        onClick={handleClick}
        style={{ cursor: hasValidLink ? 'pointer' : 'default' }}
      >
        <div className="menu__title menu__title--animated">
          <span ref={textRef}>{text}</span>
        </div>
        <div
          ref={arrowRef}
          className="menu__arrow--animated"
          style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            position: 'relative',
            top: '-2px',
            pointerEvents: 'none',
            opacity: hasValidLink ? 1 : 0.5,
            flexShrink: 0
          }}
        >
          <img
            src="/new-arrow.svg"
            alt="Arrow"
            style={{
              width: '220px',
              height: '220px',
              display: 'block'
            }}
            className="menu__arrow"
          />
        </div>
        <span className="menu__date menu__date--animated" ref={dateRef}>{monthYear || ''}</span>
      </a>
    </div>
  );
}

export default FlowingMenu;

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './FlowingMenu.css';

gsap.registerPlugin(ScrollTrigger);

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

    // Split text into words and then letters to preserve word boundaries
    const words = text.split(' ');
    textRef.current.innerHTML = '';
    
    words.forEach((word, wordIndex) => {
      // Create a word wrapper to prevent breaking within words
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap'; // Prevent word breaking
      
      // Split word into letters for animation
      const letters = word.split('');
      letters.forEach((letter, letterIndex) => {
        const span = document.createElement('span');
        span.className = 'letter';
        span.style.display = 'inline-block';
        span.textContent = letter;
        wordSpan.appendChild(span);
      });
      
      textRef.current.appendChild(wordSpan);
      
      // Add space after word (except for last word)
      if (wordIndex < words.length - 1) {
        const spaceSpan = document.createElement('span');
        spaceSpan.className = 'space';
        spaceSpan.style.display = 'inline-block';
        spaceSpan.textContent = '\u00A0';
        textRef.current.appendChild(spaceSpan);
      }
    });

    // Create GSAP animation for letter reveal
    const letterElements = textRef.current.querySelectorAll('.letter');
    
    gsap.set(letterElements, { 
      opacity: 0,
      filter: "blur(10px)"
    });

    // Set initial state for date
    if (dateRef.current) {
      gsap.set(dateRef.current, {
        opacity: 0,
        scale: 0.8,
        x: 20
      });
    }

    // Set initial state for arrow
    if (arrowRef.current) {
      gsap.set(arrowRef.current, {
        opacity: 0,
        xPercent: -20,
        yPercent: 20,
        transformOrigin: '50% 50%'
      });
    }

    ScrollTrigger.create({
      trigger: itemRef.current,
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => {
        gsap.to(letterElements, {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.5,
          stagger: 0.04,
          ease: "power2.out"
        });
        
        // Animate date with different timing
        if (dateRef.current) {
          gsap.to(dateRef.current, {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 0.6,
            delay: 0.4,
            ease: "back.out(1.7)"
          });
        }
      },
      onLeave: () => {
        gsap.to(letterElements, {
          opacity: 0,
          filter: "blur(10px)",
          duration: 0.2,
          stagger: 0.01,
          ease: "power2.in"
        });
        
        if (dateRef.current) {
          gsap.to(dateRef.current, {
            opacity: 0,
            scale: 0.8,
            x: 20,
            duration: 0.2,
            ease: "power2.in"
          });
        }
      },
      onEnterBack: () => {
        gsap.to(letterElements, {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.5,
          stagger: 0.04,
          ease: "power2.out"
        });
        
        if (dateRef.current) {
          gsap.to(dateRef.current, {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 0.6,
            delay: 0.4,
            ease: "back.out(1.7)"
          });
        }
      },
      onLeaveBack: () => {
        gsap.to(letterElements, {
          opacity: 0,
          filter: "blur(10px)",
          duration: 0.2,
          stagger: 0.01,
          ease: "power2.in"
        });
        
        if (dateRef.current) {
          gsap.to(dateRef.current, {
            opacity: 0,
            scale: 0.8,
            x: 20,
            duration: 0.2,
            ease: "power2.in"
          });
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === itemRef.current) {
          trigger.kill();
        }
      });
    };
  }, [text]);

  const handleEnter = () => {
    if (!arrowRef.current) return;
    gsap.to(arrowRef.current, {
      opacity: 1,
      xPercent: 0,
      yPercent: 0,
      duration: 0.6,
      ease: "power2.out",
      delay: 0.12
    });
  };

  const handleLeave = () => {
    if (!arrowRef.current) return;
    gsap.to(arrowRef.current, {
      opacity: 0,
      xPercent: -20,
      yPercent: 20,
      duration: 0.5,
      ease: "power2.inOut"
    });
  };

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
    handleEnter();
    // Call interaction handler on hover to hide guide
    if (onUserInteraction) {
      onUserInteraction();
    }
  };

  return (
    <div className={`menu__item ${hasValidLink ? 'menu__item--clickable' : 'menu__item--disabled'} ${showGuide ? 'menu__item--guide' : ''}`} ref={itemRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleLeave}>
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
        <div className="menu__title">
          <span ref={textRef}>{text}</span>
        </div>
        <div
          ref={arrowRef}
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
              width: '220 px',
              height: '220px',
              display: 'block'
            }}
          />
        </div>
        <span className="menu__date" ref={dateRef}>{monthYear || ''}</span>
      </a>
    </div>
  );
}

export default FlowingMenu;

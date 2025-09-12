import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './FlowingMenu.css';

gsap.registerPlugin(ScrollTrigger);

function FlowingMenu({ items = [] }) {
  return (
    <div className="menu-wrap">
      <nav className="menu">
        {items.map((item, idx) => (
          <MenuItem key={idx} {...item} />
        ))}
      </nav>
    </div>
  );
}

function MenuItem({ link, text, image, monthYear }) {
  const itemRef = useRef(null);
  const textRef = useRef(null);
  const dateRef = useRef(null);
  const arrowRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    // Split text into individual letters and create DOM elements
    const letters = text.split('');
    textRef.current.innerHTML = '';
    
    letters.forEach((letter, index) => {
      const span = document.createElement('span');
      span.className = 'letter';
      span.style.display = 'inline-block';
      span.textContent = letter === ' ' ? '\u00A0' : letter;
      textRef.current.appendChild(span);
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

  return (
    <div className="menu__item" ref={itemRef} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <div className="menu__bg" style={{ backgroundImage: `url(${image})` }} />
      <a className="menu__item-link" href={link}>
        <span ref={textRef}>{text}</span>
        <div
          ref={arrowRef}
          style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            position: 'relative',
            top: '-2px',
            pointerEvents: 'none'
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
          />
        </div>
        <span className="menu__date" ref={dateRef}>{monthYear || ''}</span>
      </a>
    </div>
  );
}

export default FlowingMenu;

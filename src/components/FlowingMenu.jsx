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

function MenuItem({ link, text, image }) {
  const itemRef = useRef(null);
  const textRef = useRef(null);
  const dateRef = useRef(null);
  
  // Generate random month and year
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const randomMonth = months[Math.floor(Math.random() * months.length)];
  const randomYear = Math.floor(Math.random() * 3) + 22; // 22, 23, or 24
  const monthYear = `${randomMonth} ${randomYear}`;

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

  const repeatedMarqueeContent = Array.from({ length: 4 }).map((_, idx) => (
    <React.Fragment key={idx}>
      <span>{text}</span>
      <div className="marquee__img" style={{ backgroundImage: `url(${image})` }} />
    </React.Fragment>
  ));

  return (
    <div className="menu__item" ref={itemRef}>
      <div className="menu__bg" style={{ backgroundImage: `url(${image})` }} />
      <a className="menu__item-link" href={link}>
        <span ref={textRef}>{text}</span>
        <span className="menu__date" ref={dateRef}>{monthYear}</span>
      </a>
      <div className="marquee">
        <div className="marquee__inner-wrap">
          <div className="marquee__inner" aria-hidden="true">
            {repeatedMarqueeContent}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlowingMenu;

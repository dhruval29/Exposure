import React, { useState, useEffect } from 'react';
import styles from './AboutUs.module.css';
import SimpleNav from './SimpleNav';

const AboutUs = () => {
  const BASE_DELAY_MS = 500;
  const [isHovered, setIsHovered] = useState(false);
  const [animationsReady, setAnimationsReady] = useState(false);

  useEffect(() => {
    // Listen for the route transition to complete before starting animations
    const handleTransitionComplete = () => {
      setAnimationsReady(true);
    };

    // Check if we're in a transition or if we loaded directly
    if (window.__routeTransitionActive) {
      window.addEventListener('route-transition-complete', handleTransitionComplete);
    } else {
      // Direct navigation (no transition), start animations immediately
      setAnimationsReady(true);
    }

    return () => {
      window.removeEventListener('route-transition-complete', handleTransitionComplete);
    };
  }, []);

  return (
    <>
      <SimpleNav />
      <div className={styles.aboutUs}>
      <div className={styles.aboutUsChild} />
      <div 
        className={`${styles.about} ${animationsReady ? styles.animatedText : ''}`}
        style={{ animationDelay: animationsReady ? `${BASE_DELAY_MS}ms` : '0ms' }}
      >
        ABOUT
      </div>
      <div className={styles.exposureExplorersContainer}>
        <p 
          className={`${styles.exposureExplorers} ${animationsReady ? styles.animatedText : ''}`}
          style={{ animationDelay: animationsReady ? `${BASE_DELAY_MS + 200}ms` : '0ms' }}
        >
          <span 
            className={styles.exposureExplorersTitle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isHovered ? "Explosion Exploders" : "Exposure Explorers"}
            <div 
              className={`${styles.animatedUnderline} ${animationsReady ? styles.animatedLine : ''}`}
              style={{ animationDelay: animationsReady ? `${BASE_DELAY_MS + 400}ms` : '0ms' }}
            />
          </span>
          , 
        </p>
        <p 
          className={`${styles.exposureExplorers} ${animationsReady ? styles.animatedText : ''}`}
          style={{ animationDelay: animationsReady ? `${BASE_DELAY_MS + 400}ms` : '0ms' }}
        >
          {`is the official Photography and Videography Club of NIT Goa, `}
        </p>
        <p 
          className={`${styles.exposureExplorers} ${animationsReady ? styles.animatedText : ''}`}
          style={{ animationDelay: animationsReady ? `${BASE_DELAY_MS + 600}ms` : '0ms' }}
        >
          dedicated to capturing life through creative lenses. We explore the art of visual storytelling -from framing campus memories to experimenting with new techniques. Our members collaborate, learn, and share their passion through workshops, photo walks, and projects that celebrate the world of light and perspective.
        </p>
      </div>
      <img 
        className={`${styles.nitgOrignal11} ${animationsReady ? styles.animatedImage : ''}`}
        src="/assets/images/NITG Orignal (1).png" 
        alt="NIT Goa"
        style={{ animationDelay: animationsReady ? `${BASE_DELAY_MS + 1000}ms` : '0ms' }}
      />
      <div 
        className={`${styles.aboutUsItem} ${animationsReady ? styles.animatedLine : ''}`}
        style={{ animationDelay: animationsReady ? `${BASE_DELAY_MS + 1200}ms` : '0ms' }}
      />
      <div 
        className={`${styles.exposureExplorers2} ${animationsReady ? styles.animatedImage : ''}`}
        style={{ animationDelay: animationsReady ? `${BASE_DELAY_MS + 1400}ms` : '0ms' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 250 78"
          width="100%"
          height="100%"
          fill="#000"
        >
          <text x="0" y="30" fontFamily="'PP Editorial New', serif" fontSize="36" fontWeight="400">
            EXPOSURE
          </text>
          <text x="0" y="65" fontFamily="'PP Editorial New', serif" fontSize="36" fontWeight="400">
            EXPLORERS
          </text>
        </svg>
      </div>
    </div>
    </>
  );
};

export default AboutUs;

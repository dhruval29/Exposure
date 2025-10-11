import React, { useState } from 'react';
import styles from './AboutUsMobile.module.css';

const AboutUsMobile = () => {
  const BASE_DELAY_MS = 500;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={styles.aboutUsMobile}>
      <div className={styles.aboutUsMobileChild} />
      <div 
        className={`${styles.about} ${styles.animatedText}`}
        style={{ animationDelay: `${BASE_DELAY_MS}ms` }}
      >
        ABOUT
      </div>
      <div 
        className={`${styles.exposureExplorers} ${styles.animatedText}`}
        style={{ animationDelay: `${BASE_DELAY_MS + 200}ms` }}
      >
        <span 
          className={styles.exposureExplorersTitle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered ? "Explosion Exploders" : "Exposure Explorers"}
          <div 
            className={`${styles.animatedUnderline} ${styles.animatedLine}`}
            style={{ animationDelay: `${BASE_DELAY_MS + 400}ms` }}
          />
        </span>
        ,
      </div>
      <div 
        className={`${styles.isTheOfficial} ${styles.animatedText}`}
        style={{ animationDelay: `${BASE_DELAY_MS + 400}ms` }}
      >
        is the official Photography and Videography Club of NIT Goa,
      </div>
      <div 
        className={`${styles.dedicatedToCapturing} ${styles.animatedText}`}
        style={{ animationDelay: `${BASE_DELAY_MS + 600}ms` }}
      >
        dedicated to capturing life through creative lenses. We explore the art of visual storytelling - from framing campus memories to experimenting with new techniques.
      </div>
      <div 
        className={`${styles.ourMembersCollaborate} ${styles.animatedText}`}
        style={{ animationDelay: `${BASE_DELAY_MS + 800}ms` }}
      >
        Our members collaborate, learn, and share their passion through workshops, photo walks, and projects that celebrate the world of light and perspective.
      </div>
      <img 
        className={`${styles.nitgOrignal12} ${styles.animatedImage}`}
        src="/assets/images/NITG Orignal (1).png" 
        alt="NIT Goa"
        style={{ animationDelay: `${BASE_DELAY_MS + 1000}ms` }}
      />
      <div 
        className={`${styles.aboutUsMobileItem} ${styles.animatedLine}`}
        style={{ animationDelay: `${BASE_DELAY_MS + 1200}ms` }}
      />
      <div 
        className={`${styles.exposureExplorers3} ${styles.animatedImage}`}
        style={{ animationDelay: `${BASE_DELAY_MS + 1400}ms` }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 150 47"
          width="100%"
          height="100%"
          fill="#000"
        >
          <text x="0" y="22" fontFamily="'PP Editorial New', serif" fontSize="20" fontWeight="400">
            EXPOSURE
          </text>
          <text x="0" y="42" fontFamily="'PP Editorial New', serif" fontSize="20" fontWeight="400">
            EXPLORERS
          </text>
        </svg>
      </div>
    </div>
  );
};

export default AboutUsMobile;

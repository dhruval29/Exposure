import React, { useState } from 'react';
import styles from './AboutUs.module.css';

const AboutUs = () => {
  const BASE_DELAY_MS = 500;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={styles.aboutUs}>
      <div className={styles.aboutUsChild} />
      <div 
        className={`${styles.about} ${styles.animatedText}`}
        style={{ animationDelay: `${BASE_DELAY_MS}ms` }}
      >
        ABOUT
      </div>
      <div className={styles.exposureExplorersContainer}>
        <p 
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
        </p>
        <p 
          className={`${styles.exposureExplorers} ${styles.animatedText}`}
          style={{ animationDelay: `${BASE_DELAY_MS + 400}ms` }}
        >
          {`is the official Photography and Videography Club of NIT Goa, `}
        </p>
        <p 
          className={`${styles.exposureExplorers} ${styles.animatedText}`}
          style={{ animationDelay: `${BASE_DELAY_MS + 600}ms` }}
        >
          dedicated to capturing life through creative lenses. We explore the art of visual storytelling -from framing campus memories to experimenting with new techniques.  Our members collaborate, learn, and share their passion through workshops,
        </p>
        <p 
          className={`${styles.exposureExplorers} ${styles.animatedText}`}
          style={{ animationDelay: `${BASE_DELAY_MS + 800}ms` }}
        >
          photo walks, and projects that celebrate the world of light and perspective.
        </p>
      </div>
      <img 
        className={`${styles.nitgOrignal11} ${styles.animatedImage}`}
        src="/assets/images/NITG Orignal (1).png" 
        alt="NIT Goa"
        style={{ animationDelay: `${BASE_DELAY_MS + 1000}ms` }}
      />
      <div 
        className={`${styles.aboutUsItem} ${styles.animatedLine}`}
        style={{ animationDelay: `${BASE_DELAY_MS + 1200}ms` }}
      />
      <div 
        className={`${styles.exposureExplorers2} ${styles.animatedImage}`}
        style={{ animationDelay: `${BASE_DELAY_MS + 1400}ms` }}
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
  );
};

export default AboutUs;

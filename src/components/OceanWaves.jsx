import React from 'react';
import styles from './OceanWaves.module.css';

const OceanWaves = () => {
  return (
    <div className={styles.wavesContainer}>
      {/* Multiple wave layers for depth and realism */}
      <svg 
        className={styles.waves}
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Wave Layer 1 - Deepest, slowest */}
        <path
          className={styles.wave1}
          d="M0,60 C150,20 300,100 450,60 C600,20 750,100 900,60 C1050,20 1200,100 1200,60 L1200,120 L0,120 Z"
          fill="#0a1929"
          opacity="1"
        />
        
        {/* Wave Layer 2 - Medium depth */}
        <path
          className={styles.wave2}
          d="M0,80 C200,40 400,120 600,80 C800,40 1000,120 1200,80 L1200,120 L0,120 Z"
          fill="#1e3a5f"
          opacity="0.9"
        />
        
        {/* Wave Layer 3 - Surface waves */}
        <path
          className={styles.wave3}
          d="M0,90 C250,50 500,130 750,90 C1000,50 1200,130 1200,90 L1200,120 L0,120 Z"
          fill="#2d5aa0"
          opacity="0.8"
        />
        
        {/* Wave Layer 4 - Top surface */}
        <path
          className={styles.wave4}
          d="M0,100 C300,60 600,140 900,100 C1050,60 1200,140 1200,100 L1200,120 L0,120 Z"
          fill="#4a90e2"
          opacity="0.7"
        />
        
        {/* Foam and white caps */}
        <path
          className={styles.foam}
          d="M0,105 C150,65 300,145 450,105 C600,65 750,145 900,105 C1050,65 1200,145 1200,105 L1200,120 L0,120 Z"
          fill="#87ceeb"
          opacity="0.6"
        />
      </svg>
      
      {/* Animated bubbles for extra ocean feel */}
      <div className={styles.bubbles}>
        <div className={styles.bubble} style={{ '--delay': '0s', '--duration': '3s' }}></div>
        <div className={styles.bubble} style={{ '--delay': '0.5s', '--duration': '4s' }}></div>
        <div className={styles.bubble} style={{ '--delay': '1s', '--duration': '3.5s' }}></div>
        <div className={styles.bubble} style={{ '--delay': '1.5s', '--duration': '2.5s' }}></div>
        <div className={styles.bubble} style={{ '--delay': '2s', '--duration': '4.5s' }}></div>
        <div className={styles.bubble} style={{ '--delay': '2.5s', '--duration': '3.8s' }}></div>
      </div>
    </div>
  );
};

export default OceanWaves;

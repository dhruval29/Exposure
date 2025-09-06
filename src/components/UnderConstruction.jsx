import React from 'react';
import styles from './IPhone161.module.css';

const UnderConstruction = () => {
  return (
    <div className={styles.iphone161}>
      <div className={styles.untitledVideo411}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className={styles.videoElement}
        >
          <source src="/assets/videos/untitled-video-4.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className={styles.openOnDesktopOrContainer}>
        <p className={styles.openOn}>{`Open on  `}</p>
        <p className={styles.desktopOr}>Desktop-or</p>
        <p className={styles.desktopOr}>-Lapytopy</p>
      </div>
      <div className={styles.pageUnderConstructions}>Page under constructions</div>
      <div className={styles.iAmNever}>( i am never making a mobile version i have a life</div>
    </div>
  );
};

export default UnderConstruction;

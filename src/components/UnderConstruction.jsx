import React from 'react';
import styles from './IPhone161.module.css';
import LetterGlitch from './LetterGlitch';

const UnderConstruction = () => {
  return (
    <div className={styles.iphone161}>
      <div className={styles.letterGlitchContainer}>
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
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

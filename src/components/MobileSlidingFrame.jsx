import React from 'react';
import styles from './MobileSlidingFrame.module.css';
import MOBILEFRAME1 from './MOBILEFRAME1';
import MOBILEFRAME2 from './MOBILEFRAME2';

const MobileSlidingFrame = () => {
  return (
    <div 
      className={styles.mobileSlidingFrameParent}
    >
      {/* Frame 1 - Top Section (0vh to 100vh) */}
      <div className={styles.frame1Section}>
        <MOBILEFRAME1 />
      </div>

      {/* Frame 2 - Bottom Section (100vh to 200vh) */}
      <div className={styles.frame2Section}>
        <MOBILEFRAME2 />
      </div>
    </div>
  );
};

export default MobileSlidingFrame;

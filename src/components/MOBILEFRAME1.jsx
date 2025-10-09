import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './MOBILEFRAME1.module.css';

const MOBILEFRAME1 = () => {
  const containerRef = useRef(null);
  const textBlockRef = useRef(null);

  useEffect(() => {
    // Set initial state for the whole text block (match Frame 2 style)
    if (textBlockRef.current) {
      gsap.set(textBlockRef.current, { opacity: 0, y: 20 });
    }

    // Intersection Observer for text animation - match Frame 2 timing/ease
    const textObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Single-block fade-in to mirror Frame 2's container-level animation
            if (textBlockRef.current) {
              gsap.to(textBlockRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power2.out'
              });
            }

            // Stop observing after animation starts
            textObserver.unobserve(entry.target);
          }
        })
      },
      { 
        threshold: 0.2, // Trigger when 20% visible (same as desktop)
        rootMargin: '0px 0px -150px 0px' // Trigger 150px before fully visible (same as desktop)
      }
    );

    // Observe the container
    if (containerRef.current) {
      textObserver.observe(containerRef.current);
    }

    return () => {
      textObserver.disconnect();
    };
  }, []);

  return (
    <div className={styles.mobileFrame1} ref={containerRef}>
      <div className={styles.weUseTheContainer} ref={textBlockRef}>
        <p className={styles.weUseThe}>We use the power of storytelling to</p>
        <p className={styles.weUseThe}>{`fire the imagination, stir the soul, `}</p>
        <p className={styles.weUseThe}>and ultimately inspire people.</p>
      </div>
      <img className={styles.img202501051356542Icon} src="/assets/images/Sliding Page/Mobile Frame/1.jpg" alt="" />
      <img className={styles.img202411290448467Icon} src="/assets/images/Sliding Page/Mobile Frame/IMG_28041.JPG" alt="" />
    </div>
  );
};

export default MOBILEFRAME1;

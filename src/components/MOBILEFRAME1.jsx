import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './MOBILEFRAME1.module.css';

const MOBILEFRAME1 = () => {
  const containerRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);

  useEffect(() => {
    // Set initial state
    gsap.set([line1Ref.current, line2Ref.current, line3Ref.current], {
      opacity: 0,
      y: 20
    });

    // Intersection Observer for text animation - matching desktop pattern
    const textObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Staggered fade-in animation with same timing as desktop
            const tl = gsap.timeline();
            
            tl.to(line1Ref.current, {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "power2.out"
            })
            .to(line2Ref.current, {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "power2.out"
            }, "-=0.8")
            .to(line3Ref.current, {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "power2.out"
            }, "-=0.8");

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
      <div className={styles.weUseTheContainer}>
        <p className={styles.weUseThe} ref={line1Ref}>We use the power of storytelling to</p>
        <p className={styles.weUseThe} ref={line2Ref}>{`fire the imagination, stir the soul, `}</p>
        <p className={styles.weUseThe} ref={line3Ref}>and ultimately inspire people.</p>
      </div>
      <img className={styles.img202501051356542Icon} src="/assets/images/Sliding Page/Mobile Frame/1.webp" alt="" />
      <img className={styles.img202411290448467Icon} src="/assets/images/Sliding Page/Mobile Frame/2.webp" alt="" />
    </div>
  );
};

export default MOBILEFRAME1;

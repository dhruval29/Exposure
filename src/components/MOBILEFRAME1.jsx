import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './MOBILEFRAME1.module.css';

const MOBILEFRAME1 = () => {
  const containerRef = useRef(null);
  const textBlockRef = useRef(null);
  const subTextRef = useRef(null);

  useEffect(() => {
    // Set initial state for text elements
    gsap.set([textBlockRef.current, subTextRef.current], {
      opacity: 0,
      y: 20
    });

    // Intersection Observer for text animation - match Frame 2 timing/ease
    const textObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Staggered fade-in animation matching Frame 2
            const tl = gsap.timeline();
            
            tl.to(textBlockRef.current, {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: 'power2.out'
            })
            .to(subTextRef.current, {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: 'power2.out'
            }, "-=0.8"); // Overlap with main text animation

            // Stop observing after animation starts
            textObserver.unobserve(entry.target);
          }
        })
      },
      { 
        threshold: 0.05, // Trigger when only 5% visible - much earlier
        rootMargin: '0px 0px -30% 0px' // Trigger 30% of viewport before fully visible - very early
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
        <p className={styles.weUseThe}>Stories that spark</p>
        <p className={styles.weUseThe}>imagination,</p>
        <p className={styles.weUseThe}>stir souls, and</p>
        <p className={styles.weUseThe}>move people to</p>
        <p className={styles.weUseThe}>feel deeply.</p>
      </div>
      <div className={styles.mobileFrame1SubText} ref={subTextRef}>
        <p className={styles.weUseThe}>Narratives crafted with care,</p>
        <p className={styles.weUseThe}>designed to resonate and</p>
        <p className={styles.weUseThe}>leave a lasting impression.</p>
      </div>
      <img className={styles.img202501051356542Icon} src="/assets/images/Sliding Page/Mobile Frame/1.jpg" alt="" />
      <img className={styles.img202411290448467Icon} src="/assets/images/Sliding Page/Mobile Frame/IMG_28041.JPG" alt="" />
    </div>
  );
};

export default MOBILEFRAME1;

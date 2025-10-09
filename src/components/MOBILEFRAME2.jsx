import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './MOBILEFRAME2.module.css';

const MOBILEFRAME2 = () => {
  const containerRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);

  useEffect(() => {
    // Set initial state for all text elements
    gsap.set([text1Ref.current, text2Ref.current, text3Ref.current], {
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
            
            tl.to(text1Ref.current, {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "power2.out"
            })
            .to(text2Ref.current, {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "power2.out"
            }, "-=0.8")
            .to(text3Ref.current, {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "power2.out"
            }, "+=0.2"); // Add 0.2s delay after text2 finishes

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
    <div className={styles.mobileFrame2} ref={containerRef}>
      <div className={styles.loremIpsumDolorContainer} ref={text1Ref}>
        <p className={styles.loremIpsumDolor}>{`Through bold images and honest voices, `}</p>
        <p className={styles.loremIpsumDolor}>{`we bring moments to life.`}</p>
      </div>
      <div className={styles.mobileFrame2LoremIpsumDolorContainer} ref={text2Ref}>
        <p className={styles.loremIpsumDolor}>Ideas that travel beyond the</p>
        <p className={styles.loremIpsumDolor}>{`frame, shaping how we see`}</p>
        <p className={styles.loremIpsumDolor}>{`the world.`}</p>
      </div>
      <img className={styles.img202412291336061Icon} src="/assets/images/Sliding Page/Mobile Frame/3.webp" alt="" />
      <img className={styles.img2024122515315822Icon} src="/assets/images/Sliding Page/Mobile Frame/4.webp" alt="" />
      <img className={styles.img202501140936073Icon} src="/assets/images/Sliding Page/Mobile Frame/5.webp" alt="" />
      <div className={styles.loremIpsumDolor2} ref={text3Ref}>We craft cinematic experiences rooted in truth—designed to spark curiosity, deepen connection, and move people to action.</div>
    </div>
  );
};

export default MOBILEFRAME2;

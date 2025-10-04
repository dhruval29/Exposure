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
        <p className={styles.loremIpsumDolor}>{`Lorem ipsum dolor sit amet `}</p>
        <p className={styles.loremIpsumDolor}>{`consectetur. `}</p>
      </div>
      <div className={styles.mobileFrame2LoremIpsumDolorContainer} ref={text2Ref}>
        <p className={styles.loremIpsumDolor}>Lorem ipsum dolor sit</p>
        <p className={styles.loremIpsumDolor}>{` amet consectetur. `}</p>
      </div>
      <img className={styles.img202412291336061Icon} src="/assets/images/Sliding Page/Mobile Frame/3.webp" alt="" />
      <img className={styles.img2024122515315822Icon} src="/assets/images/Sliding Page/Mobile Frame/4.webp" alt="" />
      <img className={styles.img202501140936073Icon} src="/assets/images/Sliding Page/Mobile Frame/5.webp" alt="" />
      <div className={styles.loremIpsumDolor2} ref={text3Ref}>Lorem ipsum dolor sit amet consectetur. Et nam sapien arcu sed eget sit. Convallis amet tortor in ornare turpis ut dui aliquet. Ornare nulla vitae iaculis sed.</div>
    </div>
  );
};

export default MOBILEFRAME2;

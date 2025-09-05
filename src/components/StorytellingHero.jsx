import React, { useEffect, useRef } from 'react';
import styles from './StorytellingHero.module.css';


const StorytellingHero = () => {
  const containerRef = useRef(null);
  const lineRefs = useRef([]);

  useEffect(() => {
    // Per-line observers with different thresholds
    const thresholds = [0.6, 0.65, 0.7];
    const observers = thresholds.map((threshold, idx) => new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.play);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -80px 0px' }
    ));

    lineRefs.current.forEach((el, idx) => {
      if (el) observers[idx]?.observe(el);
    });

    return () => {
      lineRefs.current.forEach((el, idx) => {
        if (el) observers[idx]?.unobserve(el);
      });
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    	<div ref={containerRef} className={styles.weUseTheContainer}>
      			<p className={styles.weUseThe}>
      				<span ref={(el) => (lineRefs.current[0] = el)} className={styles.animatedLine} style={{ animationDelay: '0s' }}>
      					We use the power of storytelling to
      				</span>
      			</p>
      			<p className={styles.weUseThe}>
      				<span ref={(el) => (lineRefs.current[1] = el)} className={styles.animatedLine} style={{ animationDelay: '0.4s' }}>
      					fire the imagination, stir the soul,
      				</span>
      			</p>
      			<p className={styles.weUseThe}>
      				<span ref={(el) => (lineRefs.current[2] = el)} className={styles.animatedLine} style={{ animationDelay: '0.8s' }}>
      					and ultimately inspire people.
      				</span>
      			</p>
    	</div>);
};

export default StorytellingHero;

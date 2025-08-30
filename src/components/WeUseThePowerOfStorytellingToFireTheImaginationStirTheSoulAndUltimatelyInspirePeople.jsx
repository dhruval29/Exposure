import React, { useEffect, useRef } from 'react';
import styles from './WeUseThePowerOfStorytellingToFireTheImaginationStirTheSoulAndUltimatelyInspirePeople.module.css';


const WeUseThePowerOfStorytellingToFireTheImaginationStirTheSoulAndUltimatelyInspirePeople = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.animate);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the element is visible
        rootMargin: '0px 0px -100px 0px' // Start animation slightly before fully in view
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  	return (
    		<div ref={containerRef} className={styles.weUseTheContainer}>
      			<p className={styles.weUseThe}>
      				<span className={styles.animatedLine} style={{ animationDelay: '0s' }}>
      					We use the power of storytelling to
      				</span>
      			</p>
      			<p className={styles.weUseThe}>
      				<span className={styles.animatedLine} style={{ animationDelay: '0.4s' }}>
      					fire the imagination, stir the soul,
      				</span>
      			</p>
      			<p className={styles.weUseThe}>
      				<span className={styles.animatedLine} style={{ animationDelay: '0.8s' }}>
      					and ultimately inspire people.
      				</span>
      			</p>
    		</div>);
};

export default WeUseThePowerOfStorytellingToFireTheImaginationStirTheSoulAndUltimatelyInspirePeople;

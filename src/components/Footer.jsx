import React, { useState, useRef, useEffect } from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleError = () => {
        console.log('Video failed to load, showing fallback background');
        setVideoError(true);
      };

      const handleLoad = () => {
        console.log('Video loaded successfully');
        setVideoError(false);
      };

      const handleCanPlay = () => {
        console.log('Video can play');
        setVideoError(false);
        // Try to play the video
        video.play().catch((error) => {
          console.log('Autoplay failed:', error);
          // Don't set videoError to true for autoplay failures
        });
      };

      video.addEventListener('error', handleError);
      video.addEventListener('loadeddata', handleLoad);
      video.addEventListener('canplay', handleCanPlay);

      return () => {
        video.removeEventListener('error', handleError);
        video.removeEventListener('loadeddata', handleLoad);
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, []);

  return (
    <footer id="site-footer" className={styles.footer}>
      {/* Video Background */}
      <video
        ref={videoRef}
        className={styles.videoBackground}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onError={() => setVideoError(true)}
        onLoadedData={() => setVideoError(false)}
      >
        <source src="/videos/24216-340670744_tiny.mp4" type="video/mp4" />
        {/* Fallback message for browsers that don't support video */}
        Your browser does not support the video tag.
      </video>
      
      {/* Fallback background color in case video fails to load */}
      <div className={`${styles.fallbackBackground} ${videoError ? styles.show : ''}`} />
      
      {/* Footer Content */}
      <div className={styles.footerContent}>
        <div className={styles.fromGoaWithContainer}>
          <p className={styles.fromGoa}>From Goa,</p>
          <p className={styles.fromGoa}>
            <span>With Love.</span>
          </p>
        </div>
        <nav className={styles.socialsParent} aria-label="Social media links">
          <a
            className={styles.instagram}
            href="https://www.instagram.com/exposure.explorers_nitg/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Instagram"
          >
            Instagram
          </a>
          <a
            className={styles.youtube}
            href="https://www.youtube.com/@Exposure-Explorers"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our YouTube channel"
          >
            YouTube
          </a>
          <a
            className={styles.linkedin}
            href="https://www.linkedin.com/company/exposure-explorers/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our LinkedIn page"
          >
            LinkedIn
          </a>
        </nav>
        <address className={styles.exposureExplorers}>© {currentYear} | Exposure Explorers</address>
        <div className={styles.exposureexplorersnitgoaaci}>exposure.explorers@nitgoa.ac.in</div>
        <div className={styles.designedDeveloped}>Designed & Developed by @dhr</div>
      </div>
    </footer>
  );
};

export default Footer;

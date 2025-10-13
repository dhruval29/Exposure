import React, { useState } from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [emailCopied, setEmailCopied] = useState(false);

  const copyEmailToClipboard = async () => {
    const email = 'exposure.explorers@nitgoa.ac.in';
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy email: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <footer id="site-footer" className={styles.footer}>
      {/* Static background */}
      <div className={styles.staticBackground} />
      
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
            href="https://www.instagram.com/exposure.explorers.nitg/"
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
        <address className={styles.exposureExplorers}>
          © {currentYear} | Content owned & curated<span className={styles.mobileLineBreak}> by Exposure Explorers</span>
        </address>
        <div 
          className={`${styles.exposureexplorersnitgoaaci} ${styles.clickableEmail}`}
          onClick={copyEmailToClipboard}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              copyEmailToClipboard();
            }
          }}
          aria-label={`Copy email to clipboard. ${emailCopied ? 'Email copied!' : 'Click to copy exposure.explorers@nitgoa.ac.in'}`}
          title={emailCopied ? 'Email copied!' : 'Click to copy email'}
        >
          {emailCopied ? 'Email copied!' : 'exposure.explorers@nitgoa.ac.in'}
        </div>
        <div className={styles.designedDeveloped}>Designed & Developed by @dhr</div>
      </div>
    </footer>
  );
};

export default Footer;

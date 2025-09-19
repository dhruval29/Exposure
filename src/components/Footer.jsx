import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div id="site-footer" className={styles.footer}>
      <div className={styles.fromGoaWithContainer}>
        <p className={styles.fromGoa}>From Goa,</p>
        <p className={styles.fromGoa}>
          <span>With Love.</span>
          <b className={styles.b}>{` `}</b>
        </p>
      </div>
      <div className={styles.socialsParent}>
        <div className={styles.socials}>Socials</div>
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
          className={styles.instagram}
          href="https://www.youtube.com/@Exposure-Explorers"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit our YouTube channel"
        >
          YouTube
        </a>
        <a
          className={styles.instagram}
          href="https://www.linkedin.com/company/exposure-explorers/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit our LinkedIn page"
        >
          LinkedIn
        </a>
      </div>
      <div className={styles.exposureExplorers}>© 2025 | Exposure Explorers</div>
      <div className={styles.designedDeveloped}>{`Designed & Developed by @DHR`}</div>
      <div className={styles.exposureexplorersnitgoaaci}>exposure.explorers@nitgoa.ac.in</div>
    </div>
  );
};

export default Footer;

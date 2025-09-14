import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.fromGoaWithContainer}>
        <p className={styles.fromGoa}>From Goa,</p>
        <p className={styles.fromGoa}>
          <span>With Love.</span>
          <b className={styles.b}>{` `}</b>
        </p>
      </div>
      <div className={styles.socialsParent}>
        <div className={styles.socials}>Socials</div>
        <div className={styles.instagram}>Instagram</div>
        <div className={styles.instagram}>Youtube</div>
        <div className={styles.instagram}>{`Linkedin `}</div>
      </div>
      <div className={styles.exposureExplorers}>© 2025 | Exposure Explorers</div>
      <div className={styles.designedDeveloped}>{`Designed & Developed by @DHR`}</div>
      <div className={styles.exposureexplorersnitgoaaci}>exposure.explorers@nitgoa.ac.in</div>
    </div>
  );
};

export default Footer;

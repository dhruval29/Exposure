import styles from './FRAME1.module.css';

const FRAME1 = () => {
  return (
    <div className={styles.frame1}>
      <div className={styles.meetTheTeamContainer}>
        <p className={styles.meetTheTeam}>
          <span>{`Meet the `}</span>
          <i className={styles.team}>Team</i>
          <span className={styles.team}>{` `}</span>
        </p>
      </div>
      <div className={styles.ourDedicatedTeamContainer}>
        <p className={styles.meetTheTeam}>Our dedicated team of photographers,</p>
        <p className={styles.meetTheTeam}>cinematographers and editors</p>
      </div>
      <img className={styles.frame1Child} src="/assets/images/members/IMG_20241227_204306.jpg" alt="" />
      <img className={styles.frame1Item} src="/assets/images/members/IMG_9352[1].jpg" alt="" />
      <img className={styles.frame1Inner} src="/assets/images/members/IMG_8107[1] (1).jpg" alt="" />
    </div>
  );
};

export default FRAME1;

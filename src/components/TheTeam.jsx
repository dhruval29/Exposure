import styles from './TheTeam.module.css';
import Lanyard from './Lanyard';

const TheTeam = () => {
  return (
    <div className={styles.theTeam}>
      <div className={styles.lineParent}>
        <div className={styles.frameChild} />
        <div className={styles.frameItem} />
        <div className={styles.frameInner} />
        <div className={styles.lineDiv} />
      </div>
      
      {/* Lanyard components positioned where the images were */}
      <div className={styles.lanyard0}>
        <div className={styles.lanyardNumber}>1</div>
        <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
      </div>
      <div className={styles.lanyard1}>
        <div className={styles.lanyardNumber}>2</div>
        <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
      </div>
      <div className={styles.lanyard2}>
        <div className={styles.lanyardNumber}>3</div>
        <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
      </div>
      <div className={styles.lanyard3}>
        <div className={styles.lanyardNumber}>4</div>
        <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
      </div>
      <div className={styles.lanyard4}>
        <div className={styles.lanyardNumber}>5</div>
        <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
      </div>
      
      <b className={styles.the}>{`the `}</b>
      <b className={styles.team}>team</b>
    </div>
  );
};

export default TheTeam;

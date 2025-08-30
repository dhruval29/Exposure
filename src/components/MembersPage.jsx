import styles from './Frame37.module.css';
import Lanyard from './Lanyard/Lanyard';

const MembersPage = () => {
  const items = Array.from({ length: 6 }).map((_, idx) => ({
    id: idx,
    // allow overlap: random negative-to-small-positive spacing
    marginLeft: idx === 0 ? 0 : Math.floor(-120 + Math.random() * 60),
    // minor camera variation for visual variety
    fov: 22 + (idx % 3) * 2,
    gravityY: -28 - (idx % 4) * 3,
  }));

  return (
    <div className={styles.frameParent}>
      <div className={styles.lineParent}>
        <div className={styles.frameChild} />
        <div className={styles.frameItem} />
        <div className={styles.frameInner} />
        <div className={styles.lineDiv} />
      </div>

      <div className={styles.lanyardRow}>
        {items.map((item) => (
          <div
            key={item.id}
            className={styles.lanyardItem}
            style={{ marginLeft: `${item.marginLeft}px` }}
          >
            <Lanyard position={[0, 0, 12]} gravity={[0, item.gravityY, 0]} fov={item.fov} />
          </div>
        ))}
      </div>

      <b className={styles.the}>{`the `}</b>
      <b className={styles.team}>team</b>
    </div>
  );
};

export default MembersPage;

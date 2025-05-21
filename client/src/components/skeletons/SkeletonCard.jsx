import styles from './SkeletonCard.module.css';

const SkeletonCard = () => (
  <div className={styles.card}>
  <div className={styles.textGroup}>
    <div className={styles.lineShort}></div>
    <div className={styles.lineMedium}></div>
    <div className={styles.subText}></div>
  </div>
  <div className={styles.circle}></div>
</div>
);

export default SkeletonCard;

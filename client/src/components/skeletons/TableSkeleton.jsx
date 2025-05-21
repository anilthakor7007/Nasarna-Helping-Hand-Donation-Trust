import styles from './TableSkeleton.module.css';

const TableSkeleton = () => {
  const fakeRows = new Array(5).fill(null);

  return (
    <div className={styles.wrapper}>
      <div className={styles.table}>
        <div className={styles.headerRow}>
          <div className={styles.headerCell}>NO</div>
          <div className={styles.headerCell}>TRUSTEE NAME</div>
          <div className={styles.headerCell}>DONORS</div>
        </div>
        {fakeRows.map((_, i) => (
          <div className={styles.skeletonRow} key={i}>
            <div className={styles.skeletonCell} style={{ width: '20px' }}></div>
            <div className={styles.skeletonCell} style={{ width: '70%' }}></div>
            <div className={styles.skeletonCell} style={{ width: '30px' }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;

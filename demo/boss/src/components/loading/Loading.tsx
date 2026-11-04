import styles from "./Loading.module.css";

export const Loading = () => (
  <div className={styles.cont}>
    <div className={styles.cubeWrapper}>
      <div className={styles.cubeFolding}>
        <span className={styles.leaf1} />
        <span className={styles.leaf2} />
        <span className={styles.leaf3} />
        <span className={styles.leaf4} />
      </div>
      <span className={styles.loading} data-name="Loading">
        Uysot
      </span>
    </div>
  </div>
);

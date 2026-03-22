import styles from './StatusStrip.module.css';

export default function StatusStrip({ character, timeDesc }) {
  return (
    <div className={styles.strip}>
      <span className={styles.location}>
        {character?.location?.replace(/_/g,' ')}
      </span>
      <span className={styles.sep}>—</span>
      <span className={styles.desc}>{timeDesc}</span>
    </div>
  );
}

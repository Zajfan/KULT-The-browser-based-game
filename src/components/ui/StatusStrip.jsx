import styles from './StatusStrip.module.css';

export default function StatusStrip({ character, timeDesc, onMenuToggle }) {
  return (
    <div className={styles.strip}>
      <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Open menu">☰</button>
      <span className={styles.location}>
        {character?.location?.replace(/_/g,' ')}
      </span>
      <span className={styles.sep}>—</span>
      <span className={styles.desc}>{timeDesc}</span>
    </div>
  );
}

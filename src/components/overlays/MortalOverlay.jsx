import styles from './MortalOverlay.module.css';

export default function MortalOverlay({ character, onSeekHelp, onDie }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.glyph}>☠</div>
        <h2 className={styles.title}>Mortal Wounds</h2>
        <p className={styles.text}>
          You are dying. Not metaphorically. The body you have spent your entire life assuming was permanent is
          failing in ways that are not reversible without immediate intervention. You have perhaps minutes.
        </p>
        <p className={styles.text}>
          The Illusion continues its performance around you. Nobody nearby is offering to help.
          This is how most Awakened die — not in confrontation with entities, but bleeding in an alley,
          having overestimated their own resilience.
        </p>
        <div className={styles.choices}>
          <button className='act act-danger act-lg' onClick={onSeekHelp}>
            Drag yourself to St. Aurum — spend ₮500
          </button>
          <button className='act act-sm' style={{opacity:0.5}} onClick={onDie}>
            Succumb
          </button>
        </div>
      </div>
    </div>
  );
}

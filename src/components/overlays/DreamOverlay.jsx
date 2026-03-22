import { useEffect, useState } from 'react';
import { getDreamPrompt, STATIC_DREAMS } from '../../data/dreaming.js';
import { useClaude } from '../../hooks/useClaude.js';
import styles from './DreamOverlay.module.css';

export default function DreamOverlay({ character, day, onDismiss }) {
  const { generateNarrative } = useClaude();
  const [text, setText] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const prompt = getDreamPrompt(character);
    generateNarrative(prompt).then(result => {
      if (cancelled) return;
      setText(result || STATIC_DREAMS[Math.floor(Math.random() * STATIC_DREAMS.length)]);
      setLoaded(true);
    }).catch(() => {
      if (!cancelled) {
        setText(STATIC_DREAMS[Math.floor(Math.random() * STATIC_DREAMS.length)]);
        setLoaded(true);
      }
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className={styles.overlay} onClick={loaded ? onDismiss : undefined}>
      <div className={styles.modal}>
        <div className={styles.eyebrow}>
          <span className={styles.dash}>—</span>
          Day {day - 1} ends. Day {day} begins.
          <span className={styles.dash}>—</span>
        </div>

        <div className={styles.dreamBlock}>
          <div className={styles.dreamLabel}>You dream.</div>
          {!loaded ? (
            <div className={styles.loading}>
              <span/><span/><span/>
            </div>
          ) : (
            <p className={`${styles.dreamText} ${styles.appear}`}>{text}</p>
          )}
        </div>

        {loaded && (
          <button className={styles.dismiss} onClick={onDismiss}>
            Wake up
          </button>
        )}
      </div>
    </div>
  );
}

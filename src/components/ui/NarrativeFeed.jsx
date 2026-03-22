import { useEffect, useRef } from 'react';
import styles from './NarrativeFeed.module.css';

const TYPE_COLOR = {
  system:'var(--ink-dim)', travel:'#4a7fc1',
  rest:'var(--vital-lit)', heal:'var(--vital-lit)',
  error:'var(--red-vivid)', complete:'var(--gold-lit)',
  partial:'#b87333', failure:'var(--red-vivid)',
  combat:'#e87a3a', combat_win:'var(--gold-lit)',
  flee:'var(--vital-lit)', flee_fail:'var(--red-lit)',
  crime_complete:'var(--gold-lit)', crime_partial:'#b87333', crime_failure:'var(--red-vivid)',
  ritual_complete:'var(--veil-vivid)', ritual_partial:'#9a7aff', ritual_failure:'var(--red-vivid)',
  item:'var(--ink)', equip:'var(--ink)', buy:'var(--gold)', sell:'var(--gold)',
};
const TYPE_GLYPH = {
  system:'◈', travel:'→', rest:'◎', heal:'+', error:'✖',
  complete:'✦', partial:'◆', failure:'✖',
  combat:'⚔', combat_win:'⚔', flee:'↩', flee_fail:'↩',
  crime_complete:'⚖', crime_partial:'⚖', crime_failure:'⚖',
  ritual_complete:'⛧', ritual_partial:'⛧', ritual_failure:'⛧',
  item:'◇', equip:'◇', buy:'₮', sell:'₮',
};

export default function NarrativeFeed({ log }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = 0;
  }, [log?.length]);

  return (
    <aside className={styles.feed}>
      <div className={styles.heading}>
        <span>Event Log</span>
        <span className={styles.count}>{log?.length ?? 0}</span>
      </div>
      <div className={styles.entries} ref={ref}>
        {(log || []).map(entry => (
          <div key={entry.id} className={styles.entry}>
            <span className={styles.glyph} style={{color: TYPE_COLOR[entry.type] || 'var(--ink-dim)'}}>
              {TYPE_GLYPH[entry.type] || '·'}
            </span>
            <div className={styles.body}>
              <span className={styles.time}>{entry.timestamp}</span>
              <p className={styles.text} style={{color: TYPE_COLOR[entry.type] || 'var(--ink)'}}>
                {entry.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

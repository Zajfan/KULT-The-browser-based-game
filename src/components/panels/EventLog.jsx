import { useEffect, useRef } from 'react';
import styles from './EventLog.module.css';

const LOG_COLORS = {
  system:        'var(--text-dim)',
  travel:        'var(--blue-vivid)',
  rest:          'var(--green-vivid)',
  heal:          'var(--green-vivid)',
  error:         'var(--red-vivid)',
  complete:      'var(--gold-bright)',
  partial:       '#b87333',
  failure:       'var(--red-accent)',
  combat:        '#e87a3a',
  combat_win:    'var(--gold-bright)',
  flee:          'var(--green-bright)',
  flee_fail:     'var(--red-accent)',
  crime_complete:'var(--gold-bright)',
  crime_partial: '#b87333',
  crime_failure: 'var(--red-vivid)',
  ritual_complete:'var(--purple-bright)',
  ritual_partial: '#9a8acd',
  ritual_failure: 'var(--red-vivid)',
  item:          'var(--text-primary)',
  equip:         'var(--text-primary)',
  buy:           'var(--gold-mid)',
  sell:          'var(--gold-mid)',
};

const LOG_ICONS = {
  system: '◈', travel: '→', rest: '◎', heal: '+', error: '✖',
  complete: '✦', partial: '◆', failure: '✖',
  combat: '⚔', combat_win: '⚔', flee: '↩', flee_fail: '↩',
  crime_complete: '⚖', crime_partial: '⚖', crime_failure: '⚖',
  ritual_complete: '⛧', ritual_partial: '⛧', ritual_failure: '⛧',
  item: '◇', equip: '◇', buy: '₮', sell: '₮',
};

export default function EventLog({ log }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log?.length]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.headerIcon}>◈</span>
        <span>Event Log</span>
        <span className={styles.count}>{log?.length || 0}</span>
      </div>
      <div className={styles.logBody}>
        {[...(log || [])].reverse().map((entry) => (
          <div key={entry.id} className={`${styles.entry} fade-in`}>
            <div className={styles.entryMeta}>
              <span className={styles.entryIcon} style={{ color: LOG_COLORS[entry.type] || 'var(--text-dim)' }}>
                {LOG_ICONS[entry.type] || '·'}
              </span>
              <span className={styles.entryTime}>{entry.timestamp}</span>
            </div>
            <p className={styles.entryText} style={{ color: LOG_COLORS[entry.type] || 'var(--text-primary)' }}>
              {entry.text}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

import { useState } from 'react';
import { getLoreForInsight, LORE_CATEGORIES } from '../../data/lore.js';
import styles from './LoreView.module.css';

export default function LoreView({ character }) {
  const entries = getLoreForInsight(character.insight);
  const locked  = 12 - entries.length; // total lore entries
  const [active, setActive] = useState(entries[0]?.id || null);
  const [filter, setFilter] = useState('All');

  const shown = filter === 'All' ? entries : entries.filter(e => e.category === filter);
  const current = entries.find(e => e.id === active);

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>The Codex</h2>
      <p className={styles.sub}>Knowledge accumulated through Awakening. {locked > 0 && <span className='dim'>{locked} entries locked behind higher Insight.</span>}</p>
      <div className='rule-gold' />

      <div className={styles.layout}>
        {/* Sidebar index */}
        <aside className={styles.index}>
          <div className={styles.filterRow}>
            {['All',...LORE_CATEGORIES].map(c => (
              <button key={c} className={`${styles.filterBtn} ${filter===c?styles.filterOn:''}`}
                onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
          <nav className={styles.entryList}>
            {shown.map(e => (
              <button key={e.id} className={`${styles.entryBtn} ${active===e.id?styles.entryOn:''}`}
                onClick={() => setActive(e.id)}>
                <span className={styles.eTitle}>{e.title}</span>
                <span className={`badge badge-dim`}>{e.category}</span>
              </button>
            ))}
            {shown.length === 0 && (
              <p className='italic dim' style={{fontSize:'0.78rem',padding:'12px 0'}}>
                No entries in this category at your current Insight.
              </p>
            )}
          </nav>
        </aside>

        {/* Entry body */}
        <main className={styles.entryBody}>
          {current ? (
            <div className={styles.entry} key={current.id}>
              <div className={styles.entryHeader}>
                <span className={`badge badge-dim`}>{current.category}</span>
                <h3 className={styles.entryTitle}>{current.title}</h3>
                <span className='mono dim' style={{fontSize:'0.62rem'}}>
                  Insight {current.insightRequired}+
                </span>
              </div>
              <div className={styles.entryText}>
                {current.body.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          ) : (
            <p className='italic dim'>Select an entry from the index.</p>
          )}
        </main>
      </div>
    </div>
  );
}

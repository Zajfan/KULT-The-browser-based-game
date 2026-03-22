import { FACTIONS, getFactionRank } from '../../data/factions.js';
import styles from './FactionsView.module.css';

export default function FactionsView({ character }) {
  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Allegiances</h2>
      <p className={styles.sub}>Power in the City of Chains moves through allegiance. Every choice you make is observed by someone.</p>
      <div className='rule-blood' />

      <div className={styles.list}>
        {Object.values(FACTIONS).map(f => {
          const standing = character.factionStandings?.[f.id] || 0;
          const rank = getFactionRank(standing);
          const isPrimary = f.id === character.faction;
          const pct = Math.min(Math.max((standing + 100) / 300 * 100, 0), 100);

          return (
            <div key={f.id} className={`${styles.faction} ${isPrimary ? styles.primary : ''}`}
              style={{'--fc': f.color}}>
              <div className={styles.fTop}>
                <span className={styles.fIcon}>{f.icon}</span>
                <div className={styles.fMeta}>
                  <div className={styles.fName}>{f.name}</div>
                  {isPrimary && <span className='badge badge-gold'>Primary</span>}
                </div>
                <div className={styles.fStanding}>
                  <span className={styles.fVal} style={{color: rank.color}}>{standing > 0 ? '+' : ''}{standing}</span>
                  <span className={styles.fRank} style={{color: rank.color}}>{rank.label}</span>
                </div>
              </div>

              <p className={styles.fDesc}>{f.description}</p>

              <div className={styles.fBar}>
                <div className={styles.fBarFill} style={{width:`${pct}%`, background: f.color}} />
                <div className={styles.fBarMid} />
              </div>

              {f.bonuses && (
                <div className={styles.bonuses}>
                  {Object.entries(f.bonuses).map(([k, v]) => (
                    <div key={k} className={styles.bonus}>
                      <span className={`badge ${k === 'enemies' ? 'badge-red' : 'badge-gold'}`}>{k}</span>
                      <span style={{fontSize:'0.72rem', color:'var(--ink-dim)'}}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { FACTIONS, getFactionRank } from '../../data/factions.js';
import styles from './FactionsPanel.module.css';

export default function FactionsPanel({ character }) {
  const { factionStandings, faction: primaryFaction } = character;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Factions</h2>
        <p className={styles.subtitle}>
          Power in the City of Chains moves through allegiance. Every choice you make is observed.
        </p>
      </div>

      <div className={styles.factionList}>
        {Object.values(FACTIONS).map(f => {
          const standing = factionStandings?.[f.id] || 0;
          const rank = getFactionRank(standing);
          const isPrimary = f.id === primaryFaction;
          const barPct = Math.min(Math.max((standing + 100) / 300 * 100, 0), 100);

          return (
            <div
              key={f.id}
              className={`${styles.factionCard} ${isPrimary ? styles.isPrimary : ''}`}
              style={{ '--fc': f.color }}
            >
              <div className={styles.factionTop}>
                <span className={styles.factionIcon}>{f.icon}</span>
                <div className={styles.factionMeta}>
                  <div className={styles.factionName}>{f.name}</div>
                  {isPrimary && <span className='tag tag-gold'>Primary Allegiance</span>}
                </div>
                <div className={styles.standingBlock}>
                  <span className={styles.standingVal} style={{ color: rank.color }}>{standing > 0 ? '+' : ''}{standing}</span>
                  <span className={styles.standingRank} style={{ color: rank.color }}>{rank.label}</span>
                </div>
              </div>

              <p className={styles.factionDesc}>{f.description}</p>

              <div className={styles.standingBar}>
                <div className={styles.standingFill} style={{ width: `${barPct}%`, background: f.color }} />
                <div className={styles.standingMid} />
              </div>

              {f.bonuses && (
                <div className={styles.bonusList}>
                  {Object.entries(f.bonuses).map(([k, v]) => (
                    <div key={k} className={styles.bonusItem}>
                      <span className={`tag ${k === 'enemies' ? 'tag-red' : 'tag-gold'}`}>{k}</span>
                      <span className={styles.bonusText}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.lore}>
        <p>
          Standing rises through aligned actions, completing faction missions, and committing acts that serve
          their agenda. Standing falls when you work against them or aid their enemies.
          At Inner Circle standing, hidden faction abilities become available.
        </p>
      </div>
    </div>
  );
}

import { FACTIONS } from '../../data/factions.js';
import { deleteSave } from '../../utils/saveLoad.js';
import styles from './StatsPanel.module.css';

const STAT_ROWS = [
  ['actionsPerformed', 'Actions Performed'],
  ['crimesCommitted',  'Crimes Committed'],
  ['entitiesDefeated', 'Entities Defeated'],
  ['ritualsPerformed', 'Rituals Performed'],
  ['stabilityLost',    'Total Stability Lost'],
  ['insightGained',    'Total Insight Gained'],
  ['thalersEarned',    'Total Thalers Earned'],
  ['daysPlayed',       'Days in the Illusion'],
];

export default function StatsPanel({ character }) {
  const { name, darkSecret, advantages, disadvantages, attributes, stats, ascensionProgress, guiltStacks, faction, createdAt } = character;

  const sessionTime = createdAt ? Math.floor((Date.now() - createdAt) / 60000) : 0;

  const handleDeleteSave = () => {
    if (window.confirm('Delete save and return to title? This cannot be undone.')) {
      deleteSave();
      window.location.reload();
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Identity */}
      <div className={styles.identityCard}>
        <div className={styles.glyph}>⛧</div>
        <div className={styles.identityInfo}>
          <div className={styles.identityName}>{name}</div>
          <div className={styles.identitySecret}>{darkSecret?.name} — {darkSecret?.subtitle}</div>
          <p className={styles.identityAbility}>{darkSecret?.specialAbility}</p>
        </div>
      </div>

      <div className={styles.columns}>
        {/* Statistics */}
        <div>
          <div className={styles.sectionTitle}>Statistics</div>
          <div className={styles.statList}>
            {STAT_ROWS.map(([key, label]) => (
              <div key={key} className={styles.statRow}>
                <span className={styles.statLabel}>{label}</span>
                <span className={styles.statVal}>{stats?.[key] ?? 0}</span>
              </div>
            ))}
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Session Time</span>
              <span className={styles.statVal}>{sessionTime}m</span>
            </div>
          </div>
        </div>

        {/* Progression */}
        <div>
          <div className={styles.sectionTitle}>Progression</div>
          <div className={styles.progressBlock}>
            <div className={styles.progressItem}>
              <span className={styles.progressLabel}>Ascension Progress</span>
              <div className={styles.bar}>
                <div className={styles.barFill} style={{ width: `${Math.min(ascensionProgress || 0, 100)}%`, background: 'var(--purple-bright)' }} />
              </div>
              <span className={styles.progressVal}>{ascensionProgress || 0}/100</span>
            </div>
            <div className={styles.progressItem}>
              <span className={styles.progressLabel}>Guilt Stacks</span>
              <div className={styles.guiltPips}>
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className={`${styles.pip} ${i < (guiltStacks || 0) ? styles.pipFull : ''}`} />
                ))}
              </div>
              <span className={styles.progressNote}>At 5 stacks, a supernatural entity manifests.</span>
            </div>
          </div>

          <div className={styles.sectionTitle} style={{ marginTop: 16 }}>Advantages</div>
          {advantages?.length > 0 ? (
            <div className={styles.traitList}>
              {advantages.map(adv => (
                <div key={adv.id} className={styles.traitItem}>
                  <span className='tag tag-gold'>{adv.name}</span>
                  <span className={styles.traitDesc}>{adv.description}</span>
                </div>
              ))}
            </div>
          ) : <p className={styles.none}>No advantages selected.</p>}

          {disadvantages?.length > 0 && (
            <>
              <div className={styles.sectionTitle} style={{ marginTop: 14 }}>Disadvantages</div>
              <div className={styles.traitList}>
                {disadvantages.map(dis => (
                  <div key={dis.id} className={styles.traitItem}>
                    <span className='tag tag-red'>{dis.name}</span>
                    <span className={styles.traitDesc}>{dis.description}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Danger zone */}
      <div className={styles.dangerZone}>
        <span className={styles.dangerLabel}>⚠ Danger Zone</span>
        <button className='btn btn-danger btn-sm' onClick={handleDeleteSave}>
          Delete Save & Restart
        </button>
      </div>
    </div>
  );
}

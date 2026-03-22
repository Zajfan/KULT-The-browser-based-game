import { RITUALS, getRitualsForInsight } from '../../data/rituals.js';
import styles from './RitualsPanel.module.css';

export default function RitualsPanel({ character, onPerform }) {
  const available = getRitualsForInsight(character.insight);
  const locked = RITUALS.filter(r => r.insightRequired > character.insight);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Rituals & Dark Rites</h2>
          <p className={styles.subtitle}>Knowledge that was never meant for human minds. Every ritual costs something.</p>
        </div>
        <div className={styles.insightDisplay}>
          <div className={styles.insightLabel}>Insight</div>
          <div className={styles.insightPips}>
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className={`${styles.pip} ${i < character.insight ? styles.pipFull : ''}`} />
            ))}
          </div>
          <div className={styles.insightVal}>{character.insight}/10</div>
        </div>
      </div>

      {available.length === 0 && (
        <div className={styles.noRituals}>
          <span className={styles.noRitualsGlyph}>⛧</span>
          <p>You lack the Insight to perceive the rituals beneath the Illusion.</p>
          <p className={styles.hint}>Gain Insight through investigation, communion with entities, and forbidden knowledge.</p>
        </div>
      )}

      <div className={styles.ritualList}>
        {available.map(ritual => {
          const canAffordAP = character.ap >= ritual.apCost;
          const canAffordThalers = character.thalers >= ritual.thalerCost;
          const canDo = canAffordAP && canAffordThalers;

          return (
            <div key={ritual.id} className={`${styles.ritualCard} ${!canDo ? styles.disabled : ''}`}>
              <div className={styles.ritualHeader}>
                <div>
                  <span className={styles.ritualName}>{ritual.name}</span>
                  <span className={`tag tag-purple`} style={{ marginLeft: 8 }}>Tier {ritual.tier}</span>
                </div>
                <div className={styles.ritualCosts}>
                  <span className={`${styles.cost} ${!canAffordAP ? 'red' : ''}`}>{ritual.apCost} AP</span>
                  {ritual.thalerCost > 0 && <span className={`${styles.cost} ${!canAffordThalers ? 'red' : ''}`}>₮{ritual.thalerCost}</span>}
                </div>
              </div>

              <p className={styles.ritualDesc}>{ritual.description}</p>

              <div className={styles.ritualMeta}>
                <span className={styles.metaItem}>Rolls: <span className='gold'>{ritual.attribute}</span></span>
                <span className={styles.metaItem}>
                  Stability Risk: <span style={{ color: ritual.stabilityRisk > 2 ? 'var(--red-vivid)' : 'var(--red-accent)' }}>
                    −{ritual.stabilityRisk}
                  </span>
                </span>
                {ritual.gainInsight && <span className={styles.metaItem}>Can gain <span className='gold'>+1 Insight</span></span>}
              </div>

              <div className={styles.outcomes}>
                <div className={styles.outcome}><span className='outcome-complete'>✦</span> {ritual.successText}</div>
                <div className={styles.outcome}><span className='outcome-partial'>◆</span> {ritual.partialText}</div>
                <div className={styles.outcome}><span className='outcome-failure'>✖</span> {ritual.failureText}</div>
              </div>

              <button
                className={`btn btn-lg ${styles.performBtn}`}
                style={{ background: 'rgba(26,10,61,0.6)', borderColor: 'var(--purple-bright)', color: 'var(--purple-bright)' }}
                onClick={() => onPerform(ritual)}
                disabled={!canDo}
              >
                ⛧ Perform Ritual
              </button>
            </div>
          );
        })}
      </div>

      {locked.length > 0 && (
        <div className={styles.lockedSection}>
          <div className={styles.lockedTitle}>Locked Rituals</div>
          {locked.map(r => (
            <div key={r.id} className={styles.lockedItem}>
              <span className={styles.lockedName}>{r.name}</span>
              <span className={styles.lockedReq}>Requires Insight {r.insightRequired}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

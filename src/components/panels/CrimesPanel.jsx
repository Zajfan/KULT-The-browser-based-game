import { CRIMES, getCrimesForInsight } from '../../data/crimes.js';
import styles from './CrimesPanel.module.css';

const TIER_LABELS = ['', 'Street', 'Mid-level', 'Professional', 'Organized', 'Elite'];
const RISK_COLORS = { arrest: '#b87333', violence: 'var(--red-accent)', supernatural: 'var(--purple-bright)', everything: 'var(--red-vivid)' };

export default function CrimesPanel({ character, onCommit }) {
  const available = getCrimesForInsight(character.insight);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Criminal Activities</h2>
          <p className={styles.subtitle}>The city runs on fear, money, and silence. You have learned to exploit all three.</p>
        </div>
        <div className={styles.nerveDisplay}>
          <div className={styles.nerveLabel}>Nerve</div>
          <div className={styles.nerveBar}>
            <div className={styles.nerveFill} style={{ width: `${(character.nerve / character.maxNerve) * 100}%` }} />
          </div>
          <div className={styles.nerveVal}>{Math.floor(character.nerve)}/{character.maxNerve}</div>
        </div>
      </div>

      <div className={styles.crimeList}>
        {available.map(crime => {
          const canAffordNerve = character.nerve >= crime.nerveCost;
          const canAffordAP = character.ap >= crime.apCost;
          const canDo = canAffordNerve && canAffordAP;

          return (
            <div key={crime.id} className={`${styles.crimeCard} ${!canDo ? styles.crimeDisabled : ''}`}>
              <div className={styles.crimeHeader}>
                <div className={styles.crimeInfo}>
                  <span className={styles.crimeName}>{crime.name}</span>
                  <span className={`tag tag-dim`}>Tier {crime.tier} — {TIER_LABELS[crime.tier]}</span>
                </div>
                <div className={styles.crimeCosts}>
                  <span className={`${styles.cost} ${!canAffordAP ? 'red' : ''}`}>{crime.apCost} AP</span>
                  <span className={`${styles.cost} ${!canAffordNerve ? 'red' : ''}`}>{crime.nerveCost} Nerve</span>
                </div>
              </div>

              <p className={styles.crimeDesc}>{crime.description}</p>

              <div className={styles.crimeMeta}>
                <div className={styles.crimeAttribute}>
                  Rolls: <span className='gold'>{crime.attribute}</span>
                </div>
                <div className={styles.crimeRisk} style={{ color: RISK_COLORS[crime.risk] }}>
                  Risk: {crime.risk}
                </div>
                {crime.reward && crime.reward[1] > 0 && (
                  <div className={styles.crimeReward}>
                    Reward: <span className='gold'>₮{crime.reward[0]}–{crime.reward[1]}</span>
                  </div>
                )}
                {crime.rewardInsight && (
                  <div className={styles.crimeReward}>Insight +1</div>
                )}
                {crime.stabilityLoss && (
                  <div style={{ color: 'var(--red-accent)', fontSize: '0.72rem' }}>
                    Stability −{crime.stabilityLoss} on failure
                  </div>
                )}
              </div>

              <div className={styles.crimeOutcomes}>
                <div className={styles.outcome}><span className='outcome-complete'>✦ Success</span> {crime.successText}</div>
                <div className={styles.outcome}><span className='outcome-partial'>◆ Partial</span> {crime.partialText}</div>
                <div className={styles.outcome}><span className='outcome-failure'>✖ Failure</span> {crime.failureText}</div>
              </div>

              <button
                className={`btn btn-primary ${styles.commitBtn}`}
                onClick={() => onCommit(crime)}
                disabled={!canDo}
              >
                ⚖ Commit Crime
              </button>
            </div>
          );
        })}
      </div>

      {CRIMES.filter(c => c.unlockInsight > character.insight).length > 0 && (
        <div className={styles.lockedNote}>
          {CRIMES.filter(c => c.unlockInsight > character.insight).length} crimes locked behind higher Insight.
          Increase your Insight by uncovering the true nature of reality.
        </div>
      )}
    </div>
  );
}

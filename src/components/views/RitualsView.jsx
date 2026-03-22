import { getRitualsForInsight, RITUALS } from '../../data/rituals.js';
import styles from './RitualsView.module.css';

export default function RitualsView({ character, onPerform }) {
  const available = getRitualsForInsight(character.insight);
  const locked    = RITUALS.filter(r => r.insightRequired > character.insight);

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Rites & Rituals</h2>
      <p className={styles.sub}>Knowledge that was never meant to exist in human minds. Every ritual takes something. The question is whether you can afford what it takes.</p>
      <div className='rule-blood' />

      {available.length === 0 && (
        <p className='italic dim' style={{marginTop:20}}>Your Insight is too low to perceive the rituals beneath the Illusion. Investigate, commune, and uncover. The rites will become visible when you are ready.</p>
      )}

      <div className={styles.list}>
        {available.map(r => {
          const okAP  = character.ap >= r.apCost;
          const okT   = character.thalers >= r.thalerCost;
          const ok    = okAP && okT;
          return (
            <div key={r.id} className={styles.ritual}>
              <div className={styles.ritHead}>
                <span className={styles.ritName}>{r.name}</span>
                <span className='badge badge-veil'>Tier {r.tier}</span>
              </div>
              <p className={styles.ritDesc}>{r.description}</p>
              <div className={styles.ritMeta}>
                <span className='mono dim' style={{fontSize:'0.67rem'}}>
                  {r.apCost} AP{r.thalerCost>0?` · ₮${r.thalerCost}`:''} · rolls <span className='gold'>{r.attribute}</span>
                </span>
                <span className='red' style={{fontSize:'0.67rem', fontStyle:'italic'}}>stability risk −{r.stabilityRisk}</span>
                {r.gainInsight && <span className='gold' style={{fontSize:'0.67rem'}}>can gain Insight</span>}
              </div>
              <div className={styles.outcomes}>
                <span className='out-complete'>✦</span> {r.successText} &nbsp;
                <span className='out-failure'>✖</span> {r.failureText}
              </div>
              <button className='act act-veil act-sm' onClick={()=>onPerform(r)} disabled={!ok}>
                ⛧ Perform Ritual
              </button>
            </div>
          );
        })}
      </div>

      {locked.length > 0 && (
        <>
          <div className='rule-gold' style={{marginTop:28}} />
          <div className={styles.lockedSection}>
            <div className={styles.lockedHead}>Locked Rites — Increase Insight to Unlock</div>
            {locked.map(r => (
              <div key={r.id} className={styles.lockedItem}>
                <span className='dim'>{r.name}</span>
                <span className='mono dim' style={{fontSize:'0.67rem'}}>Insight {r.insightRequired}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

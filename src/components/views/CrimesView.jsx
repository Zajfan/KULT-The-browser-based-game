import { getCrimesForInsight } from '../../data/crimes.js';
import styles from './CrimesView.module.css';

const RISK_C = { arrest:'var(--gold)', violence:'var(--red-lit)', supernatural:'var(--veil-vivid)', everything:'var(--red-vivid)' };

export default function CrimesView({ character, onCommit }) {
  const crimes = getCrimesForInsight(character.insight);

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h2 className={styles.title}>Criminal Affairs</h2>
        <p className={styles.sub}>The city runs on fear, money, and silence. You have learned to exploit all three.</p>
      </div>
      <div className='rule-blood' />

      <div className={styles.nerveRow}>
        <span className='mono dim' style={{fontSize:'0.7rem'}}>NERVE</span>
        <div className={styles.nervePips}>
          {Array.from({length:10},(_,i)=>(
            <div key={i} className={`${styles.pip} ${i < Math.floor(character.nerve/5) ? styles.pipOn : ''}`} />
          ))}
        </div>
        <span className='mono' style={{fontSize:'0.72rem', color:'var(--veil-vivid)'}}>{Math.floor(character.nerve)}/{character.maxNerve}</span>
      </div>

      <div className={styles.crimeList}>
        {crimes.map(crime => {
          const okNerve = character.nerve >= crime.nerveCost;
          const okAP    = character.ap >= crime.apCost;
          const ok      = okNerve && okAP;
          return (
            <div key={crime.id} className={`${styles.crime} ${!ok?styles.dim:''}`}>
              <div className={styles.crimeHead}>
                <span className={styles.crimeName}>{crime.name}</span>
                <span className='badge badge-dim'>Tier {crime.tier}</span>
              </div>
              <p className={styles.crimeDesc}>{crime.description}</p>
              <div className={styles.crimeMeta}>
                <span className='mono dim' style={{fontSize:'0.67rem'}}>
                  {crime.apCost} AP · {crime.nerveCost} Nerve · rolls <span className='gold'>{crime.attribute}</span>
                </span>
                <span style={{color: RISK_C[crime.risk]||'var(--ink-dim)', fontSize:'0.67rem', fontStyle:'italic'}}>risk: {crime.risk}</span>
                {crime.reward?.[1] > 0 && <span className='mono gold' style={{fontSize:'0.67rem'}}>₮{crime.reward[0]}–{crime.reward[1]}</span>}
              </div>
              <div className={styles.outcomes}>
                <span className='out-complete'>✦</span> {crime.successText}
                {' / '}
                <span className='out-partial'>◆</span> {crime.partialText}
              </div>
              <button className='act act-danger act-sm' onClick={()=>onCommit(crime)} disabled={!ok}>
                Commit — {crime.nerveCost} Nerve
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

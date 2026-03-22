import { useState, useMemo } from 'react';
import styles from './BreakdownOverlay.module.css';
const TYPES=[{id:'dissociation',name:'Dissociative Episode',desc:"You lose six hours. When you come back you're in a different part of the city. You have done things you cannot account for.",effect:'AP +50, Nerve −30, Insight +1.',fx:{nerve:-30,insightGain:1,apRestore:50}},{id:'revelation',name:'Forced Revelation',desc:'The Illusion tears for thirty seconds. You see everything — the city as it truly is. Beautiful and unbearable in equal measure.',effect:'Stability restored to 1, Insight +2.',fx:{stabilityRestore:1,insightGain:2}},{id:'catatonia',name:'Catatonic State',desc:'You stop. For three days you are simply absent. Something moved through the city while you were gone.',effect:'AP fully restored, Stability +2.',fx:{apRestore:100,stabilityRestore:2}},{id:'violence',name:'Uncontrolled Violence',desc:"Something in you acts. You come back to yourself with blood on your hands and no memory of the intervening time.",effect:'₮400 taken, Guilt +2, Stability +2.',fx:{thalers:400,guiltStacks:2,stabilityRestore:2}},{id:'contact',name:'Uninvited Contact',desc:'Your collapse creates a gap. Something uses it. The exchange is brief, non-consensual, and educational.',effect:'Stability +1, Insight +1.',fx:{insightGain:1,stabilityRestore:1,factionReward:{faction:'death_angel_aligned',amount:10}}}];
export default function BreakdownOverlay({ character, onResolve }) {
  const [seen, setSeen] = useState(false);
  const bd = useMemo(()=>TYPES[Math.floor(Math.random()*TYPES.length)],[]);
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.hGlyph}>♥</span>
          <div><div className={styles.hTitle}>Stability Breakdown</div><div className={styles.hSub}>The weight of the Illusion has become too much.</div></div>
        </div>
        <div className={styles.body}>
          {!seen ? (
            <>
              <p className={styles.intro}>Your Stability has collapsed. What happens in the space of a breakdown is not always under your control. Sometimes something else takes over.</p>
              <button className='act act-danger act-lg act-block' onClick={()=>setSeen(true)}>◈ Face what happens</button>
            </>
          ) : (
            <div className={styles.bd} style={{animationName:'fade-in-up'}}>
              <div className={styles.bdName}>{bd.name}</div>
              <p className={styles.bdDesc}>{bd.desc}</p>
              <div className={styles.bdEffect}>
                <span className={styles.efLabel}>Effect</span>
                <p>{bd.effect}</p>
              </div>
              <button className='act act-block' style={{borderColor:'var(--red-lit)',color:'var(--red-vivid)',background:'color-mix(in oklch,var(--blood-deep) 30%,transparent)',marginTop:12}} onClick={()=>onResolve(bd.fx)}>
                Return to Awareness
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

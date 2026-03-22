import { useState } from 'react';
import { rollCheck } from '../../utils/dice.js';
import styles from './EventOverlay.module.css';
export default function EventOverlay({ event, character, onResolve, onDismiss }) {
  const [result, setResult] = useState(null);
  const pick = (choice) => {
    if (result) return;
    let outcome, text, rewards={}, consequences={};
    if (choice.autoResult) {
      outcome=choice.autoResult; text=choice.text;
      if (choice.insightGain) rewards.insightGain=choice.insightGain;
    } else {
      const roll = rollCheck(character.attributes[choice.attribute]||0);
      outcome=roll.outcome;
      if (outcome==='complete')      { text=choice.successText; rewards.thalers=choice.thalers?.complete; rewards.insightGain=choice.insightGain?.complete; consequences.stabilityLoss=choice.stabilityLoss?.complete; }
      else if (outcome==='partial')  { text=choice.partialText; rewards.thalers=choice.thalers?.partial; rewards.insightGain=choice.insightGain?.partial; consequences.stabilityLoss=choice.stabilityLoss?.partial; }
      else                           { text=choice.failureText; rewards.thalers=choice.thalers?.failure; consequences.stabilityLoss=choice.stabilityLoss?.failure; }
      if (choice.factionReward) rewards.factionReward={faction:choice.factionReward.faction, amount:choice.factionReward.amount?.[outcome]};
    }
    Object.keys(rewards).forEach(k=>{ if(!rewards[k]) delete rewards[k]; });
    Object.keys(consequences).forEach(k=>{ if(!consequences[k]) delete consequences[k]; });
    setResult({outcome, text, rewards, consequences});
    onResolve(outcome, rewards, consequences);
  };
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={`badge ${event.type==='supernatural'?'badge-veil':'badge-dim'}`}>{event.type==='supernatural'?'Supernatural':'Encounter'}</span>
          <h2 className={styles.title}>{event.title}</h2>
        </div>
        <div className={styles.body}>
          <p className={styles.text}>{event.text}</p>
          {!result ? (
            <div className={styles.choices}>
              {event.choices.map((c,i)=>(
                <button key={i} className={styles.choice} onClick={()=>pick(c)}>
                  <span className={styles.choiceLabel}>{c.label}</span>
                  <div className={styles.choiceMeta}>
                    {c.attribute && <span className='mono dim' style={{fontSize:'0.67rem'}}>rolls <span className='gold'>{c.attribute}</span> ({character.attributes[c.attribute]>=0?'+':''}{character.attributes[c.attribute]||0})</span>}
                    {c.apCost>0 && <span className='mono' style={{fontSize:'0.67rem',color:'var(--veil-lit)'}}>{c.apCost} AP</span>}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className={`${styles.result} ${styles[result.outcome]}`}>
              <div className={styles.outcomeLabel}>
                {result.outcome==='complete'?'✦ Complete Success':result.outcome==='partial'?'◆ Partial Success':'✖ Failure'}
              </div>
              <p className={styles.resultText}>{result.text}</p>
              <div className={styles.tags}>
                {result.rewards.thalers>0 && <span className='badge badge-gold'>₮+{result.rewards.thalers}</span>}
                {result.rewards.insightGain>0 && <span className='badge badge-gold'>Insight +{result.rewards.insightGain}</span>}
                {result.consequences.stabilityLoss>0 && <span className='badge badge-red'>Stability −{result.consequences.stabilityLoss}</span>}
              </div>
              <button className='act act-sm' style={{marginTop:10}} onClick={onDismiss}>Continue</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { rollCheck } from '../../utils/dice.js';
import styles from './DAEventOverlay.module.css';

export default function DAEventOverlay({ event, deathAngel, character, onResolve, onDismiss }) {
  const [chosen, setChosen] = useState(null);

  const handleChoice = (choice) => {
    if (chosen) return;
    let outcome = choice.outcome;
    // If outcome is 'partial', roll to determine if complete or partial
    if (outcome === 'partial') {
      const roll = rollCheck(character.attributes.willpower || 0);
      outcome = roll.outcome;
    }
    setChosen({ choice, outcome });
    const rewards = {};
    const consequences = {};
    if (choice.insightGain) rewards.insightGain = choice.insightGain;
    if (choice.stabilityLoss) consequences.stabilityLoss = choice.stabilityLoss;
    onResolve(outcome, rewards, consequences);
  };

  const outcomeText = chosen?.outcome === 'complete' ? chosen.choice.text
    : chosen?.outcome === 'partial' ? chosen.choice.text
    : chosen?.choice.text;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.daIcon}>{deathAngel?.icon || '⛧'}</span>
          <div>
            <div className={styles.daName}>{deathAngel?.name || 'Your Patron'}</div>
            <div className={styles.daSub}>{deathAngel?.title}</div>
          </div>
          <span className={styles.eventTitle}>{event.title}</span>
        </div>

        <div className={styles.body}>
          <p className={styles.text}>{event.text}</p>

          {!chosen ? (
            <div className={styles.choices}>
              {event.choices.map((c, i) => (
                <button key={i} className={styles.choice} onClick={() => handleChoice(c)}>
                  <span className={styles.choiceLabel}>{c.label}</span>
                  <div className={styles.choiceTags}>
                    {c.insightGain && <span className='badge badge-gold'>Insight +{c.insightGain}</span>}
                    {c.stabilityLoss > 0 && <span className='badge badge-red'>Stability −{c.stabilityLoss}</span>}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.result}>
              <div className={styles.resultOutcome}>
                {chosen.outcome === 'complete' ? '✦ Complete' : chosen.outcome === 'partial' ? '◆ Partial' : '✖'}
              </div>
              <p className={styles.resultText}>{outcomeText}</p>
              <div className={styles.aspect}>
                <span className={styles.aspectLabel}>Domain</span>
                <span>{deathAngel?.aspect}</span>
              </div>
              <button className='act act-sm' style={{marginTop:10}} onClick={onDismiss}>Continue</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

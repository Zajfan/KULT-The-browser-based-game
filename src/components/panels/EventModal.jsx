import { useState } from 'react';
import { rollCheck } from '../../utils/dice.js';
import styles from './EventModal.module.css';

export default function EventModal({ event, character, onResolve, onDismiss }) {
  const [resolved, setResolved] = useState(null);
  const [choiceIdx, setChoiceIdx] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChoice = (choice, idx) => {
    if (resolved) return;
    setChoiceIdx(idx);

    let outcome, resultText, rewards = {}, consequences = {};

    if (choice.autoResult) {
      outcome = choice.autoResult;
      resultText = choice.text;
      if (choice.insightGain) rewards.insightGain = choice.insightGain;
    } else {
      const roll = rollCheck(character.attributes[choice.attribute] || 0);
      outcome = roll.outcome;

      if (outcome === 'complete') {
        resultText = choice.successText;
        rewards.thalers = choice.thalers?.complete;
        rewards.insightGain = choice.insightGain?.complete;
        rewards.factionReward = choice.factionReward
          ? { faction: choice.factionReward.faction, amount: choice.factionReward.amount?.complete }
          : undefined;
        consequences.stabilityLoss = choice.stabilityLoss?.complete;
      } else if (outcome === 'partial') {
        resultText = choice.partialText;
        rewards.thalers = choice.thalers?.partial;
        rewards.insightGain = choice.insightGain?.partial;
        rewards.factionReward = choice.factionReward
          ? { faction: choice.factionReward.faction, amount: choice.factionReward.amount?.partial }
          : undefined;
        consequences.stabilityLoss = choice.stabilityLoss?.partial;
      } else {
        resultText = choice.failureText;
        rewards.thalers = choice.thalers?.failure;
        rewards.insightGain = choice.insightGain?.failure;
        consequences.stabilityLoss = choice.stabilityLoss?.failure;
      }
    }

    // Filter out undefined/zero values
    if (!rewards.thalers) delete rewards.thalers;
    if (!rewards.insightGain) delete rewards.insightGain;
    if (!rewards.factionReward?.amount) delete rewards.factionReward;
    if (!consequences.stabilityLoss) delete consequences.stabilityLoss;

    setResolved({ outcome, resultText, rewards, consequences });
    onResolve(outcome, rewards, consequences, event.id);
  };

  const typeTag = event.type === 'supernatural' ? { label: 'Supernatural', cls: 'tag-purple' }
    : { label: 'Encounter', cls: 'tag-dim' };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={`tag ${typeTag.cls}`}>{typeTag.label}</span>
          <h2 className={styles.title}>{event.title}</h2>
        </div>

        <div className={styles.body}>
          <p className={styles.text}>{event.text}</p>

          {!resolved && (
            <div className={styles.choices}>
              {event.choices.map((choice, idx) => (
                <button
                  key={idx}
                  className={styles.choiceBtn}
                  onClick={() => handleChoice(choice, idx)}
                >
                  <span className={styles.choiceLabel}>{choice.label}</span>
                  <div className={styles.choiceMeta}>
                    {choice.attribute && (
                      <span className={styles.choiceAttr}>
                        Rolls: <span className='gold'>{choice.attribute}</span>
                        {' '}({character.attributes[choice.attribute] >= 0 ? '+' : ''}{character.attributes[choice.attribute] || 0})
                      </span>
                    )}
                    {choice.apCost > 0 && (
                      <span className={styles.choiceCost}>{choice.apCost} AP</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {resolved && (
            <div className={`${styles.result} ${styles[resolved.outcome]}`}>
              <div className={styles.resultOutcome}>
                {resolved.outcome === 'complete' ? '✦ Complete Success'
                  : resolved.outcome === 'partial' ? '◆ Partial Success'
                  : '✖ Failure'}
              </div>
              <p className={styles.resultText}>{resolved.resultText}</p>

              <div className={styles.resultRewards}>
                {resolved.rewards.thalers > 0 && (
                  <span className='tag tag-gold'>₮+{resolved.rewards.thalers}</span>
                )}
                {resolved.rewards.thalers < 0 && (
                  <span className='tag tag-red'>₮{resolved.rewards.thalers}</span>
                )}
                {resolved.rewards.insightGain > 0 && (
                  <span className='tag tag-gold'>Insight +{resolved.rewards.insightGain}</span>
                )}
                {resolved.consequences.stabilityLoss > 0 && (
                  <span className='tag tag-red'>Stability −{resolved.consequences.stabilityLoss}</span>
                )}
              </div>

              <button className='btn btn-primary' onClick={onDismiss} style={{ marginTop: 10 }}>
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

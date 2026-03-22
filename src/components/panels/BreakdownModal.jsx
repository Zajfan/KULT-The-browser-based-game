import { useState } from 'react';
import styles from './BreakdownModal.module.css';

const BREAKDOWN_TYPES = [
  {
    id: 'dissociation',
    name: 'Dissociative Episode',
    description: 'You lose six hours. When you come back, you are in a different part of the city. You have done things you cannot account for. Some of them may have been necessary.',
    effect: 'You wake elsewhere. Nerve depleted. One item missing from inventory.',
    mechanicalEffect: { nerve: -30, insightGain: 1 },
  },
  {
    id: 'revelation',
    name: 'Forced Revelation',
    description: 'The Illusion tears completely for thirty seconds. You see everything — the city as it truly is, the entities moving through it, the architecture of your prison. It is beautiful and it is unbearable.',
    effect: 'Clarity at a cost. Insight +2. Stability recovers to 1 but you carry the vision permanently.',
    mechanicalEffect: { stabilityRestore: 1, insightGain: 2 },
  },
  {
    id: 'catatonia',
    name: 'Catatonic State',
    description: 'You stop. For three days, as far as anyone can tell, you are simply absent. When you return, you are not sure you left.',
    effect: 'AP restored. Time lost. Something found you while you were absent.',
    mechanicalEffect: { apRestore: 100, stabilityRestore: 2 },
  },
  {
    id: 'violence',
    name: 'Uncontrolled Violence',
    description: 'Something in you — not you, but yours — acts. You come back to yourself with blood on your hands and no memory of the intervening time. The guilt stacks.',
    effect: 'Thalers gained (taken). Guilt +2. Stability restores to 2.',
    mechanicalEffect: { thalers: 400, guiltStacks: 2, stabilityRestore: 2 },
  },
  {
    id: 'contact',
    name: 'Uninvited Contact',
    description: 'Your collapse creates a gap. Something uses it. The contact is brief, non-consensual, and educational in the worst possible way.',
    effect: 'Entity makes contact. Insight +1. New information. Stability restores to 1.',
    mechanicalEffect: { insightGain: 1, stabilityRestore: 1, factionReward: { faction: 'death_angel_aligned', amount: 10 } },
  },
];

export default function BreakdownModal({ character, onResolve }) {
  const [revealed, setRevealed] = useState(false);
  const breakdown = BREAKDOWN_TYPES[Math.floor(Math.random() * BREAKDOWN_TYPES.length)];

  const handleResolve = () => {
    onResolve(breakdown.mechanicalEffect);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerGlyph}>♥</div>
          <div>
            <div className={styles.headerTitle}>Stability Breakdown</div>
            <div className={styles.headerSub}>The Illusion has weight. You have reached its limit.</div>
          </div>
        </div>

        <div className={styles.body}>
          {!revealed ? (
            <>
              <p className={styles.intro}>
                Your Stability has collapsed. The Illusion, which was already thin for someone of your Insight, fractures further. What happens in the space of a breakdown is not always under your control. Sometimes something takes control instead.
              </p>
              <button className={`btn btn-primary btn-lg ${styles.revealBtn}`} onClick={() => setRevealed(true)}>
                ◈ Face What Happens
              </button>
            </>
          ) : (
            <div className={styles.breakdown}>
              <div className={styles.breakdownType}>{breakdown.name}</div>
              <p className={styles.breakdownDesc}>{breakdown.description}</p>

              <div className={styles.mechanicalNote}>
                <span className={styles.mechLabel}>Mechanical Effect</span>
                <p>{breakdown.effect}</p>
              </div>

              <div className={styles.effects}>
                {breakdown.mechanicalEffect.stabilityRestore && (
                  <span className='tag tag-green'>Stability → {breakdown.mechanicalEffect.stabilityRestore}</span>
                )}
                {breakdown.mechanicalEffect.insightGain && (
                  <span className='tag tag-gold'>Insight +{breakdown.mechanicalEffect.insightGain}</span>
                )}
                {breakdown.mechanicalEffect.thalers && (
                  <span className='tag tag-gold'>₮+{breakdown.mechanicalEffect.thalers}</span>
                )}
                {breakdown.mechanicalEffect.guiltStacks && (
                  <span className='tag tag-red'>Guilt +{breakdown.mechanicalEffect.guiltStacks}</span>
                )}
                {breakdown.mechanicalEffect.apRestore && (
                  <span className='tag tag-blue'>AP Restored</span>
                )}
                {breakdown.mechanicalEffect.nerve && (
                  <span className='tag tag-red'>Nerve {breakdown.mechanicalEffect.nerve}</span>
                )}
              </div>

              <button className={`btn btn-lg ${styles.continueBtn}`} onClick={handleResolve}>
                Return to Awareness
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

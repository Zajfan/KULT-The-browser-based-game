import { useState } from 'react';
import styles from './AscensionOverlay.module.css';

const ENDINGS = {
  ascend: {
    title: 'Ascension',
    subtitle: 'You step beyond the Illusion entirely.',
    prose: [
      'The Illusion dissolves — not as a collapse, but as a withdrawal. It simply stops applying to you.',
      'Metropolis is underneath, and beneath that, something older that has no name in any language spoken by the living.',
      'Your patron Death Angel is present at the threshold. It does not speak. It simply makes space.',
      'The question of whether this is liberation or simply another kind of prison is one you find you no longer need to answer.',
      'You are no longer contained by what you were. What you are now is not yet named.',
      'The city continues below. The Illusion continues for everyone else. You continue in a different direction.',
    ],
    color: 'var(--gold-vivid)',
    glyph: '∞',
  },
  remain: {
    title: 'The Choice to Stay',
    subtitle: 'You could leave. You choose not to.',
    prose: [
      'Ascension is visible — an actual direction you could move in. The path is open.',
      'You close the door.',
      'The Awakened are rare. Most of them burn through or disappear into whatever lies past the Illusion.',
      'Someone has to stay. Someone has to know what the city actually is and still move through it. Still try to change things.',
      'Your patron Death Angel registers the refusal. Whether it is displeased or impressed is not something you can read.',
      'You are still here. Still Awakened. Still the most dangerous kind of ordinary — someone who knows.',
    ],
    color: 'var(--veil-vivid)',
    glyph: '◉',
  },
  merge: {
    title: 'The Third Path',
    subtitle: 'Neither above nor below — through.',
    prose: [
      'You do not ascend. You do not remain. You do something the Awakening Path did not predict.',
      'The distinction between the Illusion and what underlies it turns out to be less stable than the Archons believed.',
      'Your presence here, at this level of Insight, has already changed the city in ways you will never fully trace.',
      'You become something that moves between layers — not fixed to any of them, not absent from any of them.',
      'Lictors cannot classify you. Archon monitoring systems log errors when you appear in their field.',
      'The city continues. You continue. The relationship between you and it is now something different.',
    ],
    color: 'oklch(72% 0.20 290)',
    glyph: '⛧',
  },
};

export default function AscensionOverlay({ character, onChoose, onDismiss }) {
  const [chosen, setChosen] = useState(null);
  const [proseIdx, setProseIdx] = useState(0);

  if (chosen) {
    const ending = ENDINGS[chosen];
    const lines = ending.prose;
    const done = proseIdx >= lines.length;

    return (
      <div className={styles.overlay}>
        <div className={styles.modal} style={{ '--asc-color': ending.color }}>
          <div className={styles.ascGlyph}>{ending.glyph}</div>
          <h2 className={styles.endTitle}>{ending.title}</h2>
          <p className={styles.endSub}>{ending.subtitle}</p>

          <div className={styles.proseBox}>
            {lines.slice(0, proseIdx + 1).map((line, i) => (
              <p key={i} className={`${styles.proseLine} ${i === proseIdx ? styles.proseNew : ''}`}>
                {line}
              </p>
            ))}
          </div>

          <div className={styles.btnRow}>
            {!done ? (
              <button className="act act-gold" onClick={() => setProseIdx(i => i + 1)}>
                Continue →
              </button>
            ) : (
              <>
                {chosen !== 'remain' ? (
                  <button
                    className="act act-gold"
                    onClick={() => onChoose(chosen)}
                  >
                    {chosen === 'ascend' ? 'Leave the Illusion' : chosen === 'merge' ? 'Become the Threshold' : 'Remain'}
                  </button>
                ) : (
                  <button className="act act-gold" onClick={onDismiss}>
                    Return to the city
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.ascGlyph}>∞</div>
        <h2 className={styles.title}>The Ascension Threshold</h2>
        <p className={styles.sub}>
          Insight exhausted. Ascension progress complete.
          The path beyond the Illusion is open.
        </p>

        <div className={styles.statLine}>
          <span>{character?.name}</span>
          <span className={styles.dim}>·</span>
          <span>{character?.darkSecret?.name}</span>
          <span className={styles.dim}>·</span>
          <span>Day {character?.gameTime?.day ?? 1}</span>
        </div>

        <p className={styles.lore}>
          You have reached what the KULT cosmology calls the end of the Sleeper's
          journey. The Illusion is transparent to you. The Archons' architecture is
          visible. Your patron Death Angel stands at the threshold of something that
          has no name in the languages of the living.
        </p>
        <p className={styles.lore}>
          Three paths are open. Choose carefully — or not at all.
        </p>

        <div className={styles.choices}>
          {Object.entries(ENDINGS).map(([key, end]) => (
            <button
              key={key}
              className={styles.choice}
              style={{ '--ch-color': end.color }}
              onClick={() => { setChosen(key); setProseIdx(0); }}
            >
              <span className={styles.choiceGlyph}>{end.glyph}</span>
              <div className={styles.choiceText}>
                <strong>{end.title}</strong>
                <span>{end.subtitle}</span>
              </div>
            </button>
          ))}
        </div>

        <button className={`act act-ghost ${styles.later}`} onClick={onDismiss}>
          Not yet. I'm not ready.
        </button>
      </div>
    </div>
  );
}

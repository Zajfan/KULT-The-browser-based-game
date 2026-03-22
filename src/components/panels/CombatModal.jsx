import styles from './CombatModal.module.css';

const WOUND_COLORS = { None: 'var(--green-vivid)', Stabilized: '#c8a96e', Serious: '#b87333', Critical: 'var(--red-accent)', Mortal: 'var(--red-vivid)' };
const HP_COLOR = (pct) => pct > 0.6 ? 'var(--green-vivid)' : pct > 0.3 ? '#b87333' : 'var(--red-vivid)';

export default function CombatModal({ character, combat, onAttack, onFlee }) {
  const { enemy, round, log } = combat;
  const hpPct = enemy.currentHp / enemy.hp;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.headerGlyph}>⚔</span>
          <span>Combat — Round {round}</span>
          <span className={`tag ${enemy.supernatural ? 'tag-purple' : 'tag-red'}`}>
            {enemy.supernatural ? 'Supernatural' : 'Mundane'}
          </span>
        </div>

        {/* Combatants */}
        <div className={styles.combatants}>
          {/* Player */}
          <div className={styles.combatant}>
            <div className={styles.combatantName}>{character.name}</div>
            <div className={styles.combatantStat}>
              Wounds: <span style={{ color: WOUND_COLORS[character.wounds] }}>{character.wounds}</span>
            </div>
            <div className={styles.combatantStat}>
              Stability: <span style={{ color: character.stability > 3 ? 'var(--green-vivid)' : 'var(--red-vivid)' }}>
                {character.stability}/{character.maxStability}
              </span>
            </div>
          </div>

          <div className={styles.vs}>VS</div>

          {/* Enemy */}
          <div className={styles.combatant}>
            <div className={styles.combatantName}>{enemy.icon} {enemy.name}</div>
            <div className={styles.hpBar}>
              <div className={styles.hpFill} style={{ width: `${hpPct * 100}%`, background: HP_COLOR(hpPct) }} />
            </div>
            <div className={styles.combatantStat}>HP: {enemy.currentHp}/{enemy.hp}</div>
            <p className={styles.enemyDesc}>{enemy.description}</p>
          </div>
        </div>

        {/* Recent combat log */}
        {log.length > 0 && (
          <div className={styles.combatLog}>
            {log.slice(-3).map((entry, i) => (
              <div key={i} className={styles.combatLogEntry}>
                <span className={styles.combatLogRound}>R{entry.round}</span>
                <span>{entry.text}</span>
                <span className={styles.combatLogRoll}>{entry.roll}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <button className='btn btn-primary btn-lg' onClick={onAttack}>
            ⚔ Attack
          </button>
          <button className='btn btn-lg' onClick={onFlee}>
            ↩ Flee
          </button>
        </div>

        {/* Stability warning */}
        {enemy.stabilityThreat && (
          <div className={styles.stabilityWarning}>
            ⚠ This entity poses a threat to your Stability. Each round risks {enemy.stabilityThreat.minLoss}–{enemy.stabilityThreat.maxLoss} Stability loss.
          </div>
        )}
      </div>
    </div>
  );
}

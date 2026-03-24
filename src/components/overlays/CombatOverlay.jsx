import styles from './CombatOverlay.module.css';
const WC = { None:'var(--vital-lit)', Stabilized:'var(--gold)', Serious:'oklch(62% 0.14 55)', Critical:'var(--red-lit)', Mortal:'var(--red-vivid)' };
export default function CombatOverlay({ character, combat, onAttack, onFlee, onDarkAbility }) {
  const { enemy, round, log } = combat;
  const hpPct = enemy.currentHp / enemy.hp;
  const hpColor = hpPct > 0.6 ? 'var(--vital-lit)' : hpPct > 0.3 ? 'oklch(62% 0.14 55)' : 'var(--red-vivid)';
  const ability = character.darkSecret?.combatAbility;
  const cooldown = combat.darkAbilityCooldown || 0;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.headerGlyph}>⚔</span>
          <span>Combat — Round {round}</span>
          <span className={`badge ${enemy.supernatural?'badge-veil':'badge-red'}`}>{enemy.supernatural?'Supernatural':'Mundane'}</span>
        </div>
        <div className={styles.body}>
          <div className={styles.sides}>
            <div className={styles.side}>
              <div className={styles.fighter}>{character.name}</div>
              <div className={styles.status}>Wounds: <span style={{color:WC[character.wounds]}}>{character.wounds}</span></div>
              <div className={styles.status}>Stability: <span style={{color:character.stability>3?'var(--vital-lit)':'var(--red-vivid)'}}>{character.stability}/{character.maxStability}</span></div>
            </div>
            <div className={styles.vsSep}>VS</div>
            <div className={styles.side}>
              <div className={styles.fighter}>{enemy.icon} {enemy.name}</div>
              <div className={styles.hpWrap}>
                <div className={styles.hpBar} style={{background:hpColor,width:`${hpPct*100}%`}}/>
              </div>
              <div className={styles.status}>{enemy.currentHp}/{enemy.hp} HP</div>
              <p className={styles.enemyDesc}>{enemy.description}</p>
            </div>
          </div>
          {log.length > 0 && (
            <div className={styles.combatLog}>
              {log.slice(-4).map((e,i)=>(
                <div key={i} className={styles.logLine}>
                  <span className='mono dim' style={{fontSize:'0.6rem',flexShrink:0}}>R{e.round}</span>
                  <span style={{fontSize:'0.75rem',fontStyle:'italic',color:'var(--ink-dim)',flex:1}}>{e.text}</span>
                  <span className='mono' style={{fontSize:'0.65rem',color:'var(--gold)',flexShrink:0}}>{e.roll}</span>
                </div>
              ))}
            </div>
          )}
          <div className={styles.acts}>
            <button className='act act-danger act-lg' style={{flex:1}} onClick={onAttack}>⚔ Attack</button>
            {ability && (
              <button
                className='act act-lg'
                style={{flex:1,color:cooldown>0?'var(--ink-dim)':'var(--veil-lit)',borderColor:cooldown>0?'var(--border)':'var(--veil-dark)',opacity:cooldown>0?0.5:1}}
                onClick={onDarkAbility}
                disabled={cooldown>0}
                title={ability.description}
                aria-label={cooldown>0?`${ability.name}, on cooldown for ${cooldown} rounds`:ability.name}
              >
                ✦ {ability.name}{cooldown>0?` (${cooldown})`:''}</button>
            )}
            <button className='act act-lg' style={{flex:1}} onClick={onFlee}>↩ Flee</button>
          </div>
          {ability && (
            <p className={styles.threat} style={{color:'var(--veil-lit)',borderColor:'var(--veil-dark)'}}>
              ✦ {ability.name}: {ability.description}
            </p>
          )}
          {enemy.stabilityThreat && <p className={styles.threat}>⚠ Supernatural presence — Stability risk {enemy.stabilityThreat.minLoss}–{enemy.stabilityThreat.maxLoss} per round.</p>}
        </div>
      </div>
    </div>
  );
}

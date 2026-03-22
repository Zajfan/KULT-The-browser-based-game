import { formatTime } from './timeUtils.js';
import styles from './SideNav.module.css';

const WOUND_COLOR = { None:'var(--vital-lit)', Stabilized:'var(--gold)', Serious:'#b87333', Critical:'var(--red-lit)', Mortal:'var(--red-vivid)' };

export default function SideNav({ views, current, onSelect, character, currentNPC, onOpenNPC, hour }) {
  if (!character) return null;

  const stabPct    = (character.stability / character.maxStability) * 100;
  const apPct      = (character.ap / character.maxAp) * 100;
  const nervePct   = (character.nerve / character.maxNerve) * 100;
  const stabColor  = character.stability > 6 ? 'var(--vital-lit)' : character.stability > 3 ? 'var(--gold)' : 'var(--red-vivid)';

  return (
    <nav className={styles.nav}>
      {/* Identity */}
      <div className={styles.identity}>
        <div className={styles.sigil}>⛧</div>
        <div className={styles.name}>{character.name}</div>
        <div className={styles.secret}>{character.darkSecret?.name}</div>
      </div>

      {/* Vitals */}
      <div className={styles.vitals}>
        <div className={styles.vital}>
          <div className={styles.vitalRow}>
            <span className={styles.vLabel}>Stability</span>
            <span className={styles.vVal} style={{color: stabColor}}>{Math.floor(character.stability)}/{character.maxStability}</span>
          </div>
          <div className='bar-wrap'><div className='bar-fill' style={{width:`${stabPct}%`, background:stabColor}} /></div>
        </div>
        <div className={styles.vital}>
          <div className={styles.vitalRow}>
            <span className={styles.vLabel}>Action Points</span>
            <span className={styles.vVal}>{Math.floor(character.ap)}/{character.maxAp}</span>
          </div>
          <div className='bar-wrap'><div className='bar-fill' style={{width:`${apPct}%`, background:'#4a7fc1'}} /></div>
        </div>
        <div className={styles.vital}>
          <div className={styles.vitalRow}>
            <span className={styles.vLabel}>Nerve</span>
            <span className={styles.vVal}>{Math.floor(character.nerve)}/{character.maxNerve}</span>
          </div>
          <div className='bar-wrap'><div className='bar-fill' style={{width:`${nervePct}%`, background:'var(--veil-lit)'}} /></div>
        </div>
        <div className={styles.vitalRow} style={{marginTop:4}}>
          <span className={styles.vLabel}>Wounds</span>
          <span className={styles.vVal} style={{color: WOUND_COLOR[character.wounds]}}>{character.wounds}</span>
        </div>
        <div className={styles.vitalRow}>
          <span className={styles.vLabel}>Insight</span>
          <span className={styles.vVal} style={{color:'var(--gold-lit)'}}>{character.insight}/10</span>
        </div>
        <div className={styles.vitalRow}>
          <span className={styles.vLabel}>Thalers</span>
          <span className={styles.vVal} style={{color:'var(--gold-lit)'}}>₮{character.thalers.toLocaleString()}</span>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Navigation links */}
      <ul className={styles.links}>
        {views.map(v => (
          <li key={v.id}>
            <button
              className={`${styles.link} ${current===v.id ? styles.active : ''}`}
              onClick={() => onSelect(v.id)}
            >
              <span className={styles.glyph}>{v.glyph}</span>
              <span className={styles.label}>{v.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.divider} />

      {/* NPC */}
      {currentNPC && (
        <button className={styles.npcBtn} onClick={onOpenNPC}>
          <span className={styles.npcIcon}>{currentNPC.icon}</span>
          <div className={styles.npcInfo}>
            <span className={styles.npcName}>{currentNPC.name}</span>
            <span className={styles.npcTitle}>{currentNPC.title}</span>
          </div>
        </button>
      )}

      {/* Clock */}
      <div className={styles.clock}>
        <span className={styles.clockTime}>{formatTime(hour)}</span>
        <span className={styles.clockDay}>Day {character.gameTime?.day ?? 1}</span>
      </div>
    </nav>
  );
}

import { formatTime } from './timeUtils.js';
import AudioToggle from './AudioToggle.jsx';
import styles from './SideNav.module.css';

const WC = { None:'var(--vital-lit)', Stabilized:'var(--gold)', Serious:'oklch(62% 0.14 55)', Critical:'var(--red-lit)', Mortal:'var(--red-vivid)' };

export default function SideNav({ views, current, onSelect, character, currentNPC, onOpenNPC, hour }) {
  if (!character) return null;

  const stabPct  = (character.stability / character.maxStability) * 100;
  const apPct    = (character.ap / character.maxAp) * 100;
  const nervePct = (character.nerve / character.maxNerve) * 100;
  const stabC    = character.stability > 6 ? 'var(--vital-lit)' : character.stability > 3 ? 'var(--gold)' : 'var(--red-vivid)';

  return (
    <nav className={styles.nav}>
      {/* Identity */}
      <div className={styles.identity}>
        <span className={styles.sigil}>⛧</span>
        <div className={styles.name}>{character.name}</div>
        <div className={styles.secret}>{character.darkSecret?.name}</div>
      </div>

      {/* Vitals */}
      <div className={styles.vitals}>
        <div className={styles.vital}>
          <div className={styles.vitalRow}>
            <span className={styles.vLabel}>Stability</span>
            <span className={styles.vVal} style={{color:stabC}}>{Math.floor(character.stability)}/{character.maxStability}</span>
          </div>
          <div className='bar-wrap'><div className='bar-fill' style={{width:`${stabPct}%`,background:stabC}} /></div>
        </div>
        <div className={styles.vital}>
          <div className={styles.vitalRow}>
            <span className={styles.vLabel}>Action Points</span>
            <span className={styles.vVal}>{Math.floor(character.ap)}/{character.maxAp}</span>
          </div>
          <div className='bar-wrap'><div className='bar-fill' style={{width:`${apPct}%`,background:'oklch(52% 0.16 260)'}} /></div>
        </div>
        <div className={styles.vital}>
          <div className={styles.vitalRow}>
            <span className={styles.vLabel}>Nerve</span>
            <span className={styles.vVal}>{Math.floor(character.nerve)}/{character.maxNerve}</span>
          </div>
          <div className='bar-wrap'><div className='bar-fill' style={{width:`${nervePct}%`,background:'var(--veil-lit)'}} /></div>
        </div>
        <div className={styles.vitalRow} style={{marginTop:2}}>
          <span className={styles.vLabel}>Wounds</span>
          <span className={styles.vVal} style={{color:WC[character.wounds]}}>{character.wounds}</span>
        </div>
        <div className={styles.vitalRow}>
          <span className={styles.vLabel}>Insight</span>
          <div className={styles.insightRow}>
            <div className='pips'>
              {Array.from({length:Math.min(character.maxInsight,10)},(_,i)=>(
                <div key={i} className={`pip ${i<character.insight?'on':''}`} />
              ))}
            </div>
            <span className={styles.vVal} style={{color:'var(--gold-lit)'}}>{character.insight}</span>
          </div>
        </div>
        <div className={styles.vitalRow}>
          <span className={styles.vLabel}>Thalers</span>
          <span className={styles.vVal} style={{color:'var(--gold-lit)'}}>₮{character.thalers.toLocaleString()}</span>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Nav links */}
      <ul className={styles.links}>
        {views.map(v => (
          <li key={v.id}>
            <button className={`${styles.link} ${current===v.id?styles.active:''}`}
              onClick={()=>onSelect(v.id)}>
              <span className={styles.glyph}>{v.glyph}</span>
              <span className={styles.label}>{v.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.divider} />

      {/* NPC contact */}
      {currentNPC && (
        <button className={styles.npcBtn} onClick={onOpenNPC}>
          <span className={styles.npcIcon}>{currentNPC.icon}</span>
          <div className={styles.npcInfo}>
            <span className={styles.npcName}>{currentNPC.name}</span>
            <span className={styles.npcTitle}>{currentNPC.title}</span>
          </div>
        </button>
      )}

      {/* Footer: clock + audio */}
      <div className={styles.foot}>
        <div className={styles.clock}>
          <span className={styles.clockTime}>{formatTime(hour)}</span>
          <span className={styles.clockDay}>Day {character.gameTime?.day ?? 1}</span>
        </div>
        <AudioToggle />
      </div>
    </nav>
  );
}

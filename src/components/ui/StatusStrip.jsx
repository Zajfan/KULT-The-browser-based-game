import styles from './StatusStrip.module.css';

const WOUND_COLOR = {
  None: 'var(--vital-lit)',
  Stabilized: 'var(--gold)',
  Serious: 'oklch(62% 0.14 55)',
  Critical: 'var(--red-lit)',
  Mortal: 'var(--red-vivid)',
};

export default function StatusStrip({ character, timeDesc, onMenuToggle }) {
  const ap      = Math.floor(character?.ap ?? 0);
  const maxAp   = character?.maxAp ?? 100;
  const nerve   = Math.floor(character?.nerve ?? 0);
  const maxNrv  = character?.maxNerve ?? 50;
  const stab    = Math.floor(character?.stability ?? 0);
  const maxStb  = character?.maxStability ?? 10;
  const insight = character?.insight ?? 0;
  const wounds  = character?.wounds ?? 'None';
  const heat    = character?.heat ?? 0;
  const thalers = character?.thalers ?? 0;
  const guilt   = character?.guiltStacks ?? 0;
  const ascension = character?.ascensionProgress ?? 0;

  const apPct   = Math.round((ap / maxAp) * 100);
  const stabPct = Math.round((stab / maxStb) * 100);
  const heatPct = Math.round((heat / 100) * 100);
  const ascPct  = Math.round(ascension);

  const stabColor = stab > maxStb * 0.5 ? 'var(--vital-lit)' : stab > maxStb * 0.25 ? 'var(--gold)' : 'var(--red-vivid)';
  const heatColor = heat > 70 ? 'var(--red-vivid)' : heat > 40 ? 'var(--red-lit)' : heat > 15 ? 'var(--gold)' : 'var(--ink-dim)';
  const guiltColor = guilt >= 8 ? 'var(--red-vivid)' : guilt >= 5 ? 'var(--red-lit)' : 'var(--gold)';
  const thStr = thalers >= 10000 ? `₮${(thalers/1000).toFixed(1)}k` : `₮${thalers}`;

  return (
    <div className={styles.strip}>
      <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Open menu">☰</button>

      <div className={styles.left}>
        <span className={styles.location}>{character?.location?.replace(/_/g,' ')}</span>
        <span className={styles.sep}>—</span>
        <span className={styles.desc}>{timeDesc}</span>
      </div>

      <div className={styles.resources}>
        {/* AP */}
        <div className={styles.resItem} title={`Action Points: ${ap} / ${maxAp}`}>
          <span className={styles.resLabel}>AP</span>
          <div className={styles.miniBar}>
            <div className={styles.miniBarFill} style={{ width: `${apPct}%`, background: 'var(--gold)' }} />
          </div>
          <span className={styles.resVal}>{ap}</span>
        </div>

        {/* Stability */}
        <div className={styles.resItem} title={`Stability: ${stab} / ${maxStb}`}>
          <span className={styles.resLabel}>STB</span>
          <div className={styles.miniBar}>
            <div className={styles.miniBarFill} style={{ width: `${stabPct}%`, background: stabColor }} />
          </div>
          <span className={styles.resVal} style={{ color: stabColor }}>{stab}</span>
        </div>

        {/* Nerve */}
        <div className={styles.resItem} title={`Nerve: ${nerve} / ${maxNrv}`}>
          <span className={styles.resLabel}>NRV</span>
          <span className={styles.resVal} style={{ color: 'var(--veil-lit)' }}>{nerve}</span>
        </div>

        {/* Insight */}
        <div className={styles.resItem} title={`Insight: ${insight} / 10`}>
          <span className={styles.resLabel}>INS</span>
          <span className={styles.resVal} style={{ color: 'var(--veil-vivid)' }}>{insight}</span>
        </div>

        {/* Wounds — only show if injured */}
        {wounds !== 'None' && (
          <div className={styles.resItem} title={`Wounds: ${wounds}`}>
            <span className={styles.woundTag} style={{ color: WOUND_COLOR[wounds] }}>⚕ {wounds}</span>
          </div>
        )}

        {/* Heat — only show if non-zero */}
        {heat > 0 && (
          <div className={styles.resItem} title={`Police Heat: ${heat} / 100`}>
            <span className={styles.resLabel} style={{ color: heatColor }}>HEAT</span>
            <div className={styles.miniBar}>
              <div className={styles.miniBarFill} style={{ width: `${heatPct}%`, background: heatColor }} />
            </div>
            <span className={styles.resVal} style={{ color: heatColor }}>{heat}</span>
          </div>
        )}

        {/* Thalers */}
        <div className={styles.resItem} title={`Thalers: ${thalers.toLocaleString()}`}>
          <span className={styles.resVal} style={{ color: 'var(--gold-lit)' }}>{thStr}</span>
        </div>

        {/* Guilt — only show if non-zero */}
        {guilt > 0 && (
          <div className={styles.resItem} title={`Guilt Stacks: ${guilt}/10 — high guilt drains stability daily`}>
            <span className={styles.resLabel} style={{ color: guiltColor }}>GUILT</span>
            <div className={styles.miniBar}>
              <div className={styles.miniBarFill} style={{ width: `${(guilt/10)*100}%`, background: guiltColor }} />
            </div>
            <span className={styles.resVal} style={{ color: guiltColor }}>{guilt}</span>
          </div>
        )}

        {/* Ascension — show when meaningful progress made */}
        {ascension >= 20 && (
          <div className={styles.resItem} title={`Ascension Progress: ${ascPct}%`}>
            <span className={styles.resLabel} style={{ color: 'var(--veil-vivid)' }}>ASC</span>
            <div className={styles.miniBar}>
              <div className={styles.miniBarFill} style={{ width: `${ascPct}%`, background: ascPct >= 90 ? 'var(--gold-vivid)' : 'var(--veil-vivid)' }} />
            </div>
            <span className={styles.resVal} style={{ color: 'var(--veil-vivid)' }}>{ascPct}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

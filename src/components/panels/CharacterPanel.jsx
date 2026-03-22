import { FACTIONS, getFactionRank } from '../../data/factions.js';
import { ITEMS } from '../../data/items.js';
import styles from './CharacterPanel.module.css';

const WOUND_COLORS = {
  None: 'var(--green-vivid)',
  Stabilized: '#c8a96e',
  Serious: '#b87333',
  Critical: 'var(--red-accent)',
  Mortal: 'var(--red-vivid)',
};

const ATTRIBUTES = [
  ['reason', 'REA'], ['intuition', 'INT'], ['perception', 'PER'],
  ['coolness', 'COO'], ['violence', 'VIO'], ['soul', 'SOL'],
  ['willpower', 'WIL'], ['fortitude', 'FOR'], ['reflexes', 'REF'],
];

export default function CharacterPanel({ character }) {
  const { name, darkSecret, stability, maxStability, wounds, insight, ap, maxAp, nerve, maxNerve, attributes, equippedWeapon, equippedArmor, faction, factionStandings } = character;

  const stabilityPct = (stability / maxStability) * 100;
  const stabilityColor = stability > 6 ? 'var(--green-vivid)' : stability > 3 ? '#c8a96e' : 'var(--red-vivid)';

  const apPct = (ap / maxAp) * 100;
  const nervePct = (nerve / maxNerve) * 100;

  const weapon = equippedWeapon ? ITEMS[equippedWeapon] : null;
  const armor = equippedArmor ? ITEMS[equippedArmor] : null;

  const factionData = FACTIONS[faction];
  const primaryStanding = factionStandings?.[faction] || 0;
  const rank = getFactionRank(primaryStanding);

  return (
    <div className={styles.panel}>
      {/* Name & Secret */}
      <div className={styles.nameBlock}>
        <div className={styles.name}>{name}</div>
        <div className={styles.secret}>{darkSecret?.icon || '⛧'} {darkSecret?.name || 'Unknown'}</div>
        <div className={styles.secretSub}>{darkSecret?.subtitle}</div>
      </div>

      <div className={styles.divider} />

      {/* Resource bars */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Resources</div>

        <div className={styles.resource}>
          <div className={styles.resourceHeader}>
            <span className={styles.resourceLabel}>Stability</span>
            <span className={styles.resourceVal} style={{ color: stabilityColor }}>{Math.floor(stability)}/{maxStability}</span>
          </div>
          <div className={styles.bar}>
            <div className={styles.barFill} style={{ width: `${stabilityPct}%`, background: stabilityColor }} />
          </div>
        </div>

        <div className={styles.resource}>
          <div className={styles.resourceHeader}>
            <span className={styles.resourceLabel}>Action Points</span>
            <span className={styles.resourceVal}>{Math.floor(ap)}/{maxAp}</span>
          </div>
          <div className={styles.bar}>
            <div className={styles.barFill} style={{ width: `${apPct}%`, background: 'var(--blue-vivid)' }} />
          </div>
        </div>

        <div className={styles.resource}>
          <div className={styles.resourceHeader}>
            <span className={styles.resourceLabel}>Nerve</span>
            <span className={styles.resourceVal}>{Math.floor(nerve)}/{maxNerve}</span>
          </div>
          <div className={styles.bar}>
            <div className={styles.barFill} style={{ width: `${nervePct}%`, background: 'var(--purple-bright)' }} />
          </div>
        </div>

        <div className={styles.resource}>
          <div className={styles.resourceHeader}>
            <span className={styles.resourceLabel}>Insight</span>
            <span className={styles.resourceVal} style={{ color: 'var(--gold-bright)' }}>{insight}/10</span>
          </div>
          <div className={styles.insightPips}>
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className={`${styles.pip} ${i < insight ? styles.pipFull : ''}`} />
            ))}
          </div>
        </div>

        {/* Wounds */}
        <div className={styles.woundsBlock}>
          <span className={styles.resourceLabel}>Wounds</span>
          <span className={styles.woundVal} style={{ color: WOUND_COLORS[wounds] }}>{wounds}</span>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Attributes */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Attributes</div>
        <div className={styles.attrGrid}>
          {ATTRIBUTES.map(([key, abbr]) => {
            const val = attributes[key] || 0;
            return (
              <div key={key} className={styles.attrItem}>
                <span className={styles.attrAbbr}>{abbr}</span>
                <span className={`${styles.attrVal} ${val > 0 ? styles.pos : val < 0 ? styles.neg : ''}`}>
                  {val > 0 ? '+' : ''}{val}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.divider} />

      {/* Equipment */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Equipped</div>
        <div className={styles.equipped}>
          <div className={styles.equippedItem}>
            <span className={styles.equippedIcon}>{weapon ? weapon.icon : '✕'}</span>
            <div>
              <div className={styles.equippedLabel}>Weapon</div>
              <div className={styles.equippedName}>{weapon ? weapon.name : 'None'}</div>
              {weapon && <div className={styles.equippedStat}>DMG {weapon.damage}</div>}
            </div>
          </div>
          <div className={styles.equippedItem}>
            <span className={styles.equippedIcon}>{armor ? armor.icon : '✕'}</span>
            <div>
              <div className={styles.equippedLabel}>Armor</div>
              <div className={styles.equippedName}>{armor ? armor.name : 'None'}</div>
              {armor && <div className={styles.equippedStat}>DEF {armor.defense || armor.magicDefense}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Faction */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Faction</div>
        <div className={styles.factionBlock}>
          <span style={{ color: factionData?.color }}>{factionData?.icon}</span>
          <div>
            <div className={styles.factionName}>{factionData?.name}</div>
            <div className={styles.factionRank} style={{ color: rank.color }}>{rank.label} ({primaryStanding})</div>
          </div>
        </div>
      </div>
    </div>
  );
}

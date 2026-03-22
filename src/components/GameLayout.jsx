import { useState } from 'react';
import CharacterPanel from './panels/CharacterPanel.jsx';
import LocationPanel from './panels/LocationPanel.jsx';
import EventLog from './panels/EventLog.jsx';
import InventoryPanel from './panels/InventoryPanel.jsx';
import CombatModal from './panels/CombatModal.jsx';
import CrimesPanel from './panels/CrimesPanel.jsx';
import RitualsPanel from './panels/RitualsPanel.jsx';
import MarketPanel from './panels/MarketPanel.jsx';
import FactionsPanel from './panels/FactionsPanel.jsx';
import StatsPanel from './panels/StatsPanel.jsx';
import styles from './GameLayout.module.css';

const NAV_TABS = [
  { id: 'city',      label: 'City',      icon: '🌆' },
  { id: 'crimes',    label: 'Crimes',    icon: '⚖' },
  { id: 'rituals',   label: 'Rituals',   icon: '⛧' },
  { id: 'market',    label: 'Market',    icon: '🗝' },
  { id: 'factions',  label: 'Factions',  icon: '◈' },
  { id: 'inventory', label: 'Items',     icon: '📦' },
  { id: 'stats',     label: 'Profile',   icon: '👤' },
];

export default function GameLayout({ character, combat, actions, activeModal, setActiveModal }) {
  const [activeTab, setActiveTab] = useState('city');

  const {
    travel, performAction,
    attackEnemy, fleeCombat,
    commitCrime, performRitual,
    useItem, equipItem, buyItem, sellItem,
  } = actions;

  const timeStr = (() => {
    const h = character.gameTime?.hour ?? 8;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${String(h12).padStart(2,'0')}:00 ${ampm}`;
  })();

  const isDanger = character.stability <= 3 || character.wounds === 'Critical' || character.wounds === 'Mortal';

  return (
    <div className={`${styles.wrapper} ${isDanger ? styles.danger : ''}`}>
      {/* Top navbar */}
      <header className={styles.header}>
        <div className={styles.headerBrand}>
          <span className={styles.brandGlyph}>⛧</span>
          <span className={styles.brandName}>KULT</span>
          <span className={styles.brandSub}>City of Chains</span>
        </div>

        <nav className={styles.nav}>
          {NAV_TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.navBtn} ${activeTab === tab.id ? styles.navActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.navIcon}>{tab.icon}</span>
              <span className={styles.navLabel}>{tab.label}</span>
              {tab.id === 'crimes' && character.nerve < 20 && <span className={styles.navBadge} />}
              {tab.id === 'rituals' && character.insight > 0 && <span className={styles.navBadgeGold}>{character.insight}</span>}
            </button>
          ))}
        </nav>

        <div className={styles.headerRight}>
          <div className={styles.clock}>
            <span className={styles.clockDay}>Day {character.gameTime?.day ?? 1}</span>
            <span className={styles.clockTime}>{timeStr}</span>
          </div>
          <div className={styles.thalers}>
            <span className={styles.thalersIcon}>₮</span>
            <span className={styles.thalersVal}>{character.thalers.toLocaleString()}</span>
          </div>
        </div>
      </header>

      {/* Main layout: Left | Center | Right */}
      <div className={styles.body}>
        {/* Left: Character Panel (always visible) */}
        <aside className={styles.sidebar}>
          <CharacterPanel character={character} />
        </aside>

        {/* Center: Tab content */}
        <main className={styles.main}>
          {activeTab === 'city'      && <LocationPanel character={character} onTravel={travel} onAction={performAction} />}
          {activeTab === 'crimes'    && <CrimesPanel character={character} onCommit={commitCrime} />}
          {activeTab === 'rituals'   && <RitualsPanel character={character} onPerform={performRitual} />}
          {activeTab === 'market'    && <MarketPanel character={character} onBuy={buyItem} onSell={sellItem} />}
          {activeTab === 'factions'  && <FactionsPanel character={character} />}
          {activeTab === 'inventory' && <InventoryPanel character={character} onUse={useItem} onEquip={equipItem} onSell={sellItem} />}
          {activeTab === 'stats'     && <StatsPanel character={character} />}
        </main>

        {/* Right: Event log */}
        <aside className={styles.logPanel}>
          <EventLog log={character.log} />
        </aside>
      </div>

      {/* Combat modal overlay */}
      {combat && (
        <CombatModal
          character={character}
          combat={combat}
          onAttack={attackEnemy}
          onFlee={fleeCombat}
        />
      )}
    </div>
  );
}

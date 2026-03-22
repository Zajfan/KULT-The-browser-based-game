import { useState, useEffect } from 'react';
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
import QuestLog from './panels/QuestLog.jsx';
import EventModal from './panels/EventModal.jsx';
import NPCModal from './panels/NPCModal.jsx';
import TrainingPanel from './panels/TrainingPanel.jsx';
import BreakdownModal from './panels/BreakdownModal.jsx';
import DayNightOverlay, { getTimeDescription } from './DayNightOverlay.jsx';
import { ToastContainer, useToasts } from './ToastSystem.jsx';
import { getNPCForLocation } from '../data/npcs.js';
import { getTrainingForLocation } from '../data/training.js';
import styles from './GameLayout.module.css';

const NAV_TABS = [
  { id:'city',       label:'City',          icon:'🌆' },
  { id:'crimes',     label:'Crimes',        icon:'⚖'  },
  { id:'rituals',    label:'Rituals',       icon:'⛧'  },
  { id:'market',     label:'Market',        icon:'🗝'  },
  { id:'factions',   label:'Factions',      icon:'◈'  },
  { id:'inventory',  label:'Items',         icon:'📦' },
  { id:'quests',     label:'Investigations',icon:'🔍' },
  { id:'stats',      label:'Profile',       icon:'👤' },
];

export default function GameLayout({ character, combat, pendingEvent, actions }) {
  const [activeTab, setActiveTab]       = useState('city');
  const [npcModal, setNpcModal]         = useState(null);
  const [showTraining, setShowTraining] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const { toasts, addToast, removeToast } = useToasts();
  const prevStability = useState(character?.stability)[0];

  const {
    travel, performAction,
    attackEnemy, fleeCombat,
    commitCrime, performRitual,
    performTraining,
    useItem, equipItem, buyItem, sellItem,
    updateNPCTrust, resolveEvent,
    setPendingEvent, setCharacter,
    addLog,
  } = actions;

  // ── Watch for breakdown trigger ──────────────────────────────────────────
  useEffect(() => {
    if (character?.stability <= 0 && !showBreakdown) {
      setShowBreakdown(true);
    }
  }, [character?.stability]);

  // ── Critical state toasts ────────────────────────────────────────────────
  useEffect(() => {
    if (character?.stability === 2) addToast('⚠ Stability critical — seek treatment.', 'error', 5000);
  }, [character?.stability]);

  useEffect(() => {
    if (character?.wounds === 'Critical') addToast('⚠ Critical wounds — find a hospital.', 'error', 5000);
    if (character?.wounds === 'Mortal')   addToast('☠ Mortal wounds — imminent death.', 'error', 8000);
  }, [character?.wounds]);

  useEffect(() => {
    if (character?.insight > 0 && character.insight % 2 === 0)
      addToast(`◉ Insight ${character.insight} — new paths may be open.`, 'insight', 4000);
  }, [character?.insight]);

  // ── Breakdown resolution ─────────────────────────────────────────────────
  const handleBreakdownResolve = (effect) => {
    if (!setCharacter) return;
    setCharacter(c => {
      let n = {...c};
      if (effect.stabilityRestore)  n.stability   = Math.min(effect.stabilityRestore, n.maxStability);
      if (effect.insightGain)        n.insight     = Math.min(n.insight + effect.insightGain, n.maxInsight);
      if (effect.thalers)            n.thalers     = n.thalers + effect.thalers;
      if (effect.apRestore)          n.ap          = n.maxAp;
      if (effect.nerve)              n.nerve       = Math.max(0, n.nerve + effect.nerve);
      if (effect.guiltStacks)        n.guiltStacks = (n.guiltStacks || 0) + effect.guiltStacks;
      if (effect.factionReward) {
        const {faction, amount} = effect.factionReward;
        n.factionStandings = {...n.factionStandings, [faction]: (n.factionStandings[faction]||0)+amount};
      }
      return n;
    });
    addLog?.({type:'system', text:'[Breakdown] You return to awareness. Something has changed.'});
    setShowBreakdown(false);
    addToast('You returned from the breakdown. The world looks different.', 'supernatural', 5000);
  };

  const currentNPC    = getNPCForLocation(character?.location);
  const hasTraining   = getTrainingForLocation(character?.location).length > 0;
  const hour          = character?.gameTime?.hour ?? 8;
  const timeDesc      = getTimeDescription(hour);

  const timeStr = `${String(hour % 12 || 12).padStart(2,'0')}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
  const isDanger = character?.stability <= 3 || ['Critical','Mortal'].includes(character?.wounds);

  const openNPC = () => { if (currentNPC) setNpcModal(currentNPC); };
  const handleNPCClose = () => { if (npcModal) updateNPCTrust(npcModal.id, 5); setNpcModal(null); };

  return (
    <div className={`${styles.wrapper} ${isDanger ? styles.danger : ''}`}>
      <DayNightOverlay hour={hour} />

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
              className={`${styles.navBtn} ${activeTab===tab.id ? styles.navActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.navIcon}>{tab.icon}</span>
              <span className={styles.navLabel}>{tab.label}</span>
              {tab.id==='crimes'  && (character?.nerve||0) < 20  && <span className={styles.navBadge} />}
              {tab.id==='rituals' && (character?.insight||0) > 0  && <span className={styles.navBadgeGold}>{character.insight}</span>}
            </button>
          ))}
        </nav>

        <div className={styles.headerRight}>
          {currentNPC && (
            <button className={`btn btn-sm ${styles.npcBtn}`} onClick={openNPC} title={`Speak with ${currentNPC.name}`}>
              {currentNPC.icon} {currentNPC.name}
            </button>
          )}
          {hasTraining && (
            <button className={`btn btn-sm ${showTraining ? styles.trainActive : ''}`} onClick={() => setShowTraining(s=>!s)}>
              📈 Train
            </button>
          )}
          <div className={styles.clock} title={timeDesc}>
            <span className={styles.clockDay}>Day {character?.gameTime?.day ?? 1}</span>
            <span className={styles.clockTime}>{timeStr}</span>
          </div>
          <div className={styles.thalers}>
            <span className={styles.thalersIcon}>₮</span>
            <span className={styles.thalersVal}>{(character?.thalers||0).toLocaleString()}</span>
          </div>
        </div>
      </header>

      {/* Time description bar */}
      <div className={styles.timeBanner}>
        <span className={styles.timeBannerText}>{timeDesc}</span>
      </div>

      {/* Training drawer */}
      {showTraining && hasTraining && (
        <div className={styles.trainingDrawer}>
          <TrainingPanel
            character={character}
            locationId={character.location}
            onTrain={(fac) => { performTraining(fac); addToast(`Training: ${fac.name}`, 'info'); }}
          />
        </div>
      )}

      {/* Main 3-column body */}
      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <CharacterPanel character={character} />
        </aside>

        <main className={styles.main}>
          {activeTab==='city'       && <LocationPanel character={character} onTravel={travel} onAction={performAction} />}
          {activeTab==='crimes'     && <CrimesPanel   character={character} onCommit={commitCrime} />}
          {activeTab==='rituals'    && <RitualsPanel  character={character} onPerform={performRitual} />}
          {activeTab==='market'     && <MarketPanel   character={character} onBuy={buyItem} onSell={sellItem} />}
          {activeTab==='factions'   && <FactionsPanel character={character} />}
          {activeTab==='inventory'  && <InventoryPanel character={character} onUse={useItem} onEquip={equipItem} onSell={sellItem} />}
          {activeTab==='quests'     && <QuestLog      character={character} />}
          {activeTab==='stats'      && <StatsPanel    character={character} />}
        </main>

        <aside className={styles.logPanel}>
          <EventLog log={character?.log} />
        </aside>
      </div>

      {/* ── Overlays ── */}
      {combat && (
        <CombatModal character={character} combat={combat} onAttack={attackEnemy} onFlee={fleeCombat} />
      )}
      {pendingEvent && (
        <EventModal
          event={pendingEvent}
          character={character}
          onResolve={(outcome, rewards, consequences) => resolveEvent(outcome, rewards, consequences)}
          onDismiss={() => setPendingEvent(null)}
        />
      )}
      {npcModal && (
        <NPCModal npc={npcModal} character={character} onClose={handleNPCClose} />
      )}
      {showBreakdown && (
        <BreakdownModal character={character} onResolve={handleBreakdownResolve} />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

import { useState, useEffect } from 'react';
import SideNav from './ui/SideNav.jsx';
import StatusStrip from './ui/StatusStrip.jsx';
import NarrativeFeed from './ui/NarrativeFeed.jsx';

// Views
import CityView      from './views/CityView.jsx';
import CrimesView    from './views/CrimesView.jsx';
import RitualsView   from './views/RitualsView.jsx';
import MarketView    from './views/MarketView.jsx';
import FactionsView  from './views/FactionsView.jsx';
import InventoryView from './views/InventoryView.jsx';
import QuestView     from './views/QuestView.jsx';
import CharacterView from './views/CharacterView.jsx';

// Overlays
import CombatOverlay    from './overlays/CombatOverlay.jsx';
import EventOverlay     from './overlays/EventOverlay.jsx';
import NPCOverlay       from './overlays/NPCOverlay.jsx';
import BreakdownOverlay from './overlays/BreakdownOverlay.jsx';
import { ToastLayer, useToasts } from './ui/ToastLayer.jsx';

import { getNPCForLocation } from '../data/npcs.js';
import { getTimeDescription } from './ui/timeUtils.js';
import styles from './GameLayout.module.css';

export const VIEWS = [
  { id:'city',      label:'The City',         glyph:'◈' },
  { id:'crimes',    label:'Criminal Affairs',  glyph:'⚖' },
  { id:'rituals',   label:'Rites & Rituals',   glyph:'⛧' },
  { id:'market',    label:'Black Market',      glyph:'☽' },
  { id:'factions',  label:'Allegiances',       glyph:'◉' },
  { id:'inventory', label:'Possessions',       glyph:'◇' },
  { id:'quests',    label:'Investigations',    glyph:'✦' },
  { id:'character', label:'Self',              glyph:'∞' },
];

export default function GameLayout({ character, combat, pendingEvent, actions }) {
  const [view, setView]             = useState('city');
  const [npcOpen, setNpcOpen]       = useState(false);
  const [showBreakdown, setBreakdown] = useState(false);
  const { toasts, addToast, removeToast } = useToasts();

  const { travel, performAction, attackEnemy, fleeCombat,
    commitCrime, performRitual, performTraining,
    useItem, equipItem, buyItem, sellItem,
    updateNPCTrust, resolveEvent,
    setPendingEvent, setCharacter, addLog } = actions;

  // Breakdown trigger
  useEffect(() => {
    if ((character?.stability ?? 1) <= 0 && !showBreakdown) setBreakdown(true);
  }, [character?.stability]);

  // Warning toasts
  useEffect(() => {
    if (character?.stability === 2) addToast('Stability faltering — seek treatment.', 'warn');
  }, [character?.stability]);
  useEffect(() => {
    if (character?.wounds === 'Critical') addToast('Critical wounds.', 'danger');
    if (character?.wounds === 'Mortal')   addToast('Mortal wounds. You are dying.', 'danger');
  }, [character?.wounds]);
  useEffect(() => {
    if ((character?.insight ?? 0) > 0 && character.insight % 2 === 0)
      addToast(`Insight ${character.insight} — the veil grows thinner.`, 'veil');
  }, [character?.insight]);

  const currentNPC = getNPCForLocation(character?.location);
  const hour       = character?.gameTime?.hour ?? 8;
  const timeDesc   = getTimeDescription(hour);
  const isDying    = (character?.stability ?? 10) <= 2 || ['Critical','Mortal'].includes(character?.wounds);

  const resolveBreakdown = (effect) => {
    setCharacter(c => {
      let n = {...c};
      if (effect.stabilityRestore) n.stability   = Math.min(effect.stabilityRestore, n.maxStability);
      if (effect.insightGain)       n.insight     = Math.min(n.insight + effect.insightGain, n.maxInsight);
      if (effect.thalers)           n.thalers     = n.thalers + effect.thalers;
      if (effect.apRestore)         n.ap          = n.maxAp;
      if (effect.nerve)             n.nerve       = Math.max(0, n.nerve + effect.nerve);
      if (effect.guiltStacks)       n.guiltStacks = (n.guiltStacks||0) + effect.guiltStacks;
      if (effect.factionReward) {
        const {faction, amount} = effect.factionReward;
        n.factionStandings = {...n.factionStandings, [faction]:(n.factionStandings[faction]||0)+amount};
      }
      return n;
    });
    addLog({type:'system', text:'[Breakdown resolved] You surface. Something has shifted.'});
    setBreakdown(false);
    addToast('You return to yourself. The world is different.', 'veil');
  };

  return (
    <div className={`${styles.root} ${isDying ? styles.dying : ''}`}>
      {/* Left navigation */}
      <SideNav
        views={VIEWS} current={view} onSelect={setView}
        character={character}
        currentNPC={currentNPC}
        onOpenNPC={() => setNpcOpen(true)}
        hour={hour}
      />

      {/* Right: status strip + content */}
      <div className={styles.right}>
        <StatusStrip character={character} timeDesc={timeDesc} />

        <div className={styles.content}>
          {/* Main view */}
          <div className={styles.viewPane}>
            {view==='city'      && <CityView      character={character} onTravel={travel} onAction={performAction} onTrain={performTraining} addToast={addToast} />}
            {view==='crimes'    && <CrimesView    character={character} onCommit={commitCrime} />}
            {view==='rituals'   && <RitualsView   character={character} onPerform={performRitual} />}
            {view==='market'    && <MarketView    character={character} onBuy={buyItem} onSell={sellItem} />}
            {view==='factions'  && <FactionsView  character={character} />}
            {view==='inventory' && <InventoryView character={character} onUse={useItem} onEquip={equipItem} onSell={sellItem} />}
            {view==='quests'    && <QuestView     character={character} />}
            {view==='character' && <CharacterView character={character} />}
          </div>

          {/* Narrative feed — right column */}
          <NarrativeFeed log={character?.log} />
        </div>
      </div>

      {/* Overlays */}
      {combat && <CombatOverlay character={character} combat={combat} onAttack={attackEnemy} onFlee={fleeCombat} />}
      {pendingEvent && (
        <EventOverlay
          event={pendingEvent} character={character}
          onResolve={resolveEvent}
          onDismiss={() => setPendingEvent(null)}
        />
      )}
      {npcOpen && currentNPC && (
        <NPCOverlay
          npc={currentNPC} character={character}
          onClose={() => { updateNPCTrust(currentNPC.id, 5); setNpcOpen(false); }}
        />
      )}
      {showBreakdown && <BreakdownOverlay character={character} onResolve={resolveBreakdown} />}

      <ToastLayer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

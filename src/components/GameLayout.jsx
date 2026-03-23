import { useState, useEffect, useRef } from 'react';
import SideNav        from './ui/SideNav.jsx';
import StatusStrip    from './ui/StatusStrip.jsx';
import NarrativeFeed  from './ui/NarrativeFeed.jsx';
import { ToastLayer, useToasts } from './ui/ToastLayer.jsx';

import CityView      from './views/CityView.jsx';
import CrimesView    from './views/CrimesView.jsx';
import RitualsView   from './views/RitualsView.jsx';
import MarketView    from './views/MarketView.jsx';
import FactionsView  from './views/FactionsView.jsx';
import InventoryView from './views/InventoryView.jsx';
import QuestView     from './views/QuestView.jsx';
import CharacterView    from './views/CharacterView.jsx';
import LoreView        from './views/LoreView.jsx';
import ArchivesView    from './views/ArchivesView.jsx';
import ScenarioView    from './views/ScenarioView.jsx';
import OverviewView    from './views/OverviewView.jsx';
import TransmissionView from './views/TransmissionView.jsx';
import JournalView     from './views/JournalView.jsx';

import CombatOverlay    from './overlays/CombatOverlay.jsx';
import EventOverlay     from './overlays/EventOverlay.jsx';
import NPCOverlay       from './overlays/NPCOverlay.jsx';
import BreakdownOverlay from './overlays/BreakdownOverlay.jsx';
import DreamOverlay     from './overlays/DreamOverlay.jsx';
import MortalOverlay    from './overlays/MortalOverlay.jsx';
import DAEventOverlay   from './overlays/DAEventOverlay.jsx';

import { getNPCForLocation } from '../data/npcs.js';
import { getDeathAngelForSecret } from '../data/deathAngels.js';
import { getTimeDescription } from './ui/timeUtils.js';
import { checkQuestProgress } from '../data/quests.js';
import { checkScenarioProgress, applyScenarioUpdates } from '../utils/scenarioTracker.js';
import { checkWorldEventTriggers } from '../data/worldEvents.js';
import { INSIGHT_EVENTS } from '../data/awakening.js';
import styles from './GameLayout.module.css';

export const VIEWS = [
  { id:'overview',     label:'Overview',           glyph:'◉' },
  { id:'city',         label:'The City',          glyph:'◈' },
  { id:'crimes',       label:'Criminal Affairs',   glyph:'⚖' },
  { id:'rituals',      label:'Rites & Rituals',    glyph:'⛧' },
  { id:'market',       label:'Black Market',       glyph:'☽' },
  { id:'factions',     label:'Allegiances',        glyph:'◉' },
  { id:'inventory',    label:'Possessions',        glyph:'◇' },
  { id:'quests',       label:'Investigations',     glyph:'✦' },
  { id:'scenarios',    label:'Major Cases',        glyph:'◆' },
  { id:'journal',      label:'Field Journal',      glyph:'📝' },
  { id:'transmission', label:'The Transmission',   glyph:'◫' },
  { id:'archives',     label:'The Archives',       glyph:'📜' },
  { id:'lore',         label:'Lore & Cosmology',   glyph:'◎' },
  { id:'character',    label:'Self',               glyph:'∞' },
];

export default function GameLayout({ character, combat, pendingEvent, actions }) {
  const [view,         setView]          = useState('city');
  const [npcOpen,      setNpcOpen]       = useState(false);
  const [showBreakdown,setBreakdown]     = useState(false);
  const [dreamState,   setDream]         = useState(null); // { day }
  const [showMortal,   setMortal]        = useState(false);
  const { toasts, addToast, removeToast } = useToasts();

  const prevStabilityRef = useRef(character?.stability ?? 10);
  const prevWoundsRef    = useRef(character?.wounds ?? 'None');
  const prevDayRef       = useRef(character?.gameTime?.day ?? 1);
  const prevInsightRef   = useRef(character?.insight ?? 0);

  const {
    travel, performAction, attackEnemy, fleeCombat,
    commitCrime, performRitual, performTraining,
    useItem, equipItem, buyItem, sellItem,
    updateNPCTrust, resolveEvent,
    setPendingEvent, setCharacter,
    pendingDAEvent, setPendingDAEvent,
    resolveDAEvent,
    addLog,
  } = actions;

  // ── Journal update handler ─────────────────────────────────────────────
  const updateJournal = (entries) => {
    setCharacter(c => ({ ...c, journal: entries }));
  };

  // ── World events: check on day change ──────────────────────────────────
  const prevDayWorldRef = useRef(character?.gameTime?.day ?? 1);
  useEffect(() => {
    if (!character) return;
    const day = character.gameTime?.day ?? 1;
    if (day <= prevDayWorldRef.current) return;
    prevDayWorldRef.current = day;

    const active = character.activeWorldEvents || [];
    const triggered = checkWorldEventTriggers(character, active.map(e => e.id));
    if (!triggered.length) return;

    const now = character.gameTime;
    setCharacter(c => {
      let n = { ...c };
      const newActive = [...(n.activeWorldEvents || [])];
      triggered.forEach(evt => {
        // apply immediate effects
        if (evt.effect?.nerve)          n.nerve     = Math.min(Math.max(0, (n.nerve||0) + evt.effect.nerve), n.maxNerve||50);
        if (evt.effect?.insight)        n.insight   = Math.min((n.insight||0) + evt.effect.insight, n.maxInsight||10);
        if (evt.effect?.stabilityLoss)  n.stability = Math.max(0, (n.stability||0) - evt.effect.stabilityLoss);
        if (evt.duration > 0)           newActive.push({ id: evt.id, expiresDay: now.day + evt.duration });
      });
      // expire old world events
      n.activeWorldEvents = newActive.filter(e => e.expiresDay > day);
      return n;
    });
    triggered.forEach(evt => {
      addLog({ type: 'system', text: `[World Event: ${evt.title}] ${evt.logText}` });
      addToast(evt.title, evt.type === 'threat' ? 'danger' : 'veil', 5000);
    });
  }, [character?.gameTime?.day]);

  // ── Reactive side-effects ───────────────────────────────────────────────
  useEffect(() => {
    if (!character) return;
    const stab   = character.stability ?? 10;
    const wounds = character.wounds ?? 'None';
    const day    = character.gameTime?.day ?? 1;
    const insight= character.insight ?? 0;

    // Breakdown trigger
    if (stab <= 0 && !showBreakdown) setBreakdown(true);

    // Mortal wound trigger
    if (wounds === 'Mortal' && prevWoundsRef.current !== 'Mortal') setMortal(true);

    // Day change → dream
    if (day > prevDayRef.current) {
      setDream({ day });
      setCharacter(c => ({ ...c, stats: { ...c.stats, daysPlayed: (c.stats?.daysPlayed||1)+1 } }));
    }

    // Toasts on significant changes
    if (stab < prevStabilityRef.current && stab <= 3)
      addToast(`Stability at ${stab}. Your grip on the Illusion is failing.`, 'danger');
    if (wounds === 'Critical' && prevWoundsRef.current !== 'Critical')
      addToast('Critical wounds. Find a hospital.', 'danger');
    if (insight > prevInsightRef.current) {
      if (insight % 2 === 0)
        addToast(`Insight ${insight} — the city reveals more of what it truly is.`, 'veil');
      // Milestone events
      const evt = INSIGHT_EVENTS[insight];
      if (evt) {
        setTimeout(() => {
          addToast(evt.title, 'veil', 6000);
          addLog({ type: 'system', text: `[Awakening: ${evt.title}] ${evt.text}` });
        }, 1000);
      }
    }

    prevStabilityRef.current = stab;
    prevWoundsRef.current    = wounds;
    prevDayRef.current       = day;
    prevInsightRef.current   = insight;
  }, [character?.stability, character?.wounds, character?.gameTime?.day, character?.insight]);

  // ── Quest progress wiring ───────────────────────────────────────────────
  const trackQuestProgress = (actionId, locationId) => {
    if (!character) return;
    const updates = checkQuestProgress(character, actionId, locationId);
    if (!updates.length) return;

    setCharacter(c => {
      const qp = { ...(c.questProgress || {}) };
      updates.forEach(u => {
        const prev = qp[u.questId] || { stageIdx: 0, actionCount: 0, completed: false };
        if (u.questComplete) {
          qp[u.questId] = { ...prev, stageIdx: u.nextStageIdx, actionCount: 0, completed: true };
        } else if (u.stageComplete) {
          qp[u.questId] = { ...prev, stageIdx: u.nextStageIdx, actionCount: 0 };
        } else {
          qp[u.questId] = { ...prev, actionCount: u.newCount };
        }
      });
      let n = { ...c, questProgress: qp };

      // Apply quest rewards
      updates.filter(u => u.stageComplete && u.reward).forEach(u => {
        const r = u.reward;
        if (r.thalers)  n.thalers  = (n.thalers||0) + r.thalers;
        if (r.insight)  n.insight  = Math.min((n.insight||0)+r.insight, n.maxInsight||10);
        if (r.stabilityLoss) n.stability = Math.max(0, (n.stability||0) - r.stabilityLoss);
        if (r.factionReward) n.factionStandings = { ...n.factionStandings, [r.factionReward.faction]: (n.factionStandings?.[r.factionReward.faction]||0)+r.factionReward.amount };
      });
      return n;
    });

    updates.forEach(u => {
      if (u.stageComplete) {
        addToast(`Investigation: "${u.questName}" — stage complete.`, 'veil');
        addLog({ type: 'complete', text: `[Investigation: ${u.questName}] Stage complete — ${u.stage.title}. ${u.reward?.text || ''}` });
      }
      if (u.questComplete) {
        addToast(`Investigation concluded: "${u.questName}".`, 'veil');
      }
    });
  };

  // Wrap performAction to also track quests
  const handleAction = (actionId) => {
    performAction(actionId);
    trackQuestProgress(actionId, character?.location);
    trackScenarioProgress(actionId, character?.location);
  };
  const handleCrime = (crime) => {
    commitCrime(crime);
    trackQuestProgress(crime.id, character?.location);
    trackScenarioProgress(crime.id, character?.location);
  };

  // ── Scenario progress ──────────────────────────────────────────────────
  const trackScenarioProgress = (actionId, locationId) => {
    if (!character) return;
    const updates = checkScenarioProgress(character, actionId, locationId);
    if (!updates.length) return;

    setCharacter(c => {
      let n = applyScenarioUpdates(c, updates);
      // Award ascension progress for completing scenario acts/scenarios
      let ascGain = 0;
      updates.forEach(u => {
        if (u.actComplete) ascGain += 10;
        if (u.scenarioComplete) ascGain += 15;
      });
      if (ascGain > 0) n = { ...n, ascensionProgress: Math.min((n.ascensionProgress||0) + ascGain, 100) };
      return n;
    });

    updates.forEach(u => {
      if (u.actComplete) {
        addToast(`${u.scenarioName}: Act ${u.act.num} complete.`, 'veil');
        addLog({ type: 'complete', text: `[${u.scenarioName}] Act complete — ${u.act.title}. ${u.act.reveals?.substring(0, 80)}...` });
      }
      if (u.scenarioComplete) {
        addToast(`Investigation concluded: ${u.scenarioName}.`, 'veil');
      }
    });
  };

  // ── Breakdown ──────────────────────────────────────────────────────────
  const resolveBreakdown = (effect) => {
    setCharacter(c => {
      let n = { ...c };
      if (effect.stabilityRestore)  n.stability   = Math.min(effect.stabilityRestore, n.maxStability);
      if (effect.insightGain)        n.insight     = Math.min(n.insight + effect.insightGain, n.maxInsight);
      if (effect.thalers)            n.thalers     = n.thalers + effect.thalers;
      if (effect.apRestore)          n.ap          = n.maxAp;
      if (effect.nerve)              n.nerve       = Math.max(0, n.nerve + effect.nerve);
      if (effect.guiltStacks)        n.guiltStacks = (n.guiltStacks||0) + effect.guiltStacks;
      if (effect.factionReward) {
        const { faction, amount } = effect.factionReward;
        n.factionStandings = { ...n.factionStandings, [faction]: (n.factionStandings[faction]||0) + amount };
      }
      return n;
    });
    addLog?.({ type:'system', text:'[Breakdown] You surface from the episode. Something is different.' });
    setBreakdown(false);
  };

  // ── Mortal wounds ──────────────────────────────────────────────────────
  const handleSeekHelp = () => {
    if ((character?.thalers||0) < 500) {
      addToast('You cannot afford emergency care. ₮500 required.', 'danger');
      return;
    }
    setCharacter(c => ({ ...c, thalers: c.thalers-500, wounds:'Serious' }));
    addLog({ type:'heal', text:'Emergency care at St. Aurum. Mortal wounds reduced to Serious. ₮500 spent.' });
    setMortal(false);
  };
  const handleDie = () => {
    addLog({ type:'system', text:'[Death] The Awakening ends here. The Labyrinth receives you.' });
    setTimeout(() => { localStorage.clear(); window.location.reload(); }, 2000);
  };

  const currentNPC = getNPCForLocation(character?.location);
  const hour       = character?.gameTime?.hour ?? 8;
  const timeDesc   = getTimeDescription(hour);
  const isDying    = (character?.stability ?? 10) <= 2 || ['Critical','Mortal'].includes(character?.wounds);

  return (
    <div className={`${styles.root} ${isDying ? styles.dying : ''}`}>
      <SideNav views={VIEWS} current={view} onSelect={setView}
        character={character} currentNPC={currentNPC}
        onOpenNPC={() => setNpcOpen(true)} hour={hour} />

      <div className={styles.right}>
        <StatusStrip character={character} timeDesc={timeDesc} />
        <div className={styles.content}>
          <div className={styles.viewPane}>
            {view==='city'         && <CityView      character={character} onTravel={travel} onAction={handleAction} onTrain={performTraining} addToast={addToast} />}
            {view==='crimes'       && <CrimesView    character={character} onCommit={handleCrime} />}
            {view==='rituals'      && <RitualsView   character={character} onPerform={performRitual} />}
            {view==='market'       && <MarketView    character={character} onBuy={buyItem} onSell={sellItem} />}
            {view==='factions'     && <FactionsView  character={character} />}
            {view==='inventory'    && <InventoryView character={character} onUse={useItem} onEquip={equipItem} onSell={sellItem} />}
            {view==='quests'       && <QuestView     character={character} />}
            {view==='character'    && <CharacterView character={character} />}
            {view==='overview'     && <OverviewView  character={character} />}
            {view==='scenarios'    && <ScenarioView  character={character} />}
            {view==='transmission' && <TransmissionView character={character} />}
            {view==='archives'     && <ArchivesView  character={character} />}
            {view==='lore'         && <LoreView      character={character} />}
            {view==='journal'      && <JournalView   character={character} onUpdate={updateJournal} />}
          </div>
          <NarrativeFeed log={character?.log} />
        </div>
      </div>

      {/* Overlays — priority order matters */}
      {showMortal   && <MortalOverlay    character={character} onSeekHelp={handleSeekHelp} onDie={handleDie} />}
      {dreamState   && <DreamOverlay     character={character} day={dreamState.day} onDismiss={() => setDream(null)} />}
      {showBreakdown&& !showMortal && !dreamState && <BreakdownOverlay character={character} onResolve={resolveBreakdown} />}
      {combat       && !showMortal && !dreamState && <CombatOverlay character={character} combat={combat} onAttack={attackEnemy} onFlee={fleeCombat} />}
      {pendingEvent && !showMortal && !dreamState && !combat && (
        <EventOverlay event={pendingEvent} character={character}
          onResolve={resolveEvent} onDismiss={() => setPendingEvent(null)} />
      )}
      {npcOpen && currentNPC && !showMortal && (
        <NPCOverlay npc={currentNPC} character={character}
          onClose={() => { updateNPCTrust(currentNPC.id, 5); setNpcOpen(false); }} />
      )}

      {pendingDAEvent && !showBreakdown && !showMortal && !dreamState && !combat && !pendingEvent && (
        <DAEventOverlay
          event={pendingDAEvent}
          deathAngel={getDeathAngelForSecret(character?.darkSecret?.id)}
          character={character}
          onResolve={resolveDAEvent}
          onDismiss={() => setPendingDAEvent(null)}
        />
      )}
      <ToastLayer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

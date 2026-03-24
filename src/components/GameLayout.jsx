import { useState, useEffect, useRef } from 'react';
import SideNav        from './ui/SideNav.jsx';
import StatusStrip    from './ui/StatusStrip.jsx';
import NarrativeFeed  from './ui/NarrativeFeed.jsx';
import { ToastLayer, useToasts } from './ui/ToastLayer.jsx';

import CityView      from './views/CityView.jsx';
import CrimesView    from './views/CrimesView.jsx';
import RitualsView   from './views/RitualsView.jsx';
import MarketView    from './views/MarketView.jsx';
import CraftingView  from './views/CraftingView.jsx';
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
import AscensionOverlay from './overlays/AscensionOverlay.jsx';

import { getNPCForLocation } from '../data/npcs.js';
import { getDeathAngelForSecret } from '../data/deathAngels.js';
import { getTimeDescription } from './ui/timeUtils.js';
import { checkQuestProgress } from '../data/quests.js';
import { checkScenarioProgress, applyScenarioUpdates } from '../utils/scenarioTracker.js';
import { checkWorldEventTriggers } from '../data/worldEvents.js';
import { INSIGHT_EVENTS } from '../data/awakening.js';
import { ITEMS } from '../data/items.js';
import styles from './GameLayout.module.css';

export const VIEWS = [
  { id:'overview',     label:'Overview',           glyph:'◉' },
  { id:'city',         label:'The City',          glyph:'◈' },
  { id:'crimes',       label:'Criminal Affairs',   glyph:'⚖' },
  { id:'rituals',      label:'Rites & Rituals',    glyph:'⛧' },
  { id:'market',       label:'Black Market',       glyph:'☽' },
  { id:'crafting',     label:'Crafting',           glyph:'⚗' },
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

// Quick-access views shown in the mobile bottom nav bar
const MOBILE_NAV = [
  { id:'city',      glyph:'◈', label:'City'      },
  { id:'crimes',    glyph:'⚖', label:'Crimes'    },
  { id:'market',    glyph:'☽', label:'Market'    },
  { id:'inventory', glyph:'◇', label:'Items'     },
  { id:'character', glyph:'∞', label:'Self'      },
];

export default function GameLayout({ character, combat, pendingEvent, actions }) {
  const [view,         setView]          = useState('city');
  const [npcOpen,      setNpcOpen]       = useState(false);
  const [showBreakdown,setBreakdown]     = useState(false);
  const [dreamState,   setDream]         = useState(null); // { day }
  const [showMortal,   setMortal]        = useState(false);
  const [showAscension,setAscension]     = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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
    useDarkAbility, craftItem,
    addLog,
  } = actions;

  // ── Journal update handler ─────────────────────────────────────────────
  const updateJournal = (entries) => {
    setCharacter(c => ({ ...c, journal: entries }));
  };

  // ── World events: check on day change ──────────────────────────────────
  const prevDayWorldRef = useRef(character?.gameTime?.day ?? 1);
  const triggeredWorldRef = useRef([]);
  useEffect(() => {
    if (!character) return;
    const day = character.gameTime?.day ?? 1;
    if (day <= prevDayWorldRef.current) return;
    prevDayWorldRef.current = day;

    triggeredWorldRef.current = [];
    setCharacter(c => {
      const active = c.activeWorldEvents || [];
      const triggered = checkWorldEventTriggers(c, active.map(e => e.id));
      if (!triggered.length) return c;

      triggeredWorldRef.current = triggered;
      let n = { ...c };
      const newActive = [...(n.activeWorldEvents || [])];
      triggered.forEach(evt => {
        if (evt.effect?.nerve)         n.nerve     = Math.min(Math.max(0, (n.nerve||0) + evt.effect.nerve), n.maxNerve||50);
        if (evt.effect?.insight)       n.insight   = Math.min((n.insight||0) + evt.effect.insight, n.maxInsight||10);
        if (evt.effect?.stabilityLoss) n.stability = Math.max(0, (n.stability||0) - evt.effect.stabilityLoss);
        if (evt.effect?.heatGain)      n.heat      = Math.min((n.heat||0) + evt.effect.heatGain, n.maxHeat||100);
        if (evt.effect?.nerve && evt.effect.nerve > 0) n.nerve = Math.min(n.nerve, n.maxNerve||50); // cap
        if (evt.duration > 0)          newActive.push({ id: evt.id, expiresDay: day + evt.duration });
        // Auto-add journal entry for significant world events
        if (['threat','supernatural','political'].includes(evt.type)) {
          const entry = {
            id: Date.now() + Math.random(),
            type: evt.type === 'supernatural' ? 'entity' : 'threat',
            title: evt.title,
            body: evt.description,
            createdAt: Date.now(),
            day: n.gameTime?.day ?? 1,
            auto: true,
          };
          n.journal = [entry, ...(n.journal || [])];
        }
      });
      n.activeWorldEvents = newActive.filter(e => e.expiresDay > day);
      return n;
    });

    setTimeout(() => {
      triggeredWorldRef.current.forEach(evt => {
        addLog({ type: 'system', text: `[World Event: ${evt.title}] ${evt.logText}` });
        addToast(evt.title, evt.type === 'threat' ? 'danger' : 'veil', 5000);
      });
      triggeredWorldRef.current = [];
    }, 50);
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

    // Ascension trigger — fires once when progress reaches 100
    if ((character.ascensionProgress ?? 0) >= 100 && !showAscension && !showMortal) {
      setAscension(true);
    }

    // Day change → dream
    if (day > prevDayRef.current) {
      setDream({ day });
      setCharacter(c => ({ ...c, stats: { ...c.stats, daysPlayed: (c.stats?.daysPlayed||1)+1 } }));
      // Daily guilt log when stacks are significant
      const guilt = character.guiltStacks || 0;
      if (guilt >= 8) addLog({ type: 'system', text: `[Guilt ${guilt}/${10}] The weight of what you have done is becoming visible. Your patron has noticed.` });
      else if (guilt >= 5) addLog({ type: 'system', text: `[Guilt ${guilt}/${10}] What you have done follows you. Stability is being eroded.` });
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
          if (evt.stabilityLoss) {
            setCharacter(c => ({ ...c, stability: Math.max(0, (c.stability||0) - evt.stabilityLoss) }));
          }
        }, 1000);
      }
    }

    prevStabilityRef.current = stab;
    prevWoundsRef.current    = wounds;
    prevDayRef.current       = day;
    prevInsightRef.current   = insight;
  }, [character?.stability, character?.wounds, character?.gameTime?.day, character?.insight, character?.ascensionProgress]);

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
        // Item reward
        if (r.item && ITEMS[r.item]) {
          const inv = [...(n.inventory||[])];
          const existing = inv.findIndex(i => i.id === r.item);
          if (existing !== -1) { inv[existing] = { ...inv[existing], qty: (inv[existing].qty||1)+1 }; }
          else { inv.push({ ...ITEMS[r.item], qty: 1 }); }
          n.inventory = inv;
        }
        // Auto journal entry for completed quest stages with reward text
        if (r.text) {
          const journalEntry = {
            id: Date.now() + Math.random(),
            type: 'clue',
            title: `[${u.questName}] ${u.stage.title}`,
            body: r.text,
            createdAt: Date.now(),
            day: n.gameTime?.day ?? 1,
            auto: true,
          };
          n.journal = [journalEntry, ...(n.journal || [])];
        }
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
      // Auto-add journal entries for scenario act completions
      const newJournalEntries = [];
      updates.filter(u => u.actComplete && u.act?.reveals).forEach(u => {
        newJournalEntries.push({
          id: Date.now() + Math.random(),
          type: 'note',
          title: `[${u.scenarioName}] ${u.act.title}`,
          body: u.act.reveals?.substring(0, 200) + (u.act.reveals?.length > 200 ? '…' : ''),
          createdAt: Date.now(),
          day: n.gameTime?.day ?? 1,
          auto: true,
        });
      });
      if (newJournalEntries.length) {
        n = { ...n, journal: [...newJournalEntries, ...(n.journal || [])] };
      }
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

  // ── Ascension handling ────────────────────────────────────────────────
  const handleAscension = (choice) => {
    if (choice === 'remain') {
      // Player stays — reduce ascension progress so it doesn't keep re-firing
      setCharacter(c => ({ ...c, ascensionProgress: 80, ascensionChoice: 'remain' }));
      addLog({ type: 'system', text: '[Ascension] You close the door. You remain. The city remains.' });
      setAscension(false);
    } else if (choice === 'merge') {
      setCharacter(c => ({ ...c, ascensionProgress: 100, ascensionChoice: 'merge' }));
      addLog({ type: 'system', text: '[Ascension: The Third Path] You become something that moves between layers. Neither here nor gone.' });
      // Game continues — player exists in a transcendent state
      setTimeout(() => {
        setAscension(false);
        addToast('You are the threshold. The game continues differently now.', 'veil', 8000);
        // Grant significant rewards for the merge path
        setCharacter(c => ({
          ...c,
          insight: Math.min((c.insight||0)+2, c.maxInsight||10),
          stability: Math.min((c.stability||0)+5, c.maxStability),
          guiltStacks: 0,
        }));
      }, 500);
    } else {
      // True ascension — game ends
      addLog({ type: 'system', text: '[Ascension] You leave the Illusion behind. The Labyrinth receives what remains. The city forgets.' });
      setAscension(false);
      setTimeout(() => {
        localStorage.clear();
        window.location.reload();
      }, 3000);
    }
  };
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

  const handleSelectView = (id) => {
    setView(id);
    setMobileNavOpen(false);
  };

  return (
    <div className={`${styles.root} ${isDying ? styles.dying : ''}`}>
      {/* Mobile nav drawer backdrop */}
      {mobileNavOpen && (
        <div className={styles.navOverlay} onClick={() => setMobileNavOpen(false)} />
      )}

      <SideNav views={VIEWS} current={view} onSelect={handleSelectView}
        character={character} currentNPC={currentNPC}
        onOpenNPC={() => setNpcOpen(true)} hour={hour}
        mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />

      <div className={styles.right}>
        <StatusStrip character={character} timeDesc={timeDesc}
          onMenuToggle={() => setMobileNavOpen(v => !v)} />
        <div className={styles.content}>
          <div className={styles.viewPane}>
            {view==='city'         && <CityView      character={character} onTravel={travel} onAction={handleAction} onTrain={performTraining} addToast={addToast} />}
            {view==='crimes'       && <CrimesView    character={character} onCommit={handleCrime} />}
            {view==='rituals'      && <RitualsView   character={character} onPerform={performRitual} />}
            {view==='market'       && <MarketView    character={character} onBuy={buyItem} onSell={sellItem} />}
            {view==='crafting'     && <CraftingView  character={character} onCraft={craftItem} />}
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

      {/* Mobile bottom navigation bar */}
      <nav className={styles.mobileNav}>
        {MOBILE_NAV.map(v => (
          <button key={v.id}
            className={`${styles.mobileNavBtn} ${view === v.id ? styles.mobileActive : ''}`}
            onClick={() => handleSelectView(v.id)}>
            <span>{v.glyph}</span>
            <span className={styles.mobileNavLabel}>{v.label}</span>
          </button>
        ))}
        <button className={`${styles.mobileNavBtn} ${mobileNavOpen ? styles.mobileActive : ''}`}
          onClick={() => setMobileNavOpen(v => !v)}>
          <span>☰</span>
          <span className={styles.mobileNavLabel}>More</span>
        </button>
      </nav>

      {/* Overlays — priority order matters */}
      {showMortal   && <MortalOverlay    character={character} onSeekHelp={handleSeekHelp} onDie={handleDie} />}
      {showAscension && !showMortal && <AscensionOverlay character={character} onChoose={handleAscension} onDismiss={() => { setAscension(false); setCharacter(c => ({ ...c, ascensionProgress: 95 })); }} />}
      {dreamState   && !showMortal && !showAscension && <DreamOverlay character={character} day={dreamState.day} onDismiss={() => setDream(null)} />}
      {showBreakdown&& !showMortal && !dreamState && !showAscension && <BreakdownOverlay character={character} onResolve={resolveBreakdown} />}
      {combat       && !showMortal && !dreamState && !showAscension && <CombatOverlay character={character} combat={combat} onAttack={attackEnemy} onFlee={fleeCombat} onDarkAbility={useDarkAbility} />}
      {pendingEvent && !showMortal && !dreamState && !combat && !showAscension && (
        <EventOverlay event={pendingEvent} character={character}
          onResolve={resolveEvent} onDismiss={() => setPendingEvent(null)} />
      )}
      {npcOpen && currentNPC && !showMortal && (
        <NPCOverlay npc={currentNPC} character={character}
          onClose={() => { updateNPCTrust(currentNPC.id, 5); setNpcOpen(false); }}
          onAction={(serviceId) => { handleAction(serviceId); }} />
      )}

      {pendingDAEvent && !showBreakdown && !showMortal && !dreamState && !combat && !pendingEvent && !showAscension && (
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

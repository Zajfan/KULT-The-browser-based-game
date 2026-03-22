import { useState, useCallback, useEffect, useRef } from 'react';
import { rollCheck, rollDamage } from '../utils/dice.js';
import { saveGame, loadGame } from '../utils/saveLoad.js';
import { ITEMS, getItem } from '../data/items.js';
import { ENEMIES, getEnemiesForLocation } from '../data/enemies.js';
import { FACTIONS } from '../data/factions.js';
import { LOCATIONS, ACTION_LABELS } from '../data/locations.js';
import { CRIMES } from '../data/crimes.js';
import { RITUALS } from '../data/rituals.js';

const WOUND_LEVELS = ['None', 'Stabilized', 'Serious', 'Critical', 'Mortal'];

const AP_REGEN_INTERVAL = 30000; // 30 seconds
const AP_REGEN_AMOUNT = 5;
const NERVE_REGEN_INTERVAL = 60000;
const NERVE_REGEN_AMOUNT = 3;

export function createNewCharacter(form) {
  const ds = form.darkSecret;
  const attrs = {
    reason: 0, intuition: 0, perception: 0,
    coolness: 0, violence: 0, soul: 0,
    willpower: 0, fortitude: 0, reflexes: 0,
    ...(ds?.startingBonus || {}),
  };
  // Apply attribute points from creation
  Object.entries(form.attributePoints || {}).forEach(([k, v]) => {
    attrs[k] = (attrs[k] || 0) + v;
  });

  const inventory = [];
  const startItem = form.startingItemId;
  if (startItem && ITEMS[startItem]) inventory.push({ ...ITEMS[startItem], qty: 1 });
  // Apply advantage items
  (form.advantages || []).forEach(adv => {
    if (adv.id === 'artifact_keeper') inventory.push({ ...ITEMS['unknown_artifact'], qty: 1 });
  });

  const factionStandings = {};
  Object.keys(FACTIONS).forEach(fId => { factionStandings[fId] = fId === form.faction ? 10 : 0; });

  return {
    name: form.name,
    darkSecret: ds,
    advantages: form.advantages || [],
    disadvantages: form.disadvantages || [],
    attributes: attrs,
    stability: 10 + (attrs.soul || 0),
    maxStability: 10 + (attrs.soul || 0),
    wounds: 'None',
    insight: ds?.startingInsight || 0,
    maxInsight: 10,
    ap: 100,
    maxAp: 100,
    nerve: 50,
    maxNerve: 50,
    thalers: 500,
    faction: form.faction || 'neutral',
    factionStandings,
    inventory,
    equippedWeapon: null,
    equippedArmor: null,
    rituals: ds?.id === 'occultist' ? ['seeking', 'warding'] : [],
    location: 'residential',
    log: [
      {
        id: Date.now(),
        type: 'system',
        text: `You wake into the Illusion as ${form.name}. Dark secret: ${ds?.name || 'Unknown'}. The city stretches before you, as it always has. Something is different today.`,
        timestamp: new Date().toLocaleTimeString(),
      }
    ],
    stats: {
      actionsPerformed: 0,
      crimesCommitted: 0,
      entitiesDefeated: 0,
      ritualsPerformed: 0,
      stabilityLost: 0,
      insightGained: 0,
      thalersEarned: 0,
      daysPlayed: 1,
    },
    gameTime: { day: 1, hour: 8 },
    ascensionProgress: 0,
    guiltStacks: 0,
    activeEffects: [],
    createdAt: Date.now(),
  };
}

export function useGameState() {
  const [screen, setScreen] = useState('title'); // title | create | game
  const [character, setCharacter] = useState(null);
  const [combat, setCombat] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const apTimerRef = useRef(null);
  const nerveTimerRef = useRef(null);
  const timeTimerRef = useRef(null);

  // AP/Nerve regen
  useEffect(() => {
    if (!character || screen !== 'game') return;
    apTimerRef.current = setInterval(() => {
      setCharacter(c => {
        if (!c || c.ap >= c.maxAp) return c;
        return { ...c, ap: Math.min(c.ap + AP_REGEN_AMOUNT, c.maxAp) };
      });
    }, AP_REGEN_INTERVAL);
    nerveTimerRef.current = setInterval(() => {
      setCharacter(c => {
        if (!c || c.nerve >= c.maxNerve) return c;
        return { ...c, nerve: Math.min(c.nerve + NERVE_REGEN_AMOUNT, c.maxNerve) };
      });
    }, NERVE_REGEN_INTERVAL);
    timeTimerRef.current = setInterval(() => {
      setCharacter(c => {
        if (!c) return c;
        const newHour = (c.gameTime.hour + 1) % 24;
        const newDay = newHour === 0 ? c.gameTime.day + 1 : c.gameTime.day;
        return { ...c, gameTime: { hour: newHour, day: newDay } };
      });
    }, 120000); // 2 min = 1 game hour
    return () => {
      clearInterval(apTimerRef.current);
      clearInterval(nerveTimerRef.current);
      clearInterval(timeTimerRef.current);
    };
  }, [screen, character?.name]);

  // Auto-save
  useEffect(() => {
    if (character && screen === 'game') {
      const timeout = setTimeout(() => saveGame({ character, screen }), 2000);
      return () => clearTimeout(timeout);
    }
  }, [character, screen]);

  const addLog = useCallback((entry) => {
    setCharacter(c => ({
      ...c,
      log: [{ id: Date.now() + Math.random(), timestamp: new Date().toLocaleTimeString(), ...entry }, ...c.log].slice(0, 200),
    }));
  }, []);

  const startGame = useCallback((form) => {
    const char = createNewCharacter(form);
    setCharacter(char);
    setScreen('game');
  }, []);

  const loadSavedGame = useCallback((saved) => {
    setCharacter(saved.character);
    setScreen('game');
  }, []);

  const travel = useCallback((locationId) => {
    const loc = LOCATIONS[locationId];
    if (!loc) return;
    if (loc.unlockInsight > (character?.insight || 0)) {
      addLog({ type: 'error', text: `Your Insight (${character?.insight}) is too low to access ${loc.name}. Required: ${loc.unlockInsight}.` });
      return;
    }
    setCharacter(c => ({ ...c, location: locationId }));
    addLog({ type: 'travel', text: `You travel to ${loc.name}. ${loc.description}` });
  }, [character, addLog]);

  const performAction = useCallback(async (actionId, options = {}) => {
    if (!character) return;
    const loc = LOCATIONS[character.location];
    if (!loc) return;
    const apCost = loc.apCost[actionId] || 10;
    if (character.ap < apCost) {
      addLog({ type: 'error', text: `Not enough Action Points. Need ${apCost}, have ${Math.floor(character.ap)}.` });
      return;
    }

    setCharacter(c => ({ ...c, ap: c.ap - apCost, stats: { ...c.stats, actionsPerformed: c.stats.actionsPerformed + 1 } }));

    // Route to specific action handlers
    if (actionId === 'rest') return handleRest();
    if (actionId === 'heal_wounds') return handleHeal('wounds');
    if (actionId === 'treat_stability') return handleHeal('stability');
    if (actionId === 'pick_fight' || actionId === 'ambush_enemy' || actionId === 'face_nepharite') return startCombat();

    // Generic action resolution
    const attrMap = {
      search_apartment: 'perception', speak_neighbor: 'coolness', train_home: 'fortitude',
      work_job: 'reason', meet_contact: 'coolness', research_library: 'reason', bribe_official: 'coolness',
      commit_crime: 'perception', find_informant: 'coolness', buy_contraband: 'coolness',
      network_awakened: 'soul', trade_information: 'coolness', find_ritual: 'intuition', access_backroom: 'intuition',
      research_lore: 'reason', find_pattern: 'reason', access_restricted: 'perception', decode_document: 'reason',
      speak_patient: 'intuition', examine_records: 'reason', attempt_escape: 'reflexes', contact_entity: 'soul',
      investigate_factory: 'perception', find_cache: 'perception', infiltrate_cult: 'coolness',
      commune_entity: 'soul', harvest_essence: 'willpower', open_rift: 'soul', confront_archon: 'willpower',
      speak_dead: 'soul', rescue_soul: 'willpower', steal_secret: 'intuition',
      bribe_doctor: 'coolness', visit_psych_ward: 'willpower',
    };
    const attr = attrMap[actionId] || 'reason';
    const result = rollCheck(character.attributes[attr] || 0);

    let rewards = {};
    let consequences = {};

    // Reward/consequence logic per action
    if (actionId === 'work_job') {
      if (result.outcome === 'complete') rewards.thalers = Math.floor(Math.random() * 150) + 100;
      else if (result.outcome === 'partial') rewards.thalers = Math.floor(Math.random() * 80) + 50;
      else consequences.apLoss = 10;
    }
    if (actionId === 'bribe_official') {
      if (character.thalers < 200) { addLog({ type: 'error', text: 'Not enough Thalers to bribe anyone. (200 needed)' }); return; }
      setCharacter(c => ({ ...c, thalers: c.thalers - 200 }));
      if (result.outcome === 'complete') { rewards.nerve = 10; rewards.factionReward = { faction: 'neutral', amount: 5 }; }
      else if (result.outcome === 'partial') { rewards.nerve = 5; }
      else { consequences.stabilityLoss = 1; }
    }
    if (['find_ritual', 'research_lore', 'find_pattern', 'access_restricted', 'research_library'].includes(actionId)) {
      if (result.outcome === 'complete') rewards.insightGain = 1;
    }
    if (['commune_entity', 'contact_entity', 'open_rift', 'speak_dead'].includes(actionId)) {
      consequences.stabilityLoss = result.outcome === 'complete' ? 1 : result.outcome === 'partial' ? 2 : 3;
      if (result.outcome !== 'failure') rewards.insightGain = 1;
    }
    if (actionId === 'network_awakened') {
      if (result.outcome === 'complete') rewards.factionReward = { faction: 'awakened_circle', amount: 15 };
      else if (result.outcome === 'partial') rewards.factionReward = { faction: 'awakened_circle', amount: 5 };
    }
    if (actionId === 'find_cache') {
      if (result.outcome === 'complete') rewards.thalers = Math.floor(Math.random() * 300) + 100;
      else if (result.outcome === 'partial') rewards.thalers = Math.floor(Math.random() * 100) + 50;
    }
    if (actionId === 'train_home') {
      // Small stat improvement tracked separately
      if (result.outcome === 'complete') rewards.tempBonus = true;
    }

    // Apply all rewards/consequences
    applyOutcome(result, rewards, consequences, actionId);
  }, [character, addLog]);

  const applyOutcome = useCallback((result, rewards = {}, consequences = {}, actionId = '') => {
    setCharacter(c => {
      let newC = { ...c };
      // Apply thalers reward
      if (rewards.thalers) {
        newC.thalers = newC.thalers + rewards.thalers;
        newC.stats = { ...newC.stats, thalersEarned: newC.stats.thalersEarned + rewards.thalers };
      }
      // Apply nerve restore
      if (rewards.nerve) newC.nerve = Math.min(newC.nerve + rewards.nerve, newC.maxNerve);
      // Apply insight gain
      if (rewards.insightGain) {
        newC.insight = Math.min(newC.insight + 1, newC.maxInsight);
        newC.stats = { ...newC.stats, insightGained: newC.stats.insightGained + 1 };
      }
      // Apply faction reward
      if (rewards.factionReward) {
        const { faction, amount } = rewards.factionReward;
        newC.factionStandings = { ...newC.factionStandings, [faction]: (newC.factionStandings[faction] || 0) + amount };
      }
      // Apply stability loss
      if (consequences.stabilityLoss) {
        const loss = consequences.stabilityLoss;
        const hasMentalResist = c.advantages?.some(a => a.id === 'resistance_mental');
        const actualLoss = hasMentalResist ? Math.max(0, loss - 1) : loss;
        newC.stability = Math.max(0, newC.stability - actualLoss);
        newC.stats = { ...newC.stats, stabilityLost: newC.stats.stabilityLost + actualLoss };
      }
      return newC;
    });

    const actionLabel = ACTION_LABELS[actionId] || actionId;
    const outcomeColor = result.outcome === 'complete' ? '✦' : result.outcome === 'partial' ? '◆' : '✖';
    let text = `[${actionLabel}] ${outcomeColor} ${result.label} (2d10+attr = ${result.total})`;
    if (rewards.thalers) text += ` · Gained ${rewards.thalers} Thalers`;
    if (rewards.insightGain) text += ` · Insight +1`;
    if (consequences.stabilityLoss) text += ` · Stability -${consequences.stabilityLoss}`;
    addLog({ type: result.outcome, text });
  }, [addLog]);

  const handleRest = useCallback(() => {
    setCharacter(c => ({
      ...c,
      ap: Math.min(c.ap + 30, c.maxAp),
      stability: Math.min(c.stability + 1, c.maxStability),
    }));
    addLog({ type: 'rest', text: 'You rest. The Illusion presses less heavily for a moment. AP +30, Stability +1.' });
  }, [addLog]);

  const handleHeal = useCallback((type) => {
    if (type === 'wounds') {
      const cost = 300;
      if (!character || character.thalers < cost) { addLog({ type: 'error', text: `Treatment costs ${cost} Thalers.` }); return; }
      setCharacter(c => {
        const woundIdx = WOUND_LEVELS.indexOf(c.wounds);
        const newWound = woundIdx > 0 ? WOUND_LEVELS[woundIdx - 1] : 'None';
        return { ...c, wounds: newWound, thalers: c.thalers - cost };
      });
      addLog({ type: 'heal', text: `The doctor patches you up. Wound level reduced. (-${cost} Thalers)` });
    } else {
      const cost = 200;
      if (!character || character.thalers < cost) { addLog({ type: 'error', text: `Therapy costs ${cost} Thalers.` }); return; }
      setCharacter(c => ({ ...c, stability: Math.min(c.stability + 3, c.maxStability), thalers: c.thalers - cost }));
      addLog({ type: 'heal', text: `The therapist helps you reframe your experience. Stability +3. (-${cost} Thalers)` });
    }
  }, [character, addLog]);

  const startCombat = useCallback(() => {
    const enemies = getEnemiesForLocation(character.location);
    const enemy = { ...enemies[Math.floor(Math.random() * enemies.length)] };
    enemy.currentHp = enemy.hp;
    setCombat({ enemy, round: 1, log: [] });
    addLog({ type: 'combat', text: `⚔ Combat initiated: ${enemy.name} — ${enemy.description}` });
  }, [character, addLog]);

  const attackEnemy = useCallback(() => {
    if (!combat) return;
    const result = rollCheck(character.attributes.violence);
    let weaponBonus = 0;
    if (character.equippedWeapon) {
      const w = getItem(character.equippedWeapon);
      weaponBonus = w?.bonus || 0;
    }
    let playerDmg = 0, enemyDmg = 0;
    let roundLog = '';

    if (result.outcome === 'complete') {
      playerDmg = rollDamage(2, 6, weaponBonus);
      roundLog = `You strike true for ${playerDmg} damage.`;
    } else if (result.outcome === 'partial') {
      playerDmg = rollDamage(1, 6, weaponBonus);
      enemyDmg = rollDamage(1, 4, combat.enemy.bonus);
      roundLog = `Exchange of blows. You deal ${playerDmg}, take ${enemyDmg}.`;
    } else {
      enemyDmg = rollDamage(1, 6, combat.enemy.bonus);
      roundLog = `Missed. They hit you for ${enemyDmg}.`;
    }

    const newEnemyHp = combat.enemy.currentHp - playerDmg;
    const combatEnded = newEnemyHp <= 0;

    // Apply player damage
    if (enemyDmg > 0) {
      setCharacter(c => {
        const woundIdx = WOUND_LEVELS.indexOf(c.wounds);
        let newWound = c.wounds;
        if (enemyDmg >= 10) newWound = WOUND_LEVELS[Math.min(woundIdx + 2, 4)];
        else if (enemyDmg >= 5) newWound = WOUND_LEVELS[Math.min(woundIdx + 1, 4)];
        return { ...c, wounds: newWound };
      });
    }

    // Stability check if supernatural
    if (combat.enemy.stabilityThreat) {
      const stabResult = rollCheck(character.attributes.willpower);
      const loss = stabResult.outcome === 'failure' ? (combat.enemy.stabilityThreat?.maxLoss || 1) : 0;
      if (loss > 0) {
        setCharacter(c => ({ ...c, stability: Math.max(0, c.stability - loss), stats: { ...c.stats, stabilityLost: c.stats.stabilityLost + loss } }));
        roundLog += ` The horror of it costs you ${loss} Stability.`;
      }
    }

    if (combatEnded) {
      // Loot
      let lootText = '';
      const enemy = combat.enemy;
      if (enemy.loot) {
        enemy.loot.forEach(l => {
          if (Math.random() < l.chance) {
            if (l.thalers) {
              const amount = Math.floor(Math.random() * (l.thalers[1] - l.thalers[0])) + l.thalers[0];
              if (amount > 0) {
                setCharacter(c => ({ ...c, thalers: c.thalers + amount, stats: { ...c.stats, thalersEarned: c.stats.thalersEarned + amount } }));
                lootText += ` Found ${amount} Thalers.`;
              }
            }
            if (l.item) {
              const item = ITEMS[l.item];
              if (item) {
                setCharacter(c => ({ ...c, inventory: [...c.inventory, { ...item, qty: 1 }] }));
                lootText += ` Found: ${item.name}.`;
              }
            }
          }
        });
      }
      setCharacter(c => ({ ...c, stats: { ...c.stats, entitiesDefeated: c.stats.entitiesDefeated + 1 } }));
      addLog({ type: 'combat_win', text: `⚔ ${roundLog} — ${enemy.name} is defeated.${lootText}` });
      setCombat(null);
    } else {
      setCombat(prev => ({
        ...prev,
        round: prev.round + 1,
        enemy: { ...prev.enemy, currentHp: newEnemyHp },
        log: [...prev.log, { round: prev.round, text: roundLog, roll: result.total }],
      }));
    }
  }, [combat, character, addLog]);

  const fleeCombat = useCallback(() => {
    if (!combat) return;
    const result = rollCheck(character.attributes.reflexes);
    if (result.outcome !== 'failure') {
      addLog({ type: 'flee', text: `You escape from ${combat.enemy.name}. ${result.outcome === 'complete' ? 'Clean getaway.' : 'They nearly caught you.'}` });
      setCombat(null);
    } else {
      const dmg = rollDamage(1, 6, combat.enemy.bonus);
      setCharacter(c => {
        const woundIdx = WOUND_LEVELS.indexOf(c.wounds);
        const newWound = dmg >= 5 ? WOUND_LEVELS[Math.min(woundIdx + 1, 4)] : c.wounds;
        return { ...c, wounds: newWound };
      });
      addLog({ type: 'flee_fail', text: `Escape failed. They hit you for ${dmg} damage as you run.` });
    }
  }, [combat, character, addLog]);

  const commitCrime = useCallback((crime) => {
    if (!character) return;
    if (character.nerve < crime.nerveCost) { addLog({ type: 'error', text: `Not enough Nerve (need ${crime.nerveCost}).` }); return; }
    if (character.ap < crime.apCost) { addLog({ type: 'error', text: `Not enough AP (need ${crime.apCost}).` }); return; }

    const result = rollCheck(character.attributes[crime.attribute] || 0);
    setCharacter(c => ({
      ...c,
      ap: c.ap - crime.apCost,
      nerve: c.nerve - crime.nerveCost,
      stats: { ...c.stats, crimesCommitted: c.stats.crimesCommitted + 1 },
    }));

    let text = '';
    if (result.outcome === 'complete') {
      text = crime.successText;
      if (crime.reward && crime.reward[1] > 0) {
        const amount = Math.floor(Math.random() * (crime.reward[1] - crime.reward[0])) + crime.reward[0];
        setCharacter(c => ({ ...c, thalers: c.thalers + amount }));
        text += ` +${amount} Thalers.`;
      }
      if (crime.rewardInsight) {
        setCharacter(c => ({ ...c, insight: Math.min(c.insight + 1, c.maxInsight) }));
        text += ' +1 Insight.';
      }
      if (crime.factionReward) {
        const { faction, amount } = crime.factionReward;
        setCharacter(c => ({ ...c, factionStandings: { ...c.factionStandings, [faction]: (c.factionStandings[faction] || 0) + amount } }));
      }
    } else if (result.outcome === 'partial') {
      text = crime.partialText;
      if (crime.reward && crime.reward[1] > 0) {
        const amount = Math.floor(Math.random() * (crime.reward[1] - crime.reward[0]) * 0.5) + crime.reward[0];
        if (amount > 0) { setCharacter(c => ({ ...c, thalers: c.thalers + amount })); text += ` +${amount} Thalers.`; }
      }
    } else {
      text = crime.failureText;
      if (crime.stabilityLoss) {
        setCharacter(c => ({ ...c, stability: Math.max(0, c.stability - crime.stabilityLoss) }));
        text += ` -${crime.stabilityLoss} Stability.`;
      }
      if (crime.risk === 'arrest') {
        const fine = Math.floor(Math.random() * 200) + 100;
        setCharacter(c => ({ ...c, thalers: Math.max(0, c.thalers - fine) }));
        text += ` Fined ${fine} Thalers.`;
      }
    }
    addLog({ type: `crime_${result.outcome}`, text: `[${crime.name}] ${text}` });
  }, [character, addLog]);

  const performRitual = useCallback((ritual) => {
    if (!character) return;
    if (character.insight < ritual.insightRequired) { addLog({ type: 'error', text: `Insight too low. Need ${ritual.insightRequired}.` }); return; }
    if (character.ap < ritual.apCost) { addLog({ type: 'error', text: `Not enough AP (need ${ritual.apCost}).` }); return; }
    if (character.thalers < ritual.thalerCost) { addLog({ type: 'error', text: `Need ${ritual.thalerCost} Thalers for materials.` }); return; }

    const result = rollCheck(character.attributes[ritual.attribute] || 0);
    setCharacter(c => ({
      ...c,
      ap: c.ap - ritual.apCost,
      thalers: c.thalers - ritual.thalerCost,
      stats: { ...c.stats, ritualsPerformed: c.stats.ritualsPerformed + 1 },
    }));

    let text = '';
    let stabilityLoss = 0;
    if (result.outcome === 'complete') {
      text = ritual.successText;
      stabilityLoss = 0;
      if (ritual.gainInsight) {
        setCharacter(c => ({ ...c, insight: Math.min(c.insight + 1, c.maxInsight) }));
        text += ' +1 Insight.';
      }
    } else if (result.outcome === 'partial') {
      text = ritual.partialText;
      stabilityLoss = Math.ceil(ritual.stabilityRisk / 2);
    } else {
      text = ritual.failureText;
      stabilityLoss = ritual.stabilityRisk;
    }
    if (stabilityLoss > 0) {
      setCharacter(c => ({ ...c, stability: Math.max(0, c.stability - stabilityLoss), stats: { ...c.stats, stabilityLost: c.stats.stabilityLost + stabilityLoss } }));
      text += ` -${stabilityLoss} Stability.`;
    }
    addLog({ type: `ritual_${result.outcome}`, text: `[Ritual: ${ritual.name}] ${text}` });
  }, [character, addLog]);

  const useItem = useCallback((itemId) => {
    if (!character) return;
    const invItem = character.inventory.find(i => i.id === itemId);
    if (!invItem) return;
    const item = getItem(itemId);
    if (!item) return;

    let text = '';
    setCharacter(c => {
      let newC = { ...c };
      if (item.effect === 'heal_wound') {
        const woundIdx = WOUND_LEVELS.indexOf(c.wounds);
        if (woundIdx > 0) { newC.wounds = WOUND_LEVELS[woundIdx - 1]; text = `Used ${item.name}. Wound improved.`; }
        else { text = 'No wounds to treat.'; return c; }
      } else if (item.effect === 'heal_stability' || item.effect === 'restore_stability') {
        const gain = item.value || 1;
        newC.stability = Math.min(c.stability + gain, c.maxStability);
        text = `Used ${item.name}. Stability +${gain}.`;
        if (item.id === 'black_lotus') { newC.stability = Math.max(0, newC.stability - 1); text += ' Stability -1 (lotus toll).'; }
      } else if (item.effect === 'gain_insight') {
        newC.insight = Math.min(c.insight + 1, c.maxInsight);
        newC.stability = Math.max(0, c.stability - 1);
        text = `Used ${item.name}. Insight +1, Stability -1.`;
      } else if (item.effect === 'restore_ap') {
        newC.ap = Math.min(c.ap + (item.value || 30), c.maxAp);
        text = `Used ${item.name}. AP +${item.value || 30}.`;
      }
      // Remove one from inventory
      const inv = [...c.inventory];
      const idx = inv.findIndex(i => i.id === itemId);
      if (idx !== -1) { inv[idx] = { ...inv[idx], qty: inv[idx].qty - 1 }; if (inv[idx].qty <= 0) inv.splice(idx, 1); }
      newC.inventory = inv;
      return newC;
    });
    if (text) addLog({ type: 'item', text });
  }, [character, addLog]);

  const equipItem = useCallback((itemId) => {
    const item = getItem(itemId);
    if (!item) return;
    if (item.type === 'weapon') {
      setCharacter(c => ({ ...c, equippedWeapon: itemId }));
      addLog({ type: 'equip', text: `Equipped ${item.name}.` });
    } else if (item.type === 'armor') {
      setCharacter(c => ({ ...c, equippedArmor: itemId }));
      addLog({ type: 'equip', text: `Equipped ${item.name}.` });
    }
  }, [addLog]);

  const buyItem = useCallback((itemId) => {
    const item = getItem(itemId);
    if (!item || !character) return;
    if (character.thalers < item.price) { addLog({ type: 'error', text: `Not enough Thalers. Need ${item.price}.` }); return; }
    setCharacter(c => ({
      ...c,
      thalers: c.thalers - item.price,
      inventory: [...c.inventory, { ...item, qty: 1 }],
    }));
    addLog({ type: 'buy', text: `Purchased ${item.name} for ${item.price} Thalers.` });
  }, [character, addLog]);

  const sellItem = useCallback((itemId) => {
    const item = getItem(itemId);
    if (!item || !character) return;
    const sellPrice = Math.floor(item.price * 0.6);
    setCharacter(c => {
      const inv = [...c.inventory];
      const idx = inv.findIndex(i => i.id === itemId);
      if (idx === -1) return c;
      inv[idx] = { ...inv[idx], qty: inv[idx].qty - 1 };
      if (inv[idx].qty <= 0) inv.splice(idx, 1);
      return { ...c, thalers: c.thalers + sellPrice, inventory: inv };
    });
    addLog({ type: 'sell', text: `Sold ${item.name} for ${sellPrice} Thalers.` });
  }, [character, addLog]);

  return {
    screen, setScreen,
    character, setCharacter,
    combat, setCombat,
    activeModal, setActiveModal,
    startGame, loadSavedGame,
    travel, performAction,
    attackEnemy, fleeCombat,
    commitCrime, performRitual,
    useItem, equipItem, buyItem, sellItem,
    addLog,
  };
}

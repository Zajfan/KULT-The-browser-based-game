import { createCharacter, createInitialState } from './initialState.js';
import { saveGame, loadGame }                   from '../utils/saveLoad.js';

export const A = {
  SET_PHASE:             'SET_PHASE',
  CREATE_CHARACTER:      'CREATE_CHARACTER',
  NAVIGATE:              'NAVIGATE',
  CHANGE_VIEW:           'CHANGE_VIEW',
  SPEND_AP:              'SPEND_AP',
  RESTORE_AP:            'RESTORE_AP',
  MODIFY_STABILITY:      'MODIFY_STABILITY',
  MODIFY_WOUNDS:         'MODIFY_WOUNDS',
  MODIFY_INSIGHT:        'MODIFY_INSIGHT',
  MODIFY_THALERS:        'MODIFY_THALERS',
  MODIFY_NERVE:          'MODIFY_NERVE',
  ADD_ITEM:              'ADD_ITEM',
  REMOVE_ITEM:           'REMOVE_ITEM',
  EQUIP_ITEM:            'EQUIP_ITEM',
  UNEQUIP_ITEM:          'UNEQUIP_ITEM',
  LOG:                   'LOG',
  CLEAR_LOG:             'CLEAR_LOG',
  START_COMBAT:          'START_COMBAT',
  APPLY_COMBAT_RESULT:   'APPLY_COMBAT_RESULT',
  END_COMBAT:            'END_COMBAT',
  MODIFY_FACTION:        'MODIFY_FACTION',
  GAIN_XP:               'GAIN_XP',
  LEARN_RITUAL:          'LEARN_RITUAL',
  ADVANCE_TIME:          'ADVANCE_TIME',
  UNLOCK_LOCATION:       'UNLOCK_LOCATION',
  SET_DICE_RESULT:       'SET_DICE_RESULT',
  CLEAR_DICE:            'CLEAR_DICE',
  SET_API_KEY:           'SET_API_KEY',
  LOAD_GAME:             'LOAD_GAME',
  ADD_GUILT:             'ADD_GUILT',
  ADD_CONDITION:         'ADD_CONDITION',
  REMOVE_CONDITION:      'REMOVE_CONDITION',
};

const WOUND_ORDER = ['None', 'Stabilized', 'Serious', 'Critical', 'Mortal'];

function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

function applyWounds(currentWound, damage) {
  const idx = WOUND_ORDER.indexOf(currentWound);
  if (damage >= 10) return WOUND_ORDER[Math.min(idx + 2, 4)];
  if (damage >= 5)  return WOUND_ORDER[Math.min(idx + 1, 4)];
  return currentWound;
}

function healWounds(currentWound, steps = 1) {
  const idx = WOUND_ORDER.indexOf(currentWound);
  return WOUND_ORDER[Math.max(0, idx - steps)];
}

function levelUp(character) {
  const { level, xpToNext } = character;
  return {
    ...character,
    level: level + 1,
    experience: character.experience - xpToNext,
    xpToNext: Math.round(xpToNext * 1.4),
    resources: {
      ...character.resources,
      ap:    { ...character.resources.ap,    max: Math.min(150, character.resources.ap.max    + 5) },
      nerve: { ...character.resources.nerve, max: Math.min(80,  character.resources.nerve.max + 2) },
    },
  };
}

export function gameReducer(state, action) {
  switch (action.type) {

    case A.SET_PHASE:
      return { ...state, phase: action.payload };

    case A.CREATE_CHARACTER: {
      const character = createCharacter(action.payload);
      const newState  = { ...state, phase: 'game', character, eventLog: [
        { type: 'system', text: `You are ${character.name}. The city waits.`, ts: Date.now() }
      ]};
      saveGame(newState);
      return newState;
    }

    case A.NAVIGATE:
      return {
        ...state,
        currentLocation: action.payload,
        currentView: 'city',
      };

    case A.CHANGE_VIEW:
      return { ...state, currentView: action.payload };

    case A.SPEND_AP: {
      const ap = state.character.resources.ap;
      const next = clamp(ap.current - action.payload, 0, ap.max);
      return charResource(state, 'ap', { ...ap, current: next });
    }

    case A.RESTORE_AP: {
      const ap = state.character.resources.ap;
      const next = clamp(ap.current + action.payload, 0, ap.max);
      return charResource(state, 'ap', { ...ap, current: next });
    }

    case A.MODIFY_STABILITY: {
      const s = state.character.resources.stability;
      const next = clamp(s.current + action.payload, 0, s.max);
      const newState = charResource(state, 'stability', { ...s, current: next });
      // If stability hits 0, add broken condition
      if (next === 0) {
        return addCondition(newState, { id: 'broken', label: 'Broken', icon: '💔', expires: null });
      }
      return newState;
    }

    case A.MODIFY_WOUNDS: {
      if (action.isDamage) {
        const newWound = applyWounds(state.character.resources.wounds, action.payload);
        return charResource(state, 'wounds', newWound);
      }
      if (action.isHeal) {
        const healed = healWounds(state.character.resources.wounds, action.payload);
        return charResource(state, 'wounds', healed);
      }
      return charResource(state, 'wounds', action.payload);
    }

    case A.MODIFY_INSIGHT: {
      const ins = state.character.resources.insight;
      const next = clamp(ins.current + action.payload, 0, ins.max);
      const newState = charResource(state, 'insight', { ...ins, current: next });
      // Unlock locations at insight thresholds
      if (next >= 1 && !state.character.discoveredLocations.includes('archives')) {
        return unlockLoc(addDiscovery(newState, 'archives'), 'archives');
      }
      if (next >= 3 && !state.character.discoveredLocations.includes('asylum')) {
        return addDiscovery(newState, 'asylum');
      }
      if (next >= 5 && !state.character.discoveredLocations.includes('beyond_veil')) {
        return addDiscovery(newState, 'beyond_veil');
      }
      if (next >= 7 && !state.character.discoveredLocations.includes('labyrinth')) {
        return addDiscovery(newState, 'labyrinth');
      }
      return newState;
    }

    case A.MODIFY_THALERS: {
      const current = state.character.resources.thalers;
      const next = Math.max(0, current + action.payload);
      return charResource(state, 'thalers', next);
    }

    case A.MODIFY_NERVE: {
      const n = state.character.resources.nerve;
      const next = clamp(n.current + action.payload, 0, n.max);
      return charResource(state, 'nerve', { ...n, current: next });
    }

    case A.ADD_ITEM: {
      const inv = [...state.character.inventory];
      const existing = inv.find(i => i.id === action.payload.id);
      if (existing) {
        existing.qty = (existing.qty || 1) + (action.payload.qty || 1);
      } else {
        inv.push({ id: action.payload.id, qty: action.payload.qty || 1 });
      }
      return { ...state, character: { ...state.character, inventory: inv } };
    }

    case A.REMOVE_ITEM: {
      const inv = state.character.inventory
        .map(i => i.id === action.payload ? { ...i, qty: (i.qty || 1) - 1 } : i)
        .filter(i => (i.qty || 1) > 0);
      return { ...state, character: { ...state.character, inventory: inv } };
    }

    case A.EQUIP_ITEM: {
      const { slot, itemId } = action.payload;
      return {
        ...state,
        character: {
          ...state.character,
          equippedWeapon: slot === 'weapon' ? itemId : state.character.equippedWeapon,
          equippedArmor:  slot === 'armor'  ? itemId : state.character.equippedArmor,
        },
      };
    }

    case A.UNEQUIP_ITEM: {
      const { slot } = action.payload;
      return {
        ...state,
        character: {
          ...state.character,
          equippedWeapon: slot === 'weapon' ? null : state.character.equippedWeapon,
          equippedArmor:  slot === 'armor'  ? null : state.character.equippedArmor,
        },
      };
    }

    case A.LOG: {
      const entry = {
        type:  action.payload.type  || 'info',
        text:  action.payload.text,
        icon:  action.payload.icon  || null,
        ts:    Date.now(),
      };
      const log = [entry, ...state.eventLog].slice(0, 150);
      const newState = { ...state, eventLog: log };
      saveGame(newState);
      return newState;
    }

    case A.CLEAR_LOG:
      return { ...state, eventLog: [] };

    case A.START_COMBAT:
      return {
        ...state,
        currentView: 'combat',
        combat: {
          enemy:       action.payload,
          enemyHp:     action.payload.hp,
          round:       1,
          log:         [],
          finished:    false,
          playerWon:   null,
          fled:        false,
        },
      };

    case A.APPLY_COMBAT_RESULT: {
      const { enemyDamage, playerDamage, roundLog } = action.payload;
      const combat = state.combat;
      const newEnemyHp  = Math.max(0, combat.enemyHp  - (enemyDamage  || 0));
      const newLog = [...(combat.log || []), ...roundLog];

      // Check enemy dead
      if (newEnemyHp <= 0) {
        return {
          ...state,
          combat: { ...combat, enemyHp: 0, finished: true, playerWon: true, log: newLog },
        };
      }

      // Apply player damage
      const newWound = playerDamage > 0
        ? applyWounds(state.character.resources.wounds, playerDamage)
        : state.character.resources.wounds;
      const playerDead = newWound === 'Mortal';

      let newState = {
        ...state,
        character: {
          ...state.character,
          resources: { ...state.character.resources, wounds: newWound },
        },
        combat: {
          ...combat,
          enemyHp: newEnemyHp,
          round:   combat.round + 1,
          finished: playerDead,
          playerWon: playerDead ? false : null,
          log: newLog,
        },
      };
      return newState;
    }

    case A.END_COMBAT: {
      const { victory, fled } = action.payload;
      return {
        ...state,
        combat: null,
        currentView: 'city',
      };
    }

    case A.MODIFY_FACTION: {
      const { factionId, amount } = action.payload;
      const standings = { ...state.character.factionStandings };
      standings[factionId] = clamp((standings[factionId] || 0) + amount, -100, 999);
      return { ...state, character: { ...state.character, factionStandings: standings } };
    }

    case A.GAIN_XP: {
      let char = {
        ...state.character,
        experience: state.character.experience + action.payload,
      };
      while (char.experience >= char.xpToNext) char = levelUp(char);
      return { ...state, character: char };
    }

    case A.LEARN_RITUAL: {
      const rituals = [...(state.character.knownRituals || [])];
      if (!rituals.includes(action.payload)) rituals.push(action.payload);
      return { ...state, character: { ...state.character, knownRituals: rituals } };
    }

    case A.ADVANCE_TIME: {
      const steps  = action.payload || 1;
      const newTOD = (state.timeOfDay + steps) % 6;
      const newDay = state.day + Math.floor((state.timeOfDay + steps) / 6);
      // Restore AP each time period
      const ap    = state.character.resources.ap;
      const nerve = state.character.resources.nerve;
      const apRegen    = 15 * steps;
      const nerveRegen = 5  * steps;
      let newState = {
        ...state,
        timeOfDay: newTOD,
        day:       newDay,
      };
      newState = charResource(newState, 'ap',    { ...ap,    current: clamp(ap.current    + apRegen,    0, ap.max) });
      newState = charResource(newState, 'nerve',  { ...nerve, current: clamp(nerve.current + nerveRegen, 0, nerve.max) });
      // Advance completed-today tracking on new day
      if (newDay > state.day) {
        newState = { ...newState, character: { ...newState.character, completedToday: {} } };
      }
      saveGame(newState);
      return newState;
    }

    case A.UNLOCK_LOCATION:
    case A.UNLOCK_LOC: {
      return addDiscovery(state, action.payload);
    }

    case A.SET_DICE_RESULT:
      return { ...state, pendingDice: action.payload };

    case A.CLEAR_DICE:
      return { ...state, pendingDice: null };

    case A.SET_API_KEY: {
      localStorage.setItem('kult_api_key', action.payload);
      return {
        ...state,
        settings: { apiKey: action.payload, aiNarrative: !!action.payload },
      };
    }

    case A.LOAD_GAME: {
      const saved = loadGame();
      if (!saved) return state;
      return { ...saved, settings: state.settings };
    }

    case A.ADD_GUILT: {
      const guilt = (state.character.resources.guilt || 0) + (action.payload || 1);
      const newState = charResource(state, 'guilt', guilt);
      // At 5+ guilt, trigger supernatural encounter in log
      if (guilt >= 5) {
        return {
          ...newState,
          eventLog: [{
            type: 'horror',
            text: 'Your guilt has grown too heavy. Something has taken notice.',
            icon: '⛧',
            ts: Date.now(),
          }, ...newState.eventLog],
        };
      }
      return newState;
    }

    case A.ADD_CONDITION:
      return addCondition(state, action.payload);

    case A.REMOVE_CONDITION:
      return {
        ...state,
        character: {
          ...state.character,
          conditions: (state.character.conditions || []).filter(c => c.id !== action.payload),
        },
      };

    default:
      return state;
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function charResource(state, key, value) {
  return {
    ...state,
    character: {
      ...state.character,
      resources: { ...state.character.resources, [key]: value },
    },
  };
}

function addDiscovery(state, locationId) {
  const locs = state.character.discoveredLocations;
  if (locs.includes(locationId)) return state;
  return {
    ...state,
    character: {
      ...state.character,
      discoveredLocations: [...locs, locationId],
    },
  };
}

function unlockLoc(state, locationId) {
  return addDiscovery(state, locationId);
}

function addCondition(state, condition) {
  const conditions = state.character.conditions || [];
  if (conditions.find(c => c.id === condition.id)) return state;
  return {
    ...state,
    character: { ...state.character, conditions: [...conditions, condition] },
  };
}

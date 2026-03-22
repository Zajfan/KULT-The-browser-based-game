import { STARTING_ITEMS } from '../data/items.js';

export const TIME_OF_DAY = ['Dawn', 'Morning', 'Afternoon', 'Evening', 'Night', 'The Witching Hour'];

export function createInitialState() {
  return {
    phase: 'title',        // 'title' | 'creation' | 'game'
    character: null,
    currentLocation: 'residential',
    currentView: 'city',   // 'city'|'combat'|'market'|'training'|'crimes'|'rituals'|'factions'|'inventory'|'profile'|'hospital'
    combat: null,
    eventLog: [],
    day: 1,
    timeOfDay: 0,          // 0–5 index into TIME_OF_DAY
    settings: {
      apiKey: localStorage.getItem('kult_api_key') || '',
      aiNarrative: !!localStorage.getItem('kult_api_key'),
    },
    pendingDice: null,     // last roll result shown in UI
  };
}

export function createCharacter({
  name,
  darkSecret,
  attributeAllocation = {},
  selectedAdvantages = [],
  selectedDisadvantages = [],
}) {
  const base = {
    reason: 0, intuition: 0, perception: 0,
    coolness: 0, violence: 0, soul: 0,
    willpower: 0, fortitude: 0, reflexes: 0,
  };

  // Apply Dark Secret bonuses
  const secretBonuses = darkSecret.startingBonus || {};
  const attributes = { ...base };
  for (const [key, val] of Object.entries(secretBonuses)) {
    if (key in attributes) attributes[key] = Math.max(-3, Math.min(4, attributes[key] + val));
  }

  // Apply player-allocated points from character creation
  for (const [key, val] of Object.entries(attributeAllocation)) {
    if (key in attributes) attributes[key] = Math.max(-3, Math.min(4, attributes[key] + val));
  }

  const startingInsight = darkSecret.startingInsight || 0;
  const stabilityMod    = secretBonuses.stability || 0;
  const startingStability = Math.max(3, Math.min(10, 7 + stabilityMod));

  const startingItemId = STARTING_ITEMS[darkSecret.id] || null;
  const inventory = startingItemId
    ? [{ id: startingItemId, qty: 1 }]
    : [];

  // Occultists begin knowing two rituals
  const knownRituals = darkSecret.id === 'occultist' ? ['seeking', 'warding'] : [];

  const factionStandings = {
    archon_aligned:       darkSecret.startingFaction === 'archon_aligned'       ? 25 : 0,
    death_angel_aligned:  darkSecret.startingFaction === 'death_angel_aligned'  ? 25 : 0,
    awakened_circle:      0,
    ghost_council:        0,
  };

  return {
    name,
    darkSecretId:  darkSecret.id,
    level:         1,
    experience:    0,
    xpToNext:      100,
    attributes,
    resources: {
      stability:   { current: startingStability, max: 10 },
      wounds:      'None',    // None | Stabilized | Serious | Critical | Mortal
      insight:     { current: startingInsight, max: 10 },
      thalers:     500,
      ap:          { current: 100, max: 100 },
      nerve:       { current: 50,  max: 50  },
      guilt:       0,         // Guilt stacks (from darkSecret 'guilty')
    },
    inventory,
    equippedWeapon:  null,
    equippedArmor:   null,
    advantages:      selectedAdvantages,
    disadvantages:   selectedDisadvantages,
    knownRituals,
    factionStandings,
    discoveredLocations: [
      'residential', 'downtown', 'slums',
      'hospital', 'black_market', 'purgatory',
    ],
    conditions:      [], // active status effects
    completedToday:  {}, // activityId -> count
  };
}

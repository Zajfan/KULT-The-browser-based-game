export const ENEMIES = {
  // Mundane threats
  street_thug: {
    id: 'street_thug', name: 'Street Thug', type: 'mundane',
    hp: 8, violence: 0, fortitude: 0, bonus: 0,
    loot: [{ item: 'knife', chance: 0.3 }, { thalers: [20, 80], chance: 1 }],
    stabilityThreat: null,
    description: 'A desperate man with a knife and nothing to lose.',
    icon: '👤',
  },
  corrupt_cop: {
    id: 'corrupt_cop', name: 'Corrupt Officer', type: 'mundane',
    hp: 12, violence: 1, fortitude: 1, bonus: 1,
    loot: [{ item: 'pistol', chance: 0.5 }, { thalers: [50, 150], chance: 1 }],
    stabilityThreat: null,
    description: 'He stopped believing in the law long before he stopped carrying the badge.',
    icon: '👮',
  },
  cult_initiate: {
    id: 'cult_initiate', name: 'Cult Initiate', type: 'mundane',
    hp: 10, violence: 0, fortitude: 0, bonus: 0,
    loot: [{ item: 'ritual_blade', chance: 0.2 }, { thalers: [10, 50], chance: 0.7 }],
    stabilityThreat: { minLoss: 0, maxLoss: 1 },
    description: 'Half-enlightened. Dangerously devoted.',
    icon: '🧎',
  },
  cult_enforcer: {
    id: 'cult_enforcer', name: 'Cult Enforcer', type: 'mundane',
    hp: 15, violence: 2, fortitude: 1, bonus: 2,
    loot: [{ item: 'ritual_blade', chance: 0.4 }, { thalers: [100, 300], chance: 0.8 }],
    stabilityThreat: { minLoss: 1, maxLoss: 2 },
    description: 'Someone who has seen enough to be certain. Certainty makes people very dangerous.',
    icon: '🧎',
  },

  // Supernatural threats
  lictors: {
    id: 'lictors', name: 'Lictor', type: 'supernatural',
    hp: 20, violence: 3, fortitude: 2, bonus: 3,
    loot: [{ item: 'archon_shard', chance: 0.1 }],
    stabilityThreat: { minLoss: 2, maxLoss: 3 },
    description: 'An enforcement construct of the Archons. It maintains the Illusion by silencing those who see through it. It looks human from a distance.',
    icon: '🕴',
    supernatural: true,
  },
  nepharite: {
    id: 'nepharite', name: 'Nepharite', type: 'supernatural',
    hp: 35, violence: 4, fortitude: 3, bonus: 4,
    loot: [{ item: 'archon_shard', chance: 0.25 }, { item: 'sigil_ward', chance: 0.15 }],
    stabilityThreat: { minLoss: 3, maxLoss: 4 },
    description: 'Servants of the Death Angels. Each one has a face that is wrong in a way you cannot articulate. The wrongness spreads.',
    icon: '👁',
    supernatural: true,
  },
  azghouls: {
    id: 'azghouls', name: 'Azghoul', type: 'supernatural',
    hp: 18, violence: 2, fortitude: 2, bonus: 2,
    loot: [{ thalers: [0, 0], chance: 0 }],
    stabilityThreat: { minLoss: 2, maxLoss: 3 },
    description: 'The hungry dead. Trapped between worlds, they consume what remains of living Stability to sustain themselves.',
    icon: '💀',
    supernatural: true,
  },
  buzzard: {
    id: 'buzzard', name: 'Buzzard', type: 'supernatural',
    hp: 25, violence: 3, fortitude: 2, bonus: 3,
    loot: [{ item: 'unknown_artifact', chance: 0.2 }],
    stabilityThreat: { minLoss: 2, maxLoss: 3 },
    description: 'Scavenger-entities that follow death through the dimensions. Their beaks can sever the connection between soul and body.',
    icon: '🦅',
    supernatural: true,
  },
  death_angel_avatar: {
    id: 'death_angel_avatar', name: 'Death Angel Avatar',  type: 'boss',
    hp: 60, violence: 5, fortitude: 5, bonus: 5,
    loot: [{ item: 'archon_shard', chance: 0.5 }, { item: 'ritual_blade', chance: 0.5 }],
    stabilityThreat: { minLoss: 4, maxLoss: 5 },
    description: 'A fragment of one of the thirteen Death Angels made manifest. Its presence alone strips the Illusion from everything within a city block.',
    icon: '☠',
    supernatural: true,
    boss: true,
  },
};

export const LOCATION_ENEMIES = {
  residential:  ['street_thug'],
  downtown:     ['corrupt_cop', 'cult_initiate'],
  slums:        ['street_thug', 'corrupt_cop', 'cult_initiate'],
  industrial:   ['cult_initiate', 'cult_enforcer', 'lictors'],
  purgatory:    ['cult_enforcer', 'lictors'],
  asylum:       ['azghouls', 'lictors'],
  beyond_veil:  ['nepharite', 'buzzard', 'lictors'],
  labyrinth:    ['azghouls', 'nepharite', 'death_angel_avatar'],
};

export const getEnemiesForLocation = (locationId) => {
  const pool = LOCATION_ENEMIES[locationId] || ['street_thug'];
  return pool.map(id => ENEMIES[id]).filter(Boolean);
};

export const FACTIONS = {
  neutral: {
    id: 'neutral',
    name: 'Unaligned',
    description: 'You serve no master. Freedom, perhaps, or simply the absence of commitment.',
    color: '#888',
    icon: '⊝',
  },
  archon_aligned: {
    id: 'archon_aligned',
    name: 'Servants of the Archons',
    description: 'The Archons maintain the Illusion. Their servants ensure the world remains as it should be — which is to say, as it has always been. Order through ignorance. Safety through chains.',
    color: '#4a7fc1',
    icon: '☯',
    bonuses: {
      stability: '+1 max Stability',
      access: 'Access to Archon safehouses',
      enemies: 'Death Angel agents hunt you',
    },
  },
  death_angel_aligned: {
    id: 'death_angel_aligned',
    name: 'Children of the Death Angels',
    description: 'The Death Angels represent humanity\'s potential for liberation — or its annihilation. Their servants seek to tear down the Illusion regardless of what replaces it.',
    color: '#8b1a1a',
    icon: '⛧',
    bonuses: {
      insight: '+1 starting Insight',
      power: 'Access to dark rituals',
      enemies: 'Lictors hunt you more aggressively',
    },
  },
  awakened_circle: {
    id: 'awakened_circle',
    name: 'The Awakened Circle',
    description: 'Mortals who see through the Illusion and have organized to survive it. Pragmatic, secretive, fractious. They mistrust everyone, especially each other.',
    color: '#c8a96e',
    icon: '◎',
    bonuses: {
      information: 'Access to shared intelligence network',
      contacts: 'Medical and legal contacts',
      enemies: 'Cults view you as a threat to recruit or eliminate',
    },
  },
  ghost_council: {
    id: 'ghost_council',
    name: 'The Ghost Council',
    description: 'An ancient organization claiming to predate the Illusion itself. Their goals are opaque. Their methods are precise. They collect Awakened as other organizations collect weapons.',
    color: '#6a5acd',
    icon: '◈',
    bonuses: {
      secrets: 'Access to pre-Illusion lore',
      resources: 'Significant financial backing',
      enemies: 'Unknown entities assigned to observe you',
    },
  },
};

export const FACTION_RANKS = [
  { min: -100, max: -50, label: 'Enemy', color: '#8b1a1a' },
  { min: -49, max: -1, label: 'Hostile', color: '#b84c4c' },
  { min: 0, max: 0, label: 'Unknown', color: '#888' },
  { min: 1, max: 49, label: 'Neutral', color: '#888' },
  { min: 50, max: 99, label: 'Allied', color: '#c8a96e' },
  { min: 100, max: 199, label: 'Trusted', color: '#8bc89e' },
  { min: 200, max: 999, label: 'Inner Circle', color: '#6a5acd' },
];

export const getFactionRank = (standing) => {
  return FACTION_RANKS.find(r => standing >= r.min && standing <= r.max) || FACTION_RANKS[0];
};

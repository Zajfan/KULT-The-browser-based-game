export const ITEMS = {
  // Weapons
  knife: { id: 'knife', name: 'Combat Knife', type: 'weapon', damage: '1d6', bonus: 0, price: 150, description: 'A reliable blade. Close range only.', icon: '🔪' },
  pistol: { id: 'pistol', name: 'Semi-Auto Pistol', type: 'weapon', damage: '2d6', bonus: 1, price: 400, description: 'Standard firearm. Loud, effective.', icon: '🔫' },
  shotgun: { id: 'shotgun', name: 'Sawed-off Shotgun', type: 'weapon', damage: '3d6', bonus: 2, price: 600, description: 'Devastating at close range.', icon: '🔫' },
  iron_pipe: { id: 'iron_pipe', name: 'Iron Pipe', type: 'weapon', damage: '1d6', bonus: 0, price: 50, description: 'Crude. Functional. Deniable.', icon: '🪧' },
  ritual_blade: { id: 'ritual_blade', name: 'Ritual Blade', type: 'weapon', damage: '1d6+2', bonus: 1, price: 800, description: 'Carved with sigils. Effective against entities.', icon: '🗡', supernatural: true },
  archon_shard: { id: 'archon_shard', name: 'Archon Shard', type: 'weapon', damage: '2d6+3', bonus: 3, price: 2000, description: 'A fragment of divine architecture weaponized. Causes Stability damage to all nearby.', icon: '◈', supernatural: true },

  // Armor / Protection
  vest: { id: 'vest', name: 'Kevlar Vest', type: 'armor', defense: 2, price: 500, description: 'Reduces physical wound severity.', icon: '🦺' },
  sigil_ward: { id: 'sigil_ward', name: 'Sigil Ward', type: 'armor', defense: 0, magicDefense: 2, price: 1200, description: 'Drawn in your own blood. Reduces Stability loss from entities.', icon: '⛧', supernatural: true },

  // Consumables
  morphine: { id: 'morphine', name: 'Morphine', type: 'consumable', effect: 'heal_wound', value: 1, price: 200, description: 'Reduces one wound level. High addiction risk.', icon: '💉' },
  laudanum: { id: 'laudanum', name: 'Laudanum', type: 'consumable', effect: 'heal_stability', value: 2, price: 300, description: 'Restores 2 Stability. May cause visions.', icon: '🍶' },
  black_lotus: { id: 'black_lotus', name: 'Black Lotus Extract', type: 'consumable', effect: 'gain_insight', value: 1, price: 500, description: 'Forcibly expands perception. Gain 1 Insight. Lose 1 Stability.', icon: '🌑', supernatural: true },
  adrenaline: { id: 'adrenaline', name: 'Adrenaline Shot', type: 'consumable', effect: 'restore_ap', value: 30, price: 250, description: 'Restores 30 AP immediately.', icon: '⚡' },
  smelling_salts: { id: 'smelling_salts', name: 'Smelling Salts', type: 'consumable', effect: 'restore_stability', value: 1, price: 100, description: 'Snaps you back to mundane reality. +1 Stability.', icon: '🧪' },

  // Artifacts
  worn_rosary: { id: 'worn_rosary', name: 'Worn Rosary', type: 'artifact', effect: 'stability_bonus', value: 1, price: 0, description: 'A religious relic that provides comfort. +1 to Willpower checks.', icon: '📿', supernatural: true },
  grimoire_fragment: { id: 'grimoire_fragment', name: 'Grimoire Fragment', type: 'artifact', effect: 'ritual_bonus', value: 2, price: 0, description: 'Pages from an incomplete ritual text. Enables additional rituals.', icon: '📖', supernatural: true },
  unknown_artifact: { id: 'unknown_artifact', name: 'Unknown Artifact', type: 'artifact', effect: 'random', value: 0, price: 0, description: 'You do not know what it does. Identify it to find out.', icon: '❓', supernatural: true },
  false_papers: { id: 'false_papers', name: 'False Identity Papers', type: 'key_item', effect: 'coolness_bonus', value: 1, price: 0, description: 'A complete false identity. +1 Coolness when operating under a false name.', icon: '🪪' },
  research_dossier: { id: 'research_dossier', name: 'Research Dossier', type: 'key_item', effect: 'research_bonus', value: 2, price: 0, description: 'Years of compiled research. +2 to investigation actions.', icon: '📁' },
  contact_list: { id: 'contact_list', name: 'Cult Contact List', type: 'key_item', effect: 'faction_bonus', value: 1, price: 0, description: 'Names, locations, coded phrases. Access to a network.', icon: '📋' },
  map_nowhere: { id: 'map_nowhere', name: 'Map of Nowhere', type: 'artifact', effect: 'navigation', value: 3, price: 0, description: 'Depicts places that do not exist in the mundane world. Navigation bonus in supernatural locations.', icon: '🗺', supernatural: true },
  battle_weapon: { id: 'battle_weapon', name: 'Battle-worn Weapon', type: 'weapon', damage: '2d6', bonus: 2, price: 0, description: 'An old weapon with a history of violence. It has a name you can almost remember.', icon: '⚔', supernatural: false },
};

export const MARKET_STOCK = {
  weapons: ['knife', 'pistol', 'shotgun', 'iron_pipe', 'ritual_blade'],
  armor: ['vest', 'sigil_ward'],
  consumables: ['morphine', 'laudanum', 'black_lotus', 'adrenaline', 'smelling_salts'],
  artifacts: ['unknown_artifact'],
};

export const getItem = (id) => ITEMS[id] || null;

export const STARTING_ITEMS = {
  acedia: 'worn_rosary',
  brought_back: null,
  chosen: null,
  occultist: 'grimoire_fragment',
  guilty: 'false_papers',
  dimensional: 'map_nowhere',
  cult_leader: 'contact_list',
  researcher: 'research_dossier',
  death_wish: 'battle_weapon',
  unknown_past: 'unknown_artifact',
};

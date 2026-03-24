// Crafting recipes — combine inventory items to produce new ones.
// Ingredients are consumed; the result is added to the inventory.

export const RECIPES = [
  {
    id: 'trauma_kit',
    name: 'Trauma Kit',
    description: 'Combine two field medkits into a superior trauma kit that heals two wound levels.',
    resultId: 'trauma_kit',
    ingredients: ['medkit', 'medkit'],
    apCost: 10,
    insightRequired: 0,
    category: 'medical',
  },
  {
    id: 'veil_tonic',
    name: 'Veil Tonic',
    description: 'Purify a nerve tonic with pale salt to create a powerful Stability restorative.',
    resultId: 'veil_tonic',
    ingredients: ['nerve_tonic', 'pale_salt'],
    apCost: 15,
    insightRequired: 1,
    category: 'occult',
  },
  {
    id: 'occult_charge',
    name: 'Occult Charge',
    description: 'Mix adrenaline with black lotus extract for a potent but costly stimulant.',
    resultId: 'occult_charge',
    ingredients: ['adrenaline', 'black_lotus'],
    apCost: 15,
    insightRequired: 2,
    category: 'occult',
  },
  {
    id: 'warded_coat',
    name: 'Warded Coat',
    description: 'Sew warding sigils into reinforced leather to create armor that protects against both bullets and entities.',
    resultId: 'warded_coat',
    ingredients: ['leather_coat', 'sigil_ward'],
    apCost: 30,
    insightRequired: 2,
    category: 'armor',
  },
  {
    id: 'sight_draught',
    name: 'Sight Draught',
    description: 'Grind veil glass and dissolve it in laudanum. The resulting tonic opens perception without destabilizing the mind.',
    resultId: 'sight_draught',
    ingredients: ['laudanum', 'veil_glass'],
    apCost: 25,
    insightRequired: 3,
    category: 'occult',
  },
  {
    id: 'void_blade_plus',
    name: 'Consecrated Void Blade',
    description: 'Fragment an archon shard and bind the pieces to a void-touched blade. The resulting weapon is supremely dangerous.',
    resultId: 'void_blade_plus',
    ingredients: ['void_blade', 'archon_shard'],
    apCost: 50,
    insightRequired: 5,
    category: 'weapon',
  },
];

export const RECIPE_CATEGORIES = {
  medical: { label: 'Medical',  color: 'var(--vital-lit)',  glyph: '⚕' },
  occult:  { label: 'Occult',   color: 'var(--veil-lit)',   glyph: '⛧' },
  armor:   { label: 'Armor',    color: 'var(--ink-dim)',    glyph: '🛡' },
  weapon:  { label: 'Weapon',   color: 'var(--red-lit)',    glyph: '⚔' },
};

export const getRecipesForInsight = (insight) =>
  RECIPES.filter(r => r.insightRequired <= insight);

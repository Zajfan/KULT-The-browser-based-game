export const ADVANTAGES = [
  { id: 'analytical', name: 'Analytical Mind', type: 'passive', cost: 1, description: '+1 to Reason checks involving investigation or deduction.' },
  { id: 'dead_shot', name: 'Dead Shot', type: 'passive', cost: 1, description: '+2 to ranged attack rolls. Never miss at point blank range.' },
  { id: 'escape_artist', name: 'Escape Artist', type: 'passive', cost: 1, description: '+2 to Reflexes checks to escape restraints, grapples, or traps.' },
  { id: 'gut_feeling', name: 'Gut Feeling', type: 'passive', cost: 1, description: 'Once per scene, ask the GM if something feels wrong. On a partial or better roll, get a true answer.' },
  { id: 'sixth_sense', name: 'Sixth Sense', type: 'passive', cost: 1, description: 'You sense supernatural presences before they act. Never surprised by entities.' },
  { id: 'streetwise', name: 'Streetwise', type: 'passive', cost: 1, description: '+2 to Coolness when navigating criminal networks, black markets, or underworld contacts.' },
  { id: 'martial_arts', name: 'Martial Arts', type: 'passive', cost: 2, description: 'Unarmed attacks deal lethal damage. +1 to Violence in melee combat.' },
  { id: 'rapid_reflexes', name: 'Rapid Reflexes', type: 'passive', cost: 2, description: 'Always act first in combat. +2 to Reflexes for avoiding harm.' },
  { id: 'influence', name: 'Influence', type: 'passive', cost: 2, description: 'You have high-level contacts. Once per day, call in a favor from a powerful ally.' },
  { id: 'resistance_mental', name: 'Mental Resistance', type: 'passive', cost: 2, description: '+2 to Willpower checks. Stability loss is reduced by 1 (minimum 0).' },
  { id: 'forbidden_knowledge', name: 'Forbidden Knowledge', type: 'passive', cost: 2, description: 'You know things you shouldn\'t. Unlock additional ritual and investigation options.' },
  { id: 'coroner', name: 'Coroner', type: 'passive', cost: 1, description: 'Can examine corpses to gain intel. +2 to investigate death-related crimes.' },
  { id: 'con_artist', name: 'Con Artist', type: 'passive', cost: 1, description: '+2 to Coolness for deception, manipulation, and social engineering.' },
  { id: 'artifact_keeper', name: 'Artifact Keeper', type: 'passive', cost: 2, description: 'Begin with a random supernatural artifact. You can identify occult items without rolling.' },
  { id: 'hardened', name: 'Hardened', type: 'passive', cost: 2, description: 'You\'ve seen enough horror. Once per combat, ignore a Stability check entirely.' },
];

export const DISADVANTAGES = [
  { id: 'nightmares', name: 'Nightmares', type: 'passive', bonus: 1, description: 'Haunted by visions. Lose 1 AP each morning. Occasionally receive prophetic information.' },
  { id: 'addiction', name: 'Addiction', type: 'passive', bonus: 1, description: 'You depend on a substance. Without it, suffer -1 to all rolls. It costs Thalers daily.' },
  { id: 'phobia', name: 'Phobia', type: 'passive', bonus: 1, description: 'A specific trigger forces a Willpower check or you cannot act for one round.' },
  { id: 'hunted', name: 'Hunted', type: 'passive', bonus: 2, description: 'An entity or organization pursues you. They appear at inopportune moments.' },
  { id: 'dark_secret_exposed', name: 'Exposed', type: 'passive', bonus: 1, description: 'Someone knows what you did. They hold leverage and will use it.' },
];

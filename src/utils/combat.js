import { rollCheck, rollDamage } from './dice.js';

export const WOUND_LEVELS = ['None', 'Stabilized', 'Serious', 'Critical', 'Mortal'];

export function getWoundIndex(label) {
  return WOUND_LEVELS.indexOf(label);
}

export function applyWound(currentWound, damage) {
  const idx = getWoundIndex(currentWound);
  if (damage >= 10) return WOUND_LEVELS[Math.min(idx + 2, 4)];
  if (damage >= 5)  return WOUND_LEVELS[Math.min(idx + 1, 4)];
  return currentWound;
}

export function isMortallyWounded(wound) {
  return wound === 'Mortal';
}

export function playerAttack(player, enemy) {
  const result = rollCheck(player.attributes.violence);
  let damage = 0;
  let narrative = '';

  if (result.outcome === 'complete') {
    damage = rollDamage(2, 6, player.weaponBonus || 0);
    narrative = `You strike true, dealing ${damage} damage.`;
  } else if (result.outcome === 'partial') {
    damage = rollDamage(1, 6, player.weaponBonus || 0);
    const counterDmg = rollDamage(1, 4);
    narrative = `You hit for ${damage} damage, but they retaliate for ${counterDmg}.`;
    return { result, damage, narrative, counterDamage: counterDmg };
  } else {
    const counterDmg = rollDamage(1, 6, enemy.bonus || 0);
    narrative = `You miss and are struck for ${counterDmg} damage.`;
    return { result, damage: 0, narrative, counterDamage: counterDmg };
  }
  return { result, damage, narrative, counterDamage: 0 };
}

export function calculateEvasion(player, enemy) {
  const result = rollCheck(player.attributes.reflexes);
  if (result.outcome === 'complete') return { evaded: true, damage: 0, result };
  if (result.outcome === 'partial') {
    const dmg = Math.floor((rollDamage(1, 6, enemy.bonus || 0)) / 2);
    return { evaded: false, damage: dmg, result };
  }
  return { evaded: false, damage: rollDamage(1, 6, enemy.bonus || 0), result };
}

export function stabilityCheck(player, horror) {
  const result = rollCheck(player.attributes.willpower);
  let stabilityLoss = 0;
  if (result.outcome === 'complete') stabilityLoss = 0;
  else if (result.outcome === 'partial') stabilityLoss = horror.minLoss || 1;
  else stabilityLoss = horror.maxLoss || 2;
  return { result, stabilityLoss };
}

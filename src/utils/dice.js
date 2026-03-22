// KULT: Divinity Lost dice system
// Roll 2d10 + attribute modifier
// 15+ = Complete Success
// 10-14 = Partial Success (success with complications)
// ≤9 = Failure

export function roll2d10() {
  return Math.ceil(Math.random() * 10) + Math.ceil(Math.random() * 10);
}

export function rollCheck(attribute) {
  const dice = roll2d10();
  const total = dice + attribute;
  return {
    dice,
    attribute,
    total,
    outcome: total >= 15 ? 'complete' : total >= 10 ? 'partial' : 'failure',
    label: total >= 15 ? 'Complete Success' : total >= 10 ? 'Partial Success' : 'Failure',
  };
}

export function rollD10() {
  return Math.ceil(Math.random() * 10);
}

export function rollD6() {
  return Math.ceil(Math.random() * 6);
}

export function rollDamage(diceCount = 1, sides = 6, bonus = 0) {
  let total = bonus;
  for (let i = 0; i < diceCount; i++) {
    total += Math.ceil(Math.random() * sides);
  }
  return total;
}

export const OUTCOMES = {
  complete: { color: '#c8a96e', label: '✦ Complete Success' },
  partial:  { color: '#b87333', label: '◆ Partial Success' },
  failure:  { color: '#8b1a1a', label: '✖ Failure' },
};

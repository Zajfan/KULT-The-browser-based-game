import { SCENARIOS } from '../data/scenarios.js';
import { SCENARIOS_EXTENDED } from '../data/scenarios_extended.js';

const ALL_SCENARIOS = [...SCENARIOS, ...SCENARIOS_EXTENDED];

export function checkScenarioProgress(character, actionId, locationId) {
  const updates = [];
  const sp = character.scenarioProgress || {};

  for (const scenario of ALL_SCENARIOS) {
    if (scenario.insightRequired > character.insight) continue;

    const progress = sp[scenario.id] || { actIdx: 0, actionCount: 0, completed: false };
    if (progress.completed) continue;

    const act = scenario.acts[progress.actIdx];
    if (!act) continue;

    const locMatch = !act.trigger?.location || act.trigger.location === locationId;
    const actMatch = act.trigger?.action === actionId;

    if (locMatch && actMatch) {
      const newCount = (progress.actionCount || 0) + 1;
      const required = act.trigger?.count || 1;
      const actComplete = newCount >= required;
      const isLast = progress.actIdx >= scenario.acts.length - 1;

      updates.push({
        scenarioId: scenario.id,
        scenarioName: scenario.name,
        act,
        actComplete,
        newCount,
        nextActIdx: actComplete ? progress.actIdx + 1 : progress.actIdx,
        scenarioComplete: actComplete && isLast,
        stabilityRisk: actComplete ? (act.stabilityRisk || 0) : 0,
      });
    }
  }

  return updates;
}

export function applyScenarioUpdates(character, updates) {
  if (!updates.length) return character;
  const sp = { ...(character.scenarioProgress || {}) };
  let stabLoss = 0;
  let insightGain = 0;

  for (const u of updates) {
    const prev = sp[u.scenarioId] || { actIdx: 0, actionCount: 0, completed: false };
    if (u.actComplete) {
      sp[u.scenarioId] = {
        actIdx: u.nextActIdx,
        actionCount: 0,
        completed: u.scenarioComplete,
        ending: null,
      };
      stabLoss += u.stabilityRisk;
      if (u.act.reveals) insightGain += 0; // reveals don't grant insight, actions do
    } else {
      sp[u.scenarioId] = { ...prev, actionCount: u.newCount };
    }
  }

  return {
    ...character,
    scenarioProgress: sp,
    stability: Math.max(0, character.stability - stabLoss),
    insight: Math.min(character.insight + insightGain, character.maxInsight || 10),
  };
}

// World Events — triggered by player choices, faction standing, Insight level, and time.
// These are city-level consequences that change the texture of gameplay.

export const WORLD_EVENT_TRIGGERS = {
  // Archon attention rises when player gains high Insight or completes Insight rituals
  archon_surveillance: {
    condition: (c) => c.insight >= 4 && (c.factionStandings?.archon_aligned || 0) < 0,
    weight: 40,
    event: {
      id: "archon_surveillance",
      title: "Heightened Surveillance",
      description: "Lictors have been observed near your regular locations. Your movements are being documented.",
      effect: { nerve: -10 },
      logText: "The Archons have noticed you. A Lictor has been assigned to your case.",
      type: "threat",
      duration: 3, // days
    },
  },
  death_angel_notice: {
    condition: (c) => c.factionStandings?.death_angel_aligned >= 50,
    weight: 30,
    event: {
      id: "death_angel_notice",
      title: "Infernal Interest",
      description: "Something from below the Illusion has taken specific notice of your work. Whether this is good is unclear.",
      effect: { insight: 1, stabilityLoss: 1 },
      logText: "A Death Angel's attention has turned toward you. Insight +1. Your stability is affected.",
      type: "supernatural",
      duration: 0,
    },
  },
  city_crackdown: {
    condition: (c) => (c.stats?.crimesCommitted || 0) >= 10,
    weight: 35,
    event: {
      id: "city_crackdown",
      title: "Enforcement Crackdown",
      description: "Police presence has increased in areas you frequent. Criminal activities carry higher risk this week.",
      effect: { nerve: -15 },
      logText: "Law enforcement has increased patrols. Criminal activities are riskier for 3 days.",
      type: "mundane",
      duration: 3,
    },
  },
  stability_crisis: {
    condition: (c) => c.stability <= 3 && c.stability > 0,
    weight: 50,
    event: {
      id: "stability_crisis",
      title: "Fracturing Perception",
      description: "Your grip on the Illusion is weakening. Reality bleeds through in ways that are difficult to manage.",
      effect: {},
      logText: "Your stability is critical. Seek treatment. Entities can sense the weakening.",
      type: "personal",
      duration: 0,
    },
  },
  faction_war: {
    condition: (c) => {
      const arch = c.factionStandings?.archon_aligned || 0;
      const da   = c.factionStandings?.death_angel_aligned || 0;
      return arch > 30 && da > 30;
    },
    weight: 25,
    event: {
      id: "faction_war",
      title: "Caught Between",
      description: "Both the Archon-aligned and Death Angel factions have marked you as significant. They do not share well.",
      effect: { stabilityLoss: 1 },
      logText: "Your dual allegiances have been noticed. Both factions are watching. This will come to a head.",
      type: "political",
      duration: 5,
    },
  },
  awakened_contact: {
    condition: (c) => c.insight >= 2 && (c.factionStandings?.awakened_circle || 0) >= 20,
    weight: 40,
    event: {
      id: "awakened_contact",
      title: "The Circle Reaches Out",
      description: "The Awakened Circle has identified you as someone worth knowing. An approach is imminent.",
      effect: { nerve: 10 },
      logText: "The Awakened Circle makes contact. Nerve +10. New connections available.",
      type: "opportunity",
      duration: 0,
    },
  },
  guilt_manifestation: {
    condition: (c) => (c.guiltStacks || 0) >= 5,
    weight: 60,
    event: {
      id: "guilt_manifestation",
      title: "Gamygyn's Accounting",
      description: "Your guilt has accumulated to the point where Gamygyn has taken personal notice. What you have done follows you visibly now.",
      effect: { stabilityLoss: 2, insight: 1 },
      logText: "Gamygyn manifests. The weight of what you have done becomes visible. Stability −2, Insight +1.",
      type: "supernatural",
      duration: 0,
    },
  },
  deep_insight: {
    condition: (c) => c.insight >= 7,
    weight: 45,
    event: {
      id: "deep_insight",
      title: "The Veil Is Thin",
      description: "At this level of Insight, the Illusion provides almost no protection. You see everything. Everything can see you.",
      effect: { nerve: -10, insight: 1 },
      logText: "Insight 7+. The Veil offers minimal protection now. Entities find you without effort.",
      type: "supernatural",
      duration: 0,
    },
  },
};

export const WORLD_NEWS = [
  // Archon-caused events bleeding into the mundane world
  { insight: 0, weight: 20, text: "Municipal rezoning approved. Forty families in the Slums to be displaced by Q3." },
  { insight: 0, weight: 15, text: "Three persons reported missing this week. Police describe the cases as unrelated." },
  { insight: 0, weight: 18, text: "Heilenberg Asylum reports increased admissions. Staff describe an unusually stressful month." },
  { insight: 0, weight: 12, text: "The Archive's east wing remains closed for 'renovation.' Duration unspecified." },
  { insight: 1, weight: 25, text: "A pattern of deaths near the Industrial Quarter has been noticed by two independent researchers. Their publication has been delayed." },
  { insight: 1, weight: 20, text: "Awakened Circle operative reports Lictor activity up 40% this month. Unknown cause." },
  { insight: 2, weight: 30, text: "The Veil between the residential district and Metropolis has thinned measurably. Malphas agents deployed." },
  { insight: 2, weight: 22, text: "Morax's archive agents have reclassified three significant document collections. Access now requires credentials that do not officially exist." },
  { insight: 3, weight: 35, text: "An Archon operating through city finance channels has accelerated three development projects. The locations are significant to the Awakened." },
  { insight: 4, weight: 40, text: "A Death Angel has been active in the city for the past fortnight. Its interest is specific. Several Awakened have been approached." },
  { insight: 5, weight: 50, text: "The Labyrinth processing load has increased 23% this month. Astaroth's administration is under strain. The cause is unknown." },
];

export function checkWorldEventTriggers(character, activeEvents = []) {
  const triggered = [];
  for (const [key, trigger] of Object.entries(WORLD_EVENT_TRIGGERS)) {
    if (activeEvents.includes(trigger.event.id)) continue;
    if (Math.random() * 100 > trigger.weight) continue;
    if (trigger.condition(character)) {
      triggered.push(trigger.event);
    }
  }
  return triggered;
}

export function getNewsForInsight(insight, count = 3) {
  const eligible = WORLD_NEWS.filter(n => n.insight <= insight);
  const shuffled = [...eligible].sort(() => Math.random() - 0.5);
  const weighted = [];
  for (const item of shuffled) {
    if (Math.random() < item.weight / 100) weighted.push(item.text);
    if (weighted.length >= count) break;
  }
  return weighted;
}

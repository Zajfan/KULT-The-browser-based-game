// The Awakening Path — milestone progression system tracking a character's
// journey from ordinary mortal to fully Awakened. Each Insight threshold
// unlocks new gameplay, new lore, and changes the world's reaction to the player.

export const AWAKENING_MILESTONES = [
  {
    insight: 0,
    title: "Sleepwalker",
    subtitle: "You know something is wrong. You do not know what.",
    description: "The Illusion is intact. You see its edges only in peripheral vision — wrong shadows, faces that repeat, the sense that the same conversation has happened before. Most people never get past this.",
    unlocks: ["Basic city actions", "Mundane crimes", "Starting contacts"],
    color: "var(--ink-dim)",
  },
  {
    insight: 1,
    title: "Stirring",
    subtitle: "The cracks are visible if you know where to look.",
    description: "Something has shifted. The Illusion is still mostly intact, but you can see where it is maintained. The Archons' work is visible at its edges. You are starting to notice the Lictors.",
    unlocks: ["Purgatory access", "Ritual of Seeking", "Awakened Circle contact"],
    color: "oklch(52% 0.08 68)",
  },
  {
    insight: 2,
    title: "Awakening",
    subtitle: "You cannot pretend you do not see what you see.",
    description: "The Illusion is a fact you can examine rather than a reality you inhabit. You know the Death Angels exist. You know what the Archons are doing. The weight of this knowledge is substantial.",
    unlocks: ["Death Angel lore", "Second Sight ritual", "Archives restricted access", "Asylum access"],
    color: "oklch(58% 0.12 70)",
  },
  {
    insight: 3,
    title: "Opened",
    subtitle: "The world is not what it appeared. It never was.",
    description: "Full Awakening. The Illusion is a tool you use rather than a world you live in. Entities can perceive you clearly now. Your patron Death Angel is aware of your progress. This is the point of no return.",
    unlocks: ["Nepharite encounters", "Binding Rite", "Death Angel communion", "Sister Voss full access"],
    color: "oklch(64% 0.16 68)",
  },
  {
    insight: 4,
    title: "Illuminated",
    subtitle: "You see what the city actually is.",
    description: "Metropolis is visible beneath the physical city. The true age of things is apparent. Archon constructs and Lictor identities are obvious. You are, from the perspective of the Illusion's management, a significant problem.",
    unlocks: ["Metropolis navigation", "Beyond the Veil full access", "Fragment of Ascension ritual", "Archon direct contact"],
    color: "oklch(70% 0.18 68)",
  },
  {
    insight: 5,
    title: "Transcendent",
    subtitle: "The prison has no secrets left.",
    description: "The Illusion is transparent. You see through it as easily as glass. What lies beyond it — Metropolis, Inferno, the Labyrinth — is accessible to you. The Archons have classified you as a priority intervention. The Death Angels have classified you as an asset.",
    unlocks: ["Inferno access", "Archon negotiation", "Pre-Illusion site access", "Ascension path"],
    color: "var(--gold-lit)",
  },
  {
    insight: 6,
    title: "Unbound",
    subtitle: "You are no longer contained by the Illusion's geometry.",
    description: "You move between layers of reality with conscious intention. The Labyrinth is navigable. You have had conversations with things older than the Demiurge. The question of what you are becoming is one you have stopped avoiding.",
    unlocks: ["Labyrinth navigation", "Dead communication", "Pre-Demiurge contact", "Death Angel bargaining"],
    color: "var(--gold-vivid)",
  },
  {
    insight: 7,
    title: "Liminal",
    subtitle: "You are between what you were and what you are becoming.",
    description: "The Illusion cannot fully process you. You register as an anomaly in Archon monitoring systems. Your patron Death Angel has made direct contact. The path to Ascension is visible. Taking it requires more than Insight.",
    unlocks: ["Ascension ritual access", "Full entity negotiation", "Archon domain access"],
    color: "var(--veil-vivid)",
  },
  {
    insight: 8,
    title: "The Threshold",
    subtitle: "One step from something that has no name.",
    description: "Almost nothing of the original Illusion remains in your perception. You exist at the edge of what it is possible to be while still being human. The Awakened who have reached this point are few. What lies beyond it is different for everyone.",
    unlocks: ["All areas accessible", "Full lore revealed", "Ascension attempt possible"],
    color: "oklch(78% 0.24 290)",
  },
];

export const getMilestone = (insight) => {
  const milestones = [...AWAKENING_MILESTONES].reverse();
  return milestones.find(m => insight >= m.insight) || AWAKENING_MILESTONES[0];
};

export const getNextMilestone = (insight) => {
  return AWAKENING_MILESTONES.find(m => m.insight > insight) || null;
};

// Narrative events that fire at specific Insight thresholds (one-time)
export const INSIGHT_EVENTS = {
  1: {
    title: "The First Crack",
    text: "You see a Lictor for what it is. For a moment — just a moment — the Illusion fails entirely in your vicinity, and you see the city as it truly is. Then the Illusion reasserts. But you saw it. You cannot unsee it.",
    stabilityLoss: 1,
  },
  2: {
    title: "The Name",
    text: "Your patron Death Angel's name surfaces in your awareness without explanation. You did not learn it. You simply know it. Whatever that means, it is not nothing.",
    stabilityLoss: 1,
  },
  3: {
    title: "The Labyrinth's Edge",
    text: "You touch the edge of the Labyrinth in a dream — not the Labyrinth as metaphor but the actual place where processed souls move through corridors that go on beyond what distance means. You wake with the specific smell of it still in your memory.",
    stabilityLoss: 2,
  },
  5: {
    title: "The Archon Acknowledges You",
    text: "You are seen. Not by a Lictor, not by an agent — by an Archon, directly, briefly. It does not speak. It simply looks. Being seen by something that vast is not the same as being seen by a person. You carry the feeling of it for days.",
    stabilityLoss: 2,
  },
  7: {
    title: "The Door",
    text: "The path to Ascension is visible to you for the first time. Not as a concept — as an actual direction you could move in. Whether you want to is a different question. Whether you are ready is a different question still.",
    stabilityLoss: 1,
  },
};

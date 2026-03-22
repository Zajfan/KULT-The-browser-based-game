// The Dreaming — AI-prompted nightmares generated at the start of each in-game day
// When the game hour wraps to 0 (new day), a dream fires based on character state

export const DREAM_SEEDS = [
  { insightMin:0, stabilityMax:10, prompt: (c) =>
    `Character "${c.name}" with dark secret "${c.darkSecret?.name}" has ${c.stability}/${c.maxStability} stability and ${c.insight} insight. Write their dream tonight — 2 haunting sentences. Specific imagery. No clichés.` },
  { insightMin:3, stabilityMax:10, prompt: (c) =>
    `An Awakened person with insight ${c.insight} dreams at the edge of the Illusion. Their dark secret is "${c.darkSecret?.name}". Write 2 sentences of what they see when the veil thins — specific, unsettling, real.` },
  { insightMin:5, stabilityMax:5, prompt: (c) =>
    `Someone close to the edge — stability ${c.stability}, insight ${c.insight}, dark secret "${c.darkSecret?.name}". Their dream is a transmission. 2 sentences of what the entities are trying to show them.` },
  { insightMin:0, stabilityMax:3, prompt: (c) =>
    `On the edge of breakdown — stability ${c.stability}. Their dream tonight is not a dream. 2 sentences that blur the line between sleep and what is actually in the room with them.` },
];

export function getDreamPrompt(character) {
  const applicable = DREAM_SEEDS.filter(d =>
    character.insight >= d.insightMin && character.stability <= d.stabilityMax
  );
  const seed = applicable[Math.floor(Math.random() * applicable.length)] || DREAM_SEEDS[0];
  return seed.prompt(character);
}

// Static fallback dreams when API not available
export const STATIC_DREAMS = [
  "You dream of a city without shadows. Every surface reflects a version of you that is slightly wrong — the eyes too still, the smile present without cause. You wake before you can count how many there are.",
  "The Labyrinth again. The corridors smell of iron and something sweetly medicinal. You pass a door you recognise. Behind it, someone is using your name in a language that predates language.",
  "A white room. A figure in a white coat who has your face. They are explaining something important with great patience and you understand every word and remember none of them.",
  "You are standing in a field that should not exist inside the city. The sky is the wrong colour. The field goes on longer than the city has room for. Something very old is at the far end of it, walking toward you at exactly the speed you walk away.",
  "The dream is a map. You wake unable to remember it but able to feel where the dangerous locations are, like bruises.",
  "You dream of your dark secret, but from the perspective of the thing that was watching when it happened. It was not unkind, in its way. It was simply hungry.",
];

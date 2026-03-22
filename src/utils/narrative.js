// Narrative generation — uses Claude API when key is present, falls back to static text

const MODEL = 'claude-sonnet-4-20250514';

const SYSTEM_PROMPT = `You are the narrator for KULT: City of Chains, a dark horror browser RPG inspired by the KULT tabletop game.

The world is an Illusion maintained by a missing Demiurge. Archons enforce the prison of mundane reality. Death Angels wait in Inferno. Players are mortals who are beginning to perceive the truth beneath the world they thought they knew.

Your narration style:
- Grim, literary, specific. Noir with existential horror.
- Use sensory details that feel wrong in a subtle way — wrong light, too-symmetric faces, sounds that arrive before their source.
- Never explain the horror. Show it.
- 1-3 sentences for activity results. Never more.
- Do not use markdown. Plain prose only.
- Reference the KULT lore where relevant: Archons, Lictors, Death Angels, the Labyrinth, Purgatory, the Illusion.`;

export async function generateNarrative(apiKey, prompt) {
  if (!apiKey) return null;
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 120,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    return data.content?.[0]?.text?.trim() || null;
  } catch {
    return null;
  }
}

// ── Static fallback narrative pools ──────────────────────────────────────────

export const LOCATION_FLAVOR = {
  residential: [
    'The building corridors smell of cooking and old paint. Your neighbour nods at you with eyes that linger a half-second too long.',
    'An identical set of curtains in every window. The repetition feels intentional.',
    'You count twelve children playing below. When you look again, there are twelve children, but none of them are the same children.',
  ],
  downtown:    [
    'The glass towers catch the light perfectly. Everything here has been optimised for something, and it is not comfort.',
    'Men in suits pass you without making eye contact. Their shoes are the same model. Different sizes, but the same model.',
    'The coffee shop has been open since 1987 and the staff have not changed.',
  ],
  slums:       [
    'The street lights flicker at a rhythm that seems almost like a word. You decide not to think about which word.',
    'A dog watches you from a doorway. It is not a threatening dog. It is a dog that has seen something.',
    'The graffiti here is in a language you do not speak, but some of it seems relevant to you specifically.',
  ],
  hospital:    [
    'The antiseptic smell has something floral beneath it that you prefer not to identify.',
    'A doctor passes you in the corridor. You see her again. And again. You have not moved.',
    'The patient in the next bed keeps asking where they are. The staff tell him. He keeps asking.',
  ],
  purgatory:   [
    'The music changes depending on where you stand. In the corner near the stairs, it is something very old.',
    'The bartender has no reflection. You have come here enough times to have stopped mentioning it.',
    'Someone you recognise from a dream is at the back table. You do not approach them. Not yet.',
  ],
  archives:    [
    'The librarian has not blinked once in the time you have been here. You stop counting minutes.',
    'The filing system makes no sense and then suddenly makes perfect sense and you are afraid of what that means.',
    'A document you have never seen before has your name in the margin. It was written in 1943.',
  ],
  beyond_veil: [
    'The geometry is wrong. Pleasantly wrong. Like a house remembered from childhood.',
    'Things here have a second shadow that moves differently from the first.',
    'You hear breathing that is too large to belong to anything you should be able to encounter.',
  ],
  labyrinth:   [
    'The corridor has not ended. It has been forty minutes.',
    'A soul pressed against the wall recognises you. You do not recognise them.',
    'The sound of processing. Somewhere ahead, something is being sorted.',
  ],
};

export const COMBAT_FLAVOR = {
  hit_complete: [
    'The blow connects with terrible precision.',
    'You find the gap in their guard and take it.',
    'Strike true. They stagger.',
  ],
  hit_partial: [
    'You connect, but not cleanly — they get something in return.',
    'A hit. You pay for it immediately.',
    'Contact. So does their counterattack.',
  ],
  miss: [
    'The attack finds only air. Their response does not.',
    'You overshoot. They make you regret it.',
    'Miss. The momentum leaves you open.',
  ],
  enemy_attack: [
    'They move with purpose and connect.',
    'The retaliation is fast and specific.',
    'You absorb the hit. It costs you.',
  ],
  flee_success: [
    'You find a gap and take it, and the distance between you and them becomes your only comfort.',
    'Out. You are out. The city accepts you back without judgement.',
  ],
  flee_fail: [
    'No gap. They are faster than you needed them to be.',
    'The exit closes before you reach it.',
  ],
  victory: [
    'It is over. The city does not acknowledge this. It never does.',
    'They are down. You are still up. The math of survival.',
    'Done. You allow yourself to breathe.',
  ],
  defeat: [
    'The last thing is the pavement, close and patient.',
    'Down. The city\'s sounds continue around you, indifferent.',
  ],
};

export const CRIME_FLAVOR = {
  success: [
    'Clean. No trace.',
    'Done. The city looks away.',
    'You walk away with more than you arrived with, and no one saw the transaction.',
  ],
  partial: [
    'Successful, but loose ends.',
    'Done, but not cleanly.',
    'You have what you came for. Someone else has a description of your face.',
  ],
  failure: [
    'Wrong. Everything went wrong.',
    'The city noticed. Time to move.',
    'Empty-handed and visible. Cut your losses.',
  ],
};

export const RITUAL_FLAVOR = {
  success: [
    'The ritual completes and the world shifts slightly, like furniture rearranged in your peripheral vision.',
    'It works. The knowledge settles into you like cold water.',
    'The circle holds. The answer arrives from somewhere that has been watching.',
  ],
  partial: [
    'Partial contact. Fragments only.',
    'Something heard you. It is deciding whether to answer.',
    'The ritual bends but does not break. The result is incomplete.',
  ],
  failure: [
    'The ritual breaks. What you were attempting hears the failure.',
    'Nothing, and then something, and then too much.',
    'The circle failed. Whatever was outside is now inside.',
  ],
};

export function getRandomFlavor(pool) {
  const arr = Array.isArray(pool) ? pool : Object.values(pool).flat();
  return arr[Math.floor(Math.random() * arr.length)];
}

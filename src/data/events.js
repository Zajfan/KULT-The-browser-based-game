// Random events that fire during gameplay based on location, insight, time of day

export const RANDOM_EVENTS = [
  // --- RESIDENTIAL ---
  {
    id: 'neighbor_stares',
    location: 'residential',
    insightMin: 0, insightMax: 2,
    weight: 30,
    type: 'mundane',
    title: 'The Neighbor',
    text: 'Your neighbor in 4B has been standing at their window for eleven hours. They haven\'t moved. You\'ve been watching because something about the angle of their head is wrong.',
    choices: [
      { label: 'Knock on their door', attribute: 'coolness', apCost: 10, successText: 'They answer. Their eyes are slightly too wide. They say everything is fine in the exact same words three times.', partialText: 'No answer. But you hear movement inside that doesn\'t sound like a person walking.', failureText: 'The door opens on its own. The apartment is empty. It smells like the inside of a church.', stabilityLoss: { complete: 0, partial: 1, failure: 2 } },
      { label: 'Ignore it', apCost: 0, autoResult: 'partial', text: 'You try to sleep. At 3 AM you hear something scrape against your ceiling.' },
    ],
  },
  {
    id: 'static_dream',
    location: 'residential',
    insightMin: 1,
    timeOnly: 'night',
    weight: 20,
    type: 'supernatural',
    title: 'Static Dream',
    text: 'You wake briefly at an unknown hour. The television is on, but you don\'t own a television. The figure standing in the static has your face.',
    choices: [
      { label: 'Watch', attribute: 'willpower', apCost: 5, successText: 'The figure mouths something. You don\'t understand it yet. But you will.', partialText: 'The figure points at something behind you. When you turn, there\'s nothing. But the wall is warm.', failureText: 'You watch until dawn without realizing it. You\'ve lost time you didn\'t know you were spending.', stabilityLoss: { complete: 0, partial: 1, failure: 2 }, insightGain: { complete: 1, partial: 0, failure: 0 } },
      { label: 'Close your eyes', apCost: 0, autoResult: 'complete', text: 'Smart. Some things only have power if you acknowledge them.' },
    ],
  },

  // --- DOWNTOWN ---
  {
    id: 'executive_contact',
    location: 'downtown',
    insightMin: 0,
    weight: 25,
    type: 'mundane',
    title: 'The Executive',
    text: 'A suited figure at the café has been watching you for twenty minutes. When they finally approach, they slide a business card across the table without speaking. The name on the card is yours. Your phone number. Your address.',
    choices: [
      { label: 'Confront them', attribute: 'coolness', apCost: 15, successText: 'They say: "We know what you\'re becoming. There\'s a place for you." They leave ₮500 on the table.', partialText: 'They say nothing. They smile. Then they\'re gone and so is your wallet.', failureText: 'They\'re not there when you look up. The business card is gone. So is the barista.', thalers: { complete: 500, partial: -150, failure: 0 }, stabilityLoss: { complete: 0, partial: 1, failure: 2 } },
      { label: 'Leave immediately', apCost: 5, autoResult: 'partial', text: 'You leave. The card is still in your pocket somehow.' },
    ],
  },
  {
    id: 'pattern_in_data',
    location: 'downtown',
    insightMin: 2,
    weight: 20,
    type: 'supernatural',
    title: 'The Pattern',
    text: 'Working late in the library archive. A data entry error reveals a sequence of municipal deaths going back 40 years. Same date. Same cause. Always 13 people. Always described in reports as "accidental."',
    choices: [
      { label: 'Dig deeper', attribute: 'reason', apCost: 20, successText: 'The pattern resolves into a name you\'ve seen in ritual texts. Something is being fed. Regularly.', partialText: 'You find enough to know the pattern is real. You also find a camera you didn\'t notice before.', failureText: 'The files corrupts as you access them. Your screen fills with a face you\'ve seen in your dreams.', stabilityLoss: { complete: 1, partial: 1, failure: 2 }, insightGain: { complete: 1, partial: 1, failure: 0 } },
      { label: 'Report it to no one and walk away', apCost: 0, autoResult: 'partial', text: 'You know. You can\'t unknow. +1 Insight.', insightGain: 1 },
    ],
  },

  // --- SLUMS ---
  {
    id: 'marked_wall',
    location: 'slums',
    insightMin: 0,
    weight: 35,
    type: 'mundane',
    title: 'The Markings',
    text: 'An entire block of walls covered in symbols. Hundreds of them, layered over months or years. Most are graffiti. Some are not. Someone has been mapping something.',
    choices: [
      { label: 'Photograph and study', attribute: 'perception', apCost: 15, successText: 'Three of the symbols appear in a ritual text you\'ve seen. This person knew something. The last marking is a date: tomorrow.', partialText: 'You get photographs. A man watches you from a window across the street, too still, for too long.', failureText: 'Your phone dies. When it restarts, the photographs are gone. Your most recent contacts include a number you don\'t recognise.', insightGain: { complete: 1, partial: 0, failure: 0 }, stabilityLoss: { complete: 0, partial: 1, failure: 1 } },
      { label: 'Ignore it', apCost: 0, autoResult: 'complete', text: 'Probably nothing. Definitely nothing. You don\'t think about it again for three hours.' },
    ],
  },
  {
    id: 'entity_alley',
    location: 'slums',
    insightMin: 3,
    weight: 15,
    type: 'supernatural',
    title: 'The Alley Thing',
    text: 'Something in the alley is not what it appears. It has arranged itself to look like a person sleeping against a dumpster, but the geometry is wrong in ways you\'re only now able to perceive.',
    choices: [
      { label: 'Approach it', attribute: 'soul', apCost: 20, successText: 'It turns toward you. It doesn\'t have a face in the way humans have faces, but it communicates something — a location, a warning, a debt.', partialText: 'It becomes aware of you. That awareness feels like a physical pressure. It doesn\'t move, but you both know this isn\'t over.', failureText: 'It sees you see it. That is the worst possible outcome. Run.', stabilityLoss: { complete: 1, partial: 2, failure: 3 }, insightGain: { complete: 1, partial: 0, failure: 0 } },
      { label: 'Walk past quickly', attribute: 'coolness', apCost: 5, successText: 'You make it past. Your hands shake for an hour.', partialText: 'It notices you noticing. You feel it following at a distance.', failureText: 'Your foot catches on something. You fall. When you look up, the alley is empty except for the smell.', stabilityLoss: { complete: 0, partial: 1, failure: 2 } },
    ],
  },

  // --- PURGATORY ---
  {
    id: 'awakened_meeting',
    location: 'purgatory',
    insightMin: 1,
    weight: 30,
    type: 'supernatural',
    title: 'The Circle',
    text: 'A woman at the bar says she\'s been watching you since you arrived. She says she\'s been watching you for longer than that. She\'s part of a group — the Awakened. She wants to know if you\'re ready to stop being alone in this.',
    choices: [
      { label: 'Join the meeting', attribute: 'soul', apCost: 25, successText: 'Eleven people. Each one has lost something to this knowledge. Each one gained something too. You leave with contacts, a safehouse address, and the first real conversation you\'ve had in months.', partialText: 'You go. One of them is watching you differently than the others. Not curiosity. Assessment.', failureText: 'You go. Midway through, you realise the woman\'s shadow isn\'t moving in sync with her body. This meeting is not what it claimed to be.', factionReward: { faction: 'awakened_circle', amount: { complete: 25, partial: 10, failure: -10 } }, stabilityLoss: { complete: 0, partial: 1, failure: 3 } },
      { label: 'Decline politely', apCost: 5, autoResult: 'partial', text: 'She writes a number on a napkin. "When you\'re ready." She doesn\'t push. That alone makes you trust her slightly more.' },
    ],
  },

  // --- ARCHIVES ---
  {
    id: 'restricted_section',
    location: 'archives',
    insightMin: 2,
    weight: 25,
    type: 'supernatural',
    title: 'The 13th Floor',
    text: 'The archive catalog lists a restricted section on the 13th floor. The building only has 12 floors. You\'ve been here four times and never noticed.',
    choices: [
      { label: 'Find the 13th floor', attribute: 'intuition', apCost: 30, successText: 'It\'s there. A narrow corridor between what should be empty space. The documents stored here predate the building by three centuries. They know things about the city\'s foundation that rewrite everything.', partialText: 'You find a staircase that goes somewhere it shouldn\'t. You get three steps up before the lights go out.', failureText: 'You find it and immediately wish you hadn\'t. The things catalogued here are still alive. One of them has noticed the door is open.', insightGain: { complete: 2, partial: 1, failure: 0 }, stabilityLoss: { complete: 1, partial: 2, failure: 3 } },
      { label: 'File a records request', apCost: 10, autoResult: 'partial', text: 'Denied. But the rejection letter is signed by a name you\'ve seen on a memorial plaque from 1932.' },
    ],
  },

  // --- ASYLUM ---
  {
    id: 'patient_1071',
    location: 'asylum',
    insightMin: 3,
    weight: 20,
    type: 'supernatural',
    title: 'Patient 1071',
    text: 'Patient 1071 has been in this ward since 1987. The staff says she\'s been here since 1987. Her file says she was born in 1994. She knows your name. She knew it before you arrived.',
    choices: [
      { label: 'Listen to what she says', attribute: 'intuition', apCost: 20, successText: 'She describes the Labyrinth in precise geometric detail. She\'s been there — consciously, repeatedly. She gives you a specific piece of information you\'ve been trying to find for weeks.', partialText: 'She tells you something true. It\'s also something you cannot verify, cannot share, and will cost you sleep for a long time.', failureText: 'She speaks for forty minutes in a language you\'ve never heard. You understand every word. You don\'t remember any of them. Your nose is bleeding.', insightGain: { complete: 2, partial: 1, failure: 1 }, stabilityLoss: { complete: 1, partial: 2, failure: 3 } },
      { label: 'Ask staff about her', attribute: 'coolness', apCost: 10, successText: 'The nurse says Patient 1071 doesn\'t exist. When you point to the room, the room has a different number. Has always had a different number.', partialText: 'The staff claims no such patient. But three orderlies look at each other in a way they shouldn\'t.', failureText: 'You\'re asked to leave. Escorted. Firmly.', insightGain: { complete: 1, partial: 0, failure: 0 }, stabilityLoss: { complete: 1, partial: 0, failure: 0 } },
    ],
  },

  // --- BEYOND THE VEIL ---
  {
    id: 'archon_presence',
    location: 'beyond_veil',
    insightMin: 5,
    weight: 15,
    type: 'supernatural',
    title: 'The Presence of an Archon',
    text: 'The air here has weight. The Illusion is thin enough that you can perceive what lies beneath it — and what lies beneath it perceives you back. Something immense is paying attention to this location. To you.',
    choices: [
      { label: 'Acknowledge the presence', attribute: 'soul', apCost: 40, successText: 'The exchange is wordless and devastating. You are shown something about your own imprisonment that changes the shape of everything you\'ve been doing. You also become much more visible to things that hunt the Awakened.', partialText: 'Contact made. Brief. The thing withdraws, but leaves an imprint on your mind that will surface at unpredictable moments.', failureText: 'The presence floods your awareness. You are a small animal in an enormous dark. When you come back, forty minutes are gone.', insightGain: { complete: 2, partial: 1, failure: 0 }, stabilityLoss: { complete: 2, partial: 3, failure: 4 } },
      { label: 'Retreat immediately', attribute: 'reflexes', apCost: 10, successText: 'You make it out. Your hair is three centimetres longer than it was.', partialText: 'Almost clean. Something tagged you on the way out. Invisible, for now.', failureText: 'Your legs don\'t listen to you for a full minute. You are not alone in your body during that time.', stabilityLoss: { complete: 0, partial: 1, failure: 3 } },
    ],
  },
];

export const getEventsForLocation = (locationId, insight, hour) => {
  const isNight = hour >= 21 || hour < 5;
  return RANDOM_EVENTS.filter(e => {
    if (e.location !== locationId) return false;
    if (insight < (e.insightMin || 0)) return false;
    if (e.insightMax !== undefined && insight > e.insightMax) return false;
    if (e.timeOnly === 'night' && !isNight) return false;
    if (e.timeOnly === 'day' && isNight) return false;
    return true;
  });
};

export const rollForEvent = (locationId, insight, hour, recentEventIds = []) => {
  const eligible = getEventsForLocation(locationId, insight, hour)
    .filter(e => !recentEventIds.includes(e.id));
  if (!eligible.length) return null;
  const totalWeight = eligible.reduce((sum, e) => sum + (e.weight || 10), 0);
  const threshold = 100; // roughly 1-in-3 chance per action at base weight
  if (Math.random() * threshold > totalWeight / eligible.length) return null;
  let rand = Math.random() * totalWeight;
  for (const e of eligible) {
    rand -= e.weight || 10;
    if (rand <= 0) return e;
  }
  return eligible[eligible.length - 1];
};

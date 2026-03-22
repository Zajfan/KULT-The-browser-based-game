export const NPCS = {
  dr_mayer: {
    id: 'dr_mayer',
    name: 'Dr. Ines Mayer',
    title: 'Attending Physician',
    location: 'hospital',
    icon: '👩‍⚕️',
    faction: 'neutral',
    trust: 0,
    description: 'Competent in ways that become unsettling the more you notice her. She hasn\'t aged in the staff photographs going back to the early 2000s. She helps the Awakened — for a price, and out of reasons she has never clarified.',
    services: ['heal_wounds', 'treat_stability', 'bribe_doctor'],
    dialogue: {
      greeting: [
        'You look like you\'ve been somewhere you shouldn\'t. Sit down.',
        'Back again. I keep a file on you, you know. It\'s getting thick.',
        'Whatever it was, don\'t go back there.',
      ],
      trust_low: 'I\'ll patch you up. Don\'t ask me questions yet.',
      trust_mid: 'You\'re more careful than most who come through here. I appreciate that.',
      trust_high: 'I\'ve been watching this city longer than you\'ve been alive. Ask me something real.',
    },
    lore: 'Dr. Mayer has been on staff since at least 1998, based on records. She appears in a 1974 staff photograph that the hospital denies exists.',
  },

  solomon_ash: {
    id: 'solomon_ash',
    name: 'Solomon Ash',
    title: 'Fence & Information Broker',
    location: 'black_market',
    icon: '🧔',
    faction: 'neutral',
    trust: 0,
    description: 'Ash runs the market from a position of studied neutrality. He sells to Archon servants and Death Angel cults alike. He knows what everything is actually worth, which is more disturbing than it sounds when the items involved are what they are.',
    services: ['buy_weapon', 'buy_artifact', 'sell_items'],
    dialogue: {
      greeting: [
        'Cash only. No questions from either of us.',
        'New stock this week. Some of it\'s still warm.',
        'Don\'t touch what you can\'t afford to break.',
      ],
      trust_low: 'Transaction only. Come back when you have more to offer.',
      trust_mid: 'You\'re reliable. I like reliable. I\'ll set things aside for you.',
      trust_high: 'There are items I don\'t put out for general sale. You\'ve earned a look.',
    },
    lore: 'Ash has no past that anyone can verify. His fingerprints appear in three separate databases under three different names, two of which are listed as deceased.',
  },

  sister_voss: {
    id: 'sister_voss',
    name: 'Sister Katarine Voss',
    title: 'Archivist (Retired)',
    location: 'archives',
    icon: '👩‍🦳',
    faction: 'awakened_circle',
    trust: 0,
    description: 'Once a nun, now something harder to categorise. She knows which files the city actually wants buried and why. She shares this information carefully, always in exchange for something — not money, but action.',
    services: ['research_lore', 'find_pattern', 'access_restricted'],
    dialogue: {
      greeting: [
        'The index is a lie, but it\'s a consistent lie. That\'s more useful than truth.',
        'They moved the 1953 municipal records again. Third time this year.',
        'Don\'t use the east reading room today.',
      ],
      trust_low: 'I don\'t know you well enough to show you the real catalogues.',
      trust_mid: 'You understand that what I show you cannot be forgotten. You accept that?',
      trust_high: 'I\'ve been waiting forty years for someone with your particular combination of access and perception. There\'s work to do.',
    },
    lore: 'Sister Voss was excommunicated in 1987 for "heterodox research practices." The Vatican has no record of what those practices were. She seems unsurprised by this.',
  },

  rennick: {
    id: 'rennick',
    name: 'Marcus Rennick',
    title: 'Awakened Fixer',
    location: 'purgatory',
    icon: '🕶',
    faction: 'awakened_circle',
    trust: 0,
    description: 'Rennick arranges things — safe houses, extraction from supernatural situations, introductions to people you need to know. He\'s been doing this for the Awakened for fifteen years, which is an unusually long survival record.',
    services: ['network_awakened', 'trade_information', 'find_ritual'],
    dialogue: {
      greeting: [
        'You\'re either exactly who I was expecting or you\'re a very serious problem. Sit.',
        'Heard you\'ve been active. Good. Passive Awakened don\'t tend to stay Awakened.',
        'I have three things for sale tonight. You can afford exactly one.',
      ],
      trust_low: 'You\'re new to this. Don\'t get me killed learning.',
      trust_mid: 'You\'ve handled yourself. I can work with that.',
      trust_high: 'There are things I don\'t talk about with most people. You\'re not most people anymore.',
    },
    lore: 'Rennick lost his sister to a Nepharite seven years ago. He has dedicated everything since to giving other Awakened the knowledge he didn\'t have in time to save her.',
  },

  dr_heiss: {
    id: 'dr_heiss',
    name: 'Dr. Otto Heiss',
    title: 'Senior Psychiatrist',
    location: 'asylum',
    icon: '👨‍⚕️',
    faction: 'archon_aligned',
    trust: 0,
    description: 'Dr. Heiss treats the Awakened as the clinically delusional they superficially resemble. He is thorough, well-funded, and serves interests that have nothing to do with patient care. He is also, against all reason, the best source of information about what the asylum\'s long-term patients actually know.',
    services: ['speak_patient', 'examine_records'],
    dialogue: {
      greeting: [
        'You\'re not scheduled. I have four minutes.',
        'Another one of Rennick\'s people? Sit down. Don\'t touch anything.',
        'The patients are having a difficult week. Try not to add to it.',
      ],
      trust_low: 'I don\'t share case files with civilians.',
      trust_mid: 'You understand that what happens here is confidential. Whatever arrangement we have stays between us.',
      trust_high: 'Some of my patients have information that certain parties find uncomfortable. I\'ve been looking for a discreet way to manage that. You may be useful.',
    },
    lore: 'Dr. Heiss attended medical school in a city that, according to current maps, does not exist. His accreditation has never been formally questioned.',
  },
};

export const getNPCForLocation = (locationId) => {
  return Object.values(NPCS).find(npc => npc.location === locationId) || null;
};

export const getAllNPCS = () => Object.values(NPCS);

// Quests are narrative chains tied to dark secrets, factions, and world events.
// Each quest has stages that unlock progressively.

export const QUEST_CHAINS = {
  // ─── Introductory Quest (always available, guides new players) ────────────
  intro_quest: {
    id: 'intro_quest',
    name: 'First Steps in the Illusion',
    secretRequired: null,
    isIntro: true,
    description: 'Something cracked in the world the day you woke up. The city you thought you knew is a shell over something older and stranger. You need to find your footing — fast.',
    stages: [
      {
        id: 'intro_1',
        title: 'Get Your Bearings',
        description: 'You know your neighborhood. Or you thought you did. Spend time observing — the routines, the faces, the gaps in the pattern that most people never notice. This is where you start.',
        objective: 'In the Residential District: Talk to a neighbor. (Speak to Neighbor × 2)',
        location: 'residential',
        action: 'speak_neighbor',
        count: 2,
        reward: { thalers: 150, insight: 0, item: null, text: 'A rumor. Inconsistent. Someone in this block has been missing for eleven days and nobody has filed a report. Nobody seems distressed by this.' },
      },
      {
        id: 'intro_2',
        title: 'Follow the Thread',
        description: 'The Archives keep records that have no business existing. City histories with pages razored out. Registry entries that loop back to the same address. You need information — and information lives here.',
        objective: 'At the Archives: Research something. (Research Lore × 2)',
        location: 'archives',
        action: 'research_lore',
        count: 2,
        reward: { thalers: 0, insight: 1, item: null, text: 'The address in the rumor appears in records going back forty years. Different tenants each time. Same circumstances each time. You are not the first person to notice.' },
      },
      {
        id: 'intro_3',
        title: 'Find Your People',
        description: 'Purgatory is not what it looks like. It never is. The ones who know what the city actually is tend to find each other here, in the back room, in the hour before last call. You need to make contact.',
        objective: 'At Purgatory: Access the backroom. (Access Backroom × 1)',
        location: 'purgatory',
        action: 'access_backroom',
        count: 1,
        reward: { thalers: 200, insight: 1, item: null, factionReward: { faction: 'awakened_circle', amount: 15 }, text: 'Three people who know what you are. None of them are glad about it. One of them hands you a folded card with a name and a district. "When you\'re ready," she says. "Not before."' },
      },
    ],
  },

  // ─── Dark Secret Quests ───────────────────────────────────────────────────
  acedia_chain: {
    id: 'acedia_chain',
    name: 'The Empty Throne',
    secretRequired: 'acedia',
    description: 'Something left when grace departed. You need to find out whether it was grace at all.',
    stages: [
      {
        id: 'acedia_1',
        title: 'The Last Church',
        description: 'There is a church in the Residential District that no longer appears on any map. The congregation still meets. Find it.',
        objective: 'Travel to the Residential District and perform Speak to Neighbor 3 times.',
        location: 'residential',
        action: 'speak_neighbor',
        count: 3,
        reward: { thalers: 0, insight: 1, item: null, text: 'An address. Handwritten on a liturgy programme that predates you by forty years.' },
      },
      {
        id: 'acedia_2',
        title: 'What Remains',
        description: 'The congregation knows what you were. They have been waiting. What they offer is not what you expected.',
        objective: 'Visit Purgatory and access the backroom.',
        location: 'purgatory',
        action: 'access_backroom',
        count: 1,
        reward: { thalers: 0, insight: 1, item: 'worn_rosary', text: 'A fragment of something you lost. Or something you never had. The distinction matters less than you thought.' },
      },
      {
        id: 'acedia_3',
        title: 'The Hollow Place',
        description: 'What departed from you was not grace. It was a leash. The question is who held it.',
        objective: 'Reach the Beyond the Veil and commune with an entity.',
        location: 'beyond_veil',
        action: 'commune_entity',
        count: 1,
        reward: { thalers: 0, insight: 2, item: null, factionReward: { faction: 'awakened_circle', amount: 30 }, text: 'The entity knows your name — your real name, not the one you use. It tells you what the departure of grace actually was. You wish it hadn\'t.' },
      },
    ],
  },

  occultist_chain: {
    id: 'occultist_chain',
    name: 'The Incomplete Text',
    secretRequired: 'occultist',
    description: 'Your Grimoire Fragment connects to something larger. The complete text exists somewhere in the city.',
    stages: [
      {
        id: 'occ_1',
        title: 'The Other Fragments',
        description: 'Your fragment is one of seven. Two more are in the city. One is owned willingly. One is not.',
        objective: 'Research the Grimoire at the Archives.',
        location: 'archives',
        action: 'research_lore',
        count: 2,
        reward: { thalers: 200, insight: 1, item: null, text: 'Two locations. A collector downtown who doesn\'t know what he has. And a cult that knows exactly what it has.' },
      },
      {
        id: 'occ_2',
        title: 'The Willing Fragment',
        description: 'The collector will trade. His price is information about something he calls "the arrangement."',
        objective: 'Work a job in Downtown and meet a contact.',
        location: 'downtown',
        action: 'meet_contact',
        count: 2,
        reward: { thalers: 0, insight: 1, item: 'grimoire_fragment', text: 'Fragment acquired. Three of seven. The text grows more coherent. More demanding.' },
      },
      {
        id: 'occ_3',
        title: 'The Cult\'s Piece',
        description: 'The cult will not trade. They believe the fragments choose their keepers. You will need to convince them otherwise.',
        objective: 'Infiltrate the cult in the Industrial Quarter.',
        location: 'industrial',
        action: 'infiltrate_cult',
        count: 1,
        reward: { thalers: 0, insight: 2, item: null, text: 'Fragment acquired. What the complete text says should not be read in one sitting.' },
      },
    ],
  },

  guilty_chain: {
    id: 'guilty_chain',
    name: 'The Blood Ledger',
    secretRequired: 'guilty',
    description: 'The thing you did left a mark on the world. Something has been following that mark back to you.',
    stages: [
      {
        id: 'guilty_1',
        title: 'The Witness',
        description: 'Someone saw what you did. They have been silent for reasons of their own. Those reasons are ending.',
        objective: 'Find an informant in the Slums.',
        location: 'slums',
        action: 'find_informant',
        count: 2,
        reward: { thalers: 100, insight: 0, item: null, text: 'A name. The witness. They are not hiding. They have been waiting for you to find them.' },
      },
      {
        id: 'guilty_2',
        title: 'The Confrontation',
        description: 'Meet the witness. Understand why they waited. Learn what they actually saw — which is more than you thought possible.',
        objective: 'Access the backroom at Purgatory.',
        location: 'purgatory',
        action: 'access_backroom',
        count: 1,
        reward: { thalers: 0, insight: 1, stabilityLoss: 2, item: null, text: 'The witness saw everything. Including the entity that was present. Including what it took from you in exchange for not intervening.' },
      },
      {
        id: 'guilty_3',
        title: 'The Entity\'s Interest',
        description: 'Your crime bought you something from an entity you never consented to deal with. Renegotiate the terms.',
        objective: 'Commune with an entity beyond the Veil.',
        location: 'beyond_veil',
        action: 'commune_entity',
        count: 1,
        reward: { thalers: 0, insight: 2, item: null, factionReward: { faction: 'death_angel_aligned', amount: 25 }, text: 'The debt is restructured. The entity finds you more interesting than your guilt. This is not necessarily better.' },
      },
    ],
  },

  // ─── World / Faction Quests ───────────────────────────────────────────────
  awakened_intro: {
    id: 'awakened_intro',
    name: 'First Contact',
    secretRequired: null,
    description: 'The Awakened Circle has noticed you. They want to know if you\'re an asset or a liability.',
    stages: [
      {
        id: 'aw_1',
        title: 'The Test',
        description: 'Rennick wants to see how you handle a straightforward investigation before trusting you with anything sensitive.',
        objective: 'Research lore at the Archives twice.',
        location: 'archives',
        action: 'research_lore',
        count: 2,
        reward: { thalers: 300, insight: 1, item: null, factionReward: { faction: 'awakened_circle', amount: 20 }, text: 'Rennick is satisfied. "You found the right things and knew not to touch the wrong ones. That\'s rarer than it sounds."' },
      },
      {
        id: 'aw_2',
        title: 'The Safe House',
        description: 'A newly Awakened person needs to be moved before a Lictor finds them. The Awakened Circle needs a courier they can trust.',
        objective: 'Commit a crime in the Slums (any) and travel to Purgatory.',
        location: 'slums',
        action: 'commit_crime',
        count: 1,
        reward: { thalers: 500, insight: 0, item: null, factionReward: { faction: 'awakened_circle', amount: 25 }, text: 'The person is safe. They look at you the way you looked at the first Awakened you met. You remember what that felt like.' },
      },
    ],
  },

  archon_surveillance: {
    id: 'archon_surveillance',
    name: 'Eyes Everywhere',
    secretRequired: null,
    description: 'You\'ve drawn Archon attention. A Lictor has been assigned to observe you. Whether you run, hide, or engage is your choice.',
    stages: [
      {
        id: 'arch_1',
        title: 'The Shadow',
        description: 'Something is following you. It hasn\'t acted yet. Find out what it knows and why it\'s waiting.',
        objective: 'Investigate the factory in the Industrial Quarter.',
        location: 'industrial',
        action: 'investigate_factory',
        count: 2,
        reward: { thalers: 0, insight: 1, item: null, text: 'A Lictor. Assigned three weeks ago. Its report is thorough. Your file with the Archons is thicker than you knew.' },
      },
      {
        id: 'arch_2',
        title: 'The Choice',
        description: 'You can destroy the Lictor\'s report. You can mislead it. Or you can make contact and find out what the Archons actually want from you.',
        objective: 'Confront an Archon beyond the Veil.',
        location: 'beyond_veil',
        action: 'confront_archon',
        count: 1,
        reward: { thalers: 0, insight: 2, item: null, factionReward: { faction: 'archon_aligned', amount: 30 }, text: 'The Archon\'s interest in you is specific. Not punitive. You are useful to them in a way you haven\'t fully understood yet.' },
      },
    ],
  },
};

// Progress tracking shape: { questId: { stageIdx: number, actionCount: number, completed: boolean } }

export const getAvailableQuests = (character) => {
  return Object.values(QUEST_CHAINS).filter(q => {
    if (q.secretRequired && character.darkSecret?.id !== q.secretRequired) return false;
    return true;
  });
};

export const isIntroQuestComplete = (character) => {
  return character.questProgress?.intro_quest?.completed === true;
};

export const getQuestProgress = (character, questId) => {
  return character.questProgress?.[questId] || { stageIdx: 0, actionCount: 0, completed: false };
};

export const checkQuestProgress = (character, actionId, locationId) => {
  const available = getAvailableQuests(character);
  const updates = [];

  available.forEach(quest => {
    const progress = getQuestProgress(character, quest.id);
    if (progress.completed) return;

    const stage = quest.stages[progress.stageIdx];
    if (!stage) return;

    const locationMatch = !stage.location || stage.location === locationId;
    const actionMatch   = stage.action === actionId || (stage.action === 'commit_crime' && ['commit_crime','pick_fight'].includes(actionId));

    if (locationMatch && actionMatch) {
      const newCount = (progress.actionCount || 0) + 1;
      const stageComplete = newCount >= (stage.count || 1);
      updates.push({
        questId: quest.id,
        questName: quest.name,
        stage,
        newCount,
        stageComplete,
        nextStageIdx: stageComplete ? progress.stageIdx + 1 : progress.stageIdx,
        questComplete: stageComplete && progress.stageIdx >= quest.stages.length - 1,
        reward: stageComplete ? stage.reward : null,
      });
    }
  });

  return updates;
};

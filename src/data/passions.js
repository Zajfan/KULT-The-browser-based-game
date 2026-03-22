// Passions — KULT:DL's core character motivation system.
// Each character has up to 3 Passions: things they care deeply about.
// Threats to Passions create drama and mechanical consequences.

export const PASSION_TYPES = [
  {
    id:'person',
    label:'A Person',
    desc:'Someone whose existence matters to you more than your own safety.',
    examples:['A sibling you lost and are searching for','A child you are protecting','Someone who knows your secret','A contact who trusts you completely'],
  },
  {
    id:'belief',
    label:'A Belief',
    desc:'A conviction you hold so deeply it shapes every decision.',
    examples:['The Illusion can be broken for everyone, not just the Awakened','The Death Angels deserve liberation, not servitude','Nothing that happens in the Illusion is real enough to grieve over','The dead deserve better than the Labyrinth'],
  },
  {
    id:'place',
    label:'A Place',
    desc:'A location that is yours in a way you cannot fully explain.',
    examples:['An apartment where you feel safe','A location where you first saw through the Illusion','A building whose history you are obsessed with','A liminal space you keep returning to'],
  },
  {
    id:'object',
    label:'An Artifact or Object',
    desc:'Something whose loss would unmake you.',
    examples:['An item that belonged to someone you lost','A supernatural artifact you do not understand but cannot give up','Evidence of something important','A tool that has saved your life more than once'],
  },
  {
    id:'knowledge',
    label:'A Piece of Knowledge',
    desc:'Something you know, or desperately need to know.',
    examples:['The name of the entity that was present when your dark secret happened','What is actually stored in the restricted section of the Archives','What the city was before the Illusion was constructed','What happened to someone who disappeared'],
  },
];

// When a passion is threatened, this generates the mechanical consequence
export function passionThreatCheck(passion, character) {
  return {
    stabilityLoss: 1,
    nerveLoss: 10,
    description: `Your passion — "${passion.description}" — is threatened. The Illusion tightens around it.`,
  };
}

// When a passion is fulfilled or protected, this generates the reward
export function passionFulfillmentBonus() {
  return {
    stabilityGain: 2,
    nerveGain: 10,
    description: 'Acting in service of what you care about restores something that logic cannot.',
  };
}

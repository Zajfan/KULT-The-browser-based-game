// Death Angel Manifestation Events — fires when a character's patron Death Angel 
// becomes aware of them. Triggered by: high guilt stacks, very low Stability, 
// specific actions aligned with the Death Angel's domain, and crossing Insight thresholds.

import { getDeathAngelForSecret } from './deathAngels.js';

export const DA_MANIFESTATIONS = {

  purzon: {
    events: [
      {
        id: "purzon_1",
        trigger: "stability_low",
        title: "The Shape of Absence",
        text: "Something is sitting in the chair across the room. It has the shape of someone who left. You know, looking at it, that it is not them — it wears their shape the way a coat wears a person. It does not speak. It waits for you to.",
        choices: [
          { label: "Acknowledge it", outcome: "partial", stabilityLoss: 1, text: "You speak. It listens. When you stop, it is still there, still listening, and you understand that it will be listening from now on in every quiet room." },
          { label: "Ignore it", outcome: "complete", stabilityLoss: 0, text: "You look away. When you look back, it is gone. You are not certain it will stay gone." },
          { label: "Speak directly to Purzon", outcome: "complete", stabilityLoss: 2, insightGain: 1, text: "You address it by its patron's name. The shape collapses inward. A voice — not from the shape, from the room itself — says: 'You know what I am. Good.'" },
        ],
      },
      {
        id: "purzon_2",
        trigger: "guilt_high",
        title: "The Letter",
        text: "A letter arrives addressed to you in handwriting you recognize — from someone you have not been in contact with in years, someone who does not know where you live. The letter contains one line: 'I understand now why you left.' It is dated six months from today.",
        choices: [
          { label: "Investigate the letter", outcome: "partial", stabilityLoss: 1, text: "The postmark is from an address that does not exist. The handwriting is not quite right — close, but wrong in the way a face is wrong in a mirror." },
          { label: "Keep it", outcome: "complete", stabilityLoss: 0, text: "You keep it. It smells faintly of something you associate with that person. It remains exactly as it is. The date approaches." },
          { label: "Destroy it", outcome: "failure", stabilityLoss: 2, text: "You burn it. Three hours later, it is on your desk again, unburnt, smelling of smoke." },
        ],
      },
    ],
  },

  nahemoth: {
    events: [
      {
        id: "nahemoth_1",
        trigger: "wounds_high",
        title: "The Smell",
        text: "You become aware, over the course of an ordinary hour, of a smell that should not be present. Sweet, organic, specific. You have smelled it before — it was attached to something that was recently dead. The smell is coming from you.",
        choices: [
          { label: "Check the wound", outcome: "complete", stabilityLoss: 1, text: "The wound is clean. The smell dissipates. Your reflection in a nearby surface shows something different for one second, then resolves into your face." },
          { label: "Address Nahemoth directly", outcome: "partial", stabilityLoss: 2, insightGain: 1, text: "You speak aloud to the smell. A response arrives in the form of a sensation rather than sound — a quality of attention, deliberate and cold and not entirely unfriendly." },
        ],
      },
    ],
  },

  gamygyn: {
    events: [
      {
        id: "gamygyn_1",
        trigger: "crimes_high",
        title: "The Witness",
        text: "You pass a person on the street who looks at you for precisely one second longer than strangers look at each other. In that second, you see them see you — not your face, but what you have done. They walk on. They do not look back. You feel the ledger entry.",
        choices: [
          { label: "Follow them", outcome: "partial", stabilityLoss: 1, text: "They vanish around a corner. In their wake, a receipt from a restaurant you ate at the night before — with a timestamp from before you arrived." },
          { label: "Continue walking", outcome: "complete", stabilityLoss: 1, text: "You continue. The feeling of the ledger entry remains. It does not feel like accusation. It feels like filing." },
        ],
      },
      {
        id: "gamygyn_2",
        trigger: "guilt_high",
        title: "The Report",
        text: "A manila folder appears on a surface you use regularly. Inside: a complete and accurate record of every harmful act you have committed, with dates, names of those affected, and a field labeled 'outstanding balance' that reads: 'Pending.' The report is formatted like a tax document.",
        choices: [
          { label: "Read it completely", outcome: "partial", stabilityLoss: 2, insightGain: 1, text: "You read every line. It is accurate. It is thorough. The final page is blank except for: 'The above is not a threat. It is a record. Records have purposes.'" },
          { label: "Refuse to read it", outcome: "failure", stabilityLoss: 2, text: "You refuse. The folder remains on every surface you use for the next three days before disappearing." },
        ],
      },
    ],
  },

  aiwass: {
    events: [
      {
        id: "aiwass_1",
        trigger: "insight_milestone",
        title: "The Appointment",
        text: "Your phone shows a calendar appointment that you did not create: today, in forty minutes, at an address three blocks away. The appointment title is your name.",
        choices: [
          { label: "Go to the address", outcome: "complete", insightGain: 1, stabilityLoss: 1, text: "A room. A person you have not met who knows things about you that should be impossible. They say: 'You are slightly ahead of schedule. That is unusual.' They tell you one thing and ask for nothing in return. For now." },
          { label: "Ignore it", outcome: "partial", stabilityLoss: 0, text: "You ignore it. That evening, you receive a text from an unknown number that reads only: 'Rescheduled.'" },
        ],
      },
    ],
  },

  netzah: {
    events: [
      {
        id: "netzah_1",
        trigger: "research_deep",
        title: "The Annotation",
        text: "A text you are reading — physical or digital, it does not matter — contains annotations in your own handwriting that you did not write. They are correct. They extend the text's meaning in directions you had not yet reached.",
        choices: [
          { label: "Follow the annotations", outcome: "complete", insightGain: 1, stabilityLoss: 1, text: "The annotations lead somewhere. At the end of the chain, a question: 'Are you enjoying the research? I am.'" },
          { label: "Note the occurrence and continue", outcome: "partial", stabilityLoss: 0, text: "You note it. The annotations stop for three days, then begin again in a slightly different handwriting." },
        ],
      },
    ],
  },

  belial: {
    events: [
      {
        id: "belial_1",
        trigger: "low_stability",
        title: "The Other One",
        text: "You become aware, sometime after 2 AM, that the person who went to sleep was not quite you — or rather, was one of several possible yous, and you are not certain which one woke up. The apartment is the same. The face in the bathroom mirror is the same. Something small is different that you cannot name.",
        choices: [
          { label: "Test yourself — name three things that anchor you", outcome: "complete", stabilityLoss: 1, text: "You recite three things that are specifically yours. The displacement resolves. Belial's attention, briefly intense, withdraws to its usual ambient level." },
          { label: "Accept the uncertainty and continue", outcome: "partial", insightGain: 1, stabilityLoss: 2, text: "You accept it. The uncertainty produces, over the following week, a specific clarity about which parts of your identity are constructed and which are not. This is uncomfortable and useful." },
        ],
      },
    ],
  },

  samael: {
    events: [
      {
        id: "samael_1",
        trigger: "stability_critical",
        title: "The Quiet",
        text: "A quality of silence arrives that is different from ordinary silence. It has weight. It is comfortable in a way that is not entirely safe. Something in you recognizes it and relaxes toward it before you realize what you are relaxing toward.",
        choices: [
          { label: "Name what you are feeling — out loud", outcome: "complete", stabilityLoss: 0, text: "Naming it creates distance from it. The silence remains but loses its gravitational quality. Samael's presence withdraws — not gone, but no longer immediate." },
          { label: "Sit with it", outcome: "partial", stabilityLoss: 2, text: "You sit with it for a time. When you come back, it has been longer than you thought. Something small has shifted in your posture toward the future." },
          { label: "Call someone", outcome: "complete", stabilityLoss: 0, text: "You call someone. It does not matter what you say. The act of reaching out is the intervention. The silence dissipates. Later: gratitude, specific and unexpected." },
        ],
      },
    ],
  },

  baalphegor: {
    events: [
      {
        id: "baalphegor_1",
        trigger: "faction_high",
        title: "The True Believer",
        text: "Someone in your network expresses a belief about you — your intentions, your significance — that you did not author and do not fully recognize. They are certain. Others in the network have adopted the same belief. You hear it attributed to something you said that you do not remember saying.",
        choices: [
          { label: "Correct the record", outcome: "partial", stabilityLoss: 1, text: "You correct it. The correction is heard and accepted by most. Two people retain the original belief. They seem — not wrong exactly, but set." },
          { label: "Let it stand", outcome: "failure", stabilityLoss: 0, text: "You let it stand. It is, in its way, useful. The distance between who you are and who they believe you to be grows. Baalphegor finds this very interesting." },
          { label: "Investigate the source", outcome: "complete", insightGain: 1, stabilityLoss: 1, text: "You trace it back. The original statement was a paraphrase of a paraphrase of something you said months ago, amplified and refracted. At its root: an intentional distortion you can now identify." },
        ],
      },
    ],
  },

  azrael: {
    events: [
      {
        id: "azrael_1",
        trigger: "research_deep",
        title: "The Next Source",
        text: "You find yourself, without entirely understanding how you got there, at the entrance to a library section you have not entered before — or a file path you have not navigated to — and the material there is precisely what your research has been building toward. It is as if a path was laid for you.",
        choices: [
          { label: "Follow the path", outcome: "complete", insightGain: 1, stabilityLoss: 1, text: "You follow it. The material is genuine and significant. At its end, a single file or document that should not exist, that contains something you did not expect to find." },
          { label: "Stop and document where you are", outcome: "partial", stabilityLoss: 0, text: "You stop and document your position. The path remains. You have not followed it. It waits." },
        ],
      },
    ],
  },
};

export function getDAEventForTrigger(secretId, triggerType) {
  const da = secretId?.replace(/-/g, '_');
  const events = DA_MANIFESTATIONS[da]?.events;
  if (!events) return null;
  const matching = events.filter(e => e.trigger === triggerType);
  if (!matching.length) return null;
  return matching[Math.floor(Math.random() * matching.length)];
}

export function shouldTriggerDAEvent(character, triggerType) {
  if (!character?.darkSecret?.id) return false;
  switch (triggerType) {
    case 'stability_low':     return (character.stability || 10) <= 3;
    case 'stability_critical':return (character.stability || 10) <= 1;
    case 'wounds_high':       return ['Serious','Critical','Mortal'].includes(character.wounds);
    case 'guilt_high':        return (character.guiltStacks || 0) >= 3;
    case 'crimes_high':       return (character.stats?.crimesCommitted || 0) >= 5;
    case 'insight_milestone': return [3,5,7].includes(character.insight);
    case 'research_deep':     return (character.stats?.actionsPerformed || 0) % 20 === 0 && character.insight >= 2;
    case 'faction_high':      return Object.values(character.factionStandings || {}).some(v => v >= 80);
    default: return false;
  }
}

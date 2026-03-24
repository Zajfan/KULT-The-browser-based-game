export const PASSION_TYPES = [
  { id:"person",    label:"A Person",               icon:"👤", desc:"Someone whose existence matters to you more than your own safety. Their loss would break something fundamental.", examples:["A partner","A sibling","A mentor","A patient","A witness"] },
  { id:"belief",    label:"A Belief",               icon:"◈",  desc:"A conviction so deep it shapes every decision. You would sacrifice material comfort — or safety — to act on it.", examples:["Justice must be done","The truth must be told","The weak deserve protection","Nothing is as it seems"] },
  { id:"place",     label:"A Place",                icon:"🏚", desc:"A location that is yours in a way you cannot fully explain. Being there restores something that being elsewhere removes.", examples:["A childhood home","A rooftop at night","A city block","An archive reading room"] },
  { id:"object",    label:"An Artifact or Object",  icon:"🗡",  desc:"Something whose loss would unmake you. It may be supernatural. It may be perfectly ordinary. The weight is the same.", examples:["A photograph","An inherited weapon","A journal","A ritual object","A ring"] },
  { id:"knowledge", label:"A Piece of Knowledge",   icon:"📜", desc:"Something you know and cannot share, or something you desperately need to know. The gap between knowing and not knowing is active, constant pain.", examples:["Who killed them","What the Illusion hides","Where they went","What the symbol means"] },
  { id:"community", label:"A Community",            icon:"◎",  desc:"A group of people you are part of or responsible for. Their safety is not separable from your own sense of purpose.", examples:["A neighborhood","A support group","A secret society","Refugees","Former colleagues"] },
];

export function createPassion(typeId, description) {
  return { typeId, description, threatened: false, fulfilled: false };
}

export function passionThreat(passion, character) {
  return { stabilityLoss: 2, nerveLoss: 15 };
}

export function passionFulfill(passion, character) {
  return { stabilityGain: 2, nerveGain: 10 };
}

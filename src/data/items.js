// Items — weapons, armor, consumables, artifacts, key items
// Expanded from all KULT editions

export const ITEMS = {
  // ── Weapons: Mundane ───────────────────────────────────────────────────
  knife:         { id:"knife",         name:"Combat Knife",          type:"weapon", damage:"1d6",   bonus:0, price:150,  icon:"🔪", description:"A reliable blade. Close range only. Illegal to carry openly." },
  iron_pipe:     { id:"iron_pipe",     name:"Iron Pipe",             type:"weapon", damage:"1d6",   bonus:0, price:40,   icon:"🪧", description:"Crude. Functional. Deniable." },
  pistol:        { id:"pistol",        name:"Semi-Auto Pistol",      type:"weapon", damage:"2d6",   bonus:1, price:400,  icon:"🔫", description:"Standard firearm. Loud, effective, traceable." },
  revolver:      { id:"revolver",      name:"Revolver",              type:"weapon", damage:"2d6",   bonus:0, price:300,  icon:"🔫", description:"Six shots. Reliable. Old." },
  shotgun:       { id:"shotgun",       name:"Sawed-off Shotgun",     type:"weapon", damage:"3d6",   bonus:2, price:600,  icon:"🔫", description:"Devastating at close range. Extremely illegal." },
  rifle:         { id:"rifle",         name:"Hunting Rifle",         type:"weapon", damage:"3d6",   bonus:2, price:700,  icon:"🔫", description:"Accurate at range. Hard to conceal." },
  baton:         { id:"baton",         name:"Steel Baton",           type:"weapon", damage:"1d6+1", bonus:0, price:80,   icon:"🪧", description:"Non-lethal option. Leaves bruises, not holes." },
  brass_knuckles:{ id:"brass_knuckles",name:"Brass Knuckles",        type:"weapon", damage:"1d4+2", bonus:1, price:60,   icon:"👊", description:"Makes a fist harder. Makes intent clear." },
  // Weapons: Supernatural
  ritual_blade:  { id:"ritual_blade",  name:"Ritual Blade",          type:"weapon", damage:"1d6+2", bonus:1, price:800,  icon:"🗡",  description:"Carved with sigils predating the Illusion. Effective against entities.", supernatural:true },
  void_blade:    { id:"void_blade",    name:"Void-Touched Blade",    type:"weapon", damage:"2d6+1", bonus:2, price:1800, icon:"🗡",  description:"A blade that has passed through the Veil. Damages entities as if mundane resistance did not exist.", supernatural:true },
  archon_shard:  { id:"archon_shard",  name:"Archon Shard",          type:"weapon", damage:"2d6+3", bonus:3, price:3000, icon:"◈",   description:"A fragment of divine architecture weaponized. Causes Stability damage to all nearby.", supernatural:true },
  bone_knife:    { id:"bone_knife",    name:"Bone Knife",            type:"weapon", damage:"1d6+1", bonus:1, price:600,  icon:"🦴",  description:"Cut from something that was human. Resonates with the Labyrinth.", supernatural:true },
  battle_weapon: { id:"battle_weapon", name:"Battle-Worn Weapon",    type:"weapon", damage:"2d6",   bonus:2, price:0,    icon:"⚔",  description:"An old weapon with a history of violence. It has a name you can almost remember." },

  // ── Armor & Protection ─────────────────────────────────────────────────
  vest:          { id:"vest",          name:"Kevlar Vest",           type:"armor", defense:2, price:500,  icon:"🦺", description:"Reduces physical wound severity by one step, once per combat." },
  leather_coat:  { id:"leather_coat",  name:"Reinforced Coat",       type:"armor", defense:1, price:250,  icon:"🧥", description:"Heavy leather with discretely sewn ballistic panels. Looks ordinary." },
  sigil_ward:    { id:"sigil_ward",    name:"Sigil Ward",            type:"armor", defense:0, magicDefense:2, price:1200, icon:"⛧", description:"Drawn in your own blood on the inside of clothing. Reduces Stability loss from entity encounters.", supernatural:true },
  iron_amulet:   { id:"iron_amulet",   name:"Iron Amulet",           type:"armor", defense:0, magicDefense:1, price:400,  icon:"📿", description:"Cold iron, properly shaped. Minor protection against entity influence.", supernatural:true },
  void_mirror:   { id:"void_mirror",   name:"Void Mirror",           type:"armor", defense:0, magicDefense:3, price:2500, icon:"🪞", description:"A mirror that has been through the Veil. Reflects entity attention away from the bearer.", supernatural:true },

  // ── Consumables ────────────────────────────────────────────────────────
  morphine:      { id:"morphine",      name:"Morphine",              type:"consumable", effect:"heal_wound",      value:1, price:200, icon:"💉", description:"Reduces one wound level. Significant addiction risk. Controlled substance." },
  medkit:        { id:"medkit",        name:"Field Medkit",          type:"consumable", effect:"heal_wound",      value:1, price:300, icon:"🩹", description:"Sterile bandages, pressure dressings, suture kit. Professional quality." },
  laudanum:      { id:"laudanum",      name:"Laudanum",              type:"consumable", effect:"heal_stability",  value:2, price:300, icon:"🍶", description:"Restores 2 Stability. An old remedy. May cause visions of the Illusion's seams." },
  anxiolytics:   { id:"anxiolytics",   name:"Anxiolytics",           type:"consumable", effect:"heal_stability",  value:3, price:350, icon:"💊", description:"Modern pharmaceutical. Restores 3 Stability. Dulls perception slightly." },
  adrenaline:    { id:"adrenaline",    name:"Adrenaline Shot",       type:"consumable", effect:"restore_ap",      value:30, price:250, icon:"⚡", description:"Restores 30 AP immediately. Side effects include poor decisions." },
  stimulants:    { id:"stimulants",    name:"Combat Stimulants",     type:"consumable", effect:"restore_ap",      value:50, price:400, icon:"💊", description:"Military-grade. Restores 50 AP. Sleep debt accumulates." },
  smelling_salts:{ id:"smelling_salts",name:"Smelling Salts",        type:"consumable", effect:"restore_stability",value:1, price:100, icon:"🧪", description:"Snaps you back to mundane reality. +1 Stability. Brutal method." },
  nerve_tonic:   { id:"nerve_tonic",   name:"Nerve Tonic",           type:"consumable", effect:"restore_nerve",   value:25, price:200, icon:"🍵", description:"Restores 25 Nerve. Tastes like burnt copper and old wood." },
  black_lotus:   { id:"black_lotus",   name:"Black Lotus Extract",   type:"consumable", effect:"gain_insight",    value:1, price:600, icon:"🌑", description:"Forcibly expands perception. Gain 1 Insight. Lose 1 Stability. The city looks different after.", supernatural:true },
  pale_salt:     { id:"pale_salt",     name:"Pale Salt",             type:"consumable", effect:"heal_stability",  value:4, price:800, icon:"🧂", description:"A ritual substance. Restores 4 Stability. Cuts connection to supernatural for 4 hours — both protection and limitation.", supernatural:true },
  dream_extract: { id:"dream_extract", name:"Dream Extract",         type:"consumable", effect:"gain_insight",    value:2, price:1200, icon:"💧", description:"Distilled from the sleep of a long-term Labyrinth adjacent individual. +2 Insight, −2 Stability. What you see cannot be unseen.", supernatural:true },

  // ── Artifacts ──────────────────────────────────────────────────────────
  worn_rosary:        { id:"worn_rosary",        name:"Worn Rosary",              type:"artifact", effect:"stability_bonus",  value:1, price:0,    icon:"📿", description:"A religious relic that provides comfort. +1 to Willpower checks.", supernatural:true },
  grimoire_fragment:  { id:"grimoire_fragment",  name:"Grimoire Fragment",        type:"artifact", effect:"ritual_bonus",     value:2, price:0,    icon:"📖", description:"Pages from an incomplete ritual text. Enables additional rituals.", supernatural:true },
  unknown_artifact:   { id:"unknown_artifact",   name:"Unknown Artifact",         type:"artifact", effect:"random",           value:0, price:0,    icon:"❓", description:"You do not know what it does. Identify it to find out.", supernatural:true },
  map_nowhere:        { id:"map_nowhere",         name:"Map of Nowhere",           type:"artifact", effect:"navigation",       value:3, price:0,    icon:"🗺", description:"Depicts places that do not exist in the mundane world. Navigation bonus in supernatural locations.", supernatural:true },
  veil_glass:         { id:"veil_glass",          name:"Veil Glass",               type:"artifact", effect:"see_entities",     value:2, price:1500, icon:"🔮", description:"A lens ground from pre-Illusion crystal. Through it, entities are visible even when they would otherwise be hidden.", supernatural:true },
  echo_compass:       { id:"echo_compass",        name:"Echo Compass",             type:"artifact", effect:"locate_rift",      value:2, price:1800, icon:"🧭", description:"Points toward the nearest dimensional weakness. Useful. Unsettling.", supernatural:true },
  bone_rune_set:      { id:"bone_rune_set",       name:"Bone Rune Set",            type:"artifact", effect:"divination",       value:1, price:700,  icon:"🦴", description:"Carved from the finger bones of a deceased Awakened. Enables minor divination rituals.", supernatural:true },
  death_angel_token:  { id:"death_angel_token",   name:"Death Angel Token",        type:"artifact", effect:"patron_channel",   value:3, price:0,    icon:"⛧", description:"An item that has been in your patron Death Angel's presence. Creates a faint channel. Not always welcome.", supernatural:true },
  labyrinth_fragment: { id:"labyrinth_fragment",  name:"Labyrinth Fragment",       type:"artifact", effect:"dead_speak",       value:2, price:2500, icon:"◈", description:"A piece of wall from the Labyrinth. Allows brief communication with the recently dead. High stability cost.", supernatural:true },
  archon_seal:        { id:"archon_seal",          name:"Archon Seal",              type:"artifact", effect:"archon_protection",value:2, price:3500, icon:"☯", description:"A seal of legitimacy from the Archon administration. Provides temporary protection from Lictor pursuit — and marks you as interesting to deeper Archon elements.", supernatural:true },

  // ── Key Items ──────────────────────────────────────────────────────────
  false_papers:    { id:"false_papers",    name:"False Identity Papers",   type:"key_item", effect:"coolness_bonus", value:1, price:0, icon:"🪪", description:"A complete false identity. +1 Coolness when operating under a false name." },
  research_dossier:{ id:"research_dossier",name:"Research Dossier",        type:"key_item", effect:"research_bonus", value:2, price:0, icon:"📁", description:"Years of compiled research. +2 to investigation actions." },
  contact_list:    { id:"contact_list",    name:"Cult Contact List",       type:"key_item", effect:"faction_bonus",  value:1, price:0, icon:"📋", description:"Names, locations, coded phrases. Access to a network." },
  safe_house_key:  { id:"safe_house_key",  name:"Safe House Key",          type:"key_item", effect:"safe_rest",      value:2, price:500, icon:"🗝", description:"Access to an Awakened Circle safe house. Rest there to recover 2 extra Stability." },
  encrypted_drive: { id:"encrypted_drive", name:"Encrypted Drive",         type:"key_item", effect:"leverage",       value:1, price:0,  icon:"💾", description:"Contains compromising information about someone important. Handle carefully." },
  blood_compact:   { id:"blood_compact",   name:"Blood Compact",           type:"key_item", effect:"entity_deal",    value:1, price:0,  icon:"📜", description:"A binding agreement made with an entity, written in your blood. The terms are specific.", supernatural:true },
};

export const MARKET_STOCK = {
  weapons:    ["knife","iron_pipe","pistol","revolver","shotgun","baton","ritual_blade","void_blade"],
  armor:      ["vest","leather_coat","sigil_ward","iron_amulet"],
  consumables:["morphine","medkit","laudanum","anxiolytics","adrenaline","stimulants","smelling_salts","nerve_tonic","black_lotus","pale_salt"],
  artifacts:  ["unknown_artifact","veil_glass","echo_compass","bone_rune_set"],
};

// Items available at high Insight levels
export const RARE_MARKET_STOCK = {
  weapons:    ["archon_shard","bone_knife"],
  artifacts:  ["labyrinth_fragment","archon_seal","death_angel_token"],
  consumables:["dream_extract"],
};

export const getItem = (id) => ITEMS[id] || null;

export const STARTING_ITEMS = {
  acedia:      "worn_rosary",
  brought_back: null,
  chosen:      null,
  occultist:   "grimoire_fragment",
  guilty:      "false_papers",
  dimensional: "map_nowhere",
  cult_leader: "contact_list",
  researcher:  "research_dossier",
  death_wish:  "battle_weapon",
  unknown_past:"unknown_artifact",
};

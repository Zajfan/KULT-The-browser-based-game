export const ARCHONS = [
  {
    id: "astaroth", name: "Astaroth", title: "Keeper of the Labyrinth",
    domain: "Death and the Afterlife", glyph: "☽", icon: "⚰",
    description: `Astaroth administers what comes after. Every soul that passes through the veil of death enters the domain she governs — a system of vast, impersonal efficiency designed to harvest, refine, and recirculate. She does not think of this as cruelty. She thinks of it as maintenance.

Astaroth is the most directly relevant Archon to the Awakened because her domain encompasses the Labyrinth — the true destination of all human souls — and because her servants, the Nepharites, are deployed specifically to manage souls who have become aware of the process. An Awakened individual who dies while aware represents a processing liability. Her interest in you is administrative, not personal. This is not comforting.`,
    servants: ["Nepharites", "Azghouls", "Harvester constructs"],
    goals: "Orderly soul processing. Prevention of Awakened interference with the Labyrinth.",
    weakness: "Her administrative orientation means she can sometimes be negotiated with — she prefers compliance to conflict.",
    playerNote: "Characters with high Insight who die risk being processed with full awareness intact. Her agents are among the most active in the city.",
    standingThreshold: 50,
  },
  {
    id: "haagenti", name: "Haagenti", title: "The Alchemist",
    domain: "The Body and Transformation", glyph: "⚗", icon: "🧬",
    description: `Haagenti's domain is flesh — its fragility, its malleability, and its tendency to rot. He governs the Illusion's grip on physical form: the conviction that the body is the self, that its destruction is the end of everything, that its pleasure and pain are primary motivators.

The fear of death is Haagenti's primary tool. He does not create violence — he creates the terror of being hurt that makes humans manageable. His servants operate in hospitals, in chemical dependency, in every institution that sells the body's permanence or its improvement. The medical establishment is deeply infiltrated.`,
    servants: ["Medical establishment agents", "Body-horror manifestations", "Addiction constructs"],
    goals: "Maintain humanity's terror of physical damage and death as primary behavioral controls.",
    weakness: "Characters who have genuinely confronted their own mortality lose some purchase for his fear-based tools.",
    playerNote: "Hospital interactions may involve his agents. High-risk combat situations can attract his attention.",
    standingThreshold: 60,
  },
  {
    id: "malphas", name: "Malphas", title: "The Master Builder",
    domain: "Architecture and the City", glyph: "🏛", icon: "🏗",
    description: `The city itself is Malphas's work. Not metaphorically — the geometry of urban space, the logic of streets and corridors and rooms, the way built environment shapes movement and behavior and thought. The labyrinthine quality of the Labyrinth reflects his design sensibility.

Malphas ensures that the physical city functions as a cognitive prison supplementing the Illusion. Buildings are positioned to disrupt community formation. The anomalies Awakened find in city architecture — buildings larger inside than outside, streets that connect where they should not — are features of a deeper design.`,
    servants: ["Urban planning authorities", "Construction crews", "Architectural constructs"],
    goals: "The city as optimized behavioral management system. Prevent unauthorized modifications to urban space.",
    weakness: "His servants cannot easily enter certain geometrically irregular spaces — old buildings predating his redesigns.",
    playerNote: "Location research and archive work sometimes uncovers his city modifications. The Archives are his most contested territory.",
    standingThreshold: 70,
  },
  {
    id: "vine", name: "Vine", title: "The Binder",
    domain: "Law, Order, and Confinement", glyph: "⚖", icon: "⛓",
    description: `Vine governs the systems of social control — law, incarceration, bureaucracy, the formal structures through which societies enforce conformity. She does not care about justice. She cares about compliance, and she has found that humans will enforce their own compliance given sufficiently complex rule systems.

The legal system, in every jurisdiction, contains Vine's fingerprints. The structures that make challenge to authority difficult, expensive, and time-consuming are her design. Prison systems are particularly important to her — not for punishment, but because incarceration is the most efficient form of Illusion reinforcement available at scale.`,
    servants: ["Law enforcement (infiltrated)", "Judicial constructs", "Bureaucratic systems"],
    goals: "Maintain compliance through formal authority structures. Criminalize and isolate the Awakened.",
    weakness: "Her authority dissolves in genuinely lawless spaces — certain underground networks her systems have never reached.",
    playerNote: "Criminal activity increases Vine attention. Sufficiently visible Awakening draws her legal enforcement agents.",
    standingThreshold: 60,
  },
  {
    id: "morax", name: "Morax", title: "The Scholar",
    domain: "Knowledge and Its Control", glyph: "📜", icon: "📚",
    description: `Morax controls what humans know and, more importantly, what they believe they know. His domain encompasses universities, libraries, scientific institutions, the media — every system through which humans acquire understanding of their world. He does not suppress knowledge directly. He curates it, frames it, ensures that the most dangerous knowledge is inaccessible to those who might act on it.

The Archives in the city contain evidence of his work — redacted documents, restructured indices, disappeared research. He is the Archon most directly opposed to the Awakened Circle's research activities.`,
    servants: ["Academic authorities", "Media institutions", "Archive controllers"],
    goals: "Prevent dangerous knowledge from reaching minds capable of acting on it. Discredit the Awakened through epistemological control.",
    weakness: "Physical documents predate his information systems. Libraries older than a century contain material he cannot easily alter.",
    playerNote: "Archive research and lore investigation draw Morax attention at high Insight levels. Sister Voss operates in direct opposition to his agents.",
    standingThreshold: 50,
  },
  {
    id: "focalor", name: "Focalor", title: "Prince of Tears",
    domain: "Grief and Isolation", glyph: "💧", icon: "🕯",
    description: `Focalor's domain is sorrow — specifically the sorrow that isolates. He cultivates the particular human tendency to experience grief as something that cannot be shared, that separates the griever from community. He ensures that the moments when humans most need connection are precisely the moments when the Illusion makes connection impossible.

Focalor is perhaps the subtlest Archon. His work does not look like oppression. It looks like the ordinary tragedy of human loss. Isolated humans are compliant humans.`,
    servants: ["Melancholy constructs", "Social disruption agents", "Entities that feed on longing"],
    goals: "Cultivate productive isolation. Prevent the formation of genuine community among the Awakened.",
    weakness: "Characters with strong Passions — people they love, causes they believe in — are resistant to his tools.",
    playerNote: "Stability loss can trigger Focalor-adjacent events. Characters without active Passions are more vulnerable.",
    standingThreshold: 40,
  },
  {
    id: "leraje", name: "Leraje", title: "The Archer",
    domain: "Predation and Pursuit", glyph: "🏹", icon: "🗡",
    description: `Leraje governs the predator-prey dynamic as a social control mechanism. Her insight is that humans who live in fear of each other are easier to manage than humans who live in fear of the system. She ensures that violence within human communities is directed laterally rather than upward.

Street crime, gang violence, domestic violence — all of this falls under Leraje's administration. Not because she creates it, but because she ensures it persists and that its causes remain invisible. She is also responsible for the Lictor units assigned to track Awakened individuals.`,
    servants: ["Lictor tracking units", "Violence-amplification constructs", "Criminal network infiltrators"],
    goals: "Maintain productive levels of lateral violence. Track and contain Awakened who become mobile threats.",
    weakness: "Her agents prefer ambush and surveillance to direct confrontation. Drawing them into open conflict reveals them.",
    playerNote: "High criminal activity and combat draw her attention. Lictors assigned to tracking characters report to her administration.",
    standingThreshold: 55,
  },
  {
    id: "vepar", name: "Vepar", title: "Duchess of Sorrows",
    domain: "Emotion and Its Management", glyph: "🌊", icon: "🌀",
    description: `Vepar governs the emotional register — specifically the parts of human emotional experience that the Illusion cannot simply suppress. Grief, love, ecstasy, terror: these are too fundamental to eliminate, so Vepar manages them. Her domain ensures that the most powerful human emotions are channeled into consumption, into spectacle, into private experience — anything except collective action.

Love becomes possession. Grief becomes product. Ecstasy becomes commodity. She does not hate human feeling. She processes it, refines it, redirects it into forms that serve the prison's purposes.`,
    servants: ["Entertainment industry agents", "Emotional harvesting constructs", "Parasitic entities"],
    goals: "Channel powerful human emotions into productive forms. Prevent collective emotional experience from becoming political.",
    weakness: "Raw, unmediated emotional experience — especially shared grief or shared love — disrupts her processing systems.",
    playerNote: "Passions can become her targets. Characters with strong emotional lives may draw parasitic entities.",
    standingThreshold: 45,
  },
  {
    id: "sabnock", name: "Sabnock", title: "The Warlord",
    domain: "Conflict and War", glyph: "⚔", icon: "⚔",
    description: `Sabnock governs large-scale organized violence — war, civil conflict, ethnic and political polarization. His understanding of human nature is tactical: divide, exhaust, redirect. Populations perpetually engaged in conflict with each other have neither the time nor the energy to recognize their common jailers.

At the city level, his agents ensure that the various communities that might form effective opposition to the Illusion remain in permanent low-grade conflict with each other.`,
    servants: ["Political agents", "Conflict amplifiers", "Extremist organization infiltrators"],
    goals: "Maintain productive population-level conflict. Prevent ideological consensus that might threaten the Illusion.",
    weakness: "Small scale — individual relationships, specific communities — is below his operational resolution.",
    playerNote: "Faction conflicts in the city partially trace to his manipulation. Crossing multiple factions simultaneously draws his attention.",
    standingThreshold: 70,
  },
  {
    id: "marchosias", name: "Marchosias", title: "The She-Wolf",
    domain: "Desire and Hunger", glyph: "🐺", icon: "🩸",
    description: `Marchosias governs desire in its most fundamental forms — hunger, lust, the drive to possess and consume. Her domain is the one humans most often mistake for freedom, because it feels like the expression of authentic self. It is not. Desire that does not threaten the prison is desire that serves it.

The consumer economy, addiction systems of every kind — all of these are her province. She ensures that the appetite humans mistake for autonomy is in fact a leash. The wanting is real. The direction of the wanting is managed.`,
    servants: ["Addiction constructs", "Consumer system agents", "Desire-parasites"],
    goals: "Maintain desire as a behavioral control system. Ensure appetite is directed toward consumption rather than liberation.",
    weakness: "Genuine renunciation — not suppression but actual release of attachment — disrupts her hold.",
    playerNote: "The Black Market exists partly within her domain. High consumption of substances or artifacts can draw her interest.",
    standingThreshold: 40,
  },
];

export const getArchon = (id) => ARCHONS.find(a => a.id === id);
export const getAllArchons = () => ARCHONS;

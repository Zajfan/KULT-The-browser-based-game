# KULT: The Browser-Based Game — Game Design Document v0.1
**Genre:** Dark Horror PBBG / Narrative RPG
**Tone:** Psychological horror. Cosmic dread. The terror is bureaucratic, not jump-scare. The monsters are middle management.
**Based on:** KULT: Divinity Lost (tabletop RPG by Helmgast) — adapted for browser play
**Inspiration:** Torn City (core PBBG loop), Unknown Armies (escalating weirdness), Disco Elysium (dialogue as gameplay)

---

## 🩸 The Premise

> *You live in a city. You have a job — or you had one. You have a name. You have a routine.*
>
> *Something happened. It could have been small: a dream that wouldn't leave, a stranger who knew your name, a door in a building you walk past every day that shouldn't exist.*
>
> *It doesn't matter what it was. What matters is that you started looking. And now you can see the cracks in the world. The Illusion is a prison, and you just realized you're in one.*
>
> *Welcome to Awakening. Most people who get this far either go back to sleep — or disappear.*

### The World
Reality is a fabricated prison called the Illusion, constructed by the Demiurge and maintained by its administrators: the Archons. Human souls are a resource. When you die, you go to the Labyrinth — an infinite processing facility where memories are stripped and souls are recycled. The Demiurge is gone (disappeared, destroyed, or hiding). The Illusion runs on automated systems. The Archons maintain it out of purpose, fear, or inertia.

Some humans have begun to see through the Illusion. These are the Awakened. The Archons use Lictors to locate and manage them — preferring reclassification (hospitalization, criminal records, discrediting) over violence, but not ruling it out.

You are Awakening. The question is how far you go.

---

## 🧠 Core Resources

| Resource | Max | Regen | Purpose |
|---|---|---|---|
| **Stamina** | 100 | +5/30min | Actions, training, travel |
| **Willpower** | 50 | +2/10min | Rituals, dark abilities, resisting Archon influence |
| **Health** | 100 | +3/30min | Combat, encounters |
| **Insight** | 0–10 | Earned permanently | Core progression — how much of the Illusion you can see |
| **Stability** | 0–100 | Decays with Insight | Sanity analogue — affects what you can perceive and survive |
| **Shadow** | 0–100 | Builds with dark choices | Tracks corruption — opens dark power, closes escape routes |

### Insight System
Insight is the game's fundamental progression axis — not levels, not XP. It is earned through specific story choices, ritual completion, and lore discovery. It cannot be lost (only the consequences of what you've seen).

**Insight tiers unlock:**
- **Insight 0:** You suspect something is wrong. Tier 1 crimes, basic training.
- **Insight 1:** You've seen a Lictor. The Labyrinth is real. New NPCs become visible.
- **Insight 2:** You know about the Death Angels. Rituals become available.
- **Insight 3:** You've spoken with something non-human. Dimensional travel is accessible.
- **Insight 5:** The Archons know who you are. Heat mechanics fully active.
- **Insight 7:** You've been to the Labyrinth. Or something from there has been to you.
- **Insight 10:** The Illusion is almost transparent. You can perceive things that perceive you back.

### Stability
Stability decays as Insight increases — the more you see, the harder it is to function in the Illusion. High Stability means you present as normal; low Stability means Lictors clock you faster, civilians react badly to you, and certain Illusion-dependent resources become inaccessible. At 0 Stability, a mandatory Breakdown event fires.

Low Stability does not make you weaker. It makes you *different*. Some rituals and dark abilities require low Stability to function.

### Shadow
Every choice to use forbidden power, harm innocent people, or bargain with Death Angels increases Shadow. At high Shadow:
- Dark Abilities cost less Willpower
- The Veil Path (full Awakening through corruption) becomes accessible
- Redemption paths close progressively
- Other Awakened treat you with increasing caution

At Shadow 100: the **Consumed** ending triggers — you've been claimed by whatever you bargained with.

---

## 📊 Character Attributes

| Attribute | Governs |
|---|---|
| **Fortitude** | Physical endurance, health recovery, resisting damage |
| **Reflexes** | Combat initiative, escape chance, avoiding detection |
| **Willpower** | Ritual potency, resisting mental influence, dark abilities |
| **Perception** | Detecting Lictors, reading Illusion cracks, NPC insight |
| **Influence** | Manipulation, recruiting contacts, social operations |
| **Reason** | Researching lore, crafting, understanding Archon mechanics |

At character creation, players choose a **Dark Secret** — a pre-existing entanglement with the Illusion that sets starting Insight, Shadow, and which Archon is already aware of them.

---

## 🕯️ Dark Secrets (Character Origins)

| Secret | Starting Insight | Starting Shadow | Starting Archon attention |
|---|---|---|---|
| **Occultist** | 1 | 15 | Malkuth (Isolation) |
| **Accosted by Entity** | 2 | 5 | Geburah (Abuse of Power) |
| **Death Experience** | 1 | 10 | Chesed (Death) |
| **Aware of the Illusion** | 0 | 0 | None (yet) |
| **Ghoul** | 2 | 30 | Chesed (Death) |
| **Possessed** | 1 | 25 | Binah (Lust) |
| **Bound** | 3 | 20 | Binah / Geburah |
| **Prophet** | 2 | 10 | Netzach (Fear) |

---

## 🏛️ The Archons (Antagonist Structure)

Ten administrative entities that maintain the Illusion. Each controls a domain of human experience:

| Archon | Domain | Signature Method |
|---|---|---|
| **Kether** | Conformity | Social pressure, identity erasure |
| **Chesed** | Death | Labyrinth processing, mortality threats |
| **Geburah** | Abuse of Power | Authority, legal systems, police |
| **Netzach** | Fear | Paranoia, phobia amplification |
| **Hod** | Self-Deception | False memory, gaslighting |
| **Malkuth** | Isolation | Social severance, loneliness |
| **Binah** | Lust | Addiction, desire weaponization |
| **Chokmah** | Community | Mob mentality, collective punishment |
| **Yesod** | Dreams | Nightmare injection, sleep disruption |
| **Tiphereth** | Secrets | Information suppression, controlled revelation |

As player Insight grows, specific Archons take interest and escalate pressure:
- **Low interest:** Background Lictor observation
- **Active interest:** Operations become harder, NPC contacts get warnings
- **Full attention:** Raid events, institutional interference, Archon-aligned enemies

---

## ⚡ Dark Abilities
Awakened can develop supernatural capabilities that exist outside the Illusion. These cost Willpower and often carry Shadow costs.

**Passions** — Emotional drives that fuel ability. Each character has 2-3 that amplify specific ability types.

**Example Dark Abilities (by Insight requirement):**
- **Insight 1:** Sense Truth (detect lies), Accelerated Healing, Empathy (read surface emotions)
- **Insight 2:** Suggestion (plant thoughts), Telekinesis (minor), See Through Shadows (detect invisible entities)
- **Insight 3:** Dimensional Step (short teleport), Necromancy (contact the recently dead), Mind Reading
- **Insight 5:** Astral Projection, Possess Object, Tear the Veil (open a dimensional rift)
- **Insight 7:** Reshape (alter physical matter), Commune with Death Angel, Void Walk (enter Labyrinth willingly)
- **Insight 10:** Become (final transformation — choose what you become)

---

## 🕯️ Rituals
Structured magical workings that require preparation, specific conditions, and cost Willpower. Unlike Dark Abilities (instant, personal), Rituals take time and produce larger effects.

**Sample Rituals:**
- **Rite of the Veil** (Insight 2, WP 10) — Temporarily drop the Illusion for a small area. All beings in range perceive reality as it is for 10 minutes. Civilians may panic.
- **Binding of Name** (Insight 3, WP 15) — Bind an entity to a location or a task using its true name. Requires knowing the name.
- **Conversation with the Dead** (Insight 2, WP 8) — Speak with someone recently deceased. They remember their last moments.
- **Lure of the Labyrinth** (Insight 5, WP 25) — Draw a soul from the Labyrinth temporarily. High Shadow cost.
- **Counterfeit Soul** (Insight 4, WP 20) — Create a false identity that tricks Lictor detection for 48 hours.

---

## 🌆 The City — Locations

| Location | Vibe | Available |
|---|---|---|
| **The Apartment** | Your base. Barely. | Always |
| **The Streets** | Movement, observation, low-level ops | Insight 0+ |
| **Purgatory (club)** | Neutral ground. Awakened gather here. | Insight 1+ |
| **The Archive** | Research into Archon history, entity lore | Insight 1+ |
| **The Underpass** | Black market, fixer contacts, dangerous | Insight 1+ |
| **St. Eligius Hospital** | Healing, NPC medical contacts, Lictor interest | Always |
| **The University** | Reason training, access to occult texts | Insight 0+ |
| **The Corporate District** | Archon-adjacent infrastructure. High Lictor density | Insight 2+ |
| **The Tear** | A location where the Illusion has failed entirely | Insight 4+ |
| **The Labyrinth (entry)** | The afterlife. Accessible alive, briefly. | Insight 7+ |

---

## 🧑‍🤝‍🧑 NPC Factions & Contacts

### Awakened Groups

| Group | Philosophy | Relationship to Player |
|---|---|---|
| **The Awakened (general)** | Survive, understand, resist | Potential allies, rivals, sources |
| **The Cult of Death** | Embrace the Labyrinth — it's honest | Unsettling but not hostile |
| **The Gatekeepers** | Control who Awakens. Strictly. | Antagonistic if you spread knowledge |
| **The Forgotten** | Formerly Awakened, memory stripped by Archons | Tragic. Clue source. |

### Individual Contacts (unlocked via Insight and quests)

| Contact | Role | Trust Currency |
|---|---|---|
| **The Fixer** | Gets things. Knows people. Doesn't ask. | Scrip + completing jobs |
| **The Librarian** | Ancient texts, entity names, ritual components | Insight artifacts, rare lore |
| **The Detective** | Knows the mundane side of supernatural crimes | Favors + information |
| **The Priest** | Believes in God. Wrong about which one. Useful anyway. | Goodwill, discretion |
| **The Artist** | Perceives the Illusion differently. Maps it. | Creative freedom, not being judged |
| **The Entity** | Not human. Not hostile. For now. | Unknown. Evolving. |

---

## 📋 Operations

Operations replace "crimes" in the KULT context. They are things you do in the city that carry risk and return resources, Insight, or story progress.

### Tier 1 — Street Level (Insight 0)
*The Illusion is mostly intact. You're just pushing against it.*
- Shadow a target | Perception | Low risk
- Acquire occult materials (market) | Reflexes | Low risk
- Research an entity | Reason | No risk, time cost
- Plant listening device | Reflexes/Reason | Medium risk
- Access sealed records | Reason | Medium risk

### Tier 2 — Veil Thin (Insight 1-2)
*You've started doing things that don't fit into normal explanations.*
- Enter a Lictor-watched building | Ghost | High risk
- Extract a contact from Archon attention | Influence | High risk
- Perform a ritual in public | Willpower | Extreme risk
- Intercept entity communication | Reason + Perception | Medium risk

### Tier 3 — Beyond the Illusion (Insight 3+)
*The things you're doing now don't have categories in the normal world.*
- Negotiate with a Nepharite | Willpower + Influence | Extreme risk + Shadow
- Enter the Labyrinth (and return) | Willpower | Near-fatal risk
- Steal a soul from the Labyrinth | Willpower + Shadow | Endgame
- Bind a Death Angel | Insight 7+ | Theoretical

---

## 🏁 Endings

KULT has no single ending. Player choices throughout create trajectory toward one of several conclusions:

| Ending | Requirements | Description |
|---|---|---|
| **Ascension** | Insight 10, Shadow < 20 | You understand reality completely. You choose to leave the Illusion entirely. |
| **Liberation** | Insight 10, Stability intact, specific choices | You find a way to expose the Illusion publicly. The Archons' reaction is the point. |
| **The Veil Path** | Shadow 80+, Insight 7+ | Full corruption. You've been claimed. You are now something the Illusion employs. |
| **The Consumed** | Shadow 100 | You bargained away too much. |
| **The Forgotten** | Stability 0, no recovery | The Archons stripped you. You are no longer Awakened. |
| **The Ghost** | Insight 5+, survive without Archon resolution | You go underground. You survive. It's enough. |

---

## 📅 Roadmap

### v0.1 ✅ Foundation
- Title screen, character creation with Dark Secrets
- Core resource system (Stamina, Willpower, Health, Insight, Stability, Shadow)
- Tier 1 operations, basic training
- Location travel system
- Insight 0-1 content accessible
- Purgatory as NPC hub (Insight 1)
- Lore Codex (unlocks by Insight)

### v0.2 — The Awakening Arc (current)
- [ ] Insight 2 unlocks — Rituals live (3 rituals available)
- [ ] Dark Abilities (Insight 1-2 tier)
- [ ] 3 major NPC contacts with trust-based questlines
- [ ] Archon attention system (background mechanics)
- [ ] Stability system — Breakdown events
- [ ] The Archive location live
- [ ] Death Angel lore unlocks at Insight 2
- [ ] Shadow consequences (cosmetic + NPC reactions)

### v0.3 — The Pressure
- [ ] Insight 3-4 content
- [ ] Lictor encounter system (investigation, evasion, confrontation)
- [ ] Dimensional travel (The Tear location)
- [ ] Ritual system full implementation (8+ rituals)
- [ ] Dark Abilities (Insight 3-4 tier)
- [ ] NPC faction dynamics (Gatekeepers vs. Awakened)
- [ ] Archon direct manifestation events

### v0.4 — The Labyrinth
- [ ] Insight 5-7 content
- [ ] Labyrinth access — unique location with special mechanics
- [ ] Nepharite encounters
- [ ] Full Shadow consequence tree (closing options, opening dark paths)
- [ ] Endgame routing — which ending you're heading toward becomes visible

### v0.5 — Endings
- [ ] All 6 endings fully implemented
- [ ] Insight 8-10 content
- [ ] Death Angel interaction (Insight 7+)
- [ ] NG+ with retained Insight — different starting perception of the world

### v0.6 — Multiplayer
- [ ] Other Awakened visible in shared locations
- [ ] Purgatory as real-time social hub
- [ ] Faction politics between player groups
- [ ] Collaborative rituals (require multiple players)
- [ ] PvP: Archon-aligned player vs. Awakened

# KULT: City of Chains

> *The Illusion holds. Until it doesn't.*

A full-featured browser-based RPG inspired by **KULT: Divinity Lost** by Helmgast AB, built in the style of TORN City. Single-player, AI-powered narrative, persistent save system.

## Features

- **10 Dark Secrets** — character backgrounds that shape your build and story
- **2d10 KULT dice system** — Complete / Partial / Failure outcomes
- **11 Locations** — from the Residential District to the Labyrinth (gated by Insight)
- **8 Crimes** — tiered criminal activities with Nerve costs and risk levels
- **7 Rituals** — occult rites that cost Stability and unlock with Insight
- **10 Enemy types** — mundane and supernatural, with loot tables
- **5 Factions** — Archons, Death Angels, Awakened Circle, Ghost Council, Unaligned
- **Full inventory system** — weapons, armor, consumables, artifacts
- **AP / Nerve / Stability / Insight / Wounds** resource systems
- **AI-powered narrative** via Anthropic Claude API
- **localStorage auto-save**

## Stack

React 18 + Vite · CSS Modules · Anthropic Claude API · localStorage

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
```

## Structure

```
src/
  components/     # UI: TitleScreen, CharacterCreation, GameLayout, panels/
  data/           # Game data: darkSecrets, locations, items, enemies, factions, crimes, rituals
  hooks/          # useGameState (master state), useClaude (AI narrative)
  utils/          # dice.js, combat.js, saveLoad.js
  styles/         # global.css (CSS variables + gothic theme)
```

---

*Fan-made adaptation. Based on KULT: Divinity Lost by Helmgast AB. Not affiliated.*

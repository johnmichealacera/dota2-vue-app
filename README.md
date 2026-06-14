# Dota Mate

A Vue 3 companion app for exploring Dota 2 meta, heroes, pro teams, players, matches, and tournaments — powered by a Rust backend that proxies [OpenDota](https://www.opendota.com/).

Live demo: [dota2-companion.johnmichealacera.com](https://dota2-companion.johnmichealacera.com)

## Design — Arcane Chronicle

The UI uses a dark fantasy “Arcane Chronicle” visual system:

- **Typography:** [Cinzel](https://fonts.google.com/specimen/Cinzel) for headings and rune dividers · [Barlow](https://fonts.google.com/specimen/Barlow) / Barlow Condensed for UI labels and stats
- **Surfaces:** glassmorphism panels (`glass-panel`) on a deep navy canvas with ambient radial glows and film grain
- **Palette:** gold accent (`#e8a838`), parchment text (`#ede8d8`), attribute colours for STR / AGI / INT / Universal heroes
- **Patterns:** tier badges, win-rate bars, skeleton loaders, dashed empty states, breadcrumb navigation on detail pages

CSS tokens live in `src/assets/tailwind.css` (`--accent-bright`, `--agi`, `--crimson`, etc.).

## Features

| Area | Route | Highlights |
|---|---|---|
| **Meta hub** | `/` | Tier list (S–D), bracket tabs (All / Legend+ / Divine+ / Immortal), live games ticker, all-time records wall |
| **Heroes** | `/heroes` | Search, attribute filters, sort by name / attribute / win rate / pick rate |
| **Hero detail** | `/item/:id/hero` | Base stats, pro circuit stats, best item path, benchmarks, matchups, top players |
| **Teams** | `/teams` | Pro team grid with ratings and records |
| **Team detail** | `/item/:id/team` | Roster, hero pool, recent matches, team matchups |
| **Players** | `/players` | Pro player directory |
| **Player profile** | `/player/:id` | Rank medal, recent matches, most-played heroes |
| **Matches** | `/matches` | Pro match feed |
| **Match scoreboard** | `/match/:id` | Full 10-player scoreboard with items and stats |
| **Leagues** | `/leagues` | Tournament browser |
| **League detail** | `/league/:id` | Teams and match results |

**Paused / hidden:** player search UI (OpenDota `/search` is too slow) · rank history sparkline (OpenDota ratings API returns empty data).

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Vue 3 + Vue Router |
| Bundler | Webpack 5 |
| Styling | Tailwind CSS v3 + custom CSS variables |
| HTTP | Axios |
| Backend | Rust / Axum API ([`dota-api-rust-backend`](../dota-api-rust-backend)) proxying OpenDota |

## Getting Started

### 1. Backend

Clone and run the Rust API (default port `8000`):

```bash
cd dota-api-rust-backend
cargo run
```

Or point the frontend at the deployed instance on Render.

### 2. Frontend

```bash
git clone https://github.com/johnmichealacera/dota2-vue-app.git
cd dota2-vue-app
npm install
```

Create `.env` at the project root:

```env
VUE_APP_DOTA_BACKEND_API=http://localhost:8000
```

Start the dev server:

```bash
npm run serve
```

Open [http://localhost:8080](http://localhost:8080).

### Scripts

| Command | Description |
|---|---|
| `npm run serve` | Dev server (Vue CLI) |
| `npm run dev` | Webpack dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VUE_APP_DOTA_BACKEND_API` | Yes | Base URL of the Rust backend (no trailing slash needed) |

## Backend API (consumed by this app)

The Rust backend exposes normalized JSON endpoints such as:

```
/heroes  /hero-stats  /hero/:id  /hero-matchup/:id  /hero-benchmarks/:id
/hero-rankings/:id  /item-timings/:id  /lane-roles/:id
/pro-teams  /team/:id  /team-matchup/:id  /team-players/:id  /team-heroes/:id
/pro-players  /player/:id  /player-recent-matches/:id  /player-heroes/:id
/pro-matches  /match/:id
/leagues  /league-teams/:id  /league-matches/:id
/records/:field  /live
```

`GET /hero-stats` accepts an optional `?bracket=` query (`all`, `legend`, `divine`, `immortal`; omit for pro circuit stats).

## Roadmap & Audit

Feature backlog and OpenDota endpoint mapping: [`AUDIT.md`](./AUDIT.md)

Project todos (Notion): [Dota Mate — Todos](https://app.notion.com/p/493d9d9860114780a44955a3cfd9001c)

## License

MIT

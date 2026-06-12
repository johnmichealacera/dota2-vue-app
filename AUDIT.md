# Dota Mate — Feature Audit & Roadmap
> Generated: 2026-06-12 | Stack: Vue 3 · Webpack · Tailwind CSS v3 · Rust backend (OpenDota proxy)

---

## 1. Current State

### What Exists Today

| Route | Status | What It Shows |
|---|---|---|
| `/` | ✅ Working | Paginated hero grid (30/page). Name, image, hover stats (STR/AGI/INT), attack type badge. |
| `/teams` | ✅ Working | Paginated pro team grid (30/page). Name, image, hover stats (Rating/Wins/Losses). |
| `/players` | ❌ Broken | Fetches `/pro-players` from the backend but **renders nothing** — the template is a stub. |
| `/item/:id/hero` | ✅ Working | Hero detail: portrait, 7 base stats, matchup grid with win-rate bars and pagination. |
| `/item/:id/team` | ✅ Working | Team detail: logo, record (W/L/Rating), win-rate bar, matchup grid. |

### API Endpoints Currently Used

| Endpoint | Data Used | Data Fetched But Wasted |
|---|---|---|
| `GET /heroes` | id, name, img, attackType, hoverFirst/Second/Third | primaryAttr, roles (not exposed by backend response shape) |
| `GET /hero/:id` | name, img, attackType, health, baseMana, baseArmor, moveSpeed, attackRange, baseMr | baseStr, baseAgi, baseInt, legs, roles array |
| `GET /hero-matchup/:id` | name, img, winRate, gamesPlayed | wins, losses raw counts |
| `GET /pro-teams` | id, name, img, tag, hoverFirst/Second/Third | lastMatchTime |
| `GET /team/:id` | name, img, tag, rating, wins, losses | lastMatchTime |
| `GET /team-matchup/:id` | name, img, winRate, gamesPlayed | — |
| `GET /pro-players` | **nothing rendered** | Everything |

### Critical UX Gaps

- **No search** — finding a specific hero or team requires manual pagination through 100+ cards.
- **No filtering** — can't narrow heroes by attribute type (STR/AGI/INT/Universal) or role.
- **No sorting** — no alphabetical, win-rate, or stat-based ordering.
- **Players page is a dead link** — visible in the router but the UI renders an empty page.
- **Mobile hover is inaccessible** — stat chips only appear on `:hover`, invisible on touch.
- **Zero error states** — API failures are swallowed silently; users see a blank grid.
- **No breadcrumbs** — navigating back from a detail page requires the browser back button.
- **No related content** — hero detail page has no "similar heroes" or "team uses this hero" cross-link.

---

## 2. OpenDota API — Full Endpoint Inventory

Base URL: `https://api.opendota.com/api`  
Free tier: 50 000 calls/month · 60 req/min. Add `?api_key=` for higher limits.

### Heroes
| Endpoint | Key Data |
|---|---|
| `GET /heroStats` | Pick/ban rates, win rates, KDA, GPM, XPM across **all public matches** — refreshed daily |
| `GET /heroes/{id}/matchups` | Games played + wins against every other hero |
| `GET /heroes/{id}/benchmarks` | Percentile performance curves: GPM, XPM, kills/min, last-hits/min, hero damage/min, healing/min, tower damage |
| `GET /rankings/{hero_id}` | Top-rated players for a specific hero with their rank tier |

### Players
| Endpoint | Key Data |
|---|---|
| `GET /players/{account_id}` | Profile: Steam name, avatar, rank tier, MMR estimate, solo/party MMR |
| `GET /players/{account_id}/recentMatches` | Last 20 matches: hero, K/D/A, duration, result, timestamp |
| `GET /players/{account_id}/heroes` | Per-hero stats: games, wins, last played, KDA, GPM, XPM |
| `GET /players/{account_id}/ratings` | MMR history timeline |
| `GET /proPlayers` | All pro players: name, team_id, country, role, fantasy role |
| `GET /search?q=` | Player name search → returns array of matching profiles |

### Matches
| Endpoint | Key Data |
|---|---|
| `GET /proMatches` | Recent pro matches: match_id, league, teams, duration, radiant_win, start_time |
| `GET /matches/{match_id}` | Full scoreboard: all 10 players, items built, ability upgrades, gold/XP graphs, objectives timeline |
| `GET /live` | Top ongoing high-MMR games with real-time hero picks |

### Teams
| Endpoint | Key Data |
|---|---|
| `GET /teams/{id}/players` | Current + past roster with pro player links |
| `GET /teams/{id}/matches` | Full match history for a team |
| `GET /teams/{id}/heroes` | Hero pool: picks, wins, games per hero |

### Leagues & Tournaments
| Endpoint | Key Data |
|---|---|
| `GET /leagues` | All tournaments: name, tier (premium/professional/amateur), prize pool indicator |
| `GET /leagues/{id}/matches` | Match results for a tournament |
| `GET /leagues/{id}/teams` | Teams in a tournament |

### Meta & Analytics
| Endpoint | Key Data |
|---|---|
| `GET /heroStats` | Hero tier list data: pick/ban/win rates across all brackets |
| `GET /distributions` | MMR distribution by region — bracket breakdown |
| `GET /records/{field}` | All-time records: highest kills, GPM, XPM, longest game, etc. |
| `GET /scenarios/itemTimings` | Which items at which time correlate to wins for each hero |
| `GET /scenarios/laneRoles` | Win rates by hero + lane role |
| `GET /constants/{resource}` | Static game data: items, abilities, patch notes, game modes |

---

## 3. Feature Roadmap — Ranked by Retention Impact

Priority key: 🔴 High · 🟡 Medium · 🟢 Nice-to-have

---

### 🔴 P1 — Fix & Complete What's Broken

#### Fix the Players Page
**Why:** It's a nav link that leads to a blank page — the single fastest trust-destroyer.  
**Endpoints:** `GET /proPlayers`  
**What to build:**
- Grid of pro player cards: avatar, name, team logo, country flag, fantasy role badge.
- Each card links to `/player/:account_id`.
- Uses the existing `ImageCard` pattern — minimal new work.

#### Search Bar (Global)
**Why:** With 100+ heroes and 100+ teams users need fast lookup. No search = high bounce.  
**Endpoints:** `GET /search?q=` (players), client-side filter on already-loaded heroes/teams.  
**What to build:**
- Sticky search input above the card grid on Heroes and Teams pages.
- Client-side instant filter as user types (no extra API call for heroes/teams).
- Separate `/search` page for player name lookup hitting the OpenDota search endpoint.

#### Hero Attribute Filter Tabs
**Why:** The first thing any Dota player wants to do is browse by STR/AGI/INT/Universal. Absence of this feels broken.  
**Endpoints:** No new endpoint needed — data already exists in `heroStats`.  
**What to build:**
- Four filter tabs below the hero banner: All / Strength / Agility / Intelligence / Universal.
- Icons for each attribute (the classic Dota icons via SVG or Dota-CDN).
- Client-side filter on the loaded page, with count badge on each tab.

---

### 🔴 P2 — Hero Detail Page Overhaul

#### Hero Stats & Benchmarks
**Why:** The current hero detail shows 7 static numbers. Percentile benchmarks instantly communicate how good a hero is relative to the field — hugely engaging for players who know the game.  
**Endpoints:** `GET /heroStats`, `GET /heroes/{id}/benchmarks`  
**What to add to the existing `/item/:id/hero` page:**
- **Attribute base stats** with animated count-up (baseStr, baseAgi, baseInt).
- **Benchmark section**: horizontal percentile bar for GPM, XPM, Kills/min, Last-hits/min, Hero Damage/min. "You need X GPM to be in the 90th percentile on this hero."
- **Pick/Ban stats**: pick rate %, ban rate %, win rate % in a 3-column stat strip at the top.

#### Hero Role Tags
**Why:** Knowing if a hero is a Carry/Support/Jungler/Initiator is basic context missing everywhere.  
**Endpoints:** `GET /heroStats` (includes roles array)  
**What to build:**
- Role tag chips below the hero name: `Carry` `Escape` `Nuker` etc.
- Link each role chip to filter the hero grid by that role.

#### Top Players for Hero
**Why:** Shows who the best players of this hero are — drives curiosity and exploration into the Players section.  
**Endpoint:** `GET /rankings/{hero_id}`  
**What to build:**
- Compact "Top Players" strip at the bottom of the hero detail page.
- Shows rank icon, player name, rank percentile. Click → player profile page.

---

### 🔴 P3 — Pro Matches Feed

**Why:** Live/recent match data is the highest-velocity content in any esports app — it's what brings users back daily. Without it the app is a static encyclopedia, not a living dashboard.  
**Endpoints:** `GET /proMatches`, `GET /matches/{match_id}`  
**What to build:**

**New page: `/matches` (add to nav)**
- Feed of recent pro matches: date, teams, league, duration, radiant/dire, result.
- Each row links to a match detail page.
- Filter by league or team name.

**Match Detail page: `/match/:id`**
- Two-column scoreboard (Radiant vs Dire).
- Per-player row: hero portrait, player name, K/D/A, GPM, XPM, net worth, items built.
- Match meta: league, duration, patch, game mode.

---

### 🟡 P4 — Player Profile Page

**Why:** Players love looking up their own stats or a pro player's stats. Player profiles are the stickiest content in any game tracker (see Dotabuff, Stratz).  
**Endpoints:** `GET /players/{id}`, `GET /players/{id}/recentMatches`, `GET /players/{id}/heroes`, `GET /players/{id}/ratings`  
**What to build:**

**New page: `/player/:account_id`**

- **Profile header**: avatar, name, rank medal (image from Dota CDN), total games, win rate.
- **Recent matches strip**: last 10 matches as compact rows — hero icon, result (W/L), K/D/A, duration, time ago.
- **Most played heroes table**: hero name, games, win rate, KDA, last played date.
- **MMR history chart**: simple sparkline/line chart of rating over time using raw `ratings` data.

---

### 🟡 P5 — Team Roster & Match History

**Why:** Clicking a team card and only seeing W/L/Rating is underwhelming. Showing the actual players and recent matches turns it into a proper team page.  
**Endpoints:** `GET /teams/{id}/players`, `GET /teams/{id}/matches`, `GET /teams/{id}/heroes`  
**What to add to the existing team detail page:**
- **Roster section**: current player cards with pro player names, country, role.
- **Recent matches**: last 10 team matches as compact result rows.
- **Hero pool section**: grid of top-picked heroes for the team with pick count and win rate.

---

### 🟡 P6 — Hero Tier List / Meta Page

**Why:** "What's the best hero right now?" is the #1 question every Dota player has. A tier list is highly shareable content.  
**Endpoint:** `GET /heroStats`  
**New page: `/meta`**
- Tier list layout (S/A/B/C/D rows) based on win rate + pick rate combination.
- Toggle: sort by win rate / pick rate / ban rate.
- Separate tabs: All Brackets / Legend+ / Divine+ / Immortal.
- Hero icon grid with win rate badge overlay.
- "Best heroes right now" top-3 highlight strip.

---

### 🟡 P7 — Leagues & Tournaments Browser

**Why:** Dota 2 tournament seasons drive massive viewership spikes. A tournament browser hooks viewers during active seasons.  
**Endpoints:** `GET /leagues`, `GET /leagues/{id}/teams`, `GET /leagues/{id}/matches`  
**New page: `/leagues`**
- Cards per league: name, tier badge (Premium/Professional/Amateur), active status.
- League detail page: team list + match results.

---

### 🟢 P8 — Records Wall

**Why:** All-time records are fun, shareable, and low-effort to build. "Highest GPM ever recorded: 1,337" is the kind of stat that goes on Twitter.  
**Endpoint:** `GET /records/{field}` for each interesting field.  
**New section on `/meta` or standalone `/records`**
- Grid of record cards: stat name, player name, hero name, value, match link.
- Fields: kills, deaths, assists, gold_per_min, xp_per_min, last_hits, tower_damage, hero_healing, hero_damage, duration.

---

### 🟢 P9 — Item Timing Scenarios

**Why:** Competitive Dota is deeply item-timing-driven. "Which heroes spike at 25 min Battlefury?" is a niche but highly engaged audience.  
**Endpoint:** `GET /scenarios/itemTimings`  
**New section on hero detail page:**
- "Best item path" block: show which items at which timing correlate to the highest win rate for this hero.

---

### 🟢 P10 — Live Games Ticker

**Why:** Showing that real games are happening right now creates a sense of liveness.  
**Endpoint:** `GET /live`  
**Small widget on the homepage:**
- "Live now" strip: top 3 ongoing high-MMR games with radiant vs dire hero icons, average MMR, game time.
- Auto-refreshes every 2 minutes.

---

## 4. Implementation Notes

### Backend (Rust) — Endpoints to Add
The Rust backend currently proxies a subset of OpenDota. These new endpoints need to be added to the Rust router before they can be consumed in the Vue frontend:

| New Rust Route | Proxies to | Priority |
|---|---|---|
| `GET /hero-stats` | `/heroStats` | 🔴 P2 |
| `GET /hero-benchmarks/:id` | `/heroes/:id/benchmarks` | 🔴 P2 |
| `GET /hero-rankings/:id` | `/rankings/:id` | 🔴 P2 |
| `GET /pro-matches` | `/proMatches` | 🔴 P3 |
| `GET /match/:id` | `/matches/:id` | 🔴 P3 |
| `GET /player/:id` | `/players/:id` | 🟡 P4 |
| `GET /player-recent-matches/:id` | `/players/:id/recentMatches` | 🟡 P4 |
| `GET /player-heroes/:id` | `/players/:id/heroes` | 🟡 P4 |
| `GET /team-players/:id` | `/teams/:id/players` | 🟡 P5 |
| `GET /team-heroes/:id` | `/teams/:id/heroes` | 🟡 P5 |
| `GET /leagues` | `/leagues` | 🟡 P7 |
| `GET /records/:field` | `/records/:field` | 🟢 P8 |
| `GET /live` | `/live` | 🟢 P10 |
| `GET /search?q=` | `/search?q=` | 🔴 P1 |

### Vue Frontend — New Routes to Add

```
/players           → Pro players grid (fix existing stub)
/player/:id        → Individual player profile
/matches           → Pro match feed
/match/:id         → Match scoreboard detail
/meta              → Hero tier list + records
/leagues           → Tournament browser
/search            → Player name search results
```

### New Vue Components Needed

| Component | Used In |
|---|---|
| `SearchBar.vue` | Heroes page, Teams page, global nav |
| `AttributeFilterTabs.vue` | Heroes page |
| `BenchmarkBar.vue` | Hero detail |
| `MatchRow.vue` | Matches feed, Player recent matches |
| `MatchScoreboard.vue` | Match detail |
| `PlayerCard.vue` | Players grid, Team roster |
| `PlayerProfile.vue` | Player detail page |
| `TierList.vue` | Meta page |
| `LiveTicker.vue` | Homepage widget |
| `LeagueCard.vue` | Leagues page |
| `HeroRoleTag.vue` | Hero cards, Hero detail |
| `MiniChart.vue` | MMR history sparkline |

---

## 5. Quick Wins (Can Ship This Week)

These require **no new backend endpoints** — only frontend changes:

1. **Fix Players page** — data is already fetched. Build the template using `ImageCard` pattern.
2. **Hero attribute filter** — `heroStats` is already served. Client-side filter on the loaded hero array.
3. **Role tags on hero cards** — append role data from the existing hero response (if `primaryAttr` is returned, use it).
4. **Breadcrumb nav** — "Heroes / Pudge" or "Teams / Team Spirit" on detail pages. Pure Vue Router, zero API calls.
5. **Mobile stat strip** — replace the hover-only stats with a visible row below the card name on mobile (CSS media query only).
6. **Error states** — wrap each `axios.catch` with a reactive `error` ref and render a visible message instead of swallowing it.
7. **Sort matchups** — the matchup array is already in memory; add a computed sort (win rate high→low) client-side.

---

## 6. Retention Architecture Summary

```
Day 1 visit   →  Hero/Team browse (current) ✅
Day 2 return  →  "What's new in pro matches?" → Pro Matches Feed 🔴P3
Day 3 return  →  "How am I doing vs pros?" → Player Profile lookup 🟡P4
Weekly habit  →  "What's the meta this patch?" → Hero Tier List 🟡P6
Tournament    →  "Who's winning TI?" → Leagues Browser 🟡P7
```

The current app satisfies a single visit. Adding the pro matches feed (P3) alone converts it into a daily-return product because match data changes every few hours.

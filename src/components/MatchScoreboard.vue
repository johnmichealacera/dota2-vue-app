<template>
  <div class="scoreboard">
    <!-- Result banner -->
    <div class="result-banner glass-panel" :class="match.radiantWin ? 'radiant-win' : 'dire-win'">
      <div class="result-side radiant-label" :class="{ winner: match.radiantWin }">
        <span class="side-tag">Radiant</span>
        <span class="team-name">{{ match.radiantName }}</span>
        <span class="team-score">{{ match.radiantScore }}</span>
      </div>
      <div class="result-center">
        <span class="vs">VS</span>
        <span class="winner-pill" :class="match.radiantWin ? 'radiant' : 'dire'">
          {{ match.radiantWin ? 'Radiant Victory' : 'Dire Victory' }}
        </span>
      </div>
      <div class="result-side dire-label" :class="{ winner: !match.radiantWin }">
        <span class="team-score">{{ match.direScore }}</span>
        <span class="team-name">{{ match.direName }}</span>
        <span class="side-tag">Dire</span>
      </div>
    </div>

    <!-- Meta strip -->
    <div class="meta-strip glass-panel">
      <span v-if="match.leagueName" class="meta-pill league">{{ match.leagueName }}</span>
      <span class="meta-item">
        <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.3"/>
          <path d="M8 5v3.5l2 1.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        {{ formatDuration(match.duration) }}
      </span>
      <span class="meta-sep">·</span>
      <span class="meta-item">{{ match.gameMode }}</span>
      <span v-if="match.patch" class="meta-sep">·</span>
      <span v-if="match.patch" class="meta-item">Patch {{ match.patch }}</span>
      <span class="meta-sep">·</span>
      <span class="meta-item muted">{{ formatTime(match.startTime) }}</span>
      <a
        :href="`https://www.opendota.com/matches/${match.matchId}`"
        target="_blank"
        rel="noopener noreferrer"
        class="opendota-link"
      >
        OpenDota ↗
      </a>
    </div>

    <!-- Two-column scoreboard -->
    <div class="columns">
      <div class="team-column glass-panel radiant-col">
        <div class="col-header radiant">
          <span>Radiant</span>
          <span class="col-score">{{ match.radiantScore }}</span>
        </div>
        <div class="player-rows">
          <div v-for="player in match.radiant" :key="player.accountId + '-' + player.heroId" class="player-row">
            <img :src="player.heroImg" :alt="player.heroName" class="hero-portrait" loading="lazy" />
            <div class="player-info">
              <span class="player-name">{{ player.name }}</span>
              <span class="hero-name">{{ player.heroName }}</span>
            </div>
            <div class="kda">
              <span class="kda-val">{{ player.kills }}/{{ player.deaths }}/{{ player.assists }}</span>
              <span class="kda-label">K/D/A</span>
            </div>
            <div class="stats-mini">
              <span><em>GPM</em> {{ player.gpm }}</span>
              <span><em>XPM</em> {{ player.xpm }}</span>
              <span><em>NW</em> {{ formatNw(player.netWorth) }}</span>
            </div>
            <div class="items">
              <span
                v-for="(item, idx) in paddedItems(player.items)"
                :key="idx"
                class="item-slot"
                :class="{ filled: item.id > 0, empty: !item.id }"
                :title="item.name || 'Empty slot'"
              >
                <img
                  v-if="item.img"
                  :src="item.img"
                  :alt="item.name"
                  class="item-img"
                  loading="lazy"
                />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="team-column glass-panel dire-col">
        <div class="col-header dire">
          <span class="col-score">{{ match.direScore }}</span>
          <span>Dire</span>
        </div>
        <div class="player-rows">
          <div v-for="player in match.dire" :key="player.accountId + '-' + player.heroId" class="player-row dire-row">
            <div class="items items-left">
              <span
                v-for="(item, idx) in paddedItems(player.items)"
                :key="idx"
                class="item-slot"
                :class="{ filled: item.id > 0, empty: !item.id }"
                :title="item.name || 'Empty slot'"
              >
                <img
                  v-if="item.img"
                  :src="item.img"
                  :alt="item.name"
                  class="item-img"
                  loading="lazy"
                />
              </span>
            </div>
            <div class="stats-mini stats-left">
              <span><em>GPM</em> {{ player.gpm }}</span>
              <span><em>XPM</em> {{ player.xpm }}</span>
              <span><em>NW</em> {{ formatNw(player.netWorth) }}</span>
            </div>
            <div class="kda">
              <span class="kda-val">{{ player.kills }}/{{ player.deaths }}/{{ player.assists }}</span>
              <span class="kda-label">K/D/A</span>
            </div>
            <div class="player-info player-info-right">
              <span class="player-name">{{ player.name }}</span>
              <span class="hero-name">{{ player.heroName }}</span>
            </div>
            <img :src="player.heroImg" :alt="player.heroName" class="hero-portrait" loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MatchScoreboard',
  props: {
    match: { type: Object, required: true },
  },
  methods: {
    formatDuration(secs) {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${m}:${String(s).padStart(2, '0')}`;
    },
    formatTime(ts) {
      if (!ts) return '—';
      return new Date(ts * 1000).toLocaleString(undefined, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      });
    },
    formatNw(nw) {
      if (nw >= 1000) return `${(nw / 1000).toFixed(1)}k`;
      return String(nw);
    },
    paddedItems(items) {
      const empty = { id: 0, name: '', img: '' };
      const slots = (items || []).map((item) => {
        if (typeof item === 'number') {
          return item > 0 ? { id: item, name: `Item ${item}`, img: '' } : empty;
        }
        return item;
      });
      while (slots.length < 6) slots.push({ ...empty });
      return slots.slice(0, 6);
    },
  },
};
</script>

<style scoped>
.scoreboard {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Result banner */
.result-banner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 0.85rem;
}

.result-side {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  opacity: 0.55;
  transition: opacity 200ms ease;
}
.result-side.winner { opacity: 1; }

.radiant-label { justify-content: flex-start; }
.dire-label    { justify-content: flex-end; }

.side-tag {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.15rem 0.45rem;
  border-radius: 3px;
}
.radiant-label .side-tag {
  background: rgba(56, 197, 122, 0.15);
  color: var(--agi);
  border: 1px solid rgba(56, 197, 122, 0.3);
}
.dire-label .side-tag {
  background: rgba(201, 53, 53, 0.15);
  color: var(--crimson);
  border: 1px solid rgba(201, 53, 53, 0.3);
}

.team-name {
  font-family: "Cinzel", serif;
  font-size: 0.95rem;
  font-weight: 600;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.team-score {
  font-family: "Cinzel", serif;
  font-size: 1.6rem;
  font-weight: 700;
}

.result-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}

.vs {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  color: var(--text-muted);
}

.winner-pill {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
}
.winner-pill.radiant {
  background: rgba(56, 197, 122, 0.15);
  color: var(--agi);
  border: 1px solid rgba(56, 197, 122, 0.35);
  box-shadow: 0 0 16px rgba(56, 197, 122, 0.2);
}
.winner-pill.dire {
  background: rgba(201, 53, 53, 0.15);
  color: #e87070;
  border: 1px solid rgba(201, 53, 53, 0.35);
  box-shadow: 0 0 16px rgba(201, 53, 53, 0.2);
}

.radiant-win { border-color: rgba(56, 197, 122, 0.25); }
.dire-win    { border-color: rgba(201, 53, 53, 0.25); }

/* Meta strip */
.meta-strip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.65rem;
  padding: 0.65rem 1rem;
  border-radius: 0.65rem;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.meta-pill.league {
  padding: 0.15rem 0.5rem;
  border-radius: 3px;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.25);
  color: #38bdf8;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}
.meta-item.muted { opacity: 0.75; }
.meta-sep { opacity: 0.35; }

.opendota-link {
  margin-left: auto;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #38bdf8;
  opacity: 0.8;
  transition: opacity 150ms ease;
}
.opendota-link:hover { opacity: 1; }

/* Columns */
.columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.team-column {
  border-radius: 0.85rem;
  overflow: hidden;
}

.col-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.55rem 0.85rem;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.col-header.radiant {
  background: linear-gradient(90deg, rgba(56, 197, 122, 0.18), transparent);
  color: var(--agi);
  border-bottom: 1px solid rgba(56, 197, 122, 0.2);
}
.col-header.dire {
  background: linear-gradient(270deg, rgba(201, 53, 53, 0.18), transparent);
  color: #e87070;
  border-bottom: 1px solid rgba(201, 53, 53, 0.2);
}
.col-score {
  font-family: "Cinzel", serif;
  font-size: 1.1rem;
}

.player-rows {
  display: flex;
  flex-direction: column;
}

.player-row {
  display: grid;
  grid-template-columns: 44px 1fr auto auto auto;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  transition: background 150ms ease;
}
.player-row:hover { background: rgba(255, 255, 255, 0.02); }
.player-row:last-child { border-bottom: none; }

.dire-row {
  grid-template-columns: auto auto auto 1fr 44px;
}

.hero-portrait {
  width: 44px;
  height: 25px;
  object-fit: cover;
  border-radius: 3px;
  border: 1px solid var(--border);
}

.player-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.player-info-right { text-align: right; align-items: flex-end; }

.player-name {
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.hero-name {
  font-size: 0.65rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.kda {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 52px;
}
.kda-val {
  font-family: "Cinzel", serif;
  font-size: 0.82rem;
  font-weight: 700;
}
.kda-label {
  font-size: 0.55rem;
  color: var(--text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.stats-mini {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  font-size: 0.62rem;
  color: var(--text-muted);
  min-width: 58px;
}
.stats-mini em {
  font-style: normal;
  opacity: 0.65;
  margin-right: 0.15rem;
}
.stats-left { text-align: right; }

.items {
  display: flex;
  gap: 2px;
}
.items-left { justify-content: flex-end; }

.item-slot {
  width: 24px;
  height: 18px;
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.25);
  display: grid;
  place-items: center;
  overflow: hidden;
}
.item-slot.filled {
  border-color: rgba(232, 168, 56, 0.35);
  background: rgba(8, 10, 18, 0.9);
}
.item-slot.empty {
  opacity: 0.35;
}
.item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

@media (max-width: 900px) {
  .columns { grid-template-columns: 1fr; }
  .result-banner { grid-template-columns: 1fr; text-align: center; }
  .radiant-label, .dire-label { justify-content: center; flex-wrap: wrap; }
  .dire-row {
    grid-template-columns: 44px 1fr auto;
    grid-template-rows: auto auto;
  }
  .dire-row .items,
  .dire-row .stats-mini { display: none; }
  .player-row {
    grid-template-columns: 44px 1fr auto;
  }
  .player-row .items,
  .player-row .stats-mini { display: none; }
  .opendota-link { margin-left: 0; width: 100%; text-align: center; margin-top: 0.25rem; }
}

@media (max-width: 480px) {
  .team-name { max-width: 100px; font-size: 0.8rem; }
  .team-score { font-size: 1.2rem; }
}
</style>

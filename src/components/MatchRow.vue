<template>
  <a
    :href="`https://www.opendota.com/matches/${match.matchId}`"
    target="_blank"
    rel="noopener noreferrer"
    class="match-row glass-panel"
    :class="match.radiantWin ? 'radiant-won' : 'dire-won'"
  >
    <!-- Result ribbon -->
    <div class="result-ribbon" :class="match.radiantWin ? 'radiant' : 'dire'">
      {{ match.radiantWin ? 'RADIANT' : 'DIRE' }}
    </div>

    <!-- Teams -->
    <div class="teams">
      <div class="side radiant-side" :class="{ winner: match.radiantWin, loser: !match.radiantWin }">
        <span class="team-name">{{ match.radiantName }}</span>
        <span class="score">{{ match.radiantScore }}</span>
      </div>

      <div class="divider">—</div>

      <div class="side dire-side" :class="{ winner: !match.radiantWin, loser: match.radiantWin }">
        <span class="score">{{ match.direScore }}</span>
        <span class="team-name">{{ match.direName }}</span>
      </div>
    </div>

    <!-- Match meta -->
    <div class="match-meta">
      <span v-if="match.leagueName" class="league-pill">{{ match.leagueName }}</span>
      <span class="meta-sep">·</span>
      <span class="meta-item">
        <svg viewBox="0 0 16 16" fill="none" width="11" height="11">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.3"/>
          <path d="M8 5v3.5l2 1.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        {{ formatDuration(match.duration) }}
      </span>
      <span class="meta-sep">·</span>
      <span class="meta-item time">{{ timeAgo(match.startTime) }}</span>
    </div>

    <!-- External link indicator -->
    <span class="ext-arrow" aria-hidden="true">↗</span>
  </a>
</template>

<script>
export default {
  name: 'MatchRow',
  props: {
    match: { type: Object, required: true },
  },
  methods: {
    formatDuration(secs) {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${m}:${String(s).padStart(2, '0')}`;
    },
    timeAgo(ts) {
      const secs = Math.floor(Date.now() / 1000) - ts;
      if (secs < 60)  return `${secs}s ago`;
      const mins = Math.floor(secs / 60);
      if (mins < 60)  return `${mins}m ago`;
      const hrs  = Math.floor(mins / 60);
      if (hrs  < 24)  return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      return `${days}d ago`;
    },
  },
};
</script>

<style scoped>
.match-row {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem 0.85rem 0;
  border-radius: 0.7rem;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
  animation: fadeUp 0.35s ease both;
}

.match-row:hover {
  transform: translateX(3px);
}

.radiant-won:hover {
  border-color: rgba(56, 197, 122, 0.35);
  box-shadow: 0 8px 28px rgba(56, 197, 122, 0.1), var(--shadow-sm);
}
.dire-won:hover {
  border-color: rgba(201, 53, 53, 0.35);
  box-shadow: 0 8px 28px rgba(201, 53, 53, 0.1), var(--shadow-sm);
}

/* Coloured left ribbon */
.result-ribbon {
  width: 3px;
  align-self: stretch;
  border-radius: 0 2px 2px 0;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.48rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  padding: 0.35rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 0.25rem;
}
.result-ribbon.radiant {
  background: linear-gradient(180deg, rgba(56,197,122,0.8), rgba(14,184,154,0.6));
  color: #0eb89a;
  box-shadow: 0 0 12px rgba(56,197,122,0.4);
}
.result-ribbon.dire {
  background: linear-gradient(180deg, rgba(201,53,53,0.8), rgba(180,30,30,0.6));
  color: #c93535;
  box-shadow: 0 0 12px rgba(201,53,53,0.35);
}

/* Teams section */
.teams {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  flex: 1;
  min-width: 0;
}

.side {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
}

.radiant-side { flex-direction: row; }
.dire-side    { flex-direction: row-reverse; }

.team-name {
  font-family: "Cinzel", serif;
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
  transition: color 150ms;
}

.winner .team-name { color: var(--agi); }
.loser  .team-name { color: var(--text-muted); }

.score {
  font-family: "Cinzel", serif;
  font-size: 1.1rem;
  font-weight: 700;
  flex-shrink: 0;
}
.winner .score { color: var(--text); }
.loser  .score { color: var(--text-muted); opacity: 0.6; }

.divider {
  color: var(--text-muted);
  font-size: 1rem;
  opacity: 0.5;
  flex-shrink: 0;
}

/* Meta strip */
.match-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
  white-space: nowrap;
}

.league-pill {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 0.15rem 0.45rem;
  border-radius: 3px;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.2);
  color: #38bdf8;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta-sep {
  color: var(--text-muted);
  opacity: 0.35;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.22rem;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.72rem;
  color: var(--text-muted);
}

.meta-item svg { opacity: 0.6; }
.time { color: var(--text-muted); }

/* External link arrow */
.ext-arrow {
  color: var(--text-muted);
  font-size: 0.8rem;
  opacity: 0.4;
  flex-shrink: 0;
  transition: opacity 150ms, transform 150ms;
  padding-right: 0.5rem;
}
.match-row:hover .ext-arrow {
  opacity: 0.8;
  transform: translate(2px, -2px);
}

/* Responsive */
@media (max-width: 700px) {
  .match-row { grid-template-columns: auto 1fr auto; }
  .match-meta { display: none; } /* collapsed on narrow screens */
}

@media (max-width: 480px) {
  .team-name { max-width: 90px; font-size: 0.72rem; }
  .score     { font-size: 0.9rem; }
}
</style>

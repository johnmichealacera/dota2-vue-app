<template>
  <router-link :to="`/match/${match.matchId}`" class="player-match-row">
    <img
      v-if="match.heroImg"
      :src="match.heroImg"
      :alt="match.heroName"
      class="hero-icon"
      loading="lazy"
    />
    <div v-else class="hero-icon placeholder"></div>

    <div class="match-main">
      <span class="hero-name">{{ match.heroName || 'Unknown Hero' }}</span>
      <span class="kda">{{ match.kills }}/{{ match.deaths }}/{{ match.assists }}</span>
    </div>

    <span class="result-pill" :class="match.won ? 'win' : 'loss'">
      {{ match.won ? 'W' : 'L' }}
    </span>

    <div class="match-meta">
      <span>{{ formatDuration(match.duration) }}</span>
      <span class="meta-sep">·</span>
      <span>{{ timeAgo(match.startTime) }}</span>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'PlayerMatchRow',
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
      if (secs < 60) return `${secs}s ago`;
      const mins = Math.floor(secs / 60);
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      return `${Math.floor(hrs / 24)}d ago`;
    },
  },
};
</script>

<style scoped>
.player-match-row {
  display: grid;
  grid-template-columns: 40px 1fr auto auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0.65rem;
  border-radius: 0.55rem;
  border: 1px solid var(--border);
  background: rgba(10, 14, 26, 0.75);
  text-decoration: none;
  transition: border-color 150ms ease, transform 150ms ease;
}
.player-match-row:hover {
  border-color: var(--border-strong);
  transform: translateX(2px);
}

.hero-icon {
  width: 40px;
  height: 22px;
  object-fit: cover;
  border-radius: 3px;
  border: 1px solid var(--border);
}
.hero-icon.placeholder {
  background: rgba(255, 255, 255, 0.06);
}

.match-main {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}
.hero-name {
  font-family: "Cinzel", serif;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.kda {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.result-pill {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.15rem 0.45rem;
  border-radius: 3px;
}
.result-pill.win {
  background: rgba(56, 197, 122, 0.18);
  color: var(--agi);
  border: 1px solid rgba(56, 197, 122, 0.35);
}
.result-pill.loss {
  background: rgba(201, 53, 53, 0.18);
  color: var(--crimson);
  border: 1px solid rgba(201, 53, 53, 0.35);
}

.match-meta {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  white-space: nowrap;
}
.meta-sep { opacity: 0.45; }

@media (max-width: 640px) {
  .player-match-row {
    grid-template-columns: 36px 1fr auto;
    grid-template-rows: auto auto;
  }
  .match-meta {
    grid-column: 2 / -1;
  }
}
</style>

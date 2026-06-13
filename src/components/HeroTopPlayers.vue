<template>
  <section v-if="players.length" class="top-players">
    <div class="top-head">
      <h2 class="top-title">Top Players</h2>
      <span class="top-sub">Highest-rated on this hero</span>
    </div>

    <div class="top-grid">
      <router-link
        v-for="player in players"
        :key="player.accountId"
        :to="`/player/${player.accountId}`"
        class="top-card"
      >
        <span class="top-rank">#{{ player.rankPosition }}</span>

        <div class="top-card-body">
          <div class="top-medal" v-if="player.rankTier">
            <img
              v-if="medalFor(player)"
              :src="medalFor(player)"
              :alt="player.rankLabel"
              class="medal-icon"
            />
            <img
              v-if="starFor(player)"
              :src="starFor(player)"
              alt=""
              class="medal-star"
            />
          </div>

          <img
            v-if="player.avatar"
            :src="player.avatar"
            :alt="player.name"
            class="top-avatar"
            loading="lazy"
          />

          <div class="top-meta">
            <span class="top-name">{{ player.name }}</span>
            <span class="top-pct">Top {{ player.percentile.toFixed(1) }}%</span>
          </div>
        </div>
      </router-link>
    </div>
  </section>
</template>

<script>
import { resolveRankIcons } from '../utils/rankIcons';

export default {
  name: 'HeroTopPlayers',
  props: {
    players: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    medalFor(player) {
      const fromTier = resolveRankIcons(player.rankTier, null).medal;
      return fromTier || player.rankIcon || '';
    },
    starFor(player) {
      const fromTier = resolveRankIcons(player.rankTier, null).star;
      return fromTier || player.rankStarIcon || '';
    },
  },
};
</script>

<style scoped>
.top-players {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(200, 146, 42, 0.1);
}
.top-head {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}
.top-title {
  margin: 0;
  font-size: 0.92rem;
}
.top-sub {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-style: italic;
}

.top-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.55rem;
}

.top-card {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.55rem 0.45rem 0.6rem;
  border-radius: 0.65rem;
  border: 1px solid var(--border);
  background: rgba(10, 14, 26, 0.8);
  text-decoration: none;
  color: inherit;
  min-width: 0;
  transition: border-color 150ms ease, transform 150ms ease;
}
.top-card:hover {
  border-color: var(--border-strong);
  transform: translateY(-2px);
}

.top-rank {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-bright);
  text-align: center;
}

.top-card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  min-width: 0;
  width: 100%;
}

.top-medal {
  position: relative;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
}
.medal-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
}
.medal-star {
  position: absolute;
  right: -3px;
  bottom: -2px;
  width: 12px;
  height: 12px;
  object-fit: contain;
}

.top-avatar {
  width: 36px;
  height: 36px;
  border-radius: 0.4rem;
  object-fit: cover;
  border: 1px solid var(--border);
  flex-shrink: 0;
}

.top-meta {
  text-align: center;
  width: 100%;
  min-width: 0;
}
.top-name {
  display: block;
  font-family: "Cinzel", serif;
  font-size: 0.6rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.12rem;
}
.top-pct {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.55rem;
  letter-spacing: 0.06em;
  color: var(--agi);
  font-weight: 600;
}

@media (max-width: 1100px) {
  .top-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .top-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .top-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

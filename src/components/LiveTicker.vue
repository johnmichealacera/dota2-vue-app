<template>
  <section v-if="games.length" class="live-ticker glass-panel">
    <div class="ticker-head">
      <span class="live-dot" aria-hidden="true"></span>
      <h2>Live High-MMR Games</h2>
      <span class="ticker-refresh">Updates every 2 min</span>
    </div>

    <div class="ticker-list">
      <div v-for="game in games" :key="game.matchId" class="ticker-game">
        <div class="side-block radiant">
          <span class="side-label">Radiant</span>
          <div class="side-body">
            <div class="hero-row">
              <div
                v-for="hero in game.radiantHeroes"
                :key="`r-${game.matchId}-${hero.heroId}`"
                class="hero-chip"
                :title="hero.heroName"
              >
                <img
                  v-if="hero.heroImg && !isBroken(`${game.matchId}-r-${hero.heroId}`)"
                  :src="hero.heroImg"
                  alt=""
                  class="hero-icon"
                  @error="markBroken(`${game.matchId}-r-${hero.heroId}`)"
                />
                <span v-else class="hero-fallback">{{ heroInitial(hero.heroName) }}</span>
              </div>
            </div>
            <span class="side-score">{{ game.radiantScore }}</span>
          </div>
        </div>

        <div class="game-mid">
          <span class="vs">vs</span>
          <span class="mmr">~{{ Math.round(game.averageMmr).toLocaleString() }} MMR</span>
          <span class="game-time">{{ formatGameTime(game.gameTime) }}</span>
        </div>

        <div class="side-block dire">
          <span class="side-label">Dire</span>
          <div class="side-body">
            <span class="side-score">{{ game.direScore }}</span>
            <div class="hero-row">
              <div
                v-for="hero in game.direHeroes"
                :key="`d-${game.matchId}-${hero.heroId}`"
                class="hero-chip"
                :title="hero.heroName"
              >
                <img
                  v-if="hero.heroImg && !isBroken(`${game.matchId}-d-${hero.heroId}`)"
                  :src="hero.heroImg"
                  alt=""
                  class="hero-icon"
                  @error="markBroken(`${game.matchId}-d-${hero.heroId}`)"
                />
                <span v-else class="hero-fallback">{{ heroInitial(hero.heroName) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, onUnmounted } from 'vue';
import { buildApiUrl } from '../config/api';

const REFRESH_MS = 2 * 60 * 1000;

export default {
  name: 'LiveTicker',
  setup() {
    const games = ref([]);
    const brokenImages = ref({});
    let timer = null;

    const formatGameTime = (secs) => {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${m}:${String(s).padStart(2, '0')}`;
    };

    const heroInitial = (name) => (name?.trim()?.[0] ?? '?').toUpperCase();

    const isBroken = (key) => Boolean(brokenImages.value[key]);

    const markBroken = (key) => {
      brokenImages.value = { ...brokenImages.value, [key]: true };
    };

    const fetchLive = () => {
      axios.get(buildApiUrl('/live'))
        .then((res) => {
          games.value = (res.data ?? []).slice(0, 3);
        })
        .catch(() => {
          games.value = [];
        });
    };

    onMounted(() => {
      fetchLive();
      timer = setInterval(fetchLive, REFRESH_MS);
    });

    onUnmounted(() => {
      if (timer) clearInterval(timer);
    });

    return {
      games,
      formatGameTime,
      heroInitial,
      isBroken,
      markBroken,
    };
  },
};
</script>

<style scoped>
.live-ticker {
  border-radius: 0.75rem;
  padding: 0.85rem 1rem;
  margin-bottom: 0.85rem;
  border: 1px solid rgba(56, 189, 248, 0.2);
  background: linear-gradient(135deg, rgba(12, 20, 38, 0.9), rgba(8, 14, 28, 0.85));
}

.ticker-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.7rem;
  flex-wrap: wrap;
}

.ticker-head h2 {
  margin: 0;
  font-family: "Cinzel", serif;
  font-size: 0.88rem;
  color: var(--text-soft);
  flex: 1;
}

.ticker-refresh {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.7);
  animation: pulse-dot 1.8s ease-in-out infinite;
  flex-shrink: 0;
}

.ticker-list {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.ticker-game {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.75rem;
  border-radius: 0.55rem;
  border: 1px solid var(--border);
  background: rgba(6, 8, 15, 0.35);
}

.side-block {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
}

.side-block.dire {
  align-items: flex-end;
  text-align: right;
}

.side-label {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.radiant .side-label { color: #4ade80; }
.dire .side-label { color: #f87171; }

.side-body {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dire .side-body {
  flex-direction: row-reverse;
}

.hero-row {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
}

.dire .hero-row {
  justify-content: flex-end;
}

.hero-chip {
  flex-shrink: 0;
}

.hero-icon {
  display: block;
  width: 44px;
  height: 25px;
  object-fit: cover;
  border-radius: 3px;
  border: 1px solid var(--border);
}

.hero-fallback {
  display: grid;
  place-items: center;
  width: 44px;
  height: 25px;
  border-radius: 3px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.06);
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted);
}

.side-score {
  font-family: "Cinzel", serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-soft);
  min-width: 1.5rem;
  flex-shrink: 0;
}

.game-mid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  flex-shrink: 0;
  padding: 0 0.25rem;
}

.vs {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.58rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.mmr {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: #38bdf8;
  white-space: nowrap;
}

.game-time {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.62rem;
  color: var(--text-muted);
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

@media (max-width: 720px) {
  .ticker-game {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .side-block.dire {
    align-items: flex-start;
    text-align: left;
  }

  .dire .side-body {
    flex-direction: row;
  }

  .dire .hero-row {
    justify-content: flex-start;
  }

  .game-mid {
    flex-direction: row;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.15rem 0;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    width: 100%;
  }
}
</style>

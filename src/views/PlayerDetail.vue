<template>
  <section>
    <nav class="breadcrumb">
      <router-link to="/players" class="bc-link">Players</router-link>
      <span class="bc-sep">›</span>
      <span class="bc-current">{{ profile?.name || '…' }}</span>
    </nav>

    <error-banner v-if="error" :message="error" :on-retry="fetchPlayer" />

    <dota-loader v-if="isLoading && !error" :isLoading="true" loaderType="detail" />

    <template v-if="profile && !isLoading && !error">
      <header class="profile-header glass-panel">
        <div class="profile-identity">
          <img
            v-if="profile.avatar"
            :src="profile.avatar"
            :alt="profile.name"
            class="profile-avatar"
          />
          <div v-else class="profile-avatar placeholder"></div>

          <div class="profile-info">
            <h1>{{ profile.name }}</h1>
            <div class="profile-tags">
              <span v-if="profile.teamName" class="tag team">{{ profile.teamName }}</span>
              <span v-if="countryDisplay" class="tag country">{{ countryDisplay }}</span>
            </div>
          </div>
        </div>

        <div class="profile-rank" v-if="rankMedal || profile.rankLabel">
          <div class="rank-medal" v-if="rankMedal">
            <img
              :src="rankMedal"
              :alt="profile.rankLabel"
              class="rank-icon"
            />
            <img
              v-if="rankStar"
              :src="rankStar"
              alt=""
              class="rank-star"
            />
            <span v-if="profile.leaderboardRank" class="rank-board">
              {{ profile.leaderboardRank }}
            </span>
          </div>
          <div class="rank-meta">
            <span class="rank-label">{{ profile.rankLabel }}</span>
            <span v-if="profile.mmr" class="mmr-est">~{{ profile.mmr.toLocaleString() }} MMR</span>
          </div>
        </div>

        <div class="profile-stats">
          <div class="stat-box">
            <span class="stat-label">Games</span>
            <span class="stat-val">{{ totalGames }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Win Rate</span>
            <span class="stat-val" :class="winRateClass">{{ profile.winRate.toFixed(1) }}%</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Wins</span>
            <span class="stat-val agi-col">{{ profile.wins }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Losses</span>
            <span class="stat-val crimson-col">{{ profile.losses }}</span>
          </div>
        </div>
      </header>

      <div class="profile-grid">
        <section class="panel glass-panel">
          <div class="panel-head">
            <h2>Recent Matches</h2>
            <span class="panel-count">{{ recentMatches.length }} shown</span>
          </div>
          <div class="match-list" v-if="recentMatches.length">
            <player-match-row
              v-for="match in recentMatches.slice(0, 10)"
              :key="match.matchId"
              :match="match"
            />
          </div>
          <p v-else class="empty-state">No recent matches available.</p>
        </section>

        <section class="panel glass-panel">
          <div class="panel-head">
            <h2>Most Played Heroes</h2>
            <span class="panel-count">{{ heroStats.length }} heroes</span>
          </div>

          <div class="heroes-table-wrap" v-if="heroStats.length">
            <table class="heroes-table">
              <thead>
                <tr>
                  <th>Hero</th>
                  <th>Games</th>
                  <th>Win %</th>
                  <th>Last Played</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="hero in heroStats" :key="hero.heroId">
                  <td class="hero-cell">
                    <router-link :to="`/item/${hero.heroId}/hero`" class="hero-link">
                      <img
                        v-if="hero.heroImg"
                        :src="hero.heroImg"
                        :alt="hero.heroName"
                        class="hero-thumb"
                        loading="lazy"
                      />
                      <span>{{ hero.heroName }}</span>
                    </router-link>
                  </td>
                  <td>{{ hero.games }}</td>
                  <td :class="heroWinClass(hero.winRate)">{{ hero.winRate.toFixed(1) }}%</td>
                  <td class="time-col">{{ timeAgo(hero.lastPlayed) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="empty-state">No hero stats available.</p>
        </section>
      </div>
    </template>
  </section>
</template>

<script>
import axios from 'axios';
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import DotaLoader from '../components/Loader.vue';
import ErrorBanner from '../components/ErrorBanner.vue';
import PlayerMatchRow from '../components/PlayerMatchRow.vue';
import { buildApiUrl } from '../config/api';
import { resolveRankIcons } from '../utils/rankIcons';

export default {
  name: 'PlayerDetail',
  components: { DotaLoader, ErrorBanner, PlayerMatchRow },
  setup() {
    const route = useRoute();
    const profile = ref(null);
    const recentMatches = ref([]);
    const heroStats = ref([]);
    const isLoading = ref(false);
    const error = ref('');

    const totalGames = computed(() => {
      if (!profile.value) return 0;
      return profile.value.wins + profile.value.losses;
    });

    const winRateClass = computed(() => {
      const wr = profile.value?.winRate ?? 50;
      if (wr >= 55) return 'agi-col';
      if (wr <= 45) return 'crimson-col';
      return 'accent-col';
    });

    const countryDisplay = computed(() => {
      const code = profile.value?.countryCode;
      if (!code || code.length !== 2) return '';
      const flag = String.fromCodePoint(
        ...[...code.toUpperCase()].map((c) => c.charCodeAt(0) + 127397)
      );
      return `${flag} ${code.toUpperCase()}`;
    });

    const rankIcons = computed(() =>
      resolveRankIcons(profile.value?.rankTier, profile.value?.leaderboardRank)
    );
    const rankMedal = computed(() => rankIcons.value.medal);
    const rankStar = computed(() => rankIcons.value.star);

    const heroWinClass = (wr) => {
      if (wr >= 55) return 'wr-good';
      if (wr <= 45) return 'wr-bad';
      return '';
    };

    const timeAgo = (ts) => {
      const secs = Math.floor(Date.now() / 1000) - ts;
      if (secs < 60) return `${secs}s ago`;
      const mins = Math.floor(secs / 60);
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      if (days < 30) return `${days}d ago`;
      return `${Math.floor(days / 30)}mo ago`;
    };

    const fetchPlayer = () => {
      const id = route.params.id;
      if (!id) return;

      isLoading.value = true;
      error.value = '';
      profile.value = null;
      recentMatches.value = [];
      heroStats.value = [];

      const profileReq = axios.get(buildApiUrl(`/player/${id}`));
      const matchesReq = axios.get(buildApiUrl(`/player-recent-matches/${id}`));
      const heroesReq = axios.get(buildApiUrl(`/player-heroes/${id}`));

      Promise.all([profileReq, matchesReq, heroesReq])
        .then(([profileRes, matchesRes, heroesRes]) => {
          profile.value = profileRes.data;
          recentMatches.value = matchesRes.data ?? [];
          heroStats.value = heroesRes.data ?? [];
          isLoading.value = false;
        })
        .catch(() => {
          error.value = 'Failed to load player profile. The backend may still be deploying — try again shortly.';
          isLoading.value = false;
        });
    };

    watch(() => route.params.id, fetchPlayer, { immediate: true });

    return {
      profile,
      recentMatches,
      heroStats,
      isLoading,
      error,
      totalGames,
      winRateClass,
      countryDisplay,
      rankMedal,
      rankStar,
      heroWinClass,
      timeAgo,
      fetchPlayer,
    };
  },
};
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 1rem;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.bc-link {
  color: var(--accent-bright);
  transition: opacity 150ms ease;
}
.bc-link:hover { opacity: 0.75; }
.bc-sep { color: var(--text-muted); }
.bc-current { color: var(--text-muted); }

.profile-header {
  border-radius: 0.85rem;
  padding: 1.25rem;
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1.25rem;
  align-items: center;
}

.profile-identity {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 0;
}

.profile-avatar {
  width: 72px;
  height: 72px;
  border-radius: 0.65rem;
  border: 1px solid var(--border);
  object-fit: cover;
  flex-shrink: 0;
}
.profile-avatar.placeholder {
  background: rgba(255, 255, 255, 0.06);
}

.profile-info h1 {
  margin: 0 0 0.4rem;
  font-size: clamp(1.1rem, 2.5vw, 1.45rem);
}

.profile-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}
.tag {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.15rem 0.5rem;
  border-radius: 3px;
  border: 1px solid var(--border);
}
.tag.team { color: #c4a8f5; border-color: rgba(155, 114, 219, 0.35); }
.tag.country { color: #7fbeff; border-color: rgba(91, 160, 240, 0.35); }

.profile-rank {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}
.rank-medal {
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}
.rank-icon {
  width: 56px;
  height: 56px;
  object-fit: contain;
}
.rank-star {
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 22px;
  height: 22px;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6));
}
.rank-board {
  position: absolute;
  left: 50%;
  bottom: 4px;
  transform: translateX(-50%);
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.62rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
}
.rank-meta {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.rank-label {
  font-family: "Cinzel", serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--accent-bright);
}
.mmr-est {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.profile-stats {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.12rem;
  padding: 0.45rem 0.65rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: rgba(6, 8, 15, 0.4);
  min-width: 72px;
}
.stat-label {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.58rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.stat-val {
  font-family: "Cinzel", serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-soft);
}
.agi-col { color: var(--agi); }
.crimson-col { color: var(--crimson); }
.accent-col { color: var(--accent-bright); }

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 1rem;
  align-items: start;
}

.panel {
  border-radius: 0.85rem;
  padding: 1.1rem;
}
.panel-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.85rem;
}
.panel-head h2 {
  margin: 0;
  font-size: 0.95rem;
}
.panel-count {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.match-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.heroes-table-wrap {
  overflow-x: auto;
}
.heroes-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
}
.heroes-table th {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  text-align: left;
  padding: 0.35rem 0.5rem;
  border-bottom: 1px solid var(--border);
}
.heroes-table td {
  padding: 0.45rem 0.5rem;
  border-bottom: 1px solid rgba(200, 146, 42, 0.06);
  color: var(--text-soft);
}
.hero-cell { min-width: 140px; }
.hero-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--text);
  text-decoration: none;
  transition: color 150ms ease;
}
.hero-link:hover { color: var(--accent-bright); }
.hero-thumb {
  width: 44px;
  height: 25px;
  object-fit: cover;
  border-radius: 3px;
  border: 1px solid var(--border);
}
.wr-good { color: var(--agi); font-weight: 600; }
.wr-bad { color: var(--crimson); font-weight: 600; }
.time-col {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.68rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.empty-state {
  text-align: center;
  color: var(--text-muted);
  font-style: italic;
  margin: 0.5rem 0;
}

@media (max-width: 900px) {
  .profile-header {
    grid-template-columns: 1fr;
  }
  .profile-grid {
    grid-template-columns: 1fr;
  }
}
</style>

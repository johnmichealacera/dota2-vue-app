<template>
  <section>
    <nav class="breadcrumb">
      <router-link to="/leagues" class="bc-link">Leagues</router-link>
      <span class="bc-sep">›</span>
      <span class="bc-current">{{ league?.name || '…' }}</span>
    </nav>

    <div v-if="league" class="page-banner glass-panel" :class="tierClass">
      <p class="eyebrow">Tournament</p>
      <div class="banner-head">
        <h1>{{ league.name }}</h1>
        <span class="tier-badge" :class="tierClass">{{ tierLabel }}</span>
      </div>
      <p class="subtitle">League #{{ league.leagueId }}</p>
      <div class="banner-stats" v-if="!loadingTeams && !loadingMatches">
        <span class="bstat"><span class="bstat-val">{{ teams.length }}</span> Teams</span>
        <span class="bstat-sep">·</span>
        <span class="bstat"><span class="bstat-val">{{ matches.length }}</span> Matches</span>
      </div>
    </div>

    <error-banner v-if="error" :message="error" :on-retry="loadAll" />

    <dota-loader :isLoading="loadingLeague && !league" loaderType="home" />

    <section v-if="teams.length" class="league-block">
      <div class="block-head">
        <h2>Participating Teams</h2>
        <span class="block-count">{{ teams.length }} teams</span>
      </div>
      <div class="team-grid">
        <router-link
          v-for="team in teams"
          :key="team.id"
          :to="`/item/${team.id}/team`"
          class="team-chip glass-panel"
        >
          <img v-if="team.img" :src="team.img" :alt="team.name" class="team-logo" loading="lazy" />
          <div v-else class="team-logo placeholder">{{ team.tag?.[0] || '?' }}</div>
          <div class="team-meta">
            <span class="team-name">{{ team.name }}</span>
            <span class="team-record">{{ team.wins }}W · {{ team.losses }}L · {{ Math.round(team.rating) }} RTG</span>
          </div>
        </router-link>
      </div>
    </section>

    <section v-if="matches.length" class="league-block">
      <div class="block-head">
        <h2>Match Results</h2>
        <span class="block-count">Latest {{ matches.length }}</span>
      </div>
      <div class="match-list">
        <match-row
          v-for="(match, i) in matches"
          :key="match.matchId"
          :match="match"
          :style="{ animationDelay: `${i * 0.03}s` }"
        />
      </div>
    </section>

    <p v-if="!loadingTeams && !loadingMatches && !error && !teams.length && !matches.length" class="empty-state">
      No teams or matches found for this league yet.
    </p>
  </section>
</template>

<script>
import axios from 'axios';
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MatchRow from '../components/MatchRow.vue';
import DotaLoader from '../components/Loader.vue';
import ErrorBanner from '../components/ErrorBanner.vue';
import { buildApiUrl } from '../config/api';

export default {
  name: 'LeagueDetail',
  components: { MatchRow, DotaLoader, ErrorBanner },
  setup() {
    const route = useRoute();
    const league = ref(null);
    const teams = ref([]);
    const matches = ref([]);
    const loadingLeague = ref(false);
    const loadingTeams = ref(false);
    const loadingMatches = ref(false);
    const error = ref('');

    const tierClass = computed(() => {
      const tier = (league.value?.tier || '').toLowerCase();
      if (tier === 'premium') return 'tier-premium';
      if (tier === 'professional') return 'tier-pro';
      return 'tier-amateur';
    });

    const tierLabel = computed(() => {
      const tier = (league.value?.tier || '').toLowerCase();
      if (tier === 'premium') return 'Premium';
      if (tier === 'professional') return 'Professional';
      return 'Amateur';
    });

    const loadLeagueMeta = (id) => {
      loadingLeague.value = true;
      return axios.get(buildApiUrl('/leagues'), { params: { pageSize: 999, page: 1 } })
        .then((res) => {
          const items = res.data?.items ?? [];
          league.value = items.find((l) => String(l.leagueId) === String(id)) ?? {
            leagueId: Number(id),
            name: `League #${id}`,
            tier: 'professional',
          };
        })
        .finally(() => { loadingLeague.value = false; });
    };

    const loadTeams = (id) => {
      loadingTeams.value = true;
      return axios.get(buildApiUrl(`/league-teams/${id}`))
        .then((res) => { teams.value = res.data ?? []; })
        .catch(() => { teams.value = []; })
        .finally(() => { loadingTeams.value = false; });
    };

    const loadMatches = (id) => {
      loadingMatches.value = true;
      return axios.get(buildApiUrl(`/league-matches/${id}`))
        .then((res) => { matches.value = res.data ?? []; })
        .catch(() => { matches.value = []; })
        .finally(() => { loadingMatches.value = false; });
    };

    const loadAll = () => {
      const id = route.params.id;
      error.value = '';
      Promise.all([loadLeagueMeta(id), loadTeams(id), loadMatches(id)])
        .catch(() => {
          error.value = 'Failed to load league details. The backend may still be deploying — try again shortly.';
        });
    };

    watch(() => route.params.id, () => {
      league.value = null;
      teams.value = [];
      matches.value = [];
      loadAll();
    });

    onMounted(loadAll);

    return {
      league, teams, matches,
      loadingLeague, loadingTeams, loadingMatches,
      error, tierClass, tierLabel, loadAll,
    };
  },
};
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
  font-size: 0.78rem;
}

.bc-link {
  color: var(--text-muted);
  text-decoration: none;
}
.bc-link:hover { color: var(--accent-bright); }
.bc-sep, .bc-current { color: var(--text-muted); }
.bc-current { color: var(--text-soft); }

.page-banner {
  border-radius: 0.85rem;
  padding: 0.7rem 1.1rem 0.6rem;
  margin-bottom: 1.25rem;
}

.banner-head {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.banner-head h1 {
  margin: 0;
  flex: 1;
  min-width: 0;
}

.tier-badge {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.25rem 0.55rem;
  border-radius: 3px;
  border: 1px solid transparent;
  flex-shrink: 0;
}

.tier-premium .tier-badge {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
  border-color: rgba(251, 191, 36, 0.3);
}

.tier-pro .tier-badge {
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.1);
  border-color: rgba(56, 189, 248, 0.3);
}

.tier-amateur .tier-badge {
  color: var(--text-muted);
  background: rgba(148, 163, 184, 0.08);
  border-color: rgba(148, 163, 184, 0.25);
}

.league-block {
  margin-bottom: 1.5rem;
}

.block-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.block-head h2 {
  margin: 0;
  font-family: "Cinzel", serif;
  font-size: 1rem;
  color: var(--text-soft);
}

.block-count {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.65rem;
}

.team-chip {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  border-radius: 0.65rem;
  text-decoration: none;
  border: 1px solid var(--border);
  transition: border-color 160ms ease, transform 160ms ease;
}

.team-chip:hover {
  border-color: var(--border-strong);
  transform: translateY(-1px);
}

.team-logo {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
}

.team-logo.placeholder {
  display: grid;
  place-items: center;
  background: rgba(200, 146, 42, 0.15);
  color: var(--accent-bright);
  font-weight: 700;
  font-size: 0.9rem;
}

.team-meta {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.team-name {
  color: var(--text-soft);
  font-size: 0.88rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.team-record {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.match-list {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.empty-state {
  text-align: center;
  color: var(--text-muted);
  padding: 2rem 1rem;
}
</style>

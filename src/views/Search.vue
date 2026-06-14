<template>
  <section>
    <div class="page-banner glass-panel">
      <p class="eyebrow">Quick Lookup</p>
      <h1>Search</h1>
      <p class="subtitle">Find heroes, pro teams, and pro players — instant results from cached data.</p>
    </div>

    <search-bar
      v-model="query"
      placeholder="Search heroes, teams, or pro players…"
      @update:modelValue="onQueryInput"
    />

    <error-banner v-if="error" :message="error" :on-retry="runSearch" />

    <dota-loader v-if="isLoading && !error" :isLoading="true" loaderType="home" />

    <template v-if="!isLoading && !error && query.trim().length >= 2">
      <p class="results-count">{{ totalResults }} result{{ totalResults === 1 ? '' : 's' }}</p>

      <section v-if="results.heroes.length" class="result-section glass-panel">
        <h2 class="section-title">Heroes <span class="section-count">{{ results.heroes.length }}</span></h2>
        <div class="results-grid">
          <router-link
            v-for="hero in results.heroes"
            :key="hero.id"
            :to="`/item/${hero.id}/hero`"
            class="result-card"
          >
            <img v-if="hero.img" :src="hero.img" :alt="hero.name" class="card-img hero" loading="lazy" />
            <span class="card-name">{{ hero.name }}</span>
          </router-link>
        </div>
      </section>

      <section v-if="results.teams.length" class="result-section glass-panel">
        <h2 class="section-title">Teams <span class="section-count">{{ results.teams.length }}</span></h2>
        <div class="results-grid">
          <router-link
            v-for="team in results.teams"
            :key="team.id"
            :to="`/item/${team.id}/team`"
            class="result-card"
          >
            <img v-if="team.img" :src="team.img" :alt="team.name" class="card-img team" loading="lazy" />
            <span class="card-name">{{ team.name }}</span>
            <span v-if="team.tag" class="card-tag">{{ team.tag }}</span>
          </router-link>
        </div>
      </section>

      <section v-if="results.players.length" class="result-section glass-panel">
        <h2 class="section-title">Pro Players <span class="section-count">{{ results.players.length }}</span></h2>
        <div class="results-list">
          <router-link
            v-for="player in results.players"
            :key="player.accountId"
            :to="`/player/${player.accountId}`"
            class="result-row"
          >
            <img
              v-if="player.avatar"
              :src="player.avatar"
              :alt="player.name"
              class="result-avatar"
              loading="lazy"
            />
            <div v-else class="result-avatar placeholder"></div>
            <div class="result-meta">
              <span class="result-name">{{ player.name }}</span>
              <span v-if="player.teamName" class="result-sub">{{ player.teamName }}</span>
            </div>
            <span class="result-arrow">›</span>
          </router-link>
        </div>
      </section>

      <p v-if="totalResults === 0" class="empty-state">No matches for “{{ query.trim() }}”.</p>
    </template>

    <p v-if="!isLoading && query.trim().length < 2" class="hint-state">
      Type at least 2 characters to search.
    </p>
  </section>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import SearchBar from '../components/SearchBar.vue';
import DotaLoader from '../components/Loader.vue';
import ErrorBanner from '../components/ErrorBanner.vue';
import { buildApiUrl } from '../config/api';

const emptyResults = () => ({ heroes: [], teams: [], players: [] });

export default {
  name: 'SearchPage',
  components: { SearchBar, DotaLoader, ErrorBanner },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const query = ref(route.query.q?.toString() ?? '');
    const results = ref(emptyResults());
    const isLoading = ref(false);
    const error = ref('');
    let debounceTimer = null;

    const totalResults = computed(() => {
      const r = results.value;
      return r.heroes.length + r.teams.length + r.players.length;
    });

    const runSearch = () => {
      const q = query.value.trim();
      if (q.length < 2) {
        results.value = emptyResults();
        error.value = '';
        isLoading.value = false;
        return;
      }

      isLoading.value = true;
      error.value = '';

      axios.get(buildApiUrl('/global-search'), { params: { q } })
        .then((res) => {
          results.value = res.data ?? emptyResults();
          isLoading.value = false;
        })
        .catch(() => {
          error.value = 'Search failed. The backend may still be deploying — try again shortly.';
          isLoading.value = false;
        });
    };

    const syncRoute = (q) => {
      const trimmed = q.trim();
      if (trimmed) {
        router.replace({ name: 'SearchPage', query: { q: trimmed } });
      } else {
        router.replace({ name: 'SearchPage' });
      }
    };

    const onQueryInput = (value) => {
      syncRoute(value);
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(runSearch, 300);
    };

    watch(
      () => route.query.q,
      (q) => {
        const next = q?.toString() ?? '';
        if (next !== query.value) {
          query.value = next;
          runSearch();
        }
      },
      { immediate: true }
    );

    return { query, results, totalResults, isLoading, error, onQueryInput, runSearch };
  },
};
</script>

<style scoped>
.page-banner {
  border-radius: 0.85rem;
  padding: 0.7rem 1.1rem 0.6rem;
  margin-bottom: 0.75rem;
}
.eyebrow {
  margin: 0 0 0.15rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.58rem;
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 600;
  color: #9b72db;
}
h1 {
  margin: 0 0 0.2rem;
  font-size: clamp(1.05rem, 2vw, 1.5rem);
}
.subtitle {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.78rem;
}

.results-count {
  margin: 0.5rem 0 0.75rem;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.result-section {
  border-radius: 0.75rem;
  padding: 0.85rem 1rem;
  margin-bottom: 0.65rem;
}
.section-title {
  margin: 0 0 0.65rem;
  font-size: 0.9rem;
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}
.section-count {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-muted);
}

.results-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.result-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  width: 72px;
  text-decoration: none;
  color: inherit;
}
.card-img.hero {
  width: 64px;
  height: 36px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid var(--border);
}
.card-img.team {
  width: 44px;
  height: 44px;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: rgba(0, 0, 0, 0.25);
}
.card-name {
  font-size: 0.62rem;
  text-align: center;
  color: var(--text-soft);
  line-height: 1.2;
}
.card-tag {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.55rem;
  color: var(--text-muted);
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.result-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.25rem;
  border-radius: 0.45rem;
  text-decoration: none;
  color: inherit;
  transition: background 150ms ease;
}
.result-row:hover {
  background: rgba(200, 146, 42, 0.06);
}
.result-avatar {
  width: 40px;
  height: 40px;
  border-radius: 0.4rem;
  object-fit: cover;
  border: 1px solid var(--border);
}
.result-avatar.placeholder {
  background: rgba(255, 255, 255, 0.06);
}
.result-meta {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}
.result-name {
  font-family: "Cinzel", serif;
  font-size: 0.82rem;
  font-weight: 600;
}
.result-sub {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.65rem;
  color: var(--text-muted);
}
.result-arrow {
  color: var(--text-muted);
}

.empty-state,
.hint-state {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-muted);
  font-style: italic;
}
</style>

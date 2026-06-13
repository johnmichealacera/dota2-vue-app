<template>
  <section>
    <div class="page-banner glass-panel">
      <p class="eyebrow">Player Lookup</p>
      <h1>Search Players</h1>
      <p class="subtitle">Find any Dota 2 player by Steam name.</p>
    </div>

    <search-bar
      v-model="query"
      placeholder="Search players by name…"
      @update:modelValue="onQueryInput"
    />

    <error-banner v-if="error" :message="error" :on-retry="runSearch" />

    <dota-loader v-if="isLoading && !error" :isLoading="true" loaderType="home" />

    <div v-if="!isLoading && !error && query.trim().length >= 2" class="results-wrap">
      <p class="results-count">{{ results.length }} result{{ results.length === 1 ? '' : 's' }}</p>

      <div v-if="results.length" class="results-list">
        <router-link
          v-for="player in results"
          :key="player.accountId"
          :to="`/player/${player.accountId}`"
          class="result-row glass-panel"
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
            <span v-if="player.lastMatchTime" class="result-time">
              Last match {{ timeAgo(player.lastMatchTime) }}
            </span>
          </div>
          <span class="result-arrow">›</span>
        </router-link>
      </div>

      <p v-else class="empty-state">No players found for “{{ query.trim() }}”.</p>
    </div>

    <p v-if="!isLoading && query.trim().length < 2" class="hint-state">
      Type at least 2 characters to search.
    </p>
  </section>
</template>

<script>
// TODO: Re-enable player search page when OpenDota /search is fast and returns relevant names (uncomment route in router.js + NavBar UI)
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import SearchBar from '../components/SearchBar.vue';
import DotaLoader from '../components/Loader.vue';
import ErrorBanner from '../components/ErrorBanner.vue';
import { buildApiUrl } from '../config/api';

export default {
  name: 'SearchPage',
  components: { SearchBar, DotaLoader, ErrorBanner },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const query = ref(route.query.q?.toString() ?? '');
    const results = ref([]);
    const isLoading = ref(false);
    const error = ref('');
    let debounceTimer = null;

    const timeAgo = (ts) => {
      const secs = Math.floor(Date.now() / 1000) - ts;
      if (secs < 60) return `${secs}s ago`;
      const mins = Math.floor(secs / 60);
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      return `${Math.floor(hrs / 24)}d ago`;
    };

    const runSearch = () => {
      const q = query.value.trim();
      if (q.length < 2) {
        results.value = [];
        error.value = '';
        isLoading.value = false;
        return;
      }

      isLoading.value = true;
      error.value = '';

      axios.get(buildApiUrl('/search'), { params: { q } })
        .then((res) => {
          results.value = res.data ?? [];
          isLoading.value = false;
        })
        .catch(() => {
          error.value = 'Player search failed. The backend may still be deploying — try again shortly.';
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
      debounceTimer = setTimeout(runSearch, 350);
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

    return { query, results, isLoading, error, onQueryInput, runSearch, timeAgo };
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

.results-wrap { margin-top: 0.25rem; }
.results-count {
  margin: 0 0 0.65rem;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  border-radius: 0.65rem;
  text-decoration: none;
  color: inherit;
  transition: border-color 150ms ease, transform 150ms ease;
}
.result-row:hover {
  border-color: var(--border-strong);
  transform: translateX(2px);
}

.result-avatar {
  width: 44px;
  height: 44px;
  border-radius: 0.45rem;
  object-fit: cover;
  border: 1px solid var(--border);
}
.result-avatar.placeholder {
  background: rgba(255, 255, 255, 0.06);
}

.result-meta {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}
.result-name {
  font-family: "Cinzel", serif;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.result-time {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.68rem;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.result-arrow {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.empty-state,
.hint-state {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-muted);
  font-style: italic;
}
</style>

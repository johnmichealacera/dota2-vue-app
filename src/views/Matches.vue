<template>
  <section>
    <div class="page-banner glass-panel">
      <div class="banner-deco" aria-hidden="true">
        <span class="deco-rune">⬡</span>
        <span class="deco-rune sm">◆</span>
        <span class="deco-rune xs">⬡</span>
      </div>
      <p class="eyebrow">Live Feed</p>
      <h1>Pro Match Results</h1>
      <p class="subtitle">Latest competitive matches from the Dota 2 pro circuit — updated every few minutes.</p>
      <div class="banner-stats" v-if="!isLoading && !error">
        <span class="bstat">
          <span class="live-dot" aria-hidden="true"></span>
          <span class="bstat-val">{{ allMatches.length }}</span> Recent Matches
        </span>
        <span class="bstat-sep">·</span>
        <span class="bstat">Opens on OpenDota</span>
      </div>
    </div>

    <error-banner v-if="error" :message="error" :on-retry="fetchData" />

    <div v-if="isLoading && !error" class="skeleton-list">
      <div v-for="n in 10" :key="n" class="skeleton-row glass-panel"></div>
    </div>

    <div v-if="!isLoading && !error" class="match-list">
      <match-row
        v-for="(match, i) in pagedMatches"
        :key="match.matchId"
        :match="match"
        :style="{ animationDelay: `${i * 0.03}s` }"
      />
    </div>

    <p v-if="!isLoading && !error && pagedMatches.length === 0" class="empty-state">
      No recent pro matches found.
    </p>

    <vue-awesome-paginate
      v-if="!error && allMatches.length > pageSize"
      :total-items="allMatches.length"
      :items-per-page="pageSize"
      :max-pages-shown="5"
      v-model="currentPage"
      :on-click="onPageChange"
    />
  </section>
</template>

<script>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import MatchRow from '../components/MatchRow.vue';
import ErrorBanner from '../components/ErrorBanner.vue';
import { buildApiUrl } from '../config/api';

export default {
  name: 'DotaMatches',
  components: { MatchRow, ErrorBanner },
  setup() {
    const allMatches  = ref([]);
    const isLoading   = ref(false);
    const error       = ref('');
    const currentPage = ref(1);
    const pageSize    = 20;

    const fetchData = () => {
      isLoading.value = true;
      error.value = '';
      axios.get(buildApiUrl('/pro-matches'), { params: { pageSize: 999, page: 1 } })
        .then(response => {
          allMatches.value = response.data?.items ?? [];
          isLoading.value = false;
        })
        .catch(() => {
          error.value = 'Failed to load match results. The backend may be starting up — please retry in a moment.';
          isLoading.value = false;
        });
    };

    const pagedMatches = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return allMatches.value.slice(start, start + pageSize);
    });

    const onPageChange = (page) => { currentPage.value = page; };

    onMounted(fetchData);

    return { allMatches, isLoading, error, currentPage, pageSize, pagedMatches, fetchData, onPageChange };
  },
};
</script>

<style scoped>
.page-banner {
  border-radius: 0.85rem;
  padding: 1.75rem 1.75rem 1.5rem;
  text-align: left;
  margin-bottom: 1.25rem;
  position: relative;
  overflow: hidden;
}

.banner-deco {
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 0.6rem;
  align-items: center;
  pointer-events: none;
  user-select: none;
}
.deco-rune      { color: rgba(56, 189, 248, 0.1); font-size: 3.5rem; line-height: 1; }
.deco-rune.sm   { font-size: 2.2rem; color: rgba(56, 197, 122, 0.09); }
.deco-rune.xs   { font-size: 1.3rem; color: rgba(201, 53, 53, 0.1); }

.eyebrow {
  margin: 0 0 0.45rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.68rem;
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 600;
  color: #38bdf8;
}

h1 {
  margin: 0 0 0.5rem;
  font-size: clamp(1.5rem, 3.5vw, 2.4rem);
  background: linear-gradient(120deg, #ede8d8, #38bdf8 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: 0 0 0.9rem;
  color: var(--text-muted);
  max-width: 38rem;
  font-size: 0.9rem;
}

.banner-stats {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}
.bstat     { display: inline-flex; align-items: center; gap: 0.35rem; }
.bstat-sep { opacity: 0.4; }
.bstat-val { font-weight: 700; color: #38bdf8; }

/* Pulsing live dot */
.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #38c57a;
  box-shadow: 0 0 6px rgba(56, 197, 122, 0.8);
  animation: livePulse 1.8s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes livePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.7); }
}

/* Match list */
.match-list {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

/* Skeleton loader */
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.skeleton-row {
  height: 68px;
  border-radius: 0.7rem;
  background: linear-gradient(90deg,
    rgba(255,255,255,0.03) 25%,
    rgba(255,255,255,0.07) 50%,
    rgba(255,255,255,0.03) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
}

.empty-state {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-muted);
  font-style: italic;
}
</style>

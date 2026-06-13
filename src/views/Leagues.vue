<template>
  <section>
    <div class="page-banner glass-panel">
      <div class="banner-deco" aria-hidden="true">
        <span class="deco-rune">⬡</span>
        <span class="deco-rune sm">◆</span>
        <span class="deco-rune xs">⬡</span>
      </div>
      <p class="eyebrow">Tournaments</p>
      <h1>Leagues &amp; Events</h1>
      <p class="subtitle">Browse premium, professional, and amateur Dota 2 tournaments from the pro circuit.</p>
      <div class="banner-stats" v-if="!isLoading">
        <span class="bstat">
          <span class="bstat-val">{{ filteredLeagues.length }}</span>
          {{ searchQuery || activeTier !== 'all' ? 'results' : 'Leagues' }}
        </span>
      </div>
    </div>

    <error-banner v-if="error" :message="error" :on-retry="fetchData" />

    <div class="tier-tabs">
      <button
        v-for="tab in tierTabs"
        :key="tab.id"
        class="tier-tab"
        :class="{ active: activeTier === tab.id }"
        @click="setTier(tab.id)"
      >
        {{ tab.label }}
        <span class="tab-count">{{ tab.count }}</span>
      </button>
    </div>

    <search-bar
      v-model="searchQuery"
      placeholder="Search tournaments…"
      @update:modelValue="onSearchChange"
    />

    <div class="card-grid">
      <dota-loader :isLoading="isLoading" loaderType="home" />
      <league-card
        v-for="(league, i) in pagedLeagues"
        :key="league.leagueId"
        :league="league"
        :style="{ animationDelay: `${i * 0.03}s` }"
      />
    </div>

    <p v-if="!isLoading && pagedLeagues.length === 0" class="empty-state">
      No leagues match your filters.
    </p>

    <vue-awesome-paginate
      v-if="filteredLeagues.length > pageSize"
      :total-items="filteredLeagues.length"
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
import LeagueCard from '../components/LeagueCard.vue';
import DotaLoader from '../components/Loader.vue';
import SearchBar from '../components/SearchBar.vue';
import ErrorBanner from '../components/ErrorBanner.vue';
import { buildApiUrl } from '../config/api';

export default {
  name: 'DotaLeagues',
  components: { LeagueCard, DotaLoader, SearchBar, ErrorBanner },
  setup() {
    const allLeagues   = ref([]);
    const isLoading    = ref(false);
    const error        = ref('');
    const searchQuery  = ref('');
    const activeTier   = ref('all');
    const currentPage  = ref(1);
    const pageSize     = 24;

    const fetchData = () => {
      isLoading.value = true;
      error.value = '';
      axios.get(buildApiUrl('/leagues'), { params: { pageSize: 999, page: 1 } })
        .then((response) => {
          allLeagues.value = response.data?.items ?? [];
          isLoading.value = false;
        })
        .catch(() => {
          error.value = 'Failed to load leagues. The backend may still be deploying — try again shortly.';
          isLoading.value = false;
        });
    };

    const tierTabs = computed(() => {
      const counts = { all: allLeagues.value.length, premium: 0, professional: 0, amateur: 0 };
      for (const league of allLeagues.value) {
        const tier = (league.tier || '').toLowerCase();
        if (tier in counts) counts[tier] += 1;
      }
      return [
        { id: 'all', label: 'All', count: counts.all },
        { id: 'premium', label: 'Premium', count: counts.premium },
        { id: 'professional', label: 'Professional', count: counts.professional },
        { id: 'amateur', label: 'Amateur', count: counts.amateur },
      ];
    });

    const filteredLeagues = computed(() => {
      const q = searchQuery.value.trim().toLowerCase();
      return allLeagues.value.filter((league) => {
        const tier = (league.tier || '').toLowerCase();
        if (activeTier.value !== 'all' && tier !== activeTier.value) return false;
        if (!q) return true;
        return league.name?.toLowerCase().includes(q);
      });
    });

    const pagedLeagues = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return filteredLeagues.value.slice(start, start + pageSize);
    });

    const setTier = (tier) => {
      activeTier.value = tier;
      currentPage.value = 1;
    };

    const onSearchChange = () => { currentPage.value = 1; };
    const onPageChange = (page) => { currentPage.value = page; };

    onMounted(fetchData);

    return {
      allLeagues, isLoading, error, searchQuery, activeTier,
      tierTabs, filteredLeagues, pagedLeagues, currentPage, pageSize,
      fetchData, setTier, onSearchChange, onPageChange,
    };
  },
};
</script>

<style scoped>
.page-banner {
  border-radius: 0.85rem;
  padding: 0.7rem 1.1rem 0.6rem;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
}

.tier-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 0.85rem;
}

.tier-tab {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  background: rgba(12, 16, 34, 0.6);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 0.35rem 0.7rem;
  cursor: pointer;
  transition: all 160ms ease;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.tier-tab:hover {
  color: var(--text-soft);
  border-color: var(--border-strong);
}

.tier-tab.active {
  color: var(--accent-bright);
  border-color: var(--border-strong);
  background: rgba(200, 146, 42, 0.1);
}

.tab-count {
  font-size: 0.68rem;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.05);
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.85rem;
  margin-top: 0.85rem;
}

.empty-state {
  text-align: center;
  color: var(--text-muted);
  padding: 2rem 1rem;
  font-size: 0.9rem;
}
</style>

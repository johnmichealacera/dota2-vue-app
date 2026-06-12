<template>
  <section>
    <div class="page-banner glass-panel">
      <div class="banner-deco" aria-hidden="true">
        <span class="deco-rune">⬡</span>
        <span class="deco-rune sm">⬡</span>
        <span class="deco-rune xs">◆</span>
      </div>
      <p class="eyebrow">Hero Archive</p>
      <h1>Discover Every Hero</h1>
      <p class="subtitle">Browse hero profiles, base stats, and matchup insights across the full roster.</p>
      <div class="banner-stats" v-if="!isLoading">
        <span class="bstat"><span class="bstat-val">{{ allHeroes.length }}</span> Heroes</span>
        <span class="bstat-sep">·</span>
        <span class="bstat">
          <span class="bstat-val str-col">STR</span>
          · <span class="bstat-val agi-col">AGI</span>
          · <span class="bstat-val int-col">INT</span>
          · <span class="bstat-val uni-col">UNI</span>
        </span>
      </div>
    </div>

    <error-banner v-if="error" :message="error" :on-retry="fetchData" />

    <search-bar v-model="searchQuery" placeholder="Search heroes…" @update:modelValue="onFilterChange" />

    <attribute-filter-tabs
      v-model="activeFilter"
      :counts="attrCounts"
      @update:modelValue="onFilterChange"
    />

    <div class="card-grid">
      <dota-loader :isLoading="isLoading" loaderType="home" />
      <ImageCard
        v-for="(hero, i) in pagedHeroes"
        :key="hero.id"
        :itemData="hero"
        itemType="hero"
        :style="{ animationDelay: `${i * 0.03}s` }"
      />
    </div>

    <p v-if="!isLoading && pagedHeroes.length === 0" class="empty-state">
      No heroes match this filter.
    </p>

    <vue-awesome-paginate
      v-if="filteredHeroes.length > pageSize"
      :total-items="filteredHeroes.length"
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
import ImageCard from '../components/ImageCard.vue';
import DotaLoader from '../components/Loader.vue';
import AttributeFilterTabs from '../components/AttributeFilterTabs.vue';
import SearchBar from '../components/SearchBar.vue';
import ErrorBanner from '../components/ErrorBanner.vue';
import { buildApiUrl } from '../config/api';

export default {
  name: 'DotaHome',
  components: { ImageCard, DotaLoader, AttributeFilterTabs, SearchBar, ErrorBanner },
  setup() {
    const allHeroes    = ref([]);
    const isLoading    = ref(false);
    const error        = ref('');
    const activeFilter = ref('all');
    const searchQuery  = ref('');
    const currentPage  = ref(1);
    const pageSize     = 24;

    const fetchData = () => {
      isLoading.value = true;
      error.value = '';
      axios.get(buildApiUrl('/heroes'), { params: { pageSize: 999, page: 1 } })
        .then(response => {
          allHeroes.value = response.data?.items ?? [];
          isLoading.value = false;
        })
        .catch(() => {
          error.value = 'Failed to load heroes. The backend may be starting up — please retry in a moment.';
          isLoading.value = false;
        });
    };

    // Count per attribute for tab badges
    const attrCounts = computed(() => {
      const counts = { all: allHeroes.value.length, str: 0, agi: 0, int: 0, all_attr: 0 };
      for (const h of allHeroes.value) {
        const a = (h.primaryAttr || '').toLowerCase();
        if (a === 'str') counts.str++;
        else if (a === 'agi') counts.agi++;
        else if (a === 'int') counts.int++;
        else if (a === 'all') counts.all_attr++;
      }
      return counts;
    });

    // Client-side filtered list — attr tab + search query both apply
    const filteredHeroes = computed(() => {
      const q    = searchQuery.value.trim().toLowerCase();
      const attr = activeFilter.value;
      return allHeroes.value.filter(h => {
        const a = (h.primaryAttr || '').toLowerCase();
        const matchAttr = attr === 'all'
          ? true
          : attr === 'all_attr' ? a === 'all' : a === attr;
        const matchName = q ? (h.name || '').toLowerCase().includes(q) : true;
        return matchAttr && matchName;
      });
    });

    // Current page slice
    const pagedHeroes = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return filteredHeroes.value.slice(start, start + pageSize);
    });

    const onFilterChange = () => { currentPage.value = 1; };
    const onPageChange   = (page) => { currentPage.value = page; };

    onMounted(fetchData);

    return {
      allHeroes, isLoading, error, activeFilter, searchQuery,
      attrCounts, filteredHeroes, pagedHeroes,
      currentPage, pageSize,
      fetchData, onFilterChange, onPageChange,
    };
  },
};
</script>

<style scoped>
.page-banner {
  border-radius: 0.85rem;
  padding: 0.7rem 1.1rem 0.6rem;
  text-align: left;
  margin-bottom: 0.5rem;
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

.deco-rune      { color: rgba(232, 168, 56, 0.12); font-size: 3.5rem; line-height: 1; }
.deco-rune.sm   { font-size: 2.2rem; color: rgba(201, 53, 53, 0.1); }
.deco-rune.xs   { font-size: 1.3rem; color: rgba(14, 184, 154, 0.1); }

.eyebrow {
  margin: 0 0 0.15rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.58rem;
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 600;
  color: var(--accent-bright);
}

h1 {
  margin: 0 0 0.2rem;
  font-size: clamp(1.05rem, 2vw, 1.5rem);
  background: linear-gradient(120deg, #ede8d8, #e8a838 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: 0 0 0.35rem;
  color: var(--text-muted);
  max-width: 38rem;
  font-size: 0.78rem;
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
.bstat     { display: inline-flex; align-items: center; gap: 0.3rem; }
.bstat-sep { opacity: 0.4; }
.bstat-val { font-weight: 700; color: var(--text-soft); }
.str-col   { color: var(--str); }
.agi-col   { color: var(--agi); }
.int-col   { color: var(--int); }
.uni-col   { color: var(--uni); }

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
  gap: 0.85rem;
}

.empty-state {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-muted);
  font-style: italic;
}
</style>

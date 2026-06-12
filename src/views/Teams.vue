<template>
  <section>
    <div class="page-banner glass-panel">
      <div class="banner-deco" aria-hidden="true">
        <span class="deco-rune">⬡</span>
        <span class="deco-rune sm">◆</span>
        <span class="deco-rune xs">⬡</span>
      </div>
      <p class="eyebrow">Pro Circuit</p>
      <h1>Professional Teams</h1>
      <p class="subtitle">Track ratings, win/loss records, and recent match history for top competing organisations.</p>
      <div class="banner-stats" v-if="!isLoading">
        <span class="bstat">
          <span class="bstat-val">{{ filteredTeams.length }}</span>
          {{ searchQuery ? 'results' : 'Teams' }}
        </span>
        <span class="bstat-sep">·</span>
        <span class="bstat">Live Standings</span>
      </div>
    </div>

    <search-bar v-model="searchQuery" placeholder="Search teams…" @update:modelValue="onSearchChange" />

    <div class="card-grid">
      <dota-loader :isLoading="isLoading" loaderType="home" />
      <ImageCard
        v-for="(team, i) in pagedTeams"
        :key="team.id"
        :itemData="team"
        itemType="team"
        :style="{ animationDelay: `${i * 0.03}s` }"
      />
    </div>

    <p v-if="!isLoading && pagedTeams.length === 0" class="empty-state">
      No teams match your search.
    </p>

    <vue-awesome-paginate
      v-if="filteredTeams.length > pageSize"
      :total-items="filteredTeams.length"
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
import SearchBar from '../components/SearchBar.vue';
import { buildApiUrl } from '../config/api';

export default {
  name: 'DotaTeams',
  components: { DotaLoader, ImageCard, SearchBar },
  setup() {
    const allTeams    = ref([]);
    const isLoading   = ref(false);
    const searchQuery = ref('');
    const currentPage = ref(1);
    const pageSize    = 30;

    const fetchData = () => {
      isLoading.value = true;
      axios.get(buildApiUrl('/pro-teams'), { params: { pageSize: 999, page: 1 } })
        .then(response => {
          allTeams.value  = response.data?.items ?? [];
          isLoading.value = false;
        })
        .catch(err => console.error(err));
    };

    const filteredTeams = computed(() => {
      const q = searchQuery.value.trim().toLowerCase();
      if (!q) return allTeams.value;
      return allTeams.value.filter(t =>
        (t.name || '').toLowerCase().includes(q) ||
        (t.tag  || '').toLowerCase().includes(q)
      );
    });

    const pagedTeams = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return filteredTeams.value.slice(start, start + pageSize);
    });

    const onSearchChange = () => { currentPage.value = 1; };
    const onPageChange   = (page) => { currentPage.value = page; };

    onMounted(fetchData);

    return {
      allTeams, isLoading, searchQuery,
      filteredTeams, pagedTeams,
      currentPage, pageSize,
      onSearchChange, onPageChange,
    };
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

.deco-rune      { color: rgba(232, 168, 56, 0.12); font-size: 3.5rem; line-height: 1; }
.deco-rune.sm   { font-size: 2.2rem; color: rgba(14, 184, 154, 0.1); }
.deco-rune.xs   { font-size: 1.3rem; color: rgba(201, 53, 53, 0.1); }

.eyebrow {
  margin: 0 0 0.45rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.68rem;
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 600;
  color: var(--teal);
}

h1 {
  margin: 0 0 0.5rem;
  font-size: clamp(1.5rem, 3.5vw, 2.4rem);
  background: linear-gradient(120deg, #ede8d8, var(--teal) 90%);
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
.bstat     { display: inline-flex; align-items: center; gap: 0.3rem; }
.bstat-sep { opacity: 0.4; }
.bstat-val { font-weight: 700; color: var(--teal); }

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

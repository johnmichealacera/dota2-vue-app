<template>
  <section>
    <div class="page-banner glass-panel">
      <div class="banner-deco" aria-hidden="true">
        <span class="deco-rune">⬡</span>
        <span class="deco-rune sm">◆</span>
        <span class="deco-rune xs">⬡</span>
      </div>
      <p class="eyebrow">Pro Circuit</p>
      <h1>Professional Players</h1>
      <p class="subtitle">The world's top Dota 2 players — track their teams, roles, and countries.</p>
      <div class="banner-stats" v-if="!isLoading && !error">
        <span class="bstat"><span class="bstat-val">{{ paginationData.totalPlayers }}</span> Players</span>
        <span class="bstat-sep">·</span>
        <span class="bstat">
          <span class="bstat-val core-col">Core</span>
          &amp;
          <span class="bstat-val supp-col">Support</span>
        </span>
      </div>
    </div>

    <error-banner v-if="error" :message="error" :on-retry="() => fetchData(currentPage)" />

    <!-- Loading skeleton -->
    <div v-else-if="isLoading" class="card-grid">
      <dota-loader :isLoading="isLoading" loaderType="home" />
    </div>

    <!-- Players grid -->
    <div v-else class="card-grid">
      <PlayerCard
        v-for="(player, i) in proPlayers"
        :key="player.accountId || i"
        :player="player"
        :style="{ animationDelay: `${i * 0.025}s` }"
      />
    </div>

    <p v-if="!isLoading && !error && proPlayers.length === 0" class="empty-state">
      No pro player data available right now.
    </p>

    <vue-awesome-paginate
      v-if="!error && paginationData.totalPlayers > 0"
      :total-items="paginationData.totalPlayers"
      :items-per-page="paginationData.pageSize"
      :max-pages-shown="5"
      v-model="currentPage"
      :on-click="onClickHandler"
    />
  </section>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import PlayerCard from '../components/PlayerCard.vue';
import DotaLoader from '../components/Loader.vue';
import ErrorBanner from '../components/ErrorBanner.vue';
import { buildApiUrl } from '../config/api';

export default {
  name: 'DotaPlayers',
  components: { PlayerCard, DotaLoader, ErrorBanner },
  setup() {
    const proPlayers = ref([]);
    const isLoading = ref(false);
    const error = ref(null);
    const currentPage = ref(1);
    const paginationData = ref({
      totalPlayers: 0,
      currentPage: 1,
      pageSize: 24,
      totalPages: 1,
    });

    const fetchData = (page = 1) => {
      isLoading.value = true;
      error.value = null;
      axios.get(buildApiUrl('/pro-players'), { params: { pageSize: 24, page } })
        .then(response => {
          const data = response.data;
          proPlayers.value = data?.items ?? [];
          paginationData.value = {
            totalPlayers: data?.pagination?.totalItems ?? 0,
            currentPage:  data?.pagination?.currentPage ?? 1,
            pageSize:     data?.pagination?.pageSize ?? 24,
            totalPages:   data?.pagination?.totalPages ?? 1,
          };
          isLoading.value = false;
        })
        .catch(err => {
          console.error(err);
          error.value = 'Could not load pro players. Check your connection or backend.';
          isLoading.value = false;
        });
    };

    const onClickHandler = (page) => fetchData(page);

    onMounted(() => fetchData(1));

    return { proPlayers, isLoading, error, currentPage, paginationData, fetchData, onClickHandler };
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
.deco-rune.sm   { font-size: 2.2rem; color: rgba(155, 114, 219, 0.1); }
.deco-rune.xs   { font-size: 1.3rem; color: rgba(14, 184, 154, 0.1); }

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
  background: linear-gradient(120deg, #ede8d8, #9b72db 90%);
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
.bstat-val { font-weight: 700; }
.core-col  { color: var(--crimson); }
.supp-col  { color: var(--teal); }

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

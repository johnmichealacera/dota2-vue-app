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
      <div class="banner-stats">
        <span class="bstat"><span class="bstat-val">{{ paginationData.totalHeroes }}</span> Heroes</span>
        <span class="bstat-sep">·</span>
        <span class="bstat"><span class="bstat-val str-col">STR</span> · <span class="bstat-val agi-col">AGI</span> · <span class="bstat-val int-col">INT</span></span>
      </div>
    </div>

    <div class="card-grid">
      <dota-loader :isLoading="isLoading" loaderType="home" />
      <ImageCard
        v-for="(hero, i) in heroes"
        :key="hero.id"
        :itemData="hero"
        itemType="hero"
        :style="{ animationDelay: `${i * 0.035}s` }"
      />
    </div>

    <p v-if="!isLoading && heroes.length === 0" class="empty-state">No heroes available right now. Try refreshing.</p>

    <vue-awesome-paginate
      :total-items="paginationData.totalHeroes"
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
import ImageCard from '../components/ImageCard.vue';
import DotaLoader from '../components/Loader.vue';
import { buildApiUrl } from '../config/api';

export default {
  name: 'DotaHome',
  components: { ImageCard, DotaLoader },
  setup() {
    const currentPage = ref(1);
    const paginationData = ref({ totalHeroes: 0, currentPage: 1, pageSize: 10, totalPages: 1 });
    const heroes = ref([]);
    const isLoading = ref(false);

    const fetchData = (page = 1) => {
      isLoading.value = true;
      axios.get(buildApiUrl('/heroes'), { params: { pageSize: 30, page } })
        .then(response => {
          heroes.value = response.data?.items;
          paginationData.value = {
            totalHeroes: response.data?.pagination?.totalItems,
            currentPage:  response.data?.pagination?.currentPage,
            pageSize:     response.data?.pagination?.pageSize,
            totalPages:   response.data?.pagination?.totalPages,
          };
          isLoading.value = false;
        })
        .catch(err => console.error(err));
    };

    onMounted(() => fetchData(currentPage.value));

    return {
      heroes,
      isLoading,
      onClickHandler: (page) => fetchData(page),
      currentPage,
      paginationData,
    };
  }
}
</script>

<style scoped>
.page-banner {
  border-radius: 0.85rem;
  padding: 1.75rem 1.75rem 1.5rem;
  text-align: left;
  margin-bottom: 1.5rem;
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

.deco-rune {
  color: rgba(232, 168, 56, 0.12);
  font-size: 3.5rem;
  line-height: 1;
}
.deco-rune.sm { font-size: 2.2rem; color: rgba(201, 53, 53, 0.1); }
.deco-rune.xs { font-size: 1.3rem; color: rgba(14, 184, 154, 0.1); }

.eyebrow {
  margin: 0 0 0.45rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.68rem;
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 600;
  color: var(--accent-bright);
}

h1 {
  margin: 0 0 0.5rem;
  font-size: clamp(1.5rem, 3.5vw, 2.4rem);
  background: linear-gradient(120deg, #ede8d8, #e8a838 80%);
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
.bstat { display: inline-flex; align-items: center; gap: 0.3rem; }
.bstat-sep { opacity: 0.4; }
.bstat-val { font-weight: 700; color: var(--text-soft); }
.str-col { color: var(--str); }
.agi-col { color: var(--agi); }
.int-col { color: var(--int); }

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

<template>
  <section>
    <div class="hero glass-panel">
      <p class="eyebrow">Competitive</p>
      <h1>Track pro teams and current form</h1>
      <p class="subtitle">Scan ratings, win/loss records, and recent activity in a compact modern grid.</p>
    </div>
    <div class="card-grid">
      <dota-loader :isLoading="isLoading" loaderType="home" />
      <ImageCard v-for="team in proTeams" :key="team.id" :itemData="team" itemType="team"/>
    </div>
    <p v-if="!isLoading && proTeams.length === 0" class="empty-state">No teams found. Try again in a moment.</p>
    <vue-awesome-paginate
      :total-items="paginationData.totalTeams"
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
  name: 'DotaTeams',
  components: {
    DotaLoader,
    ImageCard,
  },
  setup() {
    const proTeams = ref([]);
    const isLoading = ref(false);
    const onClickHandler = (page) => {
      fetchData(page);
    };
    const currentPage = ref(1);
    const paginationData = ref({
      totalTeams: 0,
      currentPage: 1,
      pageSize: 10,
      totalPages: 1
    });
    const fetchData = (page = 1) => {
      isLoading.value = true;
      axios.get(buildApiUrl('/pro-teams'), { params: { pageSize: 30, page } })
      .then(response => {
        proTeams.value = response.data?.items;
        paginationData.value = {
          totalTeams: response.data?.pagination?.totalItems,
          currentPage: response.data?.pagination?.currentPage,
          pageSize: response.data?.pagination?.pageSize,
          totalPages: response.data?.pagination?.totalPages
        };
        isLoading.value = false;
      })
      .catch(error => {
        console.log('error', error);
      });
    }
    
    onMounted(() => {
      fetchData(currentPage.value);
    })

    return {
      proTeams,
      isLoading,
      onClickHandler,
      currentPage,
      paginationData,
    };
  }
}
</script>
<style scoped>
.hero {
  border-radius: 1.25rem;
  padding: 1.4rem;
  text-align: left;
  margin-bottom: 1.25rem;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.7rem;
  color: var(--accent-strong);
}

h1 {
  margin: 0.35rem 0 0.4rem;
  font-size: clamp(1.4rem, 3vw, 2.25rem);
}

.subtitle {
  margin: 0;
  color: var(--text-muted);
  max-width: 42rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
  gap: 0.95rem;
}

.empty-state {
  text-align: center;
  margin-top: 1rem;
  color: var(--text-muted);
}
</style>
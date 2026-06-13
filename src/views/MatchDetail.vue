<template>
  <section>
    <nav class="breadcrumb">
      <router-link to="/matches" class="bc-link">Matches</router-link>
      <span class="bc-sep">›</span>
      <span class="bc-current">Match {{ matchId }}</span>
    </nav>

    <error-banner
      v-if="error"
      :message="error"
      :on-retry="fetchMatch"
    />

    <dota-loader v-if="isLoading && !error" :isLoading="true" loaderType="detail" />

    <match-scoreboard v-if="match && !isLoading && !error" :match="match" />
  </section>
</template>

<script>
import axios from 'axios';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import MatchScoreboard from '../components/MatchScoreboard.vue';
import DotaLoader from '../components/Loader.vue';
import ErrorBanner from '../components/ErrorBanner.vue';
import { buildApiUrl } from '../config/api';

export default {
  name: 'MatchDetail',
  components: { MatchScoreboard, DotaLoader, ErrorBanner },
  setup() {
    const route = useRoute();
    const match = ref(null);
    const isLoading = ref(false);
    const error = ref('');
    const matchId = ref(route.params.id);

    const fetchMatch = () => {
      const id = route.params.id;
      if (!id) return;

      isLoading.value = true;
      error.value = '';
      match.value = null;
      matchId.value = id;

      axios.get(buildApiUrl(`/match/${id}`))
        .then((response) => {
          match.value = response.data;
          isLoading.value = false;
        })
        .catch(() => {
          error.value = 'Failed to load match scoreboard. The backend may still be deploying — try again shortly.';
          isLoading.value = false;
        });
    };

    watch(() => route.params.id, fetchMatch, { immediate: true });

    return { match, isLoading, error, matchId, fetchMatch };
  },
};
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 1rem;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.bc-link {
  color: #38bdf8;
  transition: opacity 150ms ease;
}
.bc-link:hover { opacity: 0.75; }
.bc-sep     { color: var(--text-muted); }
.bc-current { color: var(--text-muted); }
</style>

<template>
  <section class="details-wrap">
    <div v-if="isLoading" class="flex loader">
      <dota-loader :isLoading="isLoading" class="grow-0"/>
      <dota-loader :isLoading="isLoading" class="grow"/>
    </div>
    <div class="main-card glass-panel" v-if="!isLoading && itemType === 'hero'">
      <img :src="mainItem.img" :alt="mainItem.name" />
      <h2>{{ mainItem.name }}</h2>
      <ul>
        <li class="hidden sm:block">Primary Attribute: {{ mainItem.primaryAttr }}</li>
        <li class="sm:hidden block">PA: {{ mainItem.primaryAttr }}</li>
        <li class="hidden sm:block">Attack Type: {{ mainItem.attackType }}</li>
        <li class="sm:hidden block">AT: {{ mainItem.attackType }}</li>
        <!-- <li>Roles: {{ mainItem.roles.join(', ') }}</li> -->
        <li>Health: {{ mainItem.health }}</li>
        <li>Mana: {{ mainItem.baseMana }}</li>
        <li>Armor: {{ mainItem.baseArmor }}</li>
        <li class="hidden sm:block">Magic Resistance: {{ mainItem.baseMr }}%</li>
        <li class="sm:hidden block">MR: {{ mainItem.baseMr }}%</li>
        <li class="hidden sm:block">Attack Range: {{ mainItem.attackRange }}</li>
        <li class="sm:hidden block">AR: {{ mainItem.attackRange }}</li>
        <li class="hidden sm:block">Attack Speed: {{ mainItem.attackRate }}</li>
        <li class="sm:hidden block">AS: {{ mainItem.attackRate }}</li>
        <li class="hidden sm:block">Movement Speed: {{ mainItem.moveSpeed }}</li>
        <li class="sm:hidden block">MS: {{ mainItem.moveSpeed }}</li>
      </ul>
    </div>
    <div class="main-card glass-panel" v-if="!isLoading && itemType === 'team'">
      <fallback :imageUrl="mainItem.img" />
      <h2>{{ mainItem.name }}</h2>
      <ul>
        <li class="hidden sm:block">Rating: {{ mainItem.rating }}</li>
        <li class="sm:hidden block">Rtg: {{ mainItem.rating }}</li>
        <li>Tag: {{ mainItem.tag }}</li>
        <li>Wins: {{ mainItem.wins }}</li>
        <li>Losses: {{ mainItem.losses }}</li>
        <li class="hidden sm:block">Last Match: {{ mainItem.lastMatchTime }}</li>
        <li class="sm:hidden block">LM: {{ mainItem.lastMatchTime }}</li>
      </ul>
    </div>
    <div class="matchup-card glass-panel" v-if="!isLoading">
      <h1>{{ itemType === 'hero' ? 'Hero Matchups' : 'Team Matchups' }}</h1>
      <div class="matchup-grid">
        <div v-for="item in itemMatchups" :key="item.id">
          <div class="matchup-item">
            <router-link v-if="item" :to="{ name: 'ItemCard', params: { id: item.id, type: 'hero' } }">
              <fallback :imageUrl="item.img" />
              <div class="meta">
                <div class="name">
                  {{ item.name }}
                </div>
                <p>Games: {{ item.gamesPlayed }}</p>
                <p>Wins: {{ item.wins }}</p>
                <p>Win rate: {{ item.winRate.toFixed(1) }}%</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <p v-if="itemMatchups.length === 0" class="empty-state">No matchup data found for this item.</p>
    </div>
  </section>
  <vue-awesome-paginate
    :total-items="paginationData.totalTeams"
    :items-per-page="paginationData.pageSize"
    :max-pages-shown="5"
    v-model="currentPage"
    :on-click="onClickHandler"
  />
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import DotaLoader from './Loader.vue';
import Fallback from './Fallback.vue';
import { buildApiUrl } from '../config/api';

export default defineComponent({
  name: 'ItemCard',
  components: {
    DotaLoader,
    Fallback,
  },
  setup() {
    const mainItem = ref([]);
    const itemMatchups = ref([]);
    const route = useRoute();
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
    const fetchData = (page) => {
      isLoading.value = true;
      if (route.params.type === 'hero') {
        axios.get(buildApiUrl(`/hero/${route.params.id}`))
        .then(response => {
          mainItem.value = response.data;
        })
        .catch(error => {
          console.error('error', error);
        });

      axios.get(buildApiUrl(`/hero-matchup/${route.params.id}`), { params: { pageSize: 18, page } })
        .then(response => {
          itemMatchups.value = response.data?.items;
          paginationData.value = {
            totalTeams: response.data?.pagination?.totalItems,
            currentPage: response.data?.pagination?.currentPage,
            pageSize: response.data?.pagination?.pageSize,
            totalPages: response.data?.pagination?.totalPages
          };
          isLoading.value = false;
        })
        .catch(error => {
          console.error('error', error);
        });
      }
      else if (route.params.type === 'team') {
        axios.get(buildApiUrl(`/team/${route.params.id}`))
        .then(response => {
          mainItem.value = response.data;
        })
        .catch(error => {
          console.error('error', error);
        });
        axios.get(buildApiUrl(`/team-matchup/${route.params.id}`), { params: { pageSize: 18, page } })
        .then(response => {
          itemMatchups.value = response.data?.items;
          paginationData.value = {
            totalTeams: response.data?.pagination?.totalItems,
            currentPage: response.data?.pagination?.currentPage,
            pageSize: response.data?.pagination?.pageSize,
            totalPages: response.data?.pagination?.totalPages
          };
          isLoading.value = false;
        })
        .catch(error => {
          console.error('error', error);
        });
      }
    }

    watch(() => route.params.id, () => {
      fetchData(currentPage.value);
    }, { immediate: true });

    return {
      mainItem,
      itemMatchups,
      isLoading,
      itemType: route.params.type,
      onClickHandler,
      currentPage,
      paginationData,
    };
  }
});
</script>

<style>
.hero-card {
  display: grid;
  grid-template-columns: minmax(220px, 300px) 1fr;
  gap: 1rem;
  align-items: start;
}

.details-wrap {
  display: grid;
  grid-template-columns: minmax(220px, 300px) 1fr;
  gap: 1rem;
}

.main-card,
.matchup-card {
  border-radius: 1rem;
  padding: 1rem;
}

.main-card img {
  max-width: 120px;
  border-radius: 0.75rem;
}

.main-card h2 {
  margin: 0.7rem 0 0.55rem;
  font-size: 1.1rem;
}

.main-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  color: var(--text-muted);
  font-size: 0.78rem;
  display: grid;
  gap: 0.35rem;
}

.matchup-card h1 {
  margin: 0 0 0.9rem;
}

.matchup-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.75rem;
}

.matchup-item {
  border: 1px solid var(--border);
  border-radius: 0.8rem;
  padding: 0.55rem;
  background: rgba(10, 16, 30, 0.8);
  transition: transform 170ms ease, border-color 170ms ease;
}

.matchup-item:hover {
  transform: translateY(-2px);
  border-color: rgba(143, 188, 255, 0.5);
}

.meta {
  margin-top: 0.5rem;
  text-align: center;
}

.name {
  font-weight: 700;
  font-size: 0.8rem;
}

.meta p {
  margin: 0.2rem 0 0;
  color: var(--text-muted);
  font-size: 0.72rem;
}

.loader {
  width: 100%;
  grid-column: 1 / -1;
}

.empty-state {
  text-align: center;
  color: var(--text-muted);
  margin-top: 0.8rem;
}

@media (max-width: 900px) {
  .details-wrap {
    grid-template-columns: 1fr;
  }
}
</style>

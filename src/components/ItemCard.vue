<template>
  <div class="hero-card">
    <div v-if="isLoading" class="flex loader">
      <dota-loader :isLoading="isLoading" class="grow-0"/>
      <dota-loader :isLoading="isLoading" class="grow"/>
    </div>
    <div class="self-start border-2" v-if="!isLoading && itemType === 'hero'">
      <img :src="mainItem.img" :alt="mainItem.name" />
      <h2 class="text-xs sm:text-2xl font-bold sm:font-bold">{{ mainItem.name }}</h2>
      <ul class="text-xxs sm:text-xl">
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
    <div class="self-start border-2" v-if="!isLoading && itemType === 'team'">
      <fallback :imageUrl="mainItem.img" />
      <h2 class="text-xs sm:text-2xl font-bold sm:font-bold">{{ mainItem.name }}</h2>
      <ul class="text-xxs sm:text-xl">
        <li class="hidden sm:block">Rating: {{ mainItem.rating }}</li>
        <li class="sm:hidden block">Rtg: {{ mainItem.rating }}</li>
        <li>Tag: {{ mainItem.tag }}</li>
        <li>Wins: {{ mainItem.wins }}</li>
        <li>Losses: {{ mainItem.losses }}</li>
        <li class="hidden sm:block">Last Match: {{ mainItem.lastMatchTime }}</li>
        <li class="sm:hidden block">LM: {{ mainItem.lastMatchTime }}</li>
      </ul>
    </div>
    <div class="border-2" v-if="!isLoading">
      <h1>Hero Matchups</h1>
      <div class="grid grid-cols-6 sm:gap-4">
        <div v-for="item in itemMatchups" :key="item.id">
          <div>
            <router-link v-if="item" :to="{ name: 'ItemCard', params: { id: item.id } }">
              <fallback :imageUrl="item.img" />
              <div class="sm:px-6 sm:py-4">
                <div class="text-xxs font-semibold sm:font-bold sm:text-base sm:mb-2 hover:underline">
                  {{ item.name }}
                </div>
                <p class="text-xxs sm:text-base">Games played: {{ item.gamesPlayed }}</p>
                <p class="text-xxs sm:text-base">Wins: {{ item.wins }}</p>
                <p class="text-xxs sm:text-base">Win rate: {{ item.winRate.toFixed(1) }}%</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
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
        axios.get(`${process.env.VUE_APP_DOTA_BACKEND_API}/hero/${route.params.id}`)
        .then(response => {
          mainItem.value = response.data;
        })
        .catch(error => {
          console.error('error', error);
        });

      axios.get(`${process.env.VUE_APP_DOTA_BACKEND_API}/hero-matchup/${route.params.id}`, { params: { pageSize: 18, page } })
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
        axios.get(`${process.env.VUE_APP_DOTA_BACKEND_API}/team/${route.params.id}`)
        .then(response => {
          mainItem.value = response.data;
        })
        .catch(error => {
          console.error('error', error);
        });
        axios.get(`${process.env.VUE_APP_DOTA_BACKEND_API}/team-matchup/${route.params.id}`, { params: { pageSize: 18, page } })
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
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0f0f0f;
  color: #63a2e2;
  /* padding: 1rem; */
  border-radius: 0.5rem;
}

.hero-card img {
  max-width: 100%;
  border-radius: 0.5rem;
}

.loader {
  width: 100vw;
}
</style>

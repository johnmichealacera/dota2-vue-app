<template>
  <div class="hero-card">
    <dota-loader :isLoading="isLoading"/>
    <div class="self-start border-2"  v-if="!isLoading">
      <img :src="hero.img" :alt="hero.name" />
      <h2 class="text-xs sm:text-2xl font-bold sm:font-bold">{{ hero.name }}</h2>
      <ul class="text-xxs sm:text-xl">
        <li class="hidden sm:block">Primary Attribute: {{ hero.primaryAttr }}</li>
        <li class="sm:hidden block">PA: {{ hero.primaryAttr }}</li>
        <li class="hidden sm:block">Attack Type: {{ hero.attackType }}</li>
        <li class="sm:hidden block">AT: {{ hero.attackType }}</li>
        <!-- <li>Roles: {{ hero.roles.join(', ') }}</li> -->
        <li>Health: {{ hero.health }}</li>
        <li>Mana: {{ hero.baseMana }}</li>
        <li>Armor: {{ hero.baseArmor }}</li>
        <li class="hidden sm:block">Magic Resistance: {{ hero.baseMr }}%</li>
        <li class="sm:hidden block">MR: {{ hero.baseMr }}%</li>
        <li class="hidden sm:block">Attack Range: {{ hero.attackRange }}</li>
        <li class="sm:hidden block">AR: {{ hero.attackRange }}</li>
        <li class="hidden sm:block">Attack Speed: {{ hero.attackRate }}</li>
        <li class="sm:hidden block">AS: {{ hero.attackRate }}</li>
        <li class="hidden sm:block">Movement Speed: {{ hero.moveSpeed }}</li>
        <li class="sm:hidden block">MS: {{ hero.moveSpeed }}</li>
      </ul>
    </div>
    <dota-loader :isLoading="isLoading"/>
    <div class="border-2"  v-if="!isLoading">
      <h1>Hero Matchups</h1>
      <div class="grid grid-cols-6 sm:gap-4">
        <div v-for="hero in heroMatchups" :key="hero.id">
          <div>
            <router-link v-if="hero" :to="{ name: 'HeroCard', params: { id: hero.id } }">
              <img class="w-full group-hover:opacity-30" :src="hero.img" alt="Dota hero">
              <div class="sm:px-6 sm:py-4">
                <div class="text-xxs font-semibold sm:font-bold sm:text-base sm:mb-2 hover:underline">
                  {{ hero.name }}
                </div>
                <p class="text-xxs sm:text-base">Games played: {{ hero.gamesPlayed }}</p>
                <p class="text-xxs sm:text-base">Wins: {{ hero.wins }}</p>
                <p class="text-xxs sm:text-base">Win rate: {{ hero.winRate.toFixed(1) }}%</p>
              </div>
            </router-link>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import DotaLoader from './Loader.vue';

export default defineComponent({
  name: 'HeroCard',
  components: {
    DotaLoader,
  },
  setup() {
    const hero = ref([]);
    const heroMatchups = ref([]);
    const route = useRoute();
    const isLoading = ref(false);
    const fetchData = () => {
      isLoading.value = true;
      axios.get(`http://localhost:8000/hero/${route.params.id}`)
        .then(response => {
          hero.value = response.data;
        })
        .catch(error => {
          console.log('error', error);
        });

      axios.get(`http://localhost:8000/hero-matchup/${route.params.id}`)
        .then(response => {
          heroMatchups.value = response.data;
          isLoading.value = false;
        })
        .catch(error => {
          console.log('error', error);
        });
    }

    watch(() => route.params.id, () => {
      fetchData();
    }, { immediate: true });

    return {
      hero,
      heroMatchups,
      isLoading
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
</style>

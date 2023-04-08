<template>
  <div>
    <h1 class="text-base sm:text-3xl font-bold text-center sm:my-4">Explore the World of Dota Pro Players</h1>
    <div class="grid grid-cols-10 sm:gap-4">
      <dota-loader :isLoading="isLoading" loaderType="home"/>
      <!-- <ImageCard v-for="hero in heroes" :key="hero.id" :heroData="hero"/> -->
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
// import ImageCard from '../components/ImageCard.vue';
import DotaLoader from '../components/Loader.vue';

export default {
  name: 'DotaPlayers',
  components: {
    // ImageCard,
    DotaLoader,
  },
  setup() {
    const proPlayers = ref([]);
    const isLoading = ref(false);
    const fetchData = () => {
      isLoading.value = true;
      axios.get(`${process.env.VUE_APP_DOTA_BACKEND_API}/pro-players`)
      .then(response => {
        // handle response
        proPlayers.value = response.data;
        isLoading.value = false;
      })
      .catch(error => {
        // handle error
        console.log('error', error);
      });
    }
    
    onMounted(() => {
      fetchData();
    })

    return {
      proPlayers,
      isLoading,
    };
  }
}
</script>
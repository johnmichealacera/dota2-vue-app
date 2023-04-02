<template>
  <div>
    <h1 class="text-xl sm:text-3xl font-bold text-center sm:my-4">Explore the World of Dota Heroes</h1>
    <div class="grid grid-cols-10 sm:gap-4 overflow-y-scroll scrollbar-thumb-red scrollbar-track-gray-200">
      <dota-loader :isLoading="isLoading"/>
      <ImageCard v-for="hero in heroes" :key="hero.id" :heroData="hero"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import ImageCard from '../components/ImageCard.vue';
import DotaLoader from '../components/Loader.vue';

export default {
  name: 'DotaHome',
  components: {
    ImageCard,
    DotaLoader,
  },
  setup() {
    const heroes = ref([]);
    const isLoading = ref(false);
    const fetchData = () => {
      isLoading.value = true;
      axios.get('http://localhost:8000/heroes')
      .then(response => {
        // handle response
        heroes.value = response.data;
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
      heroes,
      isLoading,
    };
  }
}
</script>
<style scoped>
.scrollbar-thumb-red {
  scrollbar-color: red;
}

.scrollbar-track-gray-200 {
  scrollbar-track-color: #edf2f7;
}
</style>
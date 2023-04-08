<template>
  <div>
    <h1 class="text-base sm:text-3xl font-bold text-center sm:my-4">Dota Teams</h1>
    <div class="grid grid-cols-10 sm:gap-4">
      <dota-loader :isLoading="isLoading" loaderType="home"/>
      <!-- <img :src="team.logo_url" alt="no image" v-for="team in proTeams" :key="team.id" class="team-img"> -->
      <ImageCard v-for="team in proTeams" :key="team.id" :itemData="team" itemType="team"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import ImageCard from '../components/ImageCard.vue';
import DotaLoader from '../components/Loader.vue';

export default {
  name: 'DotaTeams',
  components: {
    DotaLoader,
    ImageCard,
  },
  setup() {
    const proTeams = ref([]);
    const isLoading = ref(false);
    const fetchData = () => {
      isLoading.value = true;
      axios.get(`${process.env.VUE_APP_DOTA_BACKEND_API}/pro-teams`)
      .then(response => {
        // handle response
        proTeams.value = response.data;
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
      proTeams,
      isLoading,
    };
  }
}
</script>
<style scoped>
.team-img {
  width: 77px;
  height: 43px;
}
</style>
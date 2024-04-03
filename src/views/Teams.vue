<template>
  <div>
    <h1 class="text-base sm:text-3xl font-bold text-center sm:my-4">Dota Teams</h1>
    <div class="grid grid-cols-10 sm:gap-4">
      <dota-loader :isLoading="isLoading" loaderType="home"/>
      <!-- <img :src="team.logo_url" alt="no image" v-for="team in proTeams" :key="team.id" class="team-img"> -->
      <ImageCard v-for="team in proTeams" :key="team.id" :itemData="team" itemType="team"/>
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
      axios.get(`${process.env.VUE_APP_DOTA_BACKEND_API}/pro-teams`, { params: { pageSize: 30, page } })
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
        // handle error
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
.team-img {
  width: 77px;
  height: 43px;
}
</style>
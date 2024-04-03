<template>
  <div>
    <h1 class="text-base sm:text-3xl font-bold text-center sm:my-4">Explore the World of Dota Heroes</h1>
    <div class="grid grid-cols-10 sm:gap-4">
      <dota-loader :isLoading="isLoading" loaderType="home"/>
      <ImageCard v-for="hero in heroes" :key="hero.id" :itemData="hero" itemType="hero"/>
    </div>
  </div>
  <vue-awesome-paginate
    :total-items="paginationData.totalHeroes"
    :items-per-page="paginationData.pageSize"
    :max-pages-shown="paginationData.totalPages"
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
  name: 'DotaHome',
  components: {
    ImageCard,
    DotaLoader,
  },
  setup() {
    const onClickHandler = (page) => {
      fetchData(page);
    };
    const currentPage = ref(1);
    const paginationData = ref({
        totalHeroes: 0,
        currentPage: 1,
        pageSize: 10,
        totalPages: 1
      });

    const heroes = ref([]);
    const isLoading = ref(false);
    const fetchData = (page = 1) => {
      isLoading.value = true;
      axios.get(`${process.env.VUE_APP_DOTA_BACKEND_API}/heroes`, { params: { pageSize: 30, page } })
      .then(response => {
        heroes.value = response.data?.heroes;
        paginationData.value = {
        totalHeroes: response.data?.pagination?.totalHeroes,
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
    
    onMounted(() => {
      fetchData();
    });

    return {
      heroes,
      isLoading,
      onClickHandler,
      currentPage,
      paginationData,
    };
  }
}
</script>

<style>
  .pagination-container {
    display: flex;
    column-gap: 10px;
  }
  .paginate-buttons {
    height: 40px;
    width: 40px;
    border-radius: 20px;
    cursor: pointer;
    background-color: rgb(242, 242, 242);
    border: 1px solid rgb(217, 217, 217);
    color: black;
  }
  .paginate-buttons:hover {
    background-color: #d8d8d8;
  }
  .active-page {
    background-color: #3498db;
    border: 1px solid #3498db;
    color: white;
  }
  .active-page:hover {
    background-color: #2988c8;
  }
</style>
<template>
  <div class="max-w-sm rounded shadow-lg relative group">
    <div class="flex flex-col items-center">
      <fallback :imageUrl="itemData.img"/>
      <router-link :to="`/item/${itemData.id}/${itemType}`">
        <div class="sm:px-6 sm:py-4">
          <div class="text-xxs font-semibold sm:font-bold sm:text-base sm:mb-2 hover:underline">
            {{ itemData.name }}
          </div>
          <p class="text-xxs sm:text-base">{{ itemData.attackType }}</p>
        </div>
      </router-link>
    </div>
    <div class="my-0 opacity-0 group-hover:opacity-100 absolute top-0 sm:top-0.5 w-full cursor-text">
      <span class="text-sm text-center font-black hidden sm:block">{{itemType === 'hero' ? `Strength: ${itemData.hoverFirst}` : `Rating: ${itemData.hoverFirst}`}}</span>
      <span class="text-xxs text-center sm:hidden block">{{itemType === 'hero' ? `Str: ${itemData.hoverFirst}` : `Rtg: ${itemData.hoverFirst}`}}</span>
      <span class="text-sm text-center font-black hidden sm:block">{{itemType === 'hero' ? `Agility: ${itemData.hoverSecond}` : `Wins: ${itemData.hoverSecond}`}}</span>
      <span class="text-xxs text-center sm:hidden block">{{itemType === 'hero' ? `Agi: ${itemData.hoverSecond}` : `Wins: ${itemData.hoverSecond}`}}</span>
      <span class="text-sm text-center font-black hidden sm:block">{{itemType === 'hero' ? `Intelligence: ${itemData.hoverThird}` : `Losses: ${itemData.hoverThird}`}}</span>
      <span class="text-xxs text-center sm:hidden block">{{itemType === 'hero' ? `Int: ${itemData.hoverThird}` : `Loss: ${itemData.hoverThird}`}}</span>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Fallback from './Fallback.vue';
export default {
  name: "ImageCardComponent",
  components: {
    Fallback,
  },
  props: {
    itemType: String,
    itemData: Object,
  },
  setup() {
    const isImgLoaded = ref(false);
    const isImgLoading = ref(true);
    const onImgLoad = () => {
      isImgLoaded.value = true;
      this.isLoading = false;
    };

    return {
      onImgLoad,
      isImgLoaded,
      isImgLoading,
    }
  }
};
</script>

<style scoped>
.max-w-sm {
  max-width: 20rem;
}

.rounded {
  border-radius: 0.375rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.w-full {
  width: 100%;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.font-bold {
  font-weight: 700;
}

.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
}

.hover\:opacity:hover {
  opacity: 100;
}
</style>

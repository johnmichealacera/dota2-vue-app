<template>
  <div class="max-w-sm rounded shadow-lg relative group">
    <div>
      <img class="w-full group-hover:opacity-30" :src="heroData.img" alt="Dota hero">
      <router-link :to="'/hero/' + heroData.id">
        <div class="sm:px-6 sm:py-4">
          <div class="text-xxs font-semibold sm:font-bold sm:text-base sm:mb-2 hover:underline">
            {{ heroData.name }}
          </div>
          <p class="text-xxs sm:text-base">{{ heroData.attackType }}</p>
        </div>
      </router-link>
    </div>
    <div class="my-0 opacity-0 group-hover:opacity-100 absolute top-0 sm:top-0.5 w-full cursor-text">
      <span class="text-sm text-center font-black hidden sm:block">Strength: {{ heroData.baseStr }}</span>
      <span class="text-xxs text-center sm:hidden block">Str: {{ heroData.baseStr }}</span>
      <span class="text-sm text-center font-black hidden sm:block">Agility: {{ heroData.baseAgi }}</span>
      <span class="text-xxs text-center sm:hidden block">Agi: {{ heroData.baseAgi }}</span>
      <span class="text-sm text-center font-black hidden sm:block">Intelligence: {{ heroData.baseInt }}</span>
      <span class="text-xxs text-center sm:hidden block">Int: {{ heroData.baseInt }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    heroData: Object,
  },
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

<template>
  <nav class="flex start header">
    <router-link to="/" class="nav-link sm:text-xl font-bold hover:opacity-70 hover:underline">Hero</router-link>
    <!-- <router-link to="/players" class="nav-link sm:text-xl font-bold hover:opacity-70 hover:underline">Players</router-link> -->
    <router-link to="/teams" class="nav-link sm:text-xl font-bold hover:opacity-70 hover:underline">Teams</router-link>
  </nav>
</template>
<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'NavBar',
});
</script>
<style>
.header {
  padding: 1rem 0 0 0;
}
</style>
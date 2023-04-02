<template>
  <div>
    <nav-bar />
    <router-view></router-view>
    <footer-nav class="border-2"/>
  </div>
</template>

<script>
import router from './router';
import NavBar from './components/NavBar.vue';
import FooterNav from './components/Footer.vue';

export default {
  name: 'App',
  router,
  components: {
    NavBar,
    FooterNav,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #63a2e2;
}
</style>

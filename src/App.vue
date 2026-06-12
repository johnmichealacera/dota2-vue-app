<template>
  <div id="app-shell">
    <nav-bar />
    <main class="section-shell app-main">
      <router-view />
    </main>
    <footer-nav />
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
#app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.app-main {
  padding-top: 0.85rem;
  padding-bottom: 1.5rem;
}
</style>

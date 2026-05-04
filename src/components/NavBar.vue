<template>
  <header class="section-shell nav-wrap">
    <nav class="glass-panel header-nav">
      <router-link to="/" class="brand">
        <span class="brand-icon">D2</span>
        <span>Dota Mate</span>
      </router-link>
      <div class="links">
        <router-link to="/" class="nav-link" active-class="is-active">Heroes</router-link>
        <router-link to="/teams" class="nav-link" active-class="is-active">Teams</router-link>
      </div>
    </nav>
  </header>
</template>
<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'NavBar',
});
</script>
<style>
.nav-wrap {
  padding-top: 1rem;
}

.header-nav {
  border-radius: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 700;
  color: var(--text);
}

.brand-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: #061125;
  background: linear-gradient(140deg, #58a2ff, #84c0ff);
  font-size: 0.8rem;
  font-family: "Sora", sans-serif;
}

.links {
  display: inline-flex;
  gap: 0.35rem;
}

.nav-link {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-muted);
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.5rem 0.9rem;
  transition: all 180ms ease;
}

.nav-link:hover {
  color: var(--text);
  border-color: var(--border);
  background: rgba(143, 188, 255, 0.08);
}

.is-active {
  color: var(--text);
  border-color: rgba(143, 188, 255, 0.35);
  background: rgba(143, 188, 255, 0.16);
}

@media (max-width: 640px) {
  .header-nav {
    padding: 0.7rem 0.8rem;
  }

  .brand {
    font-size: 0.85rem;
  }
}
</style>
<template>
  <header class="nav-outer section-shell">
    <nav class="glass-panel header-nav">
      <div class="nav-top-line"></div>
      <router-link to="/" class="brand">
        <span class="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" class="brand-svg">
            <path d="M12 2L3 7v10l9 5 9-5V7z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M12 2v20M3 7l9 5 9-5" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </span>
        <span class="brand-name">Dota<span class="brand-accent">Mate</span></span>
      </router-link>
      <!-- TODO: Re-enable player search when OpenDota /search is fast and returns relevant names -->
      <!--
      <form class="nav-search" @submit.prevent="submitSearch">
        <span class="nav-search-icon" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="none" width="14" height="14">
            <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.6"/>
            <path d="M13.5 13.5L17 17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </span>
        <input
          v-model="searchQuery"
          class="nav-search-input"
          type="search"
          placeholder="Search players…"
          autocomplete="off"
          spellcheck="false"
          aria-label="Search players"
        />
      </form>
      -->
      <div class="links">
        <router-link to="/" class="nav-link nav-link-meta" active-class="is-active" exact>Meta</router-link>
        <router-link to="/heroes" class="nav-link" active-class="is-active">Heroes</router-link>
        <router-link to="/teams" class="nav-link" active-class="is-active">Teams</router-link>
        <router-link to="/matches" class="nav-link nav-link-matches" active-class="is-active">Matches</router-link>
        <router-link to="/players" class="nav-link" active-class="is-active">Players</router-link>
      </div>
    </nav>
  </header>
</template>

<script>
import { defineComponent } from 'vue';
// import { ref } from 'vue';
// import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'NavBar',
  // TODO: Re-enable player search when OpenDota /search is fast and returns relevant names
  // setup() {
  //   const router = useRouter();
  //   const searchQuery = ref('');
  //
  //   const submitSearch = () => {
  //     const q = searchQuery.value.trim();
  //     if (q.length < 2) return;
  //     router.push({ name: 'SearchPage', query: { q } });
  //     searchQuery.value = '';
  //   };
  //
  //   return { searchQuery, submitSearch };
  // },
});
</script>

<style>
.nav-outer {
  padding-top: 0.75rem;
  position: relative;
  z-index: 10;
}

.header-nav {
  border-radius: 0.65rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  position: relative;
  overflow: hidden;
}

/* thin amber line across the top edge */
.nav-top-line {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent,
    rgba(232, 168, 56, 0.6) 30%,
    rgba(232, 168, 56, 0.9) 50%,
    rgba(232, 168, 56, 0.6) 70%,
    transparent);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
}

.brand-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  display: grid;
  place-items: center;
  background: linear-gradient(140deg, #b87e1e, #e8a838);
  color: #08090e;
  box-shadow: 0 0 16px rgba(232, 168, 56, 0.4);
  flex-shrink: 0;
}

.brand-svg {
  width: 1.05rem;
  height: 1.05rem;
}

.brand-name {
  font-family: "Cinzel", serif;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.06em;
  color: var(--text-soft);
}

.brand-accent {
  color: var(--accent-bright);
}

/* TODO: Re-enable player search when OpenDota /search is fast and returns relevant names
.nav-search {
  position: relative;
  flex: 1;
  max-width: 220px;
  min-width: 0;
}
.nav-search-icon {
  position: absolute;
  left: 0.55rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
  display: flex;
}
.nav-search-input {
  width: 100%;
  padding: 0.38rem 0.65rem 0.38rem 1.75rem;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: rgba(12, 16, 34, 0.85);
  color: var(--text);
  font-family: "Barlow", sans-serif;
  font-size: 0.78rem;
  outline: none;
  transition: border-color 160ms ease, box-shadow 160ms ease;
}
.nav-search-input::placeholder { color: var(--text-muted); }
.nav-search-input:focus {
  border-color: var(--border-strong);
  box-shadow: 0 0 0 2px var(--accent-glow);
}
*/

.links {
  display: inline-flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.nav-link {
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 600;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 0.3rem 0.7rem;
  transition: all 160ms ease;
}

.nav-link:hover {
  color: var(--text-soft);
  border-color: var(--border);
  background: rgba(200, 146, 42, 0.06);
}

.is-active {
  color: var(--accent-bright);
  border-color: var(--border-strong);
  background: rgba(200, 146, 42, 0.1);
  box-shadow: 0 0 12px var(--accent-glow);
}

.nav-link-matches.is-active {
  color: #38bdf8;
  border-color: rgba(56, 189, 248, 0.35);
  background: rgba(56, 189, 248, 0.08);
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.2);
}

.nav-link-meta.is-active {
  color: #22c55e;
  border-color: rgba(34, 197, 94, 0.35);
  background: rgba(34, 197, 94, 0.08);
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.2);
}

@media (max-width: 480px) {
  .header-nav { padding: 0.65rem 0.8rem; flex-wrap: wrap; }
  /* .nav-search { order: 3; flex: 1 1 100%; max-width: none; margin-top: 0.35rem; } */
  .brand-name  { font-size: 0.88rem; }
}
</style>

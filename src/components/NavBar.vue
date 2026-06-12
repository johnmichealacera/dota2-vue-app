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
      <div class="links">
        <router-link to="/meta" class="nav-link nav-link-meta" active-class="is-active">Meta</router-link>
        <router-link to="/" class="nav-link" active-class="is-active" exact>Heroes</router-link>
        <router-link to="/teams" class="nav-link" active-class="is-active">Teams</router-link>
        <router-link to="/matches" class="nav-link nav-link-matches" active-class="is-active">Matches</router-link>
        <router-link to="/players" class="nav-link" active-class="is-active">Players</router-link>
      </div>
    </nav>
  </header>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({ name: 'NavBar' });
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

.links {
  display: inline-flex;
  gap: 0.25rem;
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
  .header-nav { padding: 0.65rem 0.8rem; }
  .brand-name  { font-size: 0.88rem; }
}
</style>

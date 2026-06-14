<template>
  <div class="global-search" ref="rootEl">
    <form class="nav-search" @submit.prevent="goToSearchPage">
      <span class="nav-search-icon" aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="none" width="14" height="14">
          <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.6"/>
          <path d="M13.5 13.5L17 17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </span>
      <input
        v-model="query"
        class="nav-search-input"
        type="search"
        placeholder="Search heroes, teams, players…"
        autocomplete="off"
        spellcheck="false"
        aria-label="Search heroes, teams, and pro players"
        @focus="open = true"
        @input="onInput"
      />
    </form>

    <div
      v-if="open && query.trim().length >= 2 && (hasResults || isLoading)"
      class="search-dropdown glass-panel"
    >
      <p v-if="isLoading" class="dropdown-status">Searching…</p>

      <template v-if="!isLoading && hasResults">
        <section v-if="results.heroes.length" class="dropdown-section">
          <h3 class="dropdown-label">Heroes</h3>
          <router-link
            v-for="hero in results.heroes"
            :key="`h-${hero.id}`"
            :to="`/item/${hero.id}/hero`"
            class="dropdown-row"
            @click="close"
          >
            <img v-if="hero.img" :src="hero.img" :alt="hero.name" class="dropdown-thumb" loading="lazy" />
            <span class="dropdown-name">{{ hero.name }}</span>
          </router-link>
        </section>

        <section v-if="results.teams.length" class="dropdown-section">
          <h3 class="dropdown-label">Teams</h3>
          <router-link
            v-for="team in results.teams"
            :key="`t-${team.id}`"
            :to="`/item/${team.id}/team`"
            class="dropdown-row"
            @click="close"
          >
            <img v-if="team.img" :src="team.img" :alt="team.name" class="dropdown-thumb team" loading="lazy" />
            <span class="dropdown-name">{{ team.name }}</span>
            <span v-if="team.tag" class="dropdown-tag">{{ team.tag }}</span>
          </router-link>
        </section>

        <section v-if="results.players.length" class="dropdown-section">
          <h3 class="dropdown-label">Pro Players</h3>
          <router-link
            v-for="player in results.players"
            :key="`p-${player.accountId}`"
            :to="`/player/${player.accountId}`"
            class="dropdown-row"
            @click="close"
          >
            <img
              v-if="player.avatar"
              :src="player.avatar"
              :alt="player.name"
              class="dropdown-thumb player"
              loading="lazy"
            />
            <div class="dropdown-meta">
              <span class="dropdown-name">{{ player.name }}</span>
              <span v-if="player.teamName" class="dropdown-sub">{{ player.teamName }}</span>
            </div>
          </router-link>
        </section>

        <button type="button" class="dropdown-more" @click="goToSearchPage">
          View all results for “{{ query.trim() }}”
        </button>
      </template>

      <p v-if="!isLoading && !hasResults" class="dropdown-status">No matches found.</p>
    </div>
  </div>
</template>

<script>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { buildApiUrl } from '../config/api';

const emptyResults = () => ({ heroes: [], teams: [], players: [] });

export default {
  name: 'GlobalSearch',
  setup() {
    const router = useRouter();
    const rootEl = ref(null);
    const query = ref('');
    const results = ref(emptyResults());
    const isLoading = ref(false);
    const open = ref(false);
    let debounceTimer = null;
    let requestId = 0;

    const hasResults = computed(() => {
      const r = results.value;
      return r.heroes.length + r.teams.length + r.players.length > 0;
    });

    const runSearch = () => {
      const q = query.value.trim();
      if (q.length < 2) {
        results.value = emptyResults();
        isLoading.value = false;
        return;
      }

      const id = ++requestId;
      isLoading.value = true;

      axios.get(buildApiUrl('/global-search'), { params: { q } })
        .then((res) => {
          if (id !== requestId) return;
          results.value = res.data ?? emptyResults();
          isLoading.value = false;
        })
        .catch(() => {
          if (id !== requestId) return;
          results.value = emptyResults();
          isLoading.value = false;
        });
    };

    const onInput = () => {
      open.value = true;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(runSearch, 250);
    };

    const close = () => {
      open.value = false;
      query.value = '';
      results.value = emptyResults();
    };

    const goToSearchPage = () => {
      const q = query.value.trim();
      if (q.length < 2) return;
      router.push({ name: 'SearchPage', query: { q } });
      close();
    };

    const onDocClick = (e) => {
      if (rootEl.value && !rootEl.value.contains(e.target)) {
        open.value = false;
      }
    };

    onMounted(() => document.addEventListener('click', onDocClick));
    onBeforeUnmount(() => {
      document.removeEventListener('click', onDocClick);
      clearTimeout(debounceTimer);
    });

    return {
      rootEl, query, results, isLoading, open, hasResults,
      onInput, close, goToSearchPage,
    };
  },
};
</script>

<style scoped>
.global-search {
  position: relative;
  flex: 1;
  max-width: 280px;
  min-width: 0;
}

.nav-search {
  position: relative;
  width: 100%;
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

.search-dropdown {
  position: absolute;
  top: calc(100% + 0.35rem);
  left: 0;
  right: 0;
  min-width: 280px;
  border-radius: 0.55rem;
  padding: 0.45rem 0;
  z-index: 50;
  max-height: 70vh;
  overflow-y: auto;
}

.dropdown-section {
  padding: 0.2rem 0;
}
.dropdown-section + .dropdown-section {
  border-top: 1px solid rgba(200, 146, 42, 0.1);
}

.dropdown-label {
  margin: 0;
  padding: 0.35rem 0.75rem 0.2rem;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.dropdown-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  text-decoration: none;
  color: inherit;
  transition: background 140ms ease;
}
.dropdown-row:hover {
  background: rgba(200, 146, 42, 0.08);
}

.dropdown-thumb {
  width: 36px;
  height: 20px;
  object-fit: cover;
  border-radius: 3px;
  border: 1px solid var(--border);
  flex-shrink: 0;
}
.dropdown-thumb.team {
  width: 28px;
  height: 28px;
  object-fit: contain;
  background: rgba(0, 0, 0, 0.3);
}
.dropdown-thumb.player {
  width: 28px;
  height: 28px;
  object-fit: cover;
  border-radius: 4px;
}

.dropdown-meta {
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
  min-width: 0;
}

.dropdown-name {
  font-size: 0.78rem;
  color: var(--text-soft);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-sub,
.dropdown-tag {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.dropdown-tag {
  margin-left: auto;
  flex-shrink: 0;
}

.dropdown-status {
  margin: 0;
  padding: 0.65rem 0.75rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-style: italic;
}

.dropdown-more {
  display: block;
  width: 100%;
  margin-top: 0.2rem;
  padding: 0.5rem 0.75rem;
  border: none;
  border-top: 1px solid rgba(200, 146, 42, 0.1);
  background: transparent;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent-bright);
  cursor: pointer;
  text-align: left;
}
.dropdown-more:hover {
  background: rgba(200, 146, 42, 0.06);
}

@media (max-width: 480px) {
  .global-search {
    order: 3;
    flex: 1 1 100%;
    max-width: none;
    margin-top: 0.35rem;
  }
}
</style>

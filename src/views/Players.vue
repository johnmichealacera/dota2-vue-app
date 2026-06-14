<template>
  <section>
    <div class="page-banner glass-panel">
      <div class="banner-deco" aria-hidden="true">
        <span class="deco-rune">⬡</span>
        <span class="deco-rune sm">◆</span>
        <span class="deco-rune xs">⬡</span>
      </div>
      <p class="eyebrow">Pro Circuit</p>
      <h1>Professional Players</h1>
      <p class="subtitle">The world's top Dota 2 players — track their teams, roles, and countries.</p>
      <div class="banner-stats" v-if="!isLoading && !error">
        <span class="bstat">
          <span class="bstat-val">{{ filteredPlayers.length }}</span>
          {{ hasActiveFilters ? 'results' : 'Players' }}
        </span>
        <span class="bstat-sep">·</span>
        <span class="bstat">
          <span class="bstat-val core-col">Core</span>
          &amp;
          <span class="bstat-val supp-col">Support</span>
        </span>
      </div>
    </div>

    <error-banner v-if="error" :message="error" :on-retry="fetchData" />

    <template v-if="!error">
      <div class="filter-tabs">
        <button
          v-for="tab in roleTabs"
          :key="tab.id"
          class="filter-tab"
          :class="{ active: activeRole === tab.id }"
          @click="setRole(tab.id)"
        >
          {{ tab.label }}
          <span class="tab-count">{{ tab.count }}</span>
        </button>
      </div>

      <div class="filter-tabs team-tabs">
        <button
          v-for="tab in teamTabs"
          :key="tab.id"
          class="filter-tab"
          :class="{ active: activeTeam === tab.id }"
          @click="setTeam(tab.id)"
        >
          {{ tab.label }}
          <span class="tab-count">{{ tab.count }}</span>
        </button>
      </div>

      <search-bar
        v-model="searchQuery"
        placeholder="Search players, teams, or countries…"
        @update:modelValue="onFilterChange"
      />

      <div class="sort-bar">
        <span class="sort-label">Sort</span>
        <button
          v-for="opt in sortOpts"
          :key="opt.key"
          class="sort-btn"
          :class="{ 'is-active': sortKey === opt.key }"
          @click="onSortChange(opt.key)"
        >{{ opt.label }}</button>
      </div>
    </template>

    <div v-if="isLoading" class="card-grid">
      <dota-loader :isLoading="isLoading" loaderType="home" />
    </div>

    <div v-else-if="!error" class="card-grid">
      <PlayerCard
        v-for="(player, i) in pagedPlayers"
        :key="player.accountId || i"
        :player="player"
        :style="{ animationDelay: `${i * 0.025}s` }"
      />
    </div>

    <p v-if="!isLoading && !error && pagedPlayers.length === 0" class="empty-state">
      No players match your filters.
    </p>

    <vue-awesome-paginate
      v-if="!error && filteredPlayers.length > pageSize"
      :total-items="filteredPlayers.length"
      :items-per-page="pageSize"
      :max-pages-shown="5"
      v-model="currentPage"
      :on-click="onPageChange"
    />
  </section>
</template>

<script>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import PlayerCard from '../components/PlayerCard.vue';
import DotaLoader from '../components/Loader.vue';
import SearchBar from '../components/SearchBar.vue';
import ErrorBanner from '../components/ErrorBanner.vue';
import { buildApiUrl } from '../config/api';

function isCore(role) {
  return role === 0;
}

function isSupport(role) {
  return role === 1;
}

function hasTeam(player) {
  return (player.teamId > 0) || Boolean(player.teamName?.trim());
}

export default {
  name: 'DotaPlayers',
  components: { PlayerCard, DotaLoader, SearchBar, ErrorBanner },
  setup() {
    const allPlayers   = ref([]);
    const isLoading    = ref(false);
    const error        = ref(null);
    const searchQuery  = ref('');
    const activeRole   = ref('all');
    const activeTeam   = ref('all');
    const sortKey      = ref('alpha');
    const currentPage  = ref(1);
    const pageSize     = 24;

    const sortOpts = [
      { key: 'alpha',  label: 'A – Z' },
      { key: 'mmr',    label: 'Highest MMR' },
      { key: 'rank',   label: 'Rank' },
      { key: 'team',   label: 'Team' },
      { key: 'recent', label: 'Recently Active' },
      { key: 'role',   label: 'Role' },
    ];

    const fetchData = () => {
      isLoading.value = true;
      error.value = null;
      axios.get(buildApiUrl('/pro-players'), { params: { pageSize: 9999, page: 1 } })
        .then(response => {
          allPlayers.value = response.data?.items ?? [];
          isLoading.value = false;
        })
        .catch(err => {
          console.error(err);
          error.value = 'Could not load pro players. Check your connection or backend.';
          isLoading.value = false;
        });
    };

    const roleTabs = computed(() => {
      const counts = { all: allPlayers.value.length, core: 0, support: 0, other: 0 };
      for (const player of allPlayers.value) {
        const role = player.fantasyRole;
        if (isCore(role)) counts.core += 1;
        else if (isSupport(role)) counts.support += 1;
        else counts.other += 1;
      }
      return [
        { id: 'all', label: 'All Roles', count: counts.all },
        { id: 'core', label: 'Core', count: counts.core },
        { id: 'support', label: 'Support', count: counts.support },
        { id: 'other', label: 'Other', count: counts.other },
      ];
    });

    const teamTabs = computed(() => {
      const counts = { all: allPlayers.value.length, rostered: 0, free: 0 };
      for (const player of allPlayers.value) {
        if (hasTeam(player)) counts.rostered += 1;
        else counts.free += 1;
      }
      return [
        { id: 'all', label: 'All Players', count: counts.all },
        { id: 'rostered', label: 'On Team', count: counts.rostered },
        { id: 'free', label: 'Free Agent', count: counts.free },
      ];
    });

    const hasActiveFilters = computed(() =>
      Boolean(searchQuery.value.trim()) ||
      activeRole.value !== 'all' ||
      activeTeam.value !== 'all'
    );

    const filteredPlayers = computed(() => {
      const q = searchQuery.value.trim().toLowerCase();
      return allPlayers.value.filter((player) => {
        const role = player.fantasyRole;
        if (activeRole.value === 'core' && !isCore(role)) return false;
        if (activeRole.value === 'support' && !isSupport(role)) return false;
        if (activeRole.value === 'other' && (isCore(role) || isSupport(role))) return false;

        if (activeTeam.value === 'rostered' && !hasTeam(player)) return false;
        if (activeTeam.value === 'free' && hasTeam(player)) return false;

        if (!q) return true;
        const name = (player.name || '').toLowerCase();
        const team = (player.teamName || '').toLowerCase();
        const tag = (player.teamTag || '').toLowerCase();
        const country = (player.countryCode || '').toLowerCase();
        return name.includes(q) || team.includes(q) || tag.includes(q) || country.includes(q);
      });
    });

    const roleOrder = { 0: 0, 1: 1 };

    const sortedFilteredPlayers = computed(() => {
      const list = [...filteredPlayers.value];
      switch (sortKey.value) {
        case 'mmr':
          return list.sort((a, b) => (b.mmr ?? -1) - (a.mmr ?? -1));
        case 'rank':
          return list.sort((a, b) => (b.rankTier ?? -1) - (a.rankTier ?? -1));
        case 'team':
          return list.sort((a, b) =>
            (a.teamName || 'zzz').localeCompare(b.teamName || 'zzz') ||
            (a.name || '').localeCompare(b.name || '')
          );
        case 'recent':
          return list.sort((a, b) =>
            (b.lastMatchTime || '').localeCompare(a.lastMatchTime || '')
          );
        case 'role':
          return list.sort((a, b) =>
            (roleOrder[a.fantasyRole] ?? 9) - (roleOrder[b.fantasyRole] ?? 9) ||
            (a.name || '').localeCompare(b.name || '')
          );
        default:
          return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      }
    });

    const pagedPlayers = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return sortedFilteredPlayers.value.slice(start, start + pageSize);
    });

    const setRole = (role) => {
      activeRole.value = role;
      currentPage.value = 1;
    };

    const setTeam = (team) => {
      activeTeam.value = team;
      currentPage.value = 1;
    };

    const onFilterChange = () => { currentPage.value = 1; };
    const onSortChange = (key) => { sortKey.value = key; currentPage.value = 1; };
    const onPageChange = (page) => { currentPage.value = page; };

    onMounted(fetchData);

    return {
      allPlayers, isLoading, error, searchQuery,
      activeRole, activeTeam, roleTabs, teamTabs,
      sortKey, sortOpts, hasActiveFilters,
      filteredPlayers, pagedPlayers,
      currentPage, pageSize,
      fetchData, setRole, setTeam, onFilterChange, onSortChange, onPageChange,
    };
  },
};
</script>

<style scoped>
.page-banner {
  border-radius: 0.85rem;
  padding: 0.7rem 1.1rem 0.6rem;
  text-align: left;
  margin-bottom: 0.5rem;
  position: relative;
  overflow: hidden;
}

.banner-deco {
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 0.6rem;
  align-items: center;
  pointer-events: none;
  user-select: none;
}

.deco-rune      { color: rgba(232, 168, 56, 0.12); font-size: 3.5rem; line-height: 1; }
.deco-rune.sm   { font-size: 2.2rem; color: rgba(155, 114, 219, 0.1); }
.deco-rune.xs   { font-size: 1.3rem; color: rgba(14, 184, 154, 0.1); }

.eyebrow {
  margin: 0 0 0.15rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.58rem;
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 600;
  color: #9b72db;
}

h1 {
  margin: 0 0 0.2rem;
  font-size: clamp(1.05rem, 2vw, 1.5rem);
  background: linear-gradient(120deg, #ede8d8, #9b72db 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: 0 0 0.35rem;
  color: var(--text-muted);
  max-width: 38rem;
  font-size: 0.78rem;
}

.banner-stats {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}
.bstat     { display: inline-flex; align-items: center; gap: 0.3rem; }
.bstat-sep { opacity: 0.4; }
.bstat-val { font-weight: 700; }
.core-col  { color: var(--crimson); }
.supp-col  { color: var(--teal); }

.filter-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 0.65rem;
}

.team-tabs {
  margin-bottom: 0.85rem;
}

.filter-tab {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  background: rgba(12, 16, 34, 0.6);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 0.35rem 0.7rem;
  cursor: pointer;
  transition: all 160ms ease;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.filter-tab:hover {
  color: var(--text-soft);
  border-color: var(--border-strong);
}

.filter-tab.active {
  color: var(--accent-bright);
  border-color: var(--border-strong);
  background: rgba(200, 146, 42, 0.1);
}

.tab-count {
  font-size: 0.68rem;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.05);
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
}

.sort-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
}

.sort-label {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-right: 0.15rem;
}

.sort-btn {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
  background: rgba(12, 16, 34, 0.7);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 0.22rem 0.6rem;
  cursor: pointer;
  transition: all 140ms ease;
}

.sort-btn:hover {
  color: var(--text-soft);
  border-color: var(--border-strong);
}

.sort-btn.is-active {
  color: var(--accent-bright);
  border-color: var(--border-strong);
  background: rgba(200, 146, 42, 0.1);
  box-shadow: 0 0 8px var(--accent-glow);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
  gap: 0.85rem;
}

.empty-state {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-muted);
  font-style: italic;
}
</style>

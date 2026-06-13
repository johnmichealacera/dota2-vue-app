<template>
  <section>
    <!-- ── Breadcrumb ─────────────────────────────── -->
    <nav class="breadcrumb">
      <router-link :to="itemType === 'team' ? '/teams' : '/'" class="bc-link">
        {{ itemType === 'team' ? 'Teams' : 'Heroes' }}
      </router-link>
      <span class="bc-sep">›</span>
      <span class="bc-current">{{ mainItem.name || '…' }}</span>
    </nav>

    <error-banner v-if="error" :message="error" :on-retry="() => fetchData(currentPage)" />

    <div v-if="isLoading && !error" class="details-wrap">
      <dota-loader :isLoading="isLoading" loaderType="detail" />
    </div>

    <div v-if="!isLoading && !error" class="details-wrap">

      <!-- ── Side panel ─────────────────────────────── -->
      <aside class="side-panel glass-panel">
        <div class="portrait-wrap">
          <img v-if="itemType === 'hero'" :src="mainItem.img" :alt="mainItem.name" class="portrait" />
          <fallback v-else :imageUrl="mainItem.img" />
        </div>

        <h2 class="item-name">{{ mainItem.name }}</h2>

        <!-- Hero -->
        <template v-if="itemType === 'hero'">
          <!-- Attribute pills -->
          <div class="attr-pills">
            <span class="attr-pill" :class="attrPillClass">{{ attrLabel }}</span>
            <span class="attr-pill atk" :class="mainItem.attackType === 'Melee' ? 'melee' : 'ranged'">
              {{ mainItem.attackType }}
            </span>
          </div>

          <!-- Pro circuit stats strip -->
          <div class="hero-stats-strip" v-if="heroStat">
            <div class="hs-box" :class="winRateClass">
              <span class="hs-label">Pro Win Rate</span>
              <span class="hs-val">{{ heroStat.winRate.toFixed(1) }}%</span>
            </div>
            <div class="hs-box">
              <span class="hs-label">Pro Picks</span>
              <span class="hs-val">{{ heroStat.totalPicks }}</span>
            </div>
            <div class="hs-box">
              <span class="hs-label">Pro Bans</span>
              <span class="hs-val ban">{{ heroStat.totalBans }}</span>
            </div>
          </div>

          <!-- Role tags -->
          <div class="role-tags" v-if="mainItem.roles && mainItem.roles.length">
            <span v-for="role in mainItem.roles" :key="role" class="role-tag">{{ role }}</span>
          </div>

          <div class="divider-rune" style="margin: 0.9rem 0 0.75rem">Base Stats</div>

          <div class="stats-list">
            <div class="stat-row">
              <span class="srow-label">Health</span>
              <span class="srow-val">{{ mainItem.health }}</span>
            </div>
            <div class="stat-row">
              <span class="srow-label">Mana</span>
              <span class="srow-val int-col">{{ mainItem.baseMana }}</span>
            </div>
            <div class="stat-row">
              <span class="srow-label">Armor</span>
              <span class="srow-val">{{ mainItem.baseArmor }}</span>
            </div>
            <div class="stat-row">
              <span class="srow-label">Move Speed</span>
              <span class="srow-val agi-col">{{ mainItem.moveSpeed }}</span>
            </div>
            <div class="stat-row">
              <span class="srow-label">Atk Range</span>
              <span class="srow-val">{{ mainItem.attackRange }}</span>
            </div>
            <div class="stat-row">
              <span class="srow-label">Magic Res</span>
              <span class="srow-val">{{ mainItem.baseMr }}%</span>
            </div>
          </div>

          <!-- Base attribute numbers -->
          <div class="divider-rune" style="margin: 0.9rem 0 0.75rem">Attributes</div>
          <div class="attr-numbers">
            <div class="attr-num str">
              <span class="an-label">STR</span>
              <span class="an-val">{{ mainItem.baseStr }}</span>
            </div>
            <div class="attr-num agi">
              <span class="an-label">AGI</span>
              <span class="an-val">{{ mainItem.baseAgi }}</span>
            </div>
            <div class="attr-num int">
              <span class="an-label">INT</span>
              <span class="an-val">{{ mainItem.baseInt }}</span>
            </div>
          </div>
        </template>

        <!-- Team -->
        <template v-if="itemType === 'team'">
          <div class="divider-rune" style="margin: 1rem 0 0.8rem">Team Record</div>
          <div class="stats-list">
            <div class="stat-row">
              <span class="srow-label">Rating</span>
              <span class="srow-val accent-col">{{ mainItem.rating }}</span>
            </div>
            <div class="stat-row">
              <span class="srow-label">Tag</span>
              <span class="badge badge-team">{{ mainItem.tag }}</span>
            </div>
            <div class="stat-row">
              <span class="srow-label">Wins</span>
              <span class="srow-val agi-col">{{ mainItem.wins }}</span>
            </div>
            <div class="stat-row">
              <span class="srow-label">Losses</span>
              <span class="srow-val crimson-col">{{ mainItem.losses }}</span>
            </div>
          </div>
          <div style="margin-top:1rem" v-if="mainItem.wins != null">
            <div class="stat-bar-wrap">
              <div class="stat-bar-label">
                <span>Win Rate</span>
                <span>{{ winRate }}%</span>
              </div>
              <div class="stat-bar-track">
                <div class="stat-bar-fill" :style="{ width: winRate + '%' }"></div>
              </div>
            </div>
          </div>
        </template>
      </aside>

      <!-- ── Matchup panel ──────────────────────────── -->
      <div class="matchup-panel glass-panel">
        <div v-if="itemType === 'team'" class="team-sections">
          <section v-if="currentRoster.length" class="team-block">
            <div class="team-block-head">
              <h2 class="team-block-title">Current Roster</h2>
              <span class="team-block-count">{{ currentRoster.length }} players</span>
            </div>
            <div class="roster-grid">
              <router-link
                v-for="player in currentRoster"
                :key="player.accountId"
                :to="`/player/${player.accountId}`"
                class="roster-card"
              >
                <img
                  v-if="player.avatar"
                  :src="player.avatar"
                  :alt="player.name"
                  class="roster-avatar"
                  loading="lazy"
                />
                <div v-else class="roster-avatar placeholder"></div>
                <div class="roster-meta">
                  <span class="roster-name">{{ player.name }}</span>
                  <span class="roster-sub">
                    <span v-if="player.countryCode">{{ countryFlag(player.countryCode) }}</span>
                    <span>{{ roleLabel(player.fantasyRole) }}</span>
                  </span>
                </div>
              </router-link>
            </div>
          </section>

          <section v-if="formerRoster.length" class="team-block">
            <div class="team-block-head">
              <h2 class="team-block-title">Former Members</h2>
              <span class="team-block-count">{{ formerRoster.length }} players</span>
            </div>
            <div class="roster-grid former">
              <router-link
                v-for="player in formerRoster"
                :key="player.accountId"
                :to="`/player/${player.accountId}`"
                class="roster-card former"
              >
                <img
                  v-if="player.avatar"
                  :src="player.avatar"
                  :alt="player.name"
                  class="roster-avatar"
                  loading="lazy"
                />
                <div v-else class="roster-avatar placeholder"></div>
                <div class="roster-meta">
                  <span class="roster-name">{{ player.name }}</span>
                  <span class="roster-sub">{{ player.gamesPlayed }} games</span>
                </div>
              </router-link>
            </div>
          </section>

          <section v-if="teamHeroes.length" class="team-block">
            <div class="team-block-head">
              <h2 class="team-block-title">Hero Pool</h2>
              <span class="team-block-count">Top {{ teamHeroes.length }} picks</span>
            </div>
            <div class="hero-pool-grid">
              <router-link
                v-for="hero in teamHeroes"
                :key="hero.heroId"
                :to="`/item/${hero.heroId}/hero`"
                class="pool-hero"
                :class="getWinRateClass(hero.winRate)"
              >
                <img v-if="hero.heroImg" :src="hero.heroImg" :alt="hero.heroName" class="pool-hero-img" loading="lazy" />
                <fallback v-else :imageUrl="hero.heroImg" />
                <div class="pool-meta">
                  <span class="pool-name">{{ hero.heroName }}</span>
                  <span class="pool-picks">{{ hero.gamesPlayed }} picks</span>
                  <span class="pool-wr" :class="getWinRateClass(hero.winRate)">{{ hero.winRate.toFixed(1) }}%</span>
                </div>
              </router-link>
            </div>
          </section>

          <div v-if="currentRoster.length || teamHeroes.length" class="divider-rune team-divider">Team Matchups</div>
        </div>

        <div v-if="itemType === 'hero' && heroBenchmarks?.metrics?.length" class="benchmarks-section">
          <div class="benchmarks-header">
            <h2 class="benchmarks-title">Performance Benchmarks</h2>
            <p class="benchmarks-sub">Ranked pub percentile thresholds for this hero.</p>
          </div>
          <benchmark-bar
            v-for="metric in heroBenchmarks.metrics"
            :key="metric.key"
            :metric="metric"
          />
          <div class="divider-rune benchmarks-divider">Matchups</div>
        </div>

        <div class="matchup-header">
          <h1 class="matchup-title">{{ itemType === 'hero' ? 'Hero Matchups' : 'Team Matchups' }}</h1>
          <div class="matchup-controls">
            <span class="matchup-count" v-if="sortedMatchups.length">{{ sortedMatchups.length }} shown</span>
            <!-- Sort toggle -->
            <div class="sort-group">
              <button
                v-for="opt in sortOptions"
                :key="opt.key"
                class="sort-btn"
                :class="{ 'is-active': sortKey === opt.key }"
                @click="sortKey = opt.key"
                :title="opt.label"
              >{{ opt.label }}</button>
            </div>
          </div>
        </div>

        <div class="matchup-grid">
          <router-link
            v-for="item in sortedMatchups"
            :key="item.id"
            :to="{ name: 'ItemCard', params: { id: item.id, type: itemType === 'team' ? 'team' : 'hero' } }"
            class="matchup-item"
            :class="getWinRateClass(item.winRate)"
          >
            <fallback :imageUrl="item.img" />
            <div class="m-meta">
              <div class="m-name">{{ item.name }}</div>
              <div class="m-wr-bar-wrap">
                <div class="m-wr-bar-track">
                  <div
                    class="m-wr-bar-fill"
                    :class="getWinRateClass(item.winRate)"
                    :style="{ width: item.winRate.toFixed(0) + '%' }"
                  ></div>
                </div>
                <span class="m-wr-label" :class="getWinRateClass(item.winRate)">
                  {{ item.winRate.toFixed(1) }}%
                </span>
              </div>
              <div class="m-games">{{ item.gamesPlayed }} games</div>
            </div>
          </router-link>
        </div>

        <p v-if="sortedMatchups.length === 0" class="empty-state">No matchup data found.</p>
      </div>
    </div>

    <vue-awesome-paginate
      :total-items="paginationData.totalTeams"
      :items-per-page="paginationData.pageSize"
      :max-pages-shown="5"
      v-model="currentPage"
      :on-click="onClickHandler"
    />
  </section>
</template>

<script>
import { defineComponent, ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import DotaLoader from './Loader.vue';
import Fallback from './Fallback.vue';
import ErrorBanner from './ErrorBanner.vue';
import BenchmarkBar from './BenchmarkBar.vue';
import { buildApiUrl } from '../config/api';

export default defineComponent({
  name: 'ItemCard',
  components: { DotaLoader, Fallback, ErrorBanner, BenchmarkBar },
  setup() {
    const mainItem     = ref({});
    const itemMatchups = ref([]);
    const heroStat     = ref(null);
    const heroBenchmarks = ref(null);
    const teamPlayers    = ref([]);
    const teamHeroes     = ref([]);
    const route        = useRoute();
    const isLoading    = ref(false);
    const error        = ref('');
    const currentPage  = ref(1);
    const sortKey      = ref('wr-desc');
    const paginationData = ref({ totalTeams: 0, currentPage: 1, pageSize: 10, totalPages: 1 });

    const sortOptions = [
      { key: 'wr-desc',    label: 'Best' },
      { key: 'wr-asc',     label: 'Worst' },
      { key: 'games-desc', label: 'Most Played' },
    ];

    const winRateClass = computed(() => {
      const wr = heroStat.value?.winRate ?? 50;
      if (wr >= 52) return 'wr-good';
      if (wr <= 48) return 'wr-bad';
      return 'wr-neutral';
    });

    const formatCount = (n) => {
      if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
      if (n >= 1_000)     return Math.round(n / 1_000) + 'K';
      return String(n);
    };

    const winRate = computed(() => {
      const { wins, losses } = mainItem.value;
      if (wins == null || losses == null) return 0;
      const total = wins + losses;
      return total === 0 ? 0 : ((wins / total) * 100).toFixed(1);
    });

    const attrLabel = computed(() => {
      const map = { str: 'Strength', agi: 'Agility', int: 'Intelligence', all: 'Universal' };
      return map[(mainItem.value.primaryAttr || '').toLowerCase()] || '';
    });

    const attrPillClass = computed(() => {
      const a = (mainItem.value.primaryAttr || '').toLowerCase();
      return { str: 'str', agi: 'agi', int: 'int', all: 'uni' }[a] || '';
    });

    const sortedMatchups = computed(() => {
      const list = [...itemMatchups.value];
      if (sortKey.value === 'wr-desc')    return list.sort((a, b) => b.winRate - a.winRate);
      if (sortKey.value === 'wr-asc')     return list.sort((a, b) => a.winRate - b.winRate);
      if (sortKey.value === 'games-desc') return list.sort((a, b) => b.gamesPlayed - a.gamesPlayed);
      return list;
    });

    const currentRoster = computed(() =>
      teamPlayers.value.filter((p) => p.isCurrent)
    );
    const formerRoster = computed(() =>
      teamPlayers.value.filter((p) => !p.isCurrent)
    );

    const roleLabel = (role) => {
      if (role === 0) return 'Core';
      if (role === 1) return 'Support';
      return 'Pro';
    };

    const countryFlag = (code) => {
      if (!code || code.length !== 2) return '';
      return String.fromCodePoint(
        ...[...code.toUpperCase()].map((c) => c.charCodeAt(0) + 127397)
      );
    };

    const getWinRateClass = (wr) => {
      if (wr >= 55) return 'wr-high';
      if (wr <= 45) return 'wr-low';
      return 'wr-mid';
    };

    const fetchData = (page) => {
      isLoading.value = true;
      error.value = '';
      const type = route.params.type;
      const id   = route.params.id;

      const detailReq  = axios.get(buildApiUrl(`/${type === 'hero' ? 'hero' : 'team'}/${id}`));
      const matchupReq = axios.get(
        buildApiUrl(`/${type === 'hero' ? 'hero-matchup' : 'team-matchup'}/${id}`),
        { params: { pageSize: 18, page } }
      );

      detailReq.then(r => { mainItem.value = r.data; }).catch(() => {});

      if (type === 'hero') {
        teamPlayers.value = [];
        teamHeroes.value = [];
        axios.get(buildApiUrl('/hero-stats'))
          .then(r => { heroStat.value = r.data?.[id] ?? null; })
          .catch(() => {});
        axios.get(buildApiUrl(`/hero-benchmarks/${id}`))
          .then(r => { heroBenchmarks.value = r.data ?? null; })
          .catch(() => { heroBenchmarks.value = null; });
      } else {
        heroBenchmarks.value = null;
        heroStat.value = null;
        axios.get(buildApiUrl(`/team-players/${id}`))
          .then((r) => { teamPlayers.value = r.data ?? []; })
          .catch(() => { teamPlayers.value = []; });
        axios.get(buildApiUrl(`/team-heroes/${id}`))
          .then((r) => { teamHeroes.value = r.data ?? []; })
          .catch(() => { teamHeroes.value = []; });
      }

      matchupReq.then(r => {
        itemMatchups.value = r.data?.items ?? [];
        paginationData.value = {
          totalTeams:  r.data?.pagination?.totalItems ?? 0,
          currentPage: r.data?.pagination?.currentPage ?? 1,
          pageSize:    r.data?.pagination?.pageSize ?? 10,
          totalPages:  r.data?.pagination?.totalPages ?? 1,
        };
        isLoading.value = false;
      }).catch(() => {
        error.value = 'Failed to load detail data. The backend may be starting up — please retry in a moment.';
        isLoading.value = false;
      });
    };

    watch(() => route.params.id, () => fetchData(currentPage.value), { immediate: true });

    return {
      mainItem, itemMatchups, heroStat, heroBenchmarks, teamPlayers, teamHeroes,
      currentRoster, formerRoster, roleLabel, countryFlag,
      isLoading, error,
      winRateClass, formatCount,
      itemType: route.params.type,
      onClickHandler: (page) => fetchData(page),
      currentPage, paginationData,
      sortKey, sortOptions, sortedMatchups,
      winRate, attrLabel, attrPillClass,
      getWinRateClass,
    };
  },
});
</script>

<style>
/* ── Breadcrumb ─────────────────────────── */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 1rem;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.bc-link {
  color: var(--accent-bright);
  transition: opacity 150ms ease;
}
.bc-link:hover { opacity: 0.75; }
.bc-sep        { color: var(--text-muted); }
.bc-current    { color: var(--text-muted); }

/* ── Layout ─────────────────────────────── */
.details-wrap {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.1rem;
  align-items: start;
}

/* ── Side panel ─────────────────────────── */
.side-panel {
  border-radius: 0.85rem;
  padding: 1.25rem;
  position: sticky;
  top: 1rem;
  animation: fadeUp 0.4s ease both;
}

.portrait-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 0.9rem;
}

.portrait {
  width: 100%;
  max-width: 190px;
  border-radius: 0.65rem;
  border: 1px solid var(--border);
  box-shadow: 0 8px 32px rgba(2,4,12,0.6), 0 0 0 1px rgba(232,168,56,0.08);
}

.item-name {
  margin: 0 0 0.55rem;
  font-size: 1.1rem;
  text-align: center;
}

/* Attribute + attack type pills */
.attr-pills {
  display: flex;
  justify-content: center;
  gap: 0.35rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.attr-pill {
  padding: 0.18rem 0.6rem;
  border-radius: 3px;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}
.attr-pill.str  { background: rgba(201,53,53,0.18); border: 1px solid rgba(201,53,53,0.38); color: var(--str); }
.attr-pill.agi  { background: rgba(56,197,122,0.18); border: 1px solid rgba(56,197,122,0.38); color: var(--agi); }
.attr-pill.int  { background: rgba(91,160,240,0.18); border: 1px solid rgba(91,160,240,0.38); color: var(--int); }
.attr-pill.uni  { background: rgba(155,114,219,0.18); border: 1px solid rgba(155,114,219,0.38); color: var(--uni); }
.attr-pill.atk.melee  { background: rgba(201,53,53,0.12); border: 1px solid rgba(201,53,53,0.28); color: #e87070; }
.attr-pill.atk.ranged { background: rgba(14,184,154,0.12); border: 1px solid rgba(14,184,154,0.28); color: #3dd4b8; }

/* Hero stats strip */
.hero-stats-strip {
  display: flex;
  gap: 0.35rem;
  margin-bottom: 0.25rem;
}
.hs-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.12rem;
  padding: 0.4rem 0.25rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: rgba(6,8,15,0.4);
}
.hs-label {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.55rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.hs-val {
  font-family: "Cinzel", serif;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-soft);
}
.hs-val.ban { color: var(--crimson); opacity: 0.8; }
.hs-box.wr-good  { border-color: rgba(56,197,122,0.25); background: rgba(56,197,122,0.06); }
.hs-box.wr-good  .hs-val { color: var(--agi); }
.hs-box.wr-bad   { border-color: rgba(201,53,53,0.25);  background: rgba(201,53,53,0.06); }
.hs-box.wr-bad   .hs-val { color: var(--crimson); }
.hs-box.wr-neutral .hs-val { color: var(--accent-bright); }

/* Role tags */
.role-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.3rem;
  margin-bottom: 0.2rem;
}
.role-tag {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text-muted);
  border: 1px solid rgba(200,146,42,0.15);
  border-radius: 3px;
  padding: 0.12rem 0.45rem;
  background: rgba(200,146,42,0.06);
  transition: color 150ms, border-color 150ms;
}
.role-tag:hover {
  color: var(--accent-bright);
  border-color: var(--border-strong);
}

/* Base attribute numbers */
.attr-numbers {
  display: flex;
  gap: 0.5rem;
}
.attr-num {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: 0.45rem 0.3rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: rgba(6,8,15,0.4);
}
.an-label {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.an-val {
  font-family: "Cinzel", serif;
  font-size: 1rem;
  font-weight: 600;
}
.attr-num.str .an-label, .attr-num.str .an-val { color: var(--str); }
.attr-num.agi .an-label, .attr-num.agi .an-val { color: var(--agi); }
.attr-num.int .an-label, .attr-num.int .an-val { color: var(--int); }

/* Stats */
.stats-list { display: flex; flex-direction: column; gap: 0.38rem; }
.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.28rem 0;
  border-bottom: 1px solid rgba(200,146,42,0.06);
}
.srow-label {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.srow-val    { font-weight: 600; font-size: 0.82rem; color: var(--text-soft); }
.accent-col  { color: var(--accent-bright); }
.agi-col     { color: var(--agi); }
.int-col     { color: var(--int); }
.crimson-col { color: var(--crimson); }

/* ── Benchmarks ─────────────────────────── */
.benchmarks-section {
  margin-bottom: 1.25rem;
}
.benchmarks-header {
  margin-bottom: 0.5rem;
}
.benchmarks-title {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
}
.benchmarks-sub {
  margin: 0;
  font-size: 0.78rem;
  color: var(--text-muted);
  font-style: italic;
}
.benchmarks-divider {
  margin: 1.1rem 0 0.9rem;
}

/* ── Team roster & hero pool ────────────── */
.team-sections {
  margin-bottom: 1.1rem;
}
.team-block {
  margin-bottom: 1.1rem;
}
.team-block-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.7rem;
}
.team-block-title {
  margin: 0;
  font-size: 0.92rem;
}
.team-block-count {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.team-divider {
  margin: 0.2rem 0 0.9rem;
}

.roster-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
  gap: 0.55rem;
}
.roster-grid.former {
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
}
.roster-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.55rem;
  border-radius: 0.55rem;
  border: 1px solid var(--border);
  background: rgba(10, 14, 26, 0.75);
  text-decoration: none;
  color: inherit;
  transition: border-color 150ms ease, transform 150ms ease;
}
.roster-card:hover {
  border-color: var(--border-strong);
  transform: translateY(-2px);
}
.roster-card.former { opacity: 0.82; }
.roster-avatar {
  width: 36px;
  height: 36px;
  border-radius: 0.4rem;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid var(--border);
}
.roster-avatar.placeholder {
  background: rgba(255, 255, 255, 0.06);
}
.roster-meta {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}
.roster-name {
  font-family: "Cinzel", serif;
  font-size: 0.68rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.roster-sub {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  display: flex;
  gap: 0.3rem;
}

.hero-pool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(108px, 1fr));
  gap: 0.6rem;
}
.pool-hero {
  border: 1px solid var(--border);
  border-radius: 0.6rem;
  padding: 0.45rem 0.45rem 0.55rem;
  background: rgba(10, 14, 26, 0.8);
  text-decoration: none;
  color: inherit;
  transition: transform 160ms ease, border-color 160ms ease;
  display: block;
}
.pool-hero:hover { transform: translateY(-3px); }
.pool-hero.wr-high:hover { border-color: rgba(56, 197, 122, 0.45); }
.pool-hero.wr-low:hover  { border-color: rgba(201, 53, 53, 0.45); }
.pool-hero-img {
  width: 100%;
  height: 58px;
  object-fit: contain;
  margin-bottom: 0.35rem;
}
.pool-meta {
  text-align: center;
}
.pool-name {
  display: block;
  font-family: "Cinzel", serif;
  font-size: 0.62rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.2rem;
}
.pool-picks {
  display: block;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.58rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}
.pool-wr {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.62rem;
  font-weight: 700;
}
.pool-wr.wr-high { color: var(--agi); }
.pool-wr.wr-low  { color: var(--crimson); }
.pool-wr.wr-mid  { color: var(--accent-bright); }

/* ── Matchup panel ────────────────────────── */
.matchup-panel {
  border-radius: 0.85rem;
  padding: 1.25rem;
  animation: fadeUp 0.4s 0.08s ease both;
}

.matchup-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1.1rem;
}

.matchup-title {
  margin: 0;
  font-size: 1rem;
  flex: 1;
  min-width: 0;
}

.matchup-controls {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-shrink: 0;
}

.matchup-count {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  background: rgba(200,146,42,0.1);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.1rem 0.5rem;
}

/* Sort buttons */
.sort-group {
  display: flex;
  gap: 0.2rem;
}
.sort-btn {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: rgba(12,16,34,0.8);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 150ms ease;
}
.sort-btn:hover   { color: var(--text-soft); border-color: var(--border-strong); }
.sort-btn.is-active {
  color: var(--accent-bright);
  border-color: var(--border-strong);
  background: rgba(200,146,42,0.12);
  box-shadow: 0 0 8px var(--accent-glow);
}

/* Matchup grid */
.matchup-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
  gap: 0.7rem;
}

.matchup-item {
  border: 1px solid var(--border);
  border-radius: 0.65rem;
  padding: 0.5rem 0.5rem 0.6rem;
  background: rgba(10,14,26,0.8);
  transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
  display: block;
  text-decoration: none;
}
.matchup-item:hover              { transform: translateY(-3px); }
.matchup-item.wr-high:hover { border-color: rgba(56,197,122,0.5); box-shadow: 0 8px 24px rgba(56,197,122,0.15); }
.matchup-item.wr-low:hover  { border-color: rgba(201,53,53,0.5);  box-shadow: 0 8px 24px rgba(201,53,53,0.15); }
.matchup-item.wr-mid:hover  { border-color: var(--border-strong); }

.m-meta       { margin-top: 0.4rem; }
.m-name {
  font-family: "Cinzel", serif;
  font-size: 0.66rem;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text);
  margin-bottom: 0.4rem;
}
.m-wr-bar-wrap {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.22rem;
}
.m-wr-bar-track {
  flex: 1;
  height: 4px;
  border-radius: 999px;
  background: rgba(255,255,255,0.06);
  overflow: hidden;
}
.m-wr-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.8s cubic-bezier(0.16,1,0.3,1);
}
.m-wr-bar-fill.wr-high { background: linear-gradient(90deg, #28a06a, #3dd4b8); }
.m-wr-bar-fill.wr-low  { background: linear-gradient(90deg, #a02828, #e87070); }
.m-wr-bar-fill.wr-mid  { background: linear-gradient(90deg, #8a7020, var(--accent-bright)); }
.m-wr-label {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.6rem;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
}
.m-wr-label.wr-high { color: var(--agi); }
.m-wr-label.wr-low  { color: var(--crimson); }
.m-wr-label.wr-mid  { color: var(--accent-bright); }
.m-games {
  font-size: 0.58rem;
  color: var(--text-muted);
  text-align: center;
  font-family: "Barlow Condensed", sans-serif;
}

.empty-state {
  text-align: center;
  color: var(--text-muted);
  margin-top: 1rem;
  font-style: italic;
}

@media (max-width: 860px) {
  .details-wrap { grid-template-columns: 1fr; }
  .side-panel   { position: static; }
}

@media (max-width: 520px) {
  .matchup-header { flex-direction: column; align-items: flex-start; }
  .matchup-controls { width: 100%; justify-content: space-between; }
}
</style>

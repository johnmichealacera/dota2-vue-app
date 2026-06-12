<template>
  <section>
    <div v-if="isLoading" class="details-wrap">
      <dota-loader :isLoading="isLoading" loaderType="detail" />
    </div>

    <div v-if="!isLoading" class="details-wrap">

      <!-- ── Side panel ─────────────────────────────── -->
      <aside class="side-panel glass-panel">
        <div class="portrait-wrap">
          <img v-if="itemType === 'hero'" :src="mainItem.img" :alt="mainItem.name" class="portrait" />
          <fallback v-else :imageUrl="mainItem.img" />
        </div>

        <h2 class="item-name">{{ mainItem.name }}</h2>

        <template v-if="itemType === 'hero'">
          <div class="attr-pills">
            <span class="attr-pill str">STR</span>
            <span class="attr-pill agi">AGI</span>
            <span class="attr-pill int">INT</span>
          </div>

          <div class="divider-rune" style="margin: 1rem 0 0.8rem">Base Stats</div>

          <div class="stats-list">
            <div class="stat-row">
              <span class="srow-label">Attack Type</span>
              <span :class="mainItem.attackType === 'Melee' ? 'badge badge-melee' : 'badge badge-ranged'">
                {{ mainItem.attackType }}
              </span>
            </div>
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
              <span class="srow-label">Move Spd</span>
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
        </template>

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

          <!-- win rate bar -->
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
        <div class="matchup-header">
          <h1 class="matchup-title">{{ itemType === 'hero' ? 'Hero Matchups' : 'Team Matchups' }}</h1>
          <span class="matchup-count" v-if="itemMatchups.length">{{ itemMatchups.length }} shown</span>
        </div>

        <div class="matchup-grid">
          <router-link
            v-for="item in itemMatchups"
            :key="item.id"
            :to="{ name: 'ItemCard', params: { id: item.id, type: 'hero' } }"
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

        <p v-if="itemMatchups.length === 0" class="empty-state">No matchup data found.</p>
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
import { buildApiUrl } from '../config/api';

export default defineComponent({
  name: 'ItemCard',
  components: { DotaLoader, Fallback },
  setup() {
    const mainItem = ref({});
    const itemMatchups = ref([]);
    const route = useRoute();
    const isLoading = ref(false);
    const currentPage = ref(1);
    const paginationData = ref({ totalTeams: 0, currentPage: 1, pageSize: 10, totalPages: 1 });

    const winRate = computed(() => {
      const { wins, losses } = mainItem.value;
      if (wins == null || losses == null) return 0;
      const total = wins + losses;
      return total === 0 ? 0 : ((wins / total) * 100).toFixed(1);
    });

    const getWinRateClass = (wr) => {
      if (wr >= 55) return 'wr-high';
      if (wr <= 45) return 'wr-low';
      return 'wr-mid';
    };

    const fetchData = (page) => {
      isLoading.value = true;
      const type = route.params.type;
      const id   = route.params.id;

      const heroDetailReq = type === 'hero'
        ? axios.get(buildApiUrl(`/hero/${id}`))
        : axios.get(buildApiUrl(`/team/${id}`));

      const matchupReq = type === 'hero'
        ? axios.get(buildApiUrl(`/hero-matchup/${id}`),  { params: { pageSize: 18, page } })
        : axios.get(buildApiUrl(`/team-matchup/${id}`),  { params: { pageSize: 18, page } });

      heroDetailReq.then(r => { mainItem.value = r.data; }).catch(console.error);
      matchupReq.then(r => {
        itemMatchups.value = r.data?.items;
        paginationData.value = {
          totalTeams:  r.data?.pagination?.totalItems,
          currentPage: r.data?.pagination?.currentPage,
          pageSize:    r.data?.pagination?.pageSize,
          totalPages:  r.data?.pagination?.totalPages,
        };
        isLoading.value = false;
      }).catch(console.error);
    };

    watch(() => route.params.id, () => fetchData(currentPage.value), { immediate: true });

    return {
      mainItem, itemMatchups, isLoading,
      itemType: route.params.type,
      onClickHandler: (page) => fetchData(page),
      currentPage, paginationData, winRate, getWinRateClass,
    };
  }
});
</script>

<style>
.details-wrap {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.1rem;
  align-items: start;
}

/* ── Side panel ─────────────────────── */
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
  box-shadow: 0 8px 32px rgba(2, 4, 12, 0.6), 0 0 0 1px rgba(232, 168, 56, 0.08);
}

.item-name {
  margin: 0 0 0.6rem;
  font-size: 1.15rem;
  text-align: center;
}

.attr-pills {
  display: flex;
  justify-content: center;
  gap: 0.35rem;
  margin-bottom: 0.2rem;
}

.attr-pill {
  padding: 0.18rem 0.55rem;
  border-radius: 3px;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}
.attr-pill.str { background: rgba(201,53,53,0.2); border: 1px solid rgba(201,53,53,0.4); color: var(--str); }
.attr-pill.agi { background: rgba(56,197,122,0.2); border: 1px solid rgba(56,197,122,0.4); color: var(--agi); }
.attr-pill.int { background: rgba(91,160,240,0.2); border: 1px solid rgba(91,160,240,0.4); color: var(--int); }

.stats-list { display: flex; flex-direction: column; gap: 0.42rem; }

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0;
  border-bottom: 1px solid rgba(200, 146, 42, 0.06);
}

.srow-label {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.srow-val {
  font-weight: 600;
  font-size: 0.82rem;
  color: var(--text-soft);
}
.accent-col  { color: var(--accent-bright); }
.agi-col     { color: var(--agi); }
.int-col     { color: var(--int); }
.crimson-col { color: var(--crimson); }

/* ── Matchup panel ────────────────────── */
.matchup-panel {
  border-radius: 0.85rem;
  padding: 1.25rem;
  animation: fadeUp 0.4s 0.08s ease both;
}

.matchup-header {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 1.1rem;
}

.matchup-title {
  margin: 0;
  font-size: 1.05rem;
}

.matchup-count {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  background: rgba(200,146,42,0.1);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.1rem 0.55rem;
}

.matchup-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
  gap: 0.7rem;
}

.matchup-item {
  border: 1px solid var(--border);
  border-radius: 0.65rem;
  padding: 0.5rem 0.5rem 0.6rem;
  background: rgba(10, 14, 26, 0.8);
  transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
  display: block;
  text-decoration: none;
}

.matchup-item:hover {
  transform: translateY(-3px);
}
.matchup-item.wr-high:hover {
  border-color: rgba(56,197,122,0.5);
  box-shadow: 0 8px 24px rgba(56,197,122,0.15);
}
.matchup-item.wr-low:hover {
  border-color: rgba(201,53,53,0.5);
  box-shadow: 0 8px 24px rgba(201,53,53,0.15);
}
.matchup-item.wr-mid:hover {
  border-color: var(--border-strong);
}

.m-meta { margin-top: 0.4rem; }

.m-name {
  font-family: "Cinzel", serif;
  font-size: 0.68rem;
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
  gap: 0.4rem;
  margin-bottom: 0.25rem;
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
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  white-space: nowrap;
  flex-shrink: 0;
}
.m-wr-label.wr-high { color: var(--agi); }
.m-wr-label.wr-low  { color: var(--crimson); }
.m-wr-label.wr-mid  { color: var(--accent-bright); }

.m-games {
  font-size: 0.6rem;
  color: var(--text-muted);
  text-align: center;
  font-family: "Barlow Condensed", sans-serif;
  letter-spacing: 0.04em;
}

.empty-state {
  text-align: center;
  color: var(--text-muted);
  margin-top: 1rem;
  font-style: italic;
}

@media (max-width: 860px) {
  .details-wrap {
    grid-template-columns: 1fr;
  }
  .side-panel {
    position: static;
  }
}
</style>

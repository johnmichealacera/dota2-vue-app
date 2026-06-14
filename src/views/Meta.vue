<template>
  <section>
    <!-- ── Banner ──────────────────────────────────── -->
    <div class="page-banner glass-panel">
      <div class="banner-deco" aria-hidden="true">
        <span class="deco-rune">◆</span>
        <span class="deco-rune sm">⬡</span>
        <span class="deco-rune xs">◆</span>
      </div>
      <p class="eyebrow">Strategy Hub</p>
      <h1>Pro Meta Snapshot</h1>
      <p class="subtitle">{{ bracketSubtitle }}</p>
      <div class="banner-stats" v-if="!isLoading && !error">
        <span class="bstat"><span class="bstat-val">{{ heroesWithStats.length }}</span> Heroes</span>
        <span class="bstat-sep">·</span>
        <span class="bstat">{{ bracketLabel }} Data</span>
      </div>
    </div>

    <live-ticker />

    <error-banner v-if="error" :message="error" :on-retry="fetchData" />

    <!-- ── Skeleton ─────────────────────────────────── -->
    <template v-if="isLoading && !error">
      <div class="skeleton-top3 glass-panel"></div>
      <div v-for="n in 5" :key="n" class="skeleton-tier glass-panel"></div>
    </template>

    <!-- ── Content ─────────────────────────────────── -->
    <template v-if="!isLoading && !error">

      <!-- Top 3 -->
      <div class="top3-strip">
        <router-link
          v-for="(hero, i) in top3"
          :key="hero.id"
          :to="`/item/${hero.id}/hero`"
          class="top3-card glass-panel"
          :class="`rank-${i + 1}`"
        >
          <span class="rank-badge">#{{ i + 1 }}</span>
          <img :src="hero.img" :alt="hero.name" class="top3-img" />
          <div class="top3-info">
            <p class="top3-name">{{ hero.name }}</p>
            <div class="top3-stats">
              <span class="ts-pill wr">{{ hero.stat ? hero.stat.winRate.toFixed(1) + '%' : '—' }}</span>
              <span class="ts-pill pk">{{ hero.stat ? hero.stat.totalPicks : 0 }} picks</span>
              <span class="ts-pill bn" v-if="hero.stat?.totalBans">{{ hero.stat.totalBans }} bans</span>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Bracket filter -->
      <div class="bracket-bar">
        <span class="sort-label">Bracket</span>
        <button
          v-for="opt in bracketOpts"
          :key="opt.key"
          class="sort-btn"
          :class="{ 'is-active': bracketMode === opt.key }"
          @click="bracketMode = opt.key"
        >{{ opt.label }}</button>
      </div>

      <!-- Sort toggle -->
      <div class="sort-bar">
        <span class="sort-label">Rank by</span>
        <button
          v-for="opt in sortOpts"
          :key="opt.key"
          class="sort-btn"
          :class="{ 'is-active': sortMode === opt.key }"
          @click="sortMode = opt.key"
        >{{ opt.label }}</button>
      </div>

      <!-- Tier rows -->
      <div
        v-for="tier in tieredHeroes"
        :key="tier.key"
        class="tier-row glass-panel"
      >
        <div class="tier-label-wrap">
          <span class="tier-badge" :class="`tier-${tier.key}`">{{ tier.key }}</span>
          <span class="tier-count">{{ tier.heroes.length }}</span>
        </div>
        <div class="tier-heroes">
          <router-link
            v-for="hero in tier.heroes"
            :key="hero.id"
            :to="`/item/${hero.id}/hero`"
            class="hero-chip"
            :title="`${hero.name} — ${formatChipStat(hero)}`"
          >
            <img :src="hero.img" :alt="hero.name" class="chip-img" />
            <span class="chip-stat">{{ formatChipStat(hero) }}</span>
          </router-link>
        </div>
      </div>

    </template>

    <records-wall v-if="!isLoading && !error" />
  </section>
</template>

<script>
import axios from 'axios';
import { ref, computed, watch, onMounted } from 'vue';
import ErrorBanner from '../components/ErrorBanner.vue';
import RecordsWall from '../components/RecordsWall.vue';
import LiveTicker from '../components/LiveTicker.vue';
import { buildApiUrl } from '../config/api';

export default {
  name: 'MetaPage',
  components: { ErrorBanner, RecordsWall, LiveTicker },
  setup() {
    const allHeroes = ref([]);
    const heroStats = ref({});
    const isLoading = ref(false);
    const error     = ref('');
    const sortMode    = ref('winRate');
    const bracketMode = ref('all');

    const bracketOpts = [
      { key: 'all',      label: 'All Brackets' },
      { key: 'legend',   label: 'Legend+'      },
      { key: 'divine',   label: 'Divine+'      },
      { key: 'immortal', label: 'Immortal'     },
    ];

    const sortOpts = [
      { key: 'winRate',  label: 'Win Rate'   },
      { key: 'pickRate', label: 'Pick Count'  },
      { key: 'banRate',  label: 'Ban Count'   },
    ];

    const bracketLabel = computed(() => {
      const opt = bracketOpts.find((o) => o.key === bracketMode.value);
      return opt?.label ?? 'Ranked';
    });

    const bracketSubtitle = computed(() => {
      const labels = {
        all: 'All ranked skill brackets',
        legend: 'Legend and above',
        divine: 'Divine and above',
        immortal: 'Immortal only',
      };
      const scope = labels[bracketMode.value] ?? 'Ranked meta';
      return `${scope} — tier list ranked by win rate and picks, updated every 24 hours.`;
    });

    const fetchData = () => {
      isLoading.value = true;
      error.value = '';
      Promise.all([
        axios.get(buildApiUrl('/heroes'), { params: { pageSize: 999, page: 1 } }),
        axios.get(buildApiUrl('/hero-stats'), { params: { bracket: bracketMode.value } }),
      ]).then(([heroRes, statRes]) => {
        allHeroes.value = heroRes.data?.items ?? [];
        heroStats.value = statRes.data ?? {};
        isLoading.value = false;
      }).catch(() => {
        error.value = 'Failed to load meta data. The backend may be starting up — please retry.';
        isLoading.value = false;
      });
    };

    watch(bracketMode, fetchData);

    const heroesWithStats = computed(() =>
      allHeroes.value.map(h => ({
        ...h,
        stat: heroStats.value[String(h.id)] ?? null,
      }))
    );

    const getSortVal = (hero) => {
      if (!hero.stat) return 0;
      if (sortMode.value === 'winRate')  return hero.stat.winRate    ?? 0;
      if (sortMode.value === 'pickRate') return hero.stat.totalPicks ?? 0;
      return hero.stat.totalBans ?? 0;
    };

    const sortedHeroes = computed(() =>
      [...heroesWithStats.value].sort((a, b) => getSortVal(b) - getSortVal(a))
    );

    const top3 = computed(() => sortedHeroes.value.slice(0, 3));

    const tieredHeroes = computed(() => {
      const list = sortedHeroes.value;
      const n    = list.length;
      const cuts = [
        { key: 'S', end: Math.min(10,  n) },
        { key: 'A', end: Math.min(30,  n) },
        { key: 'B', end: Math.min(70,  n) },
        { key: 'C', end: Math.min(110, n) },
        { key: 'D', end: n                },
      ];
      let prev = 0;
      return cuts
        .filter(t => t.end > prev)
        .map(t => {
          const row = { key: t.key, heroes: list.slice(prev, t.end) };
          prev = t.end;
          return row;
        });
    });

    const formatChipStat = (hero) => {
      if (!hero.stat) return '—';
      if (sortMode.value === 'winRate')  return `${hero.stat.winRate?.toFixed(0) ?? 0}%`;
      if (sortMode.value === 'pickRate') return `${hero.stat.totalPicks ?? 0}`;
      return `${hero.stat.totalBans ?? 0}`;
    };

    onMounted(fetchData);

    return {
      isLoading, error, sortMode, sortOpts, bracketMode, bracketOpts,
      bracketLabel, bracketSubtitle,
      heroesWithStats, top3, tieredHeroes,
      fetchData, formatChipStat,
    };
  },
};
</script>

<style scoped>
/* ── Banner ──────────────────────────────────── */
.page-banner {
  border-radius: 0.85rem;
  padding: 0.7rem 1.1rem 0.6rem;
  margin-bottom: 0.85rem;
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
.deco-rune    { color: rgba(34, 197, 94, 0.1);  font-size: 3.5rem; line-height: 1; }
.deco-rune.sm { color: rgba(232, 168, 56, 0.08); font-size: 2.2rem; }
.deco-rune.xs { color: rgba(34, 197, 94, 0.07);  font-size: 1.3rem; }

.eyebrow {
  margin: 0 0 0.15rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.58rem;
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 600;
  color: #22c55e;
}

h1 {
  margin: 0 0 0.2rem;
  font-size: clamp(1.05rem, 2vw, 1.5rem);
  background: linear-gradient(120deg, #ede8d8, #22c55e 85%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: 0 0 0.35rem;
  color: var(--text-muted);
  max-width: 40rem;
  font-size: 0.78rem;
}

.banner-stats {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}
.bstat     { display: inline-flex; align-items: center; gap: 0.3rem; }
.bstat-sep { opacity: 0.4; }
.bstat-val { font-weight: 700; color: #22c55e; }

/* ── Top 3 ───────────────────────────────────── */
.top3-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.65rem;
  margin-bottom: 0.85rem;
}

.top3-card {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  border-radius: 0.75rem;
  padding: 0.7rem 0.85rem;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: transform 180ms ease, box-shadow 180ms ease;
}
.top3-card:hover { transform: translateY(-3px); }

.rank-1 { border-color: rgba(245, 158, 11, 0.45); box-shadow: 0 0 22px rgba(245, 158, 11, 0.12); }
.rank-2 { border-color: rgba(148, 163, 184, 0.3); box-shadow: 0 0 16px rgba(148, 163, 184, 0.08); }
.rank-3 { border-color: rgba(180, 120, 60, 0.38); box-shadow: 0 0 16px rgba(180, 120, 60, 0.1); }

.rank-badge {
  position: absolute;
  top: 0.45rem;
  right: 0.6rem;
  font-family: "Cinzel", serif;
  font-size: 0.6rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.18);
}

.top3-img {
  width: 52px;
  height: 52px;
  border-radius: 0.45rem;
  object-fit: cover;
  object-position: center top;
  flex-shrink: 0;
  border: 1px solid rgba(255,255,255,0.07);
}

.top3-info {
  flex: 1;
  min-width: 0;
}

.top3-name {
  margin: 0 0 0.38rem;
  font-family: "Cinzel", serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top3-stats {
  display: flex;
  gap: 0.28rem;
  flex-wrap: wrap;
}

.ts-pill {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 0.1rem 0.38rem;
  border-radius: 3px;
}
.ts-pill.wr { background: rgba(34, 197, 94, 0.15);  color: #4ade80; }
.ts-pill.pk { background: rgba(59, 130, 246, 0.14); color: #7fb5f5; }
.ts-pill.bn { background: rgba(201, 53, 53, 0.14);  color: #f87171; }

/* ── Bracket + sort bars ─────────────────────── */
.bracket-bar,
.sort-bar {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.65rem;
  flex-wrap: wrap;
}

.bracket-bar {
  margin-bottom: 0.45rem;
}

/* ── Sort bar ────────────────────────────────── */
.sort-bar {
  margin-bottom: 0.65rem;
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
.sort-btn:hover { color: var(--text-soft); border-color: var(--border-strong); }
.sort-btn.is-active {
  color: #22c55e;
  border-color: rgba(34, 197, 94, 0.4);
  background: rgba(34, 197, 94, 0.09);
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.2);
}

/* ── Tier rows ───────────────────────────────── */
.tier-row {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  border-radius: 0.75rem;
  padding: 0.6rem 0.85rem;
  margin-bottom: 0.45rem;
}

.tier-label-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
  width: 2.2rem;
  padding-top: 0.1rem;
}

.tier-badge {
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  display: grid;
  place-items: center;
  font-family: "Cinzel", serif;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0;
}
.tier-S { background: rgba(245, 158, 11, 0.18); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.45); }
.tier-A { background: rgba(34, 197, 94, 0.14);  color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.4); }
.tier-B { background: rgba(59, 130, 246, 0.14); color: #7fb5f5; border: 1px solid rgba(59, 130, 246, 0.4); }
.tier-C { background: rgba(139, 92, 246, 0.14); color: #c4a8f5; border: 1px solid rgba(139, 92, 246, 0.4); }
.tier-D { background: rgba(201, 53, 53, 0.12);  color: #f87171; border: 1px solid rgba(201, 53, 53, 0.35); }

.tier-count {
  font-size: 0.58rem;
  color: var(--text-muted);
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 600;
}

.tier-heroes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  align-items: flex-start;
}

/* ── Hero chips ──────────────────────────────── */
.hero-chip {
  position: relative;
  width: 52px;
  border-radius: 6px;
  overflow: hidden;
  text-decoration: none;
  display: block;
  border: 1px solid rgba(255, 255, 255, 0.07);
  transition: transform 150ms ease, border-color 150ms ease;
}
.hero-chip:hover {
  transform: scale(1.1);
  border-color: var(--border-strong);
}

.chip-img {
  width: 52px;
  height: 38px;
  object-fit: cover;
  object-position: center top;
  display: block;
}

.chip-stat {
  display: block;
  text-align: center;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.58rem;
  font-weight: 700;
  color: var(--text-soft);
  background: rgba(6, 8, 15, 0.88);
  padding: 0.08rem 0;
  letter-spacing: 0.02em;
}

/* ── Skeleton ────────────────────────────────── */
.skeleton-top3 {
  height: 86px;
  border-radius: 0.75rem;
  margin-bottom: 0.85rem;
}
.skeleton-tier {
  height: 64px;
  border-radius: 0.75rem;
  margin-bottom: 0.45rem;
}
.skeleton-top3,
.skeleton-tier {
  background-image: linear-gradient(90deg,
    rgba(255,255,255,0.03) 25%,
    rgba(255,255,255,0.07) 50%,
    rgba(255,255,255,0.03) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Responsive ──────────────────────────────── */
@media (max-width: 640px) {
  .top3-strip { grid-template-columns: 1fr; }
  .top3-img   { width: 44px; height: 44px; }
  .hero-chip  { width: 44px; }
  .chip-img   { width: 44px; height: 32px; }
}
</style>

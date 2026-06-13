<template>
  <section class="records-wall">
    <div class="records-head">
      <h2>All-Time Records</h2>
      <p class="records-sub">Highest recorded stats across all public Dota 2 matches.</p>
    </div>

    <div v-if="isLoading" class="records-grid">
      <div v-for="n in 8" :key="n" class="record-card skeleton glass-panel"></div>
    </div>

    <error-banner v-else-if="error" :message="error" :on-retry="fetchRecords" />

    <div v-else class="records-grid">
      <router-link
        v-for="record in records"
        :key="record.field"
        :to="`/match/${record.matchId}`"
        class="record-card glass-panel"
      >
        <span class="record-field">{{ fieldLabel(record.field) }}</span>
        <span class="record-value">{{ formatScore(record) }}</span>
        <div class="record-meta" v-if="record.heroName">
          <img
            v-if="record.heroImg"
            :src="record.heroImg"
            :alt="record.heroName"
            class="record-hero"
            loading="lazy"
          />
          <span class="record-hero-name">{{ record.heroName }}</span>
        </div>
        <span v-else class="record-meta muted">Match record</span>
        <span class="record-time">{{ timeAgo(record.startTime) }}</span>
      </router-link>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import ErrorBanner from './ErrorBanner.vue';
import { buildApiUrl } from '../config/api';

const RECORD_FIELDS = [
  { field: 'kills', label: 'Most Kills' },
  { field: 'gold_per_min', label: 'Highest GPM' },
  { field: 'xp_per_min', label: 'Highest XPM' },
  { field: 'last_hits', label: 'Most Last Hits' },
  { field: 'hero_damage', label: 'Most Hero Damage' },
  { field: 'tower_damage', label: 'Most Tower Damage' },
  { field: 'hero_healing', label: 'Most Healing' },
  { field: 'duration', label: 'Longest Game' },
];

export default {
  name: 'RecordsWall',
  components: { ErrorBanner },
  setup() {
    const records = ref([]);
    const isLoading = ref(false);
    const error = ref('');

    const fieldLabel = (field) =>
      RECORD_FIELDS.find((f) => f.field === field)?.label ?? field;

    const formatScore = (record) => {
      if (record.field === 'duration') {
        const total = Math.round(record.score);
        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;
        if (h > 0) return `${h}h ${m}m`;
        return `${m}:${String(s).padStart(2, '0')}`;
      }
      if (record.field === 'hero_damage' || record.field === 'tower_damage' || record.field === 'hero_healing') {
        return Math.round(record.score).toLocaleString();
      }
      return Number.isInteger(record.score)
        ? record.score.toLocaleString()
        : record.score.toLocaleString(undefined, { maximumFractionDigits: 1 });
    };

    const timeAgo = (ts) => {
      const secs = Math.floor(Date.now() / 1000) - ts;
      if (secs < 60) return `${secs}s ago`;
      const mins = Math.floor(secs / 60);
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      if (days < 30) return `${days}d ago`;
      return `${Math.floor(days / 30)}mo ago`;
    };

    const fetchRecords = () => {
      isLoading.value = true;
      error.value = '';
      records.value = [];

      Promise.allSettled(
        RECORD_FIELDS.map(({ field }) =>
          axios.get(buildApiUrl(`/records/${field}`))
        )
      )
        .then((results) => {
          const loaded = [];
          for (let i = 0; i < results.length; i++) {
            if (results[i].status === 'fulfilled' && results[i].value?.data) {
              loaded.push(results[i].value.data);
            }
          }
          records.value = loaded;
          if (!loaded.length) {
            error.value = 'No records available right now.';
          }
          isLoading.value = false;
        })
        .catch(() => {
          error.value = 'Failed to load records. The backend may still be deploying — try again shortly.';
          isLoading.value = false;
        });
    };

    onMounted(fetchRecords);

    return {
      records, isLoading, error,
      fieldLabel, formatScore, timeAgo, fetchRecords,
    };
  },
};
</script>

<style scoped>
.records-wall {
  margin-top: 1.25rem;
}

.records-head {
  margin-bottom: 0.85rem;
}

.records-head h2 {
  margin: 0 0 0.25rem;
  font-family: "Cinzel", serif;
  font-size: 1rem;
  color: var(--text-soft);
}

.records-sub {
  margin: 0;
  font-size: 0.78rem;
  color: var(--text-muted);
}

.records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.65rem;
}

.record-card {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.85rem 1rem;
  border-radius: 0.7rem;
  border: 1px solid var(--border);
  text-decoration: none;
  transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
}

.record-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-strong);
  box-shadow: 0 0 18px rgba(232, 168, 56, 0.12);
}

.record-card.skeleton {
  min-height: 110px;
  animation: pulse 1.4s ease-in-out infinite;
}

.record-field {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.record-value {
  font-family: "Cinzel", serif;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--accent-bright);
  line-height: 1.1;
}

.record-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
}

.record-meta.muted {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.record-hero {
  width: 40px;
  height: 23px;
  object-fit: cover;
  border-radius: 3px;
  border: 1px solid var(--border);
  flex-shrink: 0;
}

.record-hero-name {
  font-size: 0.75rem;
  color: var(--text-soft);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.record-time {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-top: auto;
}

@keyframes pulse {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 0.85; }
}
</style>

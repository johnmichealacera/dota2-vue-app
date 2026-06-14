<template>
  <section class="item-timings-section">
    <div class="item-timings-header">
      <h2 class="item-timings-title">Best Item Path</h2>
      <p class="item-timings-sub">
        Ranked pub item timings with the highest win rates (10+ game sample).
      </p>
    </div>

    <div class="timing-list">
      <div
        v-for="entry in timings"
        :key="`${entry.item}-${entry.timeSecs}`"
        class="timing-row"
        :class="winClass(entry.winRate)"
      >
        <div class="timing-item">
          <img
            v-if="entry.itemImg"
            :src="entry.itemImg"
            :alt="entry.itemName"
            class="timing-item-img"
            loading="lazy"
          />
          <div v-else class="timing-item-img placeholder"></div>
          <div class="timing-item-meta">
            <span class="timing-item-name">{{ entry.itemName }}</span>
            <span class="timing-deadline">by {{ entry.timeLabel }}</span>
          </div>
        </div>

        <div class="timing-stats">
          <div class="timing-wr-bar-wrap">
            <div class="timing-wr-bar-track">
              <div
                class="timing-wr-bar-fill"
                :class="winClass(entry.winRate)"
                :style="{ width: Math.min(entry.winRate, 100) + '%' }"
              ></div>
            </div>
            <span class="timing-wr" :class="winClass(entry.winRate)">
              {{ entry.winRate.toFixed(1) }}%
            </span>
          </div>
          <span class="timing-games">{{ entry.games }} games</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ItemTimings',
  props: {
    timings: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    winClass(wr) {
      if (wr >= 55) return 'wr-good';
      if (wr <= 45) return 'wr-bad';
      return 'wr-mid';
    },
  },
};
</script>

<style scoped>
.item-timings-section {
  margin-bottom: 1.1rem;
}

.item-timings-header {
  margin-bottom: 0.75rem;
}

.item-timings-title {
  margin: 0 0 0.2rem;
  font-size: 0.95rem;
}

.item-timings-sub {
  margin: 0;
  font-size: 0.72rem;
  color: var(--text-muted);
}

.timing-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.timing-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.55rem 0.65rem;
  border-radius: 0.55rem;
  border: 1px solid rgba(200, 146, 42, 0.1);
  background: rgba(6, 8, 15, 0.35);
}

.timing-item {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
  flex: 1;
}

.timing-item-img {
  width: 44px;
  height: 32px;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: rgba(0, 0, 0, 0.35);
  flex-shrink: 0;
}
.timing-item-img.placeholder {
  background: rgba(255, 255, 255, 0.05);
}

.timing-item-meta {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.timing-item-name {
  font-family: "Cinzel", serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.timing-deadline {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.timing-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
  flex-shrink: 0;
  min-width: 110px;
}

.timing-wr-bar-wrap {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  width: 100%;
}

.timing-wr-bar-track {
  flex: 1;
  height: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
}

.timing-wr-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.5s ease;
}
.timing-wr-bar-fill.wr-good { background: var(--agi); }
.timing-wr-bar-fill.wr-mid  { background: var(--accent-bright); }
.timing-wr-bar-fill.wr-bad  { background: var(--crimson); }

.timing-wr {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  min-width: 2.5rem;
  text-align: right;
}
.timing-wr.wr-good { color: var(--agi); }
.timing-wr.wr-mid  { color: var(--accent-bright); }
.timing-wr.wr-bad  { color: var(--crimson); }

.timing-games {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .timing-row {
    flex-direction: column;
    align-items: stretch;
  }
  .timing-stats {
    align-items: stretch;
    min-width: 0;
  }
}
</style>

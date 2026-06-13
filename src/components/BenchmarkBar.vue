<template>
  <div class="bench-row">
    <div class="bench-head">
      <span class="bench-label">{{ metric.label }}</span>
      <span class="bench-hint">
        Need <strong>{{ formatValue(metric.p90) }}</strong> for 90th percentile
      </span>
    </div>

    <div class="bench-track">
      <div class="bench-fill" :style="{ width: markerPos(metric.p90) + '%' }"></div>
      <div
        v-for="mark in markers"
        :key="mark.key"
        class="bench-marker"
        :class="mark.key"
        :style="{ left: markerPos(mark.value) + '%' }"
        :title="`${mark.label}: ${formatValue(mark.value)}`"
      >
        <span class="marker-line"></span>
        <span class="marker-tag">{{ mark.label }}</span>
      </div>
    </div>

    <div class="bench-values">
      <span v-for="mark in markers" :key="mark.key" class="bench-val" :class="mark.key">
        {{ mark.label }} {{ formatValue(mark.value) }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BenchmarkBar',
  props: {
    metric: {
      type: Object,
      required: true,
    },
  },
  computed: {
    markers() {
      return [
        { key: 'p50', label: 'P50', value: this.metric.p50 },
        { key: 'p75', label: 'P75', value: this.metric.p75 },
        { key: 'p90', label: 'P90', value: this.metric.p90 },
      ];
    },
  },
  methods: {
    markerPos(value) {
      const max = this.metric.max || 1;
      return Math.min(100, Math.max(0, (value / max) * 100));
    },
    formatValue(value) {
      const key = this.metric.key;
      if (key === 'heroDamagePerMin') return Math.round(value).toLocaleString();
      if (key === 'killsPerMin' || key === 'lastHitsPerMin') return value.toFixed(2);
      return Math.round(value).toLocaleString();
    },
  },
};
</script>

<style scoped>
.bench-row {
  padding: 0.85rem 0;
  border-bottom: 1px solid rgba(200, 146, 42, 0.08);
}
.bench-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.bench-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.55rem;
  flex-wrap: wrap;
}

.bench-label {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-soft);
}

.bench-hint {
  font-size: 0.72rem;
  color: var(--text-muted);
}
.bench-hint strong {
  color: var(--accent-bright);
  font-weight: 600;
}

.bench-track {
  position: relative;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  overflow: visible;
  margin-bottom: 1.6rem;
}

.bench-fill {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(200, 146, 42, 0.35), rgba(232, 168, 56, 0.75));
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.bench-marker {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.marker-line {
  width: 2px;
  height: 18px;
  border-radius: 1px;
  background: var(--text-muted);
  margin-bottom: 0.25rem;
}
.bench-marker.p50 .marker-line { background: #7fbeff; }
.bench-marker.p75 .marker-line { background: var(--accent-bright); }
.bench-marker.p90 .marker-line { background: var(--agi); box-shadow: 0 0 6px rgba(56, 197, 122, 0.5); }

.marker-tag {
  position: absolute;
  top: 14px;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--text-muted);
}
.bench-marker.p90 .marker-tag { color: var(--agi); }

.bench-values {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.15rem;
}

.bench-val {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}
.bench-val.p50 { color: #7fbeff; }
.bench-val.p75 { color: var(--accent-bright); }
.bench-val.p90 { color: var(--agi); font-weight: 700; }
</style>

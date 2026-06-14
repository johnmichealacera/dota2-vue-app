<template>
  <div class="mini-chart">
    <svg
      v-if="pathD"
      :viewBox="`0 0 ${width} ${height}`"
      preserveAspectRatio="none"
      class="chart-svg"
      role="img"
      :aria-label="ariaLabel"
    >
      <defs>
        <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(56, 189, 248, 0.35)" />
          <stop offset="100%" stop-color="rgba(56, 189, 248, 0)" />
        </linearGradient>
      </defs>
      <path :d="areaD" :fill="`url(#${gradientId})`" />
      <path :d="pathD" class="chart-line" />
    </svg>
    <div v-if="pathD" class="chart-labels">
      <span>{{ formatValue(minVal) }}</span>
      <span>{{ formatValue(maxVal) }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MiniChart',
  props: {
    values: { type: Array, required: true },
    valueKey: { type: String, default: 'value' },
    label: { type: String, default: 'Rating trend' },
    format: { type: String, default: 'mmr' },
  },
  data() {
    return {
      width: 200,
      height: 48,
      gradientId: `chart-grad-${Math.random().toString(36).slice(2, 9)}`,
    };
  },
  computed: {
    numericValues() {
      return this.values
        .map((p) => Number(p[this.valueKey] ?? p))
        .filter((v) => Number.isFinite(v) && v > 0);
    },
    minVal() {
      if (!this.numericValues.length) return 0;
      return Math.min(...this.numericValues);
    },
    maxVal() {
      if (!this.numericValues.length) return 0;
      return Math.max(...this.numericValues);
    },
    pathD() {
      const vals = this.numericValues;
      if (vals.length < 2) return '';

      const pad = 4;
      const w = this.width - pad * 2;
      const h = this.height - pad * 2;
      const range = this.maxVal - this.minVal || 1;

      const points = vals.map((v, i) => {
        const x = pad + (i / (vals.length - 1)) * w;
        const y = pad + h - ((v - this.minVal) / range) * h;
        return `${x},${y}`;
      });

      return `M ${points.join(' L ')}`;
    },
    areaD() {
      if (!this.pathD) return '';
      const pad = 4;
      const bottom = this.height - pad;
      const firstX = this.pathD.match(/M ([\d.]+)/)?.[1] ?? pad;
      const lastX = this.pathD.split(' ').pop()?.split(',')[0] ?? this.width - pad;
      return `${this.pathD} L ${lastX},${bottom} L ${firstX},${bottom} Z`;
    },
    ariaLabel() {
      return `${this.label}: ${this.formatValue(this.minVal)} to ${this.formatValue(this.maxVal)}`;
    },
  },
  methods: {
    formatValue(v) {
      if (this.format === 'tier') {
        const medal = Math.floor(v / 10);
        const stars = v % 10;
        return stars ? `T${medal} ★${stars}` : `T${medal}`;
      }
      return Math.round(v).toLocaleString();
    },
  },
};
</script>

<style scoped>
.mini-chart {
  width: 100%;
}

.chart-svg {
  width: 100%;
  height: 48px;
  display: block;
}

.chart-line {
  fill: none;
  stroke: #38bdf8;
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.25rem;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}
</style>

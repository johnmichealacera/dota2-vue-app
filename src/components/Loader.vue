<template>
  <template v-if="isLoading">
    <div v-if="loaderType === 'home'" class="skeleton-cards">
      <div v-for="i in 12" :key="i" class="skeleton-card" :style="{ animationDelay: `${i * 0.05}s` }">
        <div class="sk-image"></div>
        <div class="sk-body">
          <div class="sk-line wide"></div>
          <div class="sk-line narrow"></div>
        </div>
      </div>
    </div>
    <div v-else class="skeleton-detail">
      <div class="sk-panel">
        <div class="sk-image tall"></div>
        <div class="sk-line wide" style="margin-top:1rem"></div>
        <div v-for="j in 6" :key="j" class="sk-line" :class="j % 3 === 0 ? 'narrow' : 'wide'" style="margin-top:0.5rem"></div>
      </div>
      <div class="sk-panel large">
        <div class="sk-line wide"></div>
        <div class="sk-matchups">
          <div v-for="k in 9" :key="k" class="sk-matchup-item"></div>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import { toRefs } from 'vue';
export default {
  name: 'DotaLoader',
  props: {
    loaderType: { type: String, default: '' },
    isLoading:  { type: Boolean, default: false },
  },
  setup(props) {
    const { loaderType } = toRefs(props);
    return { loaderType };
  }
}
</script>

<style>
/* shared shimmer */
.sk-image, .sk-line, .sk-matchup-item {
  background: linear-gradient(
    90deg,
    rgba(200, 146, 42, 0.07) 0%,
    rgba(232, 168, 56, 0.18) 50%,
    rgba(200, 146, 42, 0.07) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite linear, pulse 2s infinite ease;
  border-radius: 4px;
}

/* home grid skeletons */
.skeleton-cards {
  display: contents;
}
.skeleton-card {
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  overflow: hidden;
  background: rgba(12, 16, 34, 0.7);
  animation: fadeUp 0.4s ease both;
}
.skeleton-card .sk-image {
  height: 110px;
  border-radius: 0;
  background: rgba(200, 146, 42, 0.05);
  background-image: linear-gradient(
    90deg,
    rgba(200, 146, 42, 0.05) 0%,
    rgba(232, 168, 56, 0.12) 50%,
    rgba(200, 146, 42, 0.05) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite linear;
}
.sk-body {
  padding: 0.5rem 0.6rem 0.65rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  border-top: 1px solid rgba(200, 146, 42, 0.1);
}
.sk-line        { height: 8px; border-radius: 999px; }
.sk-line.wide   { width: 70%; }
.sk-line.narrow { width: 40%; opacity: 0.6; }

/* detail skeletons */
.skeleton-detail {
  display: grid;
  grid-template-columns: minmax(200px, 280px) 1fr;
  gap: 1rem;
  grid-column: 1 / -1;
}
.sk-panel {
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1rem;
  background: rgba(12, 16, 34, 0.7);
}
.sk-panel.large { flex: 1; }
.sk-image.tall  { height: 160px; border-radius: 6px; margin-bottom: 0; }
.sk-matchups {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
}
.sk-matchup-item {
  height: 80px;
  border-radius: 6px;
}

@media (max-width: 900px) {
  .skeleton-detail { grid-template-columns: 1fr; }
}
</style>

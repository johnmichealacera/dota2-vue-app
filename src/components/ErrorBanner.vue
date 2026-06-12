<template>
  <div class="error-banner glass-panel">
    <span class="err-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 9v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      </svg>
    </span>
    <div class="err-body">
      <p class="err-title">{{ title }}</p>
      <p class="err-msg">{{ message }}</p>
    </div>
    <button v-if="onRetry" class="retry-btn" @click="onRetry">
      <svg viewBox="0 0 20 20" fill="none" width="13" height="13">
        <path d="M4 10a6 6 0 106-6H8m0 0L5.5 1.5M8 4L5.5 6.5"
              stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Retry
    </button>
  </div>
</template>

<script>
export default {
  name: 'ErrorBanner',
  props: {
    title:   { type: String, default: 'Something went wrong' },
    message: { type: String, default: 'Could not load data. Check your connection and try again.' },
    onRetry: { type: Function, default: null },
  },
};
</script>

<style scoped>
.error-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 1.25rem;
  border-radius: 0.75rem;
  border-color: rgba(201, 53, 53, 0.3);
  background: linear-gradient(135deg, rgba(201,53,53,0.08), rgba(12,16,34,0.85));
  box-shadow: 0 0 0 1px rgba(201,53,53,0.15), var(--shadow-sm);
  margin-bottom: 1.25rem;
  animation: fadeUp 0.3s ease both;
}

.err-icon {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  color: var(--crimson);
  display: flex;
  align-items: center;
}
.err-icon svg { width: 100%; height: 100%; }

.err-body { flex: 1; min-width: 0; }

.err-title {
  margin: 0 0 0.2rem;
  font-family: "Cinzel", serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: #e87070;
}

.err-msg {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.45;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.9rem;
  border-radius: 5px;
  border: 1px solid rgba(201, 53, 53, 0.35);
  background: rgba(201, 53, 53, 0.12);
  color: #e87070;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 140ms ease, box-shadow 140ms ease;
}
.retry-btn:hover {
  background: rgba(201, 53, 53, 0.22);
  box-shadow: 0 0 10px rgba(201, 53, 53, 0.25);
}
</style>

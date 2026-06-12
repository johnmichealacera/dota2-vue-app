<template>
  <div class="attr-filter">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      class="attr-tab"
      :class="[`tab-${tab.key}`, { 'is-active': modelValue === tab.key }]"
      @click="$emit('update:modelValue', tab.key)"
    >
      <span class="tab-icon" v-html="tab.icon"></span>
      <span class="tab-label">{{ tab.label }}</span>
      <span class="tab-count">{{ counts[tab.key] ?? 0 }}</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'AttributeFilterTabs',
  props: {
    modelValue: { type: String, default: 'all' },
    counts:     { type: Object, default: () => ({}) },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      tabs: [
        {
          key: 'all',
          label: 'All',
          icon: `<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.4"/><path d="M5 8h6M8 5v6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
        },
        {
          key: 'str',
          label: 'Strength',
          icon: `<svg viewBox="0 0 16 16" fill="none"><path d="M8 2l1.5 3.5L13 6l-2.5 2.5.6 3.5L8 10.5 4.9 12l.6-3.5L3 6l3.5-.5L8 2z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>`,
        },
        {
          key: 'agi',
          label: 'Agility',
          icon: `<svg viewBox="0 0 16 16" fill="none"><path d="M3 13L8 3l5 10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 9.5h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
        },
        {
          key: 'int',
          label: 'Intelligence',
          icon: `<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="3.5" stroke="currentColor" stroke-width="1.4"/><path d="M6 11.5h4M8 9.5v2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
        },
        {
          key: 'all_attr',
          label: 'Universal',
          icon: `<svg viewBox="0 0 16 16" fill="none"><path d="M8 2l1.2 3.6H13l-3 2.2 1.1 3.6L8 9.2l-3.1 2.2L6 7.8 3 5.6h3.8L8 2z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>`,
        },
      ],
    };
  },
};
</script>

<style scoped>
.attr-filter {
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
  margin-bottom: 1.1rem;
}

.attr-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.42rem 0.8rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: rgba(12, 16, 34, 0.8);
  color: var(--text-muted);
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 160ms ease;
  white-space: nowrap;
}

.attr-tab:hover {
  color: var(--text-soft);
  border-color: var(--border-strong);
  background: rgba(20, 28, 50, 0.9);
}

.tab-icon {
  width: 14px;
  height: 14px;
  display: flex;
  flex-shrink: 0;
}
.tab-icon svg { width: 14px; height: 14px; }

.tab-count {
  font-size: 0.68rem;
  opacity: 0.65;
  font-weight: 500;
  margin-left: 0.1rem;
}

/* Active states per attribute */
.tab-all.is-active {
  color: var(--accent-bright);
  border-color: var(--border-strong);
  background: rgba(200, 146, 42, 0.12);
  box-shadow: 0 0 12px var(--accent-glow);
}

.tab-str.is-active {
  color: #e87070;
  border-color: rgba(201, 53, 53, 0.45);
  background: rgba(201, 53, 53, 0.12);
  box-shadow: 0 0 12px rgba(201, 53, 53, 0.2);
}

.tab-agi.is-active {
  color: #5ddba0;
  border-color: rgba(56, 197, 122, 0.45);
  background: rgba(56, 197, 122, 0.1);
  box-shadow: 0 0 12px rgba(56, 197, 122, 0.18);
}

.tab-int.is-active {
  color: #7fbeff;
  border-color: rgba(91, 160, 240, 0.45);
  background: rgba(91, 160, 240, 0.1);
  box-shadow: 0 0 12px rgba(91, 160, 240, 0.18);
}

.tab-all_attr.is-active {
  color: #c4a8f5;
  border-color: rgba(155, 114, 219, 0.45);
  background: rgba(155, 114, 219, 0.1);
  box-shadow: 0 0 12px rgba(155, 114, 219, 0.18);
}

@media (max-width: 480px) {
  .attr-tab { font-size: 0.72rem; padding: 0.38rem 0.65rem; }
}
</style>

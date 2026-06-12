<template>
  <div class="search-wrap">
    <span class="search-icon">
      <svg viewBox="0 0 20 20" fill="none">
        <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.6"/>
        <path d="M13.5 13.5L17 17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    </span>
    <input
      class="search-input"
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      autocomplete="off"
      spellcheck="false"
    />
    <button v-if="modelValue" class="clear-btn" @click="$emit('update:modelValue', '')" aria-label="Clear search">
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    modelValue:  { type: String, default: '' },
    placeholder: { type: String, default: 'Search…' },
  },
  emits: ['update:modelValue'],
};
</script>

<style scoped>
.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  pointer-events: none;
  display: flex;
}
.search-icon svg { width: 16px; height: 16px; }

.search-input {
  width: 100%;
  padding: 0.6rem 2.6rem 0.6rem 2.5rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: rgba(12, 16, 34, 0.85);
  color: var(--text);
  font-family: "Barlow", sans-serif;
  font-size: 0.88rem;
  outline: none;
  transition: border-color 160ms ease, box-shadow 160ms ease;
  backdrop-filter: blur(8px);
}

.search-input::placeholder { color: var(--text-muted); }

.search-input:focus {
  border-color: var(--border-strong);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.clear-btn {
  position: absolute;
  right: 0.7rem;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 3px;
  padding: 0;
  transition: color 140ms ease;
}
.clear-btn:hover { color: var(--text); }
.clear-btn svg   { width: 12px; height: 12px; }
</style>

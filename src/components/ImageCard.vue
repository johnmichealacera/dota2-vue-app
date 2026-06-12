<template>
  <router-link :to="`/item/${itemData.id}/${itemType}`" class="card" :class="glowClass">
    <div class="media-wrap">
      <fallback :imageUrl="itemData.img" />
      <div class="hover-overlay">
        <div class="hover-stats">
          <span class="stat-chip str">
            <span class="stat-label">{{ itemType === 'hero' ? 'STR' : 'RTG' }}</span>
            <span class="stat-val">{{ itemData.hoverFirst }}</span>
          </span>
          <span class="stat-chip agi">
            <span class="stat-label">{{ itemType === 'hero' ? 'AGI' : 'WIN' }}</span>
            <span class="stat-val">{{ itemData.hoverSecond }}</span>
          </span>
          <span class="stat-chip int">
            <span class="stat-label">{{ itemType === 'hero' ? 'INT' : 'LSS' }}</span>
            <span class="stat-val">{{ itemData.hoverThird }}</span>
          </span>
        </div>
      </div>
    </div>
    <div class="meta">
      <h3>{{ itemData.name }}</h3>
      <span :class="attackBadgeClass">{{ attackLabel }}</span>
    </div>
  </router-link>
</template>

<script>
import Fallback from './Fallback.vue';
export default {
  name: "ImageCardComponent",
  components: { Fallback },
  props: {
    itemType: String,
    itemData: Object,
  },
  computed: {
    attackLabel() {
      if (this.itemType === 'hero') return this.itemData.attackType || '—';
      const tag = this.itemData.attackType || this.itemData.tag || '—';
      return tag;
    },
    attackBadgeClass() {
      if (this.itemType === 'team') return 'badge badge-team';
      const t = (this.itemData.attackType || '').toLowerCase();
      return t === 'melee' ? 'badge badge-melee' : 'badge badge-ranged';
    },
    glowClass() {
      if (this.itemType === 'team') return 'glow-gold';
      const t = (this.itemData.attackType || '').toLowerCase();
      return t === 'melee' ? 'glow-crimson' : 'glow-teal';
    }
  }
};
</script>

<style scoped>
.card {
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: linear-gradient(170deg,
    rgba(17, 24, 40, 0.9),
    rgba(10, 14, 26, 0.8));
  overflow: hidden;
  transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
  animation: cardIn 0.4s ease both;
  display: block;
  text-decoration: none;
}

.card:hover {
  transform: translateY(-5px) scale(1.015);
}

.glow-crimson:hover {
  border-color: rgba(201, 53, 53, 0.5);
  box-shadow: 0 16px 48px rgba(201, 53, 53, 0.2), 0 0 0 1px rgba(201, 53, 53, 0.12);
}
.glow-teal:hover {
  border-color: rgba(14, 184, 154, 0.5);
  box-shadow: 0 16px 48px rgba(14, 184, 154, 0.18), 0 0 0 1px rgba(14, 184, 154, 0.1);
}
.glow-gold:hover {
  border-color: rgba(232, 168, 56, 0.5);
  box-shadow: 0 16px 48px rgba(232, 168, 56, 0.18), 0 0 0 1px rgba(232, 168, 56, 0.1);
}

.media-wrap {
  position: relative;
  height: 110px;
  display: grid;
  place-items: center;
  padding: 0.6rem 0.5rem 0.35rem;
  background: rgba(6, 8, 15, 0.4);
}

.hover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  background: rgba(6, 8, 15, 0.88);
  transition: opacity 200ms ease;
  backdrop-filter: blur(4px);
}

.card:hover .hover-overlay {
  opacity: 1;
}

.hover-stats {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  width: 80%;
}

.stat-chip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.22rem 0.5rem;
  border-radius: 3px;
  font-size: 0.65rem;
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 600;
  letter-spacing: 0.06em;
}
.stat-chip.str {
  background: rgba(201, 53, 53, 0.2);
  border-left: 2px solid #c93535;
  color: #e87070;
}
.stat-chip.agi {
  background: rgba(56, 197, 122, 0.2);
  border-left: 2px solid #38c57a;
  color: #5ddba0;
}
.stat-chip.int {
  background: rgba(91, 160, 240, 0.2);
  border-left: 2px solid #5ba0f0;
  color: #7fbeff;
}

.stat-label { opacity: 0.75; }
.stat-val   { font-weight: 700; }

.meta {
  border-top: 1px solid rgba(200, 146, 42, 0.1);
  padding: 0.5rem 0.6rem 0.65rem;
  text-align: center;
}

h3 {
  margin: 0 0 0.35rem;
  font-family: "Cinzel", serif;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text);
}

@media (min-width: 640px) {
  h3 { font-size: 0.8rem; }
}
</style>

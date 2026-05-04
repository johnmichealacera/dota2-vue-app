<template>
  <router-link :to="`/item/${itemData.id}/${itemType}`" class="card group">
    <div class="media-wrap">
      <fallback :imageUrl="itemData.img" />
      <div class="hover-info">
        <span>{{ itemType === 'hero' ? `Strength: ${itemData.hoverFirst}` : `Rating: ${itemData.hoverFirst}` }}</span>
        <span>{{ itemType === 'hero' ? `Agility: ${itemData.hoverSecond}` : `Wins: ${itemData.hoverSecond}` }}</span>
        <span>{{ itemType === 'hero' ? `Intelligence: ${itemData.hoverThird}` : `Losses: ${itemData.hoverThird}` }}</span>
      </div>
    </div>
    <div class="meta">
      <h3>{{ itemData.name }}</h3>
      <p>{{ itemType === 'hero' ? itemData.attackType : `Tag: ${itemData.attackType || itemData.tag || '-'}` }}</p>
    </div>
  </router-link>
</template>

<script>
import Fallback from './Fallback.vue';
export default {
  name: "ImageCardComponent",
  components: {
    Fallback,
  },
  props: {
    itemType: String,
    itemData: Object,
  }
};
</script>

<style scoped>
.card {
  border: 1px solid var(--border);
  border-radius: 0.95rem;
  background: linear-gradient(160deg, rgba(16, 22, 41, 0.85), rgba(16, 22, 41, 0.45));
  overflow: hidden;
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.card:hover {
  transform: translateY(-3px);
  border-color: rgba(143, 188, 255, 0.45);
  box-shadow: 0 20px 40px rgba(3, 9, 20, 0.45);
}

.media-wrap {
  position: relative;
  min-height: 80px;
  display: grid;
  place-items: center;
  padding: 0.7rem 0.5rem 0.4rem;
}

.hover-info {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.45rem;
  text-align: center;
  font-size: 0.65rem;
  font-weight: 700;
  color: #edf4ff;
  opacity: 0;
  background: rgba(7, 12, 24, 0.82);
  transition: opacity 180ms ease;
}

.group:hover .hover-info {
  opacity: 1;
}

.meta {
  border-top: 1px solid rgba(143, 188, 255, 0.14);
  padding: 0.55rem 0.55rem 0.7rem;
  text-align: center;
}

h3 {
  margin: 0;
  font-size: 0.76rem;
  font-weight: 700;
}

p {
  margin: 0.35rem 0 0;
  color: var(--text-muted);
  font-size: 0.68rem;
}

@media (min-width: 640px) {
  h3 {
    font-size: 0.88rem;
  }

  p {
    font-size: 0.76rem;
  }
}
</style>

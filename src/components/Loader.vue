<template>
  <div class="skeleton-loader w-14 sm:w-52" :class="loaderStyle" v-if="isLoading">
    <div class="skeleton-text"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-text"></div>
  </div>
</template>
<script>
import { toRefs } from 'vue';
export default {
  name: 'DotaLoader',
  props: { 
    loaderType: {
      type: String, 
      default: '',
    },
    isLoading: { 
      type: Boolean, 
      default: false 
    },
    height: { 
      type: Number, 
      default: 200 
    },
  },
  setup(props) {
    const { loaderType } = toRefs(props);
    const loaderStyle = loaderType.value === 'home' ? 'home-loader' : 'matchup-loader';

    return {
      loaderStyle,
    };
  }
}
</script>
<style>
.skeleton-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: 0.95rem;
  background: rgba(13, 19, 34, 0.85);
  animation: pulse 1.2s ease-in-out infinite;
  min-height: 160px;
}
.skeleton-text {
  width: 80%;
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(123, 161, 231, 0.2), rgba(196, 218, 255, 0.45), rgba(123, 161, 231, 0.2));
  margin: 8px 0;
}
.home-loader {
  width: 100%;
  grid-column: 1 / -1;
}
@keyframes pulse {
  0% {
    opacity: 0.55;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.55;
  }
}
</style>
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
  animation: pulse 1s ease-in-out infinite;
}
.skeleton-text {
  width: 80%;
  height: 20px;
  background-color: #e1e1e1;
  margin: 10px 0;
}
.home-loader {
  width: 100vw !important;
  box-sizing: border-box;
}
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
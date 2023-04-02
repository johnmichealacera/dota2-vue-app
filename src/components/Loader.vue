<template>
  <div class="skeleton-loader" v-if="isLoading">
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
    isLoading: { 
      type: Boolean, 
      default: false 
    },
    height: { 
      type: Number, 
      default: 200 
    },
    // styles: {
    //   type: Array,
    //   default: [],
    // }
  },
  setup(props) {
    const { styles } = toRefs(props);

    return {
      styles,
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
  width: 200px;
}
.skeleton-text {
  width: 80%;
  height: 20px;
  background-color: #e1e1e1;
  margin: 10px 0;
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
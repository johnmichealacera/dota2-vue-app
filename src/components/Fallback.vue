<template>
  <img
    :src="imageUrl || '/team-logo.png'"
    alt=""
    width="120"
    height="80"
    loading="lazy"
    decoding="async"
    class="w-full group-hover:opacity-30 img-card"
    @error="onError"
  />
</template>

<script>
export default {
  name: 'FallbackComponent',
  props: {
    imageUrl: String,
  },
  methods: {
    onError(e) {
      const el = e.target;
      if (el.src.endsWith('/team-logo.png')) return;
      el.src = '/team-logo.png';
    },
  },
};
</script>

<style>
.img-card {
  width: 100%;
  max-width: 120px;
  height: 80px;
  object-fit: contain;
}
</style>

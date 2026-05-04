<template>
  <template v-if="imageUrl">
    <object
      class="w-full group-hover:opacity-30 img-card"
      type="image/png"
      :data="imageUrl"
      width="120"
      height="80"
      aria-label="This image should exist, but alas it does not"
    >
      <img src="/team-logo.png" alt="Fallback image" width="120" height="80" class="w-full group-hover:opacity-30 img-card"/>
    </object>
  </template>
  <template v-else>
    <img src="/team-logo.png" alt="Fallback image" width="120" height="80" class="w-full group-hover:opacity-30 img-card"/>
  </template>
</template>
<script>
export default {
  name: "FallbackComponent",
  props: {
    imageUrl: String,
  }
}
</script>

<style>
.img-card {
  width: 100%;
  max-width: 120px;
  height: 80px;
  object-fit: contain;
}
</style>
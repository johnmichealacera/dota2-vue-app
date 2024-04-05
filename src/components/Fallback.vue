<template>
  <template v-if="imageUrl">
    <object
      class="w-full group-hover:opacity-30 sm:img-card-mobile img-card-desktop"
      type="image/png"
      :data="imageUrl"
      width="150"
      height="150"
      aria-label="This image should exist, but alas it does not"
    >
      <img src="/team-logo.png" alt="Fallback image" width="150" height="300" class="w-full group-hover:opacity-30 sm:img-card-mobile img-card-desktop"/>
    </object>
  </template>
  <template v-else>
    <img src="/team-logo.png" alt="Fallback image" width="150" height="500" class="w-full group-hover:opacity-30 sm:img-card-mobile img-card-desktop"/>
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
.img-card-desktop {
  width: 90px;
  height: 60px;
}

.img-card-mobile {
  width: 90px;
  height: 60px;
}
</style>
<template>
  <footer>
    <nav>
      <h1>Data provided by <a href="https://docs.opendota.com/" class="hover:underline" target="newTab">Open Dota</a></h1>
    </nav>
  </footer>
</template>
<script>
export default {
  name: 'FooterNav',
}
</script>

<style>
footer {
  padding: 1rem;
}

nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

router-link {
  color: #333;
  text-decoration: none;
}
</style>

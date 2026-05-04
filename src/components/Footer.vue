<template>
  <footer class="section-shell">
    <div class="footer-content">
      <p>Built for portfolio exploration of Dota 2 heroes and teams.</p>
      <p>
        Data by
        <a href="https://docs.opendota.com/" target="newTab">OpenDota</a>
      </p>
    </div>
  </footer>
</template>
<script>
export default {
  name: 'FooterNav',
}
</script>

<style>
footer {
  padding: 1.5rem 0 2rem;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem 1.25rem;
  border-top: 1px solid var(--border);
  padding-top: 1.1rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}

a {
  color: var(--accent-strong);
  transition: opacity 180ms ease;
}

a:hover {
  opacity: 0.8;
}
</style>

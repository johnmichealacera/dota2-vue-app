<template>
  <footer class="section-shell footer-wrap">
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="brand-icon-sm">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v10l9 5 9-5V7z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M12 2v20M3 7l9 5 9-5" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </span>
        <span class="footer-logo">Dota<span class="footer-accent">Mate</span></span>
      </div>
      <p class="footer-copy">Portfolio exploration of Dota 2 heroes &amp; teams.</p>
      <p class="footer-data">
        Data via <a href="https://docs.opendota.com/" target="_blank" rel="noopener">OpenDota API</a>
      </p>
    </div>
  </footer>
</template>

<script>
export default { name: 'FooterNav' }
</script>

<style>
.footer-wrap {
  padding: 2.5rem 0 2rem;
}

.footer-inner {
  border-top: 1px solid rgba(200, 146, 42, 0.14);
  padding-top: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem 2rem;
  flex-wrap: wrap;
}

.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: auto;
}

.brand-icon-sm {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 4px;
  display: grid;
  place-items: center;
  background: linear-gradient(140deg, #b87e1e, #e8a838);
  color: #08090e;
  flex-shrink: 0;
}

.brand-icon-sm svg {
  width: 0.8rem;
  height: 0.8rem;
}

.footer-logo {
  font-family: "Cinzel", serif;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  color: var(--text-soft);
}

.footer-accent { color: var(--accent-bright); }

.footer-copy,
.footer-data {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.footer-data a {
  color: var(--accent-bright);
  transition: opacity 160ms ease;
}

.footer-data a:hover { opacity: 0.75; }
</style>

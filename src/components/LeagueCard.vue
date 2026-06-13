<template>
  <router-link :to="`/league/${league.leagueId}`" class="league-card glass-panel" :class="tierClass">
    <div class="league-top">
      <span class="tier-badge" :class="tierClass">{{ tierLabel }}</span>
    </div>
    <h3 class="league-name">{{ league.name }}</h3>
    <p class="league-id">League #{{ league.leagueId }}</p>
  </router-link>
</template>

<script>
export default {
  name: 'LeagueCard',
  props: {
    league: { type: Object, required: true },
  },
  computed: {
    tierClass() {
      const tier = (this.league.tier || '').toLowerCase();
      if (tier === 'premium') return 'tier-premium';
      if (tier === 'professional') return 'tier-pro';
      return 'tier-amateur';
    },
    tierLabel() {
      const tier = (this.league.tier || '').toLowerCase();
      if (tier === 'premium') return 'Premium';
      if (tier === 'professional') return 'Professional';
      return 'Amateur';
    },
  },
};
</script>

<style scoped>
.league-card {
  display: block;
  text-decoration: none;
  border-radius: 0.75rem;
  padding: 1rem 1.1rem;
  border: 1px solid var(--border);
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
  animation: cardIn 0.4s ease both;
  min-height: 7.5rem;
}

.league-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-strong);
}

.tier-premium:hover { box-shadow: 0 0 20px rgba(232, 168, 56, 0.15); }
.tier-pro:hover     { box-shadow: 0 0 20px rgba(56, 189, 248, 0.15); }
.tier-amateur:hover { box-shadow: 0 0 16px rgba(148, 163, 184, 0.12); }

.league-top {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 0.65rem;
}

.tier-badge {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.2rem 0.55rem;
  border-radius: 3px;
  border: 1px solid transparent;
}

.tier-premium .tier-badge {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
  border-color: rgba(251, 191, 36, 0.3);
}

.tier-pro .tier-badge {
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.1);
  border-color: rgba(56, 189, 248, 0.3);
}

.tier-amateur .tier-badge {
  color: var(--text-muted);
  background: rgba(148, 163, 184, 0.08);
  border-color: rgba(148, 163, 184, 0.25);
}

.league-name {
  font-family: "Cinzel", serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-soft);
  line-height: 1.35;
  margin: 0 0 0.4rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.league-id {
  margin: 0;
  font-size: 0.72rem;
  color: var(--text-muted);
  font-family: "Barlow", sans-serif;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>

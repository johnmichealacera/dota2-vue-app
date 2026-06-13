<template>
  <component
    :is="player.accountId ? 'router-link' : 'div'"
    :to="player.accountId ? `/player/${player.accountId}` : undefined"
    class="player-card"
    :class="glowClass"
  >
    <div class="media-wrap">
      <img
        v-if="player.avatar"
        :src="player.avatar"
        :alt="player.name"
        class="avatar"
        loading="lazy"
      />
      <div v-else class="avatar-placeholder">
        <svg viewBox="0 0 24 24" fill="none" class="avatar-icon">
          <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>

      <div class="hover-overlay">
        <div class="hover-stats">
          <span class="stat-chip role" :class="roleChipClass">
            <span class="stat-label">ROLE</span>
            <span class="stat-val">{{ roleLabel }}</span>
          </span>
          <span class="stat-chip team">
            <span class="stat-label">TEAM</span>
            <span class="stat-val team-val">{{ player.teamName || '—' }}</span>
          </span>
          <span class="stat-chip country">
            <span class="stat-label">FROM</span>
            <span class="stat-val">{{ countryDisplay }}</span>
          </span>
        </div>
      </div>
    </div>

    <div class="player-meta">
      <h3 class="player-name">{{ player.name || '—' }}</h3>
      <span :class="roleBadgeClass">{{ roleLabel }}</span>
    </div>
  </component>
</template>

<script>
export default {
  name: 'PlayerCard',
  props: {
    player: { type: Object, required: true },
  },
  computed: {
    roleLabel() {
      const r = this.player.fantasyRole;
      if (r === 0) return 'Core';
      if (r === 1) return 'Support';
      return 'Pro';
    },
    roleBadgeClass() {
      const r = this.player.fantasyRole;
      if (r === 0) return 'badge badge-melee';
      if (r === 1) return 'badge badge-ranged';
      return 'badge badge-team';
    },
    roleChipClass() {
      const r = this.player.fantasyRole;
      if (r === 0) return 'core';
      if (r === 1) return 'supp';
      return 'neutral';
    },
    glowClass() {
      const r = this.player.fantasyRole;
      if (r === 0) return 'glow-crimson';
      if (r === 1) return 'glow-teal';
      return 'glow-gold';
    },
    countryDisplay() {
      const code = this.player.countryCode;
      if (!code || code.length !== 2) return '—';
      const flag = String.fromCodePoint(
        ...[...code.toUpperCase()].map(c => c.charCodeAt(0) + 127397)
      );
      return `${flag} ${code.toUpperCase()}`;
    },
  },
};
</script>

<style scoped>
.player-card {
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: linear-gradient(170deg, rgba(17, 24, 40, 0.9), rgba(10, 14, 26, 0.8));
  overflow: hidden;
  transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
  animation: cardIn 0.4s ease both;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
}

.player-card:hover { transform: translateY(-5px) scale(1.015); }

.glow-crimson:hover {
  border-color: rgba(201, 53, 53, 0.5);
  box-shadow: 0 16px 48px rgba(201, 53, 53, 0.2), 0 0 0 1px rgba(201, 53, 53, 0.12);
}
.glow-teal:hover {
  border-color: rgba(14, 184, 154, 0.5);
  box-shadow: 0 16px 48px rgba(14, 184, 154, 0.18), 0 0 0 1px rgba(14, 184, 154, 0.1);
}
.glow-gold:hover {
  border-color: rgba(232, 168, 56, 0.5);
  box-shadow: 0 16px 48px rgba(232, 168, 56, 0.18), 0 0 0 1px rgba(232, 168, 56, 0.1);
}

/* ── Media area ─────────────────────────── */
.media-wrap {
  position: relative;
  height: 110px;
  background: rgba(6, 8, 15, 0.5);
  overflow: hidden;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transition: opacity 200ms ease;
}

.player-card:hover .avatar { opacity: 0.25; }

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}
.avatar-icon { width: 2.5rem; height: 2.5rem; }

/* ── Hover overlay ──────────────────────── */
.hover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  background: rgba(6, 8, 15, 0.72);
  transition: opacity 200ms ease;
  backdrop-filter: blur(2px);
}

.player-card:hover .hover-overlay { opacity: 1; }

.hover-stats {
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  width: 84%;
}

.stat-chip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.22rem 0.5rem;
  border-radius: 3px;
  font-size: 0.62rem;
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 600;
  letter-spacing: 0.06em;
}

/* role chip colours */
.stat-chip.role.core {
  background: rgba(201, 53, 53, 0.22);
  border-left: 2px solid #c93535;
  color: #e87070;
}
.stat-chip.role.supp {
  background: rgba(14, 184, 154, 0.22);
  border-left: 2px solid #0eb89a;
  color: #3dd4b8;
}
.stat-chip.role.neutral {
  background: rgba(232, 168, 56, 0.18);
  border-left: 2px solid #e8a838;
  color: var(--accent-bright);
}

/* team chip */
.stat-chip.team {
  background: rgba(155, 114, 219, 0.18);
  border-left: 2px solid #9b72db;
  color: #c4a8f5;
}

/* country chip */
.stat-chip.country {
  background: rgba(91, 160, 240, 0.18);
  border-left: 2px solid #5ba0f0;
  color: #7fbeff;
}

.stat-label { opacity: 0.7; }
.stat-val   { font-weight: 700; }
.team-val {
  max-width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Name / badge row ───────────────────── */
.player-meta {
  border-top: 1px solid rgba(200, 146, 42, 0.1);
  padding: 0.5rem 0.6rem 0.65rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.32rem;
}

.player-name {
  margin: 0;
  font-family: "Cinzel", serif;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  color: var(--text);
}

@media (min-width: 640px) {
  .player-name { font-size: 0.8rem; }
}
</style>

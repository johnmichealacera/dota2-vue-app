const RANK_ICON_BASE = 'https://www.opendota.com/assets/images/dota2/rank_icons';

export function resolveRankIcons(rankTier, leaderboardRank) {
  const tier = Number(rankTier);
  if (!tier || tier <= 0) {
    return { medal: '', star: '' };
  }

  if (tier >= 80) {
    const rank = Number(leaderboardRank);
    if (rank > 0) {
      if (rank <= 10) return { medal: `${RANK_ICON_BASE}/rank_icon_8c.png`, star: '' };
      if (rank <= 100) return { medal: `${RANK_ICON_BASE}/rank_icon_8b.png`, star: '' };
    }
    return { medal: `${RANK_ICON_BASE}/rank_icon_8.png`, star: '' };
  }

  const medalDigit = Math.floor(tier / 10);
  let star = tier % 10;
  if (star < 1) star = 1;
  if (star > 7) star = 7;

  return {
    medal: `${RANK_ICON_BASE}/rank_icon_${medalDigit}.png`,
    star: medalDigit === 8 ? '' : `${RANK_ICON_BASE}/rank_star_${star}.png`,
  };
}

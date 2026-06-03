import { NBA_TEAMS } from './nba-teams';

export interface ScheduledGame {
  gameNumber: number; // 1-82
  opponentId: number;
  opponentAbbr: string;
  opponentName: string;
  isHome: boolean;
  week: number;
  result?: 'W' | 'L';
  score?: string; // e.g. "112-108"
}

/**
 * Generates a deterministic 82-game schedule for the given team.
 * 30 opponents, balanced home/away, spread across 26 weeks.
 */
export function generateSchedule(myTeamId: number): ScheduledGame[] {
  const opponents = NBA_TEAMS.filter((t) => t.id !== myTeamId);
  const games: ScheduledGame[] = [];

  // Each opponent: conference rivals 3-4x, others 2x → ~82 total
  // Simple approach: 2 games vs all 29 opponents (58) + 1 extra vs 24 random = 82
  const matchups: { opp: typeof opponents[0]; isHome: boolean }[] = [];

  opponents.forEach((opp, i) => {
    matchups.push({ opp, isHome: true });
    matchups.push({ opp, isHome: false });
    // Extra games (24 of 29 opponents get a 3rd game, alternating home/away)
    if (i < 24) {
      matchups.push({ opp, isHome: i % 2 === 0 });
    }
  });

  // Shuffle deterministically using teamId as seed
  let seed = myTeamId * 1337;
  function seededRand() {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  }
  matchups.sort(() => seededRand() - 0.5);

  const perWeek = Math.ceil(82 / 26);
  for (let i = 0; i < 82; i++) {
    const m = matchups[i];
    games.push({
      gameNumber: i + 1,
      opponentId: m.opp.id,
      opponentAbbr: m.opp.abbreviation,
      opponentName: m.opp.full_name,
      isHome: m.isHome,
      week: Math.floor(i / perWeek) + 1,
    });
  }

  return games;
}

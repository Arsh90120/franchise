// ESPN public API — no key required
const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba';

// Map from our internal BDL-style team IDs to ESPN team IDs
export const ESPN_TEAM_ID_MAP: Record<number, number> = {
  1: 1,   // Atlanta Hawks
  2: 2,   // Boston Celtics
  3: 17,  // Brooklyn Nets
  4: 30,  // Charlotte Hornets
  5: 4,   // Chicago Bulls
  6: 5,   // Cleveland Cavaliers
  7: 6,   // Dallas Mavericks
  8: 7,   // Denver Nuggets
  9: 8,   // Detroit Pistons
  10: 9,  // Golden State Warriors
  11: 10, // Houston Rockets
  12: 11, // Indiana Pacers
  13: 12, // LA Clippers
  14: 13, // Los Angeles Lakers
  15: 14, // Memphis Grizzlies
  16: 15, // Miami Heat
  17: 16, // Milwaukee Bucks
  18: 21, // Minnesota Timberwolves
  19: 3,  // New Orleans Pelicans
  20: 18, // New York Knicks
  21: 25, // Oklahoma City Thunder
  22: 23, // Orlando Magic
  23: 20, // Philadelphia 76ers
  24: 24, // Phoenix Suns
  25: 22, // Portland Trail Blazers
  26: 26, // Sacramento Kings
  27: 27, // San Antonio Spurs
  28: 28, // Toronto Raptors
  29: 29, // Utah Jazz
  30: 19, // Washington Wizards
};

export interface ESPNPlayer {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  jersey: string;
  position: { abbreviation: string };
  statistics?: { displayValue: string; name: string }[];
}

export interface ESPNRosterEntry {
  athlete: ESPNPlayer;
}

export async function getESPNRoster(espnTeamId: number): Promise<ESPNRosterEntry[]> {
  const url = `${ESPN_BASE}/teams/${espnTeamId}?enable=roster`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`ESPN API error: ${res.status}`);
  const data = await res.json();
  // ESPN returns roster under team.athletes or team.roster.athletes depending on endpoint
  const athletes: ESPNRosterEntry[] =
    data?.team?.athletes ??
    data?.team?.roster?.athletes ??
    [];
  return athletes;
}

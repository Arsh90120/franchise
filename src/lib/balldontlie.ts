const BASE_URL = 'https://api.balldontlie.io/v1';
const API_KEY = process.env.BALLDONTLIE_API_KEY!;

async function bdlFetch<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }
  const res = await fetch(url.toString(), {
    headers: { Authorization: API_KEY },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`BallDontLie API error: ${res.status}`);
  return res.json();
}

export interface BDLPlayer {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height: string;
  weight: string;
  jersey_number: string;
  college: string;
  country: string;
  draft_year: number | null;
  draft_round: number | null;
  draft_number: number | null;
  team: BDLTeam;
}

export interface BDLTeam {
  id: number;
  abbreviation: string;
  city: string;
  conference: string;
  division: string;
  full_name: string;
  name: string;
}

export interface BDLSeasonAverage {
  player_id: number;
  season: number;
  games_played: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  turnover: number;
  fg_pct: number;
  fg3_pct: number;
  ft_pct: number;
  min: string;
}

export async function getAllTeams(): Promise<{ data: BDLTeam[] }> {
  return bdlFetch('/teams');
}

export async function getTeamRoster(teamId: number, season: number = 2024): Promise<{ data: BDLPlayer[] }> {
  return bdlFetch('/players', { team_ids: teamId, per_page: 30, season });
}

export async function getPlayerSeasonAverages(playerIds: number[], season: number = 2024): Promise<{ data: BDLSeasonAverage[] }> {
  const ids = playerIds.slice(0, 25);
  const url = new URL(`${BASE_URL}/season_averages`);
  url.searchParams.set('season', String(season));
  ids.forEach((id) => url.searchParams.append('player_ids[]', String(id)));
  const res = await fetch(url.toString(), {
    headers: { Authorization: API_KEY },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`BallDontLie API error: ${res.status}`);
  return res.json();
}

export async function searchPlayers(search: string): Promise<{ data: BDLPlayer[] }> {
  return bdlFetch('/players', { search, per_page: 10 });
}

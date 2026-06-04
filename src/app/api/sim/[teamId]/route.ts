import { ROSTER_DATA } from '@/lib/roster-data';
import { NBA_TEAMS } from '@/lib/nba-teams';
import { simGame } from '@/lib/sim-engine';
import { parseBBGM, BBGM_TID_TO_ABB } from '@/lib/bbgm-parser';
import { NextResponse } from 'next/server';

const BBGM_ERA_FILE: Record<string, string> = {
  'classic-1985':  'NBA.Legacy.1985.v3.0.beta.json',
  'jordan-1996':   '1995-96.NBA.Roster.json',
  'dynasty-2015':  '2015-16.NBA.Roster.json',
  'dynasty-2016':  '2016-17.NBA.Roster.json',
  'dynasty-2018':  '2018-19.NBA.Roster.json',
  'bubble-2020':   '2020-21.NBA.Roster.json',
  'modern-2022':   '2022-23.NBA.Roster.json',
  'modern-2024':   '2024-25.NBA.Roster.json',
  'current-2025':  '2025-26.NBA.Roster 3.json',
};

/** Convert BBGM ratings (0-100) into realistic NBA season-average equivalents */
function ratingsToAvg(p: { id: number; ratings: Record<string, number>[]; pos: string; ovr: number }) {
  const r = p.ratings[0] ?? {};
  // Scale ratings to realistic stat ranges
  const pts  = ((r.ins ?? 50) * 0.10 + (r.fg ?? 50) * 0.08 + (r.tp ?? 50) * 0.06) * 0.55 + 2;
  const reb  = ((r.reb ?? 50) * 0.12 + (r.hgt ?? 50) * 0.05) * 0.35 + 1;
  const ast  = ((r.pss ?? 50) * 0.10 + (r.drb ?? 50) * 0.03) * 0.25 + 0.5;
  const stl  = (r.stl ?? 50) * 0.025;
  const blk  = (r.blk ?? 50) * 0.020;
  const fgPct = 0.38 + (r.fg ?? 50) / 100 * 0.20;
  const ftPct = 0.55 + (r.ft ?? 50) / 100 * 0.30;
  const fg3Pct = 0.25 + (r.tp ?? 50) / 100 * 0.20;
  // minutes based on OVR
  const mins = 12 + (p.ovr / 100) * 24;
  return {
    player_id: p.id,
    season: 2024,
    games_played: 60,
    pts:   Math.min(35, Math.max(2,  pts)),
    reb:   Math.min(15, Math.max(1,  reb)),
    ast:   Math.min(12, Math.max(0.5, ast)),
    stl:   Math.min(3,  Math.max(0.1, stl)),
    blk:   Math.min(3,  Math.max(0.1, blk)),
    turnover: 1.5 + (p.ovr / 100) * 1.5,
    fg_pct:  Math.min(0.65, Math.max(0.30, fgPct)),
    fg3_pct: Math.min(0.45, Math.max(0.20, fg3Pct)),
    ft_pct:  Math.min(0.95, Math.max(0.45, ftPct)),
    min: String(Math.round(mins)),
  };
}

async function getBBGMRoster(era: string, teamAbb: string) {
  const fileName = BBGM_ERA_FILE[era];
  if (!fileName) return null;

  // Fetch from public/data/ using the internal Vercel URL
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/data/${encodeURIComponent(fileName)}`);
  if (!res.ok) throw new Error(`Failed to fetch ${fileName}: ${res.status}`);
  const json = await res.json();
  const roster = parseBBGM(json);

  const tidEntry = Object.entries(BBGM_TID_TO_ABB).find(([, abb]) => abb === teamAbb);
  if (!tidEntry) return [];
  const tid = parseInt(tidEntry[0]);

  return roster.players
    .filter((p) => p.tid === tid)
    .sort((a, b) => b.ovr - a.ovr)
    .slice(0, 10)
    .map((p, i) => ({
      player: {
        id: i + 1,
        first_name: p.name.split(' ')[0],
        last_name:  p.name.split(' ').slice(1).join(' ') || p.name,
        position:   p.pos || 'F',
        height: '',
        weight: '',
        jersey_number: '',
        college: p.college || '',
        country: '',
        draft_year: null,
        draft_round: null,
        draft_number: null,
        team: null,
      },
      avg: ratingsToAvg({ id: i + 1, ratings: p.ratings as Record<string, number>[], pos: p.pos, ovr: p.ovr }),
    }));
}

export async function GET(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const awayId = parseInt(params.teamId);
    const url = new URL(req.url);
    const homeId = parseInt(url.searchParams.get('homeId') || '0');
    const era    = url.searchParams.get('era') || '';

    if (!homeId || !awayId) {
      return NextResponse.json({ error: 'Missing homeId or teamId' }, { status: 400 });
    }

    const homeTeamInfo = NBA_TEAMS.find((t) => t.id === homeId);
    const awayTeamInfo = NBA_TEAMS.find((t) => t.id === awayId);
    if (!homeTeamInfo || !awayTeamInfo) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const isBBGM = !!BBGM_ERA_FILE[era];

    let homePlayers: { id: number; first_name: string; last_name: string; position: string }[];
    let homeAvgs:    ReturnType<typeof ratingsToAvg>[];
    let awayPlayers: typeof homePlayers;
    let awayAvgs:    typeof homeAvgs;

    if (isBBGM) {
      const [homeRoster, awayRoster] = await Promise.all([
        getBBGMRoster(era, homeTeamInfo.abbreviation),
        getBBGMRoster(era, awayTeamInfo.abbreviation),
      ]);
      if (!homeRoster || !awayRoster) {
        return NextResponse.json({ error: 'Could not load BBGM roster' }, { status: 500 });
      }
      homePlayers = homeRoster.map((x) => x.player);
      homeAvgs    = homeRoster.map((x) => x.avg);
      awayPlayers = awayRoster.map((x) => x.player);
      awayAvgs    = awayRoster.map((x) => x.avg);
    } else {
      // Legacy hardcoded roster
      const hd = ROSTER_DATA[homeId] ?? [];
      const ad = ROSTER_DATA[awayId] ?? [];
      const toPlayer = (p: typeof hd[0]) => ({ id: p.id, first_name: p.first_name, last_name: p.last_name, position: p.position, height: '', weight: '', jersey_number: p.jersey_number, college: '', country: '', draft_year: null, draft_round: null, draft_number: null, team: null });
      const toAvg    = (p: typeof hd[0]) => ({ player_id: p.id, season: 2024, games_played: 60, pts: p.pts, reb: p.reb, ast: p.ast, stl: p.stl, blk: p.blk, turnover: 2.0, fg_pct: p.fg_pct, fg3_pct: p.fg3_pct, ft_pct: p.ft_pct, min: p.min });
      homePlayers = hd.map(toPlayer);
      homeAvgs    = hd.map(toAvg);
      awayPlayers = ad.map(toPlayer);
      awayAvgs    = ad.map(toAvg);
    }

    const result = simGame(
      homePlayers, homeAvgs, homeId, homeTeamInfo.full_name, homeTeamInfo.abbreviation,
      awayPlayers, awayAvgs, awayId, awayTeamInfo.full_name, awayTeamInfo.abbreviation,
    );

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Sim failed' }, { status: 500 });
  }
}

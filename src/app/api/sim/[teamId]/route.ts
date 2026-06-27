import { ROSTER_DATA } from '@/lib/roster-data';
import { NBA_TEAMS } from '@/lib/nba-teams';
import { simGame } from '@/lib/sim-engine';
import { parseBBGM, BBGM_TID_TO_ABB, BBGMRatings } from '@/lib/bbgm-parser';
import { NextResponse } from 'next/server';
import type { Player, TeamRotation } from '@/lib/game-state';

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

function buildRotation(players: Player[]): TeamRotation {
  const sorted = [...players].sort((a, b) => b.ovr - a.ovr);
  return {
    starters: sorted.slice(0, 5).map((p) => p.id),
    bench: sorted.slice(5, 12).map((p) => p.id),
    minutes: sorted.reduce((acc, p, idx) => {
      acc[p.id] = idx < 5 ? 32 : idx < 10 ? 15 : 0;
      return acc;
    }, {} as Record<number, number>),
  };
}

async function getBBGMPlayers(era: string, teamAbb: string, teamTid: number): Promise<Player[]> {
  const fileName = BBGM_ERA_FILE[era];
  if (!fileName) return [];

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
    .slice(0, 15)
    .map((p, i): Player => ({
      id: teamTid * 100 + i,
      name: p.name,
      pos: p.pos || 'F',
      tid: teamTid,
      ovr: p.ovr,
      pot: p.ovr,
      hgt: 76,
      weight: 220,
      ratings: p.ratings[0] ?? ({} as BBGMRatings),
      stats: {
        gamesPlayed: 0, points: 0, rebounds: 0, assists: 0,
        steals: 0, blocks: 0, turnovers: 0, minutes: 0,
        fga: 0, fgm: 0, fta: 0, ftm: 0, threePa: 0, threePm: 0,
      },
      contract: { amount: 5000000, exp: 2026 },
      stamina: 100,
      injury: { gamesRemaining: 0, type: null },
    }));
}

function rosterDataToPlayers(teamId: number): Player[] {
  const roster = ROSTER_DATA[teamId] ?? [];
  return roster.map((p, i): Player => ({
    id: p.id,
    name: `${p.first_name} ${p.last_name}`,
    pos: p.position,
    tid: teamId,
    ovr: Math.round((p.pts * 1.5 + p.reb * 1.2 + p.ast * 1.0) * 2),
    pot: 70,
    hgt: 76,
    weight: 220,
    ratings: {
      fg: Math.round(p.fg_pct * 100),
      tp: Math.round(p.fg3_pct * 100),
      ft: Math.round(p.ft_pct * 100),
      reb: Math.round(p.reb * 6),
      pss: Math.round(p.ast * 8),
      stl: Math.round(p.stl * 20),
      blk: Math.round(p.blk * 20),
      ins: 50,
      drb: 50,
      hgt: 50,
    } as BBGMRatings,
    stats: {
      gamesPlayed: 0, points: 0, rebounds: 0, assists: 0,
      steals: 0, blocks: 0, turnovers: 0, minutes: 0,
      fga: 0, fgm: 0, fta: 0, ftm: 0, threePa: 0, threePm: 0,
    },
    contract: { amount: 5000000, exp: 2026 },
    stamina: 100,
    injury: { gamesRemaining: 0, type: null },
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

    let homePlayers: Player[];
    let awayPlayers: Player[];

    if (BBGM_ERA_FILE[era]) {
      [homePlayers, awayPlayers] = await Promise.all([
        getBBGMPlayers(era, homeTeamInfo.abbreviation, homeId),
        getBBGMPlayers(era, awayTeamInfo.abbreviation, awayId),
      ]);
      if (!homePlayers.length || !awayPlayers.length) {
        return NextResponse.json({ error: 'Could not load BBGM roster' }, { status: 500 });
      }
    } else {
      homePlayers = rosterDataToPlayers(homeId);
      awayPlayers = rosterDataToPlayers(awayId);
    }

    const homeRotation = buildRotation(homePlayers);
    const awayRotation = buildRotation(awayPlayers);

    const result = simGame(homePlayers, homeRotation, awayPlayers, awayRotation);

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Sim failed' }, { status: 500 });
  }
}

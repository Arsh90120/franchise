import { ROSTER_DATA } from '@/lib/roster-data';
import { NBA_TEAMS } from '@/lib/nba-teams';
import { simGame } from '@/lib/sim-engine';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const awayId = parseInt(params.teamId);
    const url = new URL(req.url);
    const homeId = parseInt(url.searchParams.get('homeId') || '0');

    if (!homeId || !awayId) {
      return NextResponse.json({ error: 'Missing homeId or teamId' }, { status: 400 });
    }

    const homeTeamInfo = NBA_TEAMS.find((t) => t.id === homeId);
    const awayTeamInfo = NBA_TEAMS.find((t) => t.id === awayId);

    if (!homeTeamInfo || !awayTeamInfo) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const homePlayers = ROSTER_DATA[homeId] ?? [];
    const awayPlayers = ROSTER_DATA[awayId] ?? [];

    // Convert PlayerData to the shape sim-engine expects
    const toPlayer = (p: typeof homePlayers[0]) => ({
      id: p.id,
      first_name: p.first_name,
      last_name: p.last_name,
      position: p.position,
      height: '',
      weight: '',
      jersey_number: p.jersey_number,
      college: '',
      country: '',
      draft_year: null,
      draft_round: null,
      draft_number: null,
      team: homeTeamInfo,
    });

    const toAvg = (p: typeof homePlayers[0]) => ({
      player_id: p.id,
      season: 2024,
      games_played: 60,
      pts: p.pts,
      reb: p.reb,
      ast: p.ast,
      stl: p.stl,
      blk: p.blk,
      turnover: 2.0,
      fg_pct: p.fg_pct,
      fg3_pct: p.fg3_pct,
      ft_pct: p.ft_pct,
      min: p.min,
    });

    const result = simGame(
      homePlayers.map(toPlayer),
      homePlayers.map(toAvg),
      homeId,
      homeTeamInfo.full_name,
      homeTeamInfo.abbreviation,
      awayPlayers.map(toPlayer),
      awayPlayers.map(toAvg),
      awayId,
      awayTeamInfo.full_name,
      awayTeamInfo.abbreviation
    );

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Sim failed' }, { status: 500 });
  }
}

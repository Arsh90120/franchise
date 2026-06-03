import { NextResponse } from 'next/server';
import { ROSTER_DATA } from '@/lib/roster-data';
import { NBA_TEAMS } from '@/lib/nba-teams';

export async function GET(
  _req: Request,
  { params }: { params: { teamId: string } }
) {
  const teamId = parseInt(params.teamId);
  const players = ROSTER_DATA[teamId] ?? [];
  const team = NBA_TEAMS.find((t) => t.id === teamId);

  return NextResponse.json({
    players,
    averages: players.map((p) => ({
      player_id: p.id,
      pts: p.pts,
      reb: p.reb,
      ast: p.ast,
      fg_pct: p.fg_pct,
      min: p.min,
    })),
    team,
  });
}

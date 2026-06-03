import { getTeamRoster, getPlayerSeasonAverages } from '@/lib/balldontlie';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const teamId = parseInt(params.teamId);
    const rosterData = await getTeamRoster(teamId, 2024);
    const players = rosterData.data;

    if (!players.length) {
      return NextResponse.json({ players: [], averages: [] });
    }

    const playerIds = players.map((p) => p.id);
    const avgData = await getPlayerSeasonAverages(playerIds, 2024);

    return NextResponse.json({ players, averages: avgData.data });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch roster' }, { status: 500 });
  }
}

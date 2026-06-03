import { getTeamRoster, getPlayerSeasonAverages } from '@/lib/balldontlie';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const season = parseInt(searchParams.get('season') || '2024');
    const teamId = parseInt(params.teamId);

    const rosterData = await getTeamRoster(teamId, season);
    const players = rosterData.data;

    if (!players.length) {
      return NextResponse.json({ players: [], averages: [] });
    }

    const playerIds = players.map((p: { id: number }) => p.id);
    const avgData = await getPlayerSeasonAverages(playerIds, season);

    return NextResponse.json({ players, averages: avgData.data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch roster' }, { status: 500 });
  }
}

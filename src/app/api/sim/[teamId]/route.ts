import { getTeamRoster, getPlayerSeasonAverages, getAllTeams } from '@/lib/balldontlie';
import { simGame } from '@/lib/sim-engine';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const opponentId = parseInt(params.teamId);

    const url = new URL(_req.url);
    const homeId = parseInt(url.searchParams.get('homeId') || '0');

    if (!homeId || !opponentId) {
      return NextResponse.json({ error: 'Missing homeId or teamId' }, { status: 400 });
    }

    const teamsData = await getAllTeams();
    const homeTeam = teamsData.data.find((t) => t.id === homeId);
    const awayTeam = teamsData.data.find((t) => t.id === opponentId);

    if (!homeTeam || !awayTeam) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const [homeRoster, awayRoster] = await Promise.all([
      getTeamRoster(homeId, 2024),
      getTeamRoster(opponentId, 2024),
    ]);

    const homePlayerIds = homeRoster.data.map((p) => p.id);
    const awayPlayerIds = awayRoster.data.map((p) => p.id);

    const [homeAvgs, awayAvgs] = await Promise.all([
      getPlayerSeasonAverages(homePlayerIds, 2024),
      getPlayerSeasonAverages(awayPlayerIds, 2024),
    ]);

    const result = simGame(
      homeRoster.data,
      homeAvgs.data,
      homeId,
      homeTeam.full_name,
      homeTeam.abbreviation,
      awayRoster.data,
      awayAvgs.data,
      opponentId,
      awayTeam.full_name,
      awayTeam.abbreviation
    );

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Sim failed' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { ROSTER_DATA } from '@/lib/roster-data';
import { ESPN_TEAM_ID_MAP, getESPNRoster } from '@/lib/espn-api';

export async function GET(
  _req: Request,
  { params }: { params: { teamId: string } }
) {
  const teamId = parseInt(params.teamId);
  const espnId = ESPN_TEAM_ID_MAP[teamId];

  // Try ESPN first, fall back to hardcoded data
  if (espnId) {
    try {
      const rosterEntries = await getESPNRoster(espnId);

      if (rosterEntries.length > 0) {
        const players = rosterEntries.map((entry, i) => {
          const a = entry.athlete;
          // ESPN doesn't give season avgs on this endpoint — merge with hardcoded stats by name match
          const hardcoded = ROSTER_DATA[teamId] ?? [];
          const match = hardcoded.find(
            (p) =>
              p.last_name.toLowerCase() === a.lastName?.toLowerCase() ||
              a.displayName?.toLowerCase().includes(p.last_name.toLowerCase())
          );
          return {
            id: parseInt(a.id) || i + teamId * 1000,
            first_name: a.firstName ?? a.displayName?.split(' ')[0] ?? '',
            last_name: a.lastName ?? a.displayName?.split(' ').slice(1).join(' ') ?? '',
            position: a.position?.abbreviation ?? 'F',
            jersey_number: a.jersey ?? '—',
            pts: match?.pts ?? 0,
            reb: match?.reb ?? 0,
            ast: match?.ast ?? 0,
            fg_pct: match?.fg_pct ?? 0,
            min: match?.min ?? '—',
          };
        });

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
          source: 'espn',
        });
      }
    } catch (e) {
      console.warn('ESPN roster fetch failed, falling back to hardcoded:', e);
    }
  }

  // Fallback: hardcoded roster data
  const players = ROSTER_DATA[teamId] ?? [];
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
    source: 'hardcoded',
  });
}

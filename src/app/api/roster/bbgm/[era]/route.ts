import { NextResponse } from 'next/server';
import { parseBBGM, BBGM_TID_TO_ABB, BBGMPlayer } from '@/lib/bbgm-parser';
import { NBA_TEAMS } from '@/lib/nba-teams';
import path from 'path';
import fs from 'fs';

// Map era slug → JSON filename (all in src/)
const ERA_FILE: Record<string, string> = {
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

export async function GET(
  req: Request,
  { params }: { params: { era: string } }
) {
  const era = params.era;
  const { searchParams } = new URL(req.url);
  const teamAbb = searchParams.get('team'); // e.g. 'LAL'

  const fileName = ERA_FILE[era];
  if (!fileName) {
    return NextResponse.json({ error: 'Unknown era' }, { status: 404 });
  }

  try {
    const filePath = path.join(process.cwd(), 'src', fileName);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(raw);
    const roster = parseBBGM(json);

    let players: BBGMPlayer[] = roster.players;

    // Filter by team abbreviation if provided
    if (teamAbb) {
      const tidEntry = Object.entries(BBGM_TID_TO_ABB).find(([, abb]) => abb === teamAbb.toUpperCase());
      if (tidEntry) {
        const tid = parseInt(tidEntry[0]);
        players = players.filter((p) => p.tid === tid);
      }
    }

    // Sort by OVR descending
    players.sort((a, b) => b.ovr - a.ovr);

    // Enrich with full team name
    const enriched = players.map((p) => {
      const abb = BBGM_TID_TO_ABB[p.tid];
      const team = NBA_TEAMS.find((t) => t.abbreviation === abb);
      return {
        ...p,
        teamAbb: abb ?? '???',
        teamName: team?.full_name ?? abb ?? '???',
      };
    });

    return NextResponse.json({
      era,
      season: roster.startingSeason,
      players: enriched,
    });
  } catch (err) {
    console.error('BBGM parse error:', err);
    return NextResponse.json({ error: 'Failed to load roster' }, { status: 500 });
  }
}

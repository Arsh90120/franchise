import { getAllTeams } from '@/lib/balldontlie';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await getAllTeams();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}

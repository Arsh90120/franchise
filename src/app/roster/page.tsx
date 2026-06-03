'use client';

import { useEffect, useState } from 'react';
import { useGameState } from '@/lib/game-state';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { ERAS } from '@/lib/nba-teams';

interface Player {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  jersey_number: string;
  height: string;
  weight: string;
}

interface SeasonAvg {
  player_id: number;
  pts: number;
  reb: number;
  ast: number;
  fg_pct: number;
  min: string;
}

const POSITION_ORDER = ['G', 'G-F', 'F', 'F-C', 'C'];

function positionColor(pos: string): 'orange' | 'gold' | 'green' | 'muted' {
  if (pos.startsWith('G')) return 'orange';
  if (pos.startsWith('F')) return 'gold';
  if (pos.startsWith('C')) return 'green';
  return 'muted';
}

export default function RosterPage() {
  const router = useRouter();
  const { selectedTeam, isSetupComplete, selectedSeason, selectedEra } = useGameState();
  const [players, setPlayers] = useState<Player[]>([]);
  const [averages, setAverages] = useState<SeasonAvg[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const eraLabel = ERAS.find((e) => e.id === selectedEra)?.label ?? 'Modern';

  useEffect(() => {
    if (!isSetupComplete) { router.push('/setup'); return; }
    if (!selectedTeam) return;
    setLoading(true);
    setError(false);
    fetch(`/api/roster/${selectedTeam.id}?season=${selectedSeason}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(true); setLoading(false); return; }
        const sorted = (d.players as Player[]).sort((a, b) => {
          const ai = POSITION_ORDER.indexOf(a.position);
          const bi = POSITION_ORDER.indexOf(b.position);
          return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
        });
        setPlayers(sorted);
        setAverages(d.averages || []);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [selectedTeam, isSetupComplete, router, selectedSeason]);

  function getAvg(playerId: number) {
    return averages.find((a) => a.player_id === playerId);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="section-title">Front Office</p>
        <h1 className="font-heading text-4xl font-bold uppercase mt-1">
          {selectedTeam?.city} <span className="text-orange">{selectedTeam?.name}</span>
        </h1>
        <p className="text-muted text-sm font-body mt-1">
          {eraLabel} · {selectedSeason}–{selectedSeason + 1} · {players.length} Players
        </p>
      </div>

      <Card>
        {loading ? (
          <p className="text-muted text-sm font-body py-8 text-center">Loading {selectedSeason}–{selectedSeason + 1} roster...</p>
        ) : error ? (
          <p className="text-red-400 text-sm font-body py-8 text-center">Could not load roster for this era. BallDontLie may not have data for {selectedSeason}.</p>
        ) : players.length === 0 ? (
          <p className="text-muted text-sm font-body py-8 text-center">No players found for this team and season.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['#', 'Player', 'Pos', 'PPG', 'RPG', 'APG', 'FG%', 'MIN'].map((h) => (
                    <th key={h} className="text-left text-muted font-body font-normal py-2 pr-4 last:pr-0">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {players.map((p) => {
                  const avg = getAvg(p.id);
                  return (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                      <td className="py-3 pr-4 text-muted font-body">{p.jersey_number || '—'}</td>
                      <td className="py-3 pr-4">
                        <span className="font-heading font-bold text-text">{p.first_name} {p.last_name}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge label={p.position || '—'} variant={positionColor(p.position || '')} />
                      </td>
                      <td className="py-3 pr-4 font-heading font-bold">{avg?.pts?.toFixed(1) ?? '—'}</td>
                      <td className="py-3 pr-4 font-heading font-bold">{avg?.reb?.toFixed(1) ?? '—'}</td>
                      <td className="py-3 pr-4 font-heading font-bold">{avg?.ast?.toFixed(1) ?? '—'}</td>
                      <td className="py-3 pr-4 text-muted font-body">
                        {avg?.fg_pct ? (avg.fg_pct * 100).toFixed(1) + '%' : '—'}
                      </td>
                      <td className="py-3 text-muted font-body">{avg?.min ?? '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

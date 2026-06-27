'use client';

import { useEffect, useState } from 'react';
import { useGameState } from '@/lib/game-state';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { ERAS } from '@/lib/nba-teams';
import { BBGM_TID_TO_ABB } from '@/lib/bbgm-parser';

function positionColor(pos: string): 'orange' | 'gold' | 'green' | 'muted' {
  if (pos.startsWith('G') || pos === 'PG' || pos === 'SG') return 'orange';
  if (pos.startsWith('F') || pos === 'SF' || pos === 'PF') return 'gold';
  if (pos === 'C') return 'green';
  return 'muted';
}
function ovrColor(ovr: number) {
  if (ovr >= 80) return 'text-yellow-400';
  if (ovr >= 70) return 'text-orange-400';
  if (ovr >= 60) return 'text-green-400';
  return 'text-muted';
}
function fmtHeight(hgt: number) { return `${Math.floor(hgt / 12)}'${hgt % 12}"`; }
function fmtContract(amount: string | number) {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (!n) return '—';
  return `$${(n / 1000).toFixed(1)}M`;
}

export default function RosterPage() {
  const router = useRouter();
  const { selectedTeam, isSetupComplete, selectedSeason, selectedEra, leaguePlayers } = useGameState();

  const [loading, setLoading] = useState(true);

  const eraLabel = ERAS.find((e) => e.id === selectedEra)?.label ?? 'Modern';

  useEffect(() => {
    if (!isSetupComplete) {
      router.push('/setup');
      return;
    }
    setLoading(false);
  }, [isSetupComplete, router]);

  const teamPlayers = leaguePlayers
    .filter((p) => {
      const tidEntry = Object.entries(BBGM_TID_TO_ABB).find(([, abb]) => abb === selectedTeam?.abbreviation);
      return tidEntry ? p.tid === parseInt(tidEntry[0]) : false;
    })
    .sort((a, b) => b.ovr - a.ovr);

  const header = (
    <div>
      <p className="section-title">Front Office</p>
      <h1 className="font-heading text-4xl font-bold uppercase mt-1">
        {selectedTeam?.city} <span className="text-orange">{selectedTeam?.name}</span>
      </h1>
      <p className="text-muted text-sm font-body mt-1">
        {eraLabel} · {selectedSeason}–{selectedSeason + 1} · {teamPlayers.length} Players
      </p>
    </div>
  );

  if (loading) return (
    <div className="space-y-6">{header}
      <Card><p className="text-muted text-sm font-body py-8 text-center">Loading roster…</p></Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {header}
      <Card>
        {teamPlayers.length === 0 ? (
          <p className="text-muted text-sm font-body py-8 text-center">No players found for {selectedTeam?.abbreviation} in this era.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Player','Pos','OVR','HT','WT','SPD','STR','JMP','FG','3PT','FT','BLK','STL','REB','Contract'].map((h) => (
                    <th key={h} className="text-left text-muted font-body font-normal py-2 pr-3 last:pr-0 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teamPlayers.map((p, i) => {
                  const rt = p.ratings[0];
                  return (
                    <tr key={i} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                      <td className="py-3 pr-3 font-heading font-bold text-text whitespace-nowrap">{p.name}</td>
                      <td className="py-3 pr-3"><Badge label={p.pos || '—'} variant={positionColor(p.pos || '')} /></td>
                      <td className={`py-3 pr-3 font-heading font-bold text-base ${ovrColor(p.ovr)}`}>{p.ovr}</td>
                      <td className="py-3 pr-3 text-muted font-body">{fmtHeight(p.hgt)}</td>
                      <td className="py-3 pr-3 text-muted font-body">{p.weight}</td>
                      <td className="py-3 pr-3 font-heading">{rt?.spd ?? '—'}</td>
                      <td className="py-3 pr-3 font-heading">{rt?.stre ?? '—'}</td>
                      <td className="py-3 pr-3 font-heading">{rt?.jmp ?? '—'}</td>
                      <td className="py-3 pr-3 font-heading">{rt?.fg ?? '—'}</td>
                      <td className="py-3 pr-3 font-heading">{rt?.tp ?? '—'}</td>
                      <td className="py-3 pr-3 font-heading">{rt?.ft ?? '—'}</td>
                      <td className="py-3 pr-3 font-heading">{rt?.blk ?? '—'}</td>
                      <td className="py-3 pr-3 font-heading">{rt?.stl ?? '—'}</td>
                      <td className="py-3 pr-3 font-heading">{rt?.reb ?? '—'}</td>
                      <td className="py-3 text-muted font-body whitespace-nowrap">{fmtContract(p.contract.amount)} / {p.contract.exp}</td>
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

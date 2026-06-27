'use client';

import { useState, useMemo } from 'react';
import { useGameState } from '@/lib/game-state';
import { BBGM_TID_TO_ABB } from '@/lib/bbgm-parser';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { clsx } from 'clsx';

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
function positionColor(pos: string): 'orange' | 'gold' | 'green' | 'muted' {
  if (pos.startsWith('G') || pos === 'PG' || pos === 'SG') return 'orange';
  if (pos.startsWith('F') || pos === 'SF' || pos === 'PF') return 'gold';
  if (pos === 'C') return 'green';
  return 'muted';
}

export default function FreeAgencyPage() {
  const { selectedTeam, leaguePlayers, signFreeAgent } = useGameState();
  const [searchTerm, setSearchTerm] = useState('');

  const myTid = useMemo(() => {
    const entry = Object.entries(BBGM_TID_TO_ABB).find(([, abb]) => abb === selectedTeam?.abbreviation);
    return entry ? parseInt(entry[0]) : -1;
  }, [selectedTeam]);

  const freeAgents = useMemo(() => {
    return leaguePlayers
      .filter(p => p.tid === -1)
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => b.ovr - a.ovr);
  }, [leaguePlayers, searchTerm]);

  function handleSign(playerId: number) {
    if (myTid === -1) return;
    signFreeAgent(playerId, myTid);
    alert('Player signed successfully!');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="section-title">Front Office</p>
          <h1 className="font-heading text-4xl font-800 uppercase mt-1">
            Free <span className="text-orange">Agency</span>
          </h1>
        </div>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm font-body text-text focus:outline-none focus:border-orange/60 placeholder:text-muted"
          />
        </div>
      </div>
      <Card>
        {freeAgents.length === 0 ? (
          <p className="text-muted text-sm font-body py-8 text-center">No free agents available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Player','Pos','OVR','HT','WT','Age','Contract','Action'].map((h) => (
                    <th key={h} className="text-left text-muted font-body font-normal py-2 pr-3 last:pr-0 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {freeAgents.map((p) => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                    <td className="py-3 pr-3 font-heading font-bold text-text whitespace-nowrap">{p.name}</td>
                    <td className="py-3 pr-3"><Badge label={p.pos || '—'} variant={positionColor(p.pos || '')} /></td>
                    <td className={`py-3 pr-3 font-heading font-bold text-base ${ovrColor(p.ovr)}`}>{p.ovr}</td>
                    <td className="py-3 pr-3 text-muted font-body">{fmtHeight(p.hgt)}</td>
                    <td className="py-3 pr-3 text-muted font-body">{p.weight}</td>
                    <td className="py-3 pr-3 text-muted font-body">{p.born?.year ? (new Date().getFullYear() - p.born.year) : '—'}</td>
                    <td className="py-3 pr-3 text-muted font-body whitespace-nowrap">{fmtContract(p.contract.amount)} / {p.contract.exp}</td>
                    <td className="py-3">
                      <button onClick={() => handleSign(p.id)} className="px-3 py-1 bg-orange/20 hover:bg-orange/30 text-orange border border-orange/40 rounded-lg text-xs font-heading font-bold uppercase transition-all">Sign</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

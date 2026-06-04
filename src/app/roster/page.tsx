'use client';

import { useEffect, useState } from 'react';
import { useGameState } from '@/lib/game-state';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { ERAS } from '@/lib/nba-teams';
import type { BBGMPlayer } from '@/lib/bbgm-parser';

// ── Legacy BDL types ──────────────────────────────────────────────────────────
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

const POSITION_ORDER = ['G', 'PG', 'SG', 'G-F', 'GF', 'SF', 'PF', 'F', 'F-C', 'FC', 'C'];

function posSort(pos: string) {
  const i = POSITION_ORDER.indexOf(pos);
  return i === -1 ? 99 : i;
}

function positionColor(pos: string): 'orange' | 'gold' | 'green' | 'muted' {
  if (pos.startsWith('G') || pos === 'PG' || pos === 'SG') return 'orange';
  if (pos.startsWith('F') || pos === 'SF' || pos === 'PF') return 'gold';
  if (pos === 'C') return 'green';
  return 'muted';
}

function ovrColor(ovr: number): string {
  if (ovr >= 80) return 'text-yellow-400';
  if (ovr >= 70) return 'text-orange-400';
  if (ovr >= 60) return 'text-green-400';
  return 'text-muted';
}

function fmtHeight(hgt: number): string {
  // BBGM hgt is inches
  const ft = Math.floor(hgt / 12);
  const inches = hgt % 12;
  return `${ft}'${inches}"`;
}

function fmtContract(amount: string | number): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (!n) return '—';
  return `$${(n / 1000).toFixed(1)}M`;
}

// ── BBGM era slugs that this page knows about ─────────────────────────────────
const BBGM_ERA_SLUGS = new Set([
  'classic-1985', 'jordan-1996',
  'dynasty-2015', 'dynasty-2016', 'dynasty-2018',
  'bubble-2020',  'modern-2022',  'modern-2024',  'current-2025',
]);

export default function RosterPage() {
  const router = useRouter();
  const { selectedTeam, isSetupComplete, selectedSeason, selectedEra } = useGameState();

  // ── BDL state ──
  const [players, setPlayers]   = useState<Player[]>([]);
  const [averages, setAverages] = useState<SeasonAvg[]>([]);

  // ── BBGM state ──
  const [bbgmPlayers, setBbgmPlayers] = useState<(BBGMPlayer & { teamAbb: string; teamName: string })[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  const eraLabel = ERAS.find((e) => e.id === selectedEra)?.label ?? 'Modern';
  const isBBGM   = BBGM_ERA_SLUGS.has(selectedEra);

  // ── Fetch BBGM roster ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!isBBGM) return;
    if (!isSetupComplete) { router.push('/setup'); return; }
    if (!selectedTeam) return;
    setLoading(true); setError(false);
    fetch(`/api/roster/bbgm/${selectedEra}?team=${selectedTeam.abbreviation}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(true); setLoading(false); return; }
        setBbgmPlayers(d.players ?? []);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [selectedTeam, isSetupComplete, router, selectedEra, isBBGM]);

  // ── Fetch BDL roster ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isBBGM) return;
    if (!isSetupComplete) { router.push('/setup'); return; }
    if (!selectedTeam) return;
    setLoading(true); setError(false);
    fetch(`/api/roster/${selectedTeam.id}?season=${selectedSeason}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(true); setLoading(false); return; }
        const sorted = (d.players as Player[]).sort((a, b) => posSort(a.position) - posSort(b.position));
        setPlayers(sorted);
        setAverages(d.averages || []);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [selectedTeam, isSetupComplete, router, selectedSeason, isBBGM]);

  function getAvg(playerId: number) {
    return averages.find((a) => a.player_id === playerId);
  }

  // ── Shared header ─────────────────────────────────────────────────────────
  const header = (
    <div>
      <p className="section-title">Front Office</p>
      <h1 className="font-heading text-4xl font-bold uppercase mt-1">
        {selectedTeam?.city} <span className="text-orange">{selectedTeam?.name}</span>
      </h1>
      <p className="text-muted text-sm font-body mt-1">
        {eraLabel} · {selectedSeason}–{selectedSeason + 1} · {isBBGM ? bbgmPlayers.length : players.length} Players
      </p>
    </div>
  );

  // ── Loading / error states ────────────────────────────────────────────────
  if (loading) return (
    <div className="space-y-6">{header}
      <Card><p className="text-muted text-sm font-body py-8 text-center">Loading {selectedSeason}–{selectedSeason + 1} roster…</p></Card>
    </div>
  );

  if (error) return (
    <div className="space-y-6">{header}
      <Card><p className="text-red-400 text-sm font-body py-8 text-center">Could not load roster for this era.</p></Card>
    </div>
  );

  // ── BBGM view ─────────────────────────────────────────────────────────────
  if (isBBGM) {
    const r = bbgmPlayers;
    return (
      <div className="space-y-6">
        {header}
        <Card>
          {r.length === 0 ? (
            <p className="text-muted text-sm font-body py-8 text-center">No players found for this team in this era.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Player', 'Pos', 'OVR', 'HT', 'WT', 'SPD', 'STR', 'JMP', 'FG', '3PT', 'FT', 'BLK', 'STL', 'REB', 'Contract'].map((h) => (
                      <th key={h} className="text-left text-muted font-body font-normal py-2 pr-3 last:pr-0 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {r.map((p, i) => {
                    const rt = p.ratings[0];
                    return (
                      <tr key={i} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                        <td className="py-3 pr-3">
                          <span className="font-heading font-bold text-text">{p.name}</span>
                        </td>
                        <td className="py-3 pr-3">
                          <Badge label={p.pos || '—'} variant={positionColor(p.pos || '')} />
                        </td>
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

  // ── BDL / legacy view ─────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {header}
      <Card>
        {players.length === 0 ? (
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

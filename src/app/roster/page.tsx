'use client';

import { useEffect, useState } from 'react';
import { useGameState } from '@/lib/game-state';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { ERAS } from '@/lib/nba-teams';
import { parseBBGM, BBGM_TID_TO_ABB } from '@/lib/bbgm-parser';
import type { BBGMPlayer } from '@/lib/bbgm-parser';

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

const POSITION_ORDER = ['G','PG','SG','G-F','GF','SF','PF','F','F-C','FC','C'];
function posSort(pos: string) { const i = POSITION_ORDER.indexOf(pos); return i === -1 ? 99 : i; }
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

// NOTE: filename must match exactly what is in public/data/
const BBGM_ERA_FILE: Record<string, string> = {
  'classic-1985':  '/data/NBA.Legacy.1985.v3.0.beta.json',
  'jordan-1996':   '/data/1995-96.NBA.Roster.json',
  'dynasty-2015':  '/data/2015-16.NBA.Roster.json',
  'dynasty-2016':  '/data/2016-17.NBA.Roster.json',
  'dynasty-2018':  '/data/2018-19.NBA.Roster.json',
  'bubble-2020':   '/data/2020-21.NBA.Roster.json',
  'modern-2022':   '/data/2022-23.NBA.Roster.json',
  'modern-2024':   '/data/2024-25.NBA.Roster.json',
  'current-2025':  '/data/2025-26.NBA.Roster 3.json',
};

const BBGM_ERA_SLUGS = new Set(Object.keys(BBGM_ERA_FILE));

type EnrichedPlayer = BBGMPlayer & { teamAbb: string };

export default function RosterPage() {
  const router = useRouter();
  const { selectedTeam, isSetupComplete, selectedSeason, selectedEra } = useGameState();

  const [players,     setPlayers]     = useState<Player[]>([]);
  const [averages,    setAverages]    = useState<SeasonAvg[]>([]);
  const [bbgmPlayers, setBbgmPlayers] = useState<EnrichedPlayer[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);

  const eraLabel = ERAS.find((e) => e.id === selectedEra)?.label ?? 'Modern';
  const isBBGM   = BBGM_ERA_SLUGS.has(selectedEra);

  useEffect(() => {
    if (!isBBGM) return;
    if (!isSetupComplete) { router.push('/setup'); return; }
    if (!selectedTeam) return;
    setLoading(true); setError(null); setBbgmPlayers([]);

    const url = BBGM_ERA_FILE[selectedEra];
    fetch(url)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`); return r.json(); })
      .then((json) => {
        const roster = parseBBGM(json);
        const tidEntry = Object.entries(BBGM_TID_TO_ABB).find(([, abb]) => abb === selectedTeam.abbreviation);
        if (!tidEntry) {
          setError(`No BBGM mapping for ${selectedTeam.abbreviation}`);
          setLoading(false);
          return;
        }
        const tid = parseInt(tidEntry[0]);
        const filtered = roster.players
          .filter((p) => p.tid === tid)
          .map((p) => ({ ...p, teamAbb: selectedTeam.abbreviation }))
          .sort((a, b) => b.ovr - a.ovr);
        setBbgmPlayers(filtered);
        setLoading(false);
      })
      .catch((e) => {
        console.error('BBGM fetch error:', e);
        setError(`Could not load ${url}`);
        setLoading(false);
      });
  }, [selectedTeam, isSetupComplete, router, selectedEra, isBBGM]);

  useEffect(() => {
    if (isBBGM) return;
    if (!isSetupComplete) { router.push('/setup'); return; }
    if (!selectedTeam) return;
    setLoading(true); setError(null);
    fetch(`/api/roster/${selectedTeam.id}?season=${selectedSeason}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); setLoading(false); return; }
        const sorted = (d.players as Player[]).sort((a, b) => posSort(a.position) - posSort(b.position));
        setPlayers(sorted);
        setAverages(d.averages || []);
        setLoading(false);
      })
      .catch(() => { setError('Failed to load roster.'); setLoading(false); });
  }, [selectedTeam, isSetupComplete, router, selectedSeason, isBBGM]);

  function getAvg(id: number) { return averages.find((a) => a.player_id === id); }

  const header = (
    <div className="relative">
      <div className="absolute -left-6 top-0 w-1 h-16 bg-orange" />
      <p className="section-title italic tracking-[0.3em]">Personnel Management // Roster</p>
      <h1 className="font-heading text-5xl font-800 uppercase italic tracking-tighter leading-none">
        {selectedTeam?.city} <span className="text-orange text-glow-orange">{selectedTeam?.name}</span>
      </h1>
      <div className="flex items-center gap-3 mt-3">
        <Badge label={eraLabel} variant="orange" />
        <Badge label={`${selectedSeason}–${selectedSeason + 1}`} variant="muted" />
        <span className="text-muted text-[10px] font-heading font-bold uppercase italic tracking-widest ml-1">
          {isBBGM ? bbgmPlayers.length : players.length} Active Personnel
        </span>
      </div>
    </div>
  );

  if (loading) return (
    <div className="space-y-6">{header}
      <Card><p className="text-muted text-sm font-body py-8 text-center">Loading roster…</p></Card>
    </div>
  );

  if (error) return (
    <div className="space-y-6">{header}
      <Card><p className="text-red-400 text-sm font-body py-8 text-center">{error}</p></Card>
    </div>
  );

  if (isBBGM) {
    return (
      <div className="space-y-8 pb-12">
        {header}
        <Card className="!p-0 overflow-hidden">
          {bbgmPlayers.length === 0 ? (
            <p className="text-muted text-sm font-heading font-bold uppercase italic py-12 text-center">No active personnel found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    {['Player','Pos','OVR','HT','WT','SPD','STR','JMP','FG','3PT','FT','BLK','STL','REB','Contract'].map((h) => (
                      <th key={h} className="text-left text-muted font-heading font-800 uppercase italic py-4 px-4 whitespace-nowrap tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bbgmPlayers.map((p, i) => {
                    const rt = p.ratings[0];
                    return (
                      <tr key={i} className="border-b border-white/5 hover:bg-orange/5 transition-colors group">
                        <td className="py-4 px-4 font-heading font-800 text-sm text-white whitespace-nowrap italic group-hover:text-orange transition-colors">
                          {p.name.toUpperCase()}
                        </td>
                        <td className="py-4 px-4"><Badge label={p.pos || '—'} variant={positionColor(p.pos || '')} /></td>
                        <td className={`py-4 px-4 font-heading font-900 text-lg italic ${ovrColor(p.ovr)}`}>{p.ovr}</td>
                        <td className="py-4 px-4 text-muted font-heading font-bold">{fmtHeight(p.hgt)}</td>
                        <td className="py-4 px-4 text-muted font-heading font-bold">{p.weight}</td>
                        <td className="py-4 px-4 font-heading font-bold text-white/80">{rt?.spd ?? '—'}</td>
                        <td className="py-4 px-4 font-heading font-bold text-white/80">{rt?.stre ?? '—'}</td>
                        <td className="py-4 px-4 font-heading font-bold text-white/80">{rt?.jmp ?? '—'}</td>
                        <td className="py-4 px-4 font-heading font-bold text-white/80">{rt?.fg ?? '—'}</td>
                        <td className="py-4 px-4 font-heading font-bold text-white/80">{rt?.tp ?? '—'}</td>
                        <td className="py-4 px-4 font-heading font-bold text-white/80">{rt?.ft ?? '—'}</td>
                        <td className="py-4 px-4 font-heading font-bold text-white/80">{rt?.blk ?? '—'}</td>
                        <td className="py-4 px-4 font-heading font-bold text-white/80">{rt?.stl ?? '—'}</td>
                        <td className="py-4 px-4 font-heading font-bold text-white/80">{rt?.reb ?? '—'}</td>
                        <td className="py-4 px-4 text-muted font-heading font-bold whitespace-nowrap italic">{fmtContract(p.contract.amount)} / {p.contract.exp}</td>
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

  return (
    <div className="space-y-8 pb-12">
      {header}
      <Card className="!p-0 overflow-hidden">
        {players.length === 0 ? (
          <p className="text-muted text-sm font-heading font-bold uppercase italic py-12 text-center">No players found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  {['#','Player','Pos','PPG','RPG','APG','FG%','MIN'].map((h) => (
                    <th key={h} className="text-left text-muted font-heading font-800 uppercase italic py-4 px-4 whitespace-nowrap tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {players.map((p) => {
                  const avg = getAvg(p.id);
                  return (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-orange/5 transition-colors group">
                      <td className="py-4 px-4 text-muted font-heading font-bold">{p.jersey_number || '—'}</td>
                      <td className="py-4 px-4 font-heading font-800 text-sm text-white italic group-hover:text-orange transition-colors">
                        {p.first_name.toUpperCase()} {p.last_name.toUpperCase()}
                      </td>
                      <td className="py-4 px-4"><Badge label={p.position || '—'} variant={positionColor(p.position || '')} /></td>
                      <td className="py-4 px-4 font-heading font-900 text-lg italic text-white">{avg?.pts?.toFixed(1) ?? '—'}</td>
                      <td className="py-4 px-4 font-heading font-bold text-white/80">{avg?.reb?.toFixed(1) ?? '—'}</td>
                      <td className="py-4 px-4 font-heading font-bold text-white/80">{avg?.ast?.toFixed(1) ?? '—'}</td>
                      <td className="py-4 px-4 text-muted font-heading font-bold italic">{avg?.fg_pct ? (avg.fg_pct * 100).toFixed(1) + '%' : '—'}</td>
                      <td className="py-4 px-4 text-muted font-heading font-bold italic">{avg?.min ?? '—'}</td>
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

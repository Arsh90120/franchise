'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/lib/game-state';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { clsx } from 'clsx';
import type { BoxScoreResult, PlayerGameLine } from '@/lib/sim-engine';

interface Team {
  id: number;
  full_name: string;
  abbreviation: string;
  conference: string;
}

function StatCell({ val }: { val: string | number }) {
  return <td className="py-2.5 pr-3 text-center font-heading font-bold text-sm">{val}</td>;
}

function BoxScoreTable({ players, title }: { players: PlayerGameLine[]; title: string }) {
  const sorted = [...players].sort((a, b) => b.points - a.points);
  return (
    <div className="overflow-x-auto">
      <p className="section-title mb-2">{title}</p>
      <table className="w-full text-xs min-w-[600px]">
        <thead>
          <tr className="border-b border-border text-muted">
            {['Player', 'Pos', 'MIN', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'TO', 'FG', '3P', 'FT'].map((h) => (
              <th key={h} className={clsx('py-2 font-body font-normal', h === 'Player' ? 'text-left pr-3' : 'text-center pr-3')}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => (
            <tr key={p.playerId} className="border-b border-border/40 hover:bg-surface/60 transition-colors">
              <td className="py-2.5 pr-3 font-heading font-bold text-sm whitespace-nowrap">{p.name}</td>
              <td className="py-2.5 pr-3"><Badge label={p.position || 'F'} variant="muted" /></td>
              <StatCell val={p.minutes} />
              <StatCell val={p.points} />
              <StatCell val={p.rebounds} />
              <StatCell val={p.assists} />
              <StatCell val={p.steals} />
              <StatCell val={p.blocks} />
              <StatCell val={p.turnovers} />
              <StatCell val={`${p.fgm}/${p.fga}`} />
              <StatCell val={`${p.threePm}/${p.threePa}`} />
              <StatCell val={`${p.ftm}/${p.fta}`} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SimPage() {
  const router = useRouter();
  const { selectedTeam, isSetupComplete, recordWin, recordLoss, advanceWeek } = useGameState();
  const [teams, setTeams] = useState<Team[]>([]);
  const [opponent, setOpponent] = useState<Team | null>(null);
  const [result, setResult] = useState<BoxScoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'picker' | 'result'>('picker');

  useEffect(() => {
    if (!isSetupComplete) { router.push('/setup'); return; }
    fetch('/api/teams')
      .then((r) => r.json())
      .then((d) => setTeams((d.data as Team[]).filter((t) => t.id !== selectedTeam?.id)));
  }, [isSetupComplete, router, selectedTeam]);

  async function handleSim() {
    if (!opponent || !selectedTeam) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/sim/${opponent.id}?homeId=${selectedTeam.id}`);
      const data: BoxScoreResult = await res.json();
      setResult(data);
      if (data.winner === 'home') recordWin();
      else recordLoss();
      advanceWeek();
      setView('result');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filtered = teams.filter(
    (t) => t.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const didWin = result && result.winner === 'home';

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="section-title">Game Engine</p>
          <h1 className="font-heading text-4xl font-bold uppercase mt-1">
            Sim <span className="text-orange">Engine</span>
          </h1>
        </div>
        {view === 'result' && (
          <button onClick={() => { setView('picker'); setOpponent(null); setResult(null); }} className="btn-secondary text-sm">
            ← New Game
          </button>
        )}
      </div>

      {view === 'picker' && (
        <>
          <Card>
            <p className="section-title mb-3">Pick Your Opponent</p>
            <input
              type="text"
              placeholder="Search teams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body text-text mb-3 focus:outline-none focus:border-orange/50 placeholder:text-muted"
            />
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
              {filtered.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setOpponent(t)}
                  className={clsx(
                    'px-3 py-2 rounded-lg border text-xs font-heading font-bold uppercase transition-all',
                    opponent?.id === t.id
                      ? 'bg-orange/10 border-orange/40 text-orange'
                      : 'bg-background border-border text-muted hover:border-orange/30 hover:text-text'
                  )}
                >
                  {t.abbreviation}
                </button>
              ))}
            </div>
          </Card>

          {opponent && (
            <Card accent="orange">
              <div className="flex items-center justify-between">
                <div>
                  <p className="section-title">Matchup</p>
                  <p className="font-heading text-2xl font-bold uppercase mt-1">
                    <span className="text-orange">{selectedTeam?.abbreviation}</span>
                    <span className="text-muted mx-3">vs</span>
                    {opponent.abbreviation}
                  </p>
                  <p className="text-muted text-xs font-body mt-0.5">Home · Quick Box Score</p>
                </div>
                <button
                  onClick={handleSim}
                  disabled={loading}
                  className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Simulating...' : 'Sim Game →'}
                </button>
              </div>
            </Card>
          )}
        </>
      )}

      {view === 'result' && result && (
        <div className="space-y-4">
          <Card accent={didWin ? 'gold' : 'none'}>
            <div className="text-center py-2">
              <p className="section-title mb-2">{result.gameDate}</p>
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <p className="font-heading text-lg font-bold uppercase text-muted">{result.homeTeam.abbreviation}</p>
                  <p className={clsx('font-heading text-6xl font-bold', result.winner === 'home' ? 'text-gold' : 'text-text')}>
                    {result.homeTeam.totalPoints}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-muted font-body text-xs">FINAL{result.isOT ? '/OT' : ''}</p>
                </div>
                <div className="text-center">
                  <p className="font-heading text-lg font-bold uppercase text-muted">{result.awayTeam.abbreviation}</p>
                  <p className={clsx('font-heading text-6xl font-bold', result.winner === 'away' ? 'text-gold' : 'text-text')}>
                    {result.awayTeam.totalPoints}
                  </p>
                </div>
              </div>
              <p className={clsx('font-heading text-xl font-bold uppercase mt-3', didWin ? 'text-gold' : 'text-red-400')}>
                {didWin ? '🏆 Victory' : '💀 Defeat'}
              </p>
            </div>
          </Card>

          <Card>
            <p className="section-title mb-3">Quarter Scores</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Team', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'].map((h) => (
                    <th key={h} className={clsx('py-2 font-body font-normal text-muted', h === 'Team' ? 'text-left' : 'text-center')}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[result.homeTeam, result.awayTeam].map((team) => (
                  <tr key={team.teamId} className="border-b border-border/40">
                    <td className="py-2.5 font-heading font-bold">{team.abbreviation}</td>
                    <td className="py-2.5 text-center text-muted">{team.q1}</td>
                    <td className="py-2.5 text-center text-muted">{team.q2}</td>
                    <td className="py-2.5 text-center text-muted">{team.q3}</td>
                    <td className="py-2.5 text-center text-muted">{team.q4}</td>
                    <td className={clsx('py-2.5 text-center font-heading font-bold text-lg', team.totalPoints === Math.max(result.homeTeam.totalPoints, result.awayTeam.totalPoints) ? 'text-gold' : 'text-text')}>
                      {team.totalPoints}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card>
            <p className="section-title mb-3">Team Stats</p>
            <div className="grid grid-cols-2 gap-6">
              {[result.homeTeam, result.awayTeam].map((team) => (
                <div key={team.teamId}>
                  <p className="font-heading font-bold text-sm mb-2">{team.abbreviation}</p>
                  {[
                    { label: 'FG', val: `${team.fgm}/${team.fga} (${team.fga > 0 ? ((team.fgm / team.fga) * 100).toFixed(1) : 0}%)` },
                    { label: '3PT', val: `${team.threePm}/${team.threePa} (${team.threePa > 0 ? ((team.threePm / team.threePa) * 100).toFixed(1) : 0}%)` },
                    { label: 'FT', val: `${team.ftm}/${team.fta} (${team.fta > 0 ? ((team.ftm / team.fta) * 100).toFixed(1) : 0}%)` },
                    { label: 'REB', val: team.totalRebounds },
                    { label: 'AST', val: team.totalAssists },
                    { label: 'STL', val: team.totalSteals },
                    { label: 'BLK', val: team.totalBlocks },
                    { label: 'TO', val: team.totalTurnovers },
                  ].map((s) => (
                    <div key={s.label} className="flex justify-between py-1.5 border-b border-border/40 last:border-0">
                      <span className="text-muted text-xs font-body">{s.label}</span>
                      <span className="font-heading font-bold text-sm">{s.val}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <BoxScoreTable players={result.homeTeam.players} title={`${result.homeTeam.abbreviation} Box Score`} />
          </Card>
          <Card>
            <BoxScoreTable players={result.awayTeam.players} title={`${result.awayTeam.abbreviation} Box Score`} />
          </Card>
        </div>
      )}
    </div>
  );
}

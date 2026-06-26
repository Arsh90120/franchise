'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/lib/game-state';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { clsx } from 'clsx';
import type { BoxScoreResult, PlayerGameLine } from '@/lib/sim-engine';

function StatCell({ val }: { val: string | number }) {
  return <td className="py-2.5 pr-3 text-center font-heading font-bold text-sm">{val}</td>;
}

function BoxScoreTable({ players, title }: { players: PlayerGameLine[]; title: string }) {
  const sorted = [...players].sort((a, b) => b.points - a.points);
  return (
    <div className="overflow-x-auto pb-4">
      <p className="section-title mb-4 italic tracking-[0.2em]">{title.toUpperCase()}</p>
      <table className="w-full text-[11px] min-w-[650px]">
        <thead>
          <tr className="bg-white/5 border-y border-white/10 text-muted font-heading font-800 uppercase italic tracking-widest">
            {['Player', 'Pos', 'MIN', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'TO', 'FG', '3P', 'FT'].map((h) => (
              <th key={h} className={clsx('py-3 px-2', h === 'Player' ? 'text-left' : 'text-center')}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => (
            <tr key={p.playerId} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
              <td className="py-3 px-2 font-heading font-800 text-sm italic group-hover:text-orange transition-colors">{p.name.toUpperCase()}</td>
              <td className="py-3 px-2 text-center"><Badge label={p.position || 'F'} variant="muted" /></td>
              <td className="py-3 px-2 text-center font-heading font-bold text-muted">{p.minutes}</td>
              <td className="py-3 px-2 text-center font-heading font-900 text-base text-white italic">{p.points}</td>
              <td className="py-3 px-2 text-center font-heading font-bold text-white/80">{p.rebounds}</td>
              <td className="py-3 px-2 text-center font-heading font-bold text-white/80">{p.assists}</td>
              <td className="py-3 px-2 text-center font-heading font-bold text-white/60">{p.steals}</td>
              <td className="py-3 px-2 text-center font-heading font-bold text-white/60">{p.blocks}</td>
              <td className="py-3 px-2 text-center font-heading font-bold text-white/40">{p.turnovers}</td>
              <td className="py-3 px-2 text-center font-heading font-bold text-muted">{p.fgm}/{p.fga}</td>
              <td className="py-3 px-2 text-center font-heading font-bold text-muted">{p.threePm}/{p.threePa}</td>
              <td className="py-3 px-2 text-center font-heading font-bold text-muted">{p.ftm}/{p.fta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const WEEKS = Array.from({ length: 26 }, (_, i) => i + 1);

export default function SimPage() {
  const router = useRouter();
  const {
    selectedTeam, isSetupComplete, schedule, currentGameIndex,
    recordGameResult, advanceGame, wins, losses, selectedEra,
  } = useGameState();
  const [result, setResult] = useState<BoxScoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'schedule' | 'result'>('schedule');
  const [selectedWeek, setSelectedWeek] = useState(1);

  const currentGame = schedule[currentGameIndex];

  useEffect(() => {
    if (!isSetupComplete) { router.push('/setup'); return; }
    if (currentGame) setSelectedWeek(currentGame.week);
  }, [isSetupComplete, router, currentGame]);

  async function handleSim() {
    if (!currentGame || !selectedTeam) return;
    setLoading(true);
    try {
      const homeId = currentGame.isHome ? selectedTeam.id : currentGame.opponentId;
      const awayId = currentGame.isHome ? currentGame.opponentId : selectedTeam.id;
      // Pass era so the sim engine uses the correct BBGM roster
      const res = await fetch(`/api/sim/${awayId}?homeId=${homeId}&era=${encodeURIComponent(selectedEra)}`);
      const data: BoxScoreResult = await res.json();

      const myScore = currentGame.isHome ? data.homeTeam.totalPoints : data.awayTeam.totalPoints;
      const oppScore = currentGame.isHome ? data.awayTeam.totalPoints : data.homeTeam.totalPoints;
      const gameResult: 'W' | 'L' = myScore > oppScore ? 'W' : 'L';
      const scoreStr = `${myScore}-${oppScore}`;

      recordGameResult(currentGameIndex, gameResult, scoreStr);
      advanceGame();
      setResult(data);
      setView('result');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const weekGames = schedule.filter((g) => g.week === selectedWeek);

  const gamesPlayed = schedule.filter((g) => g.result).length;
  const gamesRemaining = 82 - gamesPlayed;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-end justify-between relative">
        <div className="absolute -left-6 top-0 w-1 h-16 bg-orange" />
        <div>
          <p className="section-title italic tracking-[0.3em]">Season Operations // Calendar</p>
          <h1 className="font-heading text-5xl font-800 uppercase italic tracking-tighter leading-none">
            82-Game <span className="text-orange text-glow-orange">Schedule</span>
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <Badge label={selectedTeam?.abbreviation || '??'} variant="orange" />
            <Badge label={`${wins}–${losses}`} variant="muted" />
            <span className="text-muted text-[10px] font-heading font-bold uppercase italic tracking-widest ml-1">
              Matchup {gamesPlayed + 1} of 82
            </span>
          </div>
        </div>
        {view === 'result' && (
          <button onClick={() => setView('schedule')} className="btn-secondary text-xs italic tracking-widest">← RETURN TO CALENDAR</button>
        )}
      </div>

      {view === 'schedule' && (
        <div className="space-y-8">
          {currentGame && gamesRemaining > 0 && (
            <Card accent="orange" className="!p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-full bg-orange/5 -skew-x-12 translate-x-24 pointer-events-none" />
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="text-center md:text-left">
                  <p className="section-title mb-2">Upcoming Matchup // G{currentGame.gameNumber}</p>
                  <div className="flex items-center gap-6">
                    <span className="font-heading text-6xl font-900 italic text-white leading-none tracking-tighter">{selectedTeam?.abbreviation}</span>
                    <span className="font-heading text-2xl font-800 italic text-orange tracking-tighter">{currentGame.isHome ? 'VS' : '@'}</span>
                    <span className="font-heading text-6xl font-900 italic text-white leading-none tracking-tighter">{currentGame.opponentAbbr}</span>
                  </div>
                  <p className="text-muted text-[10px] font-heading font-bold uppercase tracking-[0.2em] mt-4 italic">
                    WEEK {currentGame.week} · {currentGame.isHome ? 'HOME COURT' : 'ROAD GAME'} · {currentGame.opponentName.toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={handleSim}
                  disabled={loading}
                  className="btn-primary py-8 px-12 text-xl italic min-w-[240px] shadow-[0_0_30px_rgba(255,77,0,0.2)]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? 'SIMULATING...' : 'START SIMULATION'}
                    {!loading && <span className="animate-pulse">→</span>}
                  </span>
                </button>
              </div>
            </Card>
          )}

          {gamesRemaining === 0 && (
            <Card accent="gold">
              <p className="text-center font-heading text-4xl font-900 italic text-gold py-12 uppercase tracking-tighter">🏆 Season Complete // Final Record: {wins}–{losses}</p>
            </Card>
          )}

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-muted text-[10px] font-heading font-800 uppercase italic tracking-widest mr-2">Jump to Week:</span>
            {WEEKS.map((w) => {
              const wGames = schedule.filter((g) => g.week === w);
              const done = wGames.every((g) => g.result);
              return (
                <button
                  key={w}
                  onClick={() => setSelectedWeek(w)}
                  className={clsx(
                    'w-8 h-8 text-[10px] font-heading font-800 border transition-all skew-x-[-12deg]',
                    selectedWeek === w ? 'bg-orange text-white border-orange shadow-[0_0_10px_rgba(255,77,0,0.4)]' :
                    done ? 'bg-white/5 border-white/10 text-muted/40' :
                    'bg-black/40 border-white/10 text-muted hover:text-white hover:border-white/30'
                  )}
                >
                  <span className="skew-x-[12deg] inline-block">{w}</span>
                </button>
              );
            })}
          </div>

          <Card className="!p-0 overflow-hidden">
            <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex justify-between items-center">
              <p className="section-title italic tracking-[0.3em] mb-0">Weekly Slate // Week {selectedWeek}</p>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-orange rounded-full" />
                <div className="w-1.5 h-1.5 bg-orange/20 rounded-full" />
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {weekGames.length === 0 ? (
                <p className="text-muted text-[10px] font-heading font-bold uppercase italic py-8 text-center tracking-[0.4em]">No scheduled events</p>
              ) : weekGames.map((g) => (
                <div
                  key={g.gameNumber}
                  className={clsx(
                    'flex items-center justify-between px-6 py-4 transition-colors',
                    g.gameNumber === currentGame?.gameNumber && !g.result
                      ? 'bg-orange/5'
                      : 'hover:bg-white/[0.02]'
                  )}
                >
                  <div className="flex items-center gap-6">
                    <span className="text-muted text-[10px] font-heading font-800 w-8 italic">G{g.gameNumber}</span>
                    <div className="flex items-center gap-3">
                      <span className={clsx(
                        'font-heading font-900 text-xl italic tracking-tighter',
                        g.gameNumber === currentGame?.gameNumber && !g.result ? 'text-orange' : 'text-white'
                      )}>
                        {g.isHome ? 'VS' : '@'} {g.opponentAbbr}
                      </span>
                      <span className="text-muted text-[10px] font-heading font-bold uppercase italic tracking-widest hidden md:inline">{g.opponentName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] text-muted font-heading font-bold uppercase italic tracking-widest bg-white/5 px-2 py-0.5">
                      {g.isHome ? 'Home' : 'Away'}
                    </span>
                    <div className="w-32 flex justify-end">
                      {g.result ? (
                        <div className="flex items-center gap-2">
                          <span className={clsx(
                            'font-heading font-900 text-lg italic px-2 py-0.5',
                            g.result === 'W' ? 'text-gold' : 'text-2k-red'
                          )}>
                            {g.result} {g.score}
                          </span>
                        </div>
                      ) : g.gameNumber === currentGame?.gameNumber ? (
                        <span className="text-orange text-[10px] font-heading font-900 italic tracking-[0.2em] animate-pulse">UP NEXT</span>
                      ) : (
                        <span className="text-white/10 text-xs font-heading font-800">—</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {view === 'result' && result && (() => {
        const prevGame = schedule[currentGameIndex - 1];
        const myTeamResult = prevGame?.result;
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card accent={myTeamResult === 'W' ? 'gold' : 'none'} className="!p-12 overflow-hidden relative">
              {myTeamResult === 'W' && (
                <div className="absolute inset-0 bg-gold/5 animate-pulse pointer-events-none" />
              )}
              <div className="text-center relative z-10">
                <p className="section-title italic tracking-[0.4em] mb-8">Post-Game Analysis // G{prevGame?.gameNumber}</p>
                <div className="flex items-center justify-center gap-4 md:gap-16">
                  <div className="text-center">
                    <p className="font-heading text-2xl font-900 italic text-muted mb-2">{result.homeTeam.abbreviation}</p>
                    <p className={clsx('font-heading text-8xl font-900 italic leading-none tracking-tighter', result.winner === 'home' ? 'text-gold text-glow-gold' : 'text-white/40')}>
                      {result.homeTeam.totalPoints}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-muted font-heading font-900 italic text-sm tracking-widest bg-white/5 px-4 py-1">FINAL{result.isOT ? '/OT' : ''}</p>
                    <div className="h-12 w-px bg-white/10 my-4" />
                  </div>
                  <div className="text-center">
                    <p className="font-heading text-2xl font-900 italic text-muted mb-2">{result.awayTeam.abbreviation}</p>
                    <p className={clsx('font-heading text-8xl font-900 italic leading-none tracking-tighter', result.winner === 'away' ? 'text-gold text-glow-gold' : 'text-white/40')}>
                      {result.awayTeam.totalPoints}
                    </p>
                  </div>
                </div>
                <div className="mt-12 flex flex-col items-center gap-2">
                  <p className={clsx('font-heading text-4xl font-900 italic uppercase tracking-tighter', myTeamResult === 'W' ? 'text-gold' : 'text-2k-red')}>
                    {myTeamResult === 'W' ? '🏆 Victory Confirmed' : '💀 Mission Failed'}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge label={`Record: ${wins}–${losses}`} variant="muted" />
                    <Badge label={myTeamResult === 'W' ? '+1 Win' : '+1 Loss'} variant={myTeamResult === 'W' ? 'gold' : 'red'} />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="!p-0 overflow-hidden">
              <div className="bg-white/5 px-6 py-4 border-b border-white/10">
                <p className="section-title italic tracking-[0.3em] mb-0">Scoring Breakdown</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-black/20 text-[10px] font-heading font-800 uppercase italic tracking-widest text-muted">
                    {['Team', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'].map((h) => (
                      <th key={h} className={clsx('py-3 px-6', h === 'Team' ? 'text-left' : 'text-center')}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[result.homeTeam, result.awayTeam].map((team) => (
                    <tr key={team.teamId} className="border-b border-white/5">
                      <td className="py-4 px-6 font-heading font-900 text-xl italic text-white/80">{team.abbreviation}</td>
                      <td className="py-4 px-6 text-center font-heading font-bold text-muted">{team.q1}</td>
                      <td className="py-4 px-6 text-center font-heading font-bold text-muted">{team.q2}</td>
                      <td className="py-4 px-6 text-center font-heading font-bold text-muted">{team.q3}</td>
                      <td className="py-4 px-6 text-center font-heading font-bold text-muted">{team.q4}</td>
                      <td className={clsx('py-4 px-6 text-center font-heading font-900 text-3xl italic',
                        team.totalPoints === Math.max(result.homeTeam.totalPoints, result.awayTeam.totalPoints) ? 'text-gold' : 'text-white/20'
                      )}>{team.totalPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <div className="grid grid-cols-1 gap-8">
              <Card className="!p-0 overflow-hidden">
                <BoxScoreTable players={result.homeTeam.players} title={`${result.homeTeam.abbreviation} Box Score`} />
              </Card>
              <Card className="!p-0 overflow-hidden">
                <BoxScoreTable players={result.awayTeam.players} title={`${result.awayTeam.abbreviation} Box Score`} />
              </Card>
            </div>

            <button onClick={() => setView('schedule')} className="w-full btn-secondary py-6 text-sm italic tracking-[0.2em] shadow-xl">
              ← DISMISS ANALYSIS & RETURN TO CALENDAR
            </button>
          </div>
        );
      })()}
    </div>
  );
}

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

const WEEKS = Array.from({ length: 26 }, (_, i) => i + 1);

export default function SimPage() {
  const router = useRouter();
  const { selectedTeam, isSetupComplete, schedule, currentGameIndex, recordGameResult, advanceGame, wins, losses } = useGameState();
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
      const res = await fetch(`/api/sim/${awayId}?homeId=${homeId}`);
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
  const didWin = result && currentGameIndex > 0 &&
    schedule[currentGameIndex - 1]?.result === 'W';

  const gamesPlayed = schedule.filter((g) => g.result).length;
  const gamesRemaining = 82 - gamesPlayed;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="section-title">Season Schedule</p>
          <h1 className="font-heading text-4xl font-bold uppercase mt-1">
            82-Game <span className="text-orange">Calendar</span>
          </h1>
          <p className="text-muted text-sm font-body mt-1">
            {selectedTeam?.abbreviation} · {wins}–{losses} · Game {gamesPlayed + 1} of 82
          </p>
        </div>
        {view === 'result' && (
          <button onClick={() => setView('schedule')} className="btn-secondary text-sm">← Schedule</button>
        )}
      </div>

      {view === 'schedule' && (
        <div className="space-y-4">
          {/* Next Game Card */}
          {currentGame && gamesRemaining > 0 && (
            <Card accent="orange">
              <div className="flex items-center justify-between">
                <div>
                  <p className="section-title">Next Game — Game {currentGame.gameNumber}</p>
                  <p className="font-heading text-2xl font-bold uppercase mt-1">
                    <span className="text-orange">{selectedTeam?.abbreviation}</span>
                    <span className="text-muted mx-3">{currentGame.isHome ? 'vs' : '@'}</span>
                    {currentGame.opponentAbbr}
                  </p>
                  <p className="text-muted text-xs font-body mt-0.5">
                    Week {currentGame.week} · {currentGame.isHome ? 'Home' : 'Away'} · {currentGame.opponentName}
                  </p>
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

          {gamesRemaining === 0 && (
            <Card accent="gold">
              <p className="text-center font-heading text-xl font-bold text-gold py-4">🏆 Season Complete! Final Record: {wins}–{losses}</p>
            </Card>
          )}

          {/* Week Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-muted text-xs font-body">Week:</span>
            {WEEKS.map((w) => {
              const wGames = schedule.filter((g) => g.week === w);
              const done = wGames.every((g) => g.result);
              const active = wGames.some((g) => !g.result) && wGames.some((g, i, arr) => i === 0 || arr[i-1].result);
              return (
                <button
                  key={w}
                  onClick={() => setSelectedWeek(w)}
                  className={clsx(
                    'w-8 h-8 rounded-lg text-xs font-heading font-bold border transition-all',
                    selectedWeek === w ? 'bg-orange/10 border-orange/40 text-orange' :
                    done ? 'bg-surface border-border text-muted' :
                    'bg-background border-border text-muted hover:text-text'
                  )}
                >
                  {w}
                </button>
              );
            })}
          </div>

          {/* Week Games Table */}
          <Card>
            <p className="section-title mb-3">Week {selectedWeek}</p>
            <div className="space-y-2">
              {weekGames.length === 0 ? (
                <p className="text-muted text-sm font-body py-4 text-center">No games this week.</p>
              ) : weekGames.map((g) => (
                <div
                  key={g.gameNumber}
                  className={clsx(
                    'flex items-center justify-between px-3 py-2.5 rounded-lg border',
                    g.gameNumber === currentGame?.gameNumber && !g.result
                      ? 'border-orange/30 bg-orange/5'
                      : 'border-border bg-background'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-muted text-xs font-body w-6">G{g.gameNumber}</span>
                    <span className="font-heading font-bold text-sm">
                      {g.isHome ? 'vs' : '@'} {g.opponentAbbr}
                    </span>
                    <span className="text-muted text-xs font-body">{g.opponentName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {g.isHome ? (
                      <span className="text-xs text-muted font-body">Home</span>
                    ) : (
                      <span className="text-xs text-muted font-body">Away</span>
                    )}
                    {g.result ? (
                      <span className={clsx(
                        'font-heading font-bold text-sm px-2 py-0.5 rounded',
                        g.result === 'W' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
                      )}>
                        {g.result} {g.score}
                      </span>
                    ) : g.gameNumber === currentGame?.gameNumber ? (
                      <span className="text-orange text-xs font-heading font-bold">NEXT</span>
                    ) : (
                      <span className="text-muted text-xs font-body">—</span>
                    )}
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
          <div className="space-y-4">
            <Card accent={myTeamResult === 'W' ? 'gold' : 'none'}>
              <div className="text-center py-2">
                <p className="section-title mb-2">Game {(prevGame?.gameNumber) ?? ''} Final</p>
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
                <p className={clsx('font-heading text-xl font-bold uppercase mt-3', myTeamResult === 'W' ? 'text-gold' : 'text-red-400')}>
                  {myTeamResult === 'W' ? '🏆 Victory' : '💀 Defeat'}
                </p>
                <p className="text-muted text-sm font-body mt-1">Season Record: {wins}–{losses}</p>
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
                      <td className={clsx('py-2.5 text-center font-heading font-bold text-lg',
                        team.totalPoints === Math.max(result.homeTeam.totalPoints, result.awayTeam.totalPoints) ? 'text-gold' : 'text-text'
                      )}>{team.totalPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card>
              <BoxScoreTable players={result.homeTeam.players} title={`${result.homeTeam.abbreviation} Box Score`} />
            </Card>
            <Card>
              <BoxScoreTable players={result.awayTeam.players} title={`${result.awayTeam.abbreviation} Box Score`} />
            </Card>

            <button onClick={() => setView('schedule')} className="w-full btn-secondary py-3">
              ← Back to Schedule
            </button>
          </div>
        );
      })()}
    </div>
  );
}

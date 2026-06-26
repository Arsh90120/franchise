'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/lib/game-state';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { clsx } from 'clsx';
import { SimulationEngine, BoxScoreResult, PBPEvent, PlayerGameLine } from '@/lib/sim-engine';

function StatCell({ val }: { val: string | number }) {
  return <td className="py-2 pr-2 text-center font-heading font-bold text-[11px]">{val}</td>;
}

function BoxScoreTable({ players, title }: { players: PlayerGameLine[]; title: string }) {
  const sorted = [...players].sort((a, b) => b.points - a.points);
  return (
    <div className="overflow-x-auto">
      <p className="section-title text-[10px] mb-2 uppercase tracking-wider">{title}</p>
      <table className="w-full text-xs min-w-[500px]">
        <thead>
          <tr className="border-b border-border text-muted">
            {['Player', 'MIN', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'FG', '3P'].map((h) => (
              <th key={h} className={clsx('py-1 font-body font-normal text-[10px]', h === 'Player' ? 'text-left' : 'text-center')}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.filter(p => p.minutes > 0).map((p) => (
            <tr key={p.playerId} className="border-b border-border/40 hover:bg-surface/60 transition-colors">
              <td className="py-1.5 font-heading font-bold text-xs whitespace-nowrap">{p.name}</td>
              <StatCell val={Math.round(p.minutes)} />
              <StatCell val={p.points} />
              <StatCell val={p.rebounds} />
              <StatCell val={p.assists} />
              <StatCell val={p.steals} />
              <StatCell val={p.blocks} />
              <StatCell val={`${p.fgm}/${p.fga}`} />
              <StatCell val={`${p.threePm}/${p.threePa}`} />
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
    selectedTeamId, isSetupComplete, schedule, currentGameIndex,
    recordGameResult, advanceGame, wins, losses, players, rotations, teams
  } = useGameState();

  const [simResult, setSimResult] = useState<BoxScoreResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [view, setView] = useState<'schedule' | 'live' | 'boxscore'>('schedule');
  const [livePBP, setLivePBP] = useState<PBPEvent[]>([]);
  const [liveHomeScore, setLiveHomeScore] = useState(0);
  const [liveAwayScore, setLiveAwayScore] = useState(0);
  const [pbpIndex, setPbpIndex] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState(1);

  const pbpEndRef = useRef<HTMLDivElement>(null);

  const currentGame = schedule[currentGameIndex];

  useEffect(() => {
    if (!isSetupComplete) { router.push('/setup'); return; }
    if (currentGame) setSelectedWeek(currentGame.week);
  }, [isSetupComplete, router, currentGame]);

  useEffect(() => {
    if (view === 'live' && pbpEndRef.current) {
      pbpEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [livePBP, view]);

  function handleStartSim() {
    if (!currentGame || !selectedTeamId) return;

    const homeId = currentGame.isHome ? selectedTeamId : currentGame.opponentId;
    const awayId = currentGame.isHome ? currentGame.opponentId : selectedTeamId;

    const homeTeamRoster = Object.values(players).filter(p => p.tid === (homeId - 1));
    const awayTeamRoster = Object.values(players).filter(p => p.tid === (awayId - 1));

    const engine = new SimulationEngine(
      homeTeamRoster, rotations[homeId],
      awayTeamRoster, rotations[awayId]
    );

    const result = engine.runFullGame();
    setSimResult(result);
    setView('live');
    setIsSimulating(true);
    setLivePBP([]);
    setLiveHomeScore(0);
    setLiveAwayScore(0);
    setPbpIndex(0);

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < result.pbp.length) {
        const event = result.pbp[currentIdx];
        setLivePBP(prev => [...prev, event]);
        const [h, a] = event.score.split('-').map(Number);
        setLiveHomeScore(h);
        setLiveAwayScore(a);
        currentIdx++;
        setPbpIndex(currentIdx);
      } else {
        clearInterval(interval);
        setIsSimulating(false);

        const myScore = currentGame.isHome ? result.homeTeam.totalPoints : result.awayTeam.totalPoints;
        const oppScore = currentGame.isHome ? result.awayTeam.totalPoints : result.homeTeam.totalPoints;
        const gameResult: 'W' | 'L' = myScore > oppScore ? 'W' : 'L';

        const updates: any = {};
        [...result.homeTeam.players, ...result.awayTeam.players].forEach(p => {
          updates[p.playerId] = {
             gamesPlayed: 1, points: p.points, rebounds: p.rebounds, assists: p.assists,
             steals: p.steals, blocks: p.blocks, turnovers: p.turnovers, minutes: p.minutes,
             fga: p.fga, fgm: p.fgm, fta: p.fta, ftm: p.ftm, threePa: p.threePa, threePm: p.threePm
          };
        });

        recordGameResult(currentGameIndex, gameResult, `${myScore}-${oppScore}`, updates);
        advanceGame();
      }
    }, 100);
  }

  const weekGames = schedule.filter((g) => g.week === selectedWeek);
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
             {teams[selectedTeamId!]?.abbreviation} · {wins}–{losses} · Game {gamesPlayed + 1} of 82
          </p>
        </div>
        {(view === 'live' || view === 'boxscore') && !isSimulating && (
          <button onClick={() => setView('schedule')} className="btn-secondary text-sm">← Schedule</button>
        )}
      </div>

      {view === 'schedule' && (
        <div className="space-y-4">
          {currentGame && gamesRemaining > 0 && (
            <Card accent="orange">
              <div className="flex items-center justify-between">
                <div>
                  <p className="section-title">Next Game — Game {currentGame.gameNumber}</p>
                  <p className="font-heading text-2xl font-bold uppercase mt-1">
                    <span className="text-orange">{teams[selectedTeamId!]?.abbreviation}</span>
                    <span className="text-muted mx-3">{currentGame.isHome ? 'vs' : '@'}</span>
                    {currentGame.opponentAbbr}
                  </p>
                  <p className="text-muted text-xs font-body mt-0.5">
                    Week {currentGame.week} · {currentGame.isHome ? 'Home' : 'Away'} · {currentGame.opponentName}
                  </p>
                </div>
                <button
                  onClick={handleStartSim}
                  className="btn-primary text-sm"
                >
                  Sim Game →
                </button>
              </div>
            </Card>
          )}

          {gamesRemaining === 0 && (
            <Card accent="gold">
              <p className="text-center font-heading text-xl font-bold text-gold py-4">🏆 Season Complete! Final Record: {wins}–{losses}</p>
            </Card>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-muted text-xs font-body">Week:</span>
            {WEEKS.map((w) => {
              const wGames = schedule.filter((g) => g.week === w);
              const done = wGames.every((g) => g.result);
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

          <Card>
            <p className="section-title mb-3">Week {selectedWeek}</p>
            <div className="space-y-2">
              {weekGames.map((g) => (
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
                    <span className="text-xs text-muted font-body">{g.isHome ? 'Home' : 'Away'}</span>
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

      {view === 'live' && simResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          <div className="lg:col-span-2 space-y-4 flex flex-col h-full">
            <Card accent="orange" className="shrink-0">
               <div className="flex justify-between items-center text-center">
                  <div className="w-1/3">
                    <p className="font-heading text-xl font-bold uppercase">{simResult.homeTeam.abbreviation}</p>
                    <p className="text-4xl font-heading font-bold">{liveHomeScore}</p>
                  </div>
                  <div className="w-1/3">
                     <p className="text-muted font-body text-xs uppercase tracking-widest">
                       Q{livePBP[livePBP.length-1]?.quarter || 1} · {livePBP[livePBP.length-1]?.time || '12:00'}
                     </p>
                     {isSimulating && <div className="mt-2 w-full bg-border h-1 rounded-full overflow-hidden">
                        <div className="bg-orange h-full animate-pulse" style={{ width: `${(pbpIndex / simResult.pbp.length) * 100}%` }}></div>
                     </div>}
                  </div>
                  <div className="w-1/3">
                    <p className="font-heading text-xl font-bold uppercase">{simResult.awayTeam.abbreviation}</p>
                    <p className="text-4xl font-heading font-bold">{liveAwayScore}</p>
                  </div>
               </div>
            </Card>

            <Card className="grow flex flex-col overflow-hidden">
              <p className="section-title mb-4 shrink-0">Live Play-by-Play</p>
              <div className="overflow-y-auto space-y-3 font-body text-sm pr-2">
                {livePBP.slice().reverse().map((event, i) => (
                  <div key={i} className={clsx(
                    "flex gap-4 p-2 rounded border-l-2 transition-all",
                    event.type === 'period' ? "bg-orange/10 border-orange" : "border-border/40 hover:bg-surface/40"
                  )}>
                    <span className="text-muted text-xs w-10 shrink-0">{event.time}</span>
                    <span className="grow">{event.description}</span>
                    <span className="text-muted text-[10px] font-heading font-bold">{event.score}</span>
                  </div>
                ))}
                <div ref={pbpEndRef} />
              </div>
            </Card>
          </div>

          <div className="space-y-4 overflow-y-auto">
             <Card>
               <BoxScoreTable players={simResult.homeTeam.players.map(p => {
                 const current = livePBP.filter(e => e.playerId === p.playerId);
                 return {...p, points: current.filter(e => e.type === 'shot' && e.description.includes('makes')).length * 2};
               })} title={simResult.homeTeam.abbreviation} />
             </Card>
             <Card>
               <BoxScoreTable players={simResult.awayTeam.players.map(p => {
                 const current = livePBP.filter(e => e.playerId === p.playerId);
                 return {...p, points: current.filter(e => e.type === 'shot' && e.description.includes('makes')).length * 2};
               })} title={simResult.awayTeam.abbreviation} />
             </Card>
             {!isSimulating && (
               <button onClick={() => setView('schedule')} className="w-full btn-primary py-4">Return to Schedule</button>
             )}
          </div>
        </div>
      )}
    </div>
  );
}

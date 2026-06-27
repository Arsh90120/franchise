'use client';

import { useState, useMemo } from 'react';
import { useGameState } from '@/lib/game-state';
import { BBGM_TID_TO_ABB } from '@/lib/bbgm-parser';
import { NBA_TEAMS } from '@/lib/nba-teams';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { clsx } from 'clsx';

function ovrColor(ovr: number) {
  if (ovr >= 80) return 'text-yellow-400';
  if (ovr >= 70) return 'text-orange-400';
  if (ovr >= 60) return 'text-green-400';
  return 'text-muted';
}

function fmtContract(amount: string | number) {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (!n) return '—';
  return `$${(n / 1000).toFixed(1)}M`;
}

export default function TradeCenterPage() {
  const { selectedTeam, leaguePlayers, tradePlayers } = useGameState();

  const [cpuTeamId, setCpuTeamId] = useState<number>(1);
  const [mySelectedIds, setMySelectedIds] = useState<number[]>([]);
  const [cpuSelectedIds, setCpuSelectedIds] = useState<number[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<{ accepted: boolean; reasoning: string } | null>(null);

  const myTid = useMemo(() => {
    const entry = Object.entries(BBGM_TID_TO_ABB).find(([, abb]) => abb === selectedTeam?.abbreviation);
    return entry ? parseInt(entry[0]) : -1;
  }, [selectedTeam]);

  const cpuTid = useMemo(() => {
    const team = NBA_TEAMS.find(t => t.id === cpuTeamId);
    const entry = Object.entries(BBGM_TID_TO_ABB).find(([, abb]) => abb === team?.abbreviation);
    return entry ? parseInt(entry[0]) : -1;
  }, [cpuTeamId]);

  const myRoster = useMemo(() => leaguePlayers.filter(p => p.tid === myTid), [leaguePlayers, myTid]);
  const cpuRoster = useMemo(() => leaguePlayers.filter(p => p.tid === cpuTid), [leaguePlayers, cpuTid]);

  const toggleMyPlayer = (id: number) => {
    setMySelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleCpuPlayer = (id: number) => {
    setCpuSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  async function handleProposeTrade() {
    if (mySelectedIds.length === 0 && cpuSelectedIds.length === 0) return;

    setIsEvaluating(true);
    setEvaluation(null);

    const myOfferedPlayers = leaguePlayers.filter(p => mySelectedIds.includes(p.id));
    const cpuOfferedPlayers = leaguePlayers.filter(p => cpuSelectedIds.includes(p.id));

    const offerString = `User Team (${selectedTeam?.abbreviation}) sends: ${myOfferedPlayers.map(p => `${p.name} (OVR: ${p.ovr})`).join(', ')}. CPU Team sends: ${cpuOfferedPlayers.map(p => `${p.name} (OVR: ${p.ovr})`).join(', ')}.`;

    try {
      const res = await fetch('/api/trades/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          myOffer: offerString,
          cpuTeamNeeds: 'Win-now talent and backcourt depth',
          cpuTeamWinWindow: 'Competing for playoffs',
        }),
      });

      const data = await res.json();
      setEvaluation(data);

      if (data.accepted) {
        tradePlayers(mySelectedIds, cpuSelectedIds, myTid, cpuTid);
        setMySelectedIds([]);
        setCpuSelectedIds([]);
      }
    } catch (error) {
      console.error('Trade evaluation failed:', error);
      alert('Trade negotiation failed. The other GM is unreachable.');
    } finally {
      setIsEvaluating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="section-title">Front Office</p>
        <h1 className="font-heading text-4xl font-800 uppercase mt-1">
          Trade <span className="text-orange">Center</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold uppercase">{selectedTeam?.full_name}</h2>
            <Badge label="YOUR TEAM" variant="orange" />
          </div>
          <Card className="max-h-[600px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-surface z-10">
                <tr className="border-b border-border">
                  <th className="w-8"></th>
                  <th className="text-left text-muted font-body font-normal py-2">Player</th>
                  <th className="text-center text-muted font-body font-normal py-2">OVR</th>
                  <th className="text-right text-muted font-body font-normal py-2">Contract</th>
                </tr>
              </thead>
              <tbody>
                {myRoster.map(p => (
                  <tr
                    key={p.id}
                    className={clsx(
                      "border-b border-border/50 cursor-pointer transition-colors hover:bg-white/5",
                      mySelectedIds.includes(p.id) && "bg-orange/10"
                    )}
                    onClick={() => toggleMyPlayer(p.id)}
                  >
                    <td className="py-3 text-center">
                      <input type="checkbox" checked={mySelectedIds.includes(p.id)} readOnly className="accent-orange" />
                    </td>
                    <td className="py-3 font-heading font-bold text-text">
                      {p.name} <span className="text-xs text-muted font-body ml-1">{p.pos}</span>
                    </td>
                    <td className={clsx("py-3 text-center font-heading font-bold", ovrColor(p.ovr))}>{p.ovr}</td>
                    <td className="py-3 text-right text-muted font-body">{fmtContract(p.contract.amount)} / {p.contract.exp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <select
              value={cpuTeamId}
              onChange={(e) => {
                setCpuTeamId(parseInt(e.target.value));
                setCpuSelectedIds([]);
                setEvaluation(null);
              }}
              className="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm font-heading font-bold uppercase focus:outline-none focus:border-orange/60"
            >
              {NBA_TEAMS.filter(t => t.abbreviation !== selectedTeam?.abbreviation).map(t => (
                <option key={t.id} value={t.id}>{t.full_name}</option>
              ))}
            </select>
            <Badge label="CPU TEAM" variant="gold" />
          </div>
          <Card className="max-h-[600px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-surface z-10">
                <tr className="border-b border-border">
                  <th className="w-8"></th>
                  <th className="text-left text-muted font-body font-normal py-2">Player</th>
                  <th className="text-center text-muted font-body font-normal py-2">OVR</th>
                  <th className="text-right text-muted font-body font-normal py-2">Contract</th>
                </tr>
              </thead>
              <tbody>
                {cpuRoster.map(p => (
                  <tr
                    key={p.id}
                    className={clsx(
                      "border-b border-border/50 cursor-pointer transition-colors hover:bg-white/5",
                      cpuSelectedIds.includes(p.id) && "bg-gold/10"
                    )}
                    onClick={() => toggleCpuPlayer(p.id)}
                  >
                    <td className="py-3 text-center">
                      <input type="checkbox" checked={cpuSelectedIds.includes(p.id)} readOnly className="accent-gold" />
                    </td>
                    <td className="py-3 font-heading font-bold text-text">
                      {p.name} <span className="text-xs text-muted font-body ml-1">{p.pos}</span>
                    </td>
                    <td className={clsx("py-3 text-center font-heading font-bold", ovrColor(p.ovr))}>{p.ovr}</td>
                    <td className="py-3 text-right text-muted font-body">{fmtContract(p.contract.amount)} / {p.contract.exp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 py-8 border-t border-border">
        {evaluation && (
          <div className={clsx(
            "w-full max-w-2xl p-4 rounded-xl border",
            evaluation.accepted ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
          )}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{evaluation.accepted ? '✅' : '❌'}</span>
              <h3 className="font-heading font-bold uppercase">{evaluation.accepted ? 'Trade Accepted' : 'Trade Rejected'}</h3>
            </div>
            <p className="text-sm font-body text-text/80">{evaluation.reasoning}</p>
          </div>
        )}

        <button
          onClick={handleProposeTrade}
          disabled={isEvaluating || (mySelectedIds.length === 0 && cpuSelectedIds.length === 0)}
          className="btn-primary px-12 py-4 text-lg rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEvaluating ? 'Negotiating with GM...' : 'Propose Trade →'}
        </button>
      </div>
    </div>
  );
}

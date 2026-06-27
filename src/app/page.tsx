'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/lib/game-state';
import Card from '@/components/ui/Card';

export default function DashboardPage() {
  const router = useRouter();
  const { selectedTeamId, teams, isSetupComplete, selectedSeason, wins, losses, week, gmName } = useGameState();
  const selectedTeam = selectedTeamId != null ? teams[selectedTeamId] : null;

  useEffect(() => {
    if (!isSetupComplete) {
      router.push('/setup');
    }
  }, [isSetupComplete, router]);

  if (!isSetupComplete || !selectedTeam) return null;

  const record = `${wins}-${losses}`;
  const winPct = wins + losses > 0 ? ((wins / (wins + losses)) * 100).toFixed(1) + '%' : '—';

  return (
    <div className="space-y-6">
      <div>
        <p className="section-title">Welcome back, {gmName}</p>
        <h1 className="font-heading text-4xl font-bold uppercase mt-1">
          {selectedTeam.city}{' '}
          <span className="text-orange">{selectedTeam.name}</span>
        </h1>
        <p className="text-muted text-sm font-body mt-1">
          {selectedTeam.conference}ern Conference · {selectedTeam.division} · {selectedSeason}–{selectedSeason + 1} Season
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card accent="none">
          <p className="section-title">Season</p>
          <p className="font-heading text-3xl font-bold mt-1">{selectedSeason}–{String(selectedSeason + 1).slice(2)}</p>
        </Card>
        <Card accent="none">
          <p className="section-title">Record</p>
          <p className="font-heading text-3xl font-bold mt-1">{record}</p>
        </Card>
        <Card accent="gold">
          <p className="section-title">Win %</p>
          <p className="font-heading text-3xl font-bold mt-1 text-gold">{winPct}</p>
        </Card>
      </div>

      <Card>
        <p className="section-title mb-3">Quick Actions</p>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => router.push('/sim')} className="btn-primary">Sim Next Game</button>
          <button onClick={() => router.push('/roster')} className="btn-secondary">View Roster</button>
          <button onClick={() => router.push('/trades')} className="btn-secondary">Trade Center</button>
          <button onClick={() => router.push('/draft')} className="btn-secondary">Draft Board</button>
        </div>
      </Card>

      <Card>
        <p className="section-title mb-3">Franchise Status</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Week', value: week },
            { label: 'Wins', value: wins },
            { label: 'Losses', value: losses },
            { label: 'Win %', value: winPct },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-2xl font-bold">{s.value}</p>
              <p className="text-muted text-xs font-body mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/lib/game-state';
import Card from '@/components/ui/Card';

export default function DashboardPage() {
  const router = useRouter();
  const { selectedTeam, isSetupComplete, season, wins, losses, capSpace } = useGameState();

  useEffect(() => {
    if (!isSetupComplete) {
      router.push('/setup');
    }
  }, [isSetupComplete, router]);

  if (!isSetupComplete || !selectedTeam) return null;

  const capDisplay = `$${(capSpace / 1_000_000).toFixed(1)}M`;
  const record = `${wins}-${losses}`;

  return (
    <div className="space-y-6">
      <div>
        <p className="section-title">GM Dashboard</p>
        <h1 className="font-heading text-4xl font-800 uppercase mt-1">
          {selectedTeam.city}{' '}
          <span className="text-orange">{selectedTeam.name}</span>
        </h1>
        <p className="text-muted text-sm font-body mt-1">
          {selectedTeam.conference}ern Conference · {selectedTeam.division} · {season}–{season + 1} Season
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card accent="none">
          <p className="section-title">Season</p>
          <p className="font-heading text-3xl font-700 mt-1">{season}–{String(season + 1).slice(2)}</p>
        </Card>
        <Card accent="none">
          <p className="section-title">Record</p>
          <p className="font-heading text-3xl font-700 mt-1">{record}</p>
        </Card>
        <Card accent="gold">
          <p className="section-title">Cap Space</p>
          <p className="font-heading text-3xl font-700 mt-1 text-gold">{capDisplay}</p>
        </Card>
      </div>

      <Card>
        <p className="section-title mb-3">Quick Actions</p>
        <div className="flex gap-3 flex-wrap">
          <button className="btn-primary">Sim Next Game</button>
          <button onClick={() => router.push('/roster')} className="btn-secondary">View Roster</button>
          <button onClick={() => router.push('/trades')} className="btn-secondary">Trade Center</button>
          <button onClick={() => router.push('/draft')} className="btn-secondary">Draft Board</button>
        </div>
      </Card>

      <Card>
        <p className="section-title mb-3">Franchise Status</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Week', value: useGameState.getState().week },
            { label: 'Wins', value: wins },
            { label: 'Losses', value: losses },
            { label: 'Win %', value: wins + losses > 0 ? ((wins / (wins + losses)) * 100).toFixed(1) + '%' : '—' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-2xl font-700">{s.value}</p>
              <p className="text-muted text-xs font-body mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

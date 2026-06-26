'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/lib/game-state';
import Card from '@/components/ui/Card';
import clsx from 'clsx';

export default function DashboardPage() {
  const router = useRouter();
  const { selectedTeam, isSetupComplete, selectedSeason, wins, losses, week, gmName } = useGameState();

  useEffect(() => {
    if (!isSetupComplete) {
      router.push('/setup');
    }
  }, [isSetupComplete, router]);

  if (!isSetupComplete || !selectedTeam) return null;

  const record = `${wins}-${losses}`;
  const winPct = wins + losses > 0 ? ((wins / (wins + losses)) * 100).toFixed(1) + '%' : '—';

  return (
    <div className="space-y-8 pb-12">
      <div className="relative">
        <div className="absolute -left-6 top-0 w-1 h-24 bg-orange" />
        <p className="section-title italic tracking-[0.3em]">Operational Dashboard // {gmName}</p>
        <h1 className="font-heading text-7xl font-800 uppercase italic tracking-tighter leading-[0.8]">
          {selectedTeam.city}{' '}
          <span className="text-orange text-glow-orange">{selectedTeam.name}</span>
        </h1>
        <div className="flex items-center gap-4 mt-4">
          <p className="text-muted text-[10px] font-heading font-bold uppercase tracking-widest bg-white/5 px-2 py-1 italic">
            {selectedTeam.conference}ern Conference · {selectedTeam.division}
          </p>
          <p className="text-orange text-[10px] font-heading font-bold uppercase tracking-widest bg-orange/10 px-2 py-1 italic border border-orange/20">
            {selectedSeason}–{selectedSeason + 1} Season
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card accent="none" className="group">
          <p className="section-title">Franchise Era</p>
          <p className="font-heading text-4xl font-800 italic uppercase mt-1 tracking-tighter">
            {selectedSeason}<span className="text-orange">/</span>{String(selectedSeason + 1).slice(2)}
          </p>
          <div className="mt-4 h-1 w-full bg-white/5 overflow-hidden">
            <div className="h-full bg-orange w-1/3 group-hover:w-1/2 transition-all duration-500" />
          </div>
        </Card>
        <Card accent="none">
          <p className="section-title">Current Record</p>
          <p className="font-heading text-4xl font-800 italic uppercase mt-1 tracking-tighter">
            {wins}<span className="text-white/20 mx-1">-</span>{losses}
          </p>
          <p className="text-[10px] font-heading font-bold text-muted uppercase mt-2 italic tracking-widest">W/L Ratio: {winPct}</p>
        </Card>
        <Card accent="orange" className="bg-orange/5">
          <p className="section-title">Active Week</p>
          <div className="flex items-end gap-2 mt-1">
            <p className="font-heading text-5xl font-800 italic uppercase leading-none text-glow-orange">{week}</p>
            <p className="text-orange font-heading font-bold text-sm uppercase italic pb-1">of 26</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <p className="section-title mb-6">Quick Directives</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/sim')}
                className="btn-primary py-6 flex-col gap-2 h-32"
              >
                <span className="text-2xl">🏀</span>
                <span className="text-sm">Enter Sim Engine</span>
              </button>
              <button
                onClick={() => router.push('/roster')}
                className="btn-secondary py-6 flex-col gap-2 h-32 border-l-4"
              >
                <span className="text-2xl">📋</span>
                <span className="text-sm">Manage Roster</span>
              </button>
              <button
                onClick={() => router.push('/trades')}
                className="btn-secondary py-6 flex-col gap-2 h-32 border-l-4"
              >
                <span className="text-2xl">🤝</span>
                <span className="text-sm">Trade Negotiations</span>
              </button>
              <button
                onClick={() => router.push('/draft')}
                className="btn-secondary py-6 flex-col gap-2 h-32 border-l-4"
              >
                <span className="text-2xl">🎯</span>
                <span className="text-sm">Scouting & Draft</span>
              </button>
            </div>
          </Card>
        </div>

        <Card accent="gold">
          <p className="section-title mb-4">Season Metrics</p>
          <div className="space-y-6">
            {[
              { label: 'Victory Probability', value: winPct, color: 'text-gold' },
              { label: 'Conference Rank', value: '#4', color: 'text-white' },
              { label: 'Playoff Projection', value: '88%', color: 'text-2k-blue' },
              { label: 'Fan Interest', value: 'High', color: 'text-white' },
            ].map((s) => (
              <div key={s.label} className="flex justify-between items-end border-b border-white/5 pb-2">
                <div>
                  <p className="text-[10px] text-muted font-heading font-bold uppercase italic tracking-widest">{s.label}</p>
                </div>
                <p className={clsx('font-heading text-2xl font-800 italic', s.color)}>{s.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

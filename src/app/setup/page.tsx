'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/lib/game-state';
import { clsx } from 'clsx';

interface Team {
  id: number;
  full_name: string;
  abbreviation: string;
  city: string;
  name: string;
  conference: string;
  division: string;
}

const CONFERENCE_ORDER = ['East', 'West'];

export default function SetupPage() {
  const router = useRouter();
  const { setSelectedTeam, completeSetup } = useGameState();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selected, setSelected] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/teams')
      .then((r) => r.json())
      .then((d) => {
        const sorted = (d.data as Team[]).sort((a, b) =>
          a.full_name.localeCompare(b.full_name)
        );
        setTeams(sorted);
        setLoading(false);
      });
  }, []);

  const filtered = teams.filter(
    (t) =>
      t.full_name.toLowerCase().includes(search.toLowerCase()) ||
      t.city.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = CONFERENCE_ORDER.reduce((acc, conf) => {
    acc[conf] = filtered.filter((t) => t.conference === conf);
    return acc;
  }, {} as Record<string, Team[]>);

  function handleConfirm() {
    if (!selected) return;
    setSelectedTeam({
      id: selected.id,
      name: selected.name,
      abbreviation: selected.abbreviation,
      city: selected.city,
      conference: selected.conference,
      division: selected.division,
    });
    completeSetup();
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-3xl">
        <p className="section-title text-center mb-2">Welcome, GM</p>
        <h1 className="font-heading text-5xl font-800 uppercase text-center mb-1">
          Choose Your <span className="text-orange">Franchise</span>
        </h1>
        <p className="text-muted text-center text-sm font-body mb-8">
          Pick the team you want to build into a dynasty.
        </p>

        <input
          type="text"
          placeholder="Search teams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-text font-body text-sm mb-6 focus:outline-none focus:border-orange/50 placeholder:text-muted"
        />

        {loading ? (
          <div className="text-center text-muted font-body py-12">Loading teams...</div>
        ) : (
          <div className="space-y-6">
            {CONFERENCE_ORDER.map((conf) => (
              <div key={conf}>
                <p className="section-title mb-3">{conf}ern Conference</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {grouped[conf]?.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => setSelected(team)}
                      className={clsx(
                        'text-left px-4 py-3 rounded-xl border transition-all font-body text-sm',
                        selected?.id === team.id
                          ? 'bg-orange/10 border-orange/40 text-orange'
                          : 'bg-surface border-border text-text hover:border-orange/30 hover:text-orange'
                      )}
                    >
                      <p className="font-heading font-700 text-base uppercase">{team.abbreviation}</p>
                      <p className="text-xs text-muted mt-0.5">{team.full_name}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div className="mt-8 p-4 bg-surface border border-orange/30 rounded-xl flex items-center justify-between">
            <div>
              <p className="section-title">Selected</p>
              <p className="font-heading text-2xl font-800 uppercase mt-0.5">{selected.full_name}</p>
              <p className="text-muted text-xs font-body">{selected.conference}ern · {selected.division}</p>
            </div>
            <button onClick={handleConfirm} className="btn-primary text-sm">
              Start Franchise →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

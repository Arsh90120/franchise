'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/lib/game-state';
import { NBA_TEAMS, ERAS } from '@/lib/nba-teams';
import { generateSchedule } from '@/lib/schedule';
import { BBGMPlayer } from '@/lib/bbgm-parser';
import { clsx } from 'clsx';

export default function SetupPage() {
  const router = useRouter();
  const { isSetupComplete, setTeam, setEra, setGmName, completeSetup } = useGameState();

  const [teamId, setTeamId] = useState<number>(14);
  const [eraId, setEraId] = useState<string>('modern-2024');
  const [gmNameInput, setGmNameInput] = useState('');
  const [conference, setConference] = useState<'All' | 'East' | 'West'>('All');

  useEffect(() => {
    if (isSetupComplete) router.push('/');
  }, [isSetupComplete, router]);

  const filteredTeams = conference === 'All'
    ? NBA_TEAMS
    : NBA_TEAMS.filter((t) => t.conference === conference);

  const [isInitializing, setIsInitializing] = useState(false);

  async function handleStart() {
    const team = NBA_TEAMS.find((t) => t.id === teamId);
    const era = ERAS.find((e) => e.id === eraId);
    if (!team || !era) return;

    setIsInitializing(true);
    try {
      setTeam(team);
      setEra(era.id, era.season);
      setGmName(gmNameInput.trim() || 'GM');

      let leaguePlayers: BBGMPlayer[] = [];
      if (era.bbgm) {
        const response = await fetch(`/api/roster/bbgm/${era.id}`);
        const data = await response.json();
        leaguePlayers = data.players || [];
      } else {
        // Fallback for legacy eras: Map all teams' ROSTER_DATA to BBGMPlayer format
        const teamsToFetch = NBA_TEAMS;
        const allRosters = await Promise.all(
          teamsToFetch.map(async (t) => {
            const res = await fetch(`/api/roster/${t.id}?season=${era.season}`);
            return res.json();
          })
        );

        leaguePlayers = allRosters.flatMap((data, index) => {
          const tid = index; // Simple mapping for legacy
          return (data.players || []).map((p: any, pIdx: number) => ({
            id: tid * 100 + pIdx,
            name: `${p.first_name} ${p.last_name}`,
            pos: p.position || 'F',
            tid: tid,
            hgt: 78, // Default
            weight: 210, // Default
            born: { year: 1995, loc: '' },
            contract: { amount: 5000, exp: era.season + 2 },
            college: '',
            imgURL: '',
            ratings: [{
              hgt: 50, stre: 50, spd: 50, jmp: 50, endu: 50,
              ins: 50, dnk: 50, ft: 70, fg: 50, tp: 50,
              blk: 50, stl: 50, drb: 50, pss: 50, reb: 50, pot: 60
            }],
            skills: [],
            ovr: Math.round(p.pts ? (p.pts * 2 + p.reb + p.ast) : 65), // Mock OVR for legacy
          }));
        });
      }

      const schedule = generateSchedule(team.id);
      completeSetup(schedule, leaguePlayers);
      router.push('/');
    } catch (error) {
      console.error('Failed to initialize league:', error);
      alert('Failed to initialize league. Please try again.');
    } finally {
      setIsInitializing(false);
    }
  }

  const selectedTeam = NBA_TEAMS.find((t) => t.id === teamId);
  const selectedEraObj = ERAS.find((e) => e.id === eraId);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <p className="font-heading text-gold text-xs font-bold uppercase tracking-widest mb-2">Welcome, GM</p>
          <h1 className="font-heading text-5xl font-bold uppercase">
            Choose Your <span className="text-orange">Franchise</span>
          </h1>
          <p className="text-muted font-body text-sm mt-2">Your choices save automatically — you won&apos;t be asked again.</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <label className="font-heading text-gold text-xs font-bold uppercase tracking-widest block mb-2">Your GM Name</label>
          <input
            type="text"
            placeholder="Enter your name..."
            value={gmNameInput}
            onChange={(e) => setGmNameInput(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-body text-text focus:outline-none focus:border-orange/60 placeholder:text-muted"
          />
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
          <label className="font-heading text-gold text-xs font-bold uppercase tracking-widest block">Select Team</label>
          <div className="flex gap-2">
            {(['All', 'East', 'West'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setConference(c)}
                className={clsx(
                  'px-3 py-1 rounded-lg text-xs font-heading font-bold uppercase border transition-all',
                  conference === c
                    ? 'bg-orange/10 border-orange/40 text-orange'
                    : 'bg-background border-border text-muted hover:text-text'
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <select
            value={teamId}
            onChange={(e) => setTeamId(Number(e.target.value))}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-body text-text focus:outline-none focus:border-orange/60 appearance-none cursor-pointer"
          >
            {filteredTeams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.full_name} ({t.abbreviation})
              </option>
            ))}
          </select>
          {selectedTeam && (
            <div className="flex items-center gap-3 bg-background rounded-lg px-4 py-3 border border-orange/20">
              <div className="w-10 h-10 rounded-full bg-orange/10 border border-orange/30 flex items-center justify-center">
                <span className="font-heading font-bold text-orange text-xs">{selectedTeam.abbreviation}</span>
              </div>
              <div>
                <p className="font-heading font-bold text-sm">{selectedTeam.full_name}</p>
                <p className="text-muted text-xs font-body">{selectedTeam.conference}ern Conference · {selectedTeam.division}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
          <label className="font-heading text-gold text-xs font-bold uppercase tracking-widest block">Select Era</label>
          <select
            value={eraId}
            onChange={(e) => setEraId(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-body text-text focus:outline-none focus:border-orange/60 appearance-none cursor-pointer"
          >
            {ERAS.map((era) => (
              <option key={era.id} value={era.id}>{era.label}</option>
            ))}
          </select>
          {selectedEraObj && (
            <p className="text-muted text-xs font-body">{selectedEraObj.description}</p>
          )}
        </div>

        <button
          onClick={handleStart}
          disabled={isInitializing}
          className="w-full btn-primary py-4 text-base rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isInitializing ? 'Initializing League...' : 'Start Franchise →'}
        </button>
      </div>
    </div>
  );
}

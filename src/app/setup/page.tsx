'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/lib/game-state';
import { NBA_TEAMS, ERAS } from '@/lib/nba-teams';
import { generateSchedule } from '@/lib/schedule';
import { clsx } from 'clsx';

export default function SetupPage() {
  const router = useRouter();
  const { isSetupComplete, setTeam, setEra, setGmName, completeSetup } = useGameState();

  const [teamId, setTeamId] = useState<number>(14);
  const [eraId, setEraId] = useState<string>('modern');
  const [gmNameInput, setGmNameInput] = useState('');
  const [conference, setConference] = useState<'All' | 'East' | 'West'>('All');

  useEffect(() => {
    if (isSetupComplete) router.push('/');
  }, [isSetupComplete, router]);

  const filteredTeams = conference === 'All'
    ? NBA_TEAMS
    : NBA_TEAMS.filter((t) => t.conference === conference);

  function handleStart() {
    const team = NBA_TEAMS.find((t) => t.id === teamId);
    const era = ERAS.find((e) => e.id === eraId);
    if (!team || !era) return;
    setTeam(team);
    setEra(era.id, era.season);
    setGmName(gmNameInput.trim() || 'GM');
    const schedule = generateSchedule(team.id);
    completeSetup(schedule);
    router.push('/');
  }

  const selectedTeam = NBA_TEAMS.find((t) => t.id === teamId);
  const selectedEraObj = ERAS.find((e) => e.id === eraId);

  return (
    <div className="min-h-screen bg-[#050608] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-2k-blue/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-xl space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <p className="section-title italic tracking-[0.4em]">Initialize Simulation Module</p>
          <h1 className="font-heading text-6xl font-800 uppercase italic tracking-tighter leading-none">
            Franchise <span className="text-orange text-glow-orange">Creation</span>
          </h1>
          <p className="text-muted font-heading font-bold text-xs uppercase tracking-widest mt-4">Establish your legacy in the association</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-surface/40 backdrop-blur-xl border border-white/5 p-6 skew-2k">
            <div className="unskew-2k">
              <label className="section-title block mb-3">Executive Designation</label>
              <input
                type="text"
                placeholder="INPUT GM IDENTIFIER..."
                value={gmNameInput}
                onChange={(e) => setGmNameInput(e.target.value)}
                className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm font-heading font-800 uppercase italic tracking-widest text-white focus:outline-none focus:border-orange transition-colors placeholder:text-white/10"
              />
            </div>
          </div>

          <div className="bg-surface/40 backdrop-blur-xl border border-white/5 p-6 skew-2k">
            <div className="unskew-2k space-y-4">
              <label className="section-title block">Franchise Selection</label>
              <div className="flex gap-2">
                {(['All', 'East', 'West'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setConference(c)}
                    className={clsx(
                      'px-4 py-1.5 text-[10px] font-heading font-800 uppercase italic tracking-widest border transition-all',
                      conference === c
                        ? 'bg-orange text-white border-orange shadow-[0_0_15px_rgba(255,77,0,0.4)]'
                        : 'bg-black/40 border-white/10 text-muted hover:text-white hover:border-white/30'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="relative">
                <select
                  value={teamId}
                  onChange={(e) => setTeamId(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 px-4 py-4 text-sm font-heading font-800 uppercase italic tracking-widest text-white focus:outline-none focus:border-orange appearance-none cursor-pointer pr-10"
                >
                  {filteredTeams.map((t) => (
                    <option key={t.id} value={t.id} className="bg-[#0f1117]">
                      {t.full_name} // {t.abbreviation}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-orange font-bold">↓</div>
              </div>

              {selectedTeam && (
                <div className="flex items-center gap-4 bg-orange/5 border-l-4 border-orange px-5 py-4">
                  <div className="text-4xl font-heading font-900 text-orange/20 italic select-none">
                    {selectedTeam.abbreviation}
                  </div>
                  <div>
                    <p className="font-heading font-800 text-xl uppercase italic tracking-tighter leading-none">{selectedTeam.full_name}</p>
                    <p className="text-muted text-[10px] font-heading font-bold uppercase tracking-widest mt-1 italic">
                      {selectedTeam.conference}ERN CONFERENCE · {selectedTeam.division} DIVISION
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface/40 backdrop-blur-xl border border-white/5 p-6 skew-2k">
            <div className="unskew-2k space-y-4">
              <label className="section-title block">Temporal Alignment</label>
              <div className="relative">
                <select
                  value={eraId}
                  onChange={(e) => setEraId(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 px-4 py-4 text-sm font-heading font-800 uppercase italic tracking-widest text-white focus:outline-none focus:border-orange appearance-none cursor-pointer pr-10"
                >
                  {ERAS.map((era) => (
                    <option key={era.id} value={era.id} className="bg-[#0f1117]">{era.label.toUpperCase()}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-orange font-bold">↓</div>
              </div>
              {selectedEraObj && (
                <p className="text-muted text-[10px] font-heading font-bold uppercase tracking-[0.2em] italic px-1">{selectedEraObj.description}</p>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full btn-primary py-6 text-xl italic group"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            INITIALIZE CAREER MODE
            <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
          </span>
        </button>
      </div>
    </div>
  );
}

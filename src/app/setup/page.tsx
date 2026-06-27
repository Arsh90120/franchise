'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/lib/game-state';
import { NBA_TEAMS, ERAS } from '@/lib/nba-teams';
import { generateSchedule } from '@/lib/schedule';
import { parseBBGM } from '@/lib/bbgm-parser';
import { clsx } from 'clsx';

const BBGM_ERA_FILE: Record<string, string> = {
  'classic-1985':  '/data/NBA.Legacy.1985.v3.0.beta.json',
  'jordan-1996':   '/data/1995-96.NBA.Roster.json',
  'dynasty-2015':  '/data/2015-16.NBA.Roster.json',
  'dynasty-2016':  '/data/2016-17.NBA.Roster.json',
  'dynasty-2018':  '/data/2018-19.NBA.Roster.json',
  'bubble-2020':   '/data/2020-21.NBA.Roster.json',
  'modern-2022':   '/data/2022-23.NBA.Roster.json',
  'modern-2024':   '/data/2024-25.NBA.Roster.json',
  'current-2025':  '/data/2025-26.NBA.Roster 3.json',
};

export default function SetupPage() {
  const router = useRouter();
  const { isSetupComplete, setTeam, setEra, setGmName, initLeague } = useGameState();

  const [teamId, setTeamId] = useState<number>(14);
  const [eraId, setEraId] = useState<string>('modern-2024');
  const [gmNameInput, setGmNameInput] = useState('');
  const [conference, setConference] = useState<'All' | 'East' | 'West'>('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSetupComplete) router.push('/');
  }, [isSetupComplete, router]);

  const filteredTeams = conference === 'All'
    ? NBA_TEAMS
    : NBA_TEAMS.filter((t) => t.conference === conference);

  async function handleStart() {
    const team = NBA_TEAMS.find((t) => t.id === teamId);
    const era = ERAS.find((e) => e.id === eraId);
    if (!team || !era) return;

    setLoading(true);
    try {
      const bbgmFile = BBGM_ERA_FILE[eraId];
      if (!bbgmFile) throw new Error('Era file not found');

      const res = await fetch(bbgmFile);
      const json = await res.json();
      const roster = parseBBGM(json);

      const players = roster.players.map((p, idx) => ({
        id: idx + 1,
        name: p.name,
        pos: p.pos,
        tid: p.tid,
        ovr: p.ovr,
        pot: p.ratings[0].pot,
        hgt: p.hgt,
        weight: p.weight,
        ratings: p.ratings[0],
        stats: {
          gamesPlayed: 0, points: 0, rebounds: 0, assists: 0, steals: 0,
          blocks: 0, turnovers: 0, minutes: 0, fga: 0, fgm: 0, fta: 0,
          ftm: 0, threePa: 0, threePm: 0
        },
        contract: {
          amount: typeof p.contract.amount === 'string' ? parseFloat(p.contract.amount) : p.contract.amount,
          exp: typeof p.contract.exp === 'string' ? parseInt(p.contract.exp) : p.contract.exp,
        },
        stamina: 100,
        injury: { gamesRemaining: 0, type: null }
      }));

      setTeam(team.id);
      setEra(era.id, era.season);
      setGmName(gmNameInput.trim() || 'GM');

      const schedule = generateSchedule(team.id);
      initLeague(players, NBA_TEAMS, schedule);

      router.push('/');
    } catch (err) {
      console.error(err);
      alert('Failed to initialize league. Please try again.');
    } finally {
      setLoading(false);
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
            {ERAS.filter(e => BBGM_ERA_FILE[e.id]).map((era) => (
              <option key={era.id} value={era.id}>{era.label}</option>
            ))}
          </select>
          {selectedEraObj && (
            <p className="text-muted text-xs font-body">{selectedEraObj.description}</p>
          )}
        </div>

        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full btn-primary py-4 text-base rounded-xl disabled:opacity-50"
        >
          {loading ? 'Initializing League...' : 'Start Franchise →'}
        </button>
      </div>
    </div>
  );
}

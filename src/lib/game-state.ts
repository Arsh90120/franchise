import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NBATeam } from './nba-teams';
import type { ScheduledGame } from './schedule';
import type { BBGMPlayer } from './bbgm-parser';

export interface GameState {
  selectedTeam: NBATeam | null;
  selectedEra: string;
  selectedSeason: number;
  isSetupComplete: boolean;
  wins: number;
  losses: number;
  week: number;
  gmName: string;
  schedule: ScheduledGame[];
  currentGameIndex: number;
  leaguePlayers: BBGMPlayer[];

  setTeam: (team: NBATeam) => void;
  setEra: (eraId: string, season: number) => void;
  setGmName: (name: string) => void;
  setLeaguePlayers: (players: BBGMPlayer[]) => void;
  completeSetup: (schedule: ScheduledGame[], players?: BBGMPlayer[]) => void;
  resetGame: () => void;
  recordGameResult: (gameIndex: number, result: 'W' | 'L', score: string) => void;
  advanceGame: () => void;
  tradePlayers: (myPlayerIds: number[], cpuPlayerIds: number[], myTid: number, cpuTid: number) => void;
  signFreeAgent: (playerId: number, teamId: number) => void;
}

export const useGameState = create<GameState>()(
  persist(
    (set) => ({
      selectedTeam: null,
      selectedEra: 'modern',
      selectedSeason: 2024,
      isSetupComplete: false,
      wins: 0,
      losses: 0,
      week: 1,
      gmName: 'GM',
      schedule: [],
      currentGameIndex: 0,
      leaguePlayers: [],

      setTeam: (team) => set({ selectedTeam: team }),
      setEra: (eraId, season) => set({ selectedEra: eraId, selectedSeason: season }),
      setGmName: (name) => set({ gmName: name }),
      setLeaguePlayers: (players) => set({ leaguePlayers: players }),
      completeSetup: (schedule, players) =>
        set((s) => ({
          isSetupComplete: true,
          schedule,
          currentGameIndex: 0,
          leaguePlayers: players ?? s.leaguePlayers,
        })),
      resetGame: () =>
        set({
          selectedTeam: null,
          selectedEra: 'modern',
          selectedSeason: 2024,
          isSetupComplete: false,
          wins: 0,
          losses: 0,
          week: 1,
          schedule: [],
          currentGameIndex: 0,
          leaguePlayers: [],
        }),
      recordGameResult: (gameIndex, result, score) =>
        set((s) => ({
          schedule: s.schedule.map((g, i) =>
            i === gameIndex ? { ...g, result, score } : g
          ),
          wins: result === 'W' ? s.wins + 1 : s.wins,
          losses: result === 'L' ? s.losses + 1 : s.losses,
        })),
      advanceGame: () =>
        set((s) => ({
          currentGameIndex: Math.min(s.currentGameIndex + 1, 81),
          week: s.schedule[Math.min(s.currentGameIndex + 1, 81)]?.week ?? s.week,
        })),
      tradePlayers: (myPlayerIds, cpuPlayerIds, myTid, cpuTid) =>
        set((s) => ({
          leaguePlayers: s.leaguePlayers.map((p) => {
            if (myPlayerIds.includes(p.id)) return { ...p, tid: cpuTid };
            if (cpuPlayerIds.includes(p.id)) return { ...p, tid: myTid };
            return p;
          }),
        })),
      signFreeAgent: (playerId, teamId) =>
        set((s) => ({
          leaguePlayers: s.leaguePlayers.map((p) =>
            p.id === playerId ? { ...p, tid: teamId } : p
          ),
        })),
    }),
    { name: 'franchise-game-state' }
  )
);

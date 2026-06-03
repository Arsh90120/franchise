import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NBATeam } from './nba-teams';
import type { ScheduledGame } from './schedule';

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

  setTeam: (team: NBATeam) => void;
  setEra: (eraId: string, season: number) => void;
  setGmName: (name: string) => void;
  completeSetup: (schedule: ScheduledGame[]) => void;
  resetGame: () => void;
  recordGameResult: (gameIndex: number, result: 'W' | 'L', score: string) => void;
  advanceGame: () => void;
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

      setTeam: (team) => set({ selectedTeam: team }),
      setEra: (eraId, season) => set({ selectedEra: eraId, selectedSeason: season }),
      setGmName: (name) => set({ gmName: name }),
      completeSetup: (schedule) => set({ isSetupComplete: true, schedule, currentGameIndex: 0 }),
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
    }),
    { name: 'franchise-game-state' }
  )
);

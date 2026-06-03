import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NBATeam } from './nba-teams';

export interface GameState {
  selectedTeam: NBATeam | null;
  selectedEra: string;
  selectedSeason: number;
  isSetupComplete: boolean;
  wins: number;
  losses: number;
  week: number;
  gmName: string;
  setTeam: (team: NBATeam) => void;
  setEra: (eraId: string, season: number) => void;
  setGmName: (name: string) => void;
  completeSetup: () => void;
  resetGame: () => void;
  recordWin: () => void;
  recordLoss: () => void;
  advanceWeek: () => void;
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

      setTeam: (team) => set({ selectedTeam: team }),
      setEra: (eraId, season) => set({ selectedEra: eraId, selectedSeason: season }),
      setGmName: (name) => set({ gmName: name }),
      completeSetup: () => set({ isSetupComplete: true }),
      resetGame: () =>
        set({
          selectedTeam: null,
          selectedEra: 'modern',
          selectedSeason: 2024,
          isSetupComplete: false,
          wins: 0,
          losses: 0,
          week: 1,
        }),
      recordWin: () => set((s) => ({ wins: s.wins + 1 })),
      recordLoss: () => set((s) => ({ losses: s.losses + 1 })),
      advanceWeek: () => set((s) => ({ week: s.week + 1 })),
    }),
    {
      name: 'franchise-game-state',
      // persists everything to localStorage automatically
    }
  )
);

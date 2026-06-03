import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FranchiseTeam {
  id: number;
  name: string;
  abbreviation: string;
  city: string;
  conference: string;
  division: string;
}

export interface GameState {
  selectedTeam: FranchiseTeam | null;
  season: number;
  week: number;
  wins: number;
  losses: number;
  capSpace: number;
  isSetupComplete: boolean;

  setSelectedTeam: (team: FranchiseTeam) => void;
  setSeason: (season: number) => void;
  advanceWeek: () => void;
  recordWin: () => void;
  recordLoss: () => void;
  completeSetup: () => void;
  resetGame: () => void;
}

export const useGameState = create<GameState>()(
  persist(
    (set) => ({
      selectedTeam: null,
      season: 2025,
      week: 1,
      wins: 0,
      losses: 0,
      capSpace: 12000000,
      isSetupComplete: false,

      setSelectedTeam: (team) => set({ selectedTeam: team }),
      setSeason: (season) => set({ season }),
      advanceWeek: () => set((s) => ({ week: s.week + 1 })),
      recordWin: () => set((s) => ({ wins: s.wins + 1 })),
      recordLoss: () => set((s) => ({ losses: s.losses + 1 })),
      completeSetup: () => set({ isSetupComplete: true }),
      resetGame: () =>
        set({
          selectedTeam: null,
          season: 2025,
          week: 1,
          wins: 0,
          losses: 0,
          capSpace: 12000000,
          isSetupComplete: false,
        }),
    }),
    { name: 'franchise-game-state' }
  )
);

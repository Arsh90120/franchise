import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NBATeam } from './nba-teams';
import type { ScheduledGame } from './schedule';
import type { BBGMRatings } from './bbgm-parser';

export interface Player {
  id: number;
  name: string;
  pos: string;
  tid: number;
  ovr: number;
  pot: number;
  hgt: number;
  weight: number;
  ratings: BBGMRatings;
  stats: {
    gamesPlayed: number;
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    turnovers: number;
    minutes: number;
    fga: number;
    fgm: number;
    fta: number;
    ftm: number;
    threePa: number;
    threePm: number;
  };
  contract: {
    amount: number;
    exp: number;
  };
  stamina: number; // 0-100
  injury: {
    gamesRemaining: number;
    type: string | null;
  };
}

export interface TeamRotation {
  starters: number[]; // player IDs
  bench: number[];    // player IDs
  minutes: Record<number, number>; // player ID -> preferred minutes
}

export interface GameState {
  // Metadata
  selectedTeamId: number | null;
  selectedEra: string;
  selectedSeason: number;
  isSetupComplete: boolean;
  gmName: string;

  // League Data
  players: Record<number, Player>;
  teams: Record<number, NBATeam>;
  rotations: Record<number, TeamRotation>;

  // Progress
  wins: number;
  losses: number;
  week: number;
  schedule: ScheduledGame[];
  currentGameIndex: number;

  // Actions
  setTeam: (teamId: number) => void;
  setEra: (eraId: string, season: number) => void;
  setGmName: (name: string) => void;
  initLeague: (players: Player[], teams: NBATeam[], schedule: ScheduledGame[]) => void;
  resetGame: () => void;
  recordGameResult: (gameIndex: number, result: 'W' | 'L', score: string, playerStatsUpdate: Record<number, Partial<Player['stats']>>) => void;
  advanceGame: () => void;
  updateRotation: (teamId: number, rotation: TeamRotation) => void;
  updatePlayer: (playerId: number, updates: Partial<Player>) => void;
}

export const useGameState = create<GameState>()(
  persist(
    (set) => ({
      selectedTeamId: null,
      selectedEra: 'modern-2024',
      selectedSeason: 2024,
      isSetupComplete: false,
      gmName: 'GM',

      players: {},
      teams: {},
      rotations: {},

      wins: 0,
      losses: 0,
      week: 1,
      schedule: [],
      currentGameIndex: 0,

      setTeam: (teamId) => set({ selectedTeamId: teamId }),
      setEra: (eraId, season) => set({ selectedEra: eraId, selectedSeason: season }),
      setGmName: (name) => set({ gmName: name }),

      initLeague: (playersList, teamsList, schedule) => {
        const playersMap: Record<number, Player> = {};
        playersList.forEach(p => playersMap[p.id] = p);

        const teamsMap: Record<number, NBATeam> = {};
        teamsList.forEach(t => teamsMap[t.id] = t);

        const rotationsMap: Record<number, TeamRotation> = {};
        teamsList.forEach(t => {
          const teamPlayers = playersList
            .filter(p => p.tid === (t.id - 1)) // BBGM uses 0-indexed tids
            .sort((a, b) => b.ovr - a.ovr);

          rotationsMap[t.id] = {
            starters: teamPlayers.slice(0, 5).map(p => p.id),
            bench: teamPlayers.slice(5, 12).map(p => p.id),
            minutes: teamPlayers.reduce((acc, p, idx) => {
              acc[p.id] = idx < 5 ? 32 : (idx < 10 ? 15 : 0);
              return acc;
            }, {} as Record<number, number>)
          };
        });

        set({
          players: playersMap,
          teams: teamsMap,
          rotations: rotationsMap,
          schedule,
          isSetupComplete: true,
          currentGameIndex: 0,
          wins: 0,
          losses: 0,
          week: 1,
        });
      },

      resetGame: () =>
        set({
          selectedTeamId: null,
          selectedEra: 'modern-2024',
          selectedSeason: 2024,
          isSetupComplete: false,
          gmName: 'GM',
          players: {},
          teams: {},
          rotations: {},
          wins: 0,
          losses: 0,
          week: 1,
          schedule: [],
          currentGameIndex: 0,
        }),

      recordGameResult: (gameIndex, result, score, playerStatsUpdate) =>
        set((s) => {
          const newPlayers = { ...s.players };
          Object.entries(playerStatsUpdate).forEach(([pid, update]) => {
            const id = Number(pid);
            if (newPlayers[id]) {
              const currentStats = newPlayers[id].stats;
              newPlayers[id] = {
                ...newPlayers[id],
                stats: {
                  gamesPlayed: currentStats.gamesPlayed + (update.gamesPlayed || 0),
                  points: currentStats.points + (update.points || 0),
                  rebounds: currentStats.rebounds + (update.rebounds || 0),
                  assists: currentStats.assists + (update.assists || 0),
                  steals: currentStats.steals + (update.steals || 0),
                  blocks: currentStats.blocks + (update.blocks || 0),
                  turnovers: currentStats.turnovers + (update.turnovers || 0),
                  minutes: currentStats.minutes + (update.minutes || 0),
                  fga: currentStats.fga + (update.fga || 0),
                  fgm: currentStats.fgm + (update.fgm || 0),
                  fta: currentStats.fta + (update.fta || 0),
                  ftm: currentStats.ftm + (update.ftm || 0),
                  threePa: currentStats.threePa + (update.threePa || 0),
                  threePm: currentStats.threePm + (update.threePm || 0),
                }
              };
            }
          });

          return {
            players: newPlayers,
            schedule: s.schedule.map((g, i) =>
              i === gameIndex ? { ...g, result, score } : g
            ),
            wins: result === 'W' ? s.wins + 1 : s.wins,
            losses: result === 'L' ? s.losses + 1 : s.losses,
          };
        }),

      advanceGame: () =>
        set((s) => ({
          currentGameIndex: Math.min(s.currentGameIndex + 1, 81),
          week: s.schedule[Math.min(s.currentGameIndex + 1, 81)]?.week ?? s.week,
        })),

      updateRotation: (teamId, rotation) =>
        set((s) => ({
          rotations: { ...s.rotations, [teamId]: rotation }
        })),

      updatePlayer: (playerId, updates) =>
        set((s) => ({
          players: {
            ...s.players,
            [playerId]: { ...s.players[playerId], ...updates }
          }
        })),
    }),
    { name: 'franchise-game-state' }
  )
);

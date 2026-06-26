import type { Player, TeamRotation } from './game-state';

export interface PlayerGameLine {
  playerId: number;
  name: string;
  position: string;
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fgm: number;
  fga: number;
  ftm: number;
  fta: number;
  threePm: number;
  threePa: number;
}

export interface TeamBoxScore {
  teamId: number;
  teamName: string;
  abbreviation: string;
  players: PlayerGameLine[];
  totalPoints: number;
  totalRebounds: number;
  totalAssists: number;
  totalSteals: number;
  totalBlocks: number;
  totalTurnovers: number;
  fgm: number;
  fga: number;
  ftm: number;
  fta: number;
  threePm: number;
  threePa: number;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
}

export interface PBPEvent {
  time: string; // e.g. "11:42"
  quarter: number;
  score: string; // e.g. "2-0"
  description: string;
  type: 'shot' | 'rebound' | 'turnover' | 'foul' | 'substitution' | 'timeout' | 'period';
  playerId?: number;
  teamId?: number;
}

export interface BoxScoreResult {
  homeTeam: TeamBoxScore;
  awayTeam: TeamBoxScore;
  winner: 'home' | 'away';
  isOT: boolean;
  gameDate: string;
  pbp: PBPEvent[];
}

export class SimulationEngine {
  private homeRoster: Player[];
  private awayRoster: Player[];
  private homeRotation: TeamRotation;
  private awayRotation: TeamRotation;

  private homeStats: Record<number, PlayerGameLine>;
  private awayStats: Record<number, PlayerGameLine>;

  private homeScore = 0;
  private awayScore = 0;
  private qScores: { home: number[]; away: number[] } = { home: [0,0,0,0], away: [0,0,0,0] };

  private pbp: PBPEvent[] = [];
  private currentTime = 720; // 12 mins in seconds
  private currentQuarter = 1;

  private homeOnCourt: number[] = [];
  private awayOnCourt: number[] = [];

  constructor(
    homeRoster: Player[],
    homeRotation: TeamRotation,
    awayRoster: Player[],
    awayRotation: TeamRotation
  ) {
    this.homeRoster = homeRoster;
    this.homeRotation = homeRotation;
    this.awayRoster = awayRoster;
    this.awayRotation = awayRotation;

    this.homeStats = this.initStats(homeRoster);
    this.awayStats = this.initStats(awayRoster);

    this.homeOnCourt = [...homeRotation.starters];
    this.awayOnCourt = [...awayRotation.starters];
  }

  private initStats(roster: Player[]): Record<number, PlayerGameLine> {
    const stats: Record<number, PlayerGameLine> = {};
    roster.forEach(p => {
      stats[p.id] = {
        playerId: p.id,
        name: p.name,
        position: p.pos,
        minutes: 0, points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0,
        fgm: 0, fga: 0, ftm: 0, fta: 0, threePm: 0, threePa: 0
      };
    });
    return stats;
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  private addPBP(description: string, type: PBPEvent['type'], playerId?: number, teamId?: number) {
    this.pbp.push({
      time: this.formatTime(this.currentTime),
      quarter: this.currentQuarter,
      score: `${this.homeScore}-${this.awayScore}`,
      description,
      type,
      playerId,
      teamId
    });
  }

  public runFullGame(): BoxScoreResult {
    for (this.currentQuarter = 1; this.currentQuarter <= 4; this.currentQuarter++) {
      this.currentTime = 720;
      this.addPBP(`Start of the ${this.currentQuarter}${this.getQuarterSuffix(this.currentQuarter)} Quarter`, 'period');

      while (this.currentTime > 0) {
        this.simulatePossession();
        const elapsed = Math.floor(Math.random() * 14) + 10; // 10-24 seconds per possession
        this.currentTime = Math.max(0, this.currentTime - elapsed);

        // Update minutes
        this.homeOnCourt.forEach(id => {
            if (this.homeStats[id]) this.homeStats[id].minutes += elapsed / 60;
        });
        this.awayOnCourt.forEach(id => {
            if (this.awayStats[id]) this.awayStats[id].minutes += elapsed / 60;
        });

        this.handleSubs();
      }

      this.qScores.home[this.currentQuarter-1] = this.homeScore - this.qScores.home.reduce((a,b)=>a+b, 0);
      this.qScores.away[this.currentQuarter-1] = this.awayScore - this.qScores.away.reduce((a,b)=>a+b, 0);
    }

    let isOT = false;
    if (this.homeScore === this.awayScore) {
        isOT = true;
        const homeOT = Math.floor(Math.random() * 15);
        const awayOT = Math.floor(Math.random() * 15) + (homeOT === Math.floor(Math.random() * 15) ? 1 : 0);
        this.homeScore += homeOT;
        this.awayScore += awayOT;
        this.addPBP("Game went to OT!", "period");
    }

    return {
      homeTeam: this.finalizeTeamBox(this.homeRoster[0].tid + 1, "Home Team", "HOME", this.homeStats, this.homeScore, this.qScores.home),
      awayTeam: this.finalizeTeamBox(this.awayRoster[0].tid + 1, "Away Team", "AWAY", this.awayStats, this.awayScore, this.qScores.away),
      winner: this.homeScore > this.awayScore ? 'home' : 'away',
      isOT,
      gameDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      pbp: this.pbp
    };
  }

  private getQuarterSuffix(q: number): string {
    if (q === 1) return 'st';
    if (q === 2) return 'nd';
    if (q === 3) return 'rd';
    return 'th';
  }

  private handleSubs() {
      // Basic substitution logic can be added here
  }

  private simulatePossession() {
    const isHomePossession = Math.random() > 0.5;
    const offenseTeamId = isHomePossession ? 1 : 2;
    const offenseOnCourt = isHomePossession ? this.homeOnCourt : this.awayOnCourt;
    const defenseOnCourt = isHomePossession ? this.awayOnCourt : this.homeOnCourt;
    const offenseStats = isHomePossession ? this.homeStats : this.awayStats;
    const defenseStats = isHomePossession ? this.awayStats : this.homeStats;
    const offenseRoster = isHomePossession ? this.homeRoster : this.awayRoster;

    const shooterId = offenseOnCourt[Math.floor(Math.random() * offenseOnCourt.length)];
    const shooter = offenseRoster.find(p => p.id === shooterId);
    if (!shooter) return;

    const isThree = Math.random() < (shooter.ratings.tp / 100);
    offenseStats[shooterId][isThree ? 'threePa' : 'fga']++;
    offenseStats[shooterId].fga++;

    const shotRoll = Math.random() * 100;
    const shotThreshold = isThree ? (shooter.ratings.tp * 0.4) : (shooter.ratings.fg * 0.45 + 10);

    if (shotRoll < shotThreshold) {
      const pts = isThree ? 3 : 2;
      offenseStats[shooterId].points += pts;
      offenseStats[shooterId].fgm++;
      if (isThree) offenseStats[shooterId].threePm++;

      if (isHomePossession) this.homeScore += pts;
      else this.awayScore += pts;

      this.addPBP(`${shooter.name} makes a ${isThree ? '3-pointer' : 'jumper'}`, 'shot', shooterId, offenseTeamId);
    } else {
      this.addPBP(`${shooter.name} misses a ${isThree ? '3-pointer' : 'jumper'}`, 'shot', shooterId, offenseTeamId);

      const rebounderId = [...offenseOnCourt, ...defenseOnCourt][Math.floor(Math.random() * 10)];
      const isDefensive = defenseOnCourt.includes(rebounderId);
      const rebounderStats = isDefensive ? defenseStats : offenseStats;
      if (rebounderStats[rebounderId]) rebounderStats[rebounderId].rebounds++;

      const rebounderName = [...this.homeRoster, ...this.awayRoster].find(p => p.id === rebounderId)?.name;
      this.addPBP(`${rebounderName} grabs the ${isDefensive ? 'defensive' : 'offensive'} rebound`, 'rebound', rebounderId);
    }
  }

  private finalizeTeamBox(id: number, name: string, abbr: string, stats: Record<number, PlayerGameLine>, totalPoints: number, quarters: number[]): TeamBoxScore {
    const players = Object.values(stats);
    return {
      teamId: id,
      teamName: name,
      abbreviation: abbr,
      players,
      totalPoints,
      totalRebounds: players.reduce((a, b) => a + b.rebounds, 0),
      totalAssists: players.reduce((a, b) => a + b.assists, 0),
      totalSteals: players.reduce((a, b) => a + b.steals, 0),
      totalBlocks: players.reduce((a, b) => a + b.blocks, 0),
      totalTurnovers: players.reduce((a, b) => a + b.turnovers, 0),
      fgm: players.reduce((a, b) => a + b.fgm, 0),
      fga: players.reduce((a, b) => a + b.fga, 0),
      ftm: players.reduce((a, b) => a + b.ftm, 0),
      fta: players.reduce((a, b) => a + b.fta, 0),
      threePm: players.reduce((a, b) => a + b.threePm, 0),
      threePa: players.reduce((a, b) => a + b.threePa, 0),
      q1: quarters[0],
      q2: quarters[1],
      q3: quarters[2],
      q4: quarters[3],
    };
  }
}

export function simGame(
  homeRoster: Player[],
  homeRotation: TeamRotation,
  awayRoster: Player[],
  awayRotation: TeamRotation
): BoxScoreResult {
  const engine = new SimulationEngine(homeRoster, homeRotation, awayRoster, awayRotation);
  return engine.runFullGame();
}

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

export interface BoxScoreResult {
  homeTeam: TeamBoxScore;
  awayTeam: TeamBoxScore;
  winner: 'home' | 'away';
  isOT: boolean;
  gameDate: string;
}

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randInt(min: number, max: number): number {
  return Math.floor(rand(min, max + 1));
}

function gaussianRand(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function varyStats(base: number, variance: number = 0.35): number {
  const result = base + gaussianRand() * base * variance;
  return Math.max(0, result);
}

interface RosterPlayer {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
}

interface SeasonAvg {
  player_id: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  turnover: number;
  fg_pct: number;
  ft_pct: number;
  fg3_pct: number;
  min: string;
}

function parseMinutes(minStr: string): number {
  if (!minStr) return 20;
  const parts = minStr.split(':');
  return parseInt(parts[0]) || 20;
}

function simPlayerGame(player: RosterPlayer, avg: SeasonAvg | undefined, isStarter: boolean): PlayerGameLine {
  const basePts = avg?.pts ?? (isStarter ? rand(8, 14) : rand(3, 8));
  const baseReb = avg?.reb ?? (isStarter ? rand(3, 6) : rand(1, 3));
  const baseAst = avg?.ast ?? (isStarter ? rand(2, 5) : rand(0.5, 2));
  const baseStl = avg?.stl ?? rand(0.3, 1.2);
  const baseBlk = avg?.blk ?? rand(0.1, 0.8);
  const baseTo = avg?.turnover ?? rand(0.8, 2.5);
  const baseMins = avg?.min ? parseMinutes(avg.min) : (isStarter ? rand(24, 36) : rand(10, 22));
  const fgPct = avg?.fg_pct ?? 0.45;
  const ftPct = avg?.ft_pct ?? 0.75;
  const fg3Pct = avg?.fg3_pct ?? 0.35;

  const minutes = Math.round(varyStats(baseMins, 0.15));
  const points = Math.round(varyStats(basePts, 0.4));
  const rebounds = Math.round(varyStats(baseReb, 0.4));
  const assists = Math.round(varyStats(baseAst, 0.45));
  const steals = Math.round(varyStats(baseStl, 0.5));
  const blocks = Math.round(varyStats(baseBlk, 0.5));
  const turnovers = Math.round(varyStats(baseTo, 0.4));

  const threePa = randInt(1, Math.max(1, Math.round(points * 0.3)));
  const threePm = Math.round(threePa * varyStats(fg3Pct, 0.2));
  const ftaCalc = randInt(0, Math.round(points * 0.25));
  const ftm = Math.round(ftaCalc * varyStats(ftPct, 0.15));
  const remainingPts = Math.max(0, points - threePm * 3 - ftm);
  const fgm2 = Math.round(remainingPts / 2);
  const fgm = fgm2 + threePm;
  const fga = Math.max(fgm, Math.round(fgm / Math.max(0.2, varyStats(fgPct, 0.1))));

  return {
    playerId: player.id,
    name: `${player.first_name} ${player.last_name}`,
    position: player.position || 'F',
    minutes,
    points,
    rebounds,
    assists,
    steals,
    blocks,
    turnovers,
    fgm,
    fga,
    ftm,
    fta: ftaCalc,
    threePm,
    threePa,
  };
}

function sumTeam(players: PlayerGameLine[], teamId: number, teamName: string, abbreviation: string): TeamBoxScore {
  const totals = players.reduce(
    (acc, p) => ({
      points: acc.points + p.points,
      rebounds: acc.rebounds + p.rebounds,
      assists: acc.assists + p.assists,
      steals: acc.steals + p.steals,
      blocks: acc.blocks + p.blocks,
      turnovers: acc.turnovers + p.turnovers,
      fgm: acc.fgm + p.fgm,
      fga: acc.fga + p.fga,
      ftm: acc.ftm + p.ftm,
      fta: acc.fta + p.fta,
      threePm: acc.threePm + p.threePm,
      threePa: acc.threePa + p.threePa,
    }),
    { points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0, fgm: 0, fga: 0, ftm: 0, fta: 0, threePm: 0, threePa: 0 }
  );

  const totalPts = totals.points;
  const q1 = randInt(Math.floor(totalPts * 0.22), Math.floor(totalPts * 0.28));
  const q2 = randInt(Math.floor(totalPts * 0.22), Math.floor(totalPts * 0.28));
  const q3 = randInt(Math.floor(totalPts * 0.22), Math.floor(totalPts * 0.28));
  const q4 = totalPts - q1 - q2 - q3;

  return {
    teamId,
    teamName,
    abbreviation,
    players,
    totalPoints: totalPts,
    totalRebounds: totals.rebounds,
    totalAssists: totals.assists,
    totalSteals: totals.steals,
    totalBlocks: totals.blocks,
    totalTurnovers: totals.turnovers,
    fgm: totals.fgm,
    fga: totals.fga,
    ftm: totals.ftm,
    fta: totals.fta,
    threePm: totals.threePm,
    threePa: totals.threePa,
    q1,
    q2,
    q3,
    q4: Math.max(0, q4),
  };
}

export function simGame(
  homePlayers: RosterPlayer[],
  homeAverages: SeasonAvg[],
  homeTeamId: number,
  homeTeamName: string,
  homeAbbr: string,
  awayPlayers: RosterPlayer[],
  awayAverages: SeasonAvg[],
  awayTeamId: number,
  awayTeamName: string,
  awayAbbr: string
): BoxScoreResult {
  const getAvg = (avgs: SeasonAvg[], id: number) => avgs.find((a) => a.player_id === id);

  const homeSorted = [...homePlayers].slice(0, 10);
  const awaySorted = [...awayPlayers].slice(0, 10);

  const homeLines = homeSorted.map((p, i) => simPlayerGame(p, getAvg(homeAverages, p.id), i < 5));
  const awayLines = awaySorted.map((p, i) => simPlayerGame(p, getAvg(awayAverages, p.id), i < 5));

  const homeBox = sumTeam(homeLines, homeTeamId, homeTeamName, homeAbbr);
  const awayBox = sumTeam(awayLines, awayTeamId, awayTeamName, awayAbbr);

  let isOT = false;
  if (homeBox.totalPoints === awayBox.totalPoints) {
    const otHome = randInt(2, 12);
    const otAway = randInt(2, 12);
    homeBox.totalPoints += otHome;
    awayBox.totalPoints += otAway;
    isOT = true;
  }

  return {
    homeTeam: homeBox,
    awayTeam: awayBox,
    winner: homeBox.totalPoints > awayBox.totalPoints ? 'home' : 'away',
    isOT,
    gameDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };
}

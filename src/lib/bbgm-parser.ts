// BBGM JSON parser — converts raw BBGM roster files into typed player objects

export interface BBGMRatings {
  hgt: number; stre: number; spd: number; jmp: number; endu: number;
  ins: number;  dnk: number; ft: number;  fg: number;  tp: number;
  blk: number; stl: number; drb: number; pss: number; reb: number;
  pot: number;
}

export interface BBGMPlayer {
  name: string;
  pos: string;
  tid: number;
  hgt: number;
  weight: number;
  born: { year: number; loc: string };
  contract: { amount: string | number; exp: string | number };
  college: string;
  imgURL: string;
  ratings: BBGMRatings[];
  skills: string[];
  ovr: number;
}

export interface BBGMRoster {
  startingSeason: number;
  players: BBGMPlayer[];
}

/**
 * Weighted OVR formula inspired by BBGM's own calculation.
 * Weights vary by position but this general formula works well across all.
 */
export function calcOvr(r: BBGMRatings, pos: string): number {
  const isGuard = pos.startsWith('G') || pos === 'PG' || pos === 'SG';
  const isCenter = pos === 'C';

  if (isGuard) {
    return Math.round(
      r.spd * 0.10 + r.drb * 0.10 + r.pss * 0.12 + r.fg * 0.12 +
      r.tp  * 0.14 + r.ft  * 0.06 + r.stl * 0.10 + r.endu * 0.08 +
      r.jmp * 0.06 + r.ins * 0.06 + r.stre * 0.06
    );
  } else if (isCenter) {
    return Math.round(
      r.ins  * 0.14 + r.reb  * 0.14 + r.stre * 0.10 + r.hgt  * 0.12 +
      r.blk  * 0.12 + r.endu * 0.08 + r.ft   * 0.06 + r.dnk  * 0.08 +
      r.fg   * 0.06 + r.drb  * 0.04 + r.pss  * 0.06
    );
  } else {
    // Forward
    return Math.round(
      r.fg   * 0.10 + r.tp   * 0.10 + r.reb  * 0.10 + r.ins  * 0.10 +
      r.stre * 0.08 + r.endu * 0.08 + r.spd  * 0.08 + r.jmp  * 0.08 +
      r.blk  * 0.08 + r.stl  * 0.08 + r.drb  * 0.06 + r.pss  * 0.06
    );
  }
}

export function parseBBGM(json: { startingSeason: number; players: Record<string, unknown>[] }): BBGMRoster {
  const players: BBGMPlayer[] = json.players
    .filter((p) => (p.tid as number) >= 0) // exclude free agents tid=-1
    .map((p) => {
      const rawRatings = (p.ratings as BBGMRatings[])?.[0] ?? {} as BBGMRatings;
      const pos = (p.pos as string) ?? 'F';
      const ovr = calcOvr(rawRatings, pos);
      return {
        name: p.name as string,
        pos,
        tid: p.tid as number,
        hgt: p.hgt as number,
        weight: p.weight as number,
        born: (p.born as { year: number; loc: string }) ?? { year: 1970, loc: '' },
        contract: (p.contract as { amount: string | number; exp: string | number }) ?? { amount: 0, exp: 0 },
        college: (p.college as string) ?? '',
        imgURL: (p.imgURL as string) ?? '',
        ratings: [rawRatings],
        skills: (p.skills as string[]) ?? [],
        ovr,
      };
    });

  return { startingSeason: json.startingSeason, players };
}

/**
 * BBGM tid → team abbreviation map.
 * BBGM uses a consistent 0-29 ordering across all files that matches
 * the standard 30-team NBA list ordered by city name (BBGM default).
 */
export const BBGM_TID_TO_ABB: Record<number, string> = {
  0:  'ATL', 1:  'BOS', 2:  'BKN', 3:  'CHA', 4:  'CHI',
  5:  'CLE', 6:  'DAL', 7:  'DEN', 8:  'DET', 9:  'GSW',
  10: 'HOU', 11: 'IND', 12: 'LAC', 13: 'LAL', 14: 'MEM',
  15: 'MIA', 16: 'MIL', 17: 'MIN', 18: 'NOP', 19: 'NYK',
  20: 'OKC', 21: 'ORL', 22: 'PHI', 23: 'PHX', 24: 'POR',
  25: 'SAC', 26: 'SAS', 27: 'TOR', 28: 'UTA', 29: 'WAS',
};

export interface NBATeam {
  id: number;
  full_name: string;
  abbreviation: string;
  city: string;
  name: string;
  conference: string;
  division: string;
}

export const NBA_TEAMS: NBATeam[] = [
  { id: 1, full_name: 'Atlanta Hawks', abbreviation: 'ATL', city: 'Atlanta', name: 'Hawks', conference: 'East', division: 'Southeast' },
  { id: 2, full_name: 'Boston Celtics', abbreviation: 'BOS', city: 'Boston', name: 'Celtics', conference: 'East', division: 'Atlantic' },
  { id: 3, full_name: 'Brooklyn Nets', abbreviation: 'BKN', city: 'Brooklyn', name: 'Nets', conference: 'East', division: 'Atlantic' },
  { id: 4, full_name: 'Charlotte Hornets', abbreviation: 'CHA', city: 'Charlotte', name: 'Hornets', conference: 'East', division: 'Southeast' },
  { id: 5, full_name: 'Chicago Bulls', abbreviation: 'CHI', city: 'Chicago', name: 'Bulls', conference: 'East', division: 'Central' },
  { id: 6, full_name: 'Cleveland Cavaliers', abbreviation: 'CLE', city: 'Cleveland', name: 'Cavaliers', conference: 'East', division: 'Central' },
  { id: 7, full_name: 'Dallas Mavericks', abbreviation: 'DAL', city: 'Dallas', name: 'Mavericks', conference: 'West', division: 'Southwest' },
  { id: 8, full_name: 'Denver Nuggets', abbreviation: 'DEN', city: 'Denver', name: 'Nuggets', conference: 'West', division: 'Northwest' },
  { id: 9, full_name: 'Detroit Pistons', abbreviation: 'DET', city: 'Detroit', name: 'Pistons', conference: 'East', division: 'Central' },
  { id: 10, full_name: 'Golden State Warriors', abbreviation: 'GSW', city: 'Golden State', name: 'Warriors', conference: 'West', division: 'Pacific' },
  { id: 11, full_name: 'Houston Rockets', abbreviation: 'HOU', city: 'Houston', name: 'Rockets', conference: 'West', division: 'Southwest' },
  { id: 12, full_name: 'Indiana Pacers', abbreviation: 'IND', city: 'Indiana', name: 'Pacers', conference: 'East', division: 'Central' },
  { id: 13, full_name: 'LA Clippers', abbreviation: 'LAC', city: 'LA', name: 'Clippers', conference: 'West', division: 'Pacific' },
  { id: 14, full_name: 'Los Angeles Lakers', abbreviation: 'LAL', city: 'Los Angeles', name: 'Lakers', conference: 'West', division: 'Pacific' },
  { id: 15, full_name: 'Memphis Grizzlies', abbreviation: 'MEM', city: 'Memphis', name: 'Grizzlies', conference: 'West', division: 'Southwest' },
  { id: 16, full_name: 'Miami Heat', abbreviation: 'MIA', city: 'Miami', name: 'Heat', conference: 'East', division: 'Southeast' },
  { id: 17, full_name: 'Milwaukee Bucks', abbreviation: 'MIL', city: 'Milwaukee', name: 'Bucks', conference: 'East', division: 'Central' },
  { id: 18, full_name: 'Minnesota Timberwolves', abbreviation: 'MIN', city: 'Minnesota', name: 'Timberwolves', conference: 'West', division: 'Northwest' },
  { id: 19, full_name: 'New Orleans Pelicans', abbreviation: 'NOP', city: 'New Orleans', name: 'Pelicans', conference: 'West', division: 'Southwest' },
  { id: 20, full_name: 'New York Knicks', abbreviation: 'NYK', city: 'New York', name: 'Knicks', conference: 'East', division: 'Atlantic' },
  { id: 21, full_name: 'Oklahoma City Thunder', abbreviation: 'OKC', city: 'Oklahoma City', name: 'Thunder', conference: 'West', division: 'Northwest' },
  { id: 22, full_name: 'Orlando Magic', abbreviation: 'ORL', city: 'Orlando', name: 'Magic', conference: 'East', division: 'Southeast' },
  { id: 23, full_name: 'Philadelphia 76ers', abbreviation: 'PHI', city: 'Philadelphia', name: '76ers', conference: 'East', division: 'Atlantic' },
  { id: 24, full_name: 'Phoenix Suns', abbreviation: 'PHX', city: 'Phoenix', name: 'Suns', conference: 'West', division: 'Pacific' },
  { id: 25, full_name: 'Portland Trail Blazers', abbreviation: 'POR', city: 'Portland', name: 'Trail Blazers', conference: 'West', division: 'Northwest' },
  { id: 26, full_name: 'Sacramento Kings', abbreviation: 'SAC', city: 'Sacramento', name: 'Kings', conference: 'West', division: 'Pacific' },
  { id: 27, full_name: 'San Antonio Spurs', abbreviation: 'SAS', city: 'San Antonio', name: 'Spurs', conference: 'West', division: 'Southwest' },
  { id: 28, full_name: 'Toronto Raptors', abbreviation: 'TOR', city: 'Toronto', name: 'Raptors', conference: 'East', division: 'Atlantic' },
  { id: 29, full_name: 'Utah Jazz', abbreviation: 'UTA', city: 'Utah', name: 'Jazz', conference: 'West', division: 'Northwest' },
  { id: 30, full_name: 'Washington Wizards', abbreviation: 'WAS', city: 'Washington', name: 'Wizards', conference: 'East', division: 'Southeast' },
];

export const ERAS = [
  { id: 'modern', label: 'Modern (2024-25)', season: 2024, description: 'Current rosters and stats' },
  { id: 'dynasty', label: 'Dynasty Era (2015-16)', season: 2015, description: 'Warriors dynasty begins' },
  { id: 'lebron', label: 'LeBron Era (2012-13)', season: 2012, description: 'Heat Big 3 peak' },
  { id: 'kobe', label: 'Kobe Era (2008-09)', season: 2008, description: 'Kobe\'s back-to-back championships' },
];

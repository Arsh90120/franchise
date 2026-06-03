export interface PlayerData {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  jersey_number: string;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  fg_pct: number;
  fg3_pct: number;
  ft_pct: number;
  min: string;
}

// keyed by BDL team ID
export const ROSTER_DATA: Record<number, PlayerData[]> = {
  // Atlanta Hawks
  1: [
    { id: 1001, first_name: 'Trae', last_name: 'Young', position: 'G', jersey_number: '11', pts: 25.7, reb: 3.3, ast: 11.2, stl: 1.1, blk: 0.1, fg_pct: 0.431, fg3_pct: 0.355, ft_pct: 0.882, min: '34.1' },
    { id: 1002, first_name: 'Dejounte', last_name: 'Murray', position: 'G', jersey_number: '5', pts: 21.4, reb: 5.3, ast: 6.1, stl: 1.5, blk: 0.3, fg_pct: 0.455, fg3_pct: 0.351, ft_pct: 0.791, min: '35.6' },
    { id: 1003, first_name: 'Clint', last_name: 'Capela', position: 'C', jersey_number: '15', pts: 10.8, reb: 11.5, ast: 1.0, stl: 0.9, blk: 1.8, fg_pct: 0.581, fg3_pct: 0.0, ft_pct: 0.592, min: '30.2' },
    { id: 1004, first_name: 'De\'Andre', last_name: 'Hunter', position: 'F', jersey_number: '12', pts: 16.2, reb: 4.1, ast: 1.9, stl: 0.9, blk: 0.5, fg_pct: 0.473, fg3_pct: 0.381, ft_pct: 0.801, min: '30.4' },
    { id: 1005, first_name: 'Bogdan', last_name: 'Bogdanovic', position: 'G-F', jersey_number: '13', pts: 14.8, reb: 3.0, ast: 3.1, stl: 0.8, blk: 0.2, fg_pct: 0.444, fg3_pct: 0.378, ft_pct: 0.833, min: '27.3' },
    { id: 1006, first_name: 'Saddiq', last_name: 'Bey', position: 'F', jersey_number: '41', pts: 9.2, reb: 3.8, ast: 1.2, stl: 0.7, blk: 0.3, fg_pct: 0.432, fg3_pct: 0.361, ft_pct: 0.780, min: '22.1' },
  ],
  // Boston Celtics
  2: [
    { id: 2001, first_name: 'Jayson', last_name: 'Tatum', position: 'F', jersey_number: '0', pts: 26.9, reb: 8.1, ast: 4.9, stl: 1.0, blk: 0.6, fg_pct: 0.469, fg3_pct: 0.378, ft_pct: 0.845, min: '35.9' },
    { id: 2002, first_name: 'Jaylen', last_name: 'Brown', position: 'G-F', jersey_number: '7', pts: 23.0, reb: 5.5, ast: 3.6, stl: 1.1, blk: 0.5, fg_pct: 0.494, fg3_pct: 0.354, ft_pct: 0.720, min: '33.7' },
    { id: 2003, first_name: 'Kristaps', last_name: 'Porzingis', position: 'C', jersey_number: '8', pts: 20.1, reb: 7.2, ast: 2.0, stl: 0.7, blk: 1.9, fg_pct: 0.523, fg3_pct: 0.381, ft_pct: 0.851, min: '29.8' },
    { id: 2004, first_name: 'Jrue', last_name: 'Holiday', position: 'G', jersey_number: '4', pts: 12.5, reb: 5.4, ast: 8.0, stl: 1.6, blk: 0.8, fg_pct: 0.484, fg3_pct: 0.378, ft_pct: 0.743, min: '33.1' },
    { id: 2005, first_name: 'Al', last_name: 'Horford', position: 'C', jersey_number: '42', pts: 9.2, reb: 6.4, ast: 2.6, stl: 0.7, blk: 1.1, fg_pct: 0.512, fg3_pct: 0.409, ft_pct: 0.795, min: '26.2' },
    { id: 2006, first_name: 'Derrick', last_name: 'White', position: 'G', jersey_number: '9', pts: 15.2, reb: 4.2, ast: 5.2, stl: 1.0, blk: 1.1, fg_pct: 0.469, fg3_pct: 0.385, ft_pct: 0.822, min: '31.3' },
  ],
  // Brooklyn Nets
  3: [
    { id: 3001, first_name: 'Mikal', last_name: 'Bridges', position: 'F', jersey_number: '1', pts: 26.1, reb: 4.5, ast: 3.6, stl: 1.0, blk: 0.5, fg_pct: 0.487, fg3_pct: 0.378, ft_pct: 0.851, min: '36.2' },
    { id: 3002, first_name: 'Cameron', last_name: 'Thomas', position: 'G', jersey_number: '24', pts: 22.1, reb: 3.0, ast: 2.7, stl: 0.8, blk: 0.2, fg_pct: 0.441, fg3_pct: 0.361, ft_pct: 0.871, min: '33.0' },
    { id: 3003, first_name: 'Nic', last_name: 'Claxton', position: 'C', jersey_number: '33', pts: 12.2, reb: 9.1, ast: 2.5, stl: 0.8, blk: 2.5, fg_pct: 0.621, fg3_pct: 0.0, ft_pct: 0.581, min: '28.4' },
    { id: 3004, first_name: 'Ben', last_name: 'Simmons', position: 'G-F', jersey_number: '10', pts: 7.0, reb: 6.1, ast: 5.5, stl: 1.2, blk: 0.5, fg_pct: 0.571, fg3_pct: 0.0, ft_pct: 0.521, min: '22.0' },
    { id: 3005, first_name: 'Dennis', last_name: 'Schroder', position: 'G', jersey_number: '17', pts: 14.8, reb: 3.2, ast: 6.1, stl: 1.0, blk: 0.2, fg_pct: 0.451, fg3_pct: 0.381, ft_pct: 0.821, min: '28.1' },
  ],
  // Charlotte Hornets
  4: [
    { id: 4001, first_name: 'LaMelo', last_name: 'Ball', position: 'G', jersey_number: '1', pts: 23.9, reb: 5.1, ast: 8.0, stl: 1.5, blk: 0.4, fg_pct: 0.433, fg3_pct: 0.354, ft_pct: 0.802, min: '34.5' },
    { id: 4002, first_name: 'Brandon', last_name: 'Miller', position: 'F', jersey_number: '24', pts: 17.3, reb: 4.2, ast: 2.4, stl: 0.9, blk: 0.5, fg_pct: 0.447, fg3_pct: 0.371, ft_pct: 0.791, min: '30.1' },
    { id: 4003, first_name: 'Miles', last_name: 'Bridges', position: 'F', jersey_number: '0', pts: 21.0, reb: 6.8, ast: 3.4, stl: 0.9, blk: 0.5, fg_pct: 0.469, fg3_pct: 0.361, ft_pct: 0.751, min: '31.8' },
    { id: 4004, first_name: 'Mark', last_name: 'Williams', position: 'C', jersey_number: '5', pts: 11.0, reb: 9.5, ast: 1.2, stl: 0.5, blk: 2.1, fg_pct: 0.621, fg3_pct: 0.0, ft_pct: 0.651, min: '26.2' },
    { id: 4005, first_name: 'Grant', last_name: 'Williams', position: 'F', jersey_number: '2', pts: 9.4, reb: 3.8, ast: 1.9, stl: 0.7, blk: 0.5, fg_pct: 0.452, fg3_pct: 0.388, ft_pct: 0.782, min: '24.0' },
  ],
  // Chicago Bulls
  5: [
    { id: 5001, first_name: 'DeMar', last_name: 'DeRozan', position: 'G-F', jersey_number: '11', pts: 24.5, reb: 4.6, ast: 5.1, stl: 0.9, blk: 0.3, fg_pct: 0.507, fg3_pct: 0.232, ft_pct: 0.861, min: '34.9' },
    { id: 5002, first_name: 'Zach', last_name: 'LaVine', position: 'G', jersey_number: '8', pts: 22.0, reb: 4.5, ast: 4.2, stl: 0.7, blk: 0.4, fg_pct: 0.463, fg3_pct: 0.374, ft_pct: 0.821, min: '32.5' },
    { id: 5003, first_name: 'Nikola', last_name: 'Vucevic', position: 'C', jersey_number: '9', pts: 18.0, reb: 10.8, ast: 3.3, stl: 0.8, blk: 0.9, fg_pct: 0.499, fg3_pct: 0.341, ft_pct: 0.812, min: '31.5' },
    { id: 5004, first_name: 'Coby', last_name: 'White', position: 'G', jersey_number: '0', pts: 19.1, reb: 4.2, ast: 4.9, stl: 1.0, blk: 0.3, fg_pct: 0.467, fg3_pct: 0.384, ft_pct: 0.812, min: '31.4' },
    { id: 5005, first_name: 'Patrick', last_name: 'Williams', position: 'F', jersey_number: '44', pts: 13.0, reb: 5.1, ast: 2.1, stl: 0.8, blk: 0.7, fg_pct: 0.471, fg3_pct: 0.371, ft_pct: 0.771, min: '28.1' },
  ],
  // Cleveland Cavaliers
  6: [
    { id: 6001, first_name: 'Donovan', last_name: 'Mitchell', position: 'G', jersey_number: '45', pts: 26.6, reb: 5.1, ast: 6.1, stl: 1.6, blk: 0.3, fg_pct: 0.486, fg3_pct: 0.380, ft_pct: 0.869, min: '35.4' },
    { id: 6002, first_name: 'Darius', last_name: 'Garland', position: 'G', jersey_number: '10', pts: 21.6, reb: 2.9, ast: 7.8, stl: 1.3, blk: 0.2, fg_pct: 0.458, fg3_pct: 0.384, ft_pct: 0.872, min: '34.2' },
    { id: 6003, first_name: 'Evan', last_name: 'Mobley', position: 'C', jersey_number: '4', pts: 15.7, reb: 9.4, ast: 2.9, stl: 1.3, blk: 1.7, fg_pct: 0.553, fg3_pct: 0.341, ft_pct: 0.712, min: '32.0' },
    { id: 6004, first_name: 'Jarrett', last_name: 'Allen', position: 'C', jersey_number: '31', pts: 13.7, reb: 10.5, ast: 1.8, stl: 0.8, blk: 1.3, fg_pct: 0.631, fg3_pct: 0.0, ft_pct: 0.712, min: '28.5' },
    { id: 6005, first_name: 'Max', last_name: 'Strus', position: 'G-F', jersey_number: '1', pts: 13.4, reb: 4.8, ast: 3.3, stl: 0.8, blk: 0.3, fg_pct: 0.441, fg3_pct: 0.391, ft_pct: 0.831, min: '29.1' },
  ],
  // Dallas Mavericks
  7: [
    { id: 7001, first_name: 'Luka', last_name: 'Doncic', position: 'G', jersey_number: '77', pts: 33.9, reb: 9.2, ast: 9.8, stl: 1.4, blk: 0.5, fg_pct: 0.487, fg3_pct: 0.382, ft_pct: 0.786, min: '37.5' },
    { id: 7002, first_name: 'Kyrie', last_name: 'Irving', position: 'G', jersey_number: '11', pts: 25.6, reb: 5.0, ast: 5.2, stl: 1.3, blk: 0.5, fg_pct: 0.492, fg3_pct: 0.399, ft_pct: 0.893, min: '35.1' },
    { id: 7003, first_name: 'PJ', last_name: 'Washington', position: 'F', jersey_number: '25', pts: 13.3, reb: 6.2, ast: 2.4, stl: 1.1, blk: 0.9, fg_pct: 0.481, fg3_pct: 0.377, ft_pct: 0.721, min: '29.4' },
    { id: 7004, first_name: 'Daniel', last_name: 'Gafford', position: 'C', jersey_number: '12', pts: 9.7, reb: 6.3, ast: 1.1, stl: 0.6, blk: 2.3, fg_pct: 0.721, fg3_pct: 0.0, ft_pct: 0.641, min: '22.2' },
    { id: 7005, first_name: 'Derrick', last_name: 'Jones Jr.', position: 'F', jersey_number: '55', pts: 9.0, reb: 4.3, ast: 1.5, stl: 1.0, blk: 0.7, fg_pct: 0.511, fg3_pct: 0.371, ft_pct: 0.741, min: '24.5' },
  ],
  // Denver Nuggets
  8: [
    { id: 8001, first_name: 'Nikola', last_name: 'Jokic', position: 'C', jersey_number: '15', pts: 26.4, reb: 12.4, ast: 9.0, stl: 1.4, blk: 0.9, fg_pct: 0.583, fg3_pct: 0.356, ft_pct: 0.814, min: '34.6' },
    { id: 8002, first_name: 'Jamal', last_name: 'Murray', position: 'G', jersey_number: '27', pts: 21.2, reb: 4.1, ast: 6.5, stl: 0.9, blk: 0.3, fg_pct: 0.489, fg3_pct: 0.403, ft_pct: 0.872, min: '33.3' },
    { id: 8003, first_name: 'Michael', last_name: 'Porter Jr.', position: 'F', jersey_number: '1', pts: 17.0, reb: 7.2, ast: 2.1, stl: 0.5, blk: 0.5, fg_pct: 0.491, fg3_pct: 0.416, ft_pct: 0.841, min: '29.8' },
    { id: 8004, first_name: 'Aaron', last_name: 'Gordon', position: 'F', jersey_number: '50', pts: 13.9, reb: 6.6, ast: 3.5, stl: 0.8, blk: 0.6, fg_pct: 0.538, fg3_pct: 0.291, ft_pct: 0.729, min: '28.6' },
    { id: 8005, first_name: 'Kentavious', last_name: 'Caldwell-Pope', position: 'G', jersey_number: '5', pts: 11.5, reb: 3.4, ast: 2.5, stl: 1.0, blk: 0.3, fg_pct: 0.472, fg3_pct: 0.412, ft_pct: 0.831, min: '28.3' },
  ],
  // Detroit Pistons
  9: [
    { id: 9001, first_name: 'Cade', last_name: 'Cunningham', position: 'G', jersey_number: '2', pts: 22.7, reb: 4.3, ast: 7.5, stl: 1.1, blk: 0.5, fg_pct: 0.441, fg3_pct: 0.332, ft_pct: 0.831, min: '34.0' },
    { id: 9002, first_name: 'Jalen', last_name: 'Duren', position: 'C', jersey_number: '0', pts: 13.5, reb: 13.0, ast: 1.7, stl: 0.9, blk: 1.4, fg_pct: 0.601, fg3_pct: 0.0, ft_pct: 0.571, min: '28.1' },
    { id: 9003, first_name: 'Bojan', last_name: 'Bogdanovic', position: 'F', jersey_number: '44', pts: 14.5, reb: 3.1, ast: 1.5, stl: 0.6, blk: 0.2, fg_pct: 0.451, fg3_pct: 0.401, ft_pct: 0.861, min: '26.0' },
    { id: 9004, first_name: 'Killian', last_name: 'Hayes', position: 'G', jersey_number: '7', pts: 9.0, reb: 3.8, ast: 5.2, stl: 1.1, blk: 0.4, fg_pct: 0.411, fg3_pct: 0.321, ft_pct: 0.731, min: '24.5' },
    { id: 9005, first_name: 'Isaiah', last_name: 'Stewart', position: 'C', jersey_number: '28', pts: 11.7, reb: 8.5, ast: 2.2, stl: 0.8, blk: 0.8, fg_pct: 0.481, fg3_pct: 0.351, ft_pct: 0.671, min: '26.3' },
  ],
  // Golden State Warriors
  10: [
    { id: 10001, first_name: 'Stephen', last_name: 'Curry', position: 'G', jersey_number: '30', pts: 26.4, reb: 4.5, ast: 5.1, stl: 0.9, blk: 0.4, fg_pct: 0.450, fg3_pct: 0.408, ft_pct: 0.915, min: '32.7' },
    { id: 10002, first_name: 'Klay', last_name: 'Thompson', position: 'G', jersey_number: '11', pts: 17.9, reb: 3.3, ast: 2.3, stl: 0.7, blk: 0.5, fg_pct: 0.436, fg3_pct: 0.381, ft_pct: 0.871, min: '31.8' },
    { id: 10003, first_name: 'Draymond', last_name: 'Green', position: 'F', jersey_number: '23', pts: 8.5, reb: 7.2, ast: 6.8, stl: 1.0, blk: 0.8, fg_pct: 0.499, fg3_pct: 0.321, ft_pct: 0.731, min: '30.0' },
    { id: 10004, first_name: 'Andrew', last_name: 'Wiggins', position: 'F', jersey_number: '22', pts: 13.7, reb: 5.0, ast: 1.9, stl: 1.0, blk: 0.6, fg_pct: 0.441, fg3_pct: 0.351, ft_pct: 0.711, min: '28.4' },
    { id: 10005, first_name: 'Chris', last_name: 'Paul', position: 'G', jersey_number: '3', pts: 9.2, reb: 3.9, ast: 7.7, stl: 1.1, blk: 0.2, fg_pct: 0.451, fg3_pct: 0.332, ft_pct: 0.861, min: '27.0' },
  ],
  // Houston Rockets
  11: [
    { id: 11001, first_name: 'Alperen', last_name: 'Sengun', position: 'C', jersey_number: '28', pts: 21.1, reb: 9.3, ast: 3.9, stl: 0.9, blk: 1.5, fg_pct: 0.554, fg3_pct: 0.0, ft_pct: 0.741, min: '30.4' },
    { id: 11002, first_name: 'Jalen', last_name: 'Green', position: 'G', jersey_number: '4', pts: 22.0, reb: 4.3, ast: 5.1, stl: 1.1, blk: 0.4, fg_pct: 0.441, fg3_pct: 0.371, ft_pct: 0.831, min: '32.5' },
    { id: 11003, first_name: 'Fred', last_name: 'VanVleet', position: 'G', jersey_number: '5', pts: 14.8, reb: 3.7, ast: 6.5, stl: 1.3, blk: 0.2, fg_pct: 0.401, fg3_pct: 0.341, ft_pct: 0.831, min: '32.0' },
    { id: 11004, first_name: 'Dillon', last_name: 'Brooks', position: 'F', jersey_number: '9', pts: 14.3, reb: 3.4, ast: 2.0, stl: 1.2, blk: 0.4, fg_pct: 0.421, fg3_pct: 0.361, ft_pct: 0.761, min: '28.2' },
    { id: 11005, first_name: 'Jabari', last_name: 'Smith Jr.', position: 'F', jersey_number: '10', pts: 12.7, reb: 6.7, ast: 1.4, stl: 0.9, blk: 0.8, fg_pct: 0.421, fg3_pct: 0.341, ft_pct: 0.761, min: '26.8' },
  ],
  // Indiana Pacers
  12: [
    { id: 12001, first_name: 'Tyrese', last_name: 'Haliburton', position: 'G', jersey_number: '0', pts: 20.1, reb: 3.9, ast: 10.9, stl: 1.4, blk: 0.4, fg_pct: 0.477, fg3_pct: 0.400, ft_pct: 0.852, min: '33.1' },
    { id: 12002, first_name: 'Pascal', last_name: 'Siakam', position: 'F', jersey_number: '43', pts: 21.3, reb: 7.8, ast: 3.8, stl: 1.0, blk: 0.7, fg_pct: 0.508, fg3_pct: 0.328, ft_pct: 0.721, min: '33.5' },
    { id: 12003, first_name: 'Myles', last_name: 'Turner', position: 'C', jersey_number: '33', pts: 13.2, reb: 6.4, ast: 1.7, stl: 0.7, blk: 2.4, fg_pct: 0.501, fg3_pct: 0.361, ft_pct: 0.791, min: '27.5' },
    { id: 12004, first_name: 'Bennedict', last_name: 'Mathurin', position: 'G-F', jersey_number: '00', pts: 16.5, reb: 4.2, ast: 1.6, stl: 0.7, blk: 0.4, fg_pct: 0.451, fg3_pct: 0.361, ft_pct: 0.771, min: '27.8' },
    { id: 12005, first_name: 'Andrew', last_name: 'Nembhard', position: 'G', jersey_number: '2', pts: 11.0, reb: 3.5, ast: 5.1, stl: 1.0, blk: 0.2, fg_pct: 0.481, fg3_pct: 0.388, ft_pct: 0.831, min: '28.0' },
  ],
  // LA Clippers
  13: [
    { id: 13001, first_name: 'Kawhi', last_name: 'Leonard', position: 'F', jersey_number: '2', pts: 23.7, reb: 6.1, ast: 3.6, stl: 1.6, blk: 0.9, fg_pct: 0.525, fg3_pct: 0.402, ft_pct: 0.881, min: '31.7' },
    { id: 13002, first_name: 'Paul', last_name: 'George', position: 'F', jersey_number: '13', pts: 22.6, reb: 5.2, ast: 3.8, stl: 1.5, blk: 0.4, fg_pct: 0.466, fg3_pct: 0.411, ft_pct: 0.851, min: '33.2' },
    { id: 13003, first_name: 'James', last_name: 'Harden', position: 'G', jersey_number: '1', pts: 16.6, reb: 5.1, ast: 8.5, stl: 1.1, blk: 0.5, fg_pct: 0.441, fg3_pct: 0.381, ft_pct: 0.861, min: '31.8' },
    { id: 13004, first_name: 'Ivica', last_name: 'Zubac', position: 'C', jersey_number: '40', pts: 10.5, reb: 9.0, ast: 1.2, stl: 0.5, blk: 1.2, fg_pct: 0.601, fg3_pct: 0.0, ft_pct: 0.701, min: '23.0' },
    { id: 13005, first_name: 'Norman', last_name: 'Powell', position: 'G', jersey_number: '24', pts: 17.0, reb: 2.9, ast: 2.1, stl: 0.9, blk: 0.4, fg_pct: 0.491, fg3_pct: 0.421, ft_pct: 0.811, min: '28.3' },
  ],
  // Los Angeles Lakers
  14: [
    { id: 14001, first_name: 'LeBron', last_name: 'James', position: 'F', jersey_number: '23', pts: 25.7, reb: 7.3, ast: 8.3, stl: 1.3, blk: 0.5, fg_pct: 0.540, fg3_pct: 0.410, ft_pct: 0.759, min: '35.3' },
    { id: 14002, first_name: 'Anthony', last_name: 'Davis', position: 'C', jersey_number: '3', pts: 24.7, reb: 12.6, ast: 3.5, stl: 1.2, blk: 2.3, fg_pct: 0.556, fg3_pct: 0.271, ft_pct: 0.759, min: '35.5' },
    { id: 14003, first_name: 'Austin', last_name: 'Reaves', position: 'G', jersey_number: '15', pts: 15.9, reb: 4.3, ast: 5.5, stl: 0.9, blk: 0.3, fg_pct: 0.491, fg3_pct: 0.404, ft_pct: 0.871, min: '30.5' },
    { id: 14004, first_name: "D\'Angelo", last_name: 'Russell', position: 'G', jersey_number: '1', pts: 18.0, reb: 3.1, ast: 6.1, stl: 0.9, blk: 0.2, fg_pct: 0.461, fg3_pct: 0.391, ft_pct: 0.831, min: '28.2' },
    { id: 14005, first_name: 'Rui', last_name: 'Hachimura', position: 'F', jersey_number: '28', pts: 13.2, reb: 4.4, ast: 1.5, stl: 0.5, blk: 0.5, fg_pct: 0.511, fg3_pct: 0.361, ft_pct: 0.781, min: '26.1' },
  ],
  // Memphis Grizzlies
  15: [
    { id: 15001, first_name: 'Ja', last_name: 'Morant', position: 'G', jersey_number: '12', pts: 25.1, reb: 5.6, ast: 8.1, stl: 1.1, blk: 0.5, fg_pct: 0.473, fg3_pct: 0.298, ft_pct: 0.762, min: '30.6' },
    { id: 15002, first_name: 'Jaren', last_name: 'Jackson Jr.', position: 'C', jersey_number: '13', pts: 22.0, reb: 5.9, ast: 2.6, stl: 1.0, blk: 2.9, fg_pct: 0.473, fg3_pct: 0.355, ft_pct: 0.772, min: '30.2' },
    { id: 15003, first_name: 'Desmond', last_name: 'Bane', position: 'G-F', jersey_number: '22', pts: 21.5, reb: 4.4, ast: 4.3, stl: 1.1, blk: 0.4, fg_pct: 0.469, fg3_pct: 0.421, ft_pct: 0.871, min: '32.5' },
    { id: 15004, first_name: 'Marcus', last_name: 'Smart', position: 'G', jersey_number: '36', pts: 12.0, reb: 3.5, ast: 5.8, stl: 1.5, blk: 0.4, fg_pct: 0.421, fg3_pct: 0.331, ft_pct: 0.771, min: '27.4' },
    { id: 15005, first_name: 'Brandon', last_name: 'Clarke', position: 'F', jersey_number: '15', pts: 10.2, reb: 5.1, ast: 1.2, stl: 0.5, blk: 1.2, fg_pct: 0.621, fg3_pct: 0.0, ft_pct: 0.721, min: '21.0' },
  ],
  // Miami Heat
  16: [
    { id: 16001, first_name: 'Jimmy', last_name: 'Butler', position: 'F', jersey_number: '22', pts: 20.8, reb: 5.3, ast: 5.0, stl: 1.3, blk: 0.4, fg_pct: 0.539, fg3_pct: 0.331, ft_pct: 0.871, min: '33.0' },
    { id: 16002, first_name: 'Bam', last_name: 'Adebayo', position: 'C', jersey_number: '13', pts: 19.3, reb: 10.4, ast: 3.3, stl: 1.1, blk: 0.9, fg_pct: 0.564, fg3_pct: 0.0, ft_pct: 0.741, min: '33.2' },
    { id: 16003, first_name: 'Tyler', last_name: 'Herro', position: 'G', jersey_number: '14', pts: 20.8, reb: 5.3, ast: 4.5, stl: 0.8, blk: 0.3, fg_pct: 0.449, fg3_pct: 0.371, ft_pct: 0.851, min: '32.3' },
    { id: 16004, first_name: 'Terry', last_name: 'Rozier', position: 'G', jersey_number: '2', pts: 15.9, reb: 3.7, ast: 4.2, stl: 1.1, blk: 0.3, fg_pct: 0.451, fg3_pct: 0.381, ft_pct: 0.831, min: '29.3' },
    { id: 16005, first_name: 'Kyle', last_name: 'Lowry', position: 'G', jersey_number: '7', pts: 7.4, reb: 4.4, ast: 5.5, stl: 1.0, blk: 0.3, fg_pct: 0.421, fg3_pct: 0.351, ft_pct: 0.791, min: '24.0' },
  ],
  // Milwaukee Bucks
  17: [
    { id: 17001, first_name: 'Giannis', last_name: 'Antetokounmpo', position: 'F', jersey_number: '34', pts: 30.4, reb: 11.5, ast: 6.5, stl: 1.2, blk: 1.1, fg_pct: 0.611, fg3_pct: 0.274, ft_pct: 0.641, min: '35.2' },
    { id: 17002, first_name: 'Damian', last_name: 'Lillard', position: 'G', jersey_number: '0', pts: 24.3, reb: 4.4, ast: 7.3, stl: 0.9, blk: 0.3, fg_pct: 0.451, fg3_pct: 0.378, ft_pct: 0.911, min: '35.0' },
    { id: 17003, first_name: 'Khris', last_name: 'Middleton', position: 'F', jersey_number: '22', pts: 15.1, reb: 5.2, ast: 4.9, stl: 0.9, blk: 0.3, fg_pct: 0.489, fg3_pct: 0.371, ft_pct: 0.881, min: '27.5' },
    { id: 17004, first_name: 'Brook', last_name: 'Lopez', position: 'C', jersey_number: '11', pts: 12.8, reb: 4.5, ast: 2.1, stl: 0.6, blk: 2.5, fg_pct: 0.506, fg3_pct: 0.381, ft_pct: 0.751, min: '26.2' },
    { id: 17005, first_name: 'Bobby', last_name: 'Portis', position: 'C', jersey_number: '9', pts: 14.3, reb: 8.1, ast: 1.5, stl: 0.7, blk: 0.4, fg_pct: 0.481, fg3_pct: 0.371, ft_pct: 0.801, min: '25.4' },
  ],
  // Minnesota Timberwolves
  18: [
    { id: 18001, first_name: 'Anthony', last_name: 'Edwards', position: 'G', jersey_number: '5', pts: 25.9, reb: 5.4, ast: 5.1, stl: 1.3, blk: 0.5, fg_pct: 0.462, fg3_pct: 0.358, ft_pct: 0.831, min: '34.9' },
    { id: 18002, first_name: 'Karl-Anthony', last_name: 'Towns', position: 'C', jersey_number: '32', pts: 22.3, reb: 8.5, ast: 3.0, stl: 0.7, blk: 0.7, fg_pct: 0.521, fg3_pct: 0.401, ft_pct: 0.831, min: '33.1' },
    { id: 18003, first_name: 'Rudy', last_name: 'Gobert', position: 'C', jersey_number: '27', pts: 14.0, reb: 12.9, ast: 1.7, stl: 0.9, blk: 2.1, fg_pct: 0.641, fg3_pct: 0.0, ft_pct: 0.621, min: '31.8' },
    { id: 18004, first_name: 'Mike', last_name: 'Conley', position: 'G', jersey_number: '10', pts: 10.9, reb: 3.3, ast: 6.5, stl: 1.1, blk: 0.2, fg_pct: 0.491, fg3_pct: 0.431, ft_pct: 0.861, min: '28.9' },
    { id: 18005, first_name: 'Jaden', last_name: 'McDaniels', position: 'F', jersey_number: '3', pts: 13.8, reb: 4.2, ast: 1.5, stl: 1.0, blk: 1.0, fg_pct: 0.461, fg3_pct: 0.381, ft_pct: 0.781, min: '27.5' },
  ],
  // New Orleans Pelicans
  19: [
    { id: 19001, first_name: 'Zion', last_name: 'Williamson', position: 'F', jersey_number: '1', pts: 22.9, reb: 5.8, ast: 4.7, stl: 1.1, blk: 0.6, fg_pct: 0.571, fg3_pct: 0.0, ft_pct: 0.701, min: '29.6' },
    { id: 19002, first_name: 'Brandon', last_name: 'Ingram', position: 'F', jersey_number: '14', pts: 24.3, reb: 5.5, ast: 5.3, stl: 0.8, blk: 0.5, fg_pct: 0.481, fg3_pct: 0.351, ft_pct: 0.861, min: '33.8' },
    { id: 19003, first_name: 'CJ', last_name: 'McCollum', position: 'G', jersey_number: '3', pts: 20.5, reb: 4.2, ast: 4.7, stl: 0.9, blk: 0.3, fg_pct: 0.471, fg3_pct: 0.391, ft_pct: 0.851, min: '31.9' },
    { id: 19004, first_name: 'Jonas', last_name: 'Valanciunas', position: 'C', jersey_number: '17', pts: 11.8, reb: 10.3, ast: 1.8, stl: 0.6, blk: 0.7, fg_pct: 0.561, fg3_pct: 0.0, ft_pct: 0.751, min: '24.5' },
    { id: 19005, first_name: 'Herb', last_name: 'Jones', position: 'F', jersey_number: '5', pts: 9.3, reb: 4.1, ast: 2.3, stl: 1.5, blk: 0.7, fg_pct: 0.471, fg3_pct: 0.341, ft_pct: 0.711, min: '27.3' },
  ],
  // New York Knicks
  20: [
    { id: 20001, first_name: 'Jalen', last_name: 'Brunson', position: 'G', jersey_number: '11', pts: 28.7, reb: 3.6, ast: 6.7, stl: 0.9, blk: 0.2, fg_pct: 0.494, fg3_pct: 0.401, ft_pct: 0.861, min: '35.2' },
    { id: 20002, first_name: 'Julius', last_name: 'Randle', position: 'F', jersey_number: '30', pts: 24.0, reb: 9.2, ast: 5.0, stl: 0.8, blk: 0.4, fg_pct: 0.461, fg3_pct: 0.301, ft_pct: 0.821, min: '33.5' },
    { id: 20003, first_name: 'OG', last_name: 'Anunoby', position: 'F', jersey_number: '8', pts: 14.7, reb: 4.4, ast: 1.7, stl: 1.5, blk: 0.7, fg_pct: 0.491, fg3_pct: 0.378, ft_pct: 0.711, min: '30.4' },
    { id: 20004, first_name: 'Josh', last_name: 'Hart', position: 'G-F', jersey_number: '3', pts: 9.4, reb: 8.3, ast: 3.3, stl: 1.0, blk: 0.3, fg_pct: 0.491, fg3_pct: 0.344, ft_pct: 0.711, min: '31.6' },
    { id: 20005, first_name: 'Isaiah', last_name: 'Hartenstein', position: 'C', jersey_number: '55', pts: 8.3, reb: 8.0, ast: 2.5, stl: 1.3, blk: 1.2, fg_pct: 0.641, fg3_pct: 0.0, ft_pct: 0.731, min: '25.0' },
  ],
  // Oklahoma City Thunder
  21: [
    { id: 21001, first_name: 'Shai', last_name: 'Gilgeous-Alexander', position: 'G', jersey_number: '2', pts: 30.1, reb: 5.5, ast: 6.2, stl: 2.0, blk: 1.0, fg_pct: 0.535, fg3_pct: 0.352, ft_pct: 0.874, min: '34.0' },
    { id: 21002, first_name: 'Jalen', last_name: 'Williams', position: 'G-F', jersey_number: '8', pts: 23.0, reb: 4.5, ast: 5.3, stl: 1.3, blk: 0.7, fg_pct: 0.511, fg3_pct: 0.358, ft_pct: 0.831, min: '33.0' },
    { id: 21003, first_name: 'Chet', last_name: 'Holmgren', position: 'C', jersey_number: '7', pts: 16.5, reb: 7.9, ast: 2.4, stl: 0.9, blk: 2.3, fg_pct: 0.531, fg3_pct: 0.379, ft_pct: 0.841, min: '29.5' },
    { id: 21004, first_name: 'Luguentz', last_name: 'Dort', position: 'G', jersey_number: '5', pts: 14.4, reb: 3.9, ast: 2.0, stl: 1.2, blk: 0.4, fg_pct: 0.451, fg3_pct: 0.371, ft_pct: 0.791, min: '28.0' },
    { id: 21005, first_name: 'Josh', last_name: 'Giddey', position: 'G-F', jersey_number: '3', pts: 12.0, reb: 6.4, ast: 6.4, stl: 0.9, blk: 0.4, fg_pct: 0.441, fg3_pct: 0.301, ft_pct: 0.681, min: '27.5' },
  ],
  // Orlando Magic
  22: [
    { id: 22001, first_name: 'Paolo', last_name: 'Banchero', position: 'F', jersey_number: '5', pts: 22.6, reb: 6.9, ast: 5.4, stl: 1.1, blk: 0.7, fg_pct: 0.463, fg3_pct: 0.321, ft_pct: 0.791, min: '33.4' },
    { id: 22002, first_name: 'Franz', last_name: 'Wagner', position: 'F', jersey_number: '22', pts: 19.5, reb: 4.4, ast: 3.8, stl: 1.1, blk: 0.5, fg_pct: 0.491, fg3_pct: 0.361, ft_pct: 0.791, min: '30.8' },
    { id: 22003, first_name: 'Wendell', last_name: 'Carter Jr.', position: 'C', jersey_number: '34', pts: 13.8, reb: 9.5, ast: 2.8, stl: 0.8, blk: 1.1, fg_pct: 0.541, fg3_pct: 0.0, ft_pct: 0.751, min: '28.5' },
    { id: 22004, first_name: 'Jalen', last_name: 'Suggs', position: 'G', jersey_number: '4', pts: 12.8, reb: 4.3, ast: 4.0, stl: 1.6, blk: 0.6, fg_pct: 0.441, fg3_pct: 0.361, ft_pct: 0.771, min: '27.1' },
    { id: 22005, first_name: 'Markelle', last_name: 'Fultz', position: 'G', jersey_number: '20', pts: 12.0, reb: 3.7, ast: 5.2, stl: 1.0, blk: 0.5, fg_pct: 0.491, fg3_pct: 0.281, ft_pct: 0.751, min: '26.5' },
  ],
  // Philadelphia 76ers
  23: [
    { id: 23001, first_name: 'Joel', last_name: 'Embiid', position: 'C', jersey_number: '21', pts: 34.7, reb: 11.0, ast: 5.6, stl: 1.2, blk: 1.7, fg_pct: 0.528, fg3_pct: 0.358, ft_pct: 0.871, min: '33.8' },
    { id: 23002, first_name: 'Tyrese', last_name: 'Maxey', position: 'G', jersey_number: '0', pts: 25.9, reb: 3.7, ast: 6.2, stl: 1.0, blk: 0.4, fg_pct: 0.483, fg3_pct: 0.371, ft_pct: 0.861, min: '35.5' },
    { id: 23003, first_name: 'Tobias', last_name: 'Harris', position: 'F', jersey_number: '12', pts: 17.2, reb: 6.4, ast: 3.6, stl: 0.8, blk: 0.5, fg_pct: 0.501, fg3_pct: 0.378, ft_pct: 0.801, min: '31.8' },
    { id: 23004, first_name: 'Kelly', last_name: 'Oubre Jr.', position: 'F', jersey_number: '1', pts: 15.4, reb: 5.0, ast: 1.6, stl: 1.1, blk: 0.5, fg_pct: 0.441, fg3_pct: 0.341, ft_pct: 0.751, min: '28.5' },
    { id: 23005, first_name: 'De\'Anthony', last_name: 'Melton', position: 'G', jersey_number: '8', pts: 8.4, reb: 4.0, ast: 3.7, stl: 1.5, blk: 0.4, fg_pct: 0.461, fg3_pct: 0.391, ft_pct: 0.791, min: '26.3' },
  ],
  // Phoenix Suns
  24: [
    { id: 24001, first_name: 'Kevin', last_name: 'Durant', position: 'F', jersey_number: '35', pts: 29.1, reb: 6.7, ast: 5.0, stl: 0.8, blk: 1.2, fg_pct: 0.528, fg3_pct: 0.419, ft_pct: 0.861, min: '37.2' },
    { id: 24002, first_name: 'Devin', last_name: 'Booker', position: 'G', jersey_number: '1', pts: 27.1, reb: 4.5, ast: 6.9, stl: 0.8, blk: 0.4, fg_pct: 0.493, fg3_pct: 0.386, ft_pct: 0.881, min: '34.8' },
    { id: 24003, first_name: 'Bradley', last_name: 'Beal', position: 'G', jersey_number: '3', pts: 18.2, reb: 4.4, ast: 5.0, stl: 0.9, blk: 0.3, fg_pct: 0.481, fg3_pct: 0.361, ft_pct: 0.811, min: '30.5' },
    { id: 24004, first_name: 'Jusuf', last_name: 'Nurkic', position: 'C', jersey_number: '20', pts: 10.1, reb: 10.4, ast: 2.9, stl: 0.8, blk: 0.9, fg_pct: 0.521, fg3_pct: 0.0, ft_pct: 0.651, min: '24.6' },
    { id: 24005, first_name: 'Eric', last_name: 'Gordon', position: 'G', jersey_number: '10', pts: 11.4, reb: 2.4, ast: 2.5, stl: 0.8, blk: 0.3, fg_pct: 0.451, fg3_pct: 0.401, ft_pct: 0.801, min: '24.5' },
  ],
  // Portland Trail Blazers
  25: [
    { id: 25001, first_name: 'Damian', last_name: 'Lillard', position: 'G', jersey_number: '0', pts: 32.2, reb: 4.8, ast: 7.3, stl: 0.9, blk: 0.4, fg_pct: 0.463, fg3_pct: 0.371, ft_pct: 0.921, min: '36.2' },
    { id: 25002, first_name: 'Anfernee', last_name: 'Simons', position: 'G', jersey_number: '24', pts: 21.1, reb: 2.8, ast: 4.6, stl: 0.8, blk: 0.3, fg_pct: 0.451, fg3_pct: 0.421, ft_pct: 0.861, min: '31.5' },
    { id: 25003, first_name: 'Jerami', last_name: 'Grant', position: 'F', jersey_number: '9', pts: 20.5, reb: 4.0, ast: 2.7, stl: 0.9, blk: 0.5, fg_pct: 0.481, fg3_pct: 0.381, ft_pct: 0.811, min: '30.0' },
    { id: 25004, first_name: 'Deandre', last_name: 'Ayton', position: 'C', jersey_number: '2', pts: 16.7, reb: 10.0, ast: 1.8, stl: 0.7, blk: 1.1, fg_pct: 0.591, fg3_pct: 0.0, ft_pct: 0.751, min: '28.3' },
    { id: 25005, first_name: 'Matisse', last_name: 'Thybulle', position: 'G-F', jersey_number: '4', pts: 8.0, reb: 3.1, ast: 1.5, stl: 1.9, blk: 0.7, fg_pct: 0.481, fg3_pct: 0.381, ft_pct: 0.711, min: '22.0' },
  ],
  // Sacramento Kings
  26: [
    { id: 26001, first_name: 'De\'Aaron', last_name: 'Fox', position: 'G', jersey_number: '5', pts: 26.6, reb: 4.4, ast: 6.1, stl: 1.5, blk: 0.4, fg_pct: 0.497, fg3_pct: 0.331, ft_pct: 0.781, min: '34.5' },
    { id: 26002, first_name: 'Domantas', last_name: 'Sabonis', position: 'C', jersey_number: '11', pts: 19.9, reb: 13.6, ast: 7.3, stl: 0.8, blk: 0.5, fg_pct: 0.581, fg3_pct: 0.0, ft_pct: 0.721, min: '33.2' },
    { id: 26003, first_name: 'Malik', last_name: 'Monk', position: 'G', jersey_number: '0', pts: 13.5, reb: 2.8, ast: 4.4, stl: 0.9, blk: 0.3, fg_pct: 0.459, fg3_pct: 0.398, ft_pct: 0.841, min: '25.5' },
    { id: 26004, first_name: 'Harrison', last_name: 'Barnes', position: 'F', jersey_number: '40', pts: 13.8, reb: 5.0, ast: 2.0, stl: 0.8, blk: 0.4, fg_pct: 0.491, fg3_pct: 0.381, ft_pct: 0.791, min: '27.8' },
    { id: 26005, first_name: 'Kevin', last_name: 'Huerter', position: 'G-F', jersey_number: '9', pts: 11.3, reb: 3.4, ast: 2.8, stl: 0.7, blk: 0.2, fg_pct: 0.471, fg3_pct: 0.411, ft_pct: 0.831, min: '24.3' },
  ],
  // San Antonio Spurs
  27: [
    { id: 27001, first_name: 'Victor', last_name: 'Wembanyama', position: 'C', jersey_number: '1', pts: 21.4, reb: 10.6, ast: 3.9, stl: 1.2, blk: 3.6, fg_pct: 0.463, fg3_pct: 0.325, ft_pct: 0.791, min: '29.7' },
    { id: 27002, first_name: 'Devin', last_name: 'Vassell', position: 'G', jersey_number: '24', pts: 19.5, reb: 4.2, ast: 4.3, stl: 1.1, blk: 0.4, fg_pct: 0.467, fg3_pct: 0.381, ft_pct: 0.821, min: '31.0' },
    { id: 27003, first_name: 'Keldon', last_name: 'Johnson', position: 'F', jersey_number: '3', pts: 16.0, reb: 5.2, ast: 2.5, stl: 1.0, blk: 0.4, fg_pct: 0.451, fg3_pct: 0.348, ft_pct: 0.781, min: '28.5' },
    { id: 27004, first_name: 'Tre', last_name: 'Jones', position: 'G', jersey_number: '33', pts: 10.5, reb: 3.1, ast: 5.8, stl: 1.2, blk: 0.2, fg_pct: 0.491, fg3_pct: 0.361, ft_pct: 0.781, min: '28.3' },
    { id: 27005, first_name: 'Jeremy', last_name: 'Sochan', position: 'F', jersey_number: '10', pts: 12.5, reb: 5.8, ast: 3.2, stl: 0.9, blk: 0.6, fg_pct: 0.471, fg3_pct: 0.281, ft_pct: 0.731, min: '27.0' },
  ],
  // Toronto Raptors
  28: [
    { id: 28001, first_name: 'Scottie', last_name: 'Barnes', position: 'F', jersey_number: '4', pts: 19.9, reb: 8.2, ast: 6.1, stl: 1.2, blk: 0.7, fg_pct: 0.497, fg3_pct: 0.341, ft_pct: 0.731, min: '35.0' },
    { id: 28002, first_name: 'RJ', last_name: 'Barrett', position: 'G-F', jersey_number: '9', pts: 21.8, reb: 5.9, ast: 3.3, stl: 0.9, blk: 0.4, fg_pct: 0.481, fg3_pct: 0.371, ft_pct: 0.791, min: '32.0' },
    { id: 28003, first_name: 'Immanuel', last_name: 'Quickley', position: 'G', jersey_number: '5', pts: 18.6, reb: 4.8, ast: 6.8, stl: 0.9, blk: 0.3, fg_pct: 0.451, fg3_pct: 0.381, ft_pct: 0.831, min: '31.5' },
    { id: 28004, first_name: 'Jakob', last_name: 'Poeltl', position: 'C', jersey_number: '25', pts: 12.0, reb: 9.5, ast: 2.8, stl: 0.6, blk: 1.2, fg_pct: 0.601, fg3_pct: 0.0, ft_pct: 0.641, min: '27.0' },
    { id: 28005, first_name: 'Gary', last_name: 'Trent Jr.', position: 'G', jersey_number: '33', pts: 14.4, reb: 2.7, ast: 1.8, stl: 1.0, blk: 0.3, fg_pct: 0.451, fg3_pct: 0.401, ft_pct: 0.841, min: '25.5' },
  ],
  // Utah Jazz
  29: [
    { id: 29001, first_name: 'Lauri', last_name: 'Markkanen', position: 'F', jersey_number: '23', pts: 23.2, reb: 8.4, ast: 1.9, stl: 0.6, blk: 0.7, fg_pct: 0.497, fg3_pct: 0.388, ft_pct: 0.871, min: '33.3' },
    { id: 29002, first_name: 'Jordan', last_name: 'Clarkson', position: 'G', jersey_number: '00', pts: 20.8, reb: 4.2, ast: 4.3, stl: 0.9, blk: 0.3, fg_pct: 0.451, fg3_pct: 0.371, ft_pct: 0.841, min: '28.4' },
    { id: 29003, first_name: 'Collin', last_name: 'Sexton', position: 'G', jersey_number: '2', pts: 14.3, reb: 2.5, ast: 4.3, stl: 0.9, blk: 0.2, fg_pct: 0.481, fg3_pct: 0.371, ft_pct: 0.841, min: '26.3' },
    { id: 29004, first_name: 'John', last_name: 'Collins', position: 'F', jersey_number: '20', pts: 13.5, reb: 7.4, ast: 1.7, stl: 0.7, blk: 0.7, fg_pct: 0.521, fg3_pct: 0.361, ft_pct: 0.791, min: '27.0' },
    { id: 29005, first_name: 'Walker', last_name: 'Kessler', position: 'C', jersey_number: '24', pts: 9.2, reb: 10.4, ast: 1.5, stl: 0.8, blk: 2.9, fg_pct: 0.641, fg3_pct: 0.0, ft_pct: 0.581, min: '26.8' },
  ],
  // Washington Wizards
  30: [
    { id: 30001, first_name: 'Kyle', last_name: 'Kuzma', position: 'F', jersey_number: '33', pts: 21.2, reb: 7.2, ast: 3.7, stl: 0.8, blk: 0.4, fg_pct: 0.441, fg3_pct: 0.341, ft_pct: 0.781, min: '33.5' },
    { id: 30002, first_name: 'Bradley', last_name: 'Beal', position: 'G', jersey_number: '3', pts: 23.2, reb: 4.4, ast: 5.4, stl: 1.0, blk: 0.3, fg_pct: 0.481, fg3_pct: 0.321, ft_pct: 0.821, min: '33.0' },
    { id: 30003, first_name: 'Kristaps', last_name: 'Porzingis', position: 'C', jersey_number: '6', pts: 22.1, reb: 8.4, ast: 2.2, stl: 0.7, blk: 1.5, fg_pct: 0.501, fg3_pct: 0.381, ft_pct: 0.841, min: '30.5' },
    { id: 30004, first_name: 'Tyus', last_name: 'Jones', position: 'G', jersey_number: '5', pts: 11.5, reb: 2.5, ast: 7.8, stl: 1.0, blk: 0.2, fg_pct: 0.491, fg3_pct: 0.391, ft_pct: 0.881, min: '28.0' },
    { id: 30005, first_name: 'Deni', last_name: 'Avdija', position: 'F', jersey_number: '8', pts: 14.7, reb: 6.0, ast: 3.5, stl: 1.2, blk: 0.6, fg_pct: 0.461, fg3_pct: 0.371, ft_pct: 0.751, min: '28.3' },
  ],
};

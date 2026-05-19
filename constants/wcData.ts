export interface Team {
  id: string;
  name: string;
  flag: string;
  group: string;
  confederation: string;
  ranking: number;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  stage: string;
  group?: string;
  date: string;
  venue: string;
  city: string;
}

export interface Group {
  id: string;
  name: string;
  teams: string[];
}

export const TEAMS: Record<string, Team> = {
  USA: { id: "USA", name: "USA", flag: "🇺🇸", group: "A", confederation: "CONCACAF", ranking: 11 },
  Panama: { id: "Panama", name: "Panama", flag: "🇵🇦", group: "A", confederation: "CONCACAF", ranking: 49 },
  Uruguay: { id: "Uruguay", name: "Uruguay", flag: "🇺🇾", group: "A", confederation: "CONMEBOL", ranking: 17 },
  Bosnia: { id: "Bosnia", name: "Bosnia Herz.", flag: "🇧🇦", group: "A", confederation: "UEFA", ranking: 61 },

  Mexico: { id: "Mexico", name: "Mexico", flag: "🇲🇽", group: "B", confederation: "CONCACAF", ranking: 14 },
  Jamaica: { id: "Jamaica", name: "Jamaica", flag: "🇯🇲", group: "B", confederation: "CONCACAF", ranking: 43 },
  Honduras: { id: "Honduras", name: "Honduras", flag: "🇭🇳", group: "B", confederation: "CONCACAF", ranking: 78 },
  Serbia: { id: "Serbia", name: "Serbia", flag: "🇷🇸", group: "B", confederation: "UEFA", ranking: 33 },

  Argentina: { id: "Argentina", name: "Argentina", flag: "🇦🇷", group: "C", confederation: "CONMEBOL", ranking: 1 },
  Chile: { id: "Chile", name: "Chile", flag: "🇨🇱", group: "C", confederation: "CONMEBOL", ranking: 29 },
  Peru: { id: "Peru", name: "Peru", flag: "🇵🇪", group: "C", confederation: "CONMEBOL", ranking: 57 },
  Romania: { id: "Romania", name: "Romania", flag: "🇷🇴", group: "C", confederation: "UEFA", ranking: 46 },

  Brazil: { id: "Brazil", name: "Brazil", flag: "🇧🇷", group: "D", confederation: "CONMEBOL", ranking: 5 },
  Colombia: { id: "Colombia", name: "Colombia", flag: "🇨🇴", group: "D", confederation: "CONMEBOL", ranking: 9 },
  Paraguay: { id: "Paraguay", name: "Paraguay", flag: "🇵🇾", group: "D", confederation: "CONMEBOL", ranking: 64 },
  Morocco: { id: "Morocco", name: "Morocco", flag: "🇲🇦", group: "D", confederation: "CAF", ranking: 14 },

  France: { id: "France", name: "France", flag: "🇫🇷", group: "E", confederation: "UEFA", ranking: 2 },
  Belgium: { id: "Belgium", name: "Belgium", flag: "🇧🇪", group: "E", confederation: "UEFA", ranking: 4 },
  Cameroon: { id: "Cameroon", name: "Cameroon", flag: "🇨🇲", group: "E", confederation: "CAF", ranking: 40 },
  "New Zealand": { id: "New Zealand", name: "New Zealand", flag: "🇳🇿", group: "E", confederation: "OFC", ranking: 95 },

  England: { id: "England", name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "F", confederation: "UEFA", ranking: 5 },
  Netherlands: { id: "Netherlands", name: "Netherlands", flag: "🇳🇱", group: "F", confederation: "UEFA", ranking: 7 },
  Senegal: { id: "Senegal", name: "Senegal", flag: "🇸🇳", group: "F", confederation: "CAF", ranking: 19 },
  Ecuador: { id: "Ecuador", name: "Ecuador", flag: "🇪🇨", group: "F", confederation: "CONMEBOL", ranking: 31 },

  Portugal: { id: "Portugal", name: "Portugal", flag: "🇵🇹", group: "G", confederation: "UEFA", ranking: 6 },
  Turkey: { id: "Turkey", name: "Turkey", flag: "🇹🇷", group: "G", confederation: "UEFA", ranking: 27 },
  "South Korea": { id: "South Korea", name: "South Korea", flag: "🇰🇷", group: "G", confederation: "AFC", ranking: 22 },
  "Costa Rica": { id: "Costa Rica", name: "Costa Rica", flag: "🇨🇷", group: "G", confederation: "CONCACAF", ranking: 38 },

  Spain: { id: "Spain", name: "Spain", flag: "🇪🇸", group: "H", confederation: "UEFA", ranking: 3 },
  Croatia: { id: "Croatia", name: "Croatia", flag: "🇭🇷", group: "H", confederation: "UEFA", ranking: 12 },
  Japan: { id: "Japan", name: "Japan", flag: "🇯🇵", group: "H", confederation: "AFC", ranking: 18 },
  Canada: { id: "Canada", name: "Canada", flag: "🇨🇦", group: "H", confederation: "CONCACAF", ranking: 41 },

  Italy: { id: "Italy", name: "Italy", flag: "🇮🇹", group: "I", confederation: "UEFA", ranking: 8 },
  Ukraine: { id: "Ukraine", name: "Ukraine", flag: "🇺🇦", group: "I", confederation: "UEFA", ranking: 24 },
  Ghana: { id: "Ghana", name: "Ghana", flag: "🇬🇭", group: "I", confederation: "CAF", ranking: 62 },
  Venezuela: { id: "Venezuela", name: "Venezuela", flag: "🇻🇪", group: "I", confederation: "CONMEBOL", ranking: 55 },

  Germany: { id: "Germany", name: "Germany", flag: "🇩🇪", group: "J", confederation: "UEFA", ranking: 13 },
  Poland: { id: "Poland", name: "Poland", flag: "🇵🇱", group: "J", confederation: "UEFA", ranking: 21 },
  Tunisia: { id: "Tunisia", name: "Tunisia", flag: "🇹🇳", group: "J", confederation: "CAF", ranking: 32 },
  "Saudi Arabia": { id: "Saudi Arabia", name: "Saudi Arabia", flag: "🇸🇦", group: "J", confederation: "AFC", ranking: 56 },

  Switzerland: { id: "Switzerland", name: "Switzerland", flag: "🇨🇭", group: "K", confederation: "UEFA", ranking: 20 },
  Denmark: { id: "Denmark", name: "Denmark", flag: "🇩🇰", group: "K", confederation: "UEFA", ranking: 23 },
  Algeria: { id: "Algeria", name: "Algeria", flag: "🇩🇿", group: "K", confederation: "CAF", ranking: 48 },
  Iran: { id: "Iran", name: "Iran", flag: "🇮🇷", group: "K", confederation: "AFC", ranking: 26 },

  Australia: { id: "Australia", name: "Australia", flag: "🇦🇺", group: "L", confederation: "AFC", ranking: 25 },
  Nigeria: { id: "Nigeria", name: "Nigeria", flag: "🇳🇬", group: "L", confederation: "CAF", ranking: 35 },
  Austria: { id: "Austria", name: "Austria", flag: "🇦🇹", group: "L", confederation: "UEFA", ranking: 16 },
  Qatar: { id: "Qatar", name: "Qatar", flag: "🇶🇦", group: "L", confederation: "AFC", ranking: 71 },
};

export const GROUPS: Group[] = [
  { id: "A", name: "Group A", teams: ["USA", "Panama", "Uruguay", "Bosnia"] },
  { id: "B", name: "Group B", teams: ["Mexico", "Jamaica", "Honduras", "Serbia"] },
  { id: "C", name: "Group C", teams: ["Argentina", "Chile", "Peru", "Romania"] },
  { id: "D", name: "Group D", teams: ["Brazil", "Colombia", "Paraguay", "Morocco"] },
  { id: "E", name: "Group E", teams: ["France", "Belgium", "Cameroon", "New Zealand"] },
  { id: "F", name: "Group F", teams: ["England", "Netherlands", "Senegal", "Ecuador"] },
  { id: "G", name: "Group G", teams: ["Portugal", "Turkey", "South Korea", "Costa Rica"] },
  { id: "H", name: "Group H", teams: ["Spain", "Croatia", "Japan", "Canada"] },
  { id: "I", name: "Group I", teams: ["Italy", "Ukraine", "Ghana", "Venezuela"] },
  { id: "J", name: "Group J", teams: ["Germany", "Poland", "Tunisia", "Saudi Arabia"] },
  { id: "K", name: "Group K", teams: ["Switzerland", "Denmark", "Algeria", "Iran"] },
  { id: "L", name: "Group L", teams: ["Australia", "Nigeria", "Austria", "Qatar"] },
];

const VENUES = [
  { city: "New York", venue: "MetLife Stadium" },
  { city: "Los Angeles", venue: "SoFi Stadium" },
  { city: "Dallas", venue: "AT&T Stadium" },
  { city: "San Francisco", venue: "Levi's Stadium" },
  { city: "Chicago", venue: "Soldier Field" },
  { city: "Miami", venue: "Hard Rock Stadium" },
  { city: "Seattle", venue: "Lumen Field" },
  { city: "Boston", venue: "Gillette Stadium" },
  { city: "Houston", venue: "NRG Stadium" },
  { city: "Philadelphia", venue: "Lincoln Financial Field" },
  { city: "Kansas City", venue: "Arrowhead Stadium" },
  { city: "Atlanta", venue: "Mercedes-Benz Stadium" },
  { city: "Toronto", venue: "BMO Field" },
  { city: "Vancouver", venue: "BC Place" },
  { city: "Mexico City", venue: "Estadio Azteca" },
  { city: "Guadalajara", venue: "Estadio Akron" },
  { city: "Monterrey", venue: "Estadio BBVA" },
];

const GROUP_DATES = [
  "Jun 11, 2026", "Jun 12, 2026", "Jun 13, 2026",
  "Jun 14, 2026", "Jun 15, 2026", "Jun 16, 2026",
  "Jun 17, 2026", "Jun 18, 2026", "Jun 19, 2026",
  "Jun 20, 2026", "Jun 21, 2026", "Jun 22, 2026",
  "Jun 23, 2026", "Jun 24, 2026", "Jun 25, 2026",
  "Jun 26, 2026", "Jun 27, 2026", "Jun 28, 2026",
];

function getVenue(index: number) {
  return VENUES[index % VENUES.length];
}

function generateGroupMatches(): Match[] {
  const matches: Match[] = [];
  let matchIndex = 0;

  GROUPS.forEach((group) => {
    const [t1, t2, t3, t4] = group.teams;
    const groupMatches = [
      [t1, t2], [t3, t4],
      [t1, t3], [t2, t4],
      [t1, t4], [t2, t3],
    ];

    groupMatches.forEach(([home, away], i) => {
      const v = getVenue(matchIndex);
      matches.push({
        id: `${home}_vs_${away}`.toLowerCase().replace(/\s+/g, "_"),
        homeTeam: home,
        awayTeam: away,
        stage: group.name,
        group: group.id,
        date: GROUP_DATES[Math.floor(matchIndex / 2)] ?? "Jun 2026",
        venue: v.venue,
        city: v.city,
      });
      matchIndex++;
    });
  });

  return matches;
}

export const GROUP_STAGE_MATCHES: Match[] = generateGroupMatches();

export const KNOCKOUT_MATCHES: Match[] = [
  { id: "r32_1", homeTeam: "1A", awayTeam: "2B", stage: "Round of 32", date: "Jul 1, 2026", venue: "MetLife Stadium", city: "New York" },
  { id: "r32_2", homeTeam: "1B", awayTeam: "2A", stage: "Round of 32", date: "Jul 1, 2026", venue: "SoFi Stadium", city: "Los Angeles" },
  { id: "r32_3", homeTeam: "1C", awayTeam: "2D", stage: "Round of 32", date: "Jul 2, 2026", venue: "AT&T Stadium", city: "Dallas" },
  { id: "r32_4", homeTeam: "1D", awayTeam: "2C", stage: "Round of 32", date: "Jul 2, 2026", venue: "Hard Rock Stadium", city: "Miami" },
  { id: "r32_5", homeTeam: "1E", awayTeam: "2F", stage: "Round of 32", date: "Jul 3, 2026", venue: "Levi's Stadium", city: "San Francisco" },
  { id: "r32_6", homeTeam: "1F", awayTeam: "2E", stage: "Round of 32", date: "Jul 3, 2026", venue: "Soldier Field", city: "Chicago" },
  { id: "r32_7", homeTeam: "1G", awayTeam: "2H", stage: "Round of 32", date: "Jul 4, 2026", venue: "Arrowhead Stadium", city: "Kansas City" },
  { id: "r32_8", homeTeam: "1H", awayTeam: "2G", stage: "Round of 32", date: "Jul 4, 2026", venue: "Lumen Field", city: "Seattle" },
  { id: "r32_9", homeTeam: "1I", awayTeam: "2J", stage: "Round of 32", date: "Jul 5, 2026", venue: "Gillette Stadium", city: "Boston" },
  { id: "r32_10", homeTeam: "1J", awayTeam: "2I", stage: "Round of 32", date: "Jul 5, 2026", venue: "NRG Stadium", city: "Houston" },
  { id: "r32_11", homeTeam: "1K", awayTeam: "2L", stage: "Round of 32", date: "Jul 6, 2026", venue: "Lincoln Financial Field", city: "Philadelphia" },
  { id: "r32_12", homeTeam: "1L", awayTeam: "2K", stage: "Round of 32", date: "Jul 6, 2026", venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  { id: "r32_13", homeTeam: "3A/B", awayTeam: "3C/D", stage: "Round of 32", date: "Jul 7, 2026", venue: "BMO Field", city: "Toronto" },
  { id: "r32_14", homeTeam: "3E/F", awayTeam: "3G/H", stage: "Round of 32", date: "Jul 7, 2026", venue: "BC Place", city: "Vancouver" },
  { id: "r32_15", homeTeam: "3I/J", awayTeam: "3K/L", stage: "Round of 32", date: "Jul 8, 2026", venue: "Estadio Azteca", city: "Mexico City" },
  { id: "r32_16", homeTeam: "3A/C", awayTeam: "3B/D", stage: "Round of 32", date: "Jul 8, 2026", venue: "Estadio Akron", city: "Guadalajara" },
  { id: "qf_1", homeTeam: "TBD", awayTeam: "TBD", stage: "Quarter-final", date: "Jul 14, 2026", venue: "MetLife Stadium", city: "New York" },
  { id: "qf_2", homeTeam: "TBD", awayTeam: "TBD", stage: "Quarter-final", date: "Jul 14, 2026", venue: "SoFi Stadium", city: "Los Angeles" },
  { id: "qf_3", homeTeam: "TBD", awayTeam: "TBD", stage: "Quarter-final", date: "Jul 15, 2026", venue: "AT&T Stadium", city: "Dallas" },
  { id: "qf_4", homeTeam: "TBD", awayTeam: "TBD", stage: "Quarter-final", date: "Jul 15, 2026", venue: "Hard Rock Stadium", city: "Miami" },
  { id: "sf_1", homeTeam: "TBD", awayTeam: "TBD", stage: "Semi-final", date: "Jul 19, 2026", venue: "MetLife Stadium", city: "New York" },
  { id: "sf_2", homeTeam: "TBD", awayTeam: "TBD", stage: "Semi-final", date: "Jul 20, 2026", venue: "SoFi Stadium", city: "Los Angeles" },
  { id: "3rd", homeTeam: "TBD", awayTeam: "TBD", stage: "Third Place", date: "Jul 22, 2026", venue: "AT&T Stadium", city: "Dallas" },
  { id: "final", homeTeam: "TBD", awayTeam: "TBD", stage: "Final", date: "Jul 23, 2026", venue: "MetLife Stadium", city: "New York" },
];

export const ALL_MATCHES: Match[] = [...GROUP_STAGE_MATCHES, ...KNOCKOUT_MATCHES];

export const TOP_CONTENDERS = [
  { team: "Argentina", odds: "+350", flag: "🇦🇷" },
  { team: "France", odds: "+400", flag: "🇫🇷" },
  { team: "Brazil", odds: "+450", flag: "🇧🇷" },
  { team: "England", odds: "+500", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { team: "Spain", odds: "+550", flag: "🇪🇸" },
  { team: "Germany", odds: "+650", flag: "🇩🇪" },
];

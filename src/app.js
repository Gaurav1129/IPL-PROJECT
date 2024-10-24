const matchesPerYear = require('./server/matches-per-year');
const matchesWonPerTeam = require('./server/matches-won-per-team-per-year');
const extraRunsConceded = require('./server/extra-runs-conceded-per-team');
const top10EconomyBowlers = require('./server/top-10-economical-bowler');
const teamsWonTossAndMatch = require('./server/teams-won-toss-and-match');
const topPlayerPerSeason = require('./server/player-of-match-awards');
const strikeRatePerSeason = require('./server/strile-rate-of-batsman-per-season');
const playerDismissal = require('./server/max-times-player-dismissal');
const bestEconomyBowler = require('./server/best-economy-bowler-in-super-overs');

function main() {
    console.log(`Processing data...`);

    matchesPerYear();
    matchesWonPerTeam();
    extraRunsConceded();
    top10EconomyBowlers();
    teamsWonTossAndMatch();
    topPlayerPerSeason();
    strikeRatePerSeason();
    playerDismissal();
    bestEconomyBowler();
}

main();
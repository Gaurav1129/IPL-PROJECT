const fs = require('fs');         
const path = require('path');
const csv = require('csv-parser');

const matchData = path.join(__dirname, '../data/matches.csv');

function matchesWonPerTeam() {
    const matchesWonPerTeam = {};

    fs.createReadStream(matchData).pipe(csv()).on('data', (row) => {
        const season = row.season;
        const winner = row.winner;

        if (winner) {
            if (!matchesWonPerTeam[season]) {
                matchesWonPerTeam[season] = {};
            }
            if (matchesWonPerTeam[season][winner]) {
                matchesWonPerTeam[season][winner]++;
            } else {
                matchesWonPerTeam[season][winner] = 1;
            }
        }
    })
        .on('end',() => {
            const outputPath = path.join(__dirname, '../public/output/matchesWonPerTeamPerYear.json');
            fs.writeFileSync(outputPath, JSON.stringify(matchesWonPerTeam, null, 2));
            console.log("Matches won per team per year data is seaved to", outputPath);
        })
}

module.exports = matchesWonPerTeam;
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const matchData = path.join(__dirname, '../data/matches.csv');
const deliveriesData = path.join(__dirname, '../data/deliveries.csv');

function extraRunsConceded() {
    const matchId = new Set();

    const extraRunsPerTeam = {};

    fs.createReadStream(matchData).pipe(csv()).on('data', (row) => {
        if (row.season === '2016') {
            matchId.add(row.id);
        }
    })
        .on('end', () => {
            fs.createReadStream(deliveriesData).pipe(csv()).on('data', (row) => {
                const matchesId = row.match_id;
                const bowlingTeam = row.bowling_team;
                const extraRuns = parseInt(row.extra_runs, 10);

                if (matchId.has(matchesId)) {
                    if (extraRunsPerTeam[bowlingTeam]) {
                        extraRunsPerTeam[bowlingTeam] += extraRuns;
                    } else {
                        extraRunsPerTeam[bowlingTeam] = extraRuns;
                    }
                }
            })
                .on('end', () => {
                    const outputPath = path.join(__dirname, '../public/output/extraRunsConcededPerTeam.json');
                    fs.writeFileSync(outputPath, JSON.stringify(extraRunsPerTeam, null, 2));
                    console.log("Extra Runs Conceded Per team is saved to:", outputPath);
                })
        })
}

module.exports = extraRunsConceded;
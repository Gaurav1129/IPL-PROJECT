const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const matchData = path.join(__dirname, '../data/matches.csv');

function awardsPerSeason() {
    const awardsPerSeason = {};
    fs.createReadStream(matchData).pipe(csv()).on('data', (row) => {
        const season = row.season;
        const player = row.player_of_match;

        if (!awardsPerSeason[season]) {
            awardsPerSeason[season] = {};
        }
        if (awardsPerSeason[season][player]) {
            awardsPerSeason[season][player]++;
        } else {
            awardsPerSeason[season][player] = 1;
        }
    })
        .on('end', () => {
            const topPlayerPerSeason = {};

            for (const season in awardsPerSeason) {
                let topPlayer = '';
                let awards = 0;

                for (const player in awardsPerSeason[season]) {
                    if (awardsPerSeason[season][player] > awards) {
                        topPlayer = player;
                        awards = awardsPerSeason[season][player];
                    }
                }

                topPlayerPerSeason[season] = {
                    player: topPlayer,
                    awards: awards
                }
            }
            const outputPath = path.join(__dirname, '../public/output/playerOfMatchAwardsPerSeason.json');
            fs.writeFileSync(outputPath, JSON.stringify(topPlayerPerSeason, null, 2));
            console.log(`Top player per season is saved to: ${outputPath}`);
        })
}

module.exports = awardsPerSeason;
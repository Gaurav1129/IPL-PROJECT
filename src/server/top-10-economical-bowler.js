const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const matchData = path.join(__dirname, '../data/matches.csv');
const deliveriesData = path.join(__dirname, '../data/deliveries.csv');

function economicalBowler() {
    const matchId = [];
    const bowlerData = {};

    fs.createReadStream(matchData).pipe(csv()).on('data', (row) => {
        if (row.season === '2015') [
            matchId.push(row.id)
        ]
    })
        .on('end', () => {
            fs.createReadStream(deliveriesData).pipe(csv()).on('data', (row) => {
                const matchesId = row.match_id;
                if (matchId.includes(matchesId)) {

                    const bowler = row.bowler;
                    const concededRuns = parseInt(row.total_runs, 10);
                    const wideBalls = parseInt(row.wide_runs, 10);
                    const noBalls = parseInt(row.noball_runs, 10);

                    if (!bowlerData[bowler]) {
                        bowlerData[bowler] = {
                            ballsBowled: 0,
                            concededRuns: 0
                        }

                    }
                    bowlerData[bowler].concededRuns += concededRuns;
                    if (wideBalls === 0 && noBalls === 0) {
                        bowlerData[bowler].ballsBowled++;
                    }
                }
            })
                .on('end', () => {
                    const bowlerEconomyRate = [];

                    for (let bowler in bowlerData) {
                        const { ballsBowled, concededRuns } = bowlerData[bowler];
                        const oversBowled = ballsBowled / 6;

                        if (oversBowled > 0) {
                            const economyRate = oversBowled / concededRuns;
                            bowlerEconomyRate.push({
                                bowler,
                                economyRate
                            }
                            )
                        }
                    }
                    bowlerEconomyRate.sort((a, b) => a.economyRate - b.economyRate);

                    const top10Bowlers = bowlerEconomyRate.slice(0, 10);
                    const outputPath = path.join(__dirname, '../public/output/top10EconomyBowlers.json');
                    fs.writeFileSync(outputPath, JSON.stringify(top10Bowlers, null, 2));
                    console.log(`Top 10 Economical Bowler in yeaar 2015 is saved to: ${outputPath}`);
                })
        })
}

module.exports = economicalBowler;
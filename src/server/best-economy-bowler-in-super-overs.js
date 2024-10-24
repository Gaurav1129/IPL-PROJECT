const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const deliveriesData = path.join(__dirname, '../data/deliveries.csv');

function bestEconomyBowler() {
    const bestEconomyBowler = {};
    fs.createReadStream(deliveriesData).pipe(csv()).on('data', (row) => {
        const over = parseInt(row.over, 10);
        const isSuperOver = row.is_super_over === '1';

        if (isSuperOver) {
            const bowler = row.bowler;
            const concededRuns = parseInt(row.total_runs, 10);


            if (!bestEconomyBowler[bowler]) {
                bestEconomyBowler[bowler] = {
                    runs: 0,
                    balls: 0
                }
            }

            bestEconomyBowler[bowler].runs += concededRuns;
            bestEconomyBowler[bowler].balls += 1;
        }

    })
        .on('end', () => {
            let bestEconomy = Infinity;
            let bestBowler = null;

            for (const bowler in bestEconomyBowler) {
                const { runs, balls } = bestEconomyBowler[bowler];
                const overs = balls / 6;
                const economy = runs / overs;

                if (bestEconomy > economy) {
                    bestEconomy = economy;
                    bestBowler = bowler;
                }
            }
            const message = `The ${bestBowler} with best economy rate is: ${bestEconomy}`;
            const result = {
                message: message,
                bowler: bestBowler,
                bestEconomy: bestEconomy
            }
            const outputPath = path.join(__dirname, '../public/output/bestEconomyBowler.json');
            fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
            console.log(`Economy Result is saved to :  ${outputPath}`);
        })
}

module.exports = bestEconomyBowler;
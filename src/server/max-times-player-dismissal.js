const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const deliveriesData = path.join(__dirname, '../data/deliveries.csv');

function playerDismissal() {
    const playerDismissal = {};
    fs.createReadStream(deliveriesData).pipe(csv()).on('data', (row) => {
        const bowler = row.bowler;
        const batsman = row.batsman;
        const dismissalKind = row.dismissal_kind;

        if (dismissalKind && dismissalKind !== 'run out' && dismissalKind !== 'retired hurt') {
            const key = `${bowler}-${batsman}`;

            if (playerDismissal[key]) {
                playerDismissal[key]++;
            } else {
                playerDismissal[key] = 1;
            }
        }
    })
        .on('end', () => {
            let maxDismissal = 0;
            let maxPair = '';

            for (const pair in playerDismissal) {
                if (playerDismissal[pair] > maxDismissal) {
                    maxDismissal = playerDismissal[pair];
                    maxPair = pair;
                }
            }
            const [bowler, batsman] = maxPair.split('-');

            const message = `The ${bowler} has dismissed the ${batsman} the most times (${maxDismissal} times)`;
            const outputPath = path.join(__dirname, '../public/output/highestTimesPlayerDismissals.json');
            const result = {
                message: message,
                bowler: bowler,
                batsman: batsman,
                maxDismissal: maxDismissal
            }
            fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
            console.log("Result is saved to: ", outputPath);
        })
}

module.exports = playerDismissal;
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const matchData = path.join(__dirname, '../data/matches.csv');

function teamWonTossAndMatch() {
    const teamsWonTossAndMatch = {};

    fs.createReadStream(matchData).pipe(csv()).on('data', (row) => {
        const tossWin = row.toss_winner;
        const matchWin = row.winner;

        if (matchWin === tossWin) {
            if (teamsWonTossAndMatch[tossWin]) {
                teamsWonTossAndMatch[tossWin]++;
            } else {
                teamsWonTossAndMatch[tossWin] = 1;
            }
        }
    })
        .on('end', () => {
            const outputPath = path.join(__dirname, '../public/output/teamsWonTossAndMatch.json');
            fs.writeFileSync(outputPath, JSON.stringify(teamsWonTossAndMatch, null, 2));
            console.log(`Teams won toss and match is saved to: ${outputPath}`);
        })

}

module.exports = teamWonTossAndMatch;
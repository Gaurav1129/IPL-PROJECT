const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const matchesData = path.join(__dirname, '../data/matches.csv');

function matchesPerYear() {
    const matchesPerYear = {};

    fs.createReadStream(matchesData).pipe(csv()).on('data', (row) => {
        const season = row.season;
        if (matchesPerYear[season]) {
            matchesPerYear[season]++;
        } else {
            matchesPerYear[season] = 1;
        }
    })
        .on('end', () => {
            const outputPath = path.join(__dirname, '../public/output/matchesPerYear.json');
            // console.log('Output path:', outputPath);
            // const outputDir = path.dirname(outputPath);

            // if (!fs.existsSync(outputDir)) {
            //     fs.mkdirSync(outputDir, { recursive: true });
            // }
            fs.writeFileSync(outputPath, JSON.stringify(matchesPerYear, null, 2));
            console.log("Matches per year data is saved to", outputPath);
        })
}

module.exports = matchesPerYear;
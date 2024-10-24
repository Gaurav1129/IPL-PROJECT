const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const matchData = path.join(__dirname, '../data/matches.csv');
const deliveriesData  = path.join(__dirname, '../data/deliveries.csv');

function strikeRatePerSeason(){
    const matchIdToSeason = {};
    const batsmanData = {};

    fs.createReadStream(matchData).pipe(csv()).on('data',(row)=>{
        const matchId = row.id;
        const season = row.season;
        matchIdToSeason[matchId] = season;
    })
    .on('end', ()=>{
        fs.createReadStream(deliveriesData).pipe(csv()).on('data', (row)=>{
            const match_id = row.match_id;
            const batsman = row.batsman;
            const runs = parseInt(row.batsman_runs, 10);
            const season = matchIdToSeason[match_id];

            if(!batsmanData[season]){
                batsmanData[season] = {};
            }
            if(!batsmanData[season][batsman]){
                batsmanData[season][batsman] = {runs: 0, balls: 0};
            }
                batsmanData[season][batsman].runs+= runs;
                batsmanData[season][batsman].balls+= 1;
        })
        .on('end', ()=>{
            const strikeRatePerSeason = {};

            for(const season in batsmanData){
               strikeRatePerSeason[season] = {};

                for(const batsman in batsmanData[season]){
                    const {runs, balls} = batsmanData[season][batsman];
                    const strikeRate = (runs/balls)*100;
                    strikeRatePerSeason[season][batsman] = strikeRate.toFixed(2);
                }
            }
            const outputPath = path.join(__dirname, '../public/output/strikeRatePerSeason.json');
            fs.writeFileSync(outputPath, JSON.stringify(strikeRatePerSeason, null, 2));
            console.log(`Strike rate of batsman in each season is saved to: ${outputPath}`);
        })
    })
}

module.exports = strikeRatePerSeason;
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-kings-xi-punjab-2nd-match-1216493/full-scorecard";
let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
function scorecardUrl(url) {
    request(url, cb);
}

function cb(error, response, html) {
    if (error) {
        console.log(error);
    }
    else if (response.statuscode == 404) {
        console.log("Page Not Found");
    }
    else {
        matchDetailsExtractor(html);
    }
}
function matchDetailsExtractor(html) {
    // venue date result are same for both team,
    let searchtool = cheerio.load(html);
    let detailsElem = searchtool(".event .description");
    let resultElem = searchtool(".event .status-text")
    let stringArr = detailsElem.text().split(",");
    let venue = stringArr[1].trim();
    let date = stringArr[2].trim();
    let result = resultElem.text().trim();
    // console.log("VENUE OF THE MATCH IS : " , venue , " AND THIS MATCH IS PLAYED ON : " , date , " AND IT IS WON BY :" , result);
    let innings = searchtool(".card.content-block.match-scorecard-table>.Collapsible");
    // let cHtml = "";
    for (let i = 0; i < innings.length; i++) {
        // let html = searchtool(innings[i]).html();
        // cHtml += html;

        // team player runs balls fours sixes and strike rate
        let teamName = searchtool(innings[i]).find(".header-title.label").text();
        teamName = teamName.split("INNINGS")[0].trim();
        let opponentIndex = i == 0 ? 1 : 0;
        let opponentName = searchtool(innings[opponentIndex]).find(".header-title.label").text();
        opponentName = opponentName.split("INNINGS")[0].trim();
        console.log("THE MATCH IS BETWEEN ", teamName, " & ", opponentName, " AND VENUE OF THE MATCH IS : ", venue, " AND THIS MATCH IS PLAYED ON : ", date, " AND IT IS WON BY :", result);
        // console.log(teamName , opponentName);

        let allRows = searchtool(innings[i]).find(".table.batsman tbody tr");
        for (let j = 0; j < allRows.length; j++) {
            let allCols = searchtool(allRows[j]).find("td");
            let isWorthy = searchtool(allCols[0]).hasClass("batsman-cell");
            if (isWorthy == true) {
                let playerName = searchtool(allCols[0]).text().trim();
                let runs = searchtool(allCols[2]).text().trim();
                let balls = searchtool(allCols[3]).text().trim();
                let fours = searchtool(allCols[5]).text().trim();
                let sixes = searchtool(allCols[6]).text().trim();
                let strikeRate = searchtool(allCols[7]).text().trim();
                finalProcessingPlayer(teamName, playerName, runs, balls, fours, sixes, strikeRate, opponentName, venue, date, result);
                console.log("NAME OF THE PLAYER : ", playerName, " RUNS SCORED : ", runs, " IN ", balls, " BALLS", " INCLUDING", fours, " 4s", " &", sixes, " 6s WITH A STRIKE RATE OF ", strikeRate);
            }
        }

    }
    // console.log(cHtml);
}
function finalProcessingPlayer(teamName, playerName, runs, balls, fours, sixes, sr, opponentName, venue, date, result) {
    let teamPath = path.join(__dirname, "IPL", teamName);
    let inputData = {
        teamName,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        sr,
        opponentName,
        venue,
        date,
        result
    }
    let arrResult = [];
    dirCreator(teamPath);
    let playerPath = path.join(teamPath, playerName + ".json");
    if (fs.existsSync(playerPath) == false) {
        arrResult[0] = inputData;
        let jsonWriteable = JSON.stringify(arrResult);
        fs.writeFileSync(playerPath, jsonWriteable);

    }
    else {
        // arrResult[0] = inputData
        let data = fs.readFileSync(playerPath);
        let jsonData = JSON.parse(data);
        jsonData.push(inputData);
        let jsonWriteable = JSON.stringify(jsonData);
        fs.writeFileSync(playerPath, jsonWriteable);
    }
}
function dirCreator(filePath) {
    if (fs.existsSync(filePath) == false) {
        fs.mkdirSync(filePath);
    }

}
module.exports = {
    surl: scorecardUrl
}
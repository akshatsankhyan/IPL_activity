let request = require("request");
let cheerio = require("cheerio");
let scorecardObj = require("./scorecard");
function getAllMatches(url){
    request(url , ncb);
}
function ncb(error,response,html){
    if(error){
        console.log(error);
    }
    else if(response.statuscode == 404){
        console.log("Page Not Found");
    }
    else{
        linkExtractor(html);
    }
}
function linkExtractor(html){
    let searchTool = cheerio.load(html);
    let scoreCardElem = searchTool("a[data-hover='Scorecard']");
    for(let i =0 ; i < scoreCardElem.length ; i++){
        let scorecardLink = searchTool(scoreCardElem[i]).attr("href");
        let scorecardFullLink = "https://www.espncricinfo.com" + scorecardLink;
        console.log(scorecardFullLink);
        scorecardObj.surl(scorecardFullLink);
    }
}
module.exports = {
    getAllMatch : getAllMatches
}
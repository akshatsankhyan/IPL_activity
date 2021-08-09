let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
let request = require("request");
let cheerio = require("cheerio");
let allMatchObj = require("./allmatch");
let fs  = require("fs");
let path  = require("path");
let iplPath  =path.join(__dirname , "IPL");
dirCreator(iplPath);
request(url,cb);
function cb(error , response , html){
    if(error){
        console.log(error);
    }
    else if(response.statuscode == 404){
        console.log("Page Not Found");
    }
    else{
        dataExtractor(html);
    }
}
function dataExtractor(html){
    let searchTool = cheerio.load(html);
    let anchorElem = searchTool("a[data-hover='View All Results']");
    let link = anchorElem.attr("href");
    let fullLink = "https://www.espncricinfo.com" + link
    // console.log(fullLink);
    allMatchObj.getAllMatch(fullLink);
}
function dirCreator(filePath){
    if(fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath);
    }
}

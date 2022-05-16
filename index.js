const fs = require('fs');
const http = require('http');
var requests = require("requests");

const homeFile = fs.readFileSync("home.html","utf-8",);
const replaceVal = (tempVal,orgVal)=> {
    let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
     temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
     temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
     temperature = temperature.replace("{%location%}",orgVal.name);
     temperature = temperature.replace("{%country%}",orgVal.sys.country);
     temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
     return temperature;
};
const server = http.createServer((req, res)=> {
    if(req.url=="/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Kochi,IN&units=metric&appid=88579dae9dda5c199f158e88cdc480e9")

        .on("data",(chunk)=> {
            const objdata= JSON.parse(chunk);
            const arrData = [objdata];
            
            const realTimeData = arrData.map((val)=> replaceVal(homeFile, val)).join(" ");
            
            res.write(realTimeData);
           //console.log(realTimeData);
            
        })
         .on("end",(err)=>{
             if(err) return console.log("connection closed due to error", err);
             res.end();
         });  
       
    }


});
server.listen(7000, "127.0.0.1");
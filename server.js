const express = require('express');
const app = express();
const port = 3000;


var common = require("common.js")

app.get('/', (req, res, next) => {
    res.send('hello world!');
});

app.get('/getChallenger', (req, res, next) => {
    var request = require("request");
    var unlencode = require("urlencode");

    var key = "RGAPI-d92cb8ac-bbf4-4209-a90f-1c809fa6424d";
    var url = "https://kr.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key=" + key;

    request(url, function(error, response, body){
        var info_jason = JSON.parse(body);
        var key = Object.keys(info_jason);
        res.send(info_jason);
    });
});

app.get('/Match', (req, res, next) => {
   res.send(common.get_matches())
});

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
var request = require("request");
var unlencode = require("urlencode");

var config = require("config.json");

var key = "RGAPI-d92cb8ac-bbf4-4209-a90f-1c809fa6424d";


function get(url) {

request(url, function(error, response, body){
    var info_jason = JSON.parse(body);
    var key = Object.keys(info_jason);
    res.send(info_jason);
});
}
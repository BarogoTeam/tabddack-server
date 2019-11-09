let request = require("request");
let conf = require('./../conf.json')

export const GET = (url, callback) => {
    let makeUrl = conf['url'] + url + '?api_key=' + conf['api_key']
    request(makeUrl, callback);
}
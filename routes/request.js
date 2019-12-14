let request = require("request");
let conf = require('./../conf.json')

export const GET = (url, callback) => {
    let makeUrl = url.indexOf('http') === -1 ? conf['url'] + url + '?api_key=' + conf['api_key'] : url;

    request(makeUrl, callback);
}
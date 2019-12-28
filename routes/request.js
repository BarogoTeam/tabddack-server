let request = require("request");
let conf = require('./../conf.json')

export const GET = (url, callback) => {
    request(url, callback);
};

export const makeRiotUrl = (url) => {
    return conf['url'] + url + '?api_key=' + conf['api_key'];
};

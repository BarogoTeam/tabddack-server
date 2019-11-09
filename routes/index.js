import {GET} from './request.js'
let conf = require('./../conf.json')
let express = require('express');
let router = express.Router();

router.get('/challengers', (req, res, next) => {
  GET('/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5', function(error, response, body){
      let info_jason = JSON.parse(body);
      let key = Object.keys(info_jason);
      res.send(info_jason);
  })
})

router.get('/summonerInfo/:summonerId', (req, res, next) => {
    var summornerId = req.params.summonerId;
    GET('/summoner/v4/summoners/' + summornerId, function(error, response, body) {
        let info_jason = JSON.parse(body);
        let key = Object.keys(info_jason);
        res.send(info_jason);
    })
})
 
module.exports = router;
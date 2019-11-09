import {GET} from './request.js'
let conf = require('./../conf.json')
let express = require('express');
let router = express.Router();

router.get('/getChallenger', (req, res, next) => {
  GET('/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5', function(error, response, body){
      let info_jason = JSON.parse(body);
      let key = Object.keys(info_jason);
      res.send(info_jason);
  })
})


router.get('/getGameInfo/:gameId', (req, res, next) => {
    let gameId = req.params.gameId;
    GET('/match/v4/matches/'+gameId, function(error, response, body){
        let info_jason = JSON.parse(body);
        let key = Object.keys(info_jason);
        res.send(info_jason);
    })
})




module.exports = router;
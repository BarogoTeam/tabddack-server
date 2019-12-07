import {GET} from './request.js'
import * as timeline from '../services/matchTimeline'
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

router.get('/matches/:accountId', (req, res, next) => {
    var summornerId = req.params.accountId;
    GET('/lol/match/v4/matchlists/by-account/' + summornerId, function(error, response, body) {
        let info_jason = JSON.parse(body);
        let key = Object.keys(info_jason);
        res.send(info_jason);
    })
})

router.get('/gameInfo/:gameId', (req, res, next) => {
    let gameId = req.params.gameId;
    GET('/match/v4/matches/'+gameId, function(error, response, body){
        let match_info = JSON.parse(body);
        GET('/match/v4/timelines/by-match/'+gameId, function(error, response, body){
          let timeline_info = JSON.parse(body);
          res.send(timeline_info);
        })
    })
  })

router.get('/gameItemBuild/:gameId', (req, res, next) => {
    let gameId = req.params.gameId;
    GET('/match/v4/timelines/by-match/'+gameId, function(error, response, body){
        let matchTimelineInfo = JSON.parse(body);
        let itemBuildInfo = timeline.getItemBuild(matchTimelineInfo);
        res.send(itemBuildInfo);
    })
})



module.exports = router;
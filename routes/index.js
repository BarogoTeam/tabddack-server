import {GET} from './request.js'
import * as timeline from '../services/matchTimeline'
import * as matchSearvice from '../services/matchService'
import * as userService from '../services/userService'
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

router.get('/rankerMatches', (req, res, next) => {
    let matchesInfo = [];
    GET('/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5', function(error, response, body){
        let info_jason = JSON.parse(body);
        let entries = info_jason.entries;
        for (let entry of entries){
            let matchSet = {};
            let summonerId = entry.summonerId;
            let accountId = "";
            GET('/summoner/v4/summoners/' + summonerId, function(error, response, body) {
                let summonersJson = JSON.parse(body);
                accountId = summonersJson.accountId;
            });
            let matches = [];
            GET('/match/v4/matchlists/by-account/' + accountId, function(error, response, body) {
                let matchlistJson = JSON.parse(body);
                for(let match of matchlistJson.matches){
                    let gameId = match.gameId;
                    GET('/match/v4/matches/'+gameId, function(error, response, body) {
                        let matchInfoJson = JSON.parse(body);
                        let matchInfo = {
                            gameId: matchInfoJson.gameId,
                            wins: matchSearvice.getWinTeam(matchInfoJson.teams),
                            gameDuration: matchInfoJson.gameDuration
                        };
                        matches.push(matchInfo);
                    })
                }
            });
            matchSet.accountId = accountId;
            matchSet.matches = matches;
            matchesInfo.push(matchSet);
        }

        res.send(matchesInfo);
    })
})

router.get('/matches/:gameId', (req, res, next) => {
    var gameId = req.params.gameId;
    GET('/match/v4/matches/'+gameId, function(error, response, body) {
        let matchInfoJson = JSON.parse(body);
        let matchInfo = {
            gameId: matchInfoJson.gameId,
            wins: matchSearvice.getWinTeam(matchInfoJson.teams),
            gameDuration: matchInfoJson.gameDuration
        };
        matches.push(matchInfo);
    })
})

router.get('/participants/:gameId', (req, res, next) => {
    var gameId = req.params.gameId;
    let participantsInfo = [];
    GET('/match/v4/matches/'+gameId, function(error, response, body) {
        let info_jason = JSON.parse(body);
        let participants = info_jason.participants;
        for(let part of participants) {
            let participantInfo = {
                gameId: gameId,
                champId: part.champId,
                participantId: part.participantId,
                teamId: part.teamId,
                spell: [ part.spell1Id, part.spell2Id ],
                rune: {
                    perk0: part.stats.perk0,
                    perk0Var1: part.stats.perk0Var1,
                    perk0Var2: part.stats.perk0Var2,
                    perk0Var3: part.stats.perk0Var3,
                    perk1: part.stats.perk1,
                    perk1Var1: part.stats.perk1Var1,
                    perk1Var2: part.stats.perk1Var2,
                    perk1Var3: part.stats.perk1Var3,
                    perk2: part.stats.perk2,
                    perk2Var1: part.stats.perk2Var1,
                    perk2Var2: part.stats.perk2Var2,
                    perk2Var3: part.stats.perk2Var3,
                    perk3: part.stats.perk3,
                    perk3Var1: part.stats.perk3Var1,
                    perk3Var2: part.stats.perk3Var2,
                    perk3Var3: part.stats.perk3Var3,
                    perk4: part.stats.perk4,
                    perk4Var1: part.stats.perk4Var1,
                    perk4Var2: part.stats.perk4Var2,
                    perk4Var3: part.stats.perk4Var3,
                    perk5: part.stats.perk5,
                    perk5Var1: part.stats.perk5Var1,
                    perk5Var2: part.stats.perk5Var2,
                    perk5Var3: part.stats.perk5Var3,
                    perkPrimaryStyle: part.stats.perkPrimaryStyle,
                    perkSubStyle: part.stats.perkSubStyle,
                    statPerk0: part.stats.statPerk0,
                    statPerk1: part.stats.statPerk1,
                    statPerk2: part.stats.statPerk2
                },
                startItem:"", //TODO 값 채우기
                mainItem:"",//TODO 값 채우기
                boots:"",//TODO 값 채우기
                skill:"",//TODO 값 채우기
                role: part.timeline.role,
                lane: part.timeline.lane
            };
            participantsInfo.push(participantInfo);
        }
        res.send(participantsInfo);
    })
})


router.get('/bans/:gameId', (req, res, next) => {
    var gameId = req.params.gameId;
    GET('/match/v4/matches/'+gameId, function(error, response, body) {
        let info_jason = JSON.parse(body);
        let bansInfo = [info_jason.teams[0].bans, info_jason.teams[1].bans];

        res.send(bansInfo);
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



router.get('/getUserList', (req, res, next) => {
    res.send(userService.getUserList());
})


module.exports = router;
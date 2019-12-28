import {getRecentGames, getMatchInfo, getTimelineInfo} from "../api/game";
import * as userService from "./userService"
import * as matchService from "./matchService"
import * as timelineService from './matchTimeline'

let game = [];
let gameQueue = [];

let gameList = {};

export const setAnalysisData = (analysisData) => {
    game.push(analysisData)
}

export const getAnalysisData = () => {
    let returnData = JSON.parse(JSON.stringify(game));
    game = [];
    return returnData;
}

export const dequeueGame = () => {
    return gameQueue.shift();
};

export const setGameList = async () => {
    let userList = userService.getUserList();
    let index = 0;
    for(let userInfo of userList){
        setTimeout(async() => {
            const recentGamesInfo = await getRecentGames(userInfo.accountId);
            if(!recentGamesInfo || !recentGamesInfo['matches'])  return;
            for(let matchGameInfo of recentGamesInfo.matches){
                // 키바나에 이미 등록된 gameid 인지 중복여부 판별이 필요
                if(!gameList.hasOwnProperty(matchGameInfo.gameId)){
                    gameList[matchGameInfo.gameId] = true;
                    gameQueue.push(matchGameInfo.gameId);
                }
            } 
        }, (index++) * 10000)
    }
};

export const getGameMatchInfo = async (gameId) => {
    const matchInfo = await getMatchInfo(gameId);

    let gameMatchInfo = {};
    gameMatchInfo.matchInfo = {
        gameId: matchInfo.gameId,
        wins: matchService.getWinTeam(matchInfo.teams),
        duration: matchInfo.gameDuration
    };

    gameMatchInfo.bansInfo = [matchInfo.teams[0].bans, matchInfo.teams[1].bans];

    gameMatchInfo.participantInfo = [];
    for(let part of matchInfo.participants) {
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
        gameMatchInfo.participantInfo.push(participantInfo);
    }
    return gameMatchInfo;
}


export const getTimeLineInfo = async (gameId) => {
    const timelineInfo = await getTimelineInfo(gameId);

    let gameTimeLineInfo = {};
    
    gameTimeLineInfo.itemBuild = timelineService.getItemBuild(timelineInfo);
    
    return gameTimeLineInfo;
}
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

    let banArr = [];
    let bansInfo = [];
    for (let banBlueTeam of matchInfo.teams[0].bans){
        banArr.push(banBlueTeam);
    }
    for (let banPupleTeam of matchInfo.teams[1].bans){
        banArr.push(banPupleTeam);
    }
    for (let ban of banArr){
        bansInfo.push({
            gameId: matchInfo.gameId,
            champId: ban.championId
        });
    }
    
    gameMatchInfo.bansInfo = [];
    gameMatchInfo.bansInfo.push(bansInfo);

    gameMatchInfo.participantInfo = matchService.getParticipants(matchInfo);

    return gameMatchInfo;
}

export const getTimeLineInfo = async (gameId) => {
    const timelineInfo = await getTimelineInfo(gameId);

    let gameTimeLineInfo = {};
    
    gameTimeLineInfo.itemBuild = timelineService.getItemBuild(timelineInfo);
    
    return gameTimeLineInfo;
}
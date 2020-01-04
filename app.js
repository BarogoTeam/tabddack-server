import * as gameInfoUtils from "./utils/gameinfo";

const userService = require('./services/userService')
const gameService = require('./services/gameService')

const conf = require('./conf.json')

const express = require('express');
const app = express();
const port = 3000;

//init
userService.setUserList();
gameInfoUtils.getGameInfo();
setTimeout(gameService.setGameList, 10000);

//schedule
const cron = require('node-cron')
cron.schedule(conf['userSchedule'], () => {
    console.log('Update User List')
    userService.setUserList();
})
cron.schedule(conf['gameSchedule'], () => {
    console.log('Update Game List')
    gameService.setGameList();
})
cron.schedule('*/5 * * * * * *', async () => {
    const id = gameService.dequeueGame();
    if(!id) return;
    console.log('Make game data - ' + id);
    const matchData = await gameService.getGameMatchInfo(id);
    const timelineData = await gameService.getTimeLineInfo(id);
    
    if(matchData.bansInfo.length === 0){
        console.log('Make game data - ' + id + ' is not lank game');
        return;
    }
    
    let participant = matchData.participantInfo;
    for(let i in participant){
        participant[i] = {
            ...participant[i],
            ...timelineData.itemBuild[Number(i)+1],
        }
    }

    gameService.setAnalysisData({
        ban: matchData.bansInfo,
        match: matchData.matchInfo,
        participant: participant,
    });
})

let routes = require('./routes/index')
app.use('/v1', routes);

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
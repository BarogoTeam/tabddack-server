import {getChallengerLeague, getSummonerInfo} from "../api/user";

let userList = [];

export const getUserList = () => {
    return userList;
};

export const setUserList = async () => {
    const leagueInfo = await getChallengerLeague();

    const oldUserList = userList.filter(oldUser => {
        return !leagueInfo.entries.some(newUser => newUser.summonerId === oldUser.summonerId);
    });

    userList = oldUserList.concat(leagueInfo.entries);

    //개발용 
    //userList = [userList[0]];
    
    const accountIdList = await getAccountIdList(userList.filter(user => !(user.accountId)));
    userList.forEach(user => user.accountId = accountIdList[user.summonerId]);
};

const getAccountIdList = async (userList) => {
    const emptyAccountIdList = userList.filter(user => !user.accountId);
    const jobs = emptyAccountIdList.map(async user => {
        return await getSummonerInfo(user.summonerId);
    });

    const accountIdList = [];
    for await (const job of jobs) {
        accountIdList[job.id] = job.accountId;
    }

    return accountIdList;
};

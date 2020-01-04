import {makeRiotUrl} from "../routes/request";
import fetch from 'node-fetch'

export const getChallengerLeague = async () => {
    try {
        const url = makeRiotUrl('/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5');

        const leagueInfo = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });

        return leagueInfo.json();
    } catch (err) {
        return err;
    }
};

export const getSummonerInfo = async (summonerId) => {
    try {
        const url = makeRiotUrl('/summoner/v4/summoners/' + summonerId);

        const summonerInfo = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });

        return summonerInfo.json();
    } catch(err) {
        return err;
    }
};

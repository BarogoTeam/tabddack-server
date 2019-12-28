import {makeRiotUrl} from "../routes/request";
import fetch from 'node-fetch'

export const getRecentGames = async (accountId) => {
    try {
        const url = makeRiotUrl(`/match/v4/matchlists/by-account/${accountId}`);
        const gameInfo = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });

        return gameInfo.json();
    } catch (err) {
        return err;
    }
};

export const getMatchInfo = async (gameId) => {
    try {
        const url = makeRiotUrl(`/match/v4/matches/${gameId}`);
        const response = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });
        return response.json();
    } catch (err) {
        return err;
    }
}

export const getTimelineInfo = async (gameId) => {
    try {
        const url = makeRiotUrl(`/match/v4/timelines/by-match/${gameId}`);
        const response = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });
        return response.json();
    } catch (err) {
        return err;
    }
};
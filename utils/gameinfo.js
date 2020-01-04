import {GET} from '../routes/request.js'
import fetch from 'node-fetch'

const url = 'https://ddragon.leagueoflegends.com';
const language = 'ko_KR';

let champ = {};
let item = {};
let spell = {};

export const getGameInfo = async () => {
    const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };

    const response = await fetch(`${url}/api/versions.json`, options);
    const json = await response.json();
    const apiVersion = json[0];
    console.log(`LeagueOfLegends api version - ${apiVersion}`);

    const getItemData = async () => {
        const response = await fetch(`${url}/cdn/${apiVersion}/data/${language}/item.json`, options);
        const json = await response.json();
        item = json.data;
        console.log('success item data');
    };

    const getSpellData = async () => {
        const response = await fetch(`${url}/cdn/${apiVersion}/data/${language}/summoner.json`, options);
        const json = await response.json();
        const spellData = json.data;
        for(let key in spellData){
            spell[spellData[key].key] = spellData[key];
        }
        console.log('success spell data');
    };

    const getChampData = async () => {
        const response = await fetch(`${url}/cdn/${apiVersion}/data/${language}/champion.json`, options);
        const json = await response.json();
        champ = json.data;

        const getChampInfo = async (champName) => {
            const response = await fetch (`${url}/cdn/${apiVersion}/data/${language}/champion/${champName}.json`, options);
            // console.log(`success champion data - ${key} (${++champCount} / ${allChampCount})`);
            const json = await response.json();
            return json.data[champName];
        };

        const champInfoList = Object.keys(champ).map(key => getChampInfo(key));

        for await (const champInfo of champInfoList) {
            champ[champInfo.id].skillMasterLevels = {
                'q': champInfo.spells[0].maxrank,
                'w': champInfo.spells[1].maxrank,
                'e': champInfo.spells[2].maxrank,
                'r': champInfo.spells[3].maxrank,
            }
        }

        console.log('success champions data');
    };

    await Promise.all([
        getItemData(),
        getSpellData(),
        getChampData()
    ]);
};

export const getSpell = (id) => {
    return spell[id];
};

export const getItem = (id) => {
    return item[id];
};

export const getChamp = (id) => {
    return champ[id];
};

import {GET} from '../routes/request.js'
import fetch from 'node-fetch'

const url = 'https://ddragon.leagueoflegends.com';
const language = 'ko_KR';

let champList = {};
let itemList = {};
let spellList = {};

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
        itemList = json.data;

        for(let key in itemList) {
            let item = itemList[key];
            if(item.tags.includes('Boots') || item.tags.includes('Trinket') || item.tags.includes('Consumable')) { // 신발 장신구 소모품(와드,포션) 제외
                item.coreYn = 'N';
            } else if(item.requiredAlly && item.requiredAlly == 'Ornn') { // 오른 강화템 제외
                item.coreYn = 'N';
            } else if(item.from && item.into == null) { // 하위 미존재 상위 존재 시 코어
                item.coreYn = 'Y';
            } else if(isIntoOrnnItem(item)) { // 오른 강화 가능템인지 확인 (무한의 대검 등)
                item.coreYn = 'Y';
            }  else {
                item.coreYn = 'N';
            }
        }
        console.log('success item data');
    };

    const isIntoOrnnItem = (item) => {
        if(item.from && item.into) {
            if(item.into.length == 1) {
                if(itemList[item.into[0]].requiredAlly == 'Ornn') {
                    return true;
                }
            }
        }
        return false;
    }

    const getSpellData = async () => {
        const response = await fetch(`${url}/cdn/${apiVersion}/data/${language}/summoner.json`, options);
        const json = await response.json();
        const spellData = json.data;
        for(let key in spellData){
            spellList[spellData[key].key] = spellData[key];
        }
        console.log('success spell data');
    };

    const getChampData = async () => {
        const response = await fetch(`${url}/cdn/${apiVersion}/data/${language}/champion.json`, options);
        const json = await response.json();
        let initChamp = json.data;

        const getChampInfo = async (champName) => {
            const response = await fetch (`${url}/cdn/${apiVersion}/data/${language}/champion/${champName}.json`, options);
            // console.log(`success champion data - ${key} (${++champCount} / ${allChampCount})`);
            const json = await response.json();
            return json.data[champName];
        };

        const champInfoList = Object.keys(initChamp).map(key => getChampInfo(key));
        const defaultSkillLevel = require('./defaultSkillLevel.json');

        for await (const champInfo of champInfoList) {
            champList[champInfo.key] = initChamp[champInfo.id];
            champList[champInfo.key].skillMasterLevels = {
                'q': champInfo.spells[0].maxrank,
                'w': champInfo.spells[1].maxrank,
                'e': champInfo.spells[2].maxrank,
                'r': champInfo.spells[3].maxrank,
            }
            champList[champInfo.key].defaultSkillLevel = defaultSkillLevel[champInfo.id] || {
                'q':0,'w':0,'e':0,'r':0,
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
    return spellList[id];
};

export const getItem = (id) => {
    return itemList[id];
};

export const getChamp = (id) => {
    return champList[id];
};

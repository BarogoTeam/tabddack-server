import {GET} from '../routes/request.js'

const url = 'https://ddragon.leagueoflegends.com'
const language = 'ko_KR';

let champ,item,spell;

GET(`${url}/api/versions.json`, function(error, response, body) {
    const version = JSON.parse(body)[0];
    console.log(`leagueoflegends api version - ${version}`);

    GET(`${url}/cdn/${version}/data/${language}/item.json`, function(error, response, body) {
        console.log('succes item data');
        item = JSON.parse(body).data;
    })
    GET(`${url}/cdn/${version}/data/${language}/summoner.json`, function(error, response, body) {
        console.log('succes spell data');
        let spellData = JSON.parse(body).data;
        spell = {};
        for(let key in spellData){
            spell[spellData[key].key] = spellData[key];
        }
    })
    GET(`${url}/cdn/${version}/data/${language}/champion.json`, function(error, response, body) {
        console.log('succes champions data');
        let champData = JSON.parse(body).data;
        champ = {};
        let champCount = 0;
        let allChampCount = 0;
        for(let key in champData){
            allChampCount++;
            champ[key] = champData[key];
            GET(`${url}/cdn/${version}/data/${language}/champion/${key}.json`, function(error, response, body) {
                console.log(`succes champion data - ${key} (${++champCount} / ${allChampCount})`);
                let champInfo = JSON.parse(body).data[key];
                champ[key].skillMasterLevels = {
                    'q': champInfo.spells[0].maxrank,
                    'w': champInfo.spells[1].maxrank,
                    'e': champInfo.spells[2].maxrank,
                    'r': champInfo.spells[3].maxrank,
                }
                console.log(champ[key])
            })
        }
    })
})

export const getSpell = (id) => {
    return spell[id];
}

export const getItem = (id) => {
    return item[id];
}

export const getChamp = (id) => {
    return champ[id];
}
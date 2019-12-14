import {GET} from '../routes/request.js'

const url = 'https://ddragon.leagueoflegends.com'
const language = 'ko_KR';

let champ,item,spell;

GET(`${url}/api/versions.json`, function(error, response, body) {
    const version = JSON.parse(body)[0];
    console.log(`leagueoflegends api version - ${version}`);

    GET(`${url}/cdn/${version}/data/${language}/item.json`, function(error, response, body) {
        item = JSON.parse(body).data;
        console.log('succes item data');
    })
    GET(`${url}/cdn/${version}/data/${language}/champion.json`, function(error, response, body) {
        let champData = JSON.parse(body).data;
        champ = {};
        for(let key in champData){
            champ[champData[key].key] = champData[key];
        }
        console.log('succes champion data');
    })
    GET(`${url}/cdn/${version}/data/${language}/summoner.json`, function(error, response, body) {
        let spellData = JSON.parse(body).data;
        spell = {};
        for(let key in spellData){
            spell[spellData[key].key] = spellData[key];
        }
        console.log('succes spell data');
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
const parserJsonToObject = (data, key) => {
    let object = {};
    for(let jsonData of data)   object[jsonData[key]] = jsonData;
    return object;
}

const spell = parserJsonToObject(require('./spell.json'),'key');
const item = parserJsonToObject(require('./item.json'),'id');
const champ = parserJsonToObject(require('./spell.json'),'key');

export const getSpell = (id) => {
    return spell[id];
}

export const getItem = (id) => {
    return item[id];
}

export const getChamp = (id) => {
    return champ[id];
}
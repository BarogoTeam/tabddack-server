import * as gameinfo from '../utils/gameinfo'

export const getItemBuild = (matchTimelineInfo) => {

    let participants = [];
    for(let p=0; p<11; p++) {
        participants.push({
            startItem : [],
            itemBuild : ''
        });
    }
    let frames = matchTimelineInfo.frames;

    for(let frame of frames) {
        let events = frame.events;
        for (let event of events) {

            if (event.timestamp > '60000') {
                break;
            }

            if (event.type === 'ITEM_PURCHASED') {
                participants[event.participantId].startItem.push(gameinfo.getItem(event.itemId));
            }
        }
    }

    for (let p=1; p<=10; p++) {
        participants[p].startItem.sort((a, b) => {
            return a.id - b.id;
        })
        for (let i=0; i<participants[p].startItem.length; i++) {
            console.log(participants[p].startItem[i]);
        }
        console.log('======================');
    }

}
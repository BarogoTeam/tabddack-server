import * as gameinfo from '../utils/gameinfo'

export const getItemBuild = (matchTimelineInfo) => {

    let participants = [];
    for(let p=0; p<11; p++) {
        participants.push({
            startItem : [],
            itemBuild : []
        });
    }
    let frames = matchTimelineInfo.frames;

    for(let frame of frames) {
        let events = frame.events;
        for (let event of events) {
            if (event.type === 'ITEM_PURCHASED') {
                if (event.timestamp <= '60000') {
                    participants[event.participantId].startItem.push(event.itemId);
                }
                if (1) { // 코어템이면 itemBuild에 push
                    participants[event.participantId].itemBuild.push(event.itemId);
                }
            } else if (event.types === 'ITEM_UNDO') {

            }
        }
    }

    for (let p=1; p<=10; p++) {
        // participants[p].startItem.sort((a, b) => {
        //     return a - b;
        // })
        for (let i=0; i<participants[p].itemBuild.length; i++) {
            //console.log(participants[p].itemBuild[i]);
        }
        //console.log('======================');
    }

}
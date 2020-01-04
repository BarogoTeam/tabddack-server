import * as gameinfo from '../utils/gameinfo'

export const getItemBuild = (matchTimelineInfo) => {

    const skillList = ["Q", "W", "E", "R"];
    let participants = [];
    for(let p=0; p<11; p++) {
        participants.push({
            startItem : [],
            coreItem : [],
            skillTree : ''
        });
    }
    let frames = matchTimelineInfo.frames;

    for(let frame of frames) {
        let events = frame.events;
        for (let event of events) {
            if (event.type === 'ITEM_PURCHASED') {
                //console.log(event.participantId + ' / ' + event.type + ' / ' + event.itemId + '(' + gameinfo.getItem(event.itemId).name + ')');
                if (event.timestamp <= '60000') {
                    participants[event.participantId].startItem.push(event.itemId);
                }
                if (1) { // 코어템이면 coreItem에 push 하도록 변경
                    participants[event.participantId].coreItem.push(event.itemId);
                }
            } else if (event.type === 'ITEM_DESTROYED' || event.type === 'ITEM_SOLD') {
                //console.log(event.participantId + ' / ' + event.type + ' / ' + event.itemId + '(' + gameinfo.getItem(event.itemId).name + ')');
                if (event.timestamp <= '60000') {
                    let startItemIndex = participants[event.participantId].startItem.indexOf(event.itemId);
                    participants[event.participantId].startItem.splice(startItemIndex, 1);
                }
                let itemIndex = participants[event.participantId].coreItem.indexOf(event.itemId);
                participants[event.participantId].coreItem.splice(itemIndex, 1);
            } else if (event.type === 'ITEM_UNDO') {
                //console.log(event.participantId + ' / ' + event.type + ' / ' + event.afterId + '(' + gameinfo.getItem(event.afterId).name + ')' + ' / ' + event.beforeId + '(' + gameinfo.getItem(event.beforeId).name + ')');
                let itemIndex;
                if(event.afterId !== 0) {
                    if (event.timestamp <= '60000') {
                        participants[event.participantId].startItem.push(event.afterId);
                    }
                    participants[event.participantId].coreItem.push(event.afterId);
                }
                if(event.beforeId !== 0) {
                    if (event.timestamp <= '60000') {
                        itemIndex = participants[event.participantId].startItem.indexOf(event.beforeId);
                        participants[event.participantId].startItem.splice(itemIndex, 1);
                    }
                    itemIndex = participants[event.participantId].coreItem.indexOf(event.beforeId);
                    participants[event.participantId].coreItem.splice(itemIndex, 1);
                }
            } else if (event.type === 'SKILL_LEVEL_UP') {
                participants[event.participantId].skillTree += skillList[event.skillSlot - 1];
            }
        }
    }

    for (let p=1; p<=10; p++) {
        // 같은 거 통계내기 위해 정렬
        // participants[p].startItem.sort((a, b) => {
        //     return a - b;
        // })
        for (let i=0; i<participants[p].coreItem.length; i++) {
            //console.log(participants[p].coreItem[i] + '(' + gameinfo.getItem(participants[p].coreItem[i]).name + ')');
        }
        //console.log('======================');
    }

    // 리소스 변환 (개발용)
    for(let itemBuild of participants){
        itemBuild.startItemResources = [];
        for(let startItem of itemBuild.startItem){
            itemBuild.startItemResources.push(gameinfo.getItem(startItem).name);
        }
        itemBuild.coreItemResources = [];
        for(let coreItem of itemBuild.coreItem){
            itemBuild.coreItemResources.push(gameinfo.getItem(coreItem).name);
        }
    }
    return participants;

}
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
                if (event.timestamp <= '60000') {
                    participants[event.participantId].startItem.push(event.itemId);
                }
                participants[event.participantId].coreItem.push(event.itemId);
            } else if (event.type === 'ITEM_DESTROYED' || event.type === 'ITEM_SOLD') {
                if (event.timestamp <= '60000') {
                    let startItemIndex = participants[event.participantId].startItem.indexOf(event.itemId);
                    participants[event.participantId].startItem.splice(startItemIndex, 1);
                }
                let itemIndex = participants[event.participantId].coreItem.indexOf(event.itemId);
                participants[event.participantId].coreItem.splice(itemIndex, 1);
            } else if (event.type === 'ITEM_UNDO') {
                let itemIndex;
                if(event.afterId !== 0) {
                    if (event.timestamp <= '60000') {
                        itemIndex = participants[event.participantId].startItem.indexOf(event.afterId);
                        participants[event.participantId].startItem.splice(itemIndex, 1);
                    }
                    itemIndex = participants[event.participantId].coreItem.indexOf(event.afterId);
                    participants[event.participantId].coreItem.splice(itemIndex, 1);
                }
                if(event.beforeId !== 0) {
                    if (event.timestamp <= '60000') {
                        participants[event.participantId].startItem.push(event.beforeId);
                    }
                    participants[event.participantId].coreItem.push(event.beforeId);
                }
            } else if (event.type === 'SKILL_LEVEL_UP') {
                participants[event.participantId].skillTree += skillList[event.skillSlot - 1];
            }
        }
    }

    for (let p=1; p<=10; p++) {
        let coreItemList = [];
        for (let i=0; i<participants[p].coreItem.length; i++) {
            if(gameinfo.getItem(participants[p].coreItem[i]).coreYn === 'Y') {
                coreItemList.push(participants[p].coreItem[i]);
            }
        }
        participants[p].coreItem = coreItemList;
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
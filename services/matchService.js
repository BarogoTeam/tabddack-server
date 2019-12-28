export function getParticipants(matchData) {
    const getLane = (lane, role) => {
        if (lane !== "BOTTOM") return lane;
        return role === "DUO_CARRY" ? "AD_CARRY" : "SURPPORT";
    };

    const data = matchData.participants.map((p) => {
        let {lane, role} = p.timeline;
        return {
            championId: p.championId,
            lane: getLane(lane, role)
        };
    });

    return data;
}

export function getSkillTree(timelineData, participantId){
    let skillTree = "";
    let eventList = [];

    timelineData.frames.forEach((f) => {
        eventList = eventList.concat(f.events);
    });

    const skillEvents = eventList.filter((e) => {
        return e.type === "SKILL_LEVEL_UP" && e.participantId === participantId;
    });

    const skillList = ["Q", "W", "E", "R"];
    skillEvents.forEach((e) => {
        skillTree += skillList[e.skillSlot - 1];
    });

    return skillTree;
}


export function getWinTeam(teams){
    let winTeamId;
    for(let team of teams){
        if(team.win == 'Win'){
            winTeamId = team.teamId;
        }
    }

    return winTeamId;
}

export function getSkillMasterTree(skillTree, skillMasterLevels){

    let skillMaster = "";
    let nowSkillLevels = { "Q" : 0, "W" : 0, "E" : 0, "R" : 0 };

    for(const s of skillTree) {
        nowSkillLevels[s]++;
        if(nowSkillLevels[s] === skillMasterLevels[s])
            skillMaster += s;
    }

    if(skillMaster.length === 3){
        for(const s in skillMasterLevels) {
            if (skillMaster.indexOf(s) === -1)
                skillMaster += s;
        }
    }

    return skillMaster;

}
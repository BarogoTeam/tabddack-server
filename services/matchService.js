export function getParticipants(matchData) {
    let participantInfo = [];
    for(let part of matchData.participants) {
        participantInfo.push({
            gameId: matchData.gameId,
            champId: part.championId,
            participantId: part.participantId,
            teamId: part.teamId,
            spell: [ part.spell1Id, part.spell2Id ],
            rune: {
                perk0: part.stats.perk0,
                perk0Var1: part.stats.perk0Var1,
                perk0Var2: part.stats.perk0Var2,
                perk0Var3: part.stats.perk0Var3,
                perk1: part.stats.perk1,
                perk1Var1: part.stats.perk1Var1,
                perk1Var2: part.stats.perk1Var2,
                perk1Var3: part.stats.perk1Var3,
                perk2: part.stats.perk2,
                perk2Var1: part.stats.perk2Var1,
                perk2Var2: part.stats.perk2Var2,
                perk2Var3: part.stats.perk2Var3,
                perk3: part.stats.perk3,
                perk3Var1: part.stats.perk3Var1,
                perk3Var2: part.stats.perk3Var2,
                perk3Var3: part.stats.perk3Var3,
                perk4: part.stats.perk4,
                perk4Var1: part.stats.perk4Var1,
                perk4Var2: part.stats.perk4Var2,
                perk4Var3: part.stats.perk4Var3,
                perk5: part.stats.perk5,
                perk5Var1: part.stats.perk5Var1,
                perk5Var2: part.stats.perk5Var2,
                perk5Var3: part.stats.perk5Var3,
                perkPrimaryStyle: part.stats.perkPrimaryStyle,
                perkSubStyle: part.stats.perkSubStyle,
                statPerk0: part.stats.statPerk0,
                statPerk1: part.stats.statPerk1,
                statPerk2: part.stats.statPerk2
            },
            role: part.timeline.role,
            lane: part.timeline.lane
        });
    }
    return participantInfo;
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
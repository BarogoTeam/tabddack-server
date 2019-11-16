export function parseParticipants(matchData) {
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
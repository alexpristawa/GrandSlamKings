class Stat {

    static updateStats(trigger, info) {
        let arr = ['point', 'game', 'set', 'match', 'daily', 'weekly', 'total'];
        let keyIndex = arr.indexOf(trigger)+1;

        arr.slice(keyIndex).forEach(key => {
            if(trigger == "hit") {
                storageObj.record[key].racketHits++;
                //If the player is receiving
                if(Match.point.receiving == 0) {
                    if(['topspin', 'slice', 'flat', 'serve'].includes(info.hitType)) {
                        storageObj.record[key][info.hitType+'s']++;
                    } else if(info.wasVolley === true) {
                        storageObj.record[key].volleys++;
                    }
                }
            } else if(trigger == 'point') {
                if(['easy', 'medium', 'hard', 'extreme'].includes(info.difficulty)) {
                    storageObj.record[key].wins[Match.match.difficulty].points++;
                }
                storageObj.record[key].wins.total.points++;
            } else if(trigger == 'game') {
                if(['easy', 'medium', 'hard', 'extreme'].includes(info.difficulty)) {
                    storageObj.record[key].wins[Match.match.difficulty].games++;
                }
                storageObj.record[key].wins.total.games++;
            } else if(trigger == 'set') {
                if(['easy', 'medium', 'hard', 'extreme'].includes(info.difficulty)) {
                    storageObj.record[key].wins[Match.match.difficulty].sets++;
                }
                storageObj.record[key].wins.total.sets++;
            } else if(trigger == 'match') {
                if(['easy', 'medium', 'hard', 'extreme'].includes(info.difficulty)) {
                    storageObj.record[key].wins[Match.match.difficulty].matches++;
                }
                storageObj.record[key].wins.total.matches++;
            }
        });

        if(trigger != 'hit') {
            storageObj.record[trigger].won = info.won;
            Challenge.checkChallenges(trigger);
        } else {
            storageObj.record.point.lastHit = info;
        }
    }
}
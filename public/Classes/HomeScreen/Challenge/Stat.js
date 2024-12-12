class Stat {

    static updateStats(trigger, info) {
        let arr = ['point', 'game', 'set', 'match', 'daily', 'weekly', 'total'];
        let keyIndex = arr.indexOf(trigger)+1;
        if(trigger == 'tournament') {
            keyIndex = arr.indexOf('daily');
        }
        let key2 = info.won ? 'wins':'losses';

        arr.slice(keyIndex).forEach(key => {
            if(trigger == "hit") {
                if(info.playerNum == 0) {
                    storageObj.record[key].racketHits++;
                }
                if(key == 'point') storageObj.record[key].totalHits++;
                //If the player is receiving
                if(Match.point.receiving == 0 || !Match.point.serveHappened) {
                    if(['topspin', 'slice', 'flat', 'serve'].includes(info.hitType)) {
                        storageObj.record[key][info.hitType+'s']++;
                    } else if(info.wasVolley === true) {
                        storageObj.record[key].volleys++;
                    }
                }
            } else if(trigger == 'point') {
                if(['easy', 'medium', 'hard', 'extreme'].includes(info.difficulty)) {
                    storageObj.record[key][key2][Match.match.difficulty].points++;
                }
                storageObj.record[key][key2].total.points++;
            } else if(trigger == 'game') {
                if(['easy', 'medium', 'hard', 'extreme'].includes(info.difficulty)) {
                    storageObj.record[key][key2][Match.match.difficulty].games++;
                }
                storageObj.record[key][key2].total.games++;
            } else if(trigger == 'set') {
                if(['easy', 'medium', 'hard', 'extreme'].includes(info.difficulty)) {
                    storageObj.record[key][key2][Match.match.difficulty].sets++;
                }
                storageObj.record[key][key2].total.sets++;
            } else if(trigger == 'match') {
                if(['easy', 'medium', 'hard', 'extreme'].includes(info.difficulty)) {
                    storageObj.record[key][key2][Match.match.difficulty].matches++;
                }
                storageObj.record[key][key2].total.matches++;
                document.querySelector(`div.stats > .statsHolder > div.${info.difficulty} .${info.won ? 'won':'lost'}`).innerHTML = storageObj.record.total[key2][Match.match.difficulty].matches;
            } else if(trigger == 'tournament') {
                storageObj.record[key][key2].tournaments[info.difficulty]++;
                storageObj.record[key][key2].tournaments.total++;
            }
        });

        if(['hit', 'tournament'].indexOf(trigger) == -1) {
            storageObj.record[trigger].won = info.won;
            Challenge.checkChallenges(trigger);
        } else if(trigger == 'hit') {
            storageObj.record.point.lastHit = info;
            Challenge.checkChallenges('hit');
        } else {
            Challenge.checkChallenges(trigger);
        }
    }
}
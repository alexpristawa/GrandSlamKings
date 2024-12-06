class Challenge {

    static activeChallenges = {
        hit: [],
        point: [],
        game: [],
        set: [],
        match: [],
        tournament: [],
        challenge: [],
    }

    constructor(i, j) {
        let obj;
        if(!(this instanceof Achievement)) {
            obj = this.constructor.challenges[i][j];
            this.i = i;
        } else {
            obj = i;
        }
        Object.keys(obj).forEach(key => {
            this[key] = obj[key];
        });
        if(Object.keys(Challenge.activeChallenges).includes(this.frequency)) Challenge.activeChallenges[this.frequency].push(this);
    }

    static checkChallenges(type, obj) {
        Challenge.activeChallenges[type].forEach(challenge => {
            challenge.update(true, obj);
        });
    }

    static getDay() {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const millisecondsSinceEpoch = startOfToday.getTime();
        const daysSinceEpoch = Math.floor(millisecondsSinceEpoch / (1000 * 60 * 60 * 24));
        return daysSinceEpoch;
    }

    // Returns the number of weeks since the Unix epoch, resetting at 12 AM Monday, local time
    static getWeek() {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
        const startOfMondayThisWeek = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - ((dayOfWeek + 6) % 7) // Adjust to Monday
        );
        const millisecondsSinceEpoch = startOfMondayThisWeek.getTime();
        const weeksSinceEpoch = Math.floor(millisecondsSinceEpoch / (1000 * 60 * 60 * 24 * 7));
        return weeksSinceEpoch;
    }

    update(check = true, info = {}) {
        if(this.completed) {
            this.complete();
            return;
        }
        if(this.description == "Win a receiving game without losing a point") {
            if(check && Match.game.serving == 1 && Match.match.score[1].points == 0) {
                this.complete();
            }
        } else if(this.description == "Win a point where the ball hits a racket exactly +n times") {
            if(check && storageObj.record.point.totalHits == this.n && storageObj.record.point.won === true) {
                this.complete();
            }
        } else if(this.description == "Win a point by vollying the ball") {
            if(check && storageObj.record.point.lastHit.wasVolley === true && storageObj.record.point.won === true) {
                this.complete();
            }
        } else if(this.description == "Win +n sets") {
            if(check && storageObj.record[this.time].wins.total.sets == this.n) {
                this.complete();
            }
            this.statBar.style.width = Math.min(storageObj.record[this.time].wins.total.sets/this.n*100, 100) + '%';
        } else if(this.description == "Win a match best of 5 sets") {
            if(check && Match.match.score[0].sets == 3) {
                this.complete();
            }
        } else if(this.description == "Win +n games") {
            if(check && storageObj.record[this.time].games == this.n) {
                this.complete();
            }
            this.statBar.style.width = Math.min(storageObj.record[this.time].games/this.n*100, 100) + '%';
        } else if(this.description == "Win +n match on extreme difficulty") {
            if(check && storageObj.record[this.time].wins.extreme.matches == this.n) {
                this.complete();
            }
            this.statBar.style.width = Math.min(storageObj.record[this.time].wins.extreme.matches/this.n*100, 100) + '%';
        } else if(this.description == "Win a match without losing a game") {
            if(check && storageObj.record.match.losses.total.games == 0) {
                this.complete();
            }
        } else if(this.description == 'Log in on +n different days') {
            if(check) {
                if(!this.progress.includes(Challenge.getDay())) {
                    this.progress.push(Challenge.getDay());
                }
                if(this.progress.length == this.n) this.complete();
            }
            this.statBar.style.width = Math.min(this.progress.length/this.n*100, 100) + '%';
        } else if(this.description == 'Win a match on +n different days') {
            if(check && storageObj.record["daily"].wins.total.matches > 0) {
                if(!this.progress.includes(Challenge.getDay())) {
                    this.progress.push(Challenge.getDay());
                }
                if(this.progress.length == this.n) this.complete();
            }
            this.statBar.style.width = Math.min(this.progress.length/this.n*100, 100) + '%';
        } else if(this.description == 'Win +n tournament') {
            if(check && storageObj.record[this.time].wins.tournaments.total >= this.n) {
                this.complete();
            }
            this.statBar.style.width = Math.min(storageObj.record[this.time].wins.tournaments.total/this.n*100, 100) + '%';
        }
        localStorage.grandSlamKings = JSON.stringify(storageObj);
    }

    complete() {
        if(this instanceof Achievement) {
            //this.progress++;
        } else {
            this.completed = true;
        }
        this.statBar.style.width = '100%';
        if(this.checkbox) this.checkbox.classList.add('checked');
        this.div.querySelector('div.coinHolder').classList.add('claimable');
        this.div.querySelector('div.coinHolder').addEventListener('click', this.claimRewardFix);
        if((!(this instanceof Achievement) && this.collected)) {this.claimReward(false)}
    }

    claimRewardFix = () => {
        this.claimReward();
    }

    claimReward(getCoins = true) {
        if(getCoins) {
            if(!(this instanceof Achievement)) {
                StorageManager.incrementCoins((this instanceof DailyChallenge ? this.i * 100 + 50 : this.i * 300 + 50) * this.coinMultiplier);
                this.collected = true;
            } else {
                StorageManager.incrementCoins((1+this.collected*3)*this.baseReward);
                this.collected++;
                this.progress++;
            }
        }
        this.div.querySelector('div.coinHolder').classList.remove('claimable');
        this.div.querySelector('div.coinHolder').removeEventListener('click', this.claimRewardFix);
        if(!(this instanceof Achievement) || (this instanceof Achievement && this.progress == this.levels.length)) {
            this.div.classList.add('claimed');
        }
        localStorage.grandSlamKings = JSON.stringify(storageObj);
    }
}
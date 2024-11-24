class StorageManager {
    
    static incrementCoins(n) {
        let startNum = storageObj.coins;
        storageObj.coins += n;
        localStorage.grandSlamKings = JSON.stringify(storageObj);
        let span = document.querySelector('div.coinsHolder > div.coinDiv span');
        let img = document.querySelector('div.coinsHolder > div.coinDiv img');
        
        let dc = storageObj.coins-startNum;
        let i = 0;
        let interval = setInterval(() => {
            i++;
            img.style.height = `${Math.sin(Math.PI*i/120)*20+70}%`;
            let inc = (Math.log(50*i+1)/Math.log(120*50+1))*dc;
            span.innerHTML = Math.round(startNum+inc);
            if(i == 120) {
                span.innerHTML = storageObj.coins;
                clearInterval(interval);
            }
        }, 1000/120);
    }
    
    static getStorageObj() {
        if(localStorage.grandSlamKings) {
            storageObj = JSON.parse(localStorage.grandSlamKings);
            ['point', 'game', 'set', 'match'].forEach(key => {
                this.resetRecord(key);
            });
        
            DailyChallenge.getChallenges();
            WeeklyChallenge.getChallenges();
        } else {
            storageObj = {
                version: 0.9,
                coins: 0,
                characters: ["Default"],
                character: "Default",
                opponent: "Easy",
                achievements: [],
                loginInfo: {
                    day: Challenge.getDay(),
                    week: Challenge.getWeek()
                },
                record: {
                    point: this.getDefaultRecord('point'),
                    game: this.getDefaultRecord('game'),
                    set: this.getDefaultRecord('set'),
                    match: this.getDefaultRecord('match'),
                    daily: this.getDefaultRecord('daily'),
                    weekly: this.getDefaultRecord('weekly'),
                    total: this.getDefaultRecord('total')
                },
                dailyChallenges: [null, null, null],
                weeklyChallenges: [null, null, null]
            }
        
            DailyChallenge.getChallenges();
            WeeklyChallenge.getChallenges();
        }
        StorageManager.incrementCoins(0);
        localStorage.grandSlamKings = JSON.stringify(storageObj);
    }

    static getDefaultRecord(type) {
        if(type == 'point') {
            return {
                volleys: 0,
                slices: 0,
                topspins: 0,
                racketHits: 0,
                totalHits: 0,
                won: undefined,
                lastHit: null
            };
        } else {
            let winObj = {
                easy: {
                    points: 0,
                    games: 0,
                    sets: 0,
                    matches: 0
                },
                medium: {
                    points: 0,
                    games: 0,
                    sets: 0,
                    matches: 0
                },
                hard: {
                    points: 0,
                    games: 0,
                    sets: 0,
                    matches: 0
                },
                extreme: {
                    points: 0,
                    games: 0,
                    sets: 0,
                    matches: 0
                },
                total: {
                    points: 0,
                    games: 0,
                    sets: 0,
                    matches: 0,
                    tournaments: 0
                }
            };
            return {
                volleys: 0,
                serves: 0,
                slices: 0,
                flats: 0,
                topspins: 0,
                racketHits: 0,
                won: undefined,
                wins: winObj,
                losses: JSON.parse(JSON.stringify(winObj))
            };
        }
    }

    static resetRecord(key) {
        storageObj.record[key] = this.getDefaultRecord(key);
        localStorage.grandSlamKings = JSON.stringify(storageObj);
    }

    static save() {
        localStorage.grandSlamKings = JSON.stringify(storageObj);
    }
}
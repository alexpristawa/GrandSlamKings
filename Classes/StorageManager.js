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
            if(i < 60) {
                img.style.height = `${Math.sin(Math.PI*i/60)*20+70}%`;
            } else if(i == 60) {
                img.style.height = '70%';
            }
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
            if(storageObj.loginInfo.day != Challenge.getDay()) {
                this.resetRecord('daily');
            }
            if(storageObj.loginInfo.week != Challenge.getWeek()) {
                this.resetRecord('weekly');
            }
        
            CharacterSlider.getCharacters();
            Tournament.getTournaments();
            DailyChallenge.getChallenges();
            WeeklyChallenge.getChallenges();
            Achievement.getAchievements();
        } else {
            storageObj = {
                version: 0.9,
                coins: 0,
                characters: [JSON.parse(JSON.stringify(CharacterSlider.defaultCharacter))],
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
            Tournament.getTournaments();
            DailyChallenge.getChallenges();
            WeeklyChallenge.getChallenges();
            Achievement.getAchievements();
        }
        let innerHTML = document.querySelector('div.stats > .statsHolder > div.easy').innerHTML;
        Object.keys(storageObj.record.total.wins).forEach(key => {
            if(key != 'tournaments') {
                let div = document.createElement('div');
                div.innerHTML = innerHTML;
                div.classList.add(key);
                div.querySelector('.type').innerHTML = `${key[0].toUpperCase()}${key.substring(1)}:&nbsp;`;
                div.querySelector('.won').innerHTML = storageObj.record.total.wins[key].matches;
                div.querySelector('.lost').innerHTML = storageObj.record.total.losses[key].matches;
                document.querySelector('div.stats > .statsHolder').appendChild(div);
            }
        });
        document.querySelector('div.stats > .statsHolder > div.easy').remove();
        StorageManager.incrementCoins(0);
        StorageManager.save();
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
                },
                tournaments: {
                    grandSlams: 0,
                    ATPWTATours: 0,
                    challengerTournaments: 0,
                    total: 0
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

    static updateCharacters() {
        storageObj.characters = [CharacterSlider.defaultCharacter, ...CharacterSlider.characters];
        this.save();
    }
}
class Tournament extends Logic {

    static tournaments = {
        grandSlams: [
            {
                name: "US Open",
                difficulty: 9,
                type: "Grand Slam",
                key: 'grandSlams',
                rounds: 5,
                color: 'rgb(0, 51, 102)'
            },
            {
                name: "Australian Open",
                difficulty: 9,
                type: "Grand Slam",
                key: 'grandSlams',
                rounds: 5,
                color: 'rgb(0, 102, 204)'
            },
            {
                name: "Wimbledon",
                difficulty: 9,
                type: "Grand Slam",
                key: 'grandSlams',
                rounds: 5,
                color: 'rgb(0, 128, 0)'
            },
            {
                name: "French Open",
                difficulty: 10,
                type: "Grand Slam",
                key: 'grandSlams',
                rounds: 5,
                color: 'rgb(222, 125, 44)'
            }
        ],
        ATPWTATours: [
            {
                name: "Miami Open",
                difficulty: 7,
                type: "ATP/WTA 1000",
                key: 'ATPWTATours',
                rounds: 4,
                color: 'rgb(102, 51, 153)'
            },
            {
                name: "Madrid Open",
                difficulty: 7,
                type: "ATP/WTA 1000",
                key: 'ATPWTATours',
                rounds: 4,
                color: 'rgb(204, 102, 51)'
            },
            {
                name: "Cincinnati Masters",
                difficulty: 7,
                type: "ATP/WTA 1000",
                key: 'ATPWTATours',
                rounds: 4,
                color: 'rgb(30, 144, 255)'
            },
            {
                name: "Indian Wells",
                difficulty: 8,
                type: "ATP/WTA 1000",
                key: 'ATPWTATours',
                rounds: 4,
                color: 'rgb(34, 139, 34)'
            }
        ],
        challengerTournaments: [
            {
                name: "Aix-en-Provence Challenger",
                difficulty: 6,
                type: "ATP Challenger 175",
                key: 'challengerTournaments',
                rounds: 3,
                color: 'rgb(210, 105, 30)'
            },
            {
                name: "Heilbronn Challenger",
                difficulty: 5,
                type: "ATP Challenger 125",
                key: 'challengerTournaments',
                rounds: 3,
                color: 'rgb(200, 92, 30)'
            },
            {
                name: "Surbiton Trophy",
                difficulty: 5,
                type: "ATP Challenger 125",
                key: 'challengerTournaments',
                rounds: 3,
                color: 'rgb(0, 100, 0)'
            },
            {
                name: "Seoul Challenger",
                difficulty: 5,
                type: "ATP Challenger 125",
                key: 'challengerTournaments',
                rounds: 3,
                color: 'rgb(70, 130, 180)'
            }
        ]        
    }

    static tournamentRewards = [0, 0, 0, 0, 0,
        600,
        750,
        1200,
        1500,
        2500,
        3000
    ];

    static tournamentDifficulties = ['', '', '', '', '',
        'Easy',
        'Medium',
        'Hard',
        'Expert',
        'Extreme',
        'Legendary'
    ];

    static roundTranslations = [
        '',
        'Finals',
        'Semifinals',
        'Quarterfinals',
        'Round of 16',
        'Round of 32'
    ]

    static getTournaments() {
        if(storageObj.todaysTournaments == undefined) {
            storageObj.todaysTournaments = {
                available: [],
                completed: [],
                current: null
            };
        } else if(storageObj.todaysTournaments.current != null) {
            storageObj.todaysTournaments.current = new Tournament(storageObj.todaysTournaments.current);
        }
        if(storageObj.loginInfo.day != Challenge.getDay()) {
            storageObj.todaysTournaments.completed = [];
        }
        if(!(storageObj.todaysTournaments.available.length > 0 && storageObj.loginInfo.day == Challenge.getDay())) {
            storageObj.todaysTournaments.available = [];
            let tournaments = [];
            let tournamentTypes = Object.keys(this.tournaments);
            let allowGrandSlam = true;
            storageObj.todaysTournaments.completed.forEach(tournament => {
                if(tournament.type == "Grand Slam") {
                    allowGrandSlam = false;
                    let div = document.createElement('div');
                    div.classList.add('tournamentDisplay');
                    div.classList.add('inactiveTournament');
                    div.innerHTML = document.querySelector('#tournamentTemplate').innerHTML;
                    div.querySelector('.title').innerHTML = tournament.name;
                    div.querySelector('.reward > span').innerHTML = tournament.reward;
                    div.querySelector('.rounds > span.alter').innerHTML = tournament.rounds;
                    div.querySelector('.difficulty > span.alter').innerHTML = Tournament.tournamentDifficulties[tournament.difficulty];
                    div.style.backgroundColor = tournament.color;
                    document.querySelector('.availableTournamentsHolder').appendChild(div);
                }
            });
            tournamentTypes.forEach(type => {
                if(type == "grandSlams" && !allowGrandSlam) return;
                let i = Math.floor(Math.random() * this.tournaments[type].length);
                let tournament = this.tournaments[type][i];
                tournaments.push(new Tournament(tournament));
            });
            storageObj.todaysTournaments.available = tournaments;
        } else {
            storageObj.todaysTournaments.completed.forEach(tournament => {
                if(tournament.type == "Grand Slam") {
                    let div = document.createElement('div');
                    div.classList.add('tournamentDisplay');
                    div.classList.add('inactiveTournament');
                    div.innerHTML = document.querySelector('#tournamentTemplate').innerHTML;
                    div.querySelector('.title').innerHTML = tournament.name;
                    div.querySelector('.reward > span').innerHTML = tournament.reward;
                    div.querySelector('.rounds > span.alter').innerHTML = tournament.rounds;
                    div.querySelector('.difficulty > span.alter').innerHTML = Tournament.tournamentDifficulties[tournament.difficulty];
                    div.style.backgroundColor = tournament.color;
                    document.querySelector('.availableTournamentsHolder').appendChild(div);
                }
            });
            for(let i = 0; i < storageObj.todaysTournaments.available.length; i++) {
                storageObj.todaysTournaments.available[i] = new Tournament(storageObj.todaysTournaments.available[i]);
            }
        }

        this.setEventListeners();
    }

    static setEventListeners() {
        document.querySelector('.tournaments button.advertise').addEventListener('mouseover', () => {
            if(storageObj.todaysTournaments.current != null) {
                storageObj.todaysTournaments.current.displayNewReward();
            }
        });

        document.querySelector('.tournaments button.advertise').addEventListener('mouseout', () => {
            if(storageObj.todaysTournaments.current != null) {
                storageObj.todaysTournaments.current.div.querySelector('div.reward > span').innerHTML = storageObj.todaysTournaments.current.reward;
                storageObj.todaysTournaments.current.div.querySelector('div.reward > span').style.color = 'white';
            }
        });

        document.querySelector('.tournaments button.advertise').addEventListener('click', () => {
            if(storageObj.todaysTournaments.current != null) {
                storageObj.todaysTournaments.current.advertise();
            }
        });

        document.querySelector('.tournaments button.play').addEventListener('click', () => {
            if(storageObj.todaysTournaments.current != null) {
                storageObj.todaysTournaments.current.newMatch();
            }
        });

        document.querySelector('.tournaments button.withdraw').addEventListener('click', () => {
            if(storageObj.todaysTournaments.current != null) {
                storageObj.todaysTournaments.current.end();
            }
        });
    }

    constructor(obj, active = false) {
        super();
        Object.keys(obj).forEach(key => {
            this[key] = obj[key];
        });
        this.active = active;
        if(this.round == undefined) this.round = this.rounds;
        if(this.reward == undefined) this.reward = Tournament.tournamentRewards[this.difficulty];
        if(this.advertisementNum == undefined) this.advertisementNum = 0;
        if(this.active) this.getAdvertisement();

        this.makeDiv();
        
        this.div.addEventListener('click', () => {
            if(this.div.classList.contains('inactiveTournament')) return;
            this.setActive();
            if(this.type != "Grand Slam") {
                let i = Math.floor(Math.random() * Tournament.tournaments[this.key].length);
                let t = Tournament.tournaments[this.key][i];
                storageObj.todaysTournaments.available.push(new Tournament(t));
            }
        })
    }

    getOpponentArr() {
        if(this.opponentArr == undefined) {
            let allOpponents = [...HomeScreen.exhibitionSlider.arr.slice(4, this.difficulty+3)];

            let maxCharacterNum = this.difficulty < 7 ? 2 : 3;
            while(allOpponents.length < 2**this.rounds-1) {
                let newOpponent;
                if(Math.random() < (this.difficulty-4)/5) {
                    newOpponent = CharacterSlider.opponents[maxCharacterNum];
                } else {
                    newOpponent = CharacterSlider.opponents[Math.floor(Math.random()*maxCharacterNum)];
                }
                allOpponents.push(newOpponent);
            }

            this.opponentArr = [];
            for(let i = 0; i < this.rounds; i++) {
                this.opponentArr.push([]);
            }
            this.opponentArr[this.rounds-1][0] = [HomeScreen.characterSlider.selected, allOpponents.splice(Math.floor(Math.random()*allOpponents.length), 1)[0]];
            for(let i = 1; i < 2**this.rounds/2; i++) {
                let arr = [allOpponents.splice(Math.floor(Math.random()*allOpponents.length), 1)[0], allOpponents.splice(Math.floor(Math.random()*allOpponents.length), 1)[0]];
                this.opponentArr[this.rounds-1].push(arr);
            }
        } else {
            for(let i = 0; i < this.opponentArr.length; i++) {
                for(let j = 0; j < this.opponentArr[i].length; j++) {
                    let obj = this.opponentArr[i][j];
                    if(j == 0) {
                        obj[0] = HomeScreen.characterSlider.arr.find(character => character.name == obj[0].name);
                        this.opponentArr[i][j] = [obj[0], HomeScreen.exhibitionSlider.arr.find(character => character.name == obj[1].name)];
                    } else {
                        this.opponentArr[i][j] = [HomeScreen.exhibitionSlider.arr.find(character => character.name == obj[0].name), HomeScreen.exhibitionSlider.arr.find(character => character.name == obj[1].name)];
                    }
                }
            }
        }
    }

    makeDiv() {
        let div = document.createElement('div');
        this.div = div;
        div.classList.add('tournamentDisplay');
        div.innerHTML = document.querySelector('#tournamentTemplate').innerHTML;
        div.querySelector('.title').innerHTML = this.name;
        div.querySelector('.reward > span').innerHTML = this.reward;
        div.querySelector('.rounds > span.alter').innerHTML = this.rounds;
        div.querySelector('.difficulty > span.alter').innerHTML = Tournament.tournamentDifficulties[this.difficulty];
        div.style.backgroundColor = this.color;
        document.querySelector('.availableTournamentsHolder').appendChild(div);
    }

    setActive() {
        if(storageObj.todaysTournaments.current != null) {
            storageObj.todaysTournaments.current.div.remove();
        }
        this.active = true;
        let clone = this.div.cloneNode(true);
        clone.classList.add('tournamentDisplay');
        document.querySelector('.currentTournamentHolder').appendChild(clone);
        document.querySelector('.tournaments > div.first').classList.remove('noActiveTournaments');
        if(this.type != "Grand Slam") {
            this.div.remove();
        } else {
            this.div.classList.add('inactiveTournament');
        }
        this.div = clone;

        storageObj.todaysTournaments.current = this;
        document.querySelector('.tournaments .statsHolder > button > span.alter').innerHTML = Tournament.roundTranslations[this.round];

        storageObj.todaysTournaments.available = storageObj.todaysTournaments.available.filter(tournament => tournament != this);

        this.getAdvertisement();
        this.getOpponentArr();

        StorageManager.save();
    }

    getAdvertisement() {
        if(this.advertisementNum >= 2) {
            document.querySelector('.tournaments button.advertise').style.display = 'none';
            return;
        } else {
            document.querySelector('.tournaments button.advertise').style.display = 'flex';
        }
        this.advertisementCost = Math.round(this.reward/10*3 * (this.advertisementNum+1));
        this.newReward = Math.round((this.reward+this.advertisementCost) * (this.round*3/(10*this.rounds)+1));
        document.querySelector('.tournaments button.advertise span.alter').innerHTML = this.advertisementCost;
    }

    displayNewReward() {
        this.div.querySelector('div.reward > span').innerHTML = this.newReward;
        this.div.querySelector('div.reward > span').style.color = 'var(--upgradeColor)';
    }
    
    advertise() {
        if(storageObj.coins >= this.advertisementCost) {
            StorageManager.incrementCoins(-this.advertisementCost);
            this.reward = this.newReward;
            this.advertisementNum++;
            this.getAdvertisement();
            this.displayNewReward();
            StorageManager.save();
        }
    }

    newMatch() {
        let opponent = this.opponentArr[this.round-1][0][1];
        let sumOfStats = 0;
        Object.keys(opponent.stats).forEach(key => {
            if(!isNaN(opponent.stats[key].current)) sumOfStats += opponent.stats[key].current;
        });
        Match.setsToWin = 1;
        Match.winReward = Math.round(Match.setsToWin * 100 * (sumOfStats/4));
        new Match(1, [HomeScreen.characterSlider.selected, opponent], this);
    }

    matchEnded(winner) {
        this.round--;
        if(winner != 0) {
            this.end();
        } else {
            document.querySelector('.tournaments .statsHolder > button > span.alter').innerHTML = Tournament.roundTranslations[this.round];
            if(this.round == 0) {
                this.win();
            } else {
                for(let i = 0; i < 2**this.round/2; i++) {
                    let m1 = this.opponentArr[this.round][i][0];
                    let m2 = this.opponentArr[this.round][i][1];
                    let p1;
                    let p2;
                    if(m1.technique > m2.technique || i == 0) {
                        p1 = m1;
                    } else if(m2.technique > m1.technique) {
                        p1 = m2;
                    } else if(m1.speed > m2.speed) {
                        p1 = m1;
                    } else {
                        p1 = m2;
                    }
                    m1 = this.opponentArr[this.round][i+1][0];
                    m2 = this.opponentArr[this.round][i+1][1];
                    if(m1.technique > m2.technique) {
                        p2 = m1;
                    } else if(m2.technique > m1.technique) {
                        p2 = m2;
                    } else if(m1.speed > m2.speed) {
                        p2 = m1;
                    } else {
                        p2 = m2;
                    }
                    this.opponentArr[this.round-1].push([m1, m2]);
                }
            }
        }
    }

    win() {
        setTimeout(() => {
            StorageManager.incrementCoins(this.reward);
            this.end();
        }, 3000);
    }

    end() {
        storageObj.todaysTournaments.completed.push(this);
        storageObj.todaysTournaments.current = null;
        this.div.remove();
        document.querySelector('.tournaments > .first').classList.add('noActiveTournaments');
    }
}
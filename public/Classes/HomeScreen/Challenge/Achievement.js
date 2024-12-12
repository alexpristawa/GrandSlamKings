class Achievement extends Challenge{

    static achievements = [
        {
            description: "Serve the ball +n times",
            id: 0,
            progress: 0,
            frequency: "hit",
            collected: 0,
            baseReward: 50,
            levels: [
                {
                    name: "First Serve",
                    description: "Serve the ball for the first time",
                    n: 1
                },
                {
                    name: "More Serves",
                    n: 100
                }
            ]
        },
        {
            description: "Hit the ball +n times",
            id: 1,
            progress: 0,
            frequency: "hit",
            collected: 0,
            baseReward: 50,
            levels: [
                {
                    name: "First hit",
                    description: "Hit the ball for the first time",
                    n: 1
                },
                {
                    name: "More Hits",
                    n: 100
                }
            ]
        },
        {
            description: "Hit a slice +n times",
            id: 2,
            progress: 0,
            frequency: "hit",
            collected: 0,
            baseReward: 50,
            levels: [
                {
                    name: "First Slice",
                    description: "Hit the ball with a slice for the first time",
                    n: 1
                },
                {
                    name: "More Slices",
                    n: 100
                }
            ]
        },
        {
            description: "Hit the ball with topspin +n times",
            id: 3,
            progress: 0,
            frequency: 'hit',
            collected: 0,
            baseReward: 50,
            levels: [
               {
                    name: "First Topspin",
                    description: "Hit the ball with topspin for the first time",
                    n: 1
                },
                {
                    name: "More Topspins",
                    n: 100
                }
            ]
        },
        {
            description: "Win +n matches",
            id: 4,
            progress: 0,
            frequency: "match",
            collected: 0,
            baseReward: 50,
            levels: [
                {
                    name: "First Win",
                    description: "Win a match for the first time",
                    n: 1
                },
                {
                    name: "More Wins",
                    n: 10
                }
            ]
        },
        {
            description: "Win +n easy matches",
            id: 5,
            progress: 0,
            frequency: "match",
            collected: 0,
            baseReward: 50,
            levels: [
                {
                    name: "First Easy Win",
                    description: "Win an easy match for the first time",
                    n: 1
                },
                {
                    name: "More Easy Wins",
                    n: 10
                }
            ]
        },
        {
            description: "Win +n medium matches",
            id: 6,
            progress: 0,
            frequency: "match",
            collected: 0,
            baseReward: 100,
            levels: [
                {
                    name: "First Medium Win",
                    description: "Win a medium match for the first time",
                    n: 1
                },
                {
                    name: "More Medium Wins",
                    n: 10
                }
            ]
        },
        {
            description: "Win +n hard matches",
            id: 7,
            progress: 0,
            frequency: "match",
            collected: 0,
            baseReward: 150,
            levels: [
                {
                    name: "First Hard Win",
                    description: "Win a hard match for the first time",
                    n: 1
                },
                {
                    name: "More Hard Wins",
                    n: 10
                }
            ]
        },
        {
            description: "Win +n extreme matches",
            id: 8,
            progress: 0,
            frequency: "match",
            collected: 0,
            baseReward: 200,
            levels: [
                {
                    name: "First Extreme Win",
                    description: "Win an extreme match for the first time",
                    n: 1
                },
                {
                    name: "More Extreme Wins",
                    n: 10
                }
            ]
        },
        {
            description: "Complete +n daily challenges",
            id: 9,
            progress: 0,
            frequency: "challenge",
            collected: 0,
            baseReward: 50,
            count: 0,
            levels: [
                {
                    name: "First Daily Challenge",
                    description: "Complete a daily challenge for the first time",
                    n: 1
                },
                {
                    name: "More Daily Challenges",
                    n: 10
                }
            ]
        },
        {
            description: "Complete +n weekly challenges",
            id: 10,
            progress: 0,
            frequency: "challenge",
            collected: 0,
            baseReward: 50,
            count: 0,
            levels: [
                {
                    name: "First Weekly Challenge",
                    description: "Complete a weekly challenge for the first time",
                    n: 1
                },
                {
                    name: "More Weekly Challenges",
                    n: 10
                }
            ]
        }
    ];

    static getAchievements() {
        for(let i = 0; i < this.achievements.length; i++) {
            let id = this.achievements[i].id;
            let actualAchievement = this.achievements[i];
            let hasAchievement = false;
            storageObj.achievements.forEach(achievement => {
                if(achievement.id == id) {
                    hasAchievement = true;
                    Object.keys(actualAchievement).forEach(key => {
                        if(achievement[key] == undefined) {
                            achievement[key] = actualAchievement[key];
                        }
                    });
                }
            });
            if(!hasAchievement) {
                storageObj.achievements.push(this.achievements[i]);
            }
        }
        for(let i = 0; i < storageObj.achievements.length; i++) {
            storageObj.achievements[i] = new Achievement(storageObj.achievements[i]);
        }
    }

    constructor(obj) {
        super(obj);

        let div = document.createElement('div');
        div.innerHTML = document.querySelector('template#achievementTemplate').innerHTML;
        document.querySelector('.achievements .achievementsHolder').appendChild(div);

        this.div = div;
        this.statBar = div.querySelector('statBar > div');

        this.fillDiv();
    }

    update(check = true, info = {}) {
        if(this.progress >= this.levels.length) {
            return;
        }
        if(this.levels[this.progress].completed) {
            this.complete();
            return;
        }
        if(this.description == "Serve the ball +n times") {
            if(storageObj.record.total.serves >= this.levels[this.progress].n) {
                this.complete();
            }
            this.statBar.style.width = Math.min(storageObj.record.total.serves/this.levels[this.progress].n*100, 100) + '%';
        } else if(this.description == "Hit the ball +n times") {
            if(storageObj.record.total.racketHits >= this.levels[this.progress].n) {
                this.complete();
            }
            this.statBar.style.width = Math.min(storageObj.record.total.racketHits/this.levels[this.progress].n*100, 100) + '%';
        } else if(this.description == "Hit a slice +n times") {
            if(storageObj.record.total.slices >= this.levels[this.progress].n) {
                this.complete();
            }
            this.statBar.style.width = Math.min(storageObj.record.total.slices/this.levels[this.progress].n*100, 100) + '%';
        } else if(this.description == "Hit the ball with topspin +n times") {
            if(storageObj.record.total.topspins >= this.levels[this.progress].n) {
                this.complete();
            }
            this.statBar.style.width = Math.min(storageObj.record.total.topspins/this.levels[this.progress].n*100, 100) + '%';
        } else if(this.description == "Win +n matches") {
            if(storageObj.record.total.wins.total.matches >= this.levels[this.progress].n) {
                this.complete();
            }
            this.statBar.style.width = Math.min(storageObj.record.total.wins.total.matches/this.levels[this.progress].n*100, 100) + '%';
        } else if(this.description == "Win +n easy matches") {
            if(storageObj.record.total.wins.easy.matches >= this.levels[this.progress].n) {
                this.complete();
            }
            this.statBar.style.width = Math.min(storageObj.record.total.wins.easy.matches/this.levels[this.progress].n*100, 100) + '%';
        } else if(this.description == "Win +n medium matches") {
            if(storageObj.record.total.wins.medium.matches >= this.levels[this.progress].n) {
                this.complete();
            }
            this.statBar.style.width = Math.min(storageObj.record.total.wins.medium.matches/this.levels[this.progress].n*100, 100) + '%';
        } else if(this.description == "Win +n hard matches") {
            if(storageObj.record.total.wins.hard.matches >= this.levels[this.progress].n) {
                this.complete();
            }
            this.statBar.style.width = Math.min(storageObj.record.total.wins.hard.matches/this.levels[this.progress].n*100, 100) + '%';
        } else if(this.description == "Win +n extreme matches") {
            if(storageObj.record.total.wins.extreme.matches >= this.levels[this.progress].n) {
                this.complete();
            }
            this.statBar.style.width = Math.min(storageObj.record.total.wins.extreme.matches/this.levels[this.progress].n*100, 100) + '%';
        } else if(this.description == "Complete +n daily challenges") {
            if(check && info.type == 'daily') {
                this.count++;
                if(this.count >= this.levels[this.progress].n) {
                    this.complete();
                }
            }
            this.statBar.style.width = Math.min(this.count/this.levels[this.progress].n*100, 100) + '%';
        } else if(this.description == "Complete +n weekly challenges") {
            if(check && info.type == 'weekly') {
                this.count++;
                if(this.count >= this.levels[this.progress].n) {
                    this.complete();
                }
            }
            this.statBar.style.width = Math.min(this.count/this.levels[this.progress].n*100, 100) + '%';
        }
    }

    claimReward(getCoins = true) {
        super.claimReward(getCoins);
        this.fillDiv();
    }

    fillDiv() {
        let index = Math.min(this.progress, this.levels.length-1);

        this.div.querySelector('.first > .title').innerHTML = this.levels[index].name;
        if(this.levels[index].description != undefined) {
            this.div.querySelector('.description').innerHTML = this.levels[index].description;
        } else {
            let i = this.description.indexOf('+n');
            this.div.querySelector('.description').innerHTML = this.description.substring(0, i) + this.levels[index].n + this.description.substring(i+2);
        }

        this.div.querySelector('.reward > span').innerHTML = (1+index*3)*this.baseReward;
        if(this.progress < this.levels.length) {
            this.update(false);
        } else {
            this.statBar.style.width = '100%';
            this.div.classList.add('claimed');
        }
    }
}
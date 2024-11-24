class DailyChallenge extends Challenge {
    
    static challenges = [
        [
            {
                description: "Win a receiving game without losing a point",
                frequency: "game"
            },
            {
                description: "Win a point where the ball hits a racket exactly +n times",
                frequency: "point",
                n: 10
            },
            {
                description: "Win a point by vollying the ball",
                frequency: "point"
            }
        ],
        [
            {
                description: "Win +n sets",
                frequency: "set",
                n: 5
            },
            {
                description: "Win a match best of 5 sets",
                frequency: "match",
                n: 1
            },
            {
                description: "Win +n game",
                frequency: "game",
                n: 10,
                suffix: "s"
            }
        ],
        [
            {
                description: "Win +n match on extreme difficulty",
                frequency: "match",
                n: 1,
                suffix: "es"
            },
            {
                description: "Win +n tournament",
                frequency: "tournament",
                n: 1,
                suffix: "s"
            },
            {
                description: "Win a match without losing a game",
                frequency: "match"
            }
        ]
    ];

    static getChallenges() {
        let day = Challenge.getDay();
        for(let i = 0; i < 3; i++) {
            let collected = false;
            let completed = false;
            if(storageObj.dailyChallenges[i] != null && storageObj.loginInfo.day == day) {
                collected = storageObj.dailyChallenges[i].collected;
                completed = storageObj.dailyChallenges[i].completed;
            }
            storageObj.dailyChallenges[i] = new this(i, Math.floor(seededRandom(day, i)*this.challenges[i].length), collected, completed);
        }
    }

    constructor(i, j, collected = false, completed = false) {
        super(i, j);
        this.coinMultiplier = 1;
        storageObj.dailyChallenges[i] = this;
        this.collected = collected;
        this.completed = completed;
        localStorage.grandSlamKings = JSON.stringify(storageObj);

        this.time = 'daily';

        let div = document.createElement('div');
        div.innerHTML = document.querySelector('template#challengeTemplate').innerHTML;
        document.querySelector('.challenges .daily > .challengeHolder').appendChild(div);
        if(this.description.includes('+n') && this.suffix != undefined) {
            let index = this.description.slice(this.description.indexOf('+n')+3).indexOf(' ');
            if(index == -1) index = this.description.length;
            let text = this.description.replace('+n', this.n);
            if(this.n > 1) {
                text = text.substring(0, index) + this.suffix + text.substring(index);
            }
            div.querySelector('.name').innerHTML = text;
        } else {
            div.querySelector('.name').innerHTML = this.description.replace('+n', this.n);
        }
        div.querySelector('.reward').innerHTML = 50 + 100 * i;

        this.div = div;
        this.checkbox = div.querySelector('checkbox');
        this.statBar = div.querySelector('statBar > div');

        this.update(false);
    }
}
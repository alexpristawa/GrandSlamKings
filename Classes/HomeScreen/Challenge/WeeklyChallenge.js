class WeeklyChallenge extends Challenge {

    static challenges = [
        [
            {
                description: "Log in on 3 different days",
                frequency: 'login'
            }
        ],
        [
            {
                description: "Win a match on 3 different days",
                frequency: "match"
            }
        ],
        [
            {
                description: "Win +n tournament",
                n: 3,
                suffix: "s",
                frequency: "tournament"
            }
        ]
    ];

    constructor(i, j, collected = false, completed = false) {
        super(i, j);
        this.coinMultiplier = 3;
        storageObj.weeklyChallenges[i] = this;
        this.collected = collected;
        this.completed = completed;
        localStorage.grandSlamKings = JSON.stringify(storageObj);
        this.time = 'weekly';

        let div = document.createElement('div');
        div.innerHTML = document.querySelector('template#challengeTemplate').innerHTML;
        document.querySelector('.challenges .weekly > .challengeHolder').appendChild(div);
        if(this.description.includes('+n')) {
            let index = this.description.slice(this.description.indexOf('+n')+3).indexOf(' ');
            if(index == -1) index = this.description.length;
            let text = this.description.replace('+n', this.n);
            if(this.n > 1) {
                text = text.substring(0, index) + this.suffix + text.substring(index);
            }
            div.querySelector('.name').innerHTML = text;
        } else {
            div.querySelector('.name').innerHTML = this.description;
        }
        div.querySelector('.reward').innerHTML = 100 + 200 * i;

        this.div = div;
        this.checkbox = div.querySelector('checkbox');
        this.statBar = div.querySelector('statBar > div');

        this.update(false);
    }

    static getChallenges() {
        let week = Challenge.getWeek();
        for(let i = 0; i < 3; i++) {
            let collected = false;
            let completed = false;
            if(storageObj.weeklyChallenges[i] != null && storageObj.loginInfo.week == week) {
                collected = storageObj.weeklyChallenges[i].collected;
                completed = storageObj.weeklyChallenges[i].completed;
            }
            storageObj.weeklyChallenges[i] = new WeeklyChallenge(i, Math.floor(seededRandom(week, i)*this.challenges[i].length), collected, completed);
        }
    }
}
class Match extends Logic {

    static match = null;
    static set = null;
    static game = null;
    static point = null;
    static paused = false;

    static winReward = 300;
    static setsToWin = 1;

    constructor(numPlayers, players) {
        super();
        Match.match = this;
        Player.instantiate(numPlayers, players);

        this.difficulty = players[1].name.toLowerCase();
        if(!['easy', 'medium', 'hard', 'extreme'].includes(this.difficulty)) {
            this.difficulty = 'extreme';
        }

        this.score = [
            {
                points: 0,
                games: 0,
                sets: 0,
                gameScores: []
            },
            {
                points: 0,
                games: 0,
                sets: 0,
                gameScores: []
            }
        ];

        new Set(this);
        requestAnimationFrame(gameFunction);
    }

    setEnded(winner) {
        this.score[winner].sets++;
        Stat.updateStats("set", {difficulty: this.difficulty, won: winner == 0});
        StorageManager.resetRecord('set');
        if(this.score[winner].sets == Match.setsToWin) {
            Stat.updateStats("match", {difficulty: this.difficulty, won: winner == 0});
            StorageManager.resetRecord('match');
            Logic.exclamationMessage = winner == 0 ? 'You Won!':'You Lost!';
            Logic.updateMessage();
            return;
        }
        this.score[0].gameScores.push(this.score[0].games);
        this.score[1].gameScores.push(this.score[1].games);
        this.score[0].games = 0;
        this.score[1].games = 0;
        new Set(this);
    }

    static pause(paused = !this.paused) {
        this.paused = paused;
        let pauseMenu = document.getElementById('pauseMenu');
        if(!this.paused) {
            pauseMenu.style.display = 'none';
            previousTime = Date.now();
            requestAnimationFrame(gameFunction);
        } else {
            pauseMenu.style.display = 'flex';
            pauseMenu.querySelector('.coinAmount').innerHTML = Match.getForfeitCoins();;
        }
    }

    static forfeit() {
        document.getElementById('pauseMenu').style.display = 'none';
        Stat.updateStats("match", {difficulty: this.difficulty, won: false});
        StorageManager.resetRecord('match');
        HomeScreen.goToHomeScreen(Match.getForfeitCoins());
    }

    static getForfeitCoins() {
        let totalGames = (Match.setsToWin*2-1)*12;
        let gamesSoFar = Match.match.score[0].sets*6+Match.match.score[1].sets*6+Match.match.score[0].games+Match.match.score[1].games;
        return Math.round(Match.winReward/5 *(gamesSoFar/totalGames));
    }
}
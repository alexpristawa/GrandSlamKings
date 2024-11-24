class Set extends Logic{

    constructor(parent) {
        super();
        this.match = Match.match;
        this.parent = parent;
        Match.set = this;

        new Game(this);
    }

    gameEnded(winner) {
        this.match.score[winner].games++;
        Stat.updateStats("game", {difficulty: this.match.difficulty, won: winner == 0});
        StorageManager.resetRecord('game');
        if(this.match.score[winner].games == 7) {
            this.parent.setEnded(winner);
            return;
        }
        if(this.match.score[winner].games == 6 && Math.abs(this.match.score[0].games-this.match.score[1].games) >= 2) {
            this.parent.setEnded(winner);
            return;
        } else if(this.match.score[winner].games == 6 && this.match.score[Math.abs(winner-1)].games == 6) {
            new Tiebreaker(this, 7, winner);
            return;
        }
        new Game(this);
    }
}
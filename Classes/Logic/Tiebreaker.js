class Tiebreaker extends Logic {

    constructor(parent, pointsToWin, lastGameWon) {
        super();
        this.match = Match.match;
        this.parent = parent;
        Match.game = this;

        this.pointsToWin = pointsToWin;
        this.match.score[0].points = 0;
        this.match.score[1].points = 0;

        scoreboard.points[0].innerHTML = this.match.score[0].points;
        scoreboard.points[1].innerHTML = this.match.score[1].points;

        this.ogServing = lastGameWon;
        this.serving = this.ogServing;

        Logic.exclamationMessage = 'Tiebreaker!';
        Logic.updateMessage();

        this.servingSide = 'advantage';
        new Point(this);
    }

    pointEnded(winner) {
        this.match.score[winner].points++;
        
        let pointSum = this.match.score[0].points + this.match.score[1].points;
        this.serving = (pointSum-1)%4 < 2 ? Math.abs(this.ogServing-1) : this.ogServing;
        (this.match.score[0].points + this.match.score[1].points)%2 == 0 ? this.servingSide = 'advantage' : this.servingSide = 'deuce';

        Stat.updateStats("point", {difficulty: this.match.difficulty, won: winner == 0});
        StorageManager.resetRecord("point");
        if(this.match.score[winner].points >= this.pointsToWin && Math.abs(this.match.score[0].points-this.match.score[1].points) >= 2) {
            this.parent.gameEnded(winner);
            return;
        }

        scoreboard.points[0].innerHTML = this.match.score[0].points;
        scoreboard.points[1].innerHTML = this.match.score[1].points;
        new Point(this);
    }
}
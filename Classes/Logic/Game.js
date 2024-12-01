class Game extends Logic{

    static scoreArr = [0, 15, 30, 40, 45, 50];

    constructor(parent) {
        super();
        this.match = Match.match;
        this.parent = parent;
        Match.game = this;

        this.serving = (this.match.score[0].games + this.match.score[1].games) % 2;

        this.match.score[0].points = 0;
        this.match.score[1].points = 0;

        this.servingSide = 'deuce';
        new Point(this);
    }

    pointEnded(winner) {
        if(Render.hawkeyeVision && Render.hawkeyeVision.ended !== true) {
            Render.hawkeyeVision.pointWinner = winner;
            
            Render.hawkeyeVision.ogSx = Render.frame.sx;
            Render.hawkeyeVision.ogSy = Render.frame.sy;
            Render.hawkeyeVision.ogWidth = Render.frame.width;
            Render.hawkeyeVision.ogHeight = Render.frame.height;
            Render.hawkeyeVision.t = -0.5;
            if(Render.hawkeyeVision.dx != 0 && (Math.abs(Render.hawkeyeVision.dx)*(frame.windowWidth/frame.windowHeight) < Math.abs(Render.hawkeyeVision.dy) || Render.hawkeyeVision.dy == 0)) {
                Render.hawkeyeVision.width = 4*Math.abs(Render.hawkeyeVision.dx);
                Render.hawkeyeVision.height = Render.hawkeyeVision.width * (frame.windowHeight/frame.windowWidth);
                Render.hawkeyeVision.sx = Render.hawkeyeVision.x - 2*Math.abs(Render.hawkeyeVision.dx);
                Render.hawkeyeVision.sy = Render.hawkeyeVision.y - 2*Math.abs(Render.hawkeyeVision.dx) * (frame.windowHeight/frame.windowWidth);
            } else {
                Render.hawkeyeVision.height = 4*Math.abs(Render.hawkeyeVision.dy);
                console.log(Render.hawkeyeVision.height)
                Render.hawkeyeVision.width = Render.hawkeyeVision.height * (frame.windowWidth/frame.windowHeight);
                Render.hawkeyeVision.sy = Render.hawkeyeVision.y - 2*Math.abs(Render.hawkeyeVision.dy);
                Render.hawkeyeVision.sx = Render.hawkeyeVision.x - 2*Math.abs(Render.hawkeyeVision.dy) * (frame.windowWidth/frame.windowHeight);
            }
            Render.hawkeyeVision.sx += courtOffset.x/mScale;
            Render.hawkeyeVision.sy += courtOffset.y/mScale;
            Render.hawkeyeVision.totalTime = Math.max(0, Math.log(Render.ogDim.width/Render.hawkeyeVision.width)/Math.log(2)/4);
            return;
        }
        this.match.score[winner].points++;
        (this.match.score[0].points +this.match.score[1].points)%2 == 0 ? this.servingSide = 'deuce' : this.servingSide = 'advantage';

        Stat.updateStats("point", {difficulty: this.match.difficulty, won: winner == 0});
        StorageManager.resetRecord("point");
        if(this.match.score[winner].points == 5) {
            this.parent.gameEnded(winner);
            return;
        } else if(this.match.score[winner].points == 4) {
            if(this.match.score[Math.abs(winner-1)].points == 4) {
                this.match.score[winner].points = 3;
                this.match.score[Math.abs(winner-1)].points = 3;
            } else if(Math.abs(this.match.score[0].points-this.match.score[1].points) >= 2){
                this.parent.gameEnded(winner);
                return;
            }
        }

        new Point(this);
    }
}
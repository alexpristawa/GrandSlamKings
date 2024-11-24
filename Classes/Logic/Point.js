class Point extends Logic {

    constructor(parent) {
        super();
        this.match = Match.match;
        this.parent = parent;
        Match.point = this;

        this.bounceCount = 0;
        this.serveNum = 1;
        this.receiving = undefined;
        this.serveHappened = false;

        Logic.updateMessage(3000);
        Logic.updateScoreboard();
        this.started = false;
        setTimeout(() => {
            this.started = true;
        }, 3000);
    }

    ballBounce() {
        if(!this.started) return;
        this.bounceCount++;
        new BallShadow(Ball.ball.x, Ball.ball.y);
        
        if(this.bounceCount < 2) {
            if(this.receiving == undefined) { //If the ball is being served, check if it is in the service box
                let player = Player.players[Match.game.serving];
                let servingSideCorrect;
                this.parent.servingSide == 'deuce' ? servingSideCorrect = 1 : servingSideCorrect = -1;
                let netToBall = cDim.y/2 - Ball.ball.y;
                if(netToBall*player.directionCorrect > 0 && netToBall * player.directionCorrect < cDim.sby) {
                    let centerToBall = cDim.x/2-Ball.ball.x;
                    if(centerToBall*player.directionCorrect*servingSideCorrect > 0 && centerToBall*player.directionCorrect*servingSideCorrect < cDim.x/2) {
                        this.receiving = player.oppNum;
                        return;
                    }
                }

                //Serve is out because it didn't return
                if(this.serveNum == 1) {
                    Logic.exclamationMessage = 'Second serve!';
                    this.serveNum++;
                    Logic.updateMessage(1000);
                } else {
                    Logic.exclamationMessage = 'Double Fault!';
                    this.bounceCount = 3;
                    this.parent.pointEnded(Player.players[Match.game.serving].oppNum);
                }
            } else {
                let ballIn = false;
                if(Ball.ball.x > 0 && Ball.ball.x < cDim.x) {
                    if(this.receiving == 0) {
                        if(Ball.ball.y > 0 && Ball.ball.y < cDim.y/2) {
                            ballIn = true; 
                        }
                    } else {
                        if(Ball.ball.y > cDim.y/2 && Ball.ball.y < cDim.y) {
                            ballIn = true;
                        }
                    }
                }
                if(!ballIn) {
                    Logic.exclamationMessage = 'Out!';
                    this.bounceCount = 3;
                    this.parent.pointEnded(this.receiving);
                }
            }
        } else if(this.bounceCount == 2) {
            Logic.exclamationMessage = 'Splendid!';
            this.parent.pointEnded(Math.abs(this.receiving-1));
        }
    }
}
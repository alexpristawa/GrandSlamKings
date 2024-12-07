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
            this.bounceCount = 0;
        }, 3000);
    }

    ballBounce() {
        this.bounceCount++;
        if(this.bounceCount < 4) AudioManager.playBounceSound();
        if(!this.started) return;
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
                    this.bounceCount = 3;
                    Logic.updateMessage(1000);
                } else {
                    Logic.exclamationMessage = 'Double Fault!';
                    this.bounceCount = 3;
                    this.parent.pointEnded(Player.players[Match.game.serving].oppNum);
                }
            } else {
                let hawkeye = true;
                let ballIn = false;
                if(Ball.ball.x > 0 - Ball.radius && Ball.ball.x < cDim.x + Ball.radius) {
                    if(this.receiving == 0) {
                        if(Ball.ball.y > 0 - Ball.radius && Ball.ball.y < cDim.y/2 + Ball.radius) {
                            ballIn = true; 
                        }
                    } else {
                        if(Ball.ball.y > cDim.y/2 - Ball.radius && Ball.ball.y < cDim.y + Ball.radius) {
                            ballIn = true;
                        }
                    }
                }
                if(this.receiving == 0) {
                    if(Ball.ball.y > cDim.y/2 + Ball.radius) {
                        hawkeye = false;
                    }
                } else {
                    if(Ball.ball.y < cDim.y/2 - Ball.radius) {
                        hawkeye = false;
                    }
                }
                if(!ballIn) {
                    let outProperties = {
                        dx: 0,
                        dy: 0
                    };
                    outProperties.y = Ball.ball.y;
                    outProperties.x = Ball.ball.x;
                    if(Ball.ball.x < 0) {
                        outProperties.dx = Ball.ball.x + Ball.radius;
                        outProperties.x = Ball.ball.x + Ball.radius - outProperties.dx/2;
                    } else if(Ball.ball.x > cDim.x) {
                        outProperties.dx = Ball.ball.x - cDim.x - Ball.radius;
                        outProperties.x = Ball.ball.x - Ball.radius - outProperties.dx/2;
                    }
                    let directionCorrect = Player.players[this.receiving].directionCorrect;
                    if(-(Ball.ball.y - Ball.radius*directionCorrect - (cDim.y/2 + cDim.y/2 * directionCorrect))*directionCorrect < 0) {
                        outProperties.dy = Ball.ball.y - Ball.radius*directionCorrect - (cDim.y/2 + cDim.y/2 * directionCorrect);
                        outProperties.y = Ball.ball.y - Ball.radius*directionCorrect - outProperties.dy/2;
                    }
                    outProperties.dc = Math.sqrt(outProperties.dx**2 + outProperties.dy**2);
                    if(outProperties.dc < Ball.radius*15 && hawkeye) {
                        Render.hawkeyeVision = outProperties;
                    }
                    Logic.exclamationMessage = 'Out!';
                    this.bounceCount = 3;
                    this.parent.pointEnded(this.receiving);
                }
            }
        } else if(this.bounceCount == 2) {
            Logic.exclamationMessage = 'Point!';
            this.parent.pointEnded(Math.abs(this.receiving-1));
        }
    }
}
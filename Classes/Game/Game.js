class Game {

    static game = null;
    static scoreArr = [0, 15, 30, 40, 45, 50];

    constructor(players) {
        Player.instantiate();
        if(players == 1) {
            Player.players[1].ai = true;
        }
        ballAltitudeDiv.style.display = 'flex';
        document.querySelector('#scoreboard').style.display = 'flex';
        document.querySelector('#modes').style.display = 'none';

        Game.game = this;
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
        this.serving = 0;
        this.serveNum = 1;
        this.exclamationMessage = '';
        this.bounceCount = 0;
        this.newSet();
        requestAnimationFrame(gameFunction);
    }

    newSet(playerNum) {
        if(playerNum != undefined) {
            this.score[playerNum].sets++;
            if(this.score[playerNum].sets == 3) {
                this.exclamationMessage = 'Game, Set, Match!';
                this.updateMessage();
            } else {
                this.score[0].gameScores.push(this.score[0].games);
                this.score[1].gameScores.push(this.score[1].games);
                this.score[0].games = 0;
                this.score[1].games = 0;
            }
        }

        scoreboard.sets[0].innerHTML = this.score[0].sets;
        scoreboard.sets[1].innerHTML = this.score[1].sets;

        this.newGame();
    }

    newGame(playerNum) {
        if(playerNum != undefined) {
            this.score[playerNum].games++;
            if(this.score[playerNum].games == 6) {
                if(this.score[Math.abs(playerNum-1)].games < 5) {
                    this.newSet(playerNum);
                    return;
                }
            }
        }

        scoreboard.games[0].innerHTML = this.score[0].games;
        scoreboard.games[1].innerHTML = this.score[1].games;

        this.serving == 0 ? this.serving = 1 : this.serving = 0;
        scoreboard.serving[this.serving].style.display = 'flex';
        scoreboard.serving[Math.abs(this.serving-1)].style.display = 'none';
        this.servingSide = 'deuce';
        this.exclamationMessage = 'New Game!';
        this.score[0].points = 0;
        this.score[1].points = 0;

        this.newPoint();
    }

    newPoint(playerNum) {
        if(playerNum != undefined) {
            this.score[playerNum].points++;
            if(this.score[playerNum].points == 5) {
                this.newGame(playerNum);
                return;
            } else if(this.score[playerNum].points == 4) {
                if(this.score[Math.abs(playerNum-1)].points == 4) {
                    this.score[playerNum].points = 3;
                    this.score[Math.abs(playerNum-1)].points = 3;
                } else if(Math.abs(this.score[0].points-this.score[1].points) >= 2){
                    this.newGame(playerNum);
                    return;
                }
            }
        }

        scoreboard.points[0].innerHTML = Game.scoreArr[this.score[0].points];
        scoreboard.points[1].innerHTML = Game.scoreArr[this.score[1].points];

        this.serveNum = 1;
        this.receiving = undefined;
        (this.score[0].points +this.score[1].points)%2 == 0 ? this.servingSide = 'deuce' : this.servingSide = 'advantage';
        this.updateMessage();
    }

    updateMessage(ms = 3000, serve = true) {
        let div = document.getElementById('exclamation');
        div.fadeIn(250, 'flex');
        let bigDiv = document.querySelector('#exclamation > div:nth-child(1');
        bigDiv.innerHTML = this.exclamationMessage;
        if(this.exclamationMessage == 'Out!') {
            bigDiv.style.color = 'red';
        } else {
            bigDiv.style.color = 'white';
        }
        let smallDiv = document.querySelector('#exclamation > div:nth-child(2');
        smallDiv.innerHTML = `${Game.scoreArr[this.score[this.serving].points]}-${Game.scoreArr[this.score[Math.abs(this.serving-1)].points]}`;

        ms -= 500;
        setTimeout(() => {
            div.fadeOut(250, false);
            if(serve) {
                Player.players[this.serving].serve();
            }
        }, ms);
    }

    ballBounce() {
        this.bounceCount++;
        new BallShadow(Ball.ball.x, Ball.ball.y);
        if(this.bounceCount < 2) {
            if(this.receiving == undefined) { //If the ball is being served, check if it is in the service box
                let player = Player.players[this.serving];
                let servingSideCorrect;
                this.servingSide == 'deuce' ? servingSideCorrect = 1 : servingSideCorrect = -1;
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
                    this.exclamationMessage = 'Second serve!';
                    this.serveNum++;
                    this.updateMessage(1000);
                } else {
                    this.exclamationMessage = 'Out!';
                    this.bounceCount = 3;
                    this.newPoint(Player.players[this.serving].oppNum);
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
                    this.exclamationMessage = 'Out!';
                    this.bounceCount = 3;
                    this.newPoint(this.receiving);
                }
            }
        } else if(this.bounceCount == 2) {
            this.exclamationMessage = 'Splendid!';
            this.newPoint(Math.abs(this.receiving-1));
        }
    }
}
class Ai extends Player {

    constructor(num, obj) {
        super(num, obj);
        this.ai = true;
    }

    update() {
        super.update();
    }

    /**
     * Makes the AI move around the court
     */
    setMoveKeys() {
        //If the AI is receiving, move based on the ball
        if(Game.game.receiving == this.num) {
            let baseline = cDim.y;
            let factor = (baseline-Ball.ball.y) / Ball.ball.vVelocity;
            let x = Ball.ball.x + Ball.ball.hVelocity * factor;

            //Moves the AI based on how close it is to the ball (doesn't move if within 1/20 of the court's dimensions)
            if(x < this.x - cDim.y*0.05) {
                keyboard[this.keybinds.left] = true;
            } else if(x < this.x) {
                keyboard[this.keybinds.right] = true;
            } else if(x > this.x + cDim.y*0.05) {
                keyboard[this.keybinds.right] = true;
            } else {
                keyboard[this.keybinds.left] = true;
            }

            //If the ball is moving slowly, go up to reach it. If the ball is moving fast, go down to get more time
            if(Math.abs(Ball.ball.vVelocity) < 15) {
                keyboard[this.keybinds.up] = true;
            } else if(Math.abs(Ball.ball.vVelocity) > 30) {
                keyboard[this.keybinds.down] = true;
            }
        } else {
            if(Game.game.receiving == undefined) {
                //Checks if the AI is serving
                if(Game.game.serving == this.num) {
                    this.serveMechanics();
                }
            } else {
                //If the other player is receiving, move to the center of the court
                if(this.x > cDim.x*0.55 + cDim.x*0.15*(2-this.info.stats.technique)) {
                    keyboard[this.keybinds.left] = true;
                } else if(this.x < cDim.x*0.45) {
                    keyboard[this.keybinds.right] = true;
                }
            }
            if(this.y < cDim.y*0.95) {
                keyboard[this.keybinds.down] = true;
            } else if(this.y > cDim.y * 1.05) {
                keyboard[this.keybinds.up] = true;
            }
        }
    }

    getHitKey() {
        let dy = this.directionCorrect * (this.y - this.width/2*this.directionCorrect - Ball.ball.y);
        let dx = Ball.ball.x - this.x;
        let angle = Math.atan2(dy, dx);

        //If the hit angle hasn't been determined yet, determine it
        if(this.aiDesiredAngle == undefined) {
            let fix = 1;
            if(Ball.ball.x >= this.x) {
                fix = -1;
            }

            //Determines if, when the ball's y is the same as the opponents, the ball's x will be farther from the opponent based on the corner it was hit to
            let slope1 = this.y/-this.x;
            let slope2 = this.y/(cDim.x-this.x);
            let dy = this.y - this.opp.y;
            let x1 = dy/slope1 + this.x;
            let x2 = dy/slope2 + this.x;
            let dx1 = Math.abs(x1 - this.opp.x);
            let dx2 = Math.abs(x2 - this.opp.x);
            if(dx1 < dx2) {
                this.aiDesiredAngle = Math.atan2(this.y, cDim.x-this.x) + Math.PI/2 * fix
            } else {
                this.aiDesiredAngle = Math.atan2(this.y, -this.x) + Math.PI/2 * fix
            }
            if(this.aiDesiredAngle > Math.PI) {
                this.aiDesiredAngle -= 2*Math.PI;
            }
        }

        let prev = this.aiAngleWas; //The previous angle sign
        this.aiAngleWas = Math.sign(angle-this.aiDesiredAngle); //Either 1 or -1 based on if the angle is greater or less than the desired angle

        //If the angle is close to the desired angle or went past the desired angle, hit the ball
        if(Math.abs(angle - this.aiDesiredAngle) < Math.PI/50 || (prev != undefined && this.aiAngleWas == prev)) {
            this.keybinds.hit = this.keybinds.topspin;
            this.keybinds.remember = this.keybinds.hit;
            this.aiAngleWas = undefined;
            keyboard[this.keybinds.hit] = true;
            return this.keybinds.hit;
        }
    }

    serveMechanics() {
        if(Ball.ball == undefined) {
            if(keyboardQueries[this.keybinds.flat]) {
                keyboardQueries[this.keybinds.flat]();
                keyboardOffQueries[this.keybinds.flat]();
            }
        } else if(Ball.ball.zVelocity < 0) {
            let highestHeight = Player.heightToShoulder+Player.shoulderToRacket;
            let lowestHeight = highestHeight - Player.headHeight*4;
            let factor = ((Ball.ball.z-lowestHeight)/(highestHeight-lowestHeight));
            if(factor > 0.75 && factor < 1) {
                if(keyboardQueries[this.keybinds.flat]) {
                    keyboardQueries[this.keybinds.flat]();
                }
            }
        } 
    }
}
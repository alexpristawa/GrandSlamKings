class Player {

    static players = [null, null];
    static height = 1.829; //Meters
    static heightToShoulder = 1.5;
    static shoulderToRacket = 1.6;
    static headHeight = 0.3;
    static centerToShoulder = 0.25;

    constructor(num) {
        this.num = num;
        this.num == 0 ? this.oppNum = 1 : this.oppNum = 0;
        this.x = cDim.x/2;
        this.ai = false;
        if(num == 0) {
            this.keybinds = {
                up: 'w',
                left: 'a',
                down: 's',
                right: 'd',
                flat: ' ',
                slice: "r",
                topspin: 'e',
                lob: 'q'
            };
            this.y = cDim.y/4;
            this.directionCorrect = -1;
        } else {
            this.keybinds = {
                up: 'i',
                left: 'j',
                down: 'k',
                right: 'l',
                flat: ' ',
                slice: 'y',
                topspin: 'u'
            };
            this.y = cDim.y*3/4;
            this.directionCorrect = 1;
        }
        this.width = 0.75;
        this.height = 0.75;
        this.hVelocity = 0;
        this.vVelocity = 0;
        this.maxVelocity = 3.658; //Cover horizontal distance in 2.25 seconds
        this.maxAcceleration = this.maxVelocity*4;
        this.windingUp = undefined;
        this.fastestSwing = 50;
    }

    static instantiate(players) {
        Player.players[0] = new Player(0);
        players == 1 ? Player.players[1] = new Ai(1) : Player.players[1] = new Player(1);
        Player.players[0].opp = Player.players[1];
        Player.players[1].opp = Player.players[0];
    }

    static updatePlayers() {
        Player.players[0].update();
        Player.players[1].update();
        Player.players[0].draw();
        Player.players[1].draw();
    }

    serve() {
        Game.game.bounceCount = 0;
        Ball.ball = undefined;
        this.alreadyTried = false;
        ballAltitudeTarget.style.display = 'flex';
        this.x = cDim.x/2;
        this.opp.x = cDim.x/2;

        if(this.num == 0) {
            this.y = -this.height/2;
            this.opp.y = cDim.y/2 + cDim.sby + cDim.bby/2;
        } else {
            this.y = cDim.y + this.height/2;
            this.opp.y = cDim.y/2 - cDim.sby - cDim.bby/2;
        }
        if(Game.game.servingSide == 'deuce') {
            this.x += this.width/2 * this.directionCorrect;
            this.opp.x -= cDim.x*0.3 * this.directionCorrect;
        } else {
            this.x -= this.width/2 * this.directionCorrect;
            this.opp.x += cDim.x*0.3 * this.directionCorrect;
        }

        this.hVelocity = 0;
        this.vVelocity = 0;
        this.opp.hVelocity = 0;
        this.opp.vVelocity = 0;
        let serveSideCorrect;
        Game.game.servingSide == 'deuce' ? serveSideCorrect = 1 : serveSideCorrect = -1;
        this.angle = (90 + 90*this.directionCorrect + 5*serveSideCorrect)/180*Math.PI; //Since page dimensions are quadrant 4, 180 degrees is 0 degrees
        keyboardQueries[this.keybinds.flat] = () => {
            new Ball(this.x, this.y-this.height*this.directionCorrect, 1, 0, 0, Physics.g, 0, 0, 0);

            let keys = [this.keybinds.flat, this.keybinds.slice, this.keybinds.topspin, this.keybinds.lob];
            let Function = () => {
                keys.forEach(key => {
                    keyboardQueries[key] = () => {
                        let serveType = getKeyByValue(this.keybinds, key);
                        Physics.serveCollision(Ball.ball, serveType);
                        for(let i = 0; i < keys.length; i++) {
                            keyboardQueries[keys[i]] = undefined;
                        }
                    }
                    keyboardOffQueries[this.keybinds.flat] = undefined;
                });
            }
            keyboardQueries[this.keybinds.flat] = undefined;
            keyboardOffQueries[this.keybinds.flat] = Function;
        }
    }

    update() {
        //Moves the player based on the keyboard inputs
        this.move();

        if(Game.game.receiving == this.num && Ball.ball != undefined) {

            //Runs if the player can reach the ball
            if((this.x-Ball.ball.x)**2 + (this.y-Ball.ball.y)**2 < (Player.shoulderToRacket + Player.centerToShoulder)**2) {
                let dy = this.directionCorrect * (this.y - Ball.ball.y);
                let dx = Ball.ball.x - this.x;
                let angle = Math.atan2(dy, dx);
                if(Math.abs(dx) > this.width/3 || dy < 0) {
                    if(this.directionCorrect * (this.x - Ball.ball.x) < 0) {
                        angle += Math.PI/2;
                    } else {
                        angle -= Math.PI/2;
                    }
                } else {
                    if(this.directionCorrect == -1) {
                        angle += Math.PI;
                    }
                }

                let lineDistance = 2;
                let sx = Ball.ball.x*mScale + courtOffset.x;
                let sy = Ball.ball.y*mScale + courtOffset.y;

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5';
                ctx.lineWidth = 10;

                //If the player just started winding up
                if(keyboard[this.getHitKey()] && this.windingUp == undefined) {
                    this.windingUp = 0;
                    let key = this.getHitKey();
                    let type = Object.keys(this.keybinds).find(KEY => this.keybinds[KEY] == key && KEY != 'hit' && KEY != 'remember');
                    shotType.innerHTML = type;
                }

                //Runs while the player is holding their hit key
                if(this.windingUp != undefined) {
                    this.windingUp += potentialDeltaTime;

                    //Finds the type of hit associated with the key pressed
                    let oldKey = this.keybinds.hit;
                    let key = this.getHitKey();
                    if(key == 'undefined' && oldKey != undefined) key = oldKey;
                    let type = Object.keys(this.keybinds).find(KEY => this.keybinds[KEY] == key && KEY != 'hit' && KEY != 'remember');

                    //If the key is no longer being held, it hits the ball
                    if(!keyboard[this.getHitKey()]) {
                        this.swing(this.windingUp*60, angle, type);
                    } else if(this.windingUp > 0.5) { //If you've been holding down for over half a second, it swings with maximum power
                        this.swing(30, angle, type);
                    }
                    //Displays more power
                    lineDistance += this.windingUp*10;
                }

                if(this.ai) keyboard[this.getHitKey()] = false;

                //Makes the line longer if the player is winding up
                Canvas.line(sx, sy, sx + this.directionCorrect * lineDistance*mScale*Math.cos(angle), sy - lineDistance*mScale*Math.sin(angle), false);
            } else {
                this.windingUp = undefined;
            }
        } else this.aiDesiredAngle = undefined;
    }

    move() {
        let oldKeyboard = JSON.parse(JSON.stringify(keyboard));

        //Lets the ai manipulate the `keyboard` object (this is reset later)
        if(this.ai) this.setMoveKeys();

        let movedVertically = false;
        let movedHorizontally = false;
        let hAccelerationMultiplier = 1;
        let vAccelerationMultiplier = 1;
        if(!(keyboard[this.keybinds.up] && keyboard[this.keybinds.down])) {
            if(keyboard[this.keybinds.up] && this.vVelocity > 0 || keyboard[this.keybinds.down] && this.vVelocity < 0) {
                vAccelerationMultiplier = 2;
            }
        }
        if(!(keyboard[this.keybinds.left] && keyboard[this.keybinds.right])) {
            if(keyboard[this.keybinds.left] && this.hVelocity > 0 || keyboard[this.keybinds.right] && this.hVelocity < 0) {
                hAccelerationMultiplier = 2;
            }
        }

        if(keyboard[this.keybinds.up]) {
            this.vVelocity -= this.maxAcceleration*vAccelerationMultiplier*deltaTime;
            movedVertically = true;
        }
        if(keyboard[this.keybinds.down]) {
            this.vVelocity += this.maxAcceleration*vAccelerationMultiplier*deltaTime;
            movedVertically = !movedVertically;
        }
        if(!movedVertically) {
            //Decelerate at the same rate as acceleration
            let sign = Math.sign(this.vVelocity);
            this.vVelocity -= Math.sign(this.vVelocity)*this.maxAcceleration*deltaTime;
            if(sign != Math.sign(this.vVelocity)) {
                this.vVelocity = 0;
            }
        }
        if(keyboard[this.keybinds.left]) {
            movedHorizontally = true;
            this.hVelocity -= this.maxAcceleration*hAccelerationMultiplier*deltaTime;
        }
        if(keyboard[this.keybinds.right]) {
            movedHorizontally = !movedHorizontally;
            this.hVelocity += this.maxAcceleration*hAccelerationMultiplier*deltaTime;
        }
        if(!movedHorizontally) {
            //Decelerate at the same rate as acceleration
            let sign = Math.sign(this.hVelocity);
            this.hVelocity -= Math.sign(this.hVelocity)*this.maxAcceleration*deltaTime;
            if(sign != Math.sign(this.hVelocity)) {
                this.hVelocity = 0;
            }
        }

        if(Math.abs(this.hVelocity) > this.maxVelocity) {
            this.hVelocity = this.maxVelocity*Math.sign(this.hVelocity);
        }
        if(Math.abs(this.vVelocity) > this.maxVelocity) {
            this.vVelocity = this.maxVelocity*Math.sign(this.vVelocity);
        }
        this.x += this.hVelocity*deltaTime;
        this.y += this.vVelocity*deltaTime;

        keyboard = oldKeyboard;
    }

    swing(swingSpeed, angle, type) {
        let racketMomentumVector = swingSpeed * Physics.racketMass;
        let dy = Math.abs(Math.abs(this.y)-cDim.y/2);
        let dz = 1.5*Physics.netHeight * (dy/(cDim.y/2)) * (1.2**(-swingSpeed+15)+0.65);
        let zAngle = Math.atan2(dz, dy);
        let racketMomentum2D = Math.cos(zAngle) * racketMomentumVector;
        let racketMomentum = {
            x: -this.directionCorrect * racketMomentum2D * Math.cos(angle),
            y: racketMomentum2D * Math.sin(angle),
            z: racketMomentumVector * Math.sin(zAngle)
        };

        let ballMomentum = {
            x: Ball.mass * Ball.ball.hVelocity * 0.5,
            y: Ball.mass * Ball.ball.vVelocity * 0.5,
            /*z: Ball.mass * Ball.ball.zVelocity*/
            z: 0
        };
        
        ballMomentum.x += racketMomentum.x/4;
        ballMomentum.y += racketMomentum.y/4;
        ballMomentum.z += racketMomentum.z/4;

        if(Ball.ball.z > 2) {
            let p = Ball.ball.z/dy;
            ballMomentum.z = -ballMomentum.y * p;
            ballMomentum.y *= 4;
            Ball.ball.xAngularVelocity = 0;
        }

        Ball.ball.hVelocity = -ballMomentum.x/Ball.mass;
        Ball.ball.vVelocity = -ballMomentum.y/Ball.mass;
        Ball.ball.zVelocity = ballMomentum.z/Ball.mass;

        this.windingUp = undefined;
        Game.game.bounceCount = 0;
        Game.game.receiving = this.oppNum;

        Ball.ball.xAngularVelocity /= 5;
        Ball.ball.yAngularVelocity /= 5;
        Ball.ball.zAngularVelocity /= 5;

        if(type == 'slice') {
            Ball.ball.xAngularVelocity -= this.directionCorrect * 7*Math.PI;
            Ball.ball.hVelocity /= 2;
            Ball.ball.vVelocity /= 1.5;
            Ball.ball.zVelocity *= 2;
        } else if(type == 'topspin') {
            Ball.ball.xAngularVelocity += this.directionCorrect * 4*Math.PI;
        }

        
        setTimeout(() => {
            shotType.fadeOut(250, false);
            setTimeout(() => {
                shotType.innerHTML = '';
                shotType.style.display = 'flex';
                shotType.style.opacity = 1;
            }, 250);
        }, 750);
    }

    getHitKey() {
        let result = 'undefined';

        //If the player is already holding a key, return that key
        if(this.keybinds.hit != undefined) {
            if(keyboard[this.keybinds.hit]) {
                return this.keybinds.hit;
            } else { //If the player is no longer holding the key, remember the key and return undefined
                this.keybinds.remember = this.keybinds.hit;
                this.keybinds.hit = undefined;
                return 'undefined';
            }
        }

        //If the player was not already holding a key, return the current key press
        if(keyboard[this.keybinds.flat]){
            result = this.keybinds.flat;
        } else if(keyboard[this.keybinds.slice]) {
            result = this.keybinds.slice
        } else if(keyboard[this.keybinds.topspin]) {
            result = this.keybinds.topspin;
        } else if(keyboard[this.keybinds.lob]) {
            result = this.keybinds.lob;
        }

        if(result != 'undefined') {
            this.keybinds.hit = result;
            this.keybinds.remember = this.keybinds.hit;
        } else {
            this.keybinds.hit = undefined;
        }
        return result;
    }

    draw() {
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(mScale * (this.x - this.width/2)+courtOffset.x, mScale*(this.y - this.height/2)+courtOffset.y, mScale*this.width, mScale*this.height);
    }
}
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

    static instantiate() {
        Player.players[0] = new Player(0);
        Player.players[1] = new Player(1);
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
            this.opp.x -= cDim.x/4 * this.directionCorrect;
        } else {
            this.x -= this.width/2 * this.directionCorrect;
            this.opp.x += cDim.x/4 * this.directionCorrect;
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
        let oldKeyboard = JSON.parse(JSON.stringify(keyboard));
        if(this.ai) {
            if(Game.game.receiving == this.num) {
                let baseline = cDim.y/2 + cDim.y/2 * this.directionCorrect;
                let factor = (baseline-Ball.ball.y) / Ball.ball.vVelocity;
                let x = Ball.ball.x + Ball.ball.hVelocity * factor;
                if(Math.abs(Ball.ball.y - this.y) < (Player.centerToShoulder + Player.shoulderToRacket)*2) {
                    x = Ball.ball.x;
                }
                if(x < this.x - cDim.y*0.05) {
                    keyboard[this.keybinds.left] = true;
                } else if(x < this.x) {
                    keyboard[this.keybinds.right] = true;
                } else if(x > this.x + cDim.y*0.05) {
                    keyboard[this.keybinds.right] = true;
                } else {
                    keyboard[this.keybinds.left] = true;
                }

                if(Math.abs(Ball.ball.vVelocity) < 15) {
                    if(this.directionCorrect == 1) {
                        keyboard[this.keybinds.up] = true;
                    } else {
                        keyboard[this.keybinds.down] = true;
                    }
                } else if(Math.abs(Ball.ball.vVelocity) > 30) {
                    if(this.directionCorrect == 1) {
                        keyboard[this.keybinds.down] = true;
                    } else {
                        keyboard[this.keybinds.up] = true;
                    }
                }
            } else {
                if(Game.game.receiving == undefined) {
                    if(Game.game.serving == this.num) {
                        if(Ball.ball == undefined) {
                            if(keyboardQueries[this.keybinds.flat]) {
                                keyboardQueries[this.keybinds.flat]();
                                keyboardOffQueries[this.keybinds.flat]();
                            }
                        } else if(Ball.ball.zVelocity < 0) {
                            let highestHeight = Player.heightToShoulder+Player.shoulderToRacket;
                            let lowestHeight = highestHeight - Player.headHeight*4;
                            let factor = ((Ball.ball.z-lowestHeight)/(highestHeight-lowestHeight));
                            if(factor > 0.25 && factor < 0.75) {
                                if(keyboardQueries[this.keybinds.flat]) {
                                    keyboardQueries[this.keybinds.flat]();
                                }
                            }
                        } 
                    }
                } else if(this.x > cDim.x*0.55) {
                    keyboard[this.keybinds.left] = true;
                } else if(this.x < cDim.x*0.45) {
                    keyboard[this.keybinds.right] = true;
                }

                if(this.directionCorrect == -1) {
                    if(this.y < -cDim.y*0.05) {
                        keyboard[this.keybinds.up] = true;
                    } else if(this.y > cDim.y * 0.5) {
                        keyboard[this.keybinds.down] = true;
                    }
                } else {
                    if(this.y < cDim.y*0.95) {
                        keyboard[this.keybinds.down] = true;
                    } else if(this.y > cDim.y * 1.05) {
                        keyboard[this.keybinds.up] = true;
                    }
                }
            }
        }
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

        keyboard = oldKeyboard;

        if(Math.abs(this.hVelocity) > this.maxVelocity) {
            this.hVelocity = this.maxVelocity*Math.sign(this.hVelocity);
        }
        if(Math.abs(this.vVelocity) > this.maxVelocity) {
            this.vVelocity = this.maxVelocity*Math.sign(this.vVelocity);
        }
        this.x += this.hVelocity*deltaTime;
        this.y += this.vVelocity*deltaTime;


        if(Game.game.receiving == this.num && Ball.ball != undefined) {
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

                if(keyboard[this.getHitKey()] && this.windingUp == undefined) {
                    this.windingUp = 0;
                    let key = this.getHitKey();
                    let type = Object.keys(this.keybinds).find(KEY => this.keybinds[KEY] == key && KEY != 'hit' && KEY != 'remember');
                    shotType.innerHTML = type;
                }
                if(this.windingUp != undefined) {
                    this.windingUp += potentialDeltaTime;
                    let oldKey = this.keybinds.hit;
                    if(oldKey == undefined && this.keybinds.remember != undefined) oldKey = this.keybinds.remember;
                    let key = this.getHitKey();
                    if(key == 'undefined' && oldKey != undefined) key = oldKey;
                    let type = Object.keys(this.keybinds).find(KEY => this.keybinds[KEY] == key && KEY != 'hit' && KEY != 'remember');

                    if(this.ai && this.windingUp >= 0.5) {
                        this.swing(30, angle, type);
                    }
                    if(!keyboard[this.getHitKey()]) {
                        this.swing(this.windingUp*60, angle, type);
                    } else if(this.windingUp > 0.5) {
                        this.swing(30, angle, type);
                    }
                    lineDistance += this.windingUp*10;
                }

                if(this.ai) keyboard[this.getHitKey()] = false;

                Canvas.line(sx, sy, sx + this.directionCorrect * lineDistance*mScale*Math.cos(angle), sy - lineDistance*mScale*Math.sin(angle), false);
            } else {
                this.windingUp = undefined;
            }
        } else this.aiDesiredAngle = undefined;
    }

    swing(swingSpeed, angle, type) {
        let racketMomentumVector = swingSpeed * Physics.racketMass;
        let dy = Math.abs(Math.abs(this.y)-cDim.y/2);
        let dz = Math.max(1.5*Physics.netHeight-Ball.ball.z + 3*2**(-dy) - (swingSpeed-10)/50 + 10*1.25**(-swingSpeed), 0);
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

        if(Ball.ball.z > 3) {
            let p = Ball.ball.z/dy;
            ballMomentum.z = -ballMomentum.y * p;
            ballMomentum.y*=2;
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
        let dy = this.directionCorrect * (this.y - Ball.ball.y);
        let dx = Ball.ball.x - this.x;
        let angle = Math.atan2(dy, dx);
        let desiredY = cDim.y/2 + cDim.y/2 * -this.directionCorrect;
        if(this.ai && Math.abs(Ball.ball.y - this.y) < (Player.shoulderToRacket + Player.centerToShoulder)/2) {
            if(this.aiDesiredAngle == undefined) {
                let fix = 1;
                if(Ball.ball.x >= this.x) {
                    fix = -1;
                }
                this.aiDesiredAngle = Math.atan2(this.y-desiredY, cDim.x/2-this.x) + Math.PI/2 * fix + Math.random()*Math.PI/10 - Math.PI/20;
                if(this.num == 0) {
                    this.aiDesiredAngle += Math.PI;
                }
                if(this.aiDesiredAngle > Math.PI) {
                    this.aiDesiredAngle -= 2*Math.PI;
                }
            }
            if(Math.abs(angle - this.aiDesiredAngle) < Math.PI/25) {
                this.keybinds.hit = this.keybinds.flat;
                this.keybinds.remember = this.keybinds.hit;
                keyboard[this.keybinds.flat] = true;
                return this.keybinds.flat;
            }
        } else if(this.ai) return;
        let result = 'undefined';
        if(this.keybinds.hit != undefined) {
            if(keyboard[this.keybinds.hit]) {
                return this.keybinds.hit;
            } else {
                this.keybinds.remember = this.keybinds.hit;
                this.keybinds.hit = undefined;
                return 'undefined';
            }
        }
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
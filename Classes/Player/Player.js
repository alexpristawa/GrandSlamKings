class Player {

    static players = [null, null];
    static height = 1.829; //Meters
    static heightToShoulder = 1.5;
    static shoulderToRacket = 1.6;
    static headHeight = 0.3;
    static centerToShoulder = 0.25;

    constructor(num, obj) {
        this.num = num;
        this.num == 0 ? this.oppNum = 1 : this.oppNum = 0;
        this.info = obj;
        this.x = cDim.x/2;
        this.ai = false;
        this.strideDist = 0;
        this.maxStrideDist = 5; //m
        this.hitAnimation = {
            hand: undefined,
            time: 0
        }
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
        this.boundaries = {};
        this.width = 1;
        this.height = 0.75;
        this.hVelocity = 0;
        this.vVelocity = 0;
        this.maxVelocity = 2.316 + this.info.stats.speed.current; //Cover horizontal distance in 2.25 seconds
        this.maxAcceleration = this.maxVelocity*4;
        this.windingUp = undefined;
        this.fastestSwing = 50;
    }

    static instantiate(numPlayers, players) {
        console.log(players);
        Player.players[0] = new Player(0, players[0]);
        numPlayers == 1 ? Player.players[1] = new Ai(1, players[1]) : Player.players[1] = new Player(1, players[1]);
        Player.players[0].opp = Player.players[1];
        Player.players[1].opp = Player.players[0];
    }

    static updatePlayers() {
        Player.players[0].update();
        Player.players[1].update();
        Player.players[0].draw();
        Player.players[1].draw();
    }

    getBoundaries(type) {
        let obj = {};
        if(type == 'game') {
            if(this.x > 0 && this.x < cDim.x) {
                obj[this.num == 0 ? 'bottom' : 'top'] = cDim.y/2;
            }
        } else if(type == 'serve') {
            let servingSide = Match.game.servingSide == 'deuce' ? 0 : 1;
            if((this.num + servingSide) % 2 == 0) {
                obj = {
                    left: 0,
                    right: cDim.x/2
                }
                if(this.num == 0) {
                    obj.bottom = 0;
                } else {
                    obj.top = cDim.y;
                }
            } else {
                obj = {
                    left: cDim.x/2,
                    right: cDim.x
                }
                if(this.num == 0) {
                    obj.bottom = 0;
                } else {
                    obj.top = cDim.y;
                }
            }
        }
        this.boundaries = obj;
    }

    serve() {
        Match.point.bounceCount = 0;
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
        if(Match.game.servingSide == 'deuce') {
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
        Match.game.servingSide == 'deuce' ? serveSideCorrect = 1 : serveSideCorrect = -1;
        this.angle = (90 + 90*this.directionCorrect + 5*serveSideCorrect)/180*Math.PI; //Since page dimensions are quadrant 4, 180 degrees is 0 degrees

        this.getBoundaries('serve');
        keyboardQueries[this.keybinds.flat] = () => {
            new Ball(this.x, this.y-this.height*this.directionCorrect, 1, 0, 0, Physics.g, 0, 0, 0);

            let keys = [this.keybinds.flat, this.keybinds.slice, this.keybinds.topspin, this.keybinds.lob];
            let Function = () => {
                keys.forEach(key => {
                    keyboardQueries[key] = () => {
                        let serveType = getKeyByValue(this.keybinds, key);
                        Physics.serveCollision(Ball.ball, serveType);
                        Match.point.serveHappened = true;
                        this.getBoundaries('game');
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

        if(Match.point.receiving == this.num && Ball.ball != undefined) {

            //Runs if the player can reach the ball
            if((this.x-Ball.ball.x)**2 + (this.y-this.width/2*this.directionCorrect-Ball.ball.y)**2 < (Player.shoulderToRacket + Player.centerToShoulder)**2) {
                let dy = this.directionCorrect * (this.y-this.width/2*this.directionCorrect - Ball.ball.y);
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

                let oldKey = this.keybinds.hit;

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
                    let key = this.getHitKey();
                    if(key == 'undefined' && oldKey != undefined) key = oldKey;
                    let type = Object.keys(this.keybinds).find(KEY => this.keybinds[KEY] == key && KEY != 'hit' && KEY != 'remember');

                    let maxSwingSpeed = 15 + 15 * this.info.stats.power.current;
                    let maxWindingUp = 0.35 + 0.15 * this.info.stats.power.current
                    //If the key is no longer being held, it hits the ball
                    if(!keyboard[this.getHitKey()]) {
                        this.swing(Math.min(this.windingUp/maxWindingUp, 1) * maxSwingSpeed, angle, type);
                        AudioManager.playHitSound();
                    } else if(this.windingUp > maxWindingUp) { //If you've been holding down for over half a second, it swings with maximum power
                        this.swing(maxSwingSpeed, angle, type);
                        AudioManager.playHitSound();
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

        if(this.hitAnimation.hand != undefined) {
            this.hitAnimation.time += potentialDeltaTime;
            if(this.hitAnimation.time > 1.77245/2) {
                this.hitAnimation.hand = undefined;
                this.hitAnimation.time = 0;
            }
        }
    }

    move() {
        let oldKeyboard = JSON.parse(JSON.stringify(keyboard));
        const OGX = this.x;
        const OGY = this.y;
        if(Match.point.serveHappened) this.getBoundaries('game');

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

        if(this.x - this.width/2 < this.boundaries.left) {
            this.x = this.boundaries.left + this.width/2;
            this.hVelocity = 0;
        } else if(this.x + this.width/2> this.boundaries.right) {
            this.x = this.boundaries.right - this.width/2;
            this.hVelocity = 0;
        }
        if(this.y - this.width/2 < this.boundaries.top) {
            this.y = this.boundaries.top + this.width/2;
            this.vVelocity = 0;
        } else if(this.y + this.width/2 > this.boundaries.bottom) {
            this.y = this.boundaries.bottom - this.width/2;
            this.vVelocity = 0;
        }


        let dx = Math.abs(this.x-OGX);
        let dy = Math.abs(this.y-OGY);
        let distance = Math.sqrt(dx**2 + dy**2);
        this.strideDist += distance % this.maxStrideDist;

        keyboard = oldKeyboard;
    }

    swing(swingSpeed, angle, type) {
        if(type == 'slice') {
            swingSpeed = swingSpeed/3+5;
            if(Math.abs(this.y - cDim.y/2) < 5) {
                swingSpeed = 100;
            }
        }
        angle += (Math.random() * Math.PI/20 - Math.PI/40) * (2-this.info.stats.accuracy.current);
        this.hitAnimation.hand = Math.sign(this.x - Ball.ball.x) * this.directionCorrect;
        this.hitAnimation.swingSpeed = swingSpeed;
        let racketMomentumVector = swingSpeed * Physics.racketMass;
        let dy = Math.abs(Math.abs(this.y)-cDim.y/2);
        //let dz = Math.max(1.5*Physics.netHeight-Ball.ball.z + 3*2**(-dy) - (swingSpeed-10)/50 + 10*1.25**(-swingSpeed), 0);
        let dz = (2*Physics.netHeight-Ball.ball.z) * (dy/(cDim.y/2)) * (1.17**(-swingSpeed+15)+0.5 - 0.003*swingSpeed);
        if(type == 'topspin') {
            dz += 0.2;
        }
        let zAngle = Math.atan2(dz, dy);
        let racketMomentum2D = Math.cos(zAngle) * racketMomentumVector;
        let racketMomentum = {
            x: -this.directionCorrect * racketMomentum2D * Math.cos(angle),
            y: racketMomentum2D * Math.sin(angle),
            z: racketMomentumVector/swingSpeed*Math.max(swingSpeed, type == 'topspin' ? 7.5 : 5) * Math.sin(zAngle)
        };

        let ballMomentum = {
            x: Ball.mass * Ball.ball.hVelocity * 0.5,
            y: Ball.mass * Ball.ball.vVelocity * 0.5,
            /*z: Ball.mass * Ball.ball.zVelocity*/
            z: 0
        };

        if(Math.abs(Math.abs(this.y) - cDim.y/2) < 5) {
            ballMomentum.y = 0;
            ballMomentum.x = 0;
            racketMomentum.z = Physics.netHeight-Ball.ball.z * 2;
            racketMomentum.y = racketMomentum.y/swingSpeed*20;
            racketMomentum.x = racketMomentum.x/swingSpeed*20;

            //If you're hitting a volley and the ball is under the top of the net
            if(racketMomentum.z > 0) {
                racketMomentum.y /= 2;
                racketMomentum.x /= 4;
                racketMomentum.z = 1;
            }
        }
        
        ballMomentum.x += racketMomentum.x/4;
        ballMomentum.y += racketMomentum.y/4;
        ballMomentum.z += racketMomentum.z/4;

        //Overhead
        if(Ball.ball.z > 2) {
            let p = Ball.ball.z/dy;
            ballMomentum.z = -ballMomentum.y * p/2;
            ballMomentum.y *= 2;
            Ball.ball.xAngularVelocity = 0;
        }

        Ball.ball.hVelocity = -ballMomentum.x/Ball.mass;
        Ball.ball.vVelocity = -ballMomentum.y/Ball.mass;
        Ball.ball.zVelocity = ballMomentum.z/Ball.mass;

        this.windingUp = undefined;
        Stat.updateStats('hit', {hitType: type, wasVolley: Match.point.bounceCount==0, playerNum: this.num}); //Updates the stats based on ball hits
        Challenge.checkChallenges('hit', {hitType: type, wasVolley: Match.point.bounceCount==0});
        Match.point.bounceCount = 0;
        Match.point.receiving = this.oppNum;

        Ball.ball.xAngularVelocity /= 5;
        Ball.ball.yAngularVelocity /= 5;
        Ball.ball.zAngularVelocity /= 5;

        if(type == 'slice') {
            Ball.ball.xAngularVelocity -= this.directionCorrect * 5*Math.PI;
            Ball.ball.hVelocity /= 2.5;
            Ball.ball.vVelocity /= 2.5;
            Ball.ball.zVelocity = (Math.abs(Ball.ball.zVelocity)) * 1.5;
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
        let sizeFactor = 1.05+Math.sin(this.strideDist*2*Math.PI/this.maxStrideDist)/20;
        let dy = 0;
        if(this.info.imgsrc != 'Default') {
            sizeFactor *= 1.5;
            dy = 0.7;
        }
        let angle = Math.PI/3.2;
        const ogAngle = angle;
        if(this.hitAnimation.hand != undefined) {
            angle += (this.hitAnimation.swingSpeed/30)**0.5*Math.PI*0.75*Math.sin((2*this.hitAnimation.time-1.77245)**2);
        }
        let angleToUse = angle;
        if(this.hitAnimation.hand == -1) {
            angleToUse = ogAngle;
        }
        let leftHand = {
            x: this.x - this.width*0.6*Math.cos(angleToUse) * this.directionCorrect,
            y: this.y - this.width*0.6*Math.sin(angleToUse) * this.directionCorrect
        }

        angleToUse = angle;
        if(this.hitAnimation.hand == 1) {
            angleToUse = ogAngle;
        }
        let rightHand = {
            x: this.x + this.width*0.6*Math.cos(angleToUse) * this.directionCorrect,
            y: this.y - this.width*0.6*Math.sin(angleToUse) * this.directionCorrect
        }
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.strokeStyle = 'rgb(200, 200, 200)';
        ctx.lineWidth = 2;
        
        if(this.info.imgsrc != 'Default') { 
            const aspectRatio = this.info.img.height / this.info.img.width;
            const scaledWidth = this.width * mScale * sizeFactor;
            const scaledHeight = scaledWidth * aspectRatio;            
            Canvas.drawWithAngle(this.x*mScale + courtOffset.x, (this.y+dy*this.directionCorrect)*mScale + courtOffset.y, 0, this.info.img, scaledWidth, scaledHeight);
        }
        ctx.lineWidth = 2;
        Canvas.circle(leftHand.x*mScale + courtOffset.x, leftHand.y*mScale + courtOffset.y, this.width/5*mScale*sizeFactor, true);
        Canvas.circle(rightHand.x*mScale + courtOffset.x, rightHand.y*mScale + courtOffset.y, this.width/5*mScale*sizeFactor, true);
        ctx.lineWidth = 3;
        if(this.info.imgsrc == 'Default') {
            Canvas.drawWithAngle(this.x*mScale + courtOffset.x, (this.y+dy*this.directionCorrect)*mScale + courtOffset.y, 0, this.info.img, this.width*mScale*sizeFactor, /*HERE*/);
        }

        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        angleToUse = angle - ogAngle - Math.PI/12;
        if(Ball.ball && (this.x - Ball.ball.x) * this.directionCorrect > 0) {
            Canvas.line(leftHand.x*mScale + courtOffset.x, leftHand.y*mScale + courtOffset.y, (leftHand.x+(-1.2*this.directionCorrect)*Math.cos(angleToUse))*mScale + courtOffset.x, (leftHand.y+(-1.2*this.directionCorrect)*Math.sin(angleToUse))*mScale + courtOffset.y, true);
        } else {
            Canvas.line(rightHand.x*mScale + courtOffset.x, rightHand.y*mScale + courtOffset.y, (rightHand.x-(-1.2*this.directionCorrect)*Math.cos(angleToUse))*mScale + courtOffset.x, (rightHand.y+(-1.2*this.directionCorrect)*Math.sin(angleToUse))*mScale + courtOffset.y, true);
        }


    }
}

let function1 = (value) => {
    let sum = 0;
    let arr = [];
    let obj = {};
    for(let i = 0; i < value; i++) {
        sum += i;
        if(value % 2 == 0) {
            arr.push(i);
        } else if(value % 4 == 0) {
            obj[`Number ${i}`] = i;
        }
    }

    sum *= 2;

    arr[1] = 5;
    arr.push(10);
    arr.splice(1, 1);

    obj.arr = arr;
    obj.sum = obj;
    return obj;
}
class Physics {

    static g = 9.8;
    static airDensity = 1.225;
    static racketMass = 0.3; //kg
    static netHeight = 0.914;
    static groundMu = 0.1;

    static airResistance(ball) {
        let velocity = Math.sqrt(ball.hVelocity**2 + ball.vVelocity**2 + ball.zVelocity**2);
        let airResistance = 0.5 * Physics.airDensity * (Math.PI * Ball.radius**2) * Math.pow(velocity, 2);
        let acceleration = airResistance/Ball.mass;
        let theta = Math.atan2(ball.vVelocity, ball.hVelocity);
        ball.hVelocity -= acceleration*Math.cos(theta)*deltaTime;
        ball.vVelocity -= acceleration*Math.sin(theta)*deltaTime;

        let S = 0.0004;
        let Fz = S * (ball.vVelocity * ball.xAngularVelocity);
        let Fx = S * (ball.vVelocity * ball.zAngularVelocity);

        let deltaMVZ = Fz * deltaTime;
        let deltaMVX = Fx * deltaTime;

        let deltaZV = deltaMVZ / Ball.mass;
        let deltaXV = deltaMVX / Ball.mass;

        ball.zVelocity += deltaZV;
        ball.hVelocity += deltaXV;
    }

    static checkGroundCollision(ball) {
        if(ball.z < Ball.radius) {
            let k = 100;
            let F = -k * (ball.z-Ball.radius);
            let impulse = F * deltaTime; //Impulse = ∆mv
            ball.zVelocity += impulse / Ball.mass;

            let N = F;
            let f = Physics.groundMu * N;
            let averageVelocity = (Math.sqrt(ball.hVelocity**2 + ball.vVelocity**2) + ball.previousVelocity)/2;
            let workDueToFriction = f * averageVelocity * deltaTime; //W = ∆KE
            let theta = Math.atan2(ball.vVelocity, ball.hVelocity);

            let KE = 0.5 * Ball.mass * averageVelocity**2;
            KE -= workDueToFriction;

            if(KE < 0) {
                ball.hVelocity = 0;
                ball.vVelocity = 0;
            } else {
                let velocityVector = Math.sqrt(2 * KE / Ball.mass);

                ball.hVelocity = Math.cos(theta) * velocityVector;
                ball.vVelocity = Math.sin(theta) * velocityVector;
            }

            let frictionalForce = Physics.groundMu * N;
            let frictionalImpulse = frictionalForce * deltaTime;
            let percentThatGetsTransferred = 0.5;
            let receiver = Match.point.receiving;
            if(receiver == undefined) {
                receiver = Math.abs(Match.game.serving-1);
            }
            ball.vVelocity -= 0.15 * /*Player.players[receiver].directionCorrect */ ball.xAngularVelocity * percentThatGetsTransferred;

            ball.xAngularVelocity *= 0.8;
            ball.yAngularVelocity *= 0.8;
            ball.zAngularVelocity *= 0.8;
        
            if(!ball.contactingGround) Match.point.ballBounce();
            ball.contactingGround = true;
            ball.zVelocity = Math.min(20, ball.zVelocity)
        } else if(ball.contactingGround) {
            ball.contactingGround = false;
            ball.zVelocity *= Ball.efficiency;
        }
    }

    static serveCollision(ball, type) {
        if(Player.players[Match.game.serving].alreadyTried) return;
        let servingPlayer = Player.players[Match.game.serving];
        let highestHeight = Player.heightToShoulder+Player.shoulderToRacket;
        let lowestHeight = highestHeight - Player.headHeight*4;
        let factor = ((ball.z-lowestHeight)/(highestHeight-lowestHeight));

        let zAngle = 1/180*Math.PI;
        let racketSwingSpeed = 50; //meters per second
        if(factor <= 1) {
            if(factor > 0.25 && factor < 0.75) {
                zAngle = 7/180*Math.PI;
                racketSwingSpeed = 32;
            } else if(factor < 0.25) {
                zAngle = 15/180*Math.PI;
                racketSwingSpeed = 25;
            }
        } else {
            Player.players[Match.game.serving].alreadyTried = true;
            shotType.innerHTML = "Miss!";
            setTimeout(() => {
                shotType.fadeOut(250, false);
                setTimeout(() => {
                    shotType.innerHTML = '';
                    shotType.style.display = 'flex';
                    shotType.style.opacity = 1;
                }, 250);
            }, 750);
            return;
        }

        let racketMomentumVector = racketSwingSpeed * Physics.racketMass;
        let racketMomentum2D = Math.cos(zAngle) * racketMomentumVector;

        //Breaks up the racket's momentum into 3D components
        let racketMomentum = {
            x: racketMomentum2D * Math.sin(servingPlayer.angle),
            y: racketMomentum2D * Math.cos(servingPlayer.angle),
            z: racketMomentumVector * Math.sin(zAngle)
        };

        //Breaks up the ball's momentum into 3D components
        let ballMomentum = {
            x: Ball.mass * ball.hVelocity,
            y: Ball.mass * ball.vVelocity,
            z: Ball.mass * ball.zVelocity
        };

        //Transfers 1/4 of the racket's momentum to the ball
        ballMomentum.x += racketMomentum.x/4;
        ballMomentum.y += racketMomentum.y/4;
        ballMomentum.z += racketMomentum.z/4;

        //Updates the ball's velocity based on the new momentum
        ball.hVelocity = ballMomentum.x / Ball.mass;
        ball.vVelocity = ballMomentum.y / Ball.mass;
        ball.zVelocity = ballMomentum.z / Ball.mass;

        if(type == 'slice') {
            ball.zAngularVelocity = 20*Math.PI;
        } else if(type == 'topspin') {
            ball.xAngularVelocity = 10*Math.PI;
        }
    }
}
class Ball {

    static mass = 0.0577; //kg
    static ball;
    static efficiency = 0.7;
    static radius = 0.0335; //m
    static I = 2/3 * Ball.mass * Ball.radius**2;

    constructor(x, y, z, hVelocity, vVelocity, zVelocity, xAngularVelocity = 0, zAngularVelocity = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.hVelocity = hVelocity;
        this.vVelocity = vVelocity;
        this.zVelocity = zVelocity;
        this.xAngularVelocity = xAngularVelocity;
        this.zAngularVelocity = zAngularVelocity;
        Ball.ball = this;
    }

    update() {
        //Slows the ball down based on air resistance, and curves based on air resistance
        Physics.airResistance(this);

        //Applies gravity to the ball
        this.zVelocity -= Physics.g*deltaTime;

        //Adds the velocity to the position of the ball
        this.x += this.hVelocity*deltaTime;
        this.y += this.vVelocity*deltaTime;
        this.z += this.zVelocity*deltaTime;

        //Checks to see if the ball hit the ground
        Physics.checkGroundCollision(this);
    }

    getPrediction() {
        //Calculate the time for the ball to hit the ground using kinematics and quadratic formula
        let a = 0.5 * Physics.g;
        let b = this.zVelocity;
        let c = this.z - Ball.radius;

        let time = (-b + Math.sqrt(b**2 - 4*a*c))/(2*a);
        
        //Calculate air resistance force and deceleration
        let velocity = Math.sqrt(this.hVelocity**2 + this.vVelocity**2 + this.zVelocity**2);
        let airResistance = 0.5 * Physics.airDensity * (Math.PI * Ball.radius**2) * Math.pow(velocity, 2);
        let acceleration = airResistance/Ball.mass;

        let velocity2d = Math.sqrt(this.hVelocity**2 + this.vVelocity**2);
        let theta = Math.atan2(this.vVelocity, this.hVelocity);

        let deltaDist = velocity2d * time - 0.5 * acceleration * time**2;
        let deltaX = deltaDist * Math.cos(theta);
        let deltaY = deltaDist * Math.sin(theta);

        let x = this.x + deltaX;
        let y = this.y + deltaY;

        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.arc(mScale*x + courtOffset.x, mScale*y + courtOffset.y, 5, 0, 2*Math.PI);
        ctx.fill();

        if(x > 0 && x < cDim.x && y > 0 && y < cDim.y) {
            return true;
        }
        return false;
    }

    draw() {
        ctx.fillStyle = 'rgb(204, 255, 0)';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        let radius = Math.max(Ball.radius*mScale*8, Ball.radius * mScale + 10*Math.log(this.z+1));
        Canvas.circle(mScale*(this.x) + courtOffset.x, mScale*(this.y) + courtOffset.y, radius, true);
    }

}

class BallShadow {
    
    static shadows = [];

    constructor(x, y) {
        this.x = x;
        this.y = y;
        BallShadow.shadows.push(this);
        this.timeSinceLastShadow = 0;
    }

    static updateShadows() {
        for(let i = 0; i < BallShadow.shadows.length; i++) {
            BallShadow.shadows[i].timeSinceLastShadow += deltaTime;
            if(BallShadow.shadows[i].timeSinceLastShadow > 1) {
                BallShadow.shadows.splice(i, 1);
                i--;
                continue;
            }
            BallShadow.shadows[i].draw();
        }
    }

    draw() {
        ctx.fillStyle = `rgba(0, 0, 0, 0.5)`;
        if(this.timeSinceLastShadow > 0.75) {
            ctx.fillStyle = `rgba(0, 0, 0, ${(1-this.timeSinceLastShadow)*2})`;
        }

        ctx.lineWidth = 0;
        let radius = Ball.radius * mScale * 5;
        Canvas.circle(mScale*(this.x) + courtOffset.x, mScale*(this.y) + courtOffset.y, radius, false);
    }
}
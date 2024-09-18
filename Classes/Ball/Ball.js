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
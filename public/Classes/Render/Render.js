class Render {

    static courtImage = new Image();
    static frame = {
        sy: 0,
        sx: 0
    };
    static ogDim = {
        courtOffset: {}
    };
    static points = Array.from({ length: 5 }, () => Array(5).fill(null));
    static hawkeyeVision = false;

    static instantiate() {
        this.courtImage.src = "Images/court.png";
        this.ogDim.width = courtOffset.x/mScale * 2 + cDim.totalX;
        this.ogDim.height = courtOffset.y/mScale * 2 + cDim.y;
        this.ogDim.x = courtOffset.x / mScale - cDim.alleyX;
        this.ogDim.y = courtOffset.y / mScale;
        this.ogDim.courtOffset.x = courtOffset.x;
        this.ogDim.courtOffset.y = courtOffset.y;
    
        let yCoordinates = [
            this.ogDim.y,
            this.ogDim.y + cDim.bby,
            this.ogDim.y + cDim.y / 2,
            this.ogDim.y + cDim.y / 2 + cDim.sby,
            this.ogDim.y + cDim.y
        ];
        let xCoordinates = [
            this.ogDim.x,
            this.ogDim.x + cDim.alleyX,
            this.ogDim.x + cDim.totalX / 2,
            this.ogDim.x + cDim.totalX - cDim.alleyX,
            this.ogDim.x + cDim.totalX
        ];
    
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                this.points[i][j] = {
                    x: xCoordinates[j],
                    y: yCoordinates[i]
                };
            }
        }
    }

    static setFrameProperties() {
        if(!this.hawkeyeVision) {
            this.frame.sx = 0;
            this.frame.sy = 0;
            this.frame.ex = this.ogDim.width;
            this.frame.ey = this.ogDim.height;
            this.frame.width = this.frame.ex - this.frame.sx;
            this.frame.height = this.frame.ey - this.frame.sy;
        } else {
            Render.hawkeyeVision.t += potentialDeltaTime;
            let x = Math.min(1, Math.max(0, Render.hawkeyeVision.t/Render.hawkeyeVision.totalTime));
            let t = (6*x**5 - 15*x**4 + 10*x**3);
            this.frame.sx = Render.hawkeyeVision.ogSx + (Render.hawkeyeVision.sx - Render.hawkeyeVision.ogSx)*t;
            this.frame.sy = Render.hawkeyeVision.ogSy + (Render.hawkeyeVision.sy - Render.hawkeyeVision.ogSy)*t;
            this.frame.width = Render.hawkeyeVision.ogWidth + (Render.hawkeyeVision.width - Render.hawkeyeVision.ogWidth)*t;
            this.frame.height = Render.hawkeyeVision.ogHeight + (Render.hawkeyeVision.height - Render.hawkeyeVision.ogHeight)*t;
            if(t == 1 && !this.hawkeyeVision.ended) {
                this.hawkeyeVision.ended = true;
                setTimeout(() => {
                    Match.game.pointEnded(Render.hawkeyeVision.pointWinner);
                    setTimeout(() => {
                        this.hawkeyeVision = false;
                    }, 3000);
                }, 500);
            }
        }
    }

    static drawCourt() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.setFrameProperties();
        this.frame.mag = this.ogDim.width / this.frame.width;
        mScale = frame.windowHeight*0.8/cDim.y*this.frame.mag;

        courtOffset.x = this.ogDim.courtOffset.x*this.frame.mag - this.frame.sx*mScale;
        courtOffset.y = this.ogDim.courtOffset.y*this.frame.mag - this.frame.sy*mScale;

        let framePoints = Array.from({ length: 5 }, () => Array(5).fill(null));
        for(let i = 0; i < 5; i++) {
            for(let j = 0; j < 5; j++) {
                framePoints[i][j] = {
                    x: this.points[i][j].x - this.frame.sx,
                    y: this.points[i][j].y - this.frame.sy
                };
            }
        }

        ctx.fillStyle = 'rgb(45, 106, 176)';
        if(Match.color != undefined) {
            ctx.fillStyle = Match.color;
        }
        Canvas.rect(framePoints[0][0].x*mScale, framePoints[0][0].y*mScale, (framePoints[4][4].x-framePoints[0][0].x)*mScale, (framePoints[4][4].y-framePoints[0][0].y)*mScale, 0, false);

        let connectPoints = (p1, p2, lineAdjust = 1) => {
            ctx.strokeStyle = 'white';
            let lineWidth = 0.1;
            ctx.lineWidth = lineWidth*mScale;
            let dpr = window.devicePixelRatio || 1;
            if(p1.x == p2.x) { //Vertical line
                Canvas.line((p1.x-lineWidth/2*lineAdjust)*mScale, p1.y*mScale+1/dpr, (p2.x-lineWidth/2*lineAdjust)*mScale, p2.y*mScale-1/dpr, false);
            } else {
                Canvas.line(p1.x*mScale+1/dpr, (p1.y-lineWidth/2*lineAdjust)*mScale, p2.x*mScale-1/dpr, (p2.y-lineWidth/2*lineAdjust)*mScale, false);
            }
        }
        
        //Top baseline
        connectPoints(framePoints[0][0], framePoints[0][4], -1);

        //Top service line
        connectPoints(framePoints[1][1], framePoints[1][3], -1);

        //Net line
        connectPoints(framePoints[2][0], framePoints[2][4], 0);

        //Bottom service line
        connectPoints(framePoints[3][1], framePoints[3][3], 1);

        //Bottom baseline
        connectPoints(framePoints[4][0], framePoints[4][4], 1);

        //Left alley
        connectPoints(framePoints[0][0], framePoints[4][0], -1);

        //Left singles line
        connectPoints(framePoints[0][1], framePoints[4][1], -1);

        //Service box divider
        connectPoints(framePoints[1][2], framePoints[3][2], 0);

        //Right singles line
        connectPoints(framePoints[0][3], framePoints[4][3], 1);

        //Right alley
        connectPoints(framePoints[0][4], framePoints[4][4], 1);
    }
}
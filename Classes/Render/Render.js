class Render {

    static courtImage = new Image();

    static instantiate() {
        this.courtImage.src = "Images/court.png";
    }

    static drawCourt() {
        let xDim = 10.97;
        let yDim = 23.77;
        let height = frame.windowHeight*0.8;
        let width = height * xDim / yDim;
        ctx.drawImage(Render.courtImage, frame.windowWidth/2-width/2, frame.windowHeight/2-height/2, width, height);
        
    }
}
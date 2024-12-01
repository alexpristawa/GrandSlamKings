class AudioManager {

    static hitSound = new Audio('Audio/Game/hit1.mp3');

    static bounceSounds = [
        new Audio('Audio/Game/bounce1.mp3'),
        new Audio('Audio/Game/bounce2.mp3'),
        new Audio('Audio/Game/bounce3.mp3')
    ];

    static playHitSound() {
        this.hitSound.volume = 1;
        this.hitSound.play();
    }

    static playBounceSound() {
        let sound = this.bounceSounds[Math.floor(Math.random()*3)];
        sound.volume = 1;
        sound.play();
    }
}
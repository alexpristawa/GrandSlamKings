class AudioManager {
    static audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    static sounds = {
        hit: 'Audio/Game/hit1.mp3',
        bounce: ['Audio/Game/bounce1.mp3', 'Audio/Game/bounce2.mp3', 'Audio/Game/bounce3.mp3'],
    };

    static buffers = {};

    static async preloadAudio() {
        const fetchAndDecode = async (url) => {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            return await this.audioContext.decodeAudioData(arrayBuffer);
        };

        this.buffers.hit = await fetchAndDecode(this.sounds.hit);

        this.buffers.bounce = await Promise.all(
            this.sounds.bounce.map(fetchAndDecode)
        );
    }

    static playSound(buffer) {
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start();
    }

    static playHitSound() {
        this.playSound(this.buffers.hit);
    }

    static playBounceSound() {
        const buffer = this.buffers.bounce[Math.floor(Math.random() * this.buffers.bounce.length)];
        this.playSound(buffer);
    }
}
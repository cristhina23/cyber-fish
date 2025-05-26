class AudioControl {
  constructor() {
    this.charge = document.getElementById('charge');
    this.flap1 = document.getElementById('flap1');
    this.flap2 = document.getElementById('flap2');
    this.flap3 = document.getElementById('flap3');
    this.win = document.getElementById('win');
    this.lose = document.getElementById('lose');
    this.flapSounds = [this.flap1, this.flap2, this.flap3];
  }
  play(sound) {
    sound.currentTime = 0;
    sound.play();
  }
}
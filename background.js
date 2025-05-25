class Background {
  constructor(game) {
    this.game = game;
    this.image = document.getElementById('background');
    this.image2 = document.getElementById('background');
    this.width = 2400;
    this.height = this.game.baseHeight;
    this.scaleWidth;
    this.scaleHeight;
    this.x;
  }

  update() {
    this.x -= this.game.speed;
    if (this.x <= -this.width) {
      this.x = 0;
    }
  }

  draw() {
    this.game.ctx.drawImage(this.image, this.x, 0, this.scaleWidth, this.scaleHeight);
    this.game.ctx.drawImage(this.image2, this.x + this.scaleWidth - 1, 0, this.scaleWidth, this.scaleHeight);
    if(this.game.canvas.width >= this.scaleHeight) {
      this,this.game.ctx.drawImage(this.image, this.x + this.scaleWidth * 2 - 2, 0, this.scaleWidth, this.scaleHeight);
    }

  }

  resize() {
    this.scaleWidth = this.width * this.game.ratio;
    this.scaleHeight = this.height * this.game.ratio;
    this.x = 0;
  }
}
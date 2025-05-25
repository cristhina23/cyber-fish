class Obstacle {
  constructor(game, x) {
    this.game = game;
    this.spriteWidth = 120;
    this.spriteHeight = 120;
    this.scaleWidth = this.spriteWidth * this.game.ratio;
    this.scaleHeight = this.spriteHeight * this.game.ratio;
    this.x = x;
    this.y = Math.random() * (this.game.height - this.scaleHeight);
    this.collisionX;
    this.collisionY;
    this.collisionRadius = this.scaleWidth * 0.5;
    this.speedY = Math.random() < 0.5 ? -1 : 1;
    this.game.ratio;
    this.markedForDeletion = false;
    

  }
  update() {
    this.x -= this.game.speed;
    this.y += this.speedY;
    this.collisionX = this.x + this.scaleHeight * 0.5;
    this.collisionY = this.y + this.scaleHeight * 0.5;
    if (this.y <= 0 || this.y >= this.game.height - this.scaleHeight) {
      this.speedY *= -1;
    }
    if (this.isOffScreen()) {
      this.markedForDeletion = true;
      this.game.obstacles = this.game.obstacles.filter(obstacle => !obstacle.markedForDeletion);
      this.game.score++;
      if (this.game.obstacles.length <= 0) this.game.gameOver = true;
    }
    if (this.game.checkCollision(this, this.game.player)) {
      this.game.gameOver = true;
      this.game.player.collided = true;

    }
  }
  draw() {
    this.game.ctx.fillRect(this.x, this.y, this.scaleWidth, this.scaleHeight);
    /*this.game.ctx.drawImage(this.image, this.x, this.y, this.scaleWidth, this.scaleHeight);*/
    this.game.ctx.beginPath();
    this.game.ctx.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
    this.game.ctx.stroke();
  }
  resize() {
    this.scaleWidth = this.spriteWidth * this.game.ratio;
    this.scaleHeight = this.spriteHeight * this.game.ratio;
  }

  isOffScreen() {
    return this.x < -this.scaleWidth;
  }
}
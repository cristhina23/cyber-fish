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
    this.image = document.getElementById('smallGears');
    this.frameX = Math.floor(Math.random() * 4);

  }
  update() {
    this.x -= this.game.speed;
    this.y += this.speedY;
    this.collisionX = this.x + this.scaleHeight * 0.5;
    this.collisionY = this.y + this.scaleHeight * 0.5;
    if (!this.game.gameOver) {
      if (this.y <= 0 || this.y >= this.game.height - this.scaleHeight) {
      this.speedY *= -1;
      }
    } else {
      this.speedY += 0.1;
    }
    if (this.isOffScreen()) {
      this.markedForDeletion = true;
      this.game.obstacles = this.game.obstacles.filter(obstacle => !obstacle.markedForDeletion);
      this.game.score++;
      if (this.game.obstacles.length <= 0) this.game.triggerGameOver();
    }
    if (this.game.checkCollision(this, this.game.player)) {
      this.game.player.collided = true;
      this.game.player.stopCharge();
      this.game.triggerGameOver();

    }
  }
  draw() {     
    this.game.ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,  this.x, this.y, this.scaleWidth, this.scaleHeight);
    this.game.ctx.beginPath();
    this.game.ctx.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
    
  }
  resize() {
    this.scaleWidth = this.spriteWidth * this.game.ratio;
    this.scaleHeight = this.spriteHeight * this.game.ratio;
  }

  isOffScreen() {
    return this.x < -this.scaleWidth || this.y > this.game.height;
  }
}
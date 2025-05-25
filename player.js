class Player {
  constructor(game) {
    this.game = game;
    this.x = 50;
    this.y;
    this.spriteWidth = 200;
    this.spriteHeight = 200;
    this.width = 80;
    this.height = 80;
    this.speedY;
    this.flapSpeed;
    this.collisionX = this.x + this.width * 0.5;
    this.collisionY;
    this.collisionRadius;
    this.collided;
    this.energy = 30;
    this.maxEnergy = this.energy;
    this.minEnergy = this.energy * 0.5;
    this.charging;
    this.barSize;
  }

  draw() {
  
  this.game.ctx.strokeRect(this.x, this.y, this.width, this.height);
  this.game.ctx.beginPath();
  this.game.ctx.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
  this.game.ctx.strokeStyle = 'red';
  this.game.ctx.stroke();

  }
  update() {
    this.handleEnergy();
    this.y += this.speedY;
    this.collisionY = this.y + this.height * 0.5;
    this.collisionX = this.x + this.width * 0.5;
     if (!this.isTouchingBottom()) {
      this.speedY += this.game.gravity;
    }

    if (this.isTouchingBottom()) {
      this.y = this.game.height - this.height;
      
    }
  }
  resize() {
    this.width = this.spriteWidth * this.game.ratio;
    this.height = this.spriteHeight * this.game.ratio;
    this.y = this.game.height * 0.5 - this.height * 0.5;
    this.speedY = -4 * this.game.ratio;
    this.flapSpeed = 5 * this.game.ratio;
    this.collisionRadius = this.width * 0.5;
    this.collided = false;
    this.barSize = Math.ceil(5 * this.game.ratio);
  }
  startCharge() {
    this.charging = true;
    this.game.speed = this.game.maxSpeed;
  }
  stopCharge() {
    this.charging = false;
    this.game.speed = this.game.minSpeed;
    
  }
  isTouchingBottom() {
    return this.y >= this.game.height - this.height;
  }
  isTouchingTop() {
    return this.y <= 0;
  }
  handleEnergy() {
    if (this.game.eventUpdate) {
      if (this.energy < this.maxEnergy) {
      this.energy += 0.1;
      }
      if (this.charging) {
      this.energy -= 1;
        if (this.energy <= 0) {
          this.energy = 0;
          this.stopCharge();
        }
      }
    }
  }
  flap() {
    this.stopCharge();
    if (!this.isTouchingBottom()) {
       this.speedY = -this.flapSpeed;
    }
   
  }
}
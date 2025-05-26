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
    this.minEnergy = 10;
    this.charging;
    this.barSize;
    this.image = document.getElementById('player');
    this.frameY = 0;
    
  }

  draw() {
  this.game.ctx.drawImage(this.image, 0, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
  if (this.game.debug) {
    this.game.ctx.beginPath();
    this.game.ctx.arc(this.collisionX + this.collisionRadius, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
    this.game.ctx.strokeStyle = 'red';
    this.game.ctx.stroke();
  }
  

  }
  update() {
    this.handleEnergy();
    this.y += this.speedY;
    if (this.isTouchingTop()) {
      this.y = 0;
      this.speedY = 0;
    }
    this.collisionY = this.y + this.height * 0.5;
    this.collisionX = this.x + this.width * 0.5;
     if (!this.isTouchingBottom() && !this.charging) {
      this.speedY += this.game.gravity;
    } else {
      this.speedY = 0;
    }
    if (this.speedY > 0 && !this.isTouchingBottom()) {
      this.wingsUp(); // Cambia a frameY = 2 cuando va cayendo
    }

    if (this.isTouchingBottom()) {
      this.y = this.game.height - this.height - this.game.bottomMargin;
      this.wingsCharge(); // ✅ Cambia la imagen al frame 3
      this.stopCharge();
      this.collided = true;
      this.game.triggerGameOver();
      
    }
  }
  resize() {
    this.handleEnergy();
    if (this.speedY > 0) this.wingsUp();
    this.width = this.spriteWidth * this.game.ratio;
    this.height = this.spriteHeight * this.game.ratio;
    this.y = this.game.height * 0.5 - this.height * 0.5;
    this.speedY = -4 * this.game.ratio;
    this.flapSpeed = 5 * this.game.ratio;
    this.collisionRadius = 50 * this.game.ratio;
    this.collisionX = this.x + this.width * 0.9;
    this.collided = false;
    this.barSize = Math.ceil(5 * this.game.ratio);
    this.energy = 20;
    this.frameY = 0;
    this.charging = false;
  }
  startCharge() {
    if (this.energy >= this.minEnergy && !this.charging) {
      this.charging = true;
      this.game.speed = this.game.maxSpeed;
      this.wingsCharge();
      this.game.sound.play(this.game.sound.charge);
    } else {
      this.stopCharge();
    }
  }
  stopCharge() {
    this.charging = false;
    this.game.speed = this.game.minSpeed;
    
  }

  wingsIdle() {
    this.frameY = 0;
  }

  wingsDown() {
    if (!this.charging) this.frameY = 1;
  }

  wingsUp() {
    if (!this.charging) this.frameY = 2;
  }

  wingsCharge() {
    this.frameY = 3;
  }
  isTouchingBottom() {
    return this.y >= this.game.height - this.height - this.game.bottomMargin;
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
       this.game.sound.play(this.game.sound.flapSounds[Math.floor(Math.random() * 3  )]); 
       this.wingsDown();
       
    }
   
  }
}
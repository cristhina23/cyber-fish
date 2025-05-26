class Game {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.ctx = context;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.baseHeight = 720;
    this.ratio = this.height / this.baseHeight;
    this.background = new Background(this);
    this.player = new Player(this);
    this.obstacles = [];
    this.numberOfObstacles = 10;
    this.gravity;
    this.speed;
    this.minSpeed;
    this.maxSpeed;
    this.score = 0;
    this.gameOver = false;
    this.timer = 0;
    this.message1;
    this.message2;
    this.eventTimer = 0;
    this.eventInterval = 100;
    this.eventUpdate = false;
    this.touchStartX;
    this.swipeDistance = 50;
    this.debug = false;

    this.resize(window.innerWidth, window.innerHeight);

    window.addEventListener('resize', e => {
      this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
    })

    window.addEventListener('mousedown', e => {
      this.player.flap();
    })

    window.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.player.flap();
        
      }
      if (e.key === 'Shift' || e.key.toLowerCase() === 'c') this.player.startCharge();

      if (e.key.toLowerCase() === 'd') this.debug = !this.debug;
      if (e.key.toLowerCase() === 'f') this.canvas.requestFullscreen();
      if (e.key.toLowerCase() === 'r') location.reload();
    })

    this.canvas.addEventListener('touchstart', e => {
      this.player.flap();
      this.touchStartX = e.changedTouches[0].pageX;
    });

    this.canvas.addEventListener('touchmove', e => {
      if (e.changedTouches[0].pageX - this.touchStartX > 50) {
        this.player.startCharge();
      }
    });
    window.addEventListener('keyup', e => {
      this.player.wingsUp();
    })
  }
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.fillStyle = "orange";
    this.ctx.font = "20px Bungee Spice";
    this.ctx.textAlign = "right";
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "white";
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ratio = this.height / this.baseHeight;
    this.gravity = 0.15 * this.ratio;
    this.speed = 3 * this.ratio;
    this.minSpeed = this.speed;
    this.maxSpeed = this.speed * 5;
    this.background.resize();
    this.player.resize();
    this.createObstacles();
    this.obstacles.forEach(obstacle => obstacle.resize());
    this.debug = false;
  }

  
  render(deltaTime) {
    
    if (!this.gameOver) this.timer += deltaTime;
    this.handlePeriodicEvents(deltaTime);
    this.background.update();
    this.background.draw();
    this.drawStatusText();
    this.player.update();
    this.player.draw();
    this.obstacles.forEach(obstacle => {
      obstacle.update();
      obstacle.draw();
    });
  }

  createObstacles() {
    this.obstacles = [];
    const firstX = this.baseHeight * this.ratio;
    const obstacleSpacing = 600 * this.ratio;

    for (let i = 0; i < this.numberOfObstacles; i++) {
      this.obstacles.push(new Obstacle(this, firstX + i * obstacleSpacing));
    }
    
  }

  checkCollision (a, b) {
    const dx = a.collisionX - b.collisionX;
    const dy = a.collisionY - b.collisionY;
    const distance = Math.hypot(dx, dy);
    const sumOfRadii = a.collisionRadius + b.collisionRadius;
    return distance <= sumOfRadii;
  }

  formatTimer() {
       return (this.timer * 0.001).toFixed(0);
    }

  handlePeriodicEvents(deltaTime) {
    if (this.eventTimer < this.eventInterval) {
      this.eventTimer += deltaTime;
      this.eventUpdate = false;
    } else {
      this.eventTimer = this.eventTimer % this.eventInterval;
      this.eventUpdate = true;
    }
  }

  drawStatusText() {
    this.ctx.save();
    this.ctx.fillText("Score: " + this.score, this.width - 20, 40);
    this.ctx.textAlign = "left";
    this.ctx.fillText('Timer: ' + this.formatTimer(), 20, 40);
    if (this.gameOver) {
      if (this.player.collided) {
        this.message1 = 'Getting Rusty?';
        this.message2 = 'Collision time is ' + this.formatTimer() + ' seconds.';
      } else {
        this.message1 = 'You Won!';
        this.message2 = 'Can you do it faster than ' + this.formatTimer() + ' seconds?';
      }
      this.ctx.textAlign = "center";
      this.ctx.font = "30px Bungee Spice";
      this.ctx.fillText(this.message1, this.width * 0.5, this.height * 0.5 - 60);
      this.ctx.font = "20px Bungee Spice";
      this.ctx.fillText(this.message2, this.width * 0.5, this.height * 0.5 - 30);
      this.ctx.fillText('Press enter to restart', this.width * 0.5, this.height * 0.5);
    }
    if (this.player.energy <= 8) {
      this.ctx.fillStyle = 'red';
    }
    for (let i = 0; i < this.player.energy; i++) {
      this.ctx.fillRect(25 + i * this.player.barSize * 2, 50, this.player.barSize, this.player.barSize * 5)
    }
    this.ctx.restore();
  }
}

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 720;
  canvas.height = 720;
  
  const game = new Game(canvas, ctx);

  let lastTime = 0;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(deltaTime);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  document.getElementById("restart").addEventListener("click", () => {
    location.reload(); // Reinicia el juego
  });

  document.getElementById("fullScreen").addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  document.getElementById("debug").addEventListener("click", () => {
    game.debug = !game.debug;
    game.player.collided = false; 
    console.log("Modo Debug activado");
  });

})
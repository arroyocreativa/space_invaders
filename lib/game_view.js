const Game = require('./game');

const GameView = function(ctx, canvasSize, layout) {
  this.ctx = ctx;
  this.canvasSize = canvasSize;
  this.layout = layout;
  this.game = new Game({
    canvasSize: this.canvasSize,
    ctx: this.ctx,
    gameView: this,
    layout: layout
  });
  this.defender = this.game.defender;
  this.isPaused = false;

  this.rightPressed = false;
  this.leftPressed = false;
  this.spacePressed = false;

  this.isMuted = false;
  this.isMusicMuted = false;
  this.bgMusic = new Howl({
    src: ['./sounds/DoomOST.mp3'],
    loop: true,
    volume: 0.7
  });

  this.addKeyListeners();
  this.addTouchListeners();
};

GameView.prototype.toggleAudio = function() {
  this.isMuted = this.isMuted ? false : true;
};

GameView.prototype.startBgMusic = function() {
  if (!this.isMusicMuted) {
    this.bgMusic.play();
  }
};

GameView.prototype.toggleBgMusic = function() {
  this.isMusicMuted = !this.isMusicMuted;
  if (this.isMusicMuted) {
    this.bgMusic.pause();
  } else {
    this.bgMusic.play();
  }
};

GameView.prototype.start = function() {
  this.interval = setInterval(() => {
    if (!this.isPaused) {
      this.game.draw(this.ctx);
      this.addLivesText(this.ctx);
      this.addScoreText(this.ctx);
      this.addLevelText(this.ctx);
      this.moveDefender();
      this.game.moveInvaders();
      this.game.addUfo();
      this.game.step();
    }
  }, 10);

  // Animate enemy sprites
  this.toggle = setInterval(() => {
    if (!this.isPaused) this.game.toggleInvaders();
  }, 500);
};

GameView.prototype.stop = function() {
  clearInterval(this.interval);
  clearInterval(this.toggle);

  this.interval     = null;
  this.toggle       = null;
  this.rightPressed = false;
  this.leftPressed  = false;
  this.spacePressed = false;
  this.isPaused     = false;
  this.defender     = this.game.defender;

  this.game = new Game({
    canvasSize: this.canvasSize,
    gameView:   this,
    ctx:        this.ctx,
    layout:     this.layout
  });
};

GameView.prototype.restart = function() {
  this.stop();
  this.start();
};

GameView.prototype.welcome = function() {
  this.ctx.fillStyle = '#000';
  this.ctx.fillRect(0, 0, this.game.DIM_X, this.game.DIM_Y);
};

GameView.prototype.pause = function() {
  this.isPaused = true;
};

GameView.prototype.resume = function() {
  this.isPaused = false;
};

GameView.prototype.gameOver = function() {
  this.stop();

  document.getElementById('menu-container').className='hide';

  setTimeout(() => {
    this.ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.game.DIM_X, this.game.DIM_Y);
    let gameOverImage  = document.getElementById('game-over'),
        playGameButton = document.getElementById('play-game');
    playGameButton.className = '';
    gameOverImage.className = '';
  }, 600);

};

GameView.KEY_BINDS = {
  'left': [-2, 0],
  'right': [2, 0]
};

GameView.prototype.addLivesText = function(ctx) {
  let L = this.layout;
  let x = this.game.DIM_X * L.livesTextPos[0];
  let y = this.game.DIM_Y * L.livesTextPos[1];

  ctx.font = L.hudFontSize + "px Bungee Inline";
  ctx.fillText(`LIVES: ${this.game.defenderLives}`, x, y);
};

GameView.prototype.addMenu = function(ctx) {
  let x = this.game.DIM_X * .5, y = this.game.DIM_Y * .1;
};

GameView.prototype.addScoreText = function(ctx) {
  let L = this.layout;
  let x = this.game.DIM_X * L.scoreTextPos[0];
  let y = this.game.DIM_Y * L.scoreTextPos[1];
  ctx.fillText(`SCORE: ${this.game.score}`, x, y);
};

GameView.prototype.addLevelText = function(ctx) {
  let L = this.layout;
  let x = this.game.DIM_X * L.levelTextPos[0];
  let y = this.game.DIM_Y * L.levelTextPos[1];
  ctx.fillText(`LEVEL: ${this.game.level}`, x, y);
}

GameView.prototype.bindKeyHandlers = function() {
  const defender = this.defender;

  Object.keys(GameView.KEY_BINDS).forEach(k => {
    let offset = GameView.KEY_BINDS[k];
    key(k, function() { defender.power(offset); });
  });

  key('space', function() { defender.fireBullet(); });
};

GameView.prototype.addKeyListeners = function() {
  document.addEventListener('keydown', this.handleKeyDown.bind(this), false);
  document.addEventListener('keyup', this.handleKeyUp.bind(this), false);
};

GameView.prototype.addTouchListeners = function() {
  var self = this;
  var leftEl  = document.getElementById('touch-left');
  var rightEl = document.getElementById('touch-right');
  var fireEl  = document.getElementById('touch-fire');

  if (!leftEl) return;

  leftEl.addEventListener('touchstart',  function(e) { e.preventDefault(); self.leftPressed  = true;  }, { passive: false });
  leftEl.addEventListener('touchend',    function(e) { e.preventDefault(); self.leftPressed  = false; }, { passive: false });
  leftEl.addEventListener('touchcancel', function(e) { e.preventDefault(); self.leftPressed  = false; }, { passive: false });

  rightEl.addEventListener('touchstart',  function(e) { e.preventDefault(); self.rightPressed = true;  }, { passive: false });
  rightEl.addEventListener('touchend',    function(e) { e.preventDefault(); self.rightPressed = false; }, { passive: false });
  rightEl.addEventListener('touchcancel', function(e) { e.preventDefault(); self.rightPressed = false; }, { passive: false });

  fireEl.addEventListener('touchstart',  function(e) { e.preventDefault(); self.spacePressed = true;  }, { passive: false });
  fireEl.addEventListener('touchend',    function(e) { e.preventDefault(); self.spacePressed = false; }, { passive: false });
  fireEl.addEventListener('touchcancel', function(e) { e.preventDefault(); self.spacePressed = false; }, { passive: false });
};

GameView.prototype.handleKeyDown = function(e) {
  if (e.keyCode === 37) {
    this.leftPressed = true;
  } else if (e.keyCode === 39) {
    this.rightPressed = true;
  }

  if (e.keyCode === 32) {
    this.spacePressed = true;
  }
};

GameView.prototype.handleKeyUp = function(e) {
  if (e.keyCode === 37) {
    this.leftPressed = false;
  } else if (e.keyCode === 39) {
    this.rightPressed = false;
  }

  if (e.keyCode === 32) {
    this.spacePressed = false;
  }
};

GameView.prototype.moveDefender = function() {

  if (this.leftPressed) {
    this.defender.power([-3,0]);
  } else if (this.rightPressed) {
    this.defender.power([3,0]);
  }

  if (this.spacePressed) {
    this.defender.fireBullet();
  }
};

module.exports = GameView;

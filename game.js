class Firework {
  constructor(x, y, xv, yv, size, maxTicks) {
    this.x = x;
    this.y = y;
    this.xv = xv;
    this.yv = yv;

    this.size = size;

    this.maxTicks = maxTicks;
    this.ticks = 0;

    this.color = {
      r: Random(55, 255),
      g: Random(55, 255),
      b: Random(55, 255),
      a: 1
    }
  }
  Draw() {
    ctx.beginPath();
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
  Update() {
    if(this.ticks > this.maxTicks) {
      return true;
    }
    this.ticks ++;
    this.x += this.xv / 100;
    this.y += this.yv;

    if(!(this.xv == 0)) {
      this.xv += (this.xv > 0)? 1 : -1;
    }
    this.yv += 0.2;
  }
}
var ctx = document.querySelector('canvas').getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

var width = ctx.canvas.width;
var height = ctx.canvas.height;

ctx.fillStyle = 'Black';
ctx.fillRect(0, 0, width, height);

var Random = function(min, max) { return Math.round(Math.random() * (max - min) + min); };

var mouse = {
  x: 0,
  y: 0,
  down: false,
  move: function(e) {
    mouse.x = e.x;
    mouse.y = e.y;
  },
  event: function(e) {
    mouse.down = (e.type === "mousedown")? true : false;
  }
}
var keyboard = {
  space: false,
  event: function(e) {
    if(e.keyCode == 32) {
      keyboard.space = (e.type === "keydown")? true : false;
    }
  }
}

var fireworks = [];
var particles = [];

var pop = new Audio();
pop.src = "sound/Main_01.wav";
pop.volume = 0.5;

addFirework(width/2, height, Random(-1, 1), Random(-20, -10), Random(5, 15), Random(50, 80));

Update();

function Update() {
  //ctx.canvas.width = window.innerWidth;
  //ctx.canvas.height = window.innerHeight;
  width = ctx.canvas.width;
  height = ctx.canvas.height;
  ctx.fillStyle = `rgba(0, 0, 0, 1)`;
	ctx.fillRect(0, 0, width, height);


  UpdateFireworks();
  UpdateParticles();

  if(mouse.down) {
    addFirework(mouse.x, height, Random(-1, 1), Random(-20, -10), Random(5, 15), Random(50, 80));
  }
  if(keyboard.space) {
    addFirework(mouse.x, height, Random(-1, 1), Random(-20, -10), Random(5, 15), Random(50, 80));
  }

  mouse.down = false;
  keyboard.space = false;
  requestAnimationFrame(Update);
}

function addFirework(x, y, xv, yv, size, maxTicks) {
  fireworks.push(new Firework(x, y, xv, yv, size, maxTicks));
}
function addParticles(x, y, xv, yv, size) {
  particles.push({
    x: x,
    y: y,
    xv: xv,
    yv: yv,
    size: size,
    color: {
      r: Random(55, 255),
      g: Random(55, 255),
      b: Random(55, 255),
      a: 1
    },
    Draw: function() {
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255, 0.03)`;
      ctx.arc(this.x, this.y, this.size * 3, 0, 2 * Math.PI);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();
    },
    Update: function() {
      if(Math.round(this.xv) == 0 && Math.round(this.yv) == 0){return true;}
      this.ticks ++;
      this.x += this.xv;
      this.y += this.yv;

      this.xv /= 1.05;
      this.yv /= 1.05;
    }
  });
}

function UpdateFireworks() {
  for(var i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].Draw();
    if(fireworks[i].Update()) {
      for(var j = 0; j < Random(20, 60); j++) {
        addParticles(fireworks[i].x, fireworks[i].y, Random(-15, 15), Random(-15, 15), Random(2, 6));
      }
      pop.volume = 0.1;
      pop.pause();
      pop.currentTime = 0;
      pop.play();
      fireworks.splice(i, 1);
      pop.volume = 0.5;
    }
  }
}

function UpdateParticles() {
  for(var i = particles.length - 1; i >= 0; i--) {
    particles[i].Draw();
    if(particles[i].Update()) {
      particles.splice(i, 1);
    }
  }
}

document.addEventListener("mousemove", mouse.move);
document.addEventListener("mousedown", mouse.event);
document.addEventListener("mouseup", mouse.event);
document.addEventListener("keydown", keyboard.event);
//document.addEventListener("keyup", keyboard.event);

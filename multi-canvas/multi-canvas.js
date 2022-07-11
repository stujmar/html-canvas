console.log('multi-canvas.js');

const ANIMATION_CLASSES = [
  "ani-lime", 
  "ani-blue",
  "ani-orange",
  "ani-red",
  "ani-green",
];

class Canvas {
  constructor(id, color) {
    this.id = id
    this.color = color;
    this.canvas;
    this.ctx;
    this.position = { x: 0, y: 0 };
  }

  update() {
    console.log('updating canvas');
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#00ff00';
    this.ctx.arc(this.position.x, 75, 50, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.position.x++;
  }

  initialize() {
    console.log('initializing canvas');
    this.canvas = document.getElementById(this.id);
    this.ctx = this.canvas.getContext('2d');
    this.ctx.canvas.width = window.window.innerWidth;
  }
  

}

let screenWidth = window.innerWidth;
let animationIds = [];
let animationInstances = [];
let animations = {
  "ani-lime": (id) => {
    let canvas = document.getElementById(id);
    let ctx = canvas.getContext('2d');
    ctx.canvas.width = window.window.innerWidth;
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.stroke();
  },
  "ani-blue": (id) => {
    let canvas = document.getElementById(id);
    let ctx = canvas.getContext('2d');
    ctx.canvas.width = window.window.innerWidth;
    ctx.strokeStyle = '#0000ff';
    ctx.beginPath();
    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.stroke();
  },
  "ani-green": (id) => {
    let canvas = document.getElementById(id);
    let ctx = canvas.getContext('2d');
    ctx.canvas.width = window.window.innerWidth;
    ctx.strokeStyle = '#55ff55';
    ctx.beginPath();
    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.stroke();
  },
  "ani-orange": (id) => {
    let canvas = document.getElementById(id);
    let ctx = canvas.getContext('2d');
    ctx.canvas.width = window.window.innerWidth;
    ctx.strokeStyle = '#ff5533';
    ctx.beginPath();
    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.stroke();
  },
  "ani-red": (id) => {
    let canvas = document.getElementById(id);
    let ctx = canvas.getContext('2d');
    ctx.canvas.width = window.window.innerWidth;
    ctx.strokeStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.stroke();
  }
};


ANIMATION_CLASSES.forEach(animationClass => {
  let parents = document.getElementsByClassName(animationClass);
  if (parents.length > 0) {
    console.log(`${parents.length} ${animationClass} found`);
  }
  Array.from(parents).forEach(parent => {
    let canvas = document.createElement('canvas');
    let id = `${animationClass}-${Math.floor(Math.random() * 10000) + 1}`;
    canvas.setAttribute("class", "absolute inset-0 z-0 border-2 border-red-500");
    canvas.setAttribute("id", id);
    parent.appendChild(canvas);
    animationIds.push(id);
  })
})


function animate() {
  if (animationInstances.length === 0) {
    animationIds.forEach(id => {
      color = id.split('-')[0] + "-" + id.split('-')[1];
      let canvas = new Canvas(id, color);
      canvas.initialize();
      animationInstances.push(canvas);
      console.log(animationInstances)
    });
  } else {
    animationInstances.forEach(instance => {
      instance.update();
    }
    );
  }

  // animationIds.forEach(id => {
  //   color = id.split('-')[0] + "-" + id.split('-')[1];
  //   animations[color](id);
  // });

window.requestAnimationFrame(animate); 
}

animate();

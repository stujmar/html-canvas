console.log('multi-canvas.js loaded');

// The only place to edit animations is this "animations" object.
// Add class name as key and animation function as value.
const animations = {
  "ani-template": ({ctx, isDark, state}) => {
    if (!state.initialized) {
      // Define initial state of animation here.
      state.initialized = true;
    } else {
      // Update state of animation here.
    }
    // Draw animation here.
  },
 "ani-lime": ({ctx, isDark, state}) => {
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.stroke();
    return state;
  },
  "ani-synth": ({ctx, isDark, state}) => {
    if (!state.initialized) {
      state = {position: { x: 100 } }
      state.initialized = true;
    } else {
      state.position.x++;
    }
    ctx.fillStyle = isDark ? "#000000" : "#ffffff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = '#0000ff';
    ctx.beginPath();
    ctx.arc(state.position.x, 75, 50, 0, 2 * Math.PI);
    ctx.stroke();
    return state;
  },
  "ani-green": ({ctx, isDark, state}) => {
    // ctx.canvas.width = window.window.innerWidth;
    ctx.strokeStyle = '#55ff55';
    ctx.beginPath();
    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.stroke();
    return state;
  },
  "ani-flame": ({ctx, isDark, state}) => {
    if (!state.initialized) {
      state = {
        positionRed: { x: 0, y: 0 },
        positionYellow: { x: 200, y: 0 }  }
      state.initialized = true;
    } else {
      state.positionRed.y > (ctx.canvas.height + 50) ? state.positionRed.y = -50 : state.positionRed.y++;
      state.positionYellow.y > (ctx.canvas.height + 50) ? state.positionYellow.y = -50 : state.positionYellow.y += .3;
    }
    ctx.fillStyle = isDark ? "#000000" : "#ffffff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#ff5533';
    ctx.beginPath();
    ctx.arc(125, state.positionRed.y, 50, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 149, 53, 0.75)';
    ctx.beginPath();
    ctx.arc(state.positionYellow.x, state.positionYellow.y, 50, 0, 2 * Math.PI);
    ctx.fill();
    ctx.filter = 'blur(10px)';
    return state;
  },
  "ani-red": ({ctx, isDark, state}) => {
    ctx.strokeStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.stroke();
    return state;
  }
};

const ANIMATION_CLASSES = Object.keys(animations);

class Canvas {
  constructor(id, aniName, height, isDark) {
    this.id = id
    this.height = height;
    this.isDark = isDark
    this.aniName = aniName;
    this.canvas;
    this.ctx;
    this.state = { initialized : false};
  }
  update() {
    let parameters = {
      ctx: this.ctx,
      state: this.state,
      isDark: this.isDark,
    }
    this.state = animations[this.aniName](parameters);
  }
  initialize() {
    this.canvas = document.getElementById(this.id);
    this.ctx = this.canvas.getContext('2d');
    this.ctx.canvas.width = window.window.innerWidth;
    this.ctx.canvas.height = this.height;
  }
}

// current width ?
let screenWidth = window.innerWidth;
let animationIds = [];
let animationInstances = [];

ANIMATION_CLASSES.forEach(animationClass => {
  let parents = document.getElementsByClassName(animationClass);
  Array.from(parents).forEach(parent => {
    let canvas = document.createElement('canvas');
    let id = `${animationClass}-${Math.floor(Math.random() * 10000) + 1}`;
    canvas.setAttribute("class", "absolute inset-0 z-0");
    canvas.setAttribute("class", "absolute inset-0 z-0");
    canvas.setAttribute("id", id);
    let content = parent.innerHTML;
    parent.classList.add('relative',"w-full", "overflow-hidden");
    parent.appendChild(canvas);
    let wrapper = document.createElement('div');
    wrapper.setAttribute("class", "absolute inset-0 z-10");
    wrapper.innerHTML = content;
    parent.appendChild(wrapper);
    animationIds.push(id);
  })
})

function animate() {
  // If we don't have any canvases or the screen width has changed,
  if (animationInstances.length === 0 || screenWidth !== window.innerWidth) {
    // Let's re-initialize the canvases.
    animationInstances = [];
    animationIds.forEach(id => {
      color = id.split('-')[0] + "-" + id.split('-')[1];
      let parent = document.getElementById(id).parentElement;
      let isDark = parent.classList.contains('dark');
      let height = parent.clientHeight;
      let canvas = new Canvas(id, color, height, isDark);
      canvas.initialize();
      animationInstances.push(canvas);

    });
    // Set the screen width to the current width.
    screenWidth = window.innerWidth;
  } else {
    // Otherwise, we can just update the canvases.
    animationInstances.forEach(instance => {
      instance.update();
    }
    );
  }
window.requestAnimationFrame(animate); 
}

animate();

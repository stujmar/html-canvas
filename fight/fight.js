import {Keys} from "./models/Keys.js";

console.log("fight.js loaded");

const canvas = document.querySelector("#fight-canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const ground = 500;
const gravity = 0.2;

c.fillRect(0,0,canvas.width,canvas.height);

class Sprite {
    constructor({position, color, velocity}) {
      this.color = color;
      this.height = 150;
      this.width = 50;
      this.position = position;
      this.velocity = velocity
      this.isDucked = false;
    }

    duck() {
      if (!this.isDucked) {
        this.height = 100;
        this.position.y += 50;
        this.isDucked = true;
      } else {
        this.height = 150;
        this.position.y -= 50;
    }}

    draw() {
      c.fillStyle = this.color;
      c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
      this.draw()
      this.velocity.y += gravity;
      this.position.x += this.velocity.x;
      this.position.x += this.velocity.x;
        if (this.position.y + this.height + this.velocity.y <= ground) { // If the sprite above the ground fall.
          this.position.y += this.velocity.y;
        } else { // If the sprite is near the ground, snap to ground.
          this.position.y = ground - this.height;
        }
    }

  }

  const player = new Sprite({ 
    "color": "blue" ,
    position: {x: 200, y: 0}, 
    velocity: {x: 0, y: 0},
  });

  const enemy = new Sprite({ 
    "color": "red" ,
    position: {x: canvas.width-250, y: 50}, 
    velocity: {x: 0, y: 0},
  });

  function background() {
    c.fillStyle = "black";
    c.fillRect(0,0,canvas.width,canvas.height);

    c.strokeStyle = "green";
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(0, ground);
    c.lineTo(canvas.width, ground);
    c.stroke();

  }

  const keys = new Keys();

  let lastKeyPlayer;
  let lastKeyEnemy;

  function animate() {
    background()
    player.update();
    enemy.update();
    window.requestAnimationFrame(animate);
    

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    if (keys.a.pressed && lastKeyPlayer === "a") {
      player.velocity.x = -2;
    } else if (keys.d.pressed && lastKeyPlayer === "d") {
      player.velocity.x = 2;
    }

    if (!keys.a.pressed && !keys.d.pressed) {
      player.velocity.x = 0;
    }

    if (keys.ArrowLeft.pressed && lastKeyEnemy === "ArrowLeft") {
      enemy.velocity.x = -2;
    } else if (keys.ArrowRight.pressed && lastKeyEnemy === "ArrowRight") {
      enemy.velocity.x = 2;
    }

    if (!keys.ArrowLeft.pressed && !keys.ArrowRight.pressed) {
      enemy.velocity.x = 0;
    }

    if (keys.w.pressed && (player.position.y + player.height == ground)) {
      player.velocity.y = -6;
    }
    // console.log(player.position.y + player.height, ground)
    if (keys.s.pressed && player.isDucked == false && (player.position.y + player.height == ground)) {
      player.duck();
    } else if (!keys.s.pressed && player.isDucked == true) {
      player.duck();
      player.isDucked = false;
    }
  }

  animate();

  window.addEventListener("keydown", (e) => {
    console.log(e.key);
    switch (e.key) {
      case 'd':
        keys.d.pressed = true;
        lastKeyPlayer = 'd';
        break;
      case 'a':
        keys.a.pressed = true;
        lastKeyPlayer = 'a';
        break;
      case 'w':
        keys.w.pressed = true;
        break;
      case 's':
        keys.s.pressed = true;
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        lastKeyEnemy = 'ArrowLeft';
        break;
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        lastKeyEnemy = 'ArrowRight';
        break;
      case 'ArrowUp':
        if (enemy.position.y + enemy.height == ground) {
          enemy.velocity.y = -6;
        }
        break;
    }
  });

  window.addEventListener("keypress", (e) => {
    switch (e.key) {
      case 'w':
        if (player.position.y + player.height == ground) {
          player.velocity.y = -6;
        }
        break;
      case 'ArrowUp':
        if (enemy.position.y + enemy.height == ground) {
          enemy.velocity.y = -6;
        }
        break;
    }
  });

  window.addEventListener("keyup", (e) => {
    switch (e.key) {
      case 'd':
        keys.d.pressed = false;
        break;
      case 'a':
        keys.a.pressed = false;
        break;
      case 'w':
        keys.w.pressed = false;
        break;
      case 's':
        keys.s.pressed = false;
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = false;
        break;
      case 'ArrowRight':
        keys.ArrowRight.pressed = false;
        break;
      
    }
  });
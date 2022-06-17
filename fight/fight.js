import {Keys} from "./models/Keys.js";
import {Sprite} from "./models/Sprite.js";

console.log("fight.js loaded");

const canvas = document.querySelector("#fight-canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const ground = 500;
const gravity = 0.5;
const walkSpeed = 5;
const jumpHeight = 15;

  const player = new Sprite({ 
    context: c,
    facing: "right",
    ground: ground,
    gravity: gravity,
    "color": "blue" ,
    position: {x: 200, y: 50}, 
    velocity: {x: 0, y: 0},
  });

  const enemy = new Sprite({
    context: c,
    facing: "left",
    ground: ground,
    gravity: gravity, 
    "color": "red" ,
    position: {x: canvas.width-250, y: -10}, 
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

  // Helper Functions
  const bouncingJump = (event) => (["w", "ArrowUp"].includes(event.key) && event.repeat);
  const isAtLeftEdge = (sprite) => sprite.position.x <= 0;
  const isAtRightEdge = (sprite) => sprite.position.x >= canvas.width - sprite.width;

  // Event Loop
  function animate() {
    background()
    player.update();
    enemy.update();
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // Player Movement
    if (keys.a.pressed && player.lastKey === "a" && !isAtLeftEdge(player)) {
      player.facing = "left";
      player.velocity.x = -walkSpeed;
    } else if (keys.d.pressed && player.lastKey === "d" && !isAtRightEdge(player)) {
      player.facing = "right";
      player.velocity.x = walkSpeed;
    }
    if (!keys.a.pressed && !keys.d.pressed) {
      player.velocity.x = 0;
    }

    // Enemy Movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft" && !isAtLeftEdge(enemy)) {
      enemy.facing = "left";
      enemy.velocity.x = -walkSpeed;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight" && !isAtRightEdge(enemy)) {
      enemy.facing = "right";
      enemy.velocity.x = walkSpeed;
    }
    if (!keys.ArrowLeft.pressed && !keys.ArrowRight.pressed) {
      enemy.velocity.x = 0;
    }

    // Player Jump
    if (keys.w.pressed && (player.position.y + player.height == ground)) {
      keys.w.pressed = false;
      player.velocity.y = -jumpHeight;
    }
    // Enemy Jump
    if (keys.ArrowUp.pressed && (enemy.position.y + enemy.height == ground)) {
      keys.ArrowUp.pressed = false;
      enemy.velocity.y = -jumpHeight;
    }

    // Player Duck
    if (keys.s.pressed && player.isDucked == false && (player.position.y + player.height == ground)) {
      player.duck();
    } else if (!keys.s.pressed && player.isDucked == true) {
      player.duck();
      player.isDucked = false;
    }
    // Enemy Duck
    if (keys.ArrowDown.pressed && enemy.isDucked == false && (enemy.position.y + enemy.height == ground)) {
      enemy.duck();
    } else if (!keys.ArrowDown.pressed && enemy.isDucked == true) {
      enemy.duck();
      enemy.isDucked = false;
    }

    window.requestAnimationFrame(animate);
  }
  animate();

  // Event Listeners
  window.addEventListener("keydown", (e) => {
    if (!bouncingJump(e)) {
      keys[e.key].pressed = true;
    }
    if (["a", "d",].includes(e.key)) {
      player.lastKey = e.key;
    }
    if (["ArrowLeft", "ArrowRight",].includes(e.key)) {
      enemy.lastKey = e.key;
    }
  });

  window.addEventListener("keyup", (e) => {
    keys[e.key].pressed = false;
  });
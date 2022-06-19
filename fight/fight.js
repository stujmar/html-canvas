import {Keys} from "./models/Keys.js";
import {Sprite} from "./models/Sprite.js";

console.log("fight.js loaded");

const canvas = document.querySelector("#fight-canvas");
const c = canvas.getContext("2d");
const playerHealthBar = document.querySelector("#health-bar-player");
const enemyHealthBar = document.querySelector("#health-bar-enemy");
const playerRedBar = document.querySelector("#red-bar-player");
const enemyRedBar = document.querySelector("#red-bar-enemy");
playerRedBar.style.opacity = "0";
enemyRedBar.style.opacity = "0";

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
  const keyIsHeld = (event) => event.repeat;
  const isAtLeftEdge = (sprite) => sprite.position.x <= 0;
  const isAtRightEdge = (sprite) => sprite.position.x >= canvas.width - sprite.width;
  const isAtGround = (sprite) => sprite.position.y + sprite.height === ground;

  const isClearVirtically = (spriteOne, spriteTwo) => {
    return spriteOne.position.y + spriteOne.height <= spriteTwo.position.y ||
    spriteOne.position.y >= spriteTwo.position.y + spriteTwo.height;
  }
  const canMoveRight = (movingSprite, blockingSprite) => {
    return (movingSprite.position.x + movingSprite.width + walkSpeed < blockingSprite.position.x - 2 ||
    movingSprite.position.x > blockingSprite.position.x + blockingSprite.width/2 || 
    isClearVirtically(movingSprite, blockingSprite));
  };

  const canMoveLeft = (movingSprite, blockingSprite) => {
    return (movingSprite.position.x - walkSpeed > blockingSprite.position.x + blockingSprite.width + 2 ||
    movingSprite.position.x < blockingSprite.position.x + blockingSprite.width/2 || 
    isClearVirtically(movingSprite, blockingSprite));
  };
  
  // This works but really shouldn't, it should be using sprite's height aginst hitBox height/elevation. 
  const punchBoxesShareElevation = (hit, hitter) => {
    return ((hit.punchBox.position.y > hitter.punchBox.position.y && // Top edge of box falls within second box
           hit.punchBox.position.y < hitter.punchBox.position.y + hitter.punchBox.height) ||
           (hit.punchBox.position.y + hit.punchBox.height >= hitter.punchBox.position.y && // Bottom edge of box falls within second box
            hit.punchBox.position.y + hit.punchBox.height <= hitter.punchBox.position.y + hitter.punchBox.height));
  }

  const canFall = (faller, blocker) => {
    return isClearVirtically(player, enemy) || (faller.position.x + faller.width < blocker.position.x ||
    faller.position.x > blocker.position.x + blocker.width);
  }

  // Event Loop
  function animate() {
    if (player.health <= 0) {
      alert("Red Wins!");
      return;
    }
    if (enemy.health <= 0) {
      alert("Blue Wins!");
      return;
    }

    background() // Draw the background.
    player.update(canFall(player, enemy)); // Update the player.
    enemy.update(canFall(enemy, player)); // Update the enemy.
    // Reset the player's velocity.
    player.velocity.x = 0; 
    enemy.velocity.x = 0;

    // Player Movement
    if (keys.a.pressed && player.lastKey === "a" && (!isAtLeftEdge(player) && canMoveLeft(player, enemy) || !canFall(player, enemy)) ) {
      player.facing = "left";
      player.velocity.x = -walkSpeed;
    } else if (keys.d.pressed && player.lastKey === "d" && (!isAtRightEdge(player) && canMoveRight(player, enemy) || !canFall(player, enemy))) {
      player.facing = "right";
      player.velocity.x = walkSpeed;
    }
    if (!keys.a.pressed && !keys.d.pressed) {
      player.velocity.x = 0;
    }
    // Enemy Movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft" && (!isAtLeftEdge(enemy) && canMoveLeft(enemy, player) || !canFall(enemy, player))) {
      enemy.facing = "left";
      enemy.velocity.x = -walkSpeed;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight" && (!isAtRightEdge(enemy) && canMoveRight(enemy, player)|| !canFall(enemy, player))) {
      enemy.facing = "right";
      enemy.velocity.x = walkSpeed;
    }
    if (!keys.ArrowLeft.pressed && !keys.ArrowRight.pressed) {
      enemy.velocity.x = 0;
    }

    // Player Jump
    if (keys.w.pressed && isAtGround(player)) {
      keys.w.pressed = false;
      player.velocity.y = -jumpHeight;
    }
    // Enemy Jump
    if (keys.ArrowUp.pressed && isAtGround(enemy)) {
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

    // These collision logics could be cleaned up like is left of left edge, is right of right edge etc
    // Maybe one function that takes in two sprites or attachBoxes and returns a boolean?
    // Player Hit Collision
    let playerOnEnemyRight = player.punchBox.position.x + player.punchBox.width >= enemy.position.x;
    let playerPastEnemyRight = player.position.x >= enemy.position.x + enemy.width;
    let playerOnEnemyLeft = player.punchBox.position.x - (player.punchBox.width/2) <= enemy.position.x + enemy.width;
    let playerPastEnemyLeft = player.position.x + player.width <= enemy.position.x;
    if (playerOnEnemyRight && !playerPastEnemyRight && player.facing === "right" && punchBoxesShareElevation(enemy, player) && player.isPunching) {
      player.isPunching = false;
      console.log("enemy was hit right");
      enemy.hit("right");  
      enemyHealthBar.style.width = `${enemy.health}%`;
      enemyRedBar.style.opacity = 0 + (100 - enemy.health)/100;
    } else if (playerOnEnemyLeft && !playerPastEnemyLeft && player.facing === "left" && punchBoxesShareElevation(enemy, player) && player.isPunching) {
      player.isPunching = false;
      console.log("enemy was hit left");
      enemy.hit("left");
      enemyHealthBar.style.width = `${enemy.health}%`;
      enemyRedBar.style.opacity = 0 + (100 - enemy.health)/100;
    }
    // Enemy Hit Collision
    let enemyOnPlayerRight = enemy.punchBox.position.x + enemy.punchBox.width >= player.position.x;
    let enemyPastPlayerRight = enemy.position.x >= player.position.x + player.width;
    let enemyOnPlayerLeft = enemy.punchBox.position.x - (enemy.punchBox.width/2) <= player.position.x + player.width;
    let enemyPastPlayerLeft = enemy.position.x + enemy.width <= player.position.x;
    if (enemyOnPlayerRight && !enemyPastPlayerRight && enemy.facing === "right"  && punchBoxesShareElevation(player, enemy) && enemy.isPunching) {
      enemy.isPunching = false;
      player.hit("right");
      playerHealthBar.style.width = `${player.health}%`;
      playerRedBar.style.opacity = 0 + (100 - player.health)/100;
      console.log("player was hit right");
    } else if (enemyOnPlayerLeft && !enemyPastPlayerLeft && enemy.facing === "left"  && punchBoxesShareElevation(player, enemy) && enemy.isPunching) {
      enemy.isPunching = false;
      player.hit("left");
      playerHealthBar.style.width = `${player.health}%`;
      playerRedBar.style.opacity = 0 + (100 - player.health)/100;
      console.log("player was hit left");
    }

    window.requestAnimationFrame(animate);
  }
  animate();

  // Event Listeners
  window.addEventListener("keydown", (e) => {
    // console.log(e.key);
    if (e.key === "0" && !keyIsHeld(e)) {
      enemy.punch();
      // keys.zero.pressed = true;
    } else if (e.key === " ") {
      player.punch();
      // keys.space.pressed = true;
    } else if (!bouncingJump(e) && e.key !== "0" && e.key !== " ") {
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
    if (e.key === " ") {
      keys.space.pressed = false;
    } else if (e.key === "0") {
      keys.zero.pressed = false;
    } else {
      keys[e.key].pressed = false;
    }
  });
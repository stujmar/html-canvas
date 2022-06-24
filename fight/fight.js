import { Keys } from "./models/Keys.js";
import { Fighter } from "./models/Fighter.js";
import { Sprite } from "./models/Sprite.js";

console.log("fight.js loaded");

const canvas = document.querySelector("#fight-canvas");
const c = canvas.getContext("2d");
const playerHealthBar = document.querySelector("#health-bar-player");
const enemyHealthBar = document.querySelector("#health-bar-enemy");
const playerRedBar = document.querySelector("#red-bar-player");
const enemyRedBar = document.querySelector("#red-bar-enemy");
const timer = document.querySelector("#timer");
const resultsBanner = document.querySelector("#results-banner");
const matchResults = document.querySelector("#match-results");
playerRedBar.style.opacity = "0";
enemyRedBar.style.opacity = "0";

canvas.width = 1024;
canvas.height = 576;

const ground = 500;
const gravity = 0.5;
const walkSpeed = 5;
const jumpHeight = 15;

let preGame = true;
let gameOver = false;
let time = 60;
timer.innerHTML = time;
let backgroundImg = "./assets/background.png";

const Background = new Sprite(
  {
    context: c,
    position: {x: 0, y: 0},
    dimensions: {width: canvas.width, height: canvas.height},
    imgSource: backgroundImg,
  },
)

  const player = new Fighter({ 
    context: c,
    dimensions: {width: 50, height: 150},
    facing: "right",
    ground: ground,
    gravity: gravity,
    color: "blue" ,
    position: {x: 200, y: 50}, 
    velocity: {x: 0, y: 0},
  });

  const enemy = new Fighter({
    context: c,
    dimensions: {width: 50, height: 150},
    facing: "left",
    ground: ground,
    gravity: gravity, 
    color: "red" ,
    position: {x: canvas.width-250, y: -10}, 
    velocity: {x: 0, y: 0},
  });

  const keys = new Keys();

  // Helper Functions
  const resetGame = () => {
    preGame = true;
    gameOver = false;
    player.health = 100;
    enemy.health = 100;
    player.position.x = 200;
    enemy.position.x = canvas.width-250;
    player.position.y = 0;
    enemy.position.y = 0;
    player.velocity.x = 0;
    enemy.velocity.x = 0;
    player.velocity.y = 0;
    enemy.velocity.y = 0;
    player.facing = "right";
    enemy.facing = "left";
    playerRedBar.style.opacity = "0";
    enemyRedBar.style.opacity = "0";
    playerHealthBar.style.width = "100%";
    enemyHealthBar.style.width = "100%";
    resultsBanner.style.display = "none";
    time = 60;
    timer.innerHTML = time;
    // timer.style.display = "none"
  }
  const bouncingJump = (event) => (["w", "ArrowUp"].includes(event.key) && event.repeat);
  const keyIsHeld = (event) => event.repeat;
  const isAtLeftEdge = (sprite) => sprite.position.x <= 0;
  const isAtRightEdge = (sprite) => sprite.position.x + sprite.width >= canvas.width;
  const isAtGround = (sprite) => sprite.position.y + sprite.height === ground;
  const canSnapToOpponent = (walker, blocker, direction) => {
    if (direction === "right") {
      return (walker.position.x + walker.width + walkSpeed >= blocker.position.x && walker.position.x + walker.width < blocker.position.x + walkSpeed*2);
    } else if (direction === "left") {
      return (walker.position.x - walkSpeed <= blocker.position.x + blocker.width && walker.position.x >= blocker.position.x + blocker.width - walkSpeed*2);
    }
  }

  // Are the characters stacked?
  const isStacked = (top, bottom) => {
    let verticalAlignment = Math.abs((top.position.y + top.height) - bottom.position.y) < 1;
    let leftEdge = top.position.x > bottom.position.x && top.position.x < bottom.position.x + bottom.width;
    let rightEdge = top.position.x + top.width > bottom.position.x && top.position.x + top.width < bottom.position.x + bottom.width;
    let xAlignment = top.width === bottom.width && top.position.x === bottom.position.x;
    return verticalAlignment && (leftEdge || rightEdge || xAlignment);
  }

  // if a faller is going to land on a blocker snap the faller to the blocker
  const stackSnap = (faller, blocker) => {
    let snapTolerance = 10;
    let leftEdge = faller.position.x > blocker.position.x && faller.position.x < blocker.position.x + blocker.width;
    let rightEdge = faller.position.x + faller.width > blocker.position.x && faller.position.x + faller.width < blocker.position.x + blocker.width;
    if (Math.abs(faller.position.y + faller.height - blocker.position.y) < snapTolerance && (leftEdge || rightEdge)) {
      console.log("snapped");
      faller.position.y = blocker.position.y - faller.height;
      faller.velocity.y = 0;
    }
  }

  const isClearVirtically = (spriteOne, spriteTwo) => {
    return spriteOne.position.y + spriteOne.height <= spriteTwo.position.y ||
    spriteOne.position.y >= spriteTwo.position.y + spriteTwo.height;
  }

  // This works but really shouldn't? should be using sprite's height aginst hitBox height/elevation?
  const punchBoxesShareElevation = (hit, hitter) => {
    return ((hit.punchBox.position.y > hitter.punchBox.position.y && // Top edge of box falls within second box
           hit.punchBox.position.y < hitter.punchBox.position.y + hitter.punchBox.height) ||
           (hit.punchBox.position.y + hit.punchBox.height >= hitter.punchBox.position.y && // Bottom edge of box falls within second box
            hit.punchBox.position.y + hit.punchBox.height <= hitter.punchBox.position.y + hitter.punchBox.height));
  }
  const canFall = (faller, blocker) => {
    return isClearVirtically(faller, blocker) || (faller.position.x + faller.width <= blocker.position.x ||
    faller.position.x >= blocker.position.x + blocker.width);
  }

  const calculateResults = () => {
    if (player.health === enemy.health) {
      resultsBanner.style.display = "flex";
      matchResults.innerHTML = "Tie Game!";
    } else if (player.health > enemy.health) {
      resultsBanner.style.display = "flex";
      matchResults.innerHTML = "Blue Wins!";
    } else {
      resultsBanner.style.display = "flex";
      matchResults.innerHTML = "Red Wins!";
    }

    timer.innerHTML = "XX"
  }

  // Time
  function decreaseTimer() {
    if (!gameOver && !preGame) {
    setTimeout(decreaseTimer, 1000);
    time = time > 0 ? time - 1 : 0;
    timer.innerHTML = time;
    if (time === 0) {
      gameOver = true;
      gameOver && calculateResults();
    }
    }
  }

  // Event Loop
  function animate() {

    if (player.health === 0 || enemy.health === 0) {
      calculateResults();
    }

    if ( preGame ) {
      document.getElementById("pre-game").style.display = "flex";
    }

    Background.draw(c);

    player.update(canFall(player, enemy), isStacked(player, enemy)); // Update the player.
    enemy.update(canFall(enemy, player), isStacked(enemy, player)); // Update the enemy.
    // Reset the player's velocity.
    player.velocity.x = 0; 
    enemy.velocity.x = 0;

    if (!preGame) {
      // Player Movement
      if (keys.a.pressed && player.lastKey === "a" && !isAtLeftEdge(player)) {
        player.facing = "left";
        canSnapToOpponent(player, enemy, "left") && !isClearVirtically(player, enemy) ? player.position.x = enemy.position.x + enemy.width : player.velocity.x -= walkSpeed;
      } else if (keys.d.pressed && player.lastKey === "d" && !isAtRightEdge(player)) {
        player.facing = "right";
        canSnapToOpponent(player, enemy, "right") && !isClearVirtically(player, enemy) ? player.position.x = enemy.position.x - player.width : player.velocity.x = walkSpeed;
      }
      if (!keys.a.pressed && !keys.d.pressed) {
        player.velocity.x = 0;
      }
      // Enemy Movement
      if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft" && !isAtLeftEdge(enemy)) {
        enemy.facing = "left";
        canSnapToOpponent(enemy, player, "left") && !isClearVirtically(player, enemy) ? enemy.position.x = player.position.x + player.width : enemy.velocity.x -= walkSpeed;
      } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight" && !isAtRightEdge(enemy)) {
        enemy.facing = "right";
        canSnapToOpponent(enemy, player, "right") && !isClearVirtically(player, enemy) ? enemy.position.x = player.position.x - enemy.width : enemy.velocity.x = walkSpeed;
      }
      if (!keys.a.pressed && !keys.d.pressed) {
        player.velocity.x = 0;
      }
    }

    // Player Jump
    stackSnap(player, enemy);
    if (keys.w.pressed && (isAtGround(player) || isStacked(player, enemy))) {
      keys.w.pressed = false;
      console.log('jump', player.velocity.y)
      player.jump();
      // player.velocity.y = -jumpHeight;
      console.log('jump', player.velocity.y)
    }
    stackSnap(enemy, player);
    // Enemy Jump
    if (keys.ArrowUp.pressed && (isAtGround(enemy) || isStacked(enemy, player))) {
      keys.ArrowUp.pressed = false;
      enemy.jump();
      // enemy.velocity.y = -jumpHeight;
    }

    // Player Duck
    if (keys.s.pressed 
      && player.isDucked == false
      && !isStacked(enemy, player)
      && (player.position.y + player.height == ground || isStacked(player, enemy))) {
      player.duck();
    } else if (!keys.s.pressed && player.isDucked == true) {
      player.duck();
      player.isDucked = false;
    }
    // Enemy Duck
    if (keys.ArrowDown.pressed 
      && enemy.isDucked == false
      && !isStacked(player, enemy)
      && (enemy.position.y + enemy.height == ground || isStacked(enemy, player))) {
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
  document.getElementById("start").addEventListener("click", () => {
    document.getElementById("pre-game").style.display = "none";
    preGame = false;
    decreaseTimer();
  });
  document.getElementById("reset").addEventListener("click", () => {
    resetGame();
  });

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
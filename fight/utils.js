console.log("utils.js loaded");

export const bouncingJump = (event) => (["w", "ArrowUp"].includes(event.key) && event.repeat);

export const keyIsHeld = (event) => event.repeat;

export const isAtLeftEdge = (sprite) => sprite.position.x <= 0;

export const isAtRightEdge = (sprite, canvas) => sprite.position.x + sprite.width >= canvas.width;

export const isAtGround = (sprite, ground) => sprite.position.y + sprite.height === ground;

export const canSnapToOpponent = (walker, blocker, direction, walkSpeed) => {
  if (direction === "right") {
    return (walker.position.x + walker.width + walkSpeed >= blocker.position.x && walker.position.x + walker.width < blocker.position.x + walkSpeed*2);
  } else if (direction === "left") {
    return (walker.position.x - walkSpeed <= blocker.position.x + blocker.width && walker.position.x >= blocker.position.x + blocker.width - walkSpeed*2);
  }
}

export const isStacked = (top, bottom) => { // Are the characters stacked?
  let verticalAlignment = Math.abs((top.position.y + top.height) - bottom.position.y) < 1;
  let leftEdge = top.position.x > bottom.position.x && top.position.x < bottom.position.x + bottom.width;
  let rightEdge = top.position.x + top.width > bottom.position.x && top.position.x + top.width < bottom.position.x + bottom.width;
  let xAlignment = top.width === bottom.width && top.position.x === bottom.position.x;
  return verticalAlignment && (leftEdge || rightEdge || xAlignment);
}

export const stackSnap = (faller, blocker) => { // if a faller is going to land on a blocker snap the faller to the blocker
  let snapTolerance = 10;
  let leftEdge = faller.position.x > blocker.position.x && faller.position.x < blocker.position.x + blocker.width;
  let rightEdge = faller.position.x + faller.width > blocker.position.x && faller.position.x + faller.width < blocker.position.x + blocker.width;
  if (Math.abs(faller.position.y + faller.height - blocker.position.y) < snapTolerance && (leftEdge || rightEdge)) {
    faller.position.y = blocker.position.y - faller.height;
    faller.velocity.y = 0;
  }
}

export const isClearVirtically = (spriteOne, spriteTwo) => {
  return spriteOne.position.y + spriteOne.height <= spriteTwo.position.y ||
  spriteOne.position.y >= spriteTwo.position.y + spriteTwo.height;
}

// This works but really shouldn't? should be using sprite's height aginst hitBox height/elevation?
export const punchBoxesShareElevation = (hit, hitter) => {
  return ((hit.punchBox.position.y > hitter.punchBox.position.y && // Top edge of box falls within second box
          hit.punchBox.position.y < hitter.punchBox.position.y + hitter.punchBox.height) ||
          (hit.punchBox.position.y + hit.punchBox.height >= hitter.punchBox.position.y && // Bottom edge of box falls within second box
          hit.punchBox.position.y + hit.punchBox.height <= hitter.punchBox.position.y + hitter.punchBox.height));
}

export const canFall = (faller, blocker) => {
  return isClearVirtically(faller, blocker) || (faller.position.x + faller.width <= blocker.position.x ||
  faller.position.x >= blocker.position.x + blocker.width);
}

export const calculateResults = (player, enemy, resultsBanner, matchResults) => {
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
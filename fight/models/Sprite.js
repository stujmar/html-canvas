export class Sprite {
  constructor({position, color, context, facing, gravity, ground, velocity}) {
    this.c = context;
    this.color = color;
    this.gravity = gravity
    this.ground = ground;
    this.height = 150;
    this.width = 50;
    this.position = position;
    this.punchBox = {
      position: this.position,
      width: 100,
      height: 50,
      offSetX: 0,
      offSetY: 0,
    }
    this.isPunching = false;
    this.isKicking = false;
    this.velocity = velocity;
    this.lastKey;
    this.isDucked = false;
    this.facing = facing;
  }

  punch() {
    this.isPunching = true;
    setTimeout(() => {
      this.isPunching = false;
    }, 100);
  }

  kick() {
    this.isKicking = true;
  }

  hit(direction) {
    let knockBack = direction === "right" ? 18 : -18;
    this.velocity.y = -3;
    this.velocity.x = knockBack;
    setTimeout(() => {
      this.velocity.x = 0;
    }, 500);
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
    let attackDirection = this.facing === "right" ? this.punchBox.position.x : this.punchBox.position.x - this.width;
    if (this.isPunching) {
      this.c.fillStyle = "yellowgreen";
      this.c.fillRect(attackDirection, this.punchBox.position.y, this.punchBox.width, this.punchBox.height);
    }
    this.c.fillStyle = this.color;
    this.c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw()
    this.velocity.y += this.gravity;
    this.position.x += this.velocity.x;
    this.position.x += this.velocity.x;
      if (this.position.y + this.height + this.velocity.y <= this.ground) { // If the sprite above the ground fall.
        this.position.y += this.velocity.y;
      } else { // If the sprite is near the ground, snap to ground.
        this.position.y = this.ground - this.height;
      }
  }

}

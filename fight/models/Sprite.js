export class Sprite {
  constructor({position, color, context, facing, gravity, ground, velocity}) {
    this.c = context;
    this.color = color;
    this.gravity = gravity
    this.ground = ground;
    this.height = 150;
    this.width = 50;
    this.position = position;
    this.attackBox = {
      position: this.position,
      width: 100,
      height: 50
    }
    this.velocity = velocity;
    this.lastKey;
    this.isDucked = false;
    this.facing = facing;
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
    this.c.fillStyle = this.color;
    this.c.fillRect(this.position.x, this.position.y, this.width, this.height);
    let attackDirection = this.facing === "right" ? this.attackBox.position.x : this.attackBox.position.x - this.width;
    this.c.fillRect(attackDirection, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
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

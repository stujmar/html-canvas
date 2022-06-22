export class Fighter {
  constructor({position, color, context, dimensions, facing, gravity, ground, velocity}) {
    this.c = context;
    this.color = color;
    this.gravity = gravity
    this.ground = ground;
    this.height = dimensions.height;
    this.width = dimensions.width;
    this.position = position;
    this.punchBox = {
      position: this.position,
      width: 100,
      height: 50,
      offSetX: 0,
      offSetY: 0,
      knockBack: 30,
    }
    this.isPunching = false;
    this.isKicking = false;
    this.velocity = velocity;
    this.health = 100;
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
    this.health -= 5;
    let knockBack = direction === "right" ? this.punchBox.knockBack : -this.punchBox.knockBack;
    this.velocity.y = -3;
    this.velocity.x = knockBack;
    setTimeout(() => {
      this.velocity.x = 0;
    }, 500);
  }

  duck() {
    if (!this.isDucked) {
      this.height -= 50;
      this.position.y += 50;
      this.isDucked = true;
    } else {
      this.height += 50;
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

  update(canFall) {
    this.draw()
    // walking
    this.position.x += this.velocity.x;
    this.position.x += this.velocity.x;

    // if (this.position.y + this.height < this.ground) {
    //   this.velocity.y += this.gravity;
    //   console.log("test")
    //   this.position.y += this.velocity.y;
    // } else {
    //   console.log("hit", this.velocity, this.position)
    //   this.velocity.y = 0;
    // }

    if (this.position.y + this.height + this.velocity.y <= this.ground && canFall) { // If the sprite above the ground fall.
      this.velocity.y += this.gravity;
      this.position.y += this.velocity.y;
    } else if (canFall) { // If the sprite is near the ground, snap to ground.
      this.position.y = this.ground - this.height;
      this.velocity.y = 0;
    } else { // land on opponent?
      // this.velocity.y = 0;
    }
  }

}

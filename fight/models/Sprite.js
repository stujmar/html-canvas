export class Sprite {
  constructor({position, dimensions, imgSource, context}) {
    this.imageSource = imgSource;
    this.height = dimensions.width;
    this.width = dimensions.height;
    this.position = position;
    this.context = context;
  }

  draw(context) {
    const spriteImg = new Image()
    spriteImg.onload = function() {
      console.log(this.position)
      context.drawImage(spriteImg, this.position.x, this.position.y);
    }
    spriteImg.src = this.imageSource;
  }


  update(context) {
    this.draw(context)
  }

}

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
      context.drawImage(spriteImg, 0, 0);
    }
    spriteImg.src = this.imageSource;
  }


  update(context) {
    this.draw(context)
  }

}

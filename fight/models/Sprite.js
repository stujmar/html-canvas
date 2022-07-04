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
    let _position = this.position;
    spriteImg.onload = function() {

      context.drawImage(spriteImg, _position.x, _position.y);
    }
    spriteImg.src = this.imageSource;
  }


  update(context) {
    this.draw(context)
  }

}

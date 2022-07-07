export class Sprite {
  constructor({position, dimensions, imgSource, context}) {
    this.imageSource = imgSource;
    this.dimensions = dimensions;
    this.height = dimensions.width;
    this.width = dimensions.height;
    this.position = position;
    this.context = context;
  }

  draw(context, fighters=false) {
    const spriteImg = new Image()
    let _position = this.position;
    let _dimensions = this.dimensions;
    spriteImg.onload = function() {
      context.drawImage(spriteImg, _position.x, _position.y, _dimensions.width, _dimensions.height);
    }
    // console.log('drawing sprite');
    spriteImg.src = this.imageSource;
  }


  update(context, fighters) {
    this.draw(context, fighters)
  }

}

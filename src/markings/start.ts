import { angle } from "../math/utils";
import { Point } from "../primitives";
import Marking from "./marking";

class Start extends Marking {
  img: HTMLImageElement;
  constructor(
    center: Point,
    directionVector: Point,
    width: number,
    height: number
  ) {
    super(center, directionVector, width, height);
    this.img = new Image();
    this.img.src = "car.png";
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(angle(this.directionVector) - Math.PI / 2);

    ctx.drawImage(this.img, -this.img.width * 0.5, -this.img.height * 0.5);
    ctx.restore();
  }
}
export default Start;

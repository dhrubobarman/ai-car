import { Segment, Point } from "../primitives";
import { angle, translate } from "../math/utils";
import { Envelope, Polygon } from "../primitives";

class Marking {
  center: Point;
  directionVector: Point;
  width: number;
  height: number;
  support: Segment;
  poly: Polygon;
  constructor(
    center: Point,
    directionVector: Point,
    width: number,
    height: number
  ) {
    this.center = center;
    this.directionVector = directionVector;
    this.width = width;
    this.height = height;

    this.support = new Segment(
      translate(center, angle(directionVector), height / 2),
      translate(center, angle(directionVector), -height / 2)
    );
    this.poly = new Envelope(this.support, width, 0).poly;
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.poly.draw(ctx);
  }
}
export default Marking;

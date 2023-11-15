import { add, perpendicular, scale } from "../math/utils";
import { Point, Segment } from "../primitives";
import Marking from "./marking";

class Crossing extends Marking {
  borders: Segment[];
  constructor(
    center: Point,
    directionVector: Point,
    width: number,
    height: number
  ) {
    super(center, directionVector, width, height);
    this.borders = [this.poly.segments[0], this.poly.segments[2]];
  }

  draw(ctx: CanvasRenderingContext2D) {
    const perp = perpendicular(this.directionVector);
    const line = new Segment(
      add(this.center, scale(perp, this.width / 2)),
      add(this.center, scale(perp, -this.width / 2))
    );
    line.draw(ctx, {
      lineWidth: this.height,
      strokeStyle: "white",
      setLineDash: [11, 11],
    });
  }
}
export default Crossing;

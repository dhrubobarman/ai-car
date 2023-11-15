import { Segment, Point } from "../primitives";
import { angle, translate } from "../math/utils";
import { Envelope, Polygon } from "../primitives";

class Stop {
  center: Point;
  directionVector: Point;
  width: number;
  height: number;
  support: Segment;
  poly: Polygon;
  border: Segment;
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
    this.border = this.poly.segments[2];
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.border.draw(ctx, {
      lineWidth: 5,
      fillStyle: "white",
      strokeStyle: "white",
    });
    // this.poly.draw(ctx);
    ctx.save();
    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(angle(this.directionVector) - Math.PI / 2);
    ctx.scale(1, 3);

    ctx.beginPath();
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = `bold ${this.height * 0.3}px Arial`;
    ctx.fillText("STOP", 0, 1);
    ctx.restore();
  }
}
export default Stop;

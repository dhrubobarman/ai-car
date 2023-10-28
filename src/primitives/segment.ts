import { distance, normalize, subtract } from "../math/utils";
import Point from "src/primitives/point";
import { TDrawProps } from "src/types";

class Segment {
  p1: Point;
  p2: Point;
  constructor(p1: Point, p2: Point) {
    this.p1 = p1;
    this.p2 = p2;
  }

  equals(segment: Segment) {
    return this.includes(segment.p1) && this.includes(segment.p2);
  }

  includes(point: Point) {
    return this.p1.equals(point) || this.p2.equals(point);
  }

  length() {
    return distance(this.p1, this.p2);
  }

  directionVector() {
    return normalize(subtract(this.p2, this.p1));
  }

  draw(ctx: CanvasRenderingContext2D, otherProps: Partial<TDrawProps> = {}) {
    const {
      lineWidth = 2,
      strokeStyle = "black",
      setLineDash = [],
      fillStyle,
    } = otherProps;

    ctx.beginPath();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    fillStyle ? (ctx.fillStyle = fillStyle) : null;

    ctx.setLineDash(setLineDash);
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
    fillStyle ? ctx.fill() : null;
    ctx.setLineDash([]);
  }
}

export default Segment;

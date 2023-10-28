import type { TPoint } from "src/types";

class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  equals(point: TPoint) {
    return this.x === point.x && this.y === point.y;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    otherProps: {
      size?: number;
      color?: string;
      outline?: boolean;
      fill?: boolean;
    } = {}
  ) {
    const {
      size = 18,
      color = "black",
      outline = false,
      fill = false,
    } = otherProps;
    const rad = size / 2;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(this.x, this.y, rad, 0, Math.PI * 2);
    ctx.fill();
    if (outline) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.arc(this.x, this.y, rad, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (fill) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, rad * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = "yellow";
      ctx.fill();
    }
  }
}

export default Point;

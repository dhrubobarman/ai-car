import Polygon from "../primitives/polygon";
import { add, scale, subtract, lerp2d, lerp, translate } from "../math/utils";
import Point from "../primitives/point";

class Tree {
  center: Point;
  size: number;
  heightCoef: number;
  base: Polygon;
  constructor(center: Point, size: number, heightCoef = 0.3) {
    this.center = center;
    this.size = size;
    this.heightCoef = heightCoef;
    this.base = this.generateLevel(this.center, this.size);
  }

  private generateLevel(point: Point, size: number) {
    const points = [];
    const radius = size / 2;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
      const random = Math.cos(((a + this.center.x) * size) % 17) ** 2;
      const noisyRadius = radius * lerp(0.5, 1, random);
      points.push(translate(point, a, noisyRadius));
    }
    return new Polygon(points);
  }

  draw(ctx: CanvasRenderingContext2D, viewPoint: Point) {
    const diff = subtract(this.center, viewPoint);
    const top = add(this.center, scale(diff, this.heightCoef));

    const levelCount = 7;
    for (let level = 0; level < levelCount; level++) {
      const t = Math.max(level, 1) / Math.max(levelCount - 1, 1);
      //   const t = level / (levelCount - 1);
      const point = lerp2d(this.center, top, t);
      const color = `rgb(30, ${lerp(50, 200, t)}, 70)`;
      const size = lerp(this.size, 40, t);
      const poly = this.generateLevel(point, size);
      poly.draw(ctx, { fillStyle: color, strokeStyle: "rgba(0,0,0,0)" });
    }
  }
}

export default Tree;

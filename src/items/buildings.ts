import { add, scale, subtract } from "../math/utils";
import Point from "../primitives/point";
import Polygon from "../primitives/polygon";

class Building {
  base: Polygon;
  heightCoef: number;
  constructor(base: Polygon, heightCoef = 0.4) {
    this.base = base;
    this.heightCoef = heightCoef;
  }

  draw(ctx: CanvasRenderingContext2D, viewPoint: Point) {
    const topPoints = this.base.points.map((p) =>
      add(p, scale(subtract(p, viewPoint), this.heightCoef))
    );
    const ceiling = new Polygon(topPoints);

    const sides = [];
    for (let i = 0; i < this.base.points.length; i++) {
      const nextI = (i + 1) % this.base.points.length;
      const poly = new Polygon([
        this.base.points[i],
        this.base.points[nextI],
        topPoints[nextI],
        topPoints[i],
      ]);
      sides.push(poly);
    }
    this.base.draw(ctx, { fillStyle: "white", strokeStyle: "#AAA" });
    sides.sort(
      (a, b) => b.distanceToPoint(viewPoint) - a.distanceToPoint(viewPoint)
    );
    for (const side of sides) {
      side.draw(ctx, { fillStyle: "white", strokeStyle: "#AAA" });
    }
    ceiling.draw(ctx, { fillStyle: "white", strokeStyle: "#AAA" });
  }
}

export default Building;

import { TMarkings } from "./editors/types";
import { Building, Tree } from "./items";
import Graph from "./math/graph";
import { add, distance, lerp, scale } from "./math/utils";
import { Envelope, Point, Polygon, Segment } from "./primitives";

class World {
  graph: Graph;
  roadWidth: number;
  roadRoundness: number;
  envelopes: Envelope[];
  intersections: any;
  roadBorders: Segment[];
  buildingWidth: number;
  buildingMinLength: number;
  spacing: number;
  buildings: Building[];
  trees: Tree[];
  treeSize: number;
  laneGuides: Segment[];
  markings: TMarkings[];
  constructor(
    graph: Graph,
    roadWidth = 100,
    roadRoundness = 10,
    buildingWidth = 150,
    buildingMinLength = 150,
    spacing = 50,
    treeSize = 160
  ) {
    this.graph = graph;
    this.roadWidth = roadWidth;
    this.roadRoundness = roadRoundness;
    this.buildingWidth = buildingWidth;
    this.buildingMinLength = buildingMinLength;
    this.spacing = spacing;
    this.treeSize = treeSize;

    this.envelopes = [];
    this.roadBorders = [];
    this.buildings = [];
    this.trees = [];
    this.laneGuides = [];

    this.markings = [];

    this.generate();
  }

  generate() {
    this.envelopes.length = 0;
    for (const seg of this.graph.segments) {
      this.envelopes.push(
        new Envelope(seg, this.roadWidth, this.roadRoundness)
      );
    }
    this.roadBorders = Polygon.union(this.envelopes.map((e) => e.poly));
    this.buildings = this.generateBuildings();
    this.trees = this.generateTrees();

    this.laneGuides.length = 0;
    this.laneGuides = this.generateLaneGuides();
  }

  private generateLaneGuides() {
    const tempEnvelopes: Envelope[] = [];
    for (const seg of this.graph.segments) {
      tempEnvelopes.push(
        new Envelope(seg, this.roadWidth / 2, this.roadRoundness)
      );
    }
    const segments = Polygon.union(tempEnvelopes.map((e) => e.poly));
    return segments;
  }

  private generateTrees() {
    const points = [
      ...this.roadBorders.map((s) => [s.p1, s.p2]).flat(),
      ...this.buildings.map((b) => b.base.points).flat(),
    ];

    const left = Math.min(...points.map((p) => p.x));
    const right = Math.max(...points.map((p) => p.x));
    const top = Math.min(...points.map((p) => p.y));
    const bottom = Math.max(...points.map((p) => p.y));

    const illigalPolys = [
      ...this.buildings.map((b) => b.base),
      ...this.envelopes.map((e) => e.poly),
    ];

    const trees: Tree[] = [];
    let tryCount = 0;
    while (tryCount < 100) {
      const p = new Point(
        lerp(left, right, Math.random()),
        lerp(bottom, top, Math.random())
      );

      // Check if the tree inside or nearby building / road
      let keep = true;
      for (const poly of illigalPolys) {
        if (poly.containsPoint(p) || poly.distanceToPoint(p) < this.treeSize) {
          keep = false;
          break;
        }
      }

      // Check if too close to other trees
      if (keep) {
        for (const tree of trees) {
          if (distance(tree.center, p) < this.treeSize) {
            keep = false;
            break;
          }
        }
      }

      // Avoiding trees in the middle of nowhere
      if (keep) {
        let closeToSomething = false;
        for (const poly of illigalPolys) {
          if (poly.distanceToPoint(p) < this.treeSize * 2) {
            closeToSomething = true;
            break;
          }
        }
        keep = closeToSomething;
      }
      if (keep) {
        trees.push(new Tree(p, this.treeSize));
        tryCount = 0;
      }
      tryCount++;
    }
    return trees;
  }

  private generateBuildings() {
    const tempEnvelopes: Envelope[] = [];
    for (const seg of this.graph.segments) {
      tempEnvelopes.push(
        new Envelope(
          seg,
          this.roadWidth + this.buildingWidth + this.spacing * 2,
          this.roadRoundness
        )
      );
    }

    const tempGuides = Polygon.union(tempEnvelopes.map((e) => e.poly));
    let guides = [];

    for (let i = 0; i < tempGuides.length; i++) {
      const seg = tempGuides[i];
      if (seg.length() < this.buildingMinLength) continue;
      guides.push(seg);
    }

    const supports = [];
    for (let seg of guides) {
      const len = seg.length() + this.spacing;
      const buildingCount = Math.floor(
        len / (this.buildingMinLength + this.spacing)
      );
      const buildingLength = len / buildingCount - this.spacing;
      const dir = seg.directionVector();

      let q1 = seg.p1;
      let q2 = add(q1, scale(dir, buildingLength));
      supports.push(new Segment(q1, q2));

      for (let i = 2; i <= buildingCount; i++) {
        q1 = add(q2, scale(dir, this.spacing));
        q2 = add(q1, scale(dir, buildingLength));
        supports.push(new Segment(q1, q2));
      }
    }

    const bases: Polygon[] = [];
    for (const seg of supports) {
      bases.push(new Envelope(seg, this.buildingWidth).poly);
    }

    const eps = 0.001;
    for (let i = 0; i < bases.length - 1; i++) {
      for (let j = i + 1; j < bases.length; j++) {
        if (
          bases[i].intersectsPoly(bases[j]) ||
          bases[i].distanceToPoly(bases[j]) < this.spacing - eps
        ) {
          bases.splice(j, 1);
          j--;
        }
      }
    }

    return bases.map((b) => new Building(b));
  }

  draw(ctx: CanvasRenderingContext2D, viewPoint: Point) {
    for (const envelope of this.envelopes) {
      envelope.draw(ctx, {
        fillStyle: "#BBB",
        strokeStyle: "#BBB",
        lineWidth: 15,
      });
    }
    for (const marking of this.markings) {
      marking.draw(ctx);
    }
    for (const seg of this.graph.segments) {
      seg.draw(ctx, {
        strokeStyle: "white",
        lineWidth: 4,
        setLineDash: [10, 10],
      });
    }
    for (const seg of this.roadBorders) {
      seg.draw(ctx, { strokeStyle: "white", lineWidth: 4 });
    }
    const items = [...this.buildings, ...this.trees].sort(
      (a, b) =>
        b.base.distanceToPoint(viewPoint) - a.base.distanceToPoint(viewPoint)
    );
    for (const item of items) {
      item.draw(ctx, viewPoint);
    }
  }
}

export default World;

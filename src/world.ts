import Graph from "./math/graph";
import { add, scale } from "./math/utils";
import Envelope from "./primitives/envelope";
import Polygon from "./primitives/polygon";
import Segment from "./primitives/segment";

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
  buildings: Segment[];
  constructor(
    graph: Graph,
    roadWidth = 100,
    roadRoundness = 10,
    buildingWidth = 150,
    buildingMinLength = 150,
    spacing = 50
  ) {
    this.graph = graph;
    this.roadWidth = roadWidth;
    this.roadRoundness = roadRoundness;
    this.buildingWidth = buildingWidth;
    this.buildingMinLength = buildingMinLength;
    this.spacing = spacing;

    this.envelopes = [];
    this.roadBorders = [];
    this.buildings = [];

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
    for (let i = 0; i < bases.length - 1; i++) {
      for (let j = i + 1; j < bases.length; j++) {
        if (bases[i].intersectsPoly(bases[j])) {
          bases.splice(j, 1);
          j--;
        }
      }
    }

    return bases;
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const envelope of this.envelopes) {
      envelope.draw(ctx, {
        fillStyle: "#BBB",
        strokeStyle: "#BBB",
        lineWidth: 15,
      });
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
    for (const bld of this.buildings) {
      bld.draw(ctx);
    }
  }
}

export default World;

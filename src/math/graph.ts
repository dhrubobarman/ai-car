import Point from "../primitives/point";
import Segment from "../primitives/segment";
import type { TGraphInfo } from "../types";

class Graph {
  points: Point[];
  segments: Segment[];

  constructor(points: Point[] = [], segments: Segment[] = []) {
    this.points = points;
    this.segments = segments;
  }

  hash() {
    return JSON.stringify(this);
  }

  static load(info: TGraphInfo) {
    const points = [];
    const segments = [];

    for (const pointInfo of info.points) {
      points.push(new Point(pointInfo.x, pointInfo.y));
    }
    for (const segInfo of info.segments) {
      segments.push(
        new Segment(
          points.find((p) => p.equals(segInfo.p1))!,
          points.find((p) => p.equals(segInfo.p2))!
        )
      );
    }
    return new Graph(points, segments);
  }

  addPoint(point: Point) {
    this.points.push(point);
  }

  containsPoint(point: Point) {
    for (const p of this.points) {
      if (p.equals(point)) return true;
    }
    return false;
  }

  tryAddPoint(point: Point) {
    if (!this.containsPoint(point)) {
      this.addPoint(point);
      return true;
    }
    return false;
  }

  addSegment(seg: Segment) {
    this.segments.push(seg);
  }

  containsSegment(seg: Segment) {
    for (const segment of this.segments) {
      if (segment.equals(seg)) return true;
    }
    return false;
  }

  tryAddSegment(seg: Segment) {
    if (!this.containsSegment(seg)) {
      this.addSegment(seg);
      return true;
    }
    return false;
  }

  removeSegment(seg: Segment) {
    this.segments.splice(this.segments.indexOf(seg), 1);
  }
  removePoint(point: Point) {
    const segs = this.getSegmentsWithPoint(point);
    for (const seg of segs) {
      this.removeSegment(seg);
    }
    this.points.splice(this.points.indexOf(point), 1);
  }

  getSegmentsWithPoint(point: Point) {
    const segs: Segment[] = [];
    for (const seg of this.segments) {
      if (seg.includes(point)) {
        segs.push(seg);
      }
    }
    return segs;
  }

  dispose() {
    this.points.length = 0;
    this.segments.length = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].draw(ctx);
    }
    for (let i = 0; i < this.segments.length; i++) {
      this.segments[i].draw(ctx);
    }
  }
}

export default Graph;

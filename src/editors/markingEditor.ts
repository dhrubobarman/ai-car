import { MOUSE_CLICK_THRESHOD } from "../constants";
import { getNearestSegment } from "../math";
import { Point, Segment } from "../primitives";
import { Crossing, Stop } from "../markings";
import Viewport from "../veiwport";
import World from "../world";
import { TMarkings } from "./types";

class MarkingEditor {
  viewPort: Viewport;
  world: World;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mouse: null | Point;
  intent: TMarkings;
  markings: TMarkings[];
  targetSegments: Segment[];

  boundMouseDown: (e: MouseEvent) => void;
  boundMouseMove: (e: MouseEvent) => void;
  boundContextMenu: (e: any) => any;

  constructor(viewPort: Viewport, world: World, targetSegments: Segment[]) {
    this.viewPort = viewPort;
    this.world = world;
    this.canvas = this.viewPort.canvas;
    this.ctx = this.viewPort.ctx;
    this.mouse = null;
    this.intent = null;
    this.markings = world.markings;
    this.targetSegments = targetSegments;

    this.boundMouseDown = () => {};
    this.boundMouseMove = () => {};
    this.boundContextMenu = () => {};
  }

  // to be overwritten
  createMarking(center: Point, directionVector: Point): Stop | Crossing {
    return new Stop(
      center,
      directionVector,
      this.world.roadWidth / 2,
      this.world.roadWidth / 2
    );
  }

  enable() {
    this.addEventListeners();
  }
  disable() {
    this.removeEventListeners();
  }

  private addEventListeners() {
    this.boundMouseDown = this.handleMouseDown.bind(this);
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundContextMenu = (e) => e.preventDefault();
    this.canvas.addEventListener("mousedown", this.boundMouseDown);
    this.canvas.addEventListener("mousemove", this.boundMouseMove);
    this.canvas.addEventListener("contextmenu", this.boundContextMenu);
  }

  private removeEventListeners() {
    this.canvas.removeEventListener("mousedown", this.boundMouseDown);
    this.canvas.removeEventListener("mousemove", this.boundMouseMove);
    this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
  }

  private handleMouseMove(e: MouseEvent) {
    this.mouse = this.viewPort.getMouse(e, true);
    const seg = getNearestSegment(
      this.mouse,
      this.targetSegments,
      MOUSE_CLICK_THRESHOD * this.viewPort.zoom
    );
    if (seg) {
      const proj = seg.projectPoint(this.mouse);
      if (proj.offset >= 0 && proj.offset <= 1) {
        this.intent = this.createMarking(proj.point, seg.directionVector());
      } else {
        this.intent = null;
      }
    } else {
      this.intent = null;
    }
  }
  private handleMouseDown(e: MouseEvent) {
    // Left Click
    if (e.button === 0) {
      if (this.intent) {
        this.markings.push(this.intent);
        this.intent = null;
      }
    }
    if (e.button === 2) {
      for (let i = 0; i < this.markings.length; i++) {
        const poly = this.markings[i].poly;
        if (!this.mouse) return;
        if (poly.containsPoint(this.mouse)) {
          this.markings.splice(i, 1);
          return;
        }
      }
    }
  }
  display() {
    if (this.intent) {
      this.intent.draw(this.ctx);
    }
  }
}

export default MarkingEditor;

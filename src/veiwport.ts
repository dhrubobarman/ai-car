import { add, scale, subtract } from "./math/utils";
import Point from "./primitives/point";

class Viewport {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  zoom: number;
  offset: Point;
  drag: { start: Point; end: Point; offset: Point; active: boolean };
  center: Point;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;

    this.zoom = 1;
    this.center = new Point(canvas.width / 2, canvas.height / 2);
    this.offset = scale(this.center, -1);

    this.drag = {
      start: new Point(0, 0),
      end: new Point(0, 0),
      offset: new Point(0, 0),
      active: false,
    };

    this.addEventListeners();
  }

  getMouse(e: MouseEvent, subractDragOffset = false) {
    const p = new Point(
      (e.offsetX - this.center.x) * this.zoom - this.offset.x,
      (e.offsetY - this.center.y) * this.zoom - this.offset.y
    );
    return subractDragOffset ? subtract(p, this.drag.offset) : p;
  }

  reset() {
    this.ctx.restore();
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.center.x, this.center.y);
    this.ctx.scale(1 / this.zoom, 1 / this.zoom);
    const offset = this.getOffset();
    this.ctx.translate(offset.x, offset.y);
  }

  getOffset() {
    return add(this.offset, this.drag.offset);
  }

  private addEventListeners() {
    this.canvas.addEventListener("wheel", this.handleMouseWheel.bind(this));
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }
  private handleMouseDown(e: MouseEvent) {
    if (e.button === 1) {
      // middle button
      this.drag.start = this.getMouse(e);
      this.drag.active = true;
    }
  }
  private handleMouseMove(e: MouseEvent) {
    if (this.drag.active) {
      this.drag.end = this.getMouse(e);
      this.drag.offset = subtract(this.drag.end, this.drag.start);
    }
  }
  private handleMouseUp() {
    if (this.drag.active) {
      this.offset = add(this.offset, this.drag.offset);
      this.drag = {
        start: new Point(0, 0),
        end: new Point(0, 0),
        offset: new Point(0, 0),
        active: false,
      };
    }
  }

  private handleMouseWheel(e: WheelEvent) {
    const dir = Math.sign(e.deltaY);
    const step = 0.1;
    this.zoom += dir * step;
    this.zoom = Math.max(1, Math.min(5, this.zoom));
  }
}

export default Viewport;

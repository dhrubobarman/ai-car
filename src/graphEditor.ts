import Graph from "src/math/graph";
import Point from "./primitives/point";
import { getNearestPoint } from "./math/utils";
import Segment from "./primitives/segment";
import Viewport from "./veiwport";

const MOUSE_CLICK_THRESHOD = 10;

class GraphEditor {
  canvas: HTMLCanvasElement;
  graph: Graph;
  ctx: CanvasRenderingContext2D;
  selected: null | Point;
  hovered: null | Point;
  dragging: boolean;
  mouse: null | Point;
  viewport: Viewport;

  constructor(viewport: Viewport, graph: Graph) {
    this.viewport = viewport;
    this.canvas = viewport.canvas;
    this.graph = graph;
    this.selected = null;
    this.dragging = false;
    this.mouse = null;
    this.hovered = null;
    this.ctx = this.canvas.getContext("2d")!;
    this.addEventListeners();
  }

  private addEventListeners() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", () => (this.dragging = false));
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  private handleMouseMove(e: MouseEvent) {
    this.mouse = this.viewport.getMouse(e, true);
    this.hovered = getNearestPoint(
      this.mouse,
      this.graph.points,
      MOUSE_CLICK_THRESHOD * this.viewport.zoom
    );
    if (this.dragging) {
      if (this.selected) {
        this.selected.x = this.mouse.x;
        this.selected.y = this.mouse.y;
      }
    }
  }

  private handleMouseDown(e: MouseEvent) {
    // RIGHT CLICK
    if (e.button === 2) {
      if (this.selected) {
        this.selected = null;
      } else if (this.hovered) {
        this.removePoint(this.hovered);
      } else {
        this.selected = null;
      }
    }

    // LEFT CLICK
    if (e.button === 0) {
      if (this.hovered) {
        this.selectPoint(this.hovered);
        this.dragging = true;
        return;
      }
      if (this.mouse) {
        this.graph.addPoint(this.mouse);
        this.selectPoint(this.mouse);
        this.hovered = this.mouse;
      }
    }
  }

  private selectPoint(point: Point) {
    if (this.selected) {
      this.graph.tryAddSegment(new Segment(this.selected, point));
    }
    this.selected = point;
  }

  private removePoint(point: Point) {
    this.graph.removePoint(point);
    this.hovered = null;
    if (this.selected === point) {
      this.selected = null;
    }
  }

  dispose() {
    this.graph.dispose();
    this.selected = null;
    this.hovered = null;
  }

  display() {
    this.graph.draw(this.ctx);

    if (this.hovered) {
      this.hovered.draw(this.ctx, { fill: true });
    }
    if (this.selected) {
      const intent = this.hovered ? this.hovered : this.mouse;

      new Segment(this.selected, intent!).draw(this.ctx, {
        setLineDash: [3, 3],
      });
      this.selected.draw(this.ctx, { outline: true });
    }
  }
}

export default GraphEditor;

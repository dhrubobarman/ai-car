import Point from "./primitives/point";

export type TPoint = {
  x: number;
  y: number;
};

export type TPointOrPoint = TPoint | Point;

export type TSegment = {
  p1: TPoint;
  p2: TPoint;
};

export type TGraphInfo = {
  points: TPoint[];
  segments: TSegment[];
};

export type TDrawProps = {
  lineWidth?: CanvasRenderingContext2D["lineWidth"];
  strokeStyle?: CanvasRenderingContext2D["strokeStyle"];
  setLineDash?: number[];
  fillStyle?: CanvasRenderingContext2D["fillStyle"];
  lineWidth?: CanvasRenderingContext2D["lineWidth"];
};

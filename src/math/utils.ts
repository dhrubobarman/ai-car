import Point from "../primitives/point";

export function getNearestPoint(
  loc: Point,
  points: Point[],
  threshold = Number.MAX_SAFE_INTEGER
) {
  let minDist = Number.MAX_SAFE_INTEGER;
  let nearestPoint: Point | null = null;
  for (const p of points) {
    const dist = distance(p, loc);
    if (dist < minDist && dist < threshold) {
      minDist = dist;
      nearestPoint = p;
    }
  }
  return nearestPoint;
}

export function distance(p1: Point, p2: Point) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export function average(p1: Point, p2: Point) {
  return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

export function add(p1: Point, p2: Point) {
  return new Point(p1.x + p2.x, p1.y + p2.y);
}

export function subtract(p1: Point, p2: Point) {
  return new Point(p1.x - p2.x, p1.y - p2.y);
}

export function scale(p: Point, s: number) {
  return new Point(p.x * s, p.y * s);
}

export function normalize(p: Point) {
  return scale(p, 1 / magnitude(p));
}

export function magnitude(p: Point) {
  return Math.hypot(p.x, p.y);
}

export function translate(loc: Point, angle: number, offset: number) {
  return new Point(
    loc.x + Math.cos(angle) * offset,
    loc.y + Math.sin(angle) * offset
  );
}

export function angle(p: Point) {
  return Math.atan2(p.y, p.x);
}

export function getIntersection(A: Point, B: Point, C: Point, D: Point) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  const eps = 0.001;
  if (Math.abs(bottom) > eps) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function getRandomColor() {
  const hue = 290 + Math.random() * 260;
  return "hsl(" + hue + ", 100%, 60%)";
}

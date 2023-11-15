import "./elements";
import { crossingBtn, graphBtn, stopBtn } from "./elements";
import Graph from "./math/graph";
import { scale } from "./math";
import "./style.css";
import Viewport from "./veiwport";
import World from "./world";
import { CrossingEditor, StopEditor, GraphEditor } from "./editors";

const LOCAL_STORE_NAME = "GRAPH_FROM_SELF_DRIVING_CAR";

const canvas: HTMLCanvasElement = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const graphString = localStorage.getItem(LOCAL_STORE_NAME);
const graphInfo = graphString ? JSON.parse(graphString) : null;
const graph = graphInfo ? Graph.load(graphInfo) : new Graph();

const world = new World(graph);

const viewport = new Viewport(canvas);
const graphEditor = new GraphEditor(viewport, graph);
const stopEditor = new StopEditor(viewport, world);
const crossingEditor = new CrossingEditor(viewport, world);

let oldGraphHash = graph.hash();
setMode("graph");
animate();

function animate() {
  viewport.reset();
  if (graph.hash() !== oldGraphHash) {
    world.generate();
    oldGraphHash = graph.hash();
  }
  const viewPoint = scale(viewport.getOffset(), -1);
  world.draw(ctx, viewPoint);
  ctx.globalAlpha = 0.2;
  graphEditor.display();
  stopEditor.display();
  crossingEditor.display();
  requestAnimationFrame(animate);
}

// CONTROLS
export function dispose() {
  graphEditor.dispose();
  world.markings.length = 0;
}
export function save() {
  localStorage.setItem(LOCAL_STORE_NAME, JSON.stringify(graph));
}
export function setMode(mode: "graph" | "stop" | "crossing") {
  disableEditors();

  switch (mode) {
    case "graph":
      graphBtn.disabled = true;
      graphEditor.enable();
      break;
    case "stop":
      stopBtn.disabled = true;
      stopEditor.enable();
      break;
    case "crossing":
      crossingBtn.disabled = true;
      crossingEditor.enable();
      break;
    default:
      break;
  }
}

function disableEditors() {
  graphEditor.disable();
  stopEditor.disable();
  crossingEditor.disable();
  graphBtn.disabled = false;
  stopBtn.disabled = false;
  crossingBtn.disabled = false;
}

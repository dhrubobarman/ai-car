import "./elements";
import { crossingBtn, graphBtn, startBtn, stopBtn } from "./elements";
import Graph from "./math/graph";
import { scale } from "./math";
import "./style.css";
import Viewport from "./veiwport";
import World from "./world";
import {
  CrossingEditor,
  StopEditor,
  GraphEditor,
  StartEditor,
} from "./editors";

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

const tools = {
  graph: { button: graphBtn, editor: new GraphEditor(viewport, graph) },
  stop: { button: stopBtn, editor: new StopEditor(viewport, world) },
  crossing: {
    button: crossingBtn,
    editor: new CrossingEditor(viewport, world),
  },
  start: { button: startBtn, editor: new StartEditor(viewport, world) },
};

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
  for (const tool of Object.values(tools)) {
    tool.editor.display();
  }
  requestAnimationFrame(animate);
}

// CONTROLS
export function dispose() {
  tools.graph.editor.dispose();
  world.markings.length = 0;
}
export function save() {
  localStorage.setItem(LOCAL_STORE_NAME, JSON.stringify(graph));
}
export function setMode(mode: "graph" | "stop" | "crossing" | "start") {
  disableEditors();
  tools[mode].button.disabled = true;
  tools[mode].editor.enable();
}

function disableEditors() {
  for (const tool of Object.values(tools)) {
    tool.editor.disable();
    tool.button.disabled = false;
  }
}

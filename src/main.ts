import GraphEditor from "./graphEditor";
import Graph from "./math/graph";
import "./style.css";
import Viewport from "./veiwport";
import World from "./world";

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

animate();

function animate() {
  viewport.reset();
  world.generate();
  world.draw(ctx);
  ctx.globalAlpha = 0.2;
  graphEditor.display();
  requestAnimationFrame(animate);
}

// CONTROLS
function dispose() {
  graphEditor.dispose();
}
function save() {
  localStorage.setItem(LOCAL_STORE_NAME, JSON.stringify(graph));
}

const controls = document.querySelector("#controls")!;

type TCreateElementProps = {
  element?: string;
  insertToControls?: boolean;
} & Partial<HTMLElement>;
const createElement = ({
  element = "button",
  insertToControls = true,
  ...others
}: TCreateElementProps) => {
  const elem = document.createElement(element);
  Object.assign(elem, others);
  if (insertToControls) controls.appendChild(elem);
  return elem;
};
const controlsContainer = createElement({
  element: "div",
  id: "controls-container",
  className:
    "flex absolute bottom-0 left-0 right-0 justify-center items-center min-h-[20px] gap-2",
});

const disposeButton = createElement({
  insertToControls: false,
  innerText: "🗑️",
  onclick: dispose,
});
const saveButton = createElement({
  insertToControls: false,
  innerText: "💾",
  onclick: save,
});
const controlClids = [disposeButton, saveButton];
for (const clild of controlClids) {
  controlsContainer.appendChild(clild);
}

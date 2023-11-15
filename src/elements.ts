import { dispose, save, setMode } from "./main";

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

export const disposeButton = createElement({
  insertToControls: false,
  innerText: "🗑️",
  onclick: dispose,
  className: " shadow-sm bg-[var(--background)] icon-button",
  title: "Delete All",
  type: "button",
}) as HTMLButtonElement;

export const saveButton = createElement({
  insertToControls: false,
  innerText: "💾",
  onclick: save,
  className: " shadow-md bg-[var(--background)] icon-button",
  title: "Save Current Map",
  type: "button",
}) as HTMLButtonElement;

export const graphBtn = createElement({
  insertToControls: false,
  innerText: "🌐",
  id: "graphBtn",
  onclick: () => setMode("graph"),
  className: " shadow-md bg-[var(--background)] icon-button",
  title: "Graph Mode",
  type: "button",
}) as HTMLButtonElement;

export const stopBtn = createElement({
  insertToControls: false,
  innerText: "🛑",
  id: "stopBtn",
  onclick: () => setMode("stop"),
  className: " shadow-md bg-[var(--background)] icon-button",
  title: "Stop Mode",
  type: "button",
}) as HTMLButtonElement;

export const crossingBtn = createElement({
  insertToControls: false,
  innerText: "🚶",
  id: "stopBtn",
  onclick: () => setMode("crossing"),
  className: " shadow-md bg-[var(--background)] icon-button",
  title: "Crossing Mode",
  type: "button",
}) as HTMLButtonElement;

const controlClids = [
  disposeButton,
  saveButton,
  graphBtn,
  stopBtn,
  crossingBtn,
];
for (const clild of controlClids) {
  controlsContainer.appendChild(clild);
}

import Viewport from "../veiwport";
import MarkingEditor from "./markingEditor";
import World from "../world";
import { Start } from "../markings";
import { Point } from "../primitives";

class StartEditor extends MarkingEditor {
  constructor(viewPort: Viewport, world: World) {
    super(viewPort, world, world.graph.segments);
  }
  createMarking(center: Point, directionVector: Point) {
    return new Start(
      center,
      directionVector,
      this.world.roadWidth,
      this.world.roadWidth / 2
    );
  }
}

export default StartEditor;

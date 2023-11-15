import Viewport from "../veiwport";
import World from "../world";
import { Crossing } from "../markings";
import { Point } from "../primitives";
import MarkingEditor from "./markingEditor";

class CrossingEditor extends MarkingEditor {
  constructor(viewPort: Viewport, world: World) {
    super(viewPort, world, world.graph.segments);
  }
  createMarking(center: Point, directionVector: Point) {
    return new Crossing(
      center,
      directionVector,
      this.world.roadWidth,
      this.world.roadWidth / 2
    );
  }
}
export default CrossingEditor;

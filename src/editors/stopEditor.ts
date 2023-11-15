import { Point } from "src/primitives";
import Viewport from "../veiwport";
import World from "../world";
import MarkingEditor from "./markingEditor";
import { Stop } from "../markings";

class StopEditor extends MarkingEditor {
  constructor(viewPort: Viewport, world: World) {
    super(viewPort, world, world.laneGuides);
  }
  createMarking(center: Point, directionVector: Point) {
    return new Stop(
      center,
      directionVector,
      this.world.roadWidth / 2,
      this.world.roadWidth / 2
    );
  }
}

export default StopEditor;

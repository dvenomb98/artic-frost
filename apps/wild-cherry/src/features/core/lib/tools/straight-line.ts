import {Minus} from "lucide-react";
import {drawInitShape, drawStraightLine} from "../draw";
import {temp} from "./temp";
import {shapeManager} from "./shapes";
import {Tool, ToolHandler} from "./types";

const STRAIGHT_LINE = {
  id: "STRAIGHT_LINE",
  icon: Minus,
  handler: {
    onMouseDown: (ctx, point) => {
      drawInitShape(ctx, point);
      temp.create(ctx, point);
      shapeManager.create({points: [[point.x, point.y]]});
    },
    onMouseMove: (_, point) => {
      const {startPoint, tempCtx} = temp.get();
      tempCtx.clearRect(0, 0, tempCtx.canvas.width, tempCtx.canvas.height);
      drawStraightLine(tempCtx, startPoint, point);
    },
    onMouseUp: (ctx, point, addShape) => {
      const {startPoint} = temp.get();
      const {x, y} = point;

      drawStraightLine(ctx, startPoint, point);

      shapeManager.addPoint([x, y]);
      addShape(shapeManager.get());
      temp.clear();
      shapeManager.clear();
    },
    onMouseLeave: (ctx, point, addShape) => {
      const {startPoint} = temp.get();
      const {x, y} = point;

      drawStraightLine(ctx, startPoint, point);

      shapeManager.addPoint([x, y]);
      addShape(shapeManager.get());
      temp.clear();
      shapeManager.clear();
    },
  } satisfies ToolHandler,
} satisfies Tool<StraightLineId>;

type StraightLineId = "STRAIGHT_LINE";

export {STRAIGHT_LINE, type StraightLineId};

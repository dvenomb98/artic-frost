import {Circle} from "lucide-react";
import {Tool, ToolHandler} from "./types";
import {temp} from "./temp";
import {drawCircle} from "../draw";
import {shapeManager} from "./shapes";

const CIRCLE_SHAPE = {
  id: "CIRCLE_SHAPE",
  icon: Circle,
  handler: {
    onMouseDown: (ctx, point) => {
      temp.create(ctx, point);
      shapeManager.create({points: [[point.x, point.y]]});
    },
    onMouseMove: (_, point) => {
      const {tempCtx, startPoint} = temp.get();
      tempCtx.clearRect(0, 0, tempCtx.canvas.width, tempCtx.canvas.height);
      drawCircle(tempCtx, startPoint, point);
    },
    onMouseUp: (ctx, point, manageShape) => {
      const {startPoint} = temp.get();
      drawCircle(ctx, startPoint, point);

      shapeManager.addPoint([point.x, point.y]);
      manageShape(shapeManager.get());
      temp.clear();
      shapeManager.clear();
    },
    onMouseLeave: (ctx, point, manageShape) => {
      const {startPoint} = temp.get();
      drawCircle(ctx, startPoint, point);

      shapeManager.addPoint([point.x, point.y]);
      manageShape(shapeManager.get());
      temp.clear();
      shapeManager.clear();
    },
  } satisfies ToolHandler,
} satisfies Tool<CircleShapeId>;

type CircleShapeId = "CIRCLE_SHAPE";

export {CIRCLE_SHAPE, type CircleShapeId};

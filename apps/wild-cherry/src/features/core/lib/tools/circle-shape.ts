import {Circle} from "lucide-react";
import {Tool, ToolHandler} from "./types";
import {temp} from "./temp";
import {drawCircle} from "./draw";

const CIRCLE_SHAPE = {
  id: "CIRCLE_SHAPE",
  icon: Circle,
  handler: {
    onMouseDown: (ctx, point) => {
      temp.create(ctx, point);
    },
    onMouseMove: (_, point) => {
      const {tempCtx, startPoint} = temp.get();
      tempCtx.clearRect(0, 0, tempCtx.canvas.width, tempCtx.canvas.height);
      drawCircle(tempCtx, startPoint, point);
    },
    onMouseUp: (ctx, point) => {
      const {startPoint} = temp.get();
      drawCircle(ctx, startPoint, point);

      temp.clear();
    },
    onMouseLeave: (ctx, point) => {
      const {startPoint} = temp.get();
      drawCircle(ctx, startPoint, point);

      temp.clear();
    },
  } satisfies ToolHandler,
} satisfies Tool<CircleShapeId>;

type CircleShapeId = "CIRCLE_SHAPE";

export {CIRCLE_SHAPE, type CircleShapeId};

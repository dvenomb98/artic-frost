import {drawRect} from "../draw";
import {temp} from "../temp";
import {Tool, ToolHandler} from "./types";
import {Square} from "lucide-react";

const SQUARE_SHAPE = {
  id: "SQUARE_SHAPE",
  icon: Square,
  handler: {
    onMouseDown: (ctx, point) => {
      temp.create(ctx, point);
    },
    onMouseMove: (_, point) => {
      const {tempCtx, startPoint} = temp.get();
      tempCtx.clearRect(0, 0, tempCtx.canvas.width, tempCtx.canvas.height);
      drawRect(tempCtx, startPoint, point);
    },
    onMouseUp: (ctx, point) => {
      const {startPoint} = temp.get();
      drawRect(ctx, startPoint, point);

      temp.clear();
    },
    onMouseLeave: (ctx, point) => {
      const {startPoint} = temp.get();
      drawRect(ctx, startPoint, point);

      temp.clear();
    },
  } satisfies ToolHandler,
} satisfies Tool<SquareShapeId>;

type SquareShapeId = "SQUARE_SHAPE";

export {SQUARE_SHAPE, type SquareShapeId};

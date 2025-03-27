import {Minus} from "lucide-react";
import {drawInitShape} from "../draw";
import {temp} from "../temp";
import {shape} from "../shapes";
import {Tool, ToolHandler} from "./types";

const STRAIGHT_LINE = {
  id: "STRAIGHT_LINE",
  icon: Minus,
  handler: {
    onMouseDown: (ctx, point) => {
      drawInitShape(ctx, point);
      temp.create(ctx, point);
      shape.create({points: [[point.x, point.y]]});
    },
    onMouseMove: (_, point) => {
      const {startPoint, tempCtx} = temp.get();
      const {x, y} = point;

      tempCtx.clearRect(0, 0, tempCtx.canvas.width, tempCtx.canvas.height);
      tempCtx.beginPath();
      tempCtx.moveTo(startPoint.x, startPoint.y);
      tempCtx.lineTo(x, y);
      tempCtx.stroke();
    },
    onMouseUp: (ctx, point, addShape) => {
      const {startPoint} = temp.get();
      const {x, y} = point;

      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();

      shape.addPoint([x, y]);
      addShape(shape.get());
      temp.clear();
      shape.clear();
    },
    onMouseLeave: (ctx, point, addShape) => {
      const {startPoint} = temp.get();
      const {x, y} = point;

      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();

      shape.addPoint([x, y]);
      addShape(shape.get());
      temp.clear();
      shape.clear();
    },
  } satisfies ToolHandler,
} satisfies Tool<StraightLineId>;

type StraightLineId = "STRAIGHT_LINE";

export {STRAIGHT_LINE, type StraightLineId};
